import * as types from '../actionTypes/ReportTypes';

const initialState = {

  isRefreshing: true,

  ReportNewsData:[],
  ReportTypesData:[]

};

export default function submit(state = initialState, action = {}) {
  switch (action.type) {

    case types.LOADREPORTNEWS:
      return {
        ...state,
        ReportNewsData: action.ReportNewsData
      };


    case types.LOADREPORTTYPES:
      return {
        ...state,
        ReportTypesData: action.ReportTypesData
      };

    case types.REFRESH_SUCCESS:
      return {
        ...state,
        isRefreshing: false
      };

    default:
      return state;
  }
}