import { Alert }  		   from 'react-native';
import RNFetchBlob 		   from 'rn-fetch-blob'
import * as types          from '../actionTypes/LoginTypes';
import * as biometricTypes from '../actionTypes/BiometricTypes';
import User                   from '../../object/User';
import NetUtil                from '../../utils/NetUtil';
import Common                 from '../../utils/Common';
import DeviceStorageUtil      from '../../utils/DeviceStorageUtil';
import * as SQLite            from '../../utils/SQLiteUtil';
import * as UpdateDataUtil    from '../../utils/UpdateDataUtil';
import * as NavigationService from '../../utils/NavigationService';
import * as LoggerUtil        from '../../utils/LoggerUtil';

/***** 查看用哪一種登入方式登入 tab 還是 single *****/
export function loadLoginMode() {
	return async (dispatch, getState) => {
        await UpdateDataUtil.getLoginMode().then( async (data) => {
        	if(data.paramcode=="Y"){
		  		dispatch(setLoginMode("single")); //結束載入資料畫面
        	}else{
		  		dispatch(setLoginMode("tab")); //結束載入資料畫面
        	}
        }).catch((e)=>{
		  dispatch(setLoginMode()); //結束載入資料畫面
        })  
	}
}

function setLoginMode(mode="single") {
	return {
		type: types.LOGIN_MODE,
		mode
	}
}
/***** 登入方式設置結束 *****/

// 查看single登入的帳號是哪一種
export function checkBySingle(userid) {
	return async (dispatch, getState) => {
		let lang = getState().Language.langStatus;		//給定手機語系
        await UpdateDataUtil.getSingleUser(userid,lang).then( async (data) => {
		  	dispatch(setAccountType(data.type));
		  	if (data.type=="EMPID") this.checkEmpidIsFirstLogin(userid, data);
		}).catch((e)=>{
			dispatch(login_done(false, e.message));
		})	
	}
}

// 設定single方式登入帳號是哪一種，如果沒給值表示恢復初始值
export function setAccountType(acctype=null) {
	return {
		type: types.ACCOUNT_TYPE,
		acctype
	}
}

/* 確認是否為工號第一次使用或密碼重置過後登入
 * @Author   Daniel
 * @DateTime 2020-11-10T15:28:42+0800
 * @param    {String}  	empid			
 * @param    {Boolean}	isForget 		用來記錄empid是否啟動忘記密碼流程
 * @param    {Boolean}	isChangePage    紀錄是不是來自切換帳號的地方
 * @return   {[type]}
 */
export function checkEmpidIsFirstLogin(empid, empObject){
	return async(dispatch, getState) => {
		// 該工號第一次使用userinfo 為null 
		// 如果該工號有使用過但重置密碼則userInfo有值而userConfig.reset == "Y"
		let tempReset
		if (empObject.userinfo) {
			tempReset = empObject.userinfo.userConfig.reset == "Y" ? true: false;
		} else {
			tempReset = true;
		}

		dispatch(reset_status(tempReset));
	}
}

//賬號是否進行重置動作
export function reset_status(isReset) {
	return {
		type: types.RESET_STATUS,
		isReset
	}
}

// 用來重置輸入時欄位的初始狀態
export function reset_mix() {
	return {
		type: types.RESET_MIX
	}
}

// 忘記密碼
export function forgetEmpPassword( empid){
	return async (dispatch, getState) => {

		let lang = getState().Language.langStatus;		

		// 獲取驗證方式
		let VerificationType = await UpdateDataUtil.getMBVerifyMode(lang).then( obj => {
			console.log(obj);
			return obj.content.paramsort;
	  	}).catch( e =>{
			return null;
	  	});

		//驗證方式-預設密碼1/短信驗證2
	  	switch(VerificationType) {
	  	  case 1:
  	    	//預設密碼 HR Reset 
  	        Alert.alert(
  	          getState().Language.lang.LoginPage.ForgetPassword,
  	          getState().Language.lang.LoginPage.ForgetPasswordAlertHr
  	        );
	  	    break;
	  	  case 2:
	  	  	//短信驗證 SMS Reset
			NavigationService.navigate('SmsCheck', { empid: empid });
	  	    break;
	  	  default:
	  	  	Alert.alert( 
	  	  	  getState().Language.lang.Common.Error ,    		 //錯誤
	  	  	  getState().Language.lang.Common.NoInternetAlert    //無法連線，請確定網路連線狀況
	  	  	);
	  	}
	}
}

