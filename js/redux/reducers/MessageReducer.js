import * as types from '../actionTypes/MessageTypes';

const initialState = {
  Total: 0,
  Page: 0,
  Message: [],
  UnMessage: [],
  showFooter: false,
  isRefreshing: false,
  isSuccess: true,
};

export default function updateMessage(state = initialState, action = {}) {
  switch (action.type) {
    case types.MESSAGE_REFRESHING:
      return {
        ...state,
        Total: 0,
        Page: 0,
        Message: [],
        showFooter: false,
        isRefreshing: true,
        isSuccess: false,
      };
    case types.SHOWFOOTER:
      return {
        ...state,
        showFooter: true,
      };
    case types.LOADINITIAL:
      return {
        ...state,
        Page: state.Page + 1,
        Total: action.allReads.length,
        Message: action.allReads,
        UnMessage: action.unReads,
        showFooter: true,
        isRefreshing: false,
        isSuccess: true,
      };
    case types.LOADMORE:
      return {
        ...state,
        Page: state.Page + 1,
        Total: action.data.length,
        Message: action.data,
        showFooter: true,
        isRefreshing: false,
        isSuccess: true,
      };
    case types.STATE_UPDATE:
      return {
        ...state,
        Message: action.newMessage,
      };
    case types.REMOVE_UNREAD:
      state.UnMessage.splice(action.index, 1);
      return {
        ...state,
        UnMessage: state.UnMessage,
      };
    case types.REMOVE_ALLUNREAD:
      return {
        ...state,
        UnMessage: [],
      };
    default:
      return state;
  }
}