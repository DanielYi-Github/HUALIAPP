import * as types       from '../actionTypes/HomeTypes';
import * as commonTypes from '../actionTypes/CommonTypes';
import * as salaryTypes from '../actionTypes/SalaryTypes';
import { Linking, Platform, Alert, View, Text } from 'react-native';

import ToastUnit 				from '../../utils/ToastUnit';
import * as NavigationService   from '../../utils/NavigationService';
import * as SQLite         from '../../utils/SQLiteUtil';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';
import * as LoggerUtil     from '../../utils/LoggerUtil';

export function HomePageRefresh(user) {
	return async dispatch => {
		dispatch(refreshing_clearn()); 						

		/*server資料同步*/
		Promise.all([
			UpdateDataUtil.updateAPP(user),
			UpdateDataUtil.updateNotice(user), 			    //公告資訊
			UpdateDataUtil.updateContact(user)				//通訊錄
		]).then(() => {
			this.loadNoticeData();
			// dispatch(refresh_success()); 				//結束載入資料畫面
			// this.loadFunctionData();
		}).catch((e) => {
			if (e.code === "0") {
				dispatch(logout()); 						//已在其他裝置登入，強制登出
			}
			dispatch(submit_error()); 					    //結束載入資料畫面
		})
	}
}

export function loadFunctionType(lang) {
	return dispatch => {
		let data = [];
		let sql = `select a.oid as oid,a.parentoid as parentoid,a.layer as layer,a.id as id,a.name as name2,a.explain as explain,a.icon as icon,a.sort as sort,ifnull(b.LANGCONTENT,a.NAME) as NAME,ifnull(c.LANGCONTENT,a.EXPLAIN) as EXPLAIN from thf_module a
		left join (select LANGID,LANGCONTENT from THF_LANGUAGE b where LANGTYPE='${lang}' and STATUS='Y') b on a.LANGID=b.LANGID
		left join (select LANGID,LANGCONTENT from THF_LANGUAGE c where LANGTYPE='${lang}' and STATUS='Y') c on a.LANGID||'_DESC'=c.LANGID
		order by layer,sort
		`;
		SQLite.selectData(sql, []).then((result) => {
      		for (let i = 0; i < result.length; i++) data.push(result.item(i));
			dispatch( loadFunctionTypeIntoState(data) );
    	}).catch((e)=>{
			LoggerUtil.addErrorLog("HomeAction loadFunctionData", "APP Action", "ERROR", e);
    	});
    }
}

export function loadFunctionData(lang) {
	return  (dispatch, getState) => {
		
		
		let data = [];
		let platform = "";
		let version = "";
		if (Platform.OS === "ios") {
			platform = "ios";
			version = parseInt(Platform.Version, 10);
		} else {
			platform = "android";
		}

		let sql = `select 
			          d.layer,d.id as type,d.name as typename,d.icon as typeicon,d.sort,
			          a.OID,a.ID,ifnull(b.LANGCONTENT,a.NAME) as NAME,a.TYPE,ifnull(c.LANGCONTENT,a.EXPLAIN) as EXPLAIN,
			          a.MODULE_OID,a.POSITION,a.PACKAGENAME,a.DOWNURL,a.ICON,a.WEBTITLE,a.WEBURL,a.APPURL,a.LANGID      
                  	from thf_module d 
      		 		left join THF_APP a on a.MODULE_OID=d.oid
					left join (select LANGID,LANGCONTENT from THF_LANGUAGE b where LANGTYPE='${lang}' and STATUS='Y') b on a.LANGID=b.LANGID
					left join (select LANGID,LANGCONTENT from THF_LANGUAGE c where LANGTYPE='${lang}' and STATUS='Y') c on a.LANGID||'_DESC'=c.LANGID
					where a.STATUS='Y'
					ORDER BY d.layer,position`;

		// for ios11
		if (platform==="ios" & version>=11 && version<12) {
			sql = `select 
			          d.layer as layer,d.id as type,d.name as typename,d.icon as typeicon,d.sort as sort,
			          a.OID as OID,a.ID as ID, ifnull(b.LANGCONTENT,a.NAME) as NAME,a.TYPE as TYPE,ifnull(c.LANGCONTENT,a.EXPLAIN) as EXPLAIN,
			          a.MODULE_OID as MODULE_OID,a.POSITION as POSITION,a.PACKAGENAME as PACKAGENAME,a.DOWNURL as DOWNURL,a.ICON as ICON,a.WEBTITLE as WEBTITLE,a.WEBURL as WEBURL,a.APPURL as APPURL,a.LANGID as LANGID    
                  	from thf_module d 
      		 		left join THF_APP a on a.MODULE_OID=d.oid
					left join (select b.LANGID,b.LANGCONTENT from THF_LANGUAGE b where b.LANGTYPE='${lang}' and STATUS='Y') b on a.LANGID=b.LANGID
					left join (select c.LANGID,c.LANGCONTENT from THF_LANGUAGE c where c.LANGTYPE='${lang}' and STATUS='Y') c on a.LANGID||'_DESC'=c.LANGID
					ORDER BY POSITION`;
		}
			SQLite.selectData(sql, []).then((result) => {
      		for (let i = 0; i < result.length; i++) {
				  if(result.item(i).TYPE!=null) data.push(result.item(i))
			  }
			dispatch( loadFunctionIntoState(data) );
    	}).catch((e)=>{
			LoggerUtil.addErrorLog("HomeAction loadFunctionData", "APP Action", "ERROR", e);
    	});
	}
}