/*****獲取手機驗證簡訊的地區碼*****/
export function loadByAreaData(empid,lang) {
	return (dispatch, getState) => {
		let lang = getState().Language.langStatus;		//給定手機語系
		empid = empid.toUpperCase(); 	//小寫轉大寫

		let obj={
			"token":"",
			"userId":empid,
			"content":""
		}
		UpdateDataUtil.getCountryData(empid,obj,lang).then( async (data) => {
			for(let i in data){
				data[i].show=data[i].paramname+" +"+data[i].paramcode;
			}
			dispatch(loadAreaDataState(data));
		}).catch((e)=>{
			console.log(e);
			dispatch(login_done(false, "error code:502"));  
			dispatch(loadAreaDataState([]));
		})	
	}
}

function loadAreaDataState(areaData){
	return {
		type: types.LOADAREADATA,
		areaData,
	}
}
/*****獲取手機驗證簡訊的地區碼結束*****/

/*****更新empID密碼*****/
// 更新empid密碼
export function updateEmpPwd(empid, newPwd, lang) {
	return async (dispatch, getState) => {
		dispatch(login_doing());
		UpdateDataUtil.getUpdatePwdData(empid, newPwd, lang).then((data) => {
			dispatch({
				type: types.UPDATE_PWD_STATE,
				result: data.content,
				message: data.message
			})
		}).catch((e) => {
			dispatch({
				type: types.UPDATE_PWD_STATE,
				result: false,
				message: data.message
			});
		})
	}
}
// 取消密碼更新狀態
export function cancelEmpidFirstLoginState(){
	return (dispatch, getState) => {
		dispatch(reset_status(false));
	}
}
/*****密碼更新結束*****/

/*****登入方式*****/
export function loginByAD(account, password, biosUserIsChange = false) {
	//AD賬號登錄
	return (dispatch, getState) => {
		dispatch(login_doing());						//開始顯示載入資料畫面
		var user = new User(); 							//使用者初始化
		user.setLoginID(account.toLowerCase());			//大寫轉小寫
		user.setPassword(Common.encrypt(password));
		
		//賬號驗證
		UpdateDataUtil.loginByAD(user).then((data) => {
			user      = data.Value.user;				// 登入成功
			user.lang = getState().Language.langStatus;	//給定手機語系
			this.initialApi(user,"ad");
			dispatch( setBiosUserInfo({}, false) );

		}).catch((e)=>{
			dispatch(login_done(false, e)); 			//登入失敗，顯示訊息  
		})	

	}
}

export function loginByEmpid(empid, passwordEmp, biosUserIsChange = false) {
	return async (dispatch, getState) => {
		dispatch(login_doing()); //開始顯示載入資料畫面

		let lang = getState().Language.langStatus;
		var user = new User(); //使用者初始化
		user.setLoginID(empid); //工號登陸需將login內容改為id內容
		user.setPassword(passwordEmp);

		let loginByEmpidResult = await UpdateDataUtil.loginByEmpid(user, lang).then((data) => {
			return data;
		}).catch((e) => {
			return {
				Message: "Fail_Connect"
			};
		})
		switch (loginByEmpidResult.Message) {
			case "initialEmp":
				// 跳頁至修改密碼畫面				
				NavigationService.navigate('InitialPassword', {
					empid: empid,
					empPassword: passwordEmp,
					basicData: loginByEmpidResult.basicData
				});
				dispatch(login_done(true));
				break;
			case "success":
				dispatch( setBiosUserInfo({}, false) );
				this.initialApi(user, "empid");
				break;
			case "Fail_Connect":
				dispatch(login_done(false, loginByEmpidResult.Message));
				break;
			default:
				dispatch(login_done(false, loginByEmpidResult.message));
		}
	}
}

