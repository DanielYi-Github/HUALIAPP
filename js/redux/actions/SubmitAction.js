import * as types from '../actionTypes/SubmitTypes';
import Common              from '../../utils/Common';
import DeviceStorageUtil   from '../../utils/DeviceStorageUtil';
import * as LoggerUtil     from '../../utils/LoggerUtil';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';

/*暫無用到此function*/
export function changePassword(oldPwd, newPwd) {
	return async dispatch => {
		dispatch( submitting() ); //開始顯示載入資料畫面

		oldPwd = Common.encrypt(oldPwd);
		let user = await DeviceStorageUtil.get('User').then((data) => {
		  return data ? JSON.parse(data) : data;
		});

		if (user.password === oldPwd) {
			//更換server密碼

			//更換本機密碼
			user.password = Common.encrypt(newPwd);
			DeviceStorageUtil.set('User', user); //存在客戶端

			dispatch( submitted() );  		//結束載入資料畫面
	        Toast.toastShort("密碼已變更成功");
	        
	        /*
	        *	為了確保Localstorage的User物件與UserInfoReducer的UserInfo state資料相同
	        *	修改密碼完之後需要將User物件傳入UserInfoReducer
	        *	這邊直接調用UserInfoReducer
	        *	讓UserInfoReducer捕獲此action
	        */
	        dispatch( UserInfoReducer_setUserInfo(user) ); 

		} else {
			dispatch( submit_fail() );  	//結束載入資料畫面
        	Toast.toastShort("密碼輸入錯誤");
		}
	}
}

export function submitAdvices(userData, context, contact) {
	return (dispatch, getState) => {
		dispatch( submitting() ); //開始顯示載入資料畫面
		/*server 開始辨識*/
		UpdateDataUtil.setFeedBack(userData, context, contact).then((data)=>{
			if (data.row == 1) {
				dispatch( submitted() );  		//結束載入資料畫面
			} else {
				dispatch( submit_fail() );  	//結束載入資料畫面
			}
		}).catch(()=>{
			dispatch( submit_fail() );  	//結束載入資料畫面
		});
	}
}

/*暫無用到此function*/
export function bindEmail(oldEmail, newEmail) {
	return async dispatch => {
		dispatch( submitting() ); //開始顯示載入資料畫面

		//進行傳值的動作
		let result = true;
		if (result) {
			dispatch( submitted() );  		//結束載入資料畫面
	        Toast.toastShort("Email綁定成功");
		} else {
			dispatch( submit_fail() );  	//結束載入資料畫面
        	Toast.toastShort("Email綁定失敗");
		}
	}
}

function submitting() {
	return {
		type: types.SUBMITTING
	}
}

function submitted() {
	return {
		type: types.SUBMITTED
	}
}

function submit_fail(){
	return {
		type: types.SUBMIT_FAIL
	}
}

/*特殊寫法，刻意讓UserInfoReducer捕捉此action*/
function UserInfoReducer_setUserInfo(data){
	return {
		type: "SET",
		data
	}
}


