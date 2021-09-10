import { Platform, NativeModules, Alert } from 'react-native';
import * as types          from '../actionTypes/CommonTypes';
import * as MessageTypes   from '../actionTypes/MessageTypes';
import * as SQLite         from '../../utils/SQLiteUtil';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';
import * as LoggerUtil     from '../../utils/LoggerUtil';
import * as DeviceInfo     from '../../utils/DeviceInfoUtil';
import * as NavigationService   from '../../utils/NavigationService';
import DeviceStorageUtil   from '../../utils/DeviceStorageUtil';
import SearchInput, { createFilter } from 'react-native-search-filter';
import Orientation from 'react-native-orientation-locker';

export function loadCompanyData_ContactCO(){
	return (dispatch, getState) => {
		let data          = [];
		let {co, plantID} = getState().UserInfo.UserInfo;
		let defaultCO     = getState().Common.defaultCO;	 //還沒找到預設公司=false

		let appOid, functionData = getState().Home.FunctionData;
		for(let i in functionData){
			if (functionData[i].ID == "Contact") {
				appOid = functionData[i].OID
				break;
			}
		}

		/*
		let sql = `select * from THF_MASTERDATA 
				   where CLASS1='ContactCO' and STATUS='Y' and OID in 
				   ( 
				   	select DATA_OID 
				   	from THF_PERMISSION 
				   	where DATA_TYPE='masterdata' and FUNC_OID='${appOid}'
				   ) 
				   order by SORT;`
		*/
		
		let sql = `select * from THF_MASTERDATA 
				   where CLASS1='HRCO' and STATUS='Y'`

		SQLite.selectData( sql, []).then((result) => {		
			//如果沒有找到資料，不顯示任何資料
			/*
			for(let i in result.raw()){
		    	data.push(result.raw()[i].CONTENT);

				if (!defaultCO && result.raw()[i].CLASS3 == co) {
					defaultCO = result.raw()[i].CONTENT
				}
			}
			*/
		
			for(let i in result.raw()){
		    	data.push(result.raw()[i]);

				if (!defaultCO && result.raw()[i].CLASS3 == co) {
					defaultCO = result.raw()[i]
				}
			}
			dispatch( setCompanyList_ContactCO( data, defaultCO) ); 
		}).catch((e)=>{
			LoggerUtil.addErrorLog("CommonAction loadCompanyData_ContactCO", "APP Action", "ERROR", e);
		});
	}
}

export function loadCompanyData_CarCO(){
	return (dispatch, getState) => {

		let data          = [];
		let {co, plantID} = getState().UserInfo.UserInfo;
		let defaultCO     = getState().Common.defaultCO;	//還沒找到預設公司=false

		let appOid, functionData = getState().Home.FunctionData;
		for(let i in functionData){
			if (functionData[i].ID == "Car") {
				appOid = functionData[i].OID
				break;
			}
		}
		
		let sql = ` select * from THF_MASTERDATA 
					where CLASS1='CarCO' and STATUS='Y' and OID in (
						select DATA_OID 
						from THF_PERMISSION 
						where DATA_TYPE='masterdata' and FUNC_OID='${appOid}'
					) 
					order by SORT;`
		SQLite.selectData( sql, []).then((result) => {	
			//如果沒有找到資料，不顯示任何資料
			for(let i in result.raw()){
		    	data.push({
		    		label:result.raw()[i].CONTENT,
		    		value:result.raw()[i].CLASS4
		    	});

				if (!defaultCO && result.raw()[i].CLASS3.indexOf(co+plantID) != -1) {
					defaultCO = {
						label:result.raw()[i].CONTENT,
						value:result.raw()[i].CLASS4
					}
				}
			}
			dispatch( setCompanyList_CarCO( data, defaultCO) ); 
		}).catch((e)=>{
			LoggerUtil.addErrorLog("CommonAction loadCompanyData_CarCO", "APP Action", "ERROR", e);
		});
	}
}

