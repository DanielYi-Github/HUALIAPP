import * as types from '../actionTypes/MeetingTypes';

const initialState = {
  isRefreshing                  : false,
  meetingModeTypes              : [],
  actionResult                  : null,
  actionResultMsg               : "",
  meetingList                   : [],
  person_meetingDateTime        : [],
  suggestMeetingDateTime        : [],
  meetingOid                    : "",
  attendees                     : [], // 與會人員
  attendees_startdate           : null,
  attendees_enddate             : null,
  regularMeetingDefaultOptions  : "never",
  regularMeetingOptions         : [],
  regularMeetingEndDate         : null,
  regularMeetingCustomizeOptions: [],
  companies                     : [],
  selectedCompany               : "",
  attendees_by_position         : [],
  organization_tree             : null
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
    case types.MEETING_SET_DEFAULT_MEETION_INFO:
      return {
        ...state,
        meetingOid         :action.oid,
        attendees          :action.attendees,
        attendees_startDate:action.startdate,
        attendees_endDate  :action.enddate
      }
    case types.MEETING_SET_ATTENDEES:
      return{
        ...state,
        attendees          :action.attendees,
      }
    case types.MEETING_SETREGULARMEETINGOPTIONS:
      return{
        ...state,
        regularMeetingDefaultOptions  : action.regularMeetingDefaultOptions,
        regularMeetingOptions         : action.regularMeetingOptions,
        regularMeetingCustomizeOptions: action.regularMeetingCustomizeOptions
      }
    case types.MEETING_SET_COMPANIES:
      return {
        ...state,
        companies:action.companies
      }
    case types.MEETING_SET_ATTENDEES_BY_POSITION:
      return {
        ...state,
        attendees_by_position:action.companies,
        selectedCompany:action.selectedCompany
      }
    case types.MEETING_SET_ORGANIZATION:
      return {
        ...state,
        organization_tree:action.organization,
      }
    default:
      return state;
  }
}