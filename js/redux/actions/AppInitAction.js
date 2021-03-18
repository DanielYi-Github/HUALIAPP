'use strict';
import { Platform, Alert, DeviceEventEmitter } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import * as AppInitTypes from '../actionTypes/AppInitTypes';
import * as HomeTypes    from '../actionTypes/HomeTypes';

import * as UpdateDataUtil from '../../utils/UpdateDataUtil';
import * as LoggerUtil     from '../../utils/LoggerUtil';
import * as Navigation     from '../../utils/NavigationService';
import UpgradeDBTableUtil  from '../../utils/UpgradeDBTableUtil';
import DeviceStorageUtil   from '../../utils/DeviceStorageUtil';
import UpgradeAppVersionUtil from '../../utils/UpgradeAppVersionUtil';

export function appInit(initActions/*, downloadProgressCallback*/) {
	return async (dispatch, getState) => {

		/*
		  登入前
		    檢查語系並設定語系  
		    檢查網路狀態並新增網路監聽
		    檢查DB表有無APP版本號更新
		    有無重大版本更新、熱更新
		    新增檔案下載監聽器
		    檢查DB表有無更新
		    檢查使用者資料
		    檢查設備是否支持生物識別

		  登入後
		    檢查設備是否支持訊息推送
		    創建使用者資料
		*/

		initActions.initLang();        				// 判斷系統語系，如果本地資料沒有，就取系統語系，系統語系不合選擇中文簡體
		initActions.setNetworkStatus();  			// 新增網路監聽
		let netStatus = await getNetworkStatus(); 	// 獲取當下網路狀況
		let lang = getState().Language.lang;
		let isColdActive = true; 						// 是不是冷啟動
      	addDownLoadFileListener(initActions, dispatch); // 新增檔案下載監聽器

		if (netStatus) {
			initActions.loadLoginMode();  					// 檢核登陸模式 tab/single
			initActions.getJpushRegistrationID();  			// 取得Jpush的註冊ID
			initActions.setThemeState( null, netStatus );  	// 設定APP主題風格
    		initActions.bios_check(); 						// 檢查設備是否支持生物識別
    		initActions.biometricInfo_check();				// 檢查server與設備有無使用者生物識別資訊且一致

			await UpgradeDBTableUtil.UpgradeDBTable(); 	// 檢查DB表有無更新
			await UpdateDataUtil.updateVersion();		// 檢查DB表有無APP版本號更新   

			if (getState().Login.showUpdateMessage) {

				// 有無重大版本更新、熱更新
				let isVersionUpdate = false;
				isVersionUpdate = await UpgradeAppVersionUtil.checkBigUpdate(lang); // 版本更新檢查

				if (!isVersionUpdate) {
					// 熱更新檢查
					isVersionUpdate = await UpgradeAppVersionUtil.checkHotUpdate(
						lang, 
						isColdActive,
						(isMandatory, event) => downloadProgressCallback(event, isMandatory, dispatch, getState),
					);
					
					if (!isVersionUpdate) intoAppProgress(initActions, getState());
					initActions.setNoUpdateAlert(); // 設定不要顯示提醒框
				}else{
					Platform.OS == 'ios' ? intoAppProgress(initActions, getState()) : null;
					DeviceStorageUtil.set("lastUpdateTime", new Date().getTime()); // localstorage記錄此次版本更新的時間
				}
			} else {
				intoAppProgress(initActions, getState());
			}
		} else {
			initActions.setThemeState(null,netStatus);  // 設定APP主題風格
			intoAppProgress(initActions, getState(), netStatus, lang);
		}
	}
}

export function userSkipDigUpdate(initActions){
	return async (dispatch, getState) => {
		intoAppProgress(initActions, getState());
	}
}