export function loadCompanyData_HrCO(){
	return (dispatch, getState) => {

		let dataKey         = [];
		let dataValue       = [];
		let { co, plantID } = getState().UserInfo.UserInfo;
		let defaultValue    = getState().Common.defaultValue; //還沒找到預設公司=false
		let defaultKey      = getState().Common.defaultKey; //還沒找到預設公司=false

		let appOid, functionData = getState().Home.FunctionData;
		for(let i in functionData){
			if (functionData[i].ID == "Birthday") {
				appOid = functionData[i].OID
				break;
			}
		}

		let sql = `select * from THF_MASTERDATA 
				   where CLASS1='HRCO' and STATUS='Y' and OID in (
				   	select DATA_OID 
				   	from THF_PERMISSION 
				   	where DATA_TYPE='masterdata' and FUNC_OID='${appOid}'
				   ) 
				   order by SORT;`
		SQLite.selectData( sql, []).then((result) => {
			//如果沒有找到資料，不顯示任何資料
			for (let i in result.raw()) {
				dataKey.push(result.raw()[i].CLASS3);
				dataValue.push(result.raw()[i].CONTENT);

				if (!defaultValue && result.raw()[i].CLASS3 == co) {
					defaultValue = result.raw()[i].CONTENT;
				}
			}
			dispatch(setCompanyList_HrCO(dataKey, dataValue, co, defaultValue));
		}).catch((e)=>{
			LoggerUtil.addErrorLog("CommonAction loadCompanyData_HrCO", "APP Action", "ERROR", e);
		});
	}
}

function setCompanyList_ContactCO(data, defaultCO){
	return {
		type: types.SET_COMPANIES_CONTACTCO,
		data:{
			data         :data,
			defaultCO    :defaultCO,
		}
	}
}

function setCompanyList_CarCO(data, defaultCO){
	return {
		type: types.SET_COMPANIES_CARCO,
		data:{
			data         :data,
			defaultCO    :defaultCO,
		}
	}
}

function setCompanyList_HrCO(dataKey,dataValue, defaultKey, defaultValue){
	return {
		type: types.SET_COMPANIES_HRCO,
		data:{
			dataKey         :dataKey,
			dataValue       :dataValue,
			defaultKey    :defaultKey,
			defaultValue    :defaultValue
		}
	}
}

export function loadWaterMarkViewConfig(){
	return (dispatch, getState) => {
		let sql = `select CLASS3 as pageId from THF_MASTERDATA where CLASS1='WaterMark' and CLASS4='Y' and STATUS='Y';`;
		SQLite.selectData( sql, []).then((result) => {	
			dispatch({
				type:types.SET_WATERMARKVIEW_CONFIG,
				data:result.raw()
			}); 
		}).catch(()=>{
			dispatch({
				type:types.SET_WATERMARKVIEW_CONFIG,
				data:[]
			}); 
		});
		
	}
}

// for Messages
export function checkDirectorPage(data, type = null){
	return async (dispatch, getState) => {
		
		// 找出該訊息的EVENT 再進行調轉動作
		let user = getState().UserInfo.UserInfo;
		let OID  = data.oid ? data.oid: data.OID;
		let sql  = `SELECT case when r.ISREAD is null then 'F' else r.ISREAD end ISREAD,
					a.OID as MSGOID, a.TYPE, a.TITLE, a.CONTENT, a.ISPUSH, a.CRTDAT,
					e.ID as APPID, e.TYPE as OPENTYPE, e.CONTENT1, e.CONTENT2, e.CONTENT3, e.CONTENT4
					from THF_MSG a 
		         	left join THF_EVENT e on e.OID=a.EVENTOID
					left join THF_MSG_USERREAD r on r.MSGOID=a.OID 
					WHERE a.STATUS='Y' AND a.OID='${OID}'`;
		data = await SQLite.selectData(sql, []).then((result) => {
			return result.item(0)
		});
		console.log("checkDirectorPage", data);
		if (data.ISREAD == "F") updateMessageReadState(OID, user, dispatch, getState);

		this.goDirectorPage(data)
	}
}
//跳转画面
export function goDirectorPage(data){
	return (dispatch, getState) => {
		switch (data.APPID) {
			case "CreateForm": 			// 派車單、台籍休假單... 
			case "FormTypeList": 		// 表單簽核分類清單
			case "MyFormList": 			// 我的表單清單
			case "ManageDocument": 		// 管理文章
			case "KPICategory": 		// KPI報表
			case "BirthdayWeek": 		// 生日祝福
			case "Operation": 			// APP操作說明
			case "ViewFile":  			// 集團文件、任一文件
			case "DailyOralEnglishDetail"://每日一句英语
				NavigationService.navigate(data.APPID, JSON.parse(data.CONTENT1));
				break;
			case "Meeting":  	    // 會議訊息
				let isSearchedMeeting = false;
				for(let meeting of getState().Meeting.meetingList){
				  if (data.CONTENT1 == meeting.oid) {
				    isSearchedMeeting = true;
				    break;
				  }
				}

				if (isSearchedMeeting) {
					NavigationService.navigate("MeetingInsert", {
				      meetingParam: { oid:data.CONTENT1	},
				      fromPage:"MessageFuc"
				    });
				} else {
					Alert.alert(
					  getState().Language.lang.MeetingPage.meetingAlreadyDone,
					  "",
					  [
					    {
					      text: getState().Language.lang.Common.Close,   // 關閉 
					      style: 'cancel',
					      onPress: () => {
					        // NavigationService.goBack();
					      }, 
					    }
					  ],
					)
				}

				break;
			case "Notice": 				// 集團公告
				let sql  = `select * from THF_NOTICE N where N.OID ='${data.CONTENT1}'`;
				SQLite.selectData(sql, []).then((result)=>{
					let item = {item:result.raw()[0]}
					NavigationService.navigate( data.APPID, { data:item } );
				});
				break;
			default: 					// 預設訊息內容
				NavigationService.navigate("MessageDetail", { data: data });
				break;
		}
	}
}


