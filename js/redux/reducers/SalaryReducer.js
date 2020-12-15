import * as types from '../actionTypes/SalaryTypes';

const initialState = {
  isRefreshing    :true,
  salarySelectDays:[],
  salaryData      :{},
  message         :null,
  isSuccess       :true,
};

export default function updateMessage(state = initialState, action = {}) {
  switch (action.type) {
    case types.GET_SALARY_SELECT_DAYS:
      return {
        ...state,
        isSuccess       : true,
        salarySelectDays: action.salarySelectDays,
      };
    case types.SALARY_REFRESHING:
      return {
        ...state,
        isRefreshing: action.isRefreshing,
      };
    case types.GETMISSALAY_SUCCESS:
      return {
        ...state,
        isRefreshing: false,
        isSuccess   : true,
        salaryData  : action.data,
      };
    case types.GETMISSALAY_FAIL:
      return {
        ...state,
        isRefreshing: false,
        isSuccess   : false,
        salaryData  : {},
        message     : action.message,
      };
    default:
      return state;
  }
}