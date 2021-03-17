import NetInfo             from "@react-native-community/netinfo";
import DeviceStorageUtil   from './DeviceStorageUtil';
import Common              from './Common';
import * as SQLite         from './SQLiteUtil';
import * as UpdateDataUtil from './UpdateDataUtil';
// import {TOMCAT_HOST_DB} from './Contant';

/**
 * 運行過程中發生錯誤，寫進資料庫
 * @param msg String 內容
*/
export async function addErrorLog(url, position = null, level = "ERROR", msg){
	let message = { url:url, msg:msg }; // 將錯誤出處與錯誤訊息合併
	console.log("錯誤提示:\n", message);

	msg = JSON.stringify(message);
	let user = await DeviceStorageUtil.get('User').then((user) => {
		return user.length ?
			JSON.parse(user) : {
				loginID: "Not Login",
				id     : "Not Login",
				token  : "Not Login"
			}
	})

	let isConnected = await NetInfo.fetch().then((state)=>{
	  return state.isConnected;
	});
	
	// 如果有網路傳直到server,沒網路就寫進資料庫
	if (isConnected) {
		console.log("傳送錯誤至server", user.loginID, position, level, msg.msg);
		UpdateDataUtil.setErrorLog([user], [position], [level], [msg]).then((result)=>{
			console.log("傳送錯誤至server 成功");
		}).catch((e)=>{
			console.log("傳送錯誤至server 失敗", e);
		})
	} else {
		let lInsert = `INSERT INTO THF_LOG (USERID, POSITION, LOGLEVEL, CONTENT) 
					   VALUES ('${user.loginID}', '${position}', '${level}', '${msg}')`;
		SQLite.insertData(lInsert, null).then((e)=>{
			console.log("寫入錯誤至localDB 成功");
		}).catch((e)=>{
			console.log("寫入錯誤至localDB 失敗", e);
		});
	}
	
}

/**
 * 上傳資料庫的log，寫進刪除本地log資料
 * @param msg String 內容
*/
export async function uploadLocalDBErrorLog(user){
	let isConnected = await NetInfo.fetch().then((state)=>{
	  return state.isConnected;
	});
	
	// 如果有網路傳直到server,沒網路就寫進資料庫
	if (isConnected) {
		let lSQL = "SELECT * FROM THF_LOG";
		let lData = await SQLite.selectData(lSQL, []);
		
		let users    = [];
		let position = [];
		let level    = [];
		let msgs     = [];
		if (lData.length > 0) {
			let data = lData.raw();
			for(var i in data){
				users.push({
					loginID:user.loginID,
					id     :data[i].USERID,
					token  :user.token
				});
				position.push(data[i].POSITION);
				level.push(data[i].LEVEL);
				msgs.push(data[i].CONTENT);
			}

			UpdateDataUtil.setErrorLog(users, position, level, msgs).then((result)=>{
				console.log("傳送localDB錯誤至server 成功");

				SQLite.updateData("DELETE FROM THF_LOG", []).then(() => {
					console.log("清除localDB錯誤 成功");
				}).catch((e)=>{
					console.log("清除localDB錯誤 失敗", e);
				})
			}).catch((e)=>{
				console.log("傳送localDB錯誤至server 失敗", e);
			})
		}
		
	}
}

/**
 * 只會顯示在tomcat console
 * @param msg String 內容
*/
/*
export function addExeLog(msg){
	let type  = "debug";
	Common.getNetworkStatus().then((status)=>{
    	if(status==='online'){
	    	var fetchOptions = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: `type=${type}&msg=${msg}`
			};
			try{
				fetch(TOMCAT_HOST_DB+"?method=AddLog",fetchOptions);
			}catch(err){
				console.log(err);
			}
    	}else{
    		
    	}
	});
}
*/

/**
 * 產生在LOG檔
 * @param msg String 內容
*/
/*
export function addInfoLog(msg){
	let type  = "info";
	Common.getNetworkStatus().then((status)=>{
    	if(status==='online'){
	    	var fetchOptions = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: `type=${type}&msg=${msg}`
			};
			try{
				fetch(TOMCAT_HOST_DB+"?method=AddLog",fetchOptions);
			}catch(err){
				console.log(err);
			}
    	}else{
    		
    	}
	});
}
*/

/**
 * 產生在LOG檔
 * @param msg String 內容
*/
/*
export function addErrLog(msg){
	let type  = "error";
	Common.getNetworkStatus().then((status)=>{
    	if(status==='online'){
	    	var fetchOptions = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: `type=${type}&msg=${msg}`
			};
			try{
				fetch(TOMCAT_HOST_DB+"?method=AddLog",fetchOptions);
			}catch(err){
				console.log(err);
			}
    	}else{
    		
    	}
	});
}
*/