async function updateMessageReadState(OID, user, dispatch, getState){
	//該筆資料為UnMessage的第幾筆
	let index = getState().Message.UnMessage.findIndex(k => k.OID == OID);

	//清除未讀訊息的指定資料，指定MessageReducer進行處理
	if (index != null) dispatch({ type: MessageTypes.REMOVE_UNREAD, index});

	//新增資料庫已讀訊息 
	let sql = `INSERT INTO THF_MSG_USERREAD(MSGOID,USERID,ISREAD,ISUPDATE) VALUES(?,?,?,?)`;
	await SQLite.insertData(sql, [OID, user.loginID, 'Y', 'N']);

	//如有有聯網，更新server資料
	if (getState().Network.networkStatus == 'ONLINE') UpdateDataUtil.setRead(user, OID);	

	//找尋原本陣列中的該值，將該值改為Y
	let newMessage = getState().Message.Message;
	newMessage.filter(function(newMessage) {
		if (newMessage.OID === OID) newMessage.ISREAD = 'Y';
	});

	//開始顯示載入資料畫面，指定MessageReducer進行處理
	dispatch({ type: MessageTypes.STATE_UPDATE, newMessage });
}

/*
async function messageNavigation(data, user, getState, dispatch) {
	//需要先確定要導到哪一頁，目前回傳物件無此資訊，先以訊息為主
	let OID = data.oid ? data.oid: data.OID;
	   
	let sql = `SELECT case when r.ISREAD is null then 'F' else r.ISREAD end ISREAD, a.* 
			   from THF_MSG a 
			   left join THF_MSG_USERREAD r on r.MSGOID=a.OID 
			   WHERE a.STATUS='Y' AND a.OID='${OID}'`;

	data = await SQLite.selectData(sql, []).then((result) => {return result.item(0)});

	if (data.ISREAD == 'F') {
		//該筆資料為UnMessage的第幾筆
		let index = getState().Message.UnMessage.findIndex(k => k.OID == OID);

		//清除未讀訊息的指定資料，指定MessageReducer進行處理
		if (index != null) dispatch({
			type: MessageTypes.REMOVE_UNREAD,
			index
		});

		//新增資料庫已讀訊息 
		sql = `INSERT INTO THF_MSG_USERREAD(MSGOID,USERID,ISREAD,ISUPDATE) VALUES(?,?,?,?)`;
		await SQLite.insertData(sql, [OID, user.loginID, 'Y', 'N']);

		//如有有聯網，更新server資料
		if (getState().Network.networkStatus == 'ONLINE'){
			UpdateDataUtil.setRead(user, OID);	
		}

		//找尋原本陣列中的該值，將該值改為Y
		let newMessage = getState().Message.Message;
		newMessage.filter(function(newMessage) {
			if (newMessage.OID === OID) newMessage.ISREAD = 'Y';
		});

		//開始顯示載入資料畫面，指定MessageReducer進行處理
		dispatch({
			type: MessageTypes.STATE_UPDATE,
			newMessage
		});
	}

	// 執行跳頁動作
	switch (data.TYPE) {
		case "apppush": // 一般系統推送
			NavigationService.navigate("MessageDetail", {
				data: data
			});
			break;
		case "birthday": // 系統生日祝福
			NavigationService.navigate("MessageDetail", {
				data: data
			});
			break;
		case "birthdayMsg": // 同事生日祝福
			NavigationService.navigate("BirthdayWeek");
			break;
		case "Car": // 派車通知
			NavigationService.navigate("MessageDetail", {
				data: data
			});
			break;
		case "Feedback": // 反饋建議回復
			NavigationService.navigate("MessageDetail", {
				data: data
			});
			break;
		case "Travel": // 出差天氣提醒
			NavigationService.navigate("MessageDetail", {
				data: data
			});
			break;
		case "Performance": // 打考核提醒 or 考核成績顯示
			NavigationService.navigate("MessageDetail", {
				data: data
			});
			break;
		case "webpush": // 未知
			NavigationService.navigate("MessageDetail", {
				data: data
			});
			break;
		default:
			NavigationService.navigate("MessageDetail", {
				data: data
			});
	}
}
*/