async function intoAppProgress(initActions, State, netStatus=true, lang){
	let user = await DeviceStorageUtil.get('User'); // 有無使用者資料
	user = user ? JSON.parse(user) : false;

	// 有無網路
	if (netStatus) {
		
		let arr = [
			UpdateDataUtil.getPublicView(), 		//取得公開畫面參數
			UpdateDataUtil.getPublicViewContent() 	//取得公開畫面-集團介紹顯示內容參數
		];
		Promise.all(arr).then((data) => {
			// 設定是否開啟蘋果驗證機制
			initActions.setAppleVerify(data[1].length == 3 ? true : false); 
			initActions.setIntroductionDrawerPages(data[0]); 
			initActions.setIntroductionPageContent(data[1]); 

			// 確認是否是使用帳號切換登入方式來登入：是，開始進行單入步驟；否，進行正常登入
			let loginChangeUserInfo = State.Login.loginChangeUserInfo;
			if (Object.entries(loginChangeUserInfo).length) {
				switch (loginChangeUserInfo.checkAccType) {
					case "AD":
						initActions.loginByAD(loginChangeUserInfo.account, loginChangeUserInfo.password);
						break;
					case "EMPID":
						initActions.loginByEmpid(loginChangeUserInfo.account, loginChangeUserInfo.password);
						break;
					default:
				};
			} else {
				if (user) {
					initActions.loadUserInfoState(user);
					initActions.loginByToken(user);
				} else {
					Navigation.navigate('IntroductionDrawer');
				}
			}

		}).catch(reason => {
			LoggerUtil.addErrorLog("InitialPage initUser", "APP Page in InitialPage", "WARN", reason);
		});
	} else {
		initActions.setIntroductionDrawerPages(getDefaultDrawerPages()); 
		initActions.setIntroductionPageContent(getDefaultPageContent()); 
		if (user) {
		  initActions.loadUserInfoState(user);
          Navigation.navigate('HomeTabNavigator');
		  Alert.alert(
		    lang.Common.Alert,
		    lang.Common.InternetAlert    
		  );
		} else {

          Navigation.navigate('IntroductionDrawer');
		  Alert.alert(
		    lang.Common.Error,
		    lang.Common.NoInternetAlert
		  );
		}

	}
}

async function  getNetworkStatus(){
	let networkStatus = await NetInfo.fetch().then((state)=>{
	  return state.isConnected;
	});
	return networkStatus;
}

function getDefaultDrawerPages() {
	return [
		{
			crtdat: 1561000180000,
			crtemp: "A10433",
			desccode: null,
			descname: null,
			oid: "8BB973C2D8182301E05010ACB8004D37",
			paramcode: "Introduction",
			paramname: "公司介紹",
			paramsort: 1,
			paramtype: "PublicView",
			paramtypename: "公開畫面",
			parentparam: null,
			status: "Y",
			txdat: 1561000180000,
			txemp: null,
		}, {
			crtdat: 1561000180000,
			crtemp: "A10433",
			desccode: null,
			descname: null,
			oid: "8BB973C2D8172301E05010ACB8004D37",
			paramcode: "Recruitment",
			paramname: "招聘信息",
			paramsort: 2,
			paramtype: "PublicView",
			paramtypename: "公開畫面",
			parentparam: null,
			status: "Y",
			txdat: 1561000180000,
			txemp: null
		}, {
			crtdat: 1561089206000,
			crtemp: "A10433",
			desccode: null,
			descname: null,
			oid: "8BCE6799132D45D0E05010ACB8001ED4",
			paramcode: "ShoesIntroduction",
			paramname: "製鞋介紹",
			paramsort: 4,
			paramtype: "PublicView",
			paramtypename: "公開畫面",
			parentparam: null,
			status: "Y",
			txdat: 1561089206000,
			txemp: null
		}
	];
}

function getDefaultPageContent() {
	return [{
		crtdat: 1563414285000,
		crtemp: "A10480",
		desccode: null,
		descname: null,
		oid: "8DEBC118A2B95AF1E050A8C0BB1E5EC5",
		paramcode: "GroupIntroduction",
		paramname: "集團介紹",
		paramsort: 1,
		paramtype: "PublicViewContent",
		paramtypename: "公開畫面_集團介紹內容",
		parentparam: null,
		status: "Y",
		txdat: 1596441709000,
		txemp: null
	}, {
		crtdat: 1563414365000,
		crtemp: "A10480",
		desccode: null,
		descname: null,
		oid: "8DEBC118A2BA5AF1E050A8C0BB1E5EC5",
		paramcode: "ServiceItems",
		paramname: "服務項目",
		paramsort: 2,
		paramtype: "PublicViewContent",
		paramtypename: "公開畫面_集團介紹內容",
		parentparam: null,
		status: "Y",
		txdat: 1596441699000,
		txemp: null
	}, {
		crtdat: 1563414790000,
		crtemp: "A10480",
		desccode: null,
		descname: null,
		oid: "8DEBC118A2BB5AF1E050A8C0BB1E5EC5",
		paramcode: "ManagementIdea",
		paramname: "經營理念",
		paramsort: 3,
		paramtype: "PublicViewContent",
		paramtypename: "公開畫面_集團介紹內容",
		parentparam: null,
		status: "Y",
		txdat: 1563414790000,
		txemp: null
	}]
}