export function loginByToken(user) {
	return dispatch => {
		//開始顯示載入資料畫面
		dispatch(login_doing());
		UpdateDataUtil.getMBUserInfoByToken(user).then((result) => {

			this.initialApi(user,"token");

	  		DeviceStorageUtil.get('update').then((data) => {
	  		  data = data ? JSON.parse(data) : data;	
	  	      if( data=='Y'){
	  	      	UpdateDataUtil.updateContactToServer(user);  //update本地自己的通訊錄資料
	  	      	UpdateDataUtil.updateMBUserToServer(user);   //update本地ispush跟lang
	  	      	DeviceStorageUtil.set('update','N'); 		 //成功後再改回N
	  	      }
	  	    });
		}).catch((e)=>{
			console.log("e", e);
			dispatch(logout(e, true)); 	//登入失敗，跳至登入頁
		});
	}
}

export function loginByImei(biosInfo,langStatus) {
	return dispatch => {
		//開始顯示載入資料畫面
		dispatch(login_doing());
		UpdateDataUtil.getMBUserInfoByImei(biosInfo,langStatus).then((user) => {
			if (user) {
				this.initialApi(user,"imei");
				DeviceStorageUtil.set('User', user); //存在客戶端
			} else {
				dispatch(login_done(false));  //登入失敗，跳至登入頁
			}
		}).catch((e)=>{	
			dispatch(login_done(false, e));  //登入失敗，跳至登入頁
		});
	}
}

/*****APP登入後進行的一連串配置*****/
export function initialApi(user,way=false){
	return (dispatch, getState) => {
		LoggerUtil.uploadLocalDBErrorLog(user); 	// 將資料庫的log上傳至server

		//運行時間最久，最先執行
  		UpdateDataUtil.updateContact(user); //通訊錄	
  		UpdateDataUtil.updateMSG(user); 	//手機消息-執行最久

  		//首頁必須出現 統一執行
		let arr = [
			UpdateDataUtil.updateAPP(user),
  			UpdateDataUtil.updateNotice(user),		//公告資訊				
  			UpdateDataUtil.updateLanguage(user),    //語系表
  			UpdateDataUtil.updateMasterData(user),  //主資料表
			UpdateDataUtil.updatePermission(user),  //權限資料
			UpdateDataUtil.updateEvent(user),		//事件表   測試機上面暫時沒有這張表 開發基要解除註解
			UpdateDataUtil.updateBanner(user),		//Banner
			UpdateDataUtil.updateModule(user)		//module
  		];

	  	Promise.all(arr).then( async () => {
	        user = certTips(dispatch, getState(), user); //判斷是否進行提示生物識別設定
	  		user = await getUserInfoWithImage(user); 	//處理使用者圖片的後續處理
			dispatch(setUserInfo(user));				//將資料存放在UserInfoReducer的state裡
			dispatch(login_done(true));				    //同步完成，跳至首頁	
			dispatch(setAccountType()); 				//恢復輸入欄位初始值	
			dispatch(cleanLoginChangeAccount()); 		//清除切換帳號的state資訊	
			NavigationService.navigate('HomeTabNavigator', {screen: 'Home'});

	  	}).catch((e)=>{
	  		console.log("e", e);

	  		switch(way) {
	  		  case "token":
	  		    dispatch(logout('code:'+e, true));
	  		    break;
	  		  case "ad":
	  		    dispatch(logout("API Error, Please try it later.", true)); //登入失敗，跳至登入頁
	  		    break;
	  		  case "empid":
	  		    dispatch(logout('code:'+e, true));
	  		    break;
	  		  case "imei":
	  		    dispatch(logout('code:'+e, true)); //登入失敗，跳至登入頁
	  		    dispatch(check_done());
	  		    break;
	  		  default:
	  		    dispatch(logout());
	  		}
	  		LoggerUtil.addErrorLog("LoginAction initialApi", "APP Action", "ERROR", e);
	  		
	  	})	

  		//後期	            
		UpdateDataUtil.updateVisitLogToServer(user);	//update功能訪問數量回Server	  	
  		UpdateDataUtil.updateRead(user);				//訊息讀取表       
		UpdateDataUtil.setLoginInfo(user); 	
	}
}

