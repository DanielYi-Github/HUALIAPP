import * as types from '../actionTypes/UserInfoTypes';

const initialState = {
  UserInfo:{},
  isRefreshing: false,
  isSuccess: true,
  isAppNotificationEnable:false,
  // //for 生物識別
  // BiosUserInfo:{},
  // isRefreshing_bios: false,
  // isSuccess_bios: true
};

export default function updateMessage(state = initialState, action = {}) {
  switch (action.type) {
    case types.SET:
      return {
        ...state,
        UserInfo: action.data,
        isRefreshing: false,
        isSuccess: true,
        isAppNotificationEnable: action.isAppNotificationEnable ? action.isAppNotificationEnable : state.isAppNotificationEnable
      };
    case types.SET_ERROR:
      return {
        ...state,
        isRefreshing: false,
        isSuccess: false
      };
    case types.SET_REFRESHING:
      return {
        ...state,
        isRefreshing: true,
        isSuccess: false
      };
    default:
      return state;
  }
}