import * as types from '../actionTypes/DocumentTypes';

const initialState = {

  isRefreshing: true,

  GroupFileNewsData:[],
  GroupFileTypesData:[]

};

export default function submit(state = initialState, action = {}) {
  switch (action.type) {

    case types.LOADGROUPFILESNEWS:
      return {
        ...state,
        GroupFileNewsData: action.GroupFilesNewsData
      };


    case types.LOADGROUPFILETYPES:
      return {
        ...state,
        GroupFileTypesData: action.GroupFileTypesData
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