export function loadInitialNoticeData(page = 0, data = [], noticeType=null){
	return async dispatch => {
		dispatch( refreshing() );
		// 查詢各自的總比數
		let array = [null,"HR","IT","FR","MT","AG"];
		let ALL_count = `select count(*) as count from THF_NOTICE where NOTICEDATE is not null and STATUS='Y'`;
		let HR_count  = `select count(*) as count from THF_NOTICE where NOTICEDATE is not null and TYPE='HR' and STATUS='Y'`;
		let IT_count  = `select count(*) as count from THF_NOTICE where NOTICEDATE is not null and TYPE='IT' and STATUS='Y'`;
		let FR_count  = `select count(*) as count from THF_NOTICE where NOTICEDATE is not null and TYPE='FR' and STATUS='Y'`;
		let MT_count  = `select count(*) as count from THF_NOTICE where NOTICEDATE is not null and TYPE='MT' and STATUS='Y'`;
		let AG_count  = `select count(*) as count from THF_NOTICE where NOTICEDATE is not null and TYPE='AG' and STATUS='Y'`;
		let abc  = `select * from THF_NOTICE where NOTICEDATE is not null and TYPE='AG' and STATUS='Y'`;

		let countArray = await Promise.all([
			SQLite.selectData(ALL_count, []),
			SQLite.selectData(HR_count, []),
			SQLite.selectData(IT_count, []),
			SQLite.selectData(FR_count, []),
			SQLite.selectData(MT_count, []),
			SQLite.selectData(AG_count, []),
		]).then((result) => {
			let data = [];
			for(var i in result){
				data.push(result[i].item(0).count);	
			}
			return data;
		}).catch((e) => {
			// LoggerUtil.addErrorLog("HomeAction loadInitialNoticeData", "APP Action", "ERROR", e);
			// dispatch( loadNoticeIntoState([], null) );
		})

		// 查詢各自的資料
		let ALL = `select * from THF_NOTICE where NOTICEDATE is not null and STATUS='Y' order by NOTICEDATE DESC, CRTDAT DESC limit ${page*10},10 `;
		let HR  = `select * from THF_NOTICE where NOTICEDATE is not null and STATUS='Y' and TYPE='HR' order by NOTICEDATE DESC, CRTDAT limit ${page*10},10`;
		let IT  = `select * from THF_NOTICE where NOTICEDATE is not null and STATUS='Y' and TYPE='IT' order by NOTICEDATE DESC, CRTDAT limit ${page*10},10`;
		let FR  = `select * from THF_NOTICE where NOTICEDATE is not null and STATUS='Y' and TYPE='FR' order by NOTICEDATE DESC, CRTDAT limit ${page*10},10`;
		let MT  = `select * from THF_NOTICE where NOTICEDATE is not null and STATUS='Y' and TYPE='MT' order by NOTICEDATE DESC, CRTDAT limit ${page*10},10`;
		let AG  = `select * from THF_NOTICE where NOTICEDATE is not null and STATUS='Y' and TYPE='AG' order by NOTICEDATE DESC, CRTDAT limit ${page*10},10`;

		Promise.all([
			SQLite.selectData(ALL, []),
			SQLite.selectData(HR, []),
			SQLite.selectData(IT, []),
			SQLite.selectData(FR, []),
			SQLite.selectData(MT, []),
			SQLite.selectData(AG, []),
		]).then((result) => {
			for(var i in result){
				let data = [];
				for (let j = 0, len = result[i].length; j < len; j++) {
				  data.push(result[i].item(j));
				}
				dispatch( loadNoticeIntoState(data, array[i], countArray[i]));	
			}
		}).catch((e) => {
			dispatch( loadNoticeIntoState([], null) );
			LoggerUtil.addErrorLog("HomeAction loadInitialNoticeData", "APP Action", "ERROR", e);
		})

	}
}

