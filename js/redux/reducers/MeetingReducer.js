import * as types from '../actionTypes/MeetingTypes';

const initialState = {
  isRefreshing          : false,
  meetingModeTypes      : [],
  actionResult          : null,
  actionResultMsg       : "",
  meetingList           : [],
  person_meetingDateTime: []
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
        actionResultMsg:action.result? "":action.resultMsg,
        meetingList    :action.result? []:state.meetingList,
      }
    case types.MEETING_MODIFYRESULT:
      return {
        ...state,
        actionResult   :action.result,
        actionResultMsg:action.result? "":action.resultMsg,
        meetingList    :action.result? []:state.meetingList,
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
    default:
      return state;
  }
}