export function appHotInit(initActions){
	return async (dispatch, getState) => {

		initActions.setThemeState( null, getState().Network.networkStatus); // 設定APP主題風格
		await initActions.hotInitialApi( getState().UserInfo.UserInfo ); // 集團公告、輪播圖 重新撈取
    	initActions.loadInitialNoticeData(); // 集團公告重新自資料庫撈取      

		let arr = [
			UpgradeDBTableUtil.UpgradeDBTable(), 	// 檢查DB表有無更新
			UpdateDataUtil.updateVersion()			// 檢查DB表有無APP版本號更新
  		];

	  	await Promise.all(arr).then( async (data) => {
	  		return null
	  	}).catch((e)=>{
	  		console.log("e", e);
	  	})	   

		// 從localstorage取得上次版本更新提醒時間，如果至今距離4小時則以上，則顯示更新資訊，如果以內，則不顯示更新資訊
		DeviceStorageUtil.get("lastUpdateTime").then( async (lastUpdateTime)=>{
			lastUpdateTime = lastUpdateTime ? JSON.parse(lastUpdateTime) : new Date().getTime();

			let now = new Date().getTime();
			if (( now - lastUpdateTime ) >= 300000)  { 
			// if (true)  {
				let isVersionUpdate = await UpgradeAppVersionUtil.checkBigUpdate(getState().Language.lang); // 版本更新檢查
				let isHotUpdate = false;
				if (!isVersionUpdate) {
					
					let isColdActive = false; // 是不是冷啟動
					// 熱更新檢查
					isHotUpdate = await UpgradeAppVersionUtil.checkHotUpdate(
						getState().Language.lang, 
						isColdActive,
						(isMandatory, event) => downloadProgressCallback(event, isMandatory, dispatch, getState),
					); 

					// 一檢測需要熱更新就跳畫面
					if (isHotUpdate) {
						initActions.hotInitialUpgradAPP(); // 開始更新
						setTimeout( function(){ Navigation.goBackToTop(); }, 200);
					}
				}

				if (!isVersionUpdate) {
					DeviceStorageUtil.set("lastUpdateTime", new Date().getTime() ); // localstorage記錄此次版本更新的時間
				}else{
					// ios更新不要跳至更新畫面，android需要
					if (Platform.OS !== 'ios') {
						initActions.hotInitialUpgradAPP(); // 開始更新
						setTimeout( function(){ Navigation.goBackToTop(); }, 500);
					}
					DeviceStorageUtil.set("lastUpdateTime", new Date().getTime()); // localstorage記錄此次版本更新的時間
				}
			}

			DeviceStorageUtil.set("lastUpdateTime", new Date().getTime()); // localstorage記錄此次版本更新的時間
		})
				
	}
}

// 版本更新的下載進度條設定
function addDownLoadFileListener(initActions, dispatch){
  DeviceEventEmitter.addListener('LOAD_PROGRESS', (msg) => {
    dispatch({
    	type: AppInitTypes.APP_HOT_UPDATE,
    	showUpdateProgress: true,
    	downloadProgress: msg / 100,
    	upgradeMessage: `Downloading... ${msg}%`,
    })
    if (msg == 100) initActions.userSkipDigUpdate(initActions);  // 避免下載APK後不更新，直接進入啟動畫面
  });
}

// 熱更新的下載進度條設定。如果是強制更新，要顯示更新進度條
function downloadProgressCallback(event, isMandatory, dispatch, getState){
	if (isMandatory) {
		let percent = Math.round((event.receivedBytes / event.totalBytes) * 100);
		dispatch({
			type: AppInitTypes.APP_HOT_UPDATE,
			showUpdateProgress: true,
			downloadProgress: event.receivedBytes / event.totalBytes,
			upgradeMessage: `Progressing... ${percent}%`,
		})
	}
}