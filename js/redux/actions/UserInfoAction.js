import { Alert }           from 'react-native';
import * as types          from '../actionTypes/UserInfoTypes';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';
import * as LoggerUtil     from '../../utils/LoggerUtil';
import DeviceStorageUtil   from '../../utils/DeviceStorageUtil';
import * as NavigationService   from '../../utils/NavigationService';
import MessageRouter       from '../../utils/MessageRouter';
import Common              from '../../utils/Common';
import ToastUnit 		   from '../../utils/ToastUnit';

export function loadUserInfoState(user) {
	return async dispatch => {
		if (user) {
			dispatch( setUserInfo(user) );
		} else {
			console.log("User本地資料有錯");
		}
	}
}

export function updateUserdata(user, id, context, detectAppNotificationEnable = null) {
	return async (dispatch, getState) => {
		dispatch(refreshing());

		user[id] = context;
		
		// Email欄位名稱轉換
		if (id != "lang"){
			await UpdateDataUtil.setContact( 
				user, 
				id == "email" ? "MAIL" : id, 
				context
			); //寫進本地DB表裡面	
		}

		if (getState().Network.networkStatus) {
			UpdateDataUtil.updateContactToServer(user).catch( e => {
				dispatch( setUser_error() )
			});
			UpdateDataUtil.updateMBUserToServer(user).catch( e => {
				dispatch( setUser_error() )	
			})
		} else {
			DeviceStorageUtil.set('update', 'Y');
		}

		user[id] = (id == "picture") ? {uri: `data:image/png;base64,${context}`} : context;

		await DeviceStorageUtil.set('User', user); //資料大於2M其實就存不進去

		dispatch(setUserInfo(user, detectAppNotificationEnable)); //結束載入資料畫面
	}
}

export function updateUserIsNotificationEnable(user, id, context, detectAppNotificationEnable = null) {
	return async (dispatch, getState) => {
		dispatch(refreshing());

		user[id] = context;
		if (getState().Network.networkStatus) {
			UpdateDataUtil.updateMBUserNotificationEnable(user).catch( e => {
				dispatch( setUser_error() )
			});
		} else {
			DeviceStorageUtil.set('update', 'Y');
		}
		await DeviceStorageUtil.set('User', user); //資料大於2M其實就存不進去
		dispatch(setUserInfo(user, detectAppNotificationEnable)); //結束載入資料畫面
	}
}

export function updateUserImage(user, id, context) {
	return async (dispatch, getState) => {
		dispatch(refreshing());
		user[id] = context;
		await UpdateDataUtil.setContact(user, id, context); //本地資料更新 

		if (getState().Network.networkStatus) {
			UpdateDataUtil.updateContactImageToServer(
				user,
				getState().Language.langStatus,
				context
			).then( async (data) => {
				user.pictureUrl = data.content;
				user[id] = { uri: `data:image/png;base64,${context}`};
				await DeviceStorageUtil.set('User', user); 				//資料大於2M其實就存不進去
				dispatch(setUserInfo(user)); 							//結束載入資料畫面
			}).catch((e) => {
				if (e.code == 0) {
					dispatch(logout());
      				ToastUnit.show('error', getState().Language.lang.Common.TokenTimeout);//使用者Token已過期，請重新登入!
				} else {
					dispatch(setUser_error()); 								//結束載入資料畫面
				}
			})
		} else {
			DeviceStorageUtil.set('update', 'Y');
			user[id] = { uri: `data:image/png;base64,${context}`};
			await DeviceStorageUtil.set('User', user); 					//資料大於2M其實就存不進去
			dispatch(setUserInfo(user)); 								//結束載入資料畫面
		}
	}
}

//修改密码action
export function updataPassword(newPassword, user, lang) {
	return async (dispatch, getState) => {
			UpdateDataUtil.getUpdatePwdData(user.id, newPassword, user.lang).then((data)=>{
				if (data.code==200) {
					user.password = Common.encrypt(newPassword);
					DeviceStorageUtil.set('User', user); //存在客戶端	        
		        	dispatch(setUserInfo(user) ); 
		        	Alert.alert(
		        	 	lang.InitialPasswordPage.UpdateResult,
		        	 	lang.InitialPasswordPage.ModifySuccess,
	                 	[{text:lang.InitialPasswordPage.Confirm, onPress:this.confirm=()=>{NavigationService.goBack()}}]
	                );
				}else{
					Alert.alert(
		        	 	lang.InitialPasswordPage.UpdateResult,
		        	 	lang.InitialPasswordPage.ModifyDefeat,
	                 	[{text:lang.InitialPasswordPage.Confirm, onPress:this.confirm=()=>{}}]
	                );
				}	
			});
        }
}

// 更新会议通知助手设定数据
export function updateMeetingAssistantData(user, lang, idArr, contextObj) {
	return async (dispatch, getState) => {
		if (getState().Network.networkStatus) {
			UpdateDataUtil.updateMeetingAssistant(user, contextObj).then((result)=>{
				// 组合新的user资料
				for(let i=0 ; i<idArr.length ; i++) {
					let id = idArr[i];
					user.userConfig[id] = contextObj[id];
				}
				DeviceStorageUtil.set('User', user); 					//更新本地Storage资料
				dispatch(setUserInfo(user)); 							//更新redux资料
				console.log('updateMeetingAssistant', result);
			}).catch((e) => {
				console.log('updateMeetingAssistant', e);
			})
		} else {
			Alert.alert(
				lang.Common.Alert,
				lang.Common.InternetAlert,
				[{text:lang.InitialPasswordPage.Confirm, onPress:this.confirm=()=>{NavigationService.goBack()}}]
		   );
		}
	}
}

function refreshing() {
	return {
		type: types.SET_REFRESHING
	}
}

function setUserInfo(data, isAppNotificationEnable = null) {
	return {
		type: types.SET,
		data,
		isAppNotificationEnable
	}
}

function setUser_error(){
	return {
		type: types.SET_ERROR
	}
}

export function getIsAppNotificationEnable(user){
	return async (dispatch, getState) => {
		
		let isAppNotificationEnable = await MessageRouter.getIsAppNotificationEnable().then((result)=>{
		  return result;
		});
		
		if (!isAppNotificationEnable) user.isPush = 'N';

		dispatch(setUserInfo(user, isAppNotificationEnable));
    }
}

function logout(message = null) {
	return {
		type: "UNLOGIN",
		message
	};
}
