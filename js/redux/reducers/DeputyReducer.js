import * as types from '../actionTypes/DeputyTypes';

const initialState = {
    deputyBasic:{},
    chansferBasic:{},
    //API資料格式
    deputyID: null,
    deputyName: null,
    deputyRule: false,
    deputyRules: null,
    disableMsgPrompt: false,
    endExecuteTime: null,
    executeDuration: false,
    informID: null,
    informMailMode: false,
    informName: null,
    startExecuteTime: null,
    deputyState: null,
    //各參數對應action
    deputyActionValue: null,
    informActionValue: null,
    rulesMemActionValue: null,
    deputyWay: null,
    isLoading: true,
    //各參數初始化      
    deputyRuleComParam: false,
    relationParam: null,
    condition1Param: null,
    deputyWayParam: null,
    MapCategoryParam: null,
    MapParam: null,
    mixParam: null,
    msgState: null
};

export default function submit(state = initialState, action = {}) {
  switch (action.type) {

    case types.DEPUTYTIP:
      return {
        ...state,
        msgState: action.msg
      };

    case types.ISLOADING:
      return {
        ...state,
        isLoading: action.flag
      };

    case types.SET_DEPUTYRULES:
      return {
        ...state,
        deputyRules: action.deputyRulesObj
      };

    case types.SET_DISABLEMSGPROMPT:
      return {
        ...state,
        disableMsgPrompt: action.flag
      };

    case types.SET_MSGMEMBER:
      return {
        ...state,
        informID: action.id,
        informName: action.name
      };

    case types.SET_INFORMMAILMODE:
      return {
        ...state,
        informMailMode: action.flag
      };

    case types.SET_DEPUTYMEMBER:
      return {
        ...state,
        deputyID: action.id,
        deputyName: action.name
      };

    case types.SET_ENDEXECUTETIME:
      return {
        ...state,
        endExecuteTime: action.timeObj
      };

    case types.SET_STARTEXECUTETIME:
      return {
        ...state,
        startExecuteTime: action.timeObj
      };

    case types.SET_EXECUTEDUATION:
      return {
        ...state,
        executeDuration: action.flag
      };

    case types.SET_DEPUTYWAY:
      return {
        ...state,
        deputyWay: action.deputyWayObj,
        deputyRule:action.deputyRule
      };

    case types.INIT_OTHER:
      return {
        ...state,
        deputyWay: action.iniOtherObj.deputyWay,
        startExecuteTime: action.iniOtherObj.startExecuteTime,
        endExecuteTime: action.iniOtherObj.endExecuteTime,
        deputyActionValue: action.iniOtherObj.deputyActionValue,
        informActionValue: action.iniOtherObj.informActionValue,
        rulesMemActionValue: action.iniOtherObj.rulesMemActionValue
      };

    case types.TRANSFER_BASIC:
      return {
        ...state,
        deputyID: action.deputyClone.deputyID,
        deputyName: action.deputyClone.deputyName,
        deputyRule: action.deputyClone.deputyRule,
        executeDuration: action.deputyClone.executeDuration,
        informID: action.deputyClone.informID,
        deputyState: action.deputyClone.state,
        informMailMode: action.deputyClone.informMailMode,
        disableMsgPrompt: action.deputyClone.disableMsgPrompt,
        deputyRules: action.deputyClone.deputyRules,
        informName: action.deputyClone.informName,
        chansferBasic: action.deputyClone,
      };

    case types.MAPINIT:
      return {
        ...state,
        MapCategoryParam: action.MapCategoryParam,
        MapParam: action.MapParam,
      };

    case types.DEPUTYPARAM:
      return {
        ...state,
        relationParam: action.paramObj.relationParam,
        condition1Param: action.paramObj.condition1Param,
        deputyWayParam: action.paramObj.deputyWayParam,
        deputyRuleComParam: action.paramObj.deputyRuleComParam,
        mixParam: action.paramObj.mixParam
      };

    case types.DEPUTYBASIC:
      return {
        ...state,
        deputyBasic: action.deputyBasic
      };


    default:
      return state;
  }
}