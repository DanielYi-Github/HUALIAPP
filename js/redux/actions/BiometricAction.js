import { Alert }             from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics'
import * as types            from '../actionTypes/BiometricTypes';
import * as LoginTypes       from '../actionTypes/LoginTypes';
import * as UpdateDataUtil   from '../../utils/UpdateDataUtil';
import DeviceStorageUtil     from '../../utils/DeviceStorageUtil';
import Common                from '../../utils/Common';
import NavigationService     from '../../utils/NavigationService';
import * as DeviceInfo       from '../../utils/DeviceInfoUtil';
import * as LoggerUtil       from '../../utils/LoggerUtil';

export function bios_check() {
	return async (dispatch, getState) => {
		//取得系統版本
    	let systemVersion = DeviceInfo.getSystemVersion(); 

		// 確認生物認證是否可使用, 生物識別類型, 錯誤碼
	    const { available, biometryType, error } = await ReactNativeBiometrics.isSensorAvailable();
	    console.log("available", available);
	    if (available) {
	    	let iemi = Common.getImei(); // 獲取設備憑證碼
			if(iemi){
				dispatch(bios_status(available, biometryType, iemi, systemVersion));
			}else{
				dispatch(bios_error_msg(false, "Get Iemi Fail", systemVersion));
	    		LoggerUtil.addErrorLog("bios_check 設備憑證獲取失敗", "BiosUserInfoAction", "WARN", "Get Iemi Fail");
			}
	    } else {
			let lang = getState().Language.lang.BiosForLoginPage;
			let errorMsg, errorCode;
			if (error.indexOf("Code=-6") != -1) {			//User has denied the use of biometry for this app
				errorMsg = lang.BiosErrMsgCode6;
				errorCode = -6;
				dispatch(bios_error_msg(true, errorMsg, systemVersion));
			} else if (error.indexOf("Code=-7") != -1) {	//No identities are enrolled;
				errorMsg = lang.BiosErrMsgCode7;
				errorCode = -7;
				dispatch(bios_error_msg(available, errorMsg, systemVersion));
			} else if (error.indexOf("BIOMETRIC_ERROR_NONE_ENROLLED") != -1) { 	//無啟用生物識別
				errorMsg = lang.BiosErrMsgOther;	
				errorCode = 0;
				dispatch(bios_error_msg(available, errorMsg, systemVersion));
			} else {										//生物識別功能獲取異常
				errorMsg = lang.BiosErrMsgOther;	
				errorCode = 0;
				dispatch(bios_error_msg(available, errorMsg, systemVersion));
				LoggerUtil.addErrorLog(`bios_check 生物識別異常 errorCode:${errorCode}`, "BiosUserInfoAction", "WARN", error);
			}
	    }

	}
}

// 設定手機生物識別功能成功
export function bios_status(available, biometryType, iemi, systemVersion) {
	return {
		type: types.BIOS_STATUS,
		available, 
		biometryType, 
		iemi,
		systemVersion
	}
}

// 設定手機生物識別功能失敗
export function bios_error_msg(available, errorMsg, systemVersion) {
	return {
		type: types.SET_ERROR_MSG,
		available, 
		errorMsg,
		systemVersion
	}
}

//查詢imei是否存在server
export function loadIemiExist(iemi) {
	return async (dispatch, getState) => {
        await UpdateDataUtil.getIemiExist(iemi).then( async (data) => {
			dispatch(bios_server_exist(data.content)); //結束載入資料畫面
        }).catch((e)=>{
			dispatch(bios_server_exist(false)); //結束載入資料畫面

        })  
	}
}

// 檢查設備有無使用者生物識別資訊
export function biometricInfo_check(){
	return async (dispatch, getState) => {
	 	// 設備有無使用者生物驗證資訊
    	let biosUser = await DeviceStorageUtil.get('UserBiometricInfomation');
    	console.log("biosUser::::::", biosUser);
	 	biosUser = biosUser ? JSON.parse(biosUser) : false;
	 	 
	 	if (biosUser) {
	 		// Server有無使用者生物驗證資訊
	        UpdateDataUtil.getIemiExist( biosUser.iemi ).then((data) => {
	        	if (data.content) {
	        		dispatch( setBiosUserInfo(biosUser, true) );
	        	} else {
	        		dispatch( setBiosUserInfo({}, false) );
	        	}
	        }).catch((e)=>{
	        	dispatch( setBiosUserInfo({}, false) );
	        })  
	 	}
	}
}

function bios_server_exist(isExist=false) {
	return {
		type: types.BIOS_SERVER_EXIST,
		isExist
	}
}

/**
 * 更新BiosUser的資料
 * @param user User
 * @param biometricEnable 是否啟用
 */
