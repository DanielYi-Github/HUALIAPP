import { Platform, DeviceEventEmitter, NativeModules } from 'react-native';

import PushNotificationIOS from "@react-native-community/push-notification-ios";
import * as UpdateDataUtil from './UpdateDataUtil';
import * as SQLite         from './SQLiteUtil';
import DeviceStorageUtil   from './DeviceStorageUtil';
import JPush          	   from './JpushUtil';
import LoggerUtil          from './LoggerUtil';


let MessageRouter = {
    async initial (){
    	JPush.init();
    	JPush.getRegistrationID( result => console.log("registerID:", result.registerID) );
	},
	async addListeners(props, actions){
		// 接收推送通知
		JPush.addNotificationListener( async (result) => {
			// console.log("addNotificationListener", result);
			// 判斷是不是冷啟動
      		let isColdActive = await DeviceStorageUtil.get('isColdActive');
      		isColdActive = (isColdActive === 'true');

      		if (isColdActive) {
      			// 保存訊息
      			DeviceStorageUtil.set('storeNotificationMsg', result);
    			DeviceStorageUtil.set('isColdActive', false);
      		} else {
				if (result.notificationEventType == "notificationArrived"){
					this.dealMessagesOriginalsource(result, props, true);
				}else{
					JPush.setBadge({ "badge":0, "appBadge":0 });
					await this.dealMessagesOriginalsource(result, props, true);
					// 測試非自定義的消息推送
					result.extras.APPID = "Messages";
	      			actions.checkDirectorPage(result.extras);
				}
      		}
		});

		// 接收本地通知
		JPush.addLocalNotificationListener((result) => {
			// console.log("notificationArrived", result);
			if (result.notificationEventType == "notificationArrived"){
				DeviceEventEmitter.emit('loadMsgState');
			}else{
				JPush.setBadge({ "badge":0, "appBadge":0 });
			  	actions.checkDirectorPage(result.extras);
			}
		});

		//自定义消息回调
		JPush.addCustomMessagegListener((result) => {
			this.dealMessagesOriginalsource(result, props);
		});
	},
	// 處理訊息通知狀況
	async dealMessagesOriginalsource(message, props, isOriginal = false){
		let user = await DeviceStorageUtil.get('User');
		user = JSON.parse(user);

		let value = message.extras ;
		let lang  = props.Language.langStatus;
		let oid   = value.oid;

		switch(value.type) {
			/*
				apppush			null
					自定義推送
				msg 			null
					非自定義推送
				Travel
					出差天氣提醒	null
				Performance 
					打考核提醒	null
					考核成績		null
				birthday
					系統生日祝福
				birthdayMsg
					同事生日祝福 	88FA205AF0F12A17E05010ACB8006CE8
				birthdayData
					生日祝福畫面更新
				webpush			null
				Car
					派車通知		null
				Feedback
					反饋建議回復	null
			*/
			case "birthdayData":
				DeviceEventEmitter.emit('loadBirthdayDataState', JSON.stringify(message));
				DeviceEventEmitter.emit('loadMyBirthdayDataState', JSON.stringify(message));
				break;
			default:
				// 需要判斷是哪一種訊息再寫入資料庫中，後續再進行推送，需要討論
				let arr = [
					UpdateDataUtil.updateMSGByOID(user, oid, lang),
		  			UpdateDataUtil.updateEvent(user), 				//事件表				
				];

			  	await Promise.all(arr).then( async (data) => {
			  	}).catch((e)=>{
			  		LoggerUtil.addErrorLog("MessageRouter dealMessagesOriginalsource", "APP Action", "ERROR", e);
			  	})
			  		
				if (isOriginal){
					await DeviceEventEmitter.emit('loadMsgState');
				}else{
					this.emitCustomlMessage(user, oid);
				}
				break;
		}
	},
	// 處理本地化推送
	async emitCustomlMessage(user, oid){
		let id    = Math.floor((Math.random() * 100) + 1); //取隨機ID
		let index = -1;
		while (index == id) { id = Math.floor((Math.random() * 100) + 1); } //防止重複id
		index = id;

		let IsAppNotificationEnable = await this.getIsAppNotificationEnable().then(result => {
			return result;
		})

		if ( IsAppNotificationEnable && user.isPush == 'Y' ) {		
			let sql = "select * from THF_MSG where OID=? and ISPUSH='Y'";	
			let sqlResult = await SQLite.selectData(sql, [oid]).then((data) => {
				return data.raw();
			}).catch(e => {
				console.log("問題", e)
				return [];
			})

			for(let item of sqlResult){
				/*
				* 添加一个本地通知
				* @param {
					"messageID":String,
					"title":String，
					"content":String,
					"extras":{String:String}
				  }
				*
				* messageID:唯一标识通知消息的ID，可用于移除消息。
				 			android用到的是int，ios用到的是String，
							rn这边提供接口的时候统一改成了String，
							然后android拿到String转int。
							输入messageID的时候需要int值范围在[1，2147483647]然后转成String。
				* title:对应“通知标题”字段
				* content:对应“通知内容”字段
				* extras:对应“附加内容”字段
				*/
				
				JPush.addLocalNotification({
					messageID: id.toString(),
					title   : item.TITLE,
					content : item.CONTENT,
					extras : {
						oid  :oid,
						APPID:"Messages",
						type :item.TYPE,
					}
				})
			}
		}
	},
	// 添加訊息觸發的監聽器
	addMessageListener(actions){
		DeviceEventEmitter.addListener('loadMsgState',(data)=>{
		  actions.loadMessageIntoState();
		  actions.getMeetings();
		})
	},
	// 移除訊息監聽
	removeMessageListener(actions){
		// JPushModule.removeReceiveCustomMsgListener();
		// JPushModule.removeReceiveNotificationListener();
		// JPush.removeLocalNotification();
		// JPush.removeListener();
	},
	// 判斷應用是否啟用ＡＰＰ通知功能
	getIsAppNotificationEnable(){
		let promise = new Promise((resolve, reject) => {
			if (Platform.OS == "ios"){
				PushNotificationIOS.checkPermissions((result)=>{
					resolve(result.alert);
				});
			}else{
				JPush.isNotificationEnabled((result)=>{
					resolve( result? true: false);
				});
			}
		});
		return promise;
	},
	// 針對冷啟動取得跳頁訊息
	async getStoreNotificationMsg(props, actions){
		let storeNotificationMsg = await DeviceStorageUtil.get('storeNotificationMsg');
		if (storeNotificationMsg) {
			let result = JSON.parse(storeNotificationMsg);
			if (result.notificationEventType == "notificationArrived"){
				this.dealMessagesOriginalsource(result, props, true);
			}else{
				JPush.setBadge({ "badge":0, "appBadge":0 });
				// await this.dealMessagesOriginalsource(result, props, true);
				
				// 測試非自定義的消息推送
				result.extras.APPID = "Messages";
      			actions.checkDirectorPage(result.extras);
			}
			DeviceStorageUtil.remove('storeNotificationMsg');
		} else {
			// console.log(2);
		}
    	DeviceStorageUtil.set('isColdActive', false);
	},
}

export default MessageRouter;