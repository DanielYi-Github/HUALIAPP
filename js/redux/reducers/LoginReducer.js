import RNFetchBlob from 'rn-fetch-blob';
import * as types from '../actionTypes/LoginTypes';
import * as SQLite from '../../utils/SQLiteUtil';
import * as NavigationService from '../../utils/NavigationService';
import DeviceStorageUtil from '../../utils/DeviceStorageUtil';
import MessageRouter     from '../../utils/MessageRouter';

const initialState = {
  mode                     : null,    // 設定是用哪一種登入型態tab或single
  checkAccType             : null,    // 用以確認目前登入的帳號型態
  areaData                 : [],      // 簡訊身份驗證時所撈取的地區碼資料
  is_EMPID_Reset           : false,   // 判斷EMPID是否屬於重置狀態
  is_EMPID_ForgetPwd_Show  : false,   // 判斷EMPID登入下的情況，忘記密碼是否顯示
  showUpdatePasswordMessage: null,    // 用來顯示密碼更新相關資訊(大部分由ＥＭＰ帳號使用)
  loginPageMasking         : false,
  isLogin                  : false,
  loadingInfo              : null,    // 用來顯示登入時的相關資訊
  logoutInfo               : null,    // 用來顯示強制登出時的相關資訊
  showUpdateMessage        : true,    // 控制APP初始化時，是否要顯示更新資訊
  loginChangeUserInfo      : {},       // 切換帳號時所記錄的帳號資訊
  enableAppInitialFunction : true,     // 是否要進行APP初始化運行
  jpushRegistrationID      : null,    // Jpush的註冊ID
  
};

export default function login(state = initialState, action = {}) {
  switch (action.type) {
    // 決定何種方式進行登入
    case types.LOGIN_MODE:
      return {
        ...state,
        mode: action.mode
      };
    // 取得Jpush的註冊ID
    case types.JPUSH_REGISTRATION_ID:
      return {
        ...state,
        jpushRegistrationID: action.registerID
      };
    // 登入的帳號是屬哪一種類別ＡＤ或ＥＭＰ
    case types.ACCOUNT_TYPE:
      return {
        ...state,
        checkAccType: action.acctype,
      };
    // empid密碼是否需要進行重新設置
    case types.RESET_STATUS:
      return {
        ...state,
        is_EMPID_Reset: action.isReset,
        is_EMPID_ForgetPwd_Show: action.isReset ? false : true,
        showUpdatePasswordMessage: null
      };
    // 顯示empid密碼是否更新成功
    case types.UPDATE_PWD_STATE:
      return {
        ...state,
        loginPageMasking         : false,
        loadingInfo              : action.result ? null : action.message,
        showUpdatePasswordMessage: action.result,
      }
    // 獲取簡訊驗證時，所需進行選擇的電話區域碼
    case types.LOADAREADATA:
      return {
        ...state,
        areaData: action.areaData,
      };
    // 重設所有全部登入過程中的顯示狀態
    case types.RESET_MIX:
      return {
        ...state,
        loginPageMasking         : false,
        loadingInfo              : null,
        logoutInfo               : null,
        is_EMPID_Reset           : false,
      };
    case types.LOGIN_DOING:
      return {
        ...state,
        loginPageMasking: true,
        loadingInfo: null,
        logoutInfo : null,  
      };
    case types.LOGIN_DONE:
      return {
        ...state,
        loginPageMasking: false,
        isLogin         : action.result,
        loadingInfo     : action.message,
      };
    // 登出
    case types.UNLOGIN:
      MessageRouter.removeMessageListener();     //移除訊息監聽

      let deleteTables = [
        "DELETE FROM THF_APP",
        "DELETE FROM THF_APPINFO",
        "DELETE FROM THF_APPVISITLOG",
        "DELETE FROM THF_LOG",
        "DELETE FROM THF_LANGUAGE",
        "DELETE FROM THF_MASTERDATA",
        "DELETE FROM THF_MSG",
        "DELETE FROM THF_MSG_USERREAD",
        "DELETE FROM THF_NOTICE",
        "DELETE FROM THF_CONTACT",
        "DELETE FROM THF_BANNER",
        "DELETE FROM THF_EVENT",
        // "DELETE FROM THF_VERSION"
      ];

      SQLite.cleanTableData(deleteTables).then( async () => {
        await DeviceStorageUtil.remove('User');

        if (action.userLogout) {
          NavigationService.goBackToTop();  // 人為登出
        } else {
          NavigationService.navigate('IntroductionDrawer'); // token出錯登出
        }
      }).catch((e)=>{
        console.log("資料庫清空失敗",e);        
      });
      
      return {
        ...state,
        loginPageMasking: false,
        isLogin: false,
        logoutInfo: action.message ? action.message : null,
        checkAccType: null,
      };
      
    // 切換帳號
    case types.LOGIN_CHANGE_ACCOUNT:
      return{
        ...state,
        loginChangeUserInfo: action.loginChangeUserInfo,
      }
    case types.NOUPDATE:
      return {
        ...state,
        showUpdateMessage: false,
      };

    // 是否運行APP初始化程序
    case types.ENABLE_APP_INITIAL:
      return {
        ...state,
        enableAppInitialFunction: action.enable,
      };
    default:
      return state;
  }
}