export function loadNoticeData(page = 0, data = [], noticeType=null){
	return async dispatch => {
		dispatch( refreshing() );
		let sql = null;
		if (noticeType) {
			sql = `select * from THF_NOTICE where NOTICEDATE is not null and STATUS='Y' and TYPE='${noticeType}' order by NOTICEDATE DESC limit ${page*10},10`;
		} else {
			sql = `select * from THF_NOTICE where NOTICEDATE is not null and STATUS='Y' order by NOTICEDATE DESC limit ${page*10},10`;
		}

		SQLite.selectData(sql, []).then((result) => {
			//數量問題導致執行速度變慢
		  	for (let i = 0, len = result.length; i < len; i++) {
		      result.item(i).findPageItemType = "NOT";
		  	  data.push(result.item(i));
		  	}
			dispatch( loadNoticeIntoState(data, noticeType) );
		}).catch((e)=>{
			LoggerUtil.addErrorLog("HomeAction loadNoticeData", "APP Action", "ERROR", e);
		});
	}
}

/**
 * 跳轉CreateWebView前需要先撈出thf_param中的url值傳遞
 * 先跳轉後撈取會不定期導致webview加載異常
 *
 * @param   {[type]}  user       [user資料]
 * @param   {[type]}  WebViewID  [thf_param中param_type為WebViewUrl中對應的param_code]
 *
 * @return  {[type]}             [thf_param中的desc_name的url地址]
 */
async function getWebViewUrl(user,WebViewID){

	let webViewUrl=null;
    let urlParam=WebViewID.replace("WebView", "Url");
	await UpdateDataUtil.getWebViewUrlFromParamAbout(user,urlParam).then(async (data)=>{
		webViewUrl=data;
		return data;
    }).catch((e)=>{
		console.log("getItineraryCardUrl獲取異常",e);
		return null;
	}); 
	return webViewUrl;
  }

export function navigateFunctionPage(appID = null, userID = null) {
	return async (dispatch, getState) => {
		let recordHitCount = true;
		//判斷是否帶有WebView關鍵字來作為是否開啟WebView共用模板
		if(appID.includes('WebView')){
			let urlData=await getWebViewUrl(getState().UserInfo.UserInfo,appID);
			NavigationService.navigate("CreateWebView", {WebViewID:appID, urlData:urlData});
		}else{
			switch (appID) {
				case "Sign":
					NavigationService.navigate("FormTypeList");
					break;
				case "MyForm":
					NavigationService.navigate("MyFormList");
					break;
				case "G00010": //派車單
					NavigationService.navigate("CreateForm", {FormID: "G00010"});
					break;
				case "H00070": //台籍幹部休假單
					NavigationService.navigate("CreateForm", {FormID: "H00070"});
					break;
				case "M00030": //重要事項通報申請單
					NavigationService.navigate("CreateForm", {FormID: "M00030"});
					break;
				case "G00040": //物品放行單
					NavigationService.navigate("CreateForm", {FormID: "G00040"});
					break;
				case "H00020": //請假單
					NavigationService.navigate("CreateForm", {FormID: "H00020"});
					break;
				case "H00060": //海外陸籍幹部休假單
					NavigationService.navigate("CreateForm", {FormID: "H00060"});
					break;
				case "Survey": //問券調查
					NavigationService.navigate("Survey", {SurveyOID: "B8BF35C543F2D569E050000A76006341"});
					break;
				case "DaliyTempSurvey": //每日體溫回報
					NavigationService.navigate("Survey", {SurveyOID: "B8FC46FC2A55661DE050000A76003F57"});
					break;
				case "OutDoorSurvey": //春節出行情況
					NavigationService.navigate("Survey", {SurveyOID: "B936DC6D18263433E050000A760072A0"});
					break;
				case "Documents": //集團文件
					NavigationService.navigate("DocumentCategories");
					break;
				case "ManageDocuments": //管理文章
					NavigationService.navigate("ManageDocument");
					break;
				case "Birthday": //生日祝福
					NavigationService.navigate("BirthdayWeek");
					break;
				case "Mail":
					navigateMailFunction(getState(), dispatch);				
					break;
				case "Salary": //薪資查詢
					/*
						1.顯示驗證畫面
						1.確認是否開啟生物認證
						2.有 驗證結束直接跳頁
						3.無 輸入密碼驗證再跳頁
					*/
					if (getState().Common.isAuthenticateApprove) {
						recordHitCount = true;
						NavigationService.navigate("Salary");
					}else{
						recordHitCount = false;
						dispatch({
							type: commonTypes.ACTIVATE_AUTHENTICATION,
							navigatePage: appID
						});
						NavigationService.navigate("Authentication");
					}
					break;
				default:
					NavigationService.navigate(appID);
					break;
			}
		}
		

		if (recordHitCount) {
			let iSQL = `insert into THF_APPVISITLOG(USERID,APPID) values('${userID}','${appID}')`;
			SQLite.insertData(iSQL, []);
		}

		/*
		let sSQL = `select * from THF_APPVISITLOG where APPID='${appID}'`;
		SQLite.selectData(sSQL, []).then((result) => {
			if (result.length > 0) {
				let uSQL = `update THF_APPVISITLOG set VISITCOUNT=VISITCOUNT+1 where APPID='${appID}'`;
				SQLite.updateData(uSQL, []);
			} else {
				let iSQL = `insert into THF_APPVISITLOG(USERID,APPID) values('${userID}','${appID}')`;
				SQLite.insertData(iSQL, []);
			}
		});
		*/
	}
}

