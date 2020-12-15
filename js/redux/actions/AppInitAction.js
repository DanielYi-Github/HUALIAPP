'use strict';
import { Platform } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import * as AppInitTypes from '../actionTypes/AppInitTypes';

import * as UpdateDataUtil from '../../utils/UpdateDataUtil';
import * as LoggerUtil     from '../../utils/LoggerUtil';
import * as Navigation     from '../../utils/NavigationService';
import UpgradeDBTableUtil  from '../../utils/UpgradeDBTableUtil';
import DeviceStorageUtil   from '../../utils/DeviceStorageUtil';
import UpgradeAppVersionUtil from '../../utils/UpgradeAppVersionUtil';


export function appInit(initActions, downloadProgressCallback) {
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

		initActions.setThemeState();   				// 設定APP主題風格
		initActions.initLang();        				// 判斷系統語系，如果本地資料沒有，就取系統語系，系統語系不合選擇中文簡體
		initActions.setNetworkStatus();  			// 新增網路監聽
		let netStatus = await getNetworkStatus(); 	// 獲取當下網路狀況
		let lang = getState().Language.lang;
		let navigationPage; 						// 初始化結束後要跳轉的畫面
		
		
		if (netStatus) {
    		initActions.bios_check(); 					// 檢查設備是否支持生物識別
    		initActions.biometricInfo_check();			// 檢查server與設備有無使用者生物識別資訊且一致
			await UpgradeDBTableUtil.UpgradeDBTable(); 	// 檢查DB表有無更新
			await UpdateDataUtil.updateVersion();		// 檢查DB表有無APP版本號更新   

			if (getState().Login.showUpdateMessage) {
				// 有無重大版本更新、熱更新
				let isVersionUpdate = false;
				isVersionUpdate = await UpgradeAppVersionUtil.checkBigUpdate(lang); // 版本更新檢查

				if (!isVersionUpdate) {
					isVersionUpdate = Platform.OS == 'ios' ? 
							isVersionUpdate 
						: 
							await UpgradeAppVersionUtil.checkHotUpdate(lang, downloadProgressCallback); // 熱更新檢查
					
					if (!isVersionUpdate) intoAppProgress(initActions, getState());
					initActions.setNoUpdateAlert(); // 設定不要顯示提醒框
				}
			} else {
				intoAppProgress(initActions, getState());
			}
		 		
		} else {

			let user = await DeviceStorageUtil.get('User'); // 有無使用者資料
			user = user ? JSON.parse(user) : false;

			if (user) {				
				initActions.loadUserInfoState(user);
				Alert.alert(
				  lang.Common.Alert,
				  lang.Common.InternetAlert    
				);
				
          		Navigation.navigate('HomeTabNavigator');
		 	} else {
          		Navigation.navigate('IntroductionDrawer');
		 	}
		}
	}
}

export function userSkipDigUpdate(initActions){
	return async (dispatch, getState) => {
		intoAppProgress(initActions, getState());
	}
}

async function intoAppProgress(initActions, State){
	let arr = [
		UpdateDataUtil.getPublicView(), 		//取得公開畫面參數
		UpdateDataUtil.getPublicViewContent(), 	//取得公開畫面-集團介紹顯示內容參數
	];
	await Promise.all(arr).then((data) => {
		// 設定是否開啟蘋果驗證機制
		initActions.setAppleVerify(data[1].length == 3 ? true : false); 
		initActions.setIntroductionDrawerPages(data[0]); 
		initActions.setIntroductionPageContent(data[1]); 
	}).catch(reason => {
		LoggerUtil.addErrorLog("InitialPage initUser", "APP Page in InitialPage", "WARN", reason);
	});

	let user = await DeviceStorageUtil.get('User'); // 有無使用者資料
	user = user ? JSON.parse(user) : false;

		
	// 確認是否是使用帳號切換登入方式來登入：是，開始進行單入步驟；否，進行正常登入
	let loginChangeUserInfo = State.Login.loginChangeUserInfo
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
}

async function  getNetworkStatus(){
	let networkStatus = await NetInfo.fetch().then((state)=>{
	  return state.isConnected;
	});
	return networkStatus;
}