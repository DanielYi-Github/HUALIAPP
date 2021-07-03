import * as types from "../actionTypes/DailyOralEnglishTypes";

const initialState = {
    data: [], //资料列表
    totalCount: 0, //资料总笔数
    pageSize: 10, //一页笔数
    pageNum: 1, //页数
    loading: true, //加载状态
}

export default function index(state = initialState, action = {}) {
    switch (action.type) {
        case types.DAILYORALENGLISH_LOADDATA:
            return {
                ...state,
                data: action.data
            }
        case types.SET_DAILYORALENGLISH_TOTALCOUNT:
            return {
                ...state,
                totalCount: action.totalCount
            }
        case types.SET_DAILYORALENGLISH_PAGESIZE:
            return {
                ...state,
                pageSize: action.pageSize
            }
        case types.SET_DAILYORALENGLISH_PAGENUM:
            return {
                ...state,
                pageNum: action.pageNum
            }
        case types.SET_DAILYORALENGLISH_LOADING:
            return {
                ...state,
                loading: action.loading
            }
        case types.DAILYORALENGLISH_LOADMOREDATA:
            return{
                ...state,
                data:state.data.concat(action.moreData)
            }
        default:
            return state
    }
}

