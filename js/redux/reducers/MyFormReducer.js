import * as types from '../actionTypes/MyFormTypes';

const initialState = {
  showFooter     : false,
  FormSelectState: [],
  FormTypes      : [],
  Forms          : [],
  FormContent    : {},
  FormRecords    : [],
  bpmImage       : false,
  isRefreshing   : true,
  isSuccess      : true,
  loadMessgae    : null,
};

export default function MyForm(state = initialState, action = {}) {
  switch (action.type) {
    case types.MYFORM_REFRESHING:
      return {
        ...state,
        Forms:[],
        isRefreshing: true,
        showFooter: false,
        loadMessgae:null
      };
    case types.LOADMYFORMTYPES:
      return {
        ...state,
        FormTypes:[...initialState.FormTypes,...action.data],
        // isRefreshing: false,
      };
    case types.LOADMYFORMSELECTSTATE:
      return {
        ...state,
        FormSelectState:action.selectFormState
      };
    case types.LOADMYFORMS:
      return {
        ...state,
        Forms: action.data,
        isRefreshing: false,
        showFooter: true,
      };
    case types.LOADMYFORMSERROR:
      return {
        ...state,
        isRefreshing: false,
        showFooter: true,
        loadMessgae:action.message? action.message : "Loading Error"
      };
    case types.MYFORMCONTENT_REFRESHING:
      return {
        ...state,
        isRefreshing:true,
      }
    case types.LOADMYFORMCONTENT:
      return {
        ...state,
        isRefreshing:false,
        FormContent :action.data,
        FormRecords :action.records,
        bpmImage    :action.bpmImage ? action.bpmImage : false,
      };
    /*
    case types.STATE_UPDATE:
      return {
        ...state,
        Message: action.data,
      };
    */
    default:
      return state;
  }
}