export function setIsBiometricEnable(user, biometricEnable){
	return async (dispatch, getState) => {

		let iemi = (getState().Biometric.iemi != "") ? getState().Biometric.iemi : user.iemi;
		if (biometricEnable) {
			let biosUser = {
				biometricEnable:biometricEnable,
				userID         :user.loginID,
				pictureUrl     :user.pictureUrl,
				sex            :user.sex,
				iemi 		   :iemi
			}
		//getState().Biometric.isServerExist代表server是否存在該imei
		if(!getState().Biometric.isServerExist){
			//不存在則新增
			UpdateDataUtil.setBiosUserIemi(user, iemi).then(async (data) => {
					dispatch( setBiosUserInfo(biosUser, true) );
					//生物識別成功提示
					setTimeout(() => {
						Alert.alert(
						getState().Language.lang.BiosForLoginPage.BiosSuccessTitle,
						getState().Language.lang.BiosForLoginPage.BiosSuccessTips, 
						[{ text: 'OK',onPress: () => {}}], 
						{ cancelable: false }
						)
					}, 200);
				}).catch((e) => {
					if (e.code == 0) {
						// 在其他地方登入了 直接登出，並清空本地生物認證資訊
						dispatch(setBiosUserInfo({}, false));
						dispatch(logout( e.message ));
					} else {
						//無法連線，請確定網路連線狀況
						setTimeout(() => {
							Alert.alert(
								getState().Language.lang.CreateFormPage.Fail,
								getState().Language.lang.Common.NoInternetAlert, 
								[{ text: 'OK', onPress: () => {}}], 
								{ cancelable: false }
							)
						}, 200);
					}
				});
			}else{
				//存在則提示+保存本地資料
					dispatch( setBiosUserInfo(biosUser, true) );
					//生物識別成功提示
					setTimeout(() => {
						Alert.alert(
						getState().Language.lang.BiosForLoginPage.BiosSuccessTitle,
						getState().Language.lang.BiosForLoginPage.BiosSuccessTips, 
						[{ text: 'OK',onPress: () => {}}], 
						{ cancelable: false }
						)
					}, 200);
			}
		} else {
			UpdateDataUtil.setBiosUserIemi(user, iemi, true).then(async (data) => {
				dispatch(setBiosUserInfo({}, false)); 
				//生物識別取消成功提示
				setTimeout(() => {
					Alert.alert(
						getState().Language.lang.BiosForLoginPage.BiosCancelTitle,
						getState().Language.lang.BiosForLoginPage.BiosCancelTips, 
						[{ text: 'OK', onPress: () => {} }], 
						{ cancelable: false }
					)
				}, 200);
			}).catch((e) => {
				if (e.code == 0) {
					// 在其他地方登入了 直接登出，並清空本地生物認證資訊
					dispatch(setBiosUserInfo({}, false));
					dispatch(logout( e.message ));
				} else {
					//無法連線，請確定網路連線狀況
					setTimeout(() => {
						Alert.alert(
							getState().Language.lang.CreateFormPage.Fail,
							getState().Language.lang.Common.NoInternetAlert, 
							[{ text: 'OK', onPress: () => {}}], 
							{ cancelable: false }
						)
					}, 200);
				}
			})
		}
	}
}

function setBiosUserInfo(biosUser, isServer = true) {
	return {
		type: types.SET_BIOS,
		biosUser,
		isServer
	}
}

function logout(message = null) {
	return {
		type: LoginTypes.UNLOGIN,
		message,
	};
}

/*
export function loadBiosUserInfoState(bios_user) {
	return async dispatch => {
		if (bios_user) {
			dispatch( setBiosUserInfo(bios_user) );
		} else {
	        console.log(e);
		}
	}
}

export function iniBiosUserdata(user,iemi){
	return async dispatch => {
		UpdateDataUtil.setBiosUserIemi(user,iemi,true).then( async (data) => {
			await dispatch(ini_bios());
			dispatch(logout()); //已在其他裝置登入，強制登出
		}).catch((e)=>{
          	console.log(e);
  			if (e.code == "0") {
				// dispatch(logout("你已在其他裝置登入")); //已在其他裝置登入，強制登出
				dispatch(logout()); //已在其他裝置登入，強制登出
			}
        })  
	}
}

export function loadIemiExist(iemi) {
	return async (dispatch, getState) => {

        await UpdateDataUtil.getIemiExist(iemi).then( async (data) => {
		  dispatch(bios_server_exist(data.content)); //結束載入資料畫面
        }).catch((e)=>{
		  dispatch(bios_server_exist(false)); //結束載入資料畫面
        })  
	}
}

function check_pwd_success() {
	return {
		type: types.CHECK_PWD_SUCCESS
	}
}

export function set_bios_type(biosType) {
	return {
		type: types.SET_BIOS_TYPE,
		biosType
	}
}



export function ini_bios() {
	return {
		type: types.RESET_BIOS
	}
}


export function set_bios_iemi(iemi) {
	return {
		type: types.SET_BIOS_IEMI,
		iemi
	}
}














*/


