import * as types from '../actionTypes/HomeTypes';

const initialState = {
  isRefreshing: true,
  isSuccess   : true,
  FunctionData:[],
  FunctionType:[],
 
  NoticeData   :[],
  NoticePage   :0,
  NoticeCount  :0,
  
  NoticeHRData :[],  //人事
  NoticeHRPage :0,
  NoticeHRCount:0,
  
  NoticeFRData :[],  //
  NoticeFRPage :0,
  NoticeFRCount:0,
  
  NoticeITData :[],
  NoticeITPage :0,
  NoticeITCount:0,
  
  NoticeMTData :[],
  NoticeMTPage :0,
  NoticeMTCount:0,
  
  NoticeAGData :[],
  NoticeAGPage :0, 
  NoticeAGCount:0,

  NoticeListState:null
  // changingInfo: ''
};

export default function submit(state = initialState, action = {}) {
  switch (action.type) {

    case types.LOADFUNCTIONTYPE:
      return {
        ...state,
        FunctionType:action.FunctionType
      };
    case types.LOADFUNCTION:
      return {
        ...state,
        FunctionData:action.FunctionData
      };
    case types.LOADNOTICE:
      switch(action.NoticeType)
      {
      case "HR":
        return {
          ...state,
          NoticeHRData:action.NoticeData,
          NoticeHRPage:state.NoticeHRPage+1,
          NoticeHRCount:action.NoticeCount ? action.NoticeCount : state.NoticeHRCount,
          isRefreshing: false,
          isSuccess: true,
        };
        break;
      case "FR":
        return {
          ...state,
          NoticeFRData:action.NoticeData,
          NoticeFRPage:state.NoticeFRPage+1,
          NoticeFRCount:action.NoticeCount ? action.NoticeCount : state.NoticeFRCount,
          isRefreshing: false,
          isSuccess: true,
        };
        break;
      case "IT":
        return {
          ...state,
          NoticeITData:action.NoticeData,
          NoticeITPage:state.NoticeITPage+1,
          NoticeITCount:action.NoticeCount ? action.NoticeCount : state.NoticeITCount,
          isRefreshing: false,
          isSuccess: true,
        };
        break;
      case "MT":
        return {
          ...state,
          NoticeMTData:action.NoticeData,
          NoticeMTPage:state.NoticeMTPage+1,
          NoticeMTCount:action.NoticeCount ? action.NoticeCount : state.NoticeMTCount,
          isRefreshing: false,
          isSuccess: true,
        };
        break;
      case "AG":
        return {
          ...state,
          NoticeAGData:action.NoticeData,
          NoticeAGPage:state.NoticeAGPage+1,
          NoticeAGCount:action.NoticeCount ? action.NoticeCount : state.NoticeAGCount,
          isRefreshing: false,
          isSuccess: true,
        };
        break;
      default:
        return {
          ...state,
          NoticeData:action.NoticeData,
          NoticePage:state.NoticePage+1,
          NoticeCount:action.NoticeCount ? action.NoticeCount : state.NoticeCount,
          isRefreshing: false,
          isSuccess: true,
        };
      }
    case types.LOCKNOTICELISTSTATE:
      return {
        ...state,
        NoticeListState:action.NoticeListState

      }
    case types.CLEANNOTICELISTSTATE:
      return {
        ...state,
        NoticeData   :[],
        NoticePage   :0,
        
        NoticeHRData :[],  //人事
        NoticeHRPage :0,
        
        NoticeFRData :[],  //
        NoticeFRPage :0,
        
        NoticeITData :[],
        NoticeITPage :0,
        
        NoticeMTData :[],
        NoticeMTPage :0,
        
        NoticeAGData :[],
        NoticeAGPage :0, 
      }
    //暫時用不到  
    case types.REFRESHING_CLEARN:
      return {
        ...state,
        isRefreshing: true,
        isSuccess: false,
        NoticeData:[],
        NoticePage:0,
      };
    case types.REFRESHING:
      return {
        ...state,
        isRefreshing: true,
        isSuccess   : false,
      };
    case types.REFRESH_SUCCESS:
      return {
        ...state,
        isRefreshing: false,
        isSuccess: true
      };
    case types.REFRESH_ERROR:
      return {
        ...state,
        isRefreshing: false,
        isSuccess: false
      };
    default:
      return state;
  }
}