export function LockNoticeListState(NoticeListState){
	return (dispatch, getState) => {
		dispatch( lockNoticeListState(NoticeListState) );
	}
}

export function CleanNoticeListState(){
	return (dispatch, getState) => {
		dispatch( cleanNoticeListState() );
	}
}

function refreshing_clearn() {
	return {
		type: types.REFRESHING_CLEARN
	}
}

function refreshing() {
	return {
		type: types.REFRESHING
	}
}

function refresh_success() {
	return {
		type: types.REFRESH_SUCCESS
	}
}

function submit_error(){
	return {
		type: types.REFRESH_ERROR
	}
}

function logout(message = null) {
	return {
		type: "UNLOGIN",
		message
	};
}

function loadFunctionIntoState(FunctionData){
	return {
		type: types.LOADFUNCTION,
		FunctionData
	}
}

function loadFunctionTypeIntoState(FunctionType){
	return {
		type: types.LOADFUNCTIONTYPE,
		FunctionType
	}
}

function loadNoticeIntoState(NoticeData, NoticeType, NoticeCount = null){
	return {
		type: types.LOADNOTICE,
		NoticeData,
		NoticeType,
		NoticeCount
	}	
}

function lockNoticeListState(NoticeListState){
	return {
		type: types.LOCKNOTICELISTSTATE,
		NoticeListState,
	}
}

function cleanNoticeListState(){
	return {
		type: types.CLEANNOTICELISTSTATE,
	}
}

async function navigateMailFunction(state, dispatch){
	let user = state.UserInfo.UserInfo;
	let mail_isNull = (user.membereMail == "" || user.membereMail == null) ? true : false; 

	if (mail_isNull) { //郵箱為空
		//郵件伺服器連線出現問題，請稍後再試!
		toastShow(state.Language.lang.MailPage.mailError);	 
	} else {
		let isEmailDomainRight = true;
		let domain = user.membereMail.split("@");
		switch(domain[1]) {
		  case "hff-group.com":
		    break;
		  case "huali-group.com":
		    break;
		  case "heroheartgroup.com":
		    break;
		  default:
		    isEmailDomainRight = false;
		}

		if (isEmailDomainRight) {
			let sid = await UpdateDataUtil.getSessionID(state.UserInfo.UserInfo).then((data) => {
				if (data.code == 0) {
					dispatch(logout());
					//使用者Token已過期，請重新登入!
					toastShow(state.Language.lang.Common.TokenTimeout); 
					return false;
				} else if (data.code !== 200) {
					//郵件伺服器連線出現問題，請稍後再試!
					toastShow(state.Language.lang.MailPage.mailError); 
					return false;
				} else {
					return data.content;
				}
			}).catch(e => {
				//郵件伺服器連線出現問題，請稍後再試!
				toastShow(state.Language.lang.MailPage.mailError); 
				return false;
			});

			if (sid) {
				// Linking.openURL(`http://ms.hff-group.com/coremail/xphone/main.jsp?sid=${data.content}#module=folder`)
				let url = `http://ms.huali-group.com/coremail/xphone/main.jsp?sid=${sid}#module=folder`;
				
				// 是否啟動蘋果驗證模式
				if (state.Common.turnOnAppleVerify) {	
					Alert.alert(
						state.Language.lang.Common.Alert,
						state.Language.lang.Common.LeaveAppAlert, 
						[{
							text: state.Language.lang.Common.Cancel,
							onPress: () => { console.log('Cancel Pressed') },
							style: 'cancel'
						},{
							text: state.Language.lang.Common.Comfirm,
							onPress: () => { openMailURL(url); }
						}],
						{ cancelable: false }
					)
				} else { openMailURL(url); }
			}
		} else {
			// 不是公司油箱
			Alert.alert(
			  state.Language.lang.MineDetailEditPage.WrongEmailAlert,
			  state.Language.lang.MineDetailEditPage.WrongEmailDomain,
			   [
			     {text: 'OK', onPress: () => console.log('Cancel Pressed')},
			   ],
			);
		}
	}
}

function openMailURL(url){
	Linking.canOpenURL(url).then(supported => {
		if (!supported) {
			console.log('Can\'t handle url: ' + url);
		} else {
			return Linking.openURL(url);
		}
	}).catch(err => console.error('An error occurred', err));
}

function toastShow(message){
    ToastUnit.show('error', message);
}