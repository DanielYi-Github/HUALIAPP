import * as types from '../actionTypes/CommonTypes';

const initialState = {
  loading  : false,
  loadDone : false,
  isSuccess: false,
  loadedMsg: null,
  Companies_Contact:{
    defaultCO    : false, //預設辦公室
    companyList  : [],    //公司清單
  },
  Companies_Car:{
    defaultCO    : false, //預設辦公室
    companyList  : [],    //公司清單
  },
  Companies_Hr:{
    defaultCO    : false, //預設辦公室
    companyList  : [],    //公司清單
  },
  isDirectionNavigate  :false,
  directionType        :null,
  directionValue       :null,
  keywordSearchResult  :[],
  notificationType     :null,
  notificationContent  :null,
  waterViewConfig      :[],
  bannerImages         :[],     //首頁banner的圖片資料
  turnOnAppleVerify    :false,  //蘋果驗證機制
  IntroductionDrawerPages:[],   //公開畫面參數
  IntroductionPageContent:[],   //公開畫面-集團介紹顯示內容參數
  enableAuthentication :false,
  isAuthenticateApprove:false,
  navigatePage         :null,
  enableScreenShot     :false,
  isShowAndroidChangeAPPMessage:false
};

export default function common(state = initialState, action = {}) {
  switch (action.type) {
    case types.LOADING:
      return {
        ...state,
      };
    case types.SET_COMPANIES_CONTACTCO:
      return {
        ...state,
        loadDone:true,
        Companies_Contact:{
          companyList  : action.data.data,
          defaultCO    : action.data.defaultCO, 
        }
      };
    case types.SET_COMPANIES_CARCO:
      return {
        ...state,
        loadDone:true,
        Companies_Car:{
          companyList  : action.data.data,
          defaultCO    : action.data.defaultCO, 
        }
      };
    case types.SET_COMPANIES_HRCO:
      return {
        ...state,
        loadDone:true,
        Companies_Hr:{
          companyKeyList  : action.data.dataKey,
          companyValueList  : action.data.dataValue,
          defaultKey    : action.data.defaultKey, 
          defaultValue    : action.data.defaultValue
        }
      };
    case types.DIRECT_PAGE:
      return {
        ...state,
        isDirectionNavigate:true,
        directionType:action.data.type,
        directionValue:action.data.data
      };
    case types.DISDIRECT_PAGE:
      return {
        ...state,
        isDirectionNavigate:false,
        directionType:null,
        directionValue:null
      };
    case types.KEYWORDSEARCHING:
      return {
        ...state,
        loading:true,
        keywordSearchResult:[]
      };
    case types.KEYWORDSEARCHED:
      return {
        ...state,
        loading:false,
        keywordSearchResult:action.filteredData
      };
    case types.KEYWORDCLEAN:
      return {
        ...state,
        loading:false,
        keywordSearchResult:[]
      };
    case types.REMOVERESULTINFAIDPAGE:
      state.keywordSearchResult[action.sectionIndex].data.splice(action.index, 1);
      return {
        ...state,
        keywordSearchResult:state.keywordSearchResult
      };
    case types.STORENOTIFYCONTNT:
      return {
        ...state,
        notificationType: action.messageType,
        notificationContent: action.messageContent
      };
    case types.CLEANNOTIFYCONTNT:
      return {
        ...state,
        notificationType: null,
        notificationContent: null
      };
    case types.SET_WATERMARKVIEW_CONFIG:
      return {
        ...state,
        waterViewConfig:action.data
      }
    case types.SETAPPLEVERIFYSTATE:
      return {
        ...state,
        turnOnAppleVerify:action.isTurnOnAppleVerify
      }
    case types.SET_BANNERIMAGES:
      return {
        ...state,
        bannerImages:action.data
      }
    case types.SET_INTRODUCTION_DRAWER_PAGES:
      return {
        ...state,
        IntroductionDrawerPages:action.IntroductionDrawerPages
      }
    case types.SET_INTRODUCTIONPAGE_CONTENT:
      return {
        ...state,
        IntroductionPageContent:action.IntroductionPageContent
      }
    case types.ACTIVATE_AUTHENTICATION:
      return {
        ...state,
        enableAuthentication:true,
        navigatePage:action.navigatePage
      }
    case types.CLOSE_AUTHENTICATION:
      return {
        ...state,
        enableAuthentication:false,
        navigatePage:action.navigatePage
      }
    case types.AUTHENTICATE_APPROVE:
      return {
        ...state,
        enableAuthentication:false,
        isAuthenticateApprove:true 
      }
    case types.AUTHENTICATE_DISAPPROVE:
      return {
        ...state,
        isAuthenticateApprove:false,
        navigatePage         :null
      }
    case types.ENABLE_SCREENSHOT:
      return {
        ...state,
        enableScreenShot:action.isEnable
      }
    case types.SHOW_ANDROID_CHANGE_APP_MESSAGE:
      return {
        ...state,
        isShowAndroidChangeAPPMessage:action.result
      }
    default:
      return state;
  }
}