//判斷是否進行提示生物識別設定
function certTips(dispatch,state,user){
	if(user.certTips=="Y"){
		//Server端修改註記
		UpdateDataUtil.updateCertTips(user).then( async (data) => {
			setTimeout(() => {
		      	Alert.alert(
			        //溫馨提示
			        state.Language.lang.Common.Alert,
			        //是否要删除设备信息
			        state.Language.lang.LoginPage.FirstCertTips,
			        [
			            {text: state.Language.lang.Common.Setting, onPress: () => { NavigationService.navigate('AccountSafe')}},//前往設定
			            {text: state.Language.lang.Common.Cancel, onPress: () => {}, style:'cancel'},//取消
			        ],
			        { cancelable: false }
		    	)
			}, 200);	
		}).catch((e)=>{
	      console.log(e);
	    })  
		user.certTips="N"
	}
	return user;
}

//處理使用者圖片的後續處理
async function getUserInfoWithImage(data){
	if (data.pictureUrl == null) {
		if (data.picture == null || typeof data.picture == "number" ) {
			data.picture = (data.sex == "F") ? require("../../image/user_f.png") : require("../../image/user_m.png")
		}
	} else {
		if (data.pictureUrl.includes("http")) {
			data = await RNFetchBlob.fetch('GET', data.pictureUrl).then((res) => {
				data.picture = { uri: `data:image/png;base64,${res.base64()}`};
				return data;
			}).catch((errorMessage, statusCode) => {
				return data;
			})
		} else {
			data.picture = { uri: `data:image/png;base64,${data.pictureUrl}`};
		}
	}
	
	DeviceStorageUtil.set('User', data); //存在客戶端
	return data;
}

//此function在UserInfoReducer項下
function setUserInfo(data) {	
	return {
		type: 'SET',
		data
	}
}
/*****配置結束*****/


function login_doing() {
	return {
		type: types.LOGIN_DOING
	}
}

// 主要用來顯示輸入畫面登入過程中，發生錯誤所會顯示的訊息資訊，如果登入過程一切順利，result預設為true且message為空
function login_done(result = true, message = null) {
	return {
		type: types.LOGIN_DONE,
		result,
		message
	}
}

// 使用者自行登出APP，系統清出所有分頁，重新從初始化開始
export function userLogout(){
	return (dispatch, getState) => {
		dispatch(
			{
				type: types.UNLOGIN,
				userLogout: true
			}
		);
	}
}

// 主要處理token登入過程中，會發生的錯誤事件，且會強制跳至集團介紹畫面
export function logout(message = null, loginPage = null) {
	return {
		type: types.UNLOGIN,
		message
	};
}

// 清除本地生物識別資料
function setBiosUserInfo(biosUser, isServer = true) {
	return {
		type: biometricTypes.SET_BIOS,
		biosUser,
		isServer
	}
}

// 更換帳號登入切換
export function loginChangeAccount(account, password, checkAccType){
	return (dispatch, getState) => {
		// 先註記需要更換帳號的資訊
		dispatch(
			{
				type: types.LOGIN_CHANGE_ACCOUNT,
				loginChangeUserInfo: {
					account     :account,
					password    :password,
					checkAccType:checkAccType
				}
			}
		);
		
		// 再來進行實際的帳號登出狀況
		dispatch({
			type: types.UNLOGIN,
			userLogout: true,
		});
	}
}

// 清除切換帳號的state資訊
function cleanLoginChangeAccount(){
	return{
		type: types.LOGIN_CHANGE_ACCOUNT,
		loginChangeUserInfo: {}
	}
} 










































function setLang(lang) {
	DeviceStorageUtil.set("locale", lang);
	return {
		type: lang,
	}
}

export function setNoUpdateAlert() {
	return {
		type: types.NOUPDATE,
	};
}

export function set_backButton_status(status) {
	return {
		type: types.BACKBUTTON_STATUS,
		status
	}
}



