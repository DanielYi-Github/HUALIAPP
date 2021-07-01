import * as types from '../actionTypes/MeetingTypes';

const initialState = {
  isRefreshing          : false,
  meetingModeTypes      : [],
  actionResult          : null,
  actionResultMsg       : "",
  meetingList           : [],
  person_meetingDateTime: [],
  suggestMeetingDateTime: []
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
        meetingList:action.meetingsResult
      }
    case types.GET_MEETINGSPERSON_DATETIME:
      return{
        ...state,
        person_meetingDateTime:action.meetingsResult
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
    default:
      return state;
  }
}