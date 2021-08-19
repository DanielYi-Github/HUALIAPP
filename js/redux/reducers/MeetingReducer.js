import * as types from '../actionTypes/MeetingTypes';

const initialState = {
  isRefreshing          : false,
  meetingModeTypes      : [],
  actionResult          : null,
  actionResultMsg       : "",
  meetingList           : [],
  person_meetingDateTime: [],
  suggestMeetingDateTime: [],
  attendees             : [], // 與會人員
  reCircleMeetingOptions : [
    {
      label: "不重複",
      value: "no"
    },
    {
      label: "每天",
      value: "everyday"
    },
    {
      label: "工作日(星期一到五)",
      value: "workingday"
    },
    {
      label: "每週",
      value: "everyweek"
    },
    {
      label: "每月",
      value: "everymonth"
    },
    {
      label: "自定義",
      value: "customize"
    }
  ],
  reCircleMeetingEndDate:null,
  reCircleMeetingCustomizeOptions:[
    {
      label:"週一",
      value:"mon",
      checked:false
    },
    {
      label:"週二",
      value:"tue",
      checked:false
    },
    {
      label:"週三",
      value:"wed",
      checked:false
    },
    {
      label:"週四",
      value:"thr",
      checked:false
    },
    {
      label:"週五",
      value:"fri",
      checked:false
    },
    {
      label:"週六",
      value:"sat",
      checked:false
    },
    {
      label:"週日",
      value:"sun",
      checked:false
    }
  ]
};

export default function index(state = initialState, action = {}) {
  switch (action.type) {
    case types.MEETING_LOADMODETYPE:
      return {
        ...state,
        meetingModeTypes: action.meetingModeTypes,
      };
    case types.MEETING_ACTIONRESULT:
      return {
        ...state,
        actionResult   :action.result,
        actionResultMsg:action.resultMsg,
        meetingList    :action.result? []:state.meetingList,
      }
    case types.MEETING_MODIFYRESULT:
      return {
        ...state,
        actionResult   :action.result,
        actionResultMsg:action.resultMsg,
        meetingList    :action.result.success? []:state.meetingList,
      }
    case types.MEETING_CANCELRESULT:
      return {
        ...state,
        actionResult   :action.result,
        actionResultMsg:action.resultMsg,
        meetingList    :action.result.success? []:state.meetingList,
      }
    case types.MEETING_RESET:
      return {
        ...state,
        isRefreshing    : false,
        meetingModeTypes: [],
        actionResult    : null,
      }
    case types.MEETINGLIST_RESET:
      return {
        ...state,
        meetingList           : [],
      }
    case types.GET_MEETINGS:
      return{
        ...state,
        actionResult          : null,
        actionResultMsg       : "",
        meetingList:action.meetingsResult
      }
    case types.GET_MEETINGSPERSON_DATETIME:
      return{
        ...state,
        person_meetingDateTime:action.meetingsResult,
        actionResult          : null,
        actionResultMsg       : "",
      }
    case types.MEETING_REFRESHING:
      return{
        ...state,
        isRefreshing:action.isRefreshing
      }
    case types.GET_MEETINGS_FREE_DATETIME:
      return{
        ...state,
        suggestMeetingDateTime:action.getFreeDateTimeResult
      }
    case types.MEETING_RESETMEETINGMESSAGE:
      return{
        ...state,
        actionResult          : null,
        actionResultMsg       : "",
      }
    case types.MEETING_SET_ATTENDEES:
      return{
        ...state,
        attendees:action.attendees
      }
    default:
      return state;
  }
}