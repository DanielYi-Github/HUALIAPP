import * as types from '../actionTypes/BiometricTypes';
import DeviceStorageUtil from '../../utils/DeviceStorageUtil';

const initialState = {

  //for 生物識別
  biosSupport  :false,   // 手機是否支持生物識別
  biosType     :'',      // 支持生物識別類型
  iemi         :'',      // 全球唯一設備使用碼
  errorMsg     :null,    // 生物識別檢測錯誤訊息
  isServerExist:false,   // server上是否有存在用戶的指紋資訊
  version      :0,       // 手機目前系統版本

  biosUser     :{           // 用來記錄生物識別認證啟用的個人資訊
    biometricEnable:false,  // 紀錄該用戶是否啟用生物識別
    userID         :null,
    pictureUrl     :null,
    sex            :'M',
    iemi           :null
  },      
  // biosReset    :false,

};

export default function biometricReducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.BIOS_STATUS:
      return {
        ...state,
        biosSupport: action.available,
        biosType   : action.biometryType,
        iemi       : action.iemi,
        version    : action.systemVersion
      };
    case types.SET_ERROR_MSG:
      return {
        ...state,
        biosSupport: action.available,
        errorMsg: action.errorMsg,
        version: action.systemVersion
      };    
    case types.SET_BIOS:
      if (action.isServer) {
        DeviceStorageUtil.set('UserBiometricInfomation', action.biosUser);
      } else {
        DeviceStorageUtil.remove('UserBiometricInfomation');
      }
      return {
        ...state,
        biosUser: action.biosUser,
        isServerExist: action.isServer
      };
    case types.BIOS_SERVER_EXIST:
      return {
        ...state,
        isServerExist: action.isExist
      }; 
          
    /*
    
    case types.SET_BIOS_IEMI:
      return {
        ...state,
        iemi: action.iemi
      };    
    case types.SET_BIOS:
      let biosSupport=false;
      if(action.data!={}){
       biosSupport=true;
      }
      return {
        ...state,
        BiosUser: action.data,
        biosSupport: biosSupport,
        isServerExist: action.isServer
      };    
    

    case types.RESET_BIOS:
      DeviceStorageUtil.remove('BiosUser');
      return {
        ...state,
        BiosUser: {},
        isServerExist:false,
        biosReset:true
      };  
    case types.BIOS_SERVER_EXIST:
      return {
        ...state,
        isServerExist: action.isExist
      }; 
    case types.SET_VERSION:
      return {
        ...state,
        version: action.version
      }; 
    */
    default:
      return state;
  }
}