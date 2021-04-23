import * as types from '../actionTypes/FormTypes';

const initialState = {
  // 清單畫面
  showFooter  :false,
  FormTypes   :[],
  FormSigns   :[],        // 所有的原始表單
  Companies_FormSign:{
    defaultCO  : false,   //預設辦公室
    companyList: [],      //公司清單
  },

  // 表單畫面
  FormContent        :{},
  FormRecords        :[],
  FormSignBtns       :null,
  isRefreshing       :false,
  isLoadDone         :false,    // 是否已經全部撈取完畢
  isSignDone         :false,    // 簽核過程是否已結束
  submitResult       :null,
  submitResultMessage:null,
  handsign           :null,     // 是否需要手寫板簽名
  showsign           :null,     // 是否需要顯示核決層級
  signresult         :null,     // 是否需要顯示回簽
  allowAddSign       :false,    // 是否需要加簽
  allowAddAnnounce   :false,    // 是否需要加會
  loadMessgae        :null,
  loadMessgaeType    :null,
  bpmImage           :false 
};

export default function Form(state = initialState, action = {}) {
  switch (action.type) {
    case types.FORM_REFRESHING:
      return {
        ...state,
        isRefreshing: true,
        submitResult: null
      };
    case types.LOADFORMTYPES:
      return {
        ...state,
        isRefreshing:false,
        FormTypes   :action.data,
        isLoadDone  :action.isLoadDone,
        loadMessgae :null
      };
    case types.SET_COMPANIES_FORMSIGN: 
      return {
        ...state,
        Companies_FormSign:{
          defaultCO  : action.defaultCO,
          companyList: action.data,   
        },
        isLoadDone  :false,
      }
    case types.LOADFORMSIGNS:
      return {
        ...state,
        isRefreshing:false,
        FormSigns   :action.data,
        isLoadDone  :action.isLoadDone,
      };
    case types.LOADFORMTYPESERROR:
      return {
        ...state,
        loadMessgae:action.message,
        loadMessgaeType: action.message ? state.loadMessgaeType : null,
        isRefreshing:false,
        isLoadDone  :true
      };
    case types.LOADFORMCONTENT:
      return {
        ...state,
        FormContent : action.data,
        FormRecords : action.records,
        FormSignBtns: action.signBtns,
        handsign    : action.handsign,      // 是否需要手寫板簽名
        showsign    : action.showsign,      // 是否需要顯示核決層級
        signresult  : action.signresult,    // 是否需要顯示回簽
        allowAddSign: action.allowAddSign,  // 是否需要加簽
        allowAddAnnounce: action.allowAddAnnounce,  // 是否需要加會
        bpmImage    : action.bpmImage ? action.bpmImage : false ,
        isRefreshing: false,
      };
    case types.UPDATEDEFAULTVALUE_FOR_FORMSIGN:
      return {
        ...state,
        FormContent : action.FormContent,
        loadMessgae : action.isRequiredAlert ? action.isRequiredAlert : null,
        isRefreshing:false,
      };
    case types.UPDATEDEFAULTVALUEERROR_FOR_FORMSIGN:
      return {
        ...state,
        loadMessgae : action.ruleCheckMessage
      };
    case types.SUBMITRESULT:
      /*將已經簽核過的Form從FormSigns裡剃除掉*/
      return {
        ...state,
        isRefreshing       :false,
        isSignDone         :true,
        submitResult       :action.data.content,
        submitResultMessage:action.data.message,
        FormSigns          :action.data.content.success ? removeForm(state.FormSigns, action.form) : state.FormSigns
      };
    case types.INITIALSTATE:
      return {
        ...state,
        FormContent    :{},
        FormRecords    :[],
        FormSignBtns   :null,
        submitResult   :null,
        rejectResult   :null
      };
    case types.FORMSIGNDONE:
      /*確認已經完成簽核過程*/
      return {
        ...state,
        isSignDone  :false,
      };
    case types.DELETEALLFORMS:
      /*刪除所有表單資料*/
      return {
          showFooter  :false,
          FormTypes   :[],
          FormSigns   :[],        // 所有的原始表單
          Companies_FormSign:{
            defaultCO  : false,   //預設辦公室
            companyList: [],      //公司清單
          },
          FormContent :{},
          FormRecords :[],
          FormSignBtns:null,
          isRefreshing:false,
          isLoadDone  :false,  // 是否已經全部撈取完畢
          isSignDone  :false,  // 簽核過程是否已結束
          submitResult:null,
          submitResultMessage:null,
          handsign    :null,    // 是否需要手寫板簽名
          showsign    :null,    // 是否需要顯示核決層級
          signresult  :null,    // 是否需要顯示回簽
          loadMessgae :null,
          bpmImage    :false 
      };
    
    case types.SHOW_FORMLOADMESSAGE:
      return {
          ...state,
          loadMessgae    : action.message,
          loadMessgaeType: action.messageType
      };

    default:
      return state;
  }
}

function removeForm(FormSigns, form){
  let index = FormSigns.indexOf(form);
  FormSigns.splice(index, 1);
  return FormSigns;
}