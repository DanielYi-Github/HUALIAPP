import * as types from '../actionTypes/BirthdayTypes';

const initialState = {

  isRefreshing_Week: true,
  isRefreshing_Msg: true,

  BirthdayWeekData:[],

  BirthdayMineData:[]

};

export default function submit(state = initialState, action = {}) {
  switch (action.type) {

    case types.LOADBIRTHDAYWEEKDATA:
      return {
        ...state,
        BirthdayWeekData: action.BirthdayWeekData
      };

    case types.LOADBIRTHDAYMINEDATA:
      return {
        ...state,
        BirthdayMineData: action.BirthdayMineData
      };

    case types.REFRESH_WEEK_SUCCESS:
      return {
        ...state,
        isRefreshing_Week: false
      };    
    case types.REFRESH_MSG_SUCCESS:
      return {
        ...state,
        isRefreshing_Msg: false
      };
    case types.PERSONALBIRTHDATDATAUPDATE:
      return {
        ...state,
        BirthdayWeekData: action.list
    };
    default:
      return state;
  }
}