/*
async function getDoucmentData(user, data) {
	let array = data.OID.split('/');
	if (array.length == 3) {
		let content = {
			oid: array[0],
			type: array[1],
			fileName: array[2]
		};
		NavigationService.navigate("ViewFile", {
			"content": content,
			"url": 'app/eip/getGroupFileBase64Data'
		});
	}
}
*/

export function findPageKeywordSearch(isChinesKeyword, keyword, tKeyword, sKeyword){
	return async (dispatch, getState) => {
		dispatch( KeywordSearching() ); 

		/***進行下方多方資料查詢的篩選***/
		//派車資料     
		//表單簽核資料 
		//我的表單資料 
		//通訊錄資料   
		//公司公告查詢欄位
		//消息查詢欄位  [TITLE, CONENT]
		/***多方資料篩選結束***/

		let user         = getState().UserInfo.UserInfo;
		let lang         = getState().Language.lang;
		let MessageData  = [], Message_to_filters = ['TITLE', 'CONENT'];
		let sectionArray = [];

		if (!isChinesKeyword) { //不是中文
		  	// 通訊錄查詢
		  	let contact_sql = `Select * FROM THF_CONTACT Where NAME LIKE '%%${keyword}%%' or DEPNAME LIKE '%%${keyword}%%'`;
		  	// 公告訊息
			let notice_sql = `Select * FROM THF_NOTICE Where EMP LIKE '%%${keyword}%%' or TITLE LIKE '%%${keyword}%%' or TYPE LIKE '%%${keyword}%%'`;
			// 我的消息
		  	MessageData = getState().Message.Message.filter(createFilter(keyword, Message_to_filters));

		  	let findResultData = await Promise.all([
		  		SQLite.selectData(notice_sql,[]),					// 公告資訊
		  		SQLite.selectData(contact_sql,[]),					// 通訊錄
		  		UpdateDataUtil.getMyTaskByKeyword(user, keyword),	// 表單簽核
		  		UpdateDataUtil.getTaskByKeyword(user, keyword),		// 我的表單
		  		UpdateDataUtil.getCarRelatedData(user, keyword),	// 派車查詢
		  	]).then((data) => {
		  		if( data[0].length != 0 ) sectionArray.push( setSectionArray(lang.HomePage.Announcement, "NOT", data[0].raw()) );
		  		if( data[1].length != 0 ) sectionArray.push( setSectionArray(lang.HomePage.Contacts, "CON", data[1].raw()) );
		  		if( data[2].length != 0 ) sectionArray.push( setSectionArray(lang.HomePage.FormTypeList, "SIG", data[2]) );
		  		if( data[3].length != 0 ) sectionArray.push( setSectionArray(lang.HomePage.MyForm, "MYF", data[3]) );
		  		if( MessageData.length != 0 ) sectionArray.push( setSectionArray(lang.MainPage.Message, "MSG", MessageData) );
		  		if( data[4].length != 0 ) sectionArray.push( setSectionArray(lang.HomePage.Cars, "CAR", carsFormat(data[4])) );
		  	}).catch((err) => {
				LoggerUtil.addErrorLog("CommonAction findPageKeywordSearch", "APP Action", "ERROR", err);
		  	})
		} else { //是中文
			// 通訊錄查詢
			let contact_sql_t = `Select * FROM THF_CONTACT Where NAME LIKE '%%${tKeyword}%%' or DEPNAME LIKE '%%${tKeyword}%%'`;
			let contact_sql_s = `Select * FROM THF_CONTACT Where NAME LIKE '%%${sKeyword}%%' or DEPNAME LIKE '%%${sKeyword}%%'`;
			// 公告訊息
			let notice_sql_t = `Select * FROM THF_NOTICE Where EMP LIKE '%%${tKeyword}%%' or TITLE LIKE '%%${tKeyword}%%' or TYPE LIKE '%%${tKeyword}%%'`;
			let notice_sql_s = `Select * FROM THF_NOTICE Where EMP LIKE '%%${sKeyword}%%' or TITLE LIKE '%%${sKeyword}%%' or TYPE LIKE '%%${sKeyword}%%'`;
			// 我的消息
			MessageData = getState().Message.Message.filter(createFilter(tKeyword, Message_to_filters));
			MessageData = MessageData.concat( getState().Message.Message.filter(createFilter(sKeyword, Message_to_filters)) );

			let findResultData = await Promise.all([
		  		SQLite.selectData(notice_sql_t,[]),					// 公告資訊
		  		SQLite.selectData(notice_sql_s,[]),					// 公告資訊
		  		SQLite.selectData(contact_sql_t,[]),				// 通訊錄
		  		SQLite.selectData(contact_sql_s,[]),				// 通訊錄
		  		UpdateDataUtil.getMyTaskByKeyword(user, tKeyword),	// 表單簽核
		  		UpdateDataUtil.getMyTaskByKeyword(user, sKeyword),	// 表單簽核
		  		UpdateDataUtil.getTaskByKeyword(user, tKeyword),	// 我的表單
		  		UpdateDataUtil.getTaskByKeyword(user, sKeyword),	// 我的表單
		  		UpdateDataUtil.getCarRelatedData(user, tKeyword),	// 派車查詢
		  		UpdateDataUtil.getCarRelatedData(user, sKeyword),	// 派車查詢
			]).then((data) => {
		  		let array=[];
		  		// 公告訊息
				array = data[0].raw().concat(data[1].raw()); 	// 陣列合併
		  		if( array.length != 0 ) sectionArray.push( setSectionArray(lang.HomePage.Announcement, "NOT", array) );
		  		// 通訊錄
		  		array = data[2].raw().concat(data[3].raw()); 	// 陣列合併
		  		if( array.length != 0 ) sectionArray.push( setSectionArray(lang.HomePage.Contacts, "CON", array) );
		  		// 表單簽核
		  		array = data[4].concat(data[5]); 	// 陣列合併
		  		if( array.length != 0 ) sectionArray.push( setSectionArray(lang.HomePage.FormTypeList, "SIG", array) );
		  		// 我的表單
		  		array = data[6].concat(data[7]); 	// 陣列合併
		  		if( array.length != 0 ) sectionArray.push( setSectionArray(lang.HomePage.MyForm, "MYF", array) );
		  		// 消息
		  		if( MessageData.length != 0 ) sectionArray.push( setSectionArray(lang.MainPage.Message, "MSG", MessageData) );
		  		// 派車查詢
		  		array = data[8].concat(data[9]); 	// 陣列合併
	  			if( array.length != 0 ) sectionArray.push( setSectionArray(lang.HomePage.Cars, "CAR", carsFormat(array)) );
			}).catch((err) => {
				LoggerUtil.addErrorLog("CommonAction findPageKeywordSearch", "APP Action", "ERROR", err);
			})
		}
		dispatch( KeywordSearched(sectionArray) ); 
	}
}

function KeywordSearching(){
	return {
		type: types.KEYWORDSEARCHING,
	}
}

function KeywordSearched(filteredData) {
	return {
		type: types.KEYWORDSEARCHED,
		filteredData
	}	
}

function setSectionArray(title, type, dataArray){
	//去除重複的數組
	dataArray = dedup(dataArray);
	let array = [];

	for(let data of dataArray){
		data.findPageItemType = type;
		array.push(data);
	}

	return {
		title: title,
		data: array,
		type: type
	}
}

function dedup(arr) {
	var hashTable = {};

	return arr.filter(function (el) {
		var key = JSON.stringify(el);
		var match = Boolean(hashTable[key]);

		return (match ? false : hashTable[key] = true);
	});
}

function carsFormat(dataArray){
	let date, M, D, T, carArray = [];
	for(let d of dataArray){
		date = new Date(d.date);
		M = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
		D = date.getDate();
		T = d.starttime ? d.starttime : "";
		let content = {
			departureTime  :`${M}/${D} ${T}`,
			isDrive        :d.status=="1" ? true:false,
			carID          :d.carplate,
			dirver         :d.drivername,
			driversCell    :d.cellphone ? dealCellnumber(d.cellphone) : null,
			from 		   :d.outset,
			to             :d.destination,
			passenger      :`${d.pg}/${d.pb}`,
			passengerNumber:`${d.pgcount}/${d.pbcount}`,
			findPageItemType: "CAR"
		};
		carArray.push(content);
	}
	return carArray;
}

function dealCellnumber(cell){
	var m = cell.search(/）/);
	var n = cell.search( /\(/ );
	var l = cell.search( /\// );
	if (m != -1)
	{
		cell = cell.substring(m+1);
	}
	else if( n != -1)
	{ 
		cell = cell.substring(0, n)
	}
	else if( l != -1)
	{ 
		cell = cell.substring(0, l)
	}
	return cell;
}

export function keywordSearchClean(){
	return (dispatch, getState) => {
		dispatch({
			type: types.KEYWORDCLEAN
		}); 
	}
}

export function disDirectorPage(){
	return (dispatch, getState) => {
		dispatch( disDirector() ); 
	}
}

function disDirector(){
	return {
		type: types.DISDIRECT_PAGE,
	}
}

export function setAppleVerify(isTurnOnAppleVerify){
	return (dispatch, getState) => {	
		dispatch({
			type: types.SETAPPLEVERIFYSTATE,
			isTurnOnAppleVerify
		}); 
	}
}

export function setIntroductionDrawerPages(IntroductionDrawerPages){
	return (dispatch, getState) => {	
		dispatch({
			type: types.SET_INTRODUCTION_DRAWER_PAGES,
			IntroductionDrawerPages
		}); 
	}
}

export function setIntroductionPageContent(IntroductionPageContent){
	return (dispatch, getState) => {	
		dispatch({
			type: types.SET_INTRODUCTIONPAGE_CONTENT,
			IntroductionPageContent
		}); 
	}
}

export function closeAuthentication(){
	return (dispatch, getState) => {	
		dispatch({
			type        : types.CLOSE_AUTHENTICATION,
			navigatePage: null
		}); 
	}
}

export function authenticateApprove(){
	return (dispatch, getState) => {	
		dispatch({
			type : types.AUTHENTICATE_APPROVE,
		}); 
	}
}

export function authenticateDisapprove(){
	return (dispatch, getState) => {	
		dispatch({
			type : types.AUTHENTICATE_DISAPPROVE,
		}); 
	}
}

export function enableScreenShot(isEnable) {
	return async (dispatch, getState) => {
		try {
			if (isEnable) {
				let result = await NativeModules.PreventScreenshotModule.allow();
			} else {
				let result = await NativeModules.PreventScreenshotModule.forbid();
			}
		} catch (e) {
			console.log(e);
		}

		dispatch({
			type: types.ENABLE_SCREENSHOT,
			isEnable
		});
	}
}

export function isShowAndroidChangeAPPMessage(){
	return async (dispatch, getState) => {
		let isShowAndroidChangeAPPMessage = await DeviceStorageUtil.get('isShowAndroidChangeAPPMessage').then(async (data)=>{
			data = data=="" ? "Y": await JSON.parse(data)
			if ( data === "N" ) {
				return false;
			}else{
				return true;
			}
		});

		if (isShowAndroidChangeAPPMessage) {
			UpdateDataUtil.getAndroidChangeAppMessage(DeviceInfo.getVersion(), Platform.OS).then((result)=>{
				dispatch({
					type: types.SHOW_ANDROID_CHANGE_APP_MESSAGE,
					result
				});
			});
		}
	}
}

export function noMoreShowAndroidChangeAPPMessage(){
	return async (dispatch, getState) => {
		DeviceStorageUtil.set('isShowAndroidChangeAPPMessage', "N");
		let result = false;
		dispatch({
			type: types.SHOW_ANDROID_CHANGE_APP_MESSAGE,
			result
		});
	}
}

export function loadBannerImages(){
	return async (dispatch, getState) => {
		let data = [];
		let lang = getState().Language.langStatus;

		// 先判斷有沒有網路
		if (getState().Network.networkStatus) {
			let sql = `select * from THF_BANNER where LANG='${lang}' and STATUS='Y' order by SORT;`
			
			await SQLite.selectData( sql, []).then((result) => {	
				// 如果少於3筆要加東西
				if (result.raw().length < 3) data.push({ key:0 });
				for(let i in result.raw()){
					data.push({
						key      : i+1,
						source   : {uri: result.raw()[i].DOWNURL},
						APPID    : result.raw()[i].APPID,
						PORTALURL: result.raw()[i].PORTALURL
					});
				}
			}).catch((e)=>{
				LoggerUtil.addErrorLog("CommonAction loadBannerImages", "APP Action", "ERROR", e);
			});
		}
		
		//如果沒有網路或是SQL查詢出錯，則做下面的處理
		if (data.length == 0) {
			let banner1, banner2;
			switch(lang){
				case "vi":
					banner1 = require(`../../image/banner/banner1_en.png`);
					banner2 = require(`../../image/banner/banner2_en.png`);
					break;				
				case "en":
					banner1 = require(`../../image/banner/banner1_en.png`);
					banner2 = require(`../../image/banner/banner2_en.png`);
					break;
				case "zh-CN":
					banner1 = require(`../../image/banner/banner1_zh-CN.png`);
					banner2 = require(`../../image/banner/banner2_zh-CN.png`);
					break;
				case "zh-TW":
					banner1 = require(`../../image/banner/banner1_zh-TW.png`);
					// banner1 = require(`../../image/banner/banner_CN.png`);
					banner2 = require(`../../image/banner/banner2_zh-TW.png`);
					break;
			}
			data = [{
				key: 0,	// 如果key為0，下面的source要拿掉
			}, {
				key: 1,
				source: banner1,
				APPID    : null,
				PORTALURL: null
			}, {
				key: 2,
				source: banner2,
				APPID    : null,
				PORTALURL: null
			}];
		}

		dispatch({
			type:types.SET_BANNERIMAGES,
			data
		}); 
	}
}

export function isEnableOrientation(currentRoute){
	return async (dispatch, getState) => {
		switch(currentRoute) {
		     case "Notice":
		     case "FormOrigionalForm":
		     case "FormContentGridDataTable":
		     case "Operation":
		     case "ViewFile":
		     case "KPIDetail":
		     case "CreateWebView":
		     	// 開放所有方向選轉
		     	Orientation.unlockAllOrientations();
		        break;
		     default:
		     	// 鎖定只能豎屏
		        Orientation.lockToPortrait();
		} 
	}
}

/*
function refreshing() {
	return {
		type: types.SET_REFRESHING
	}
}

function setUserInfo(data) {
	return {
		type: types.SET,
		data
	}
}

function setUser_error(){
	return {
		type: types.SET_ERROR
	}
}
*/
/*
	Splash
	IntroductionDrawer
	RecruitDetail
	AuthStack
	HomeTabNavigator
	Notice
	FindDetailList
	MessageDetail
	MineDetail
	MineDetailEdit
	Contact
	ContactDetail
	Car
	FormTypeList
	FormList
	Form
	FormOrigionalForm
	FormDrawSign
	FormAllowAdd
	MyFormList
	MyForm
	CreateForm
	FormInputContentGridPage
	FormContentTextWithAction
	FormContentTextWithTags
	FormContentChkWithAction
	FormContentGridDataTable
	FormInputContentGridPageForDeputy
	Salary
	Survey
	Publish
	PublishEdit
	PublishSubmit
	PublishSubmitSelect
	Deputy
	Advices
	Operation
	About
	AccountSafe
	UpdatePassword
	ChangeAccount
	ManageDocument
	ViewFile
	DocumentCategories
	DocumentContent
	DocumentDetail
	DocumentNewsContent
	BirthdayWeek
	BirthdayDetail
	KPIDetail
	KPICategory
	CreateWebView
*/
