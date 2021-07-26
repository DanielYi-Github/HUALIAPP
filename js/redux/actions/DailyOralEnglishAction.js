import * as DailyOralEnglishTypes from "../actionTypes/DailyOralEnglishTypes";
import * as SQLite from "../../utils/SQLiteUtil"
import Common from "../../utils/Common";

function loadData(data) {
    return {
        type: DailyOralEnglishTypes.DAILYORALENGLISH_LOADDATA,
        data
    }
}
function loadMoreData(moreData) {
    return {
        type: DailyOralEnglishTypes.DAILYORALENGLISH_LOADMOREDATA,
        moreData
    }
}
function setTotalCount(totalCount) {
    return {
        type: DailyOralEnglishTypes.SET_DAILYORALENGLISH_TOTALCOUNT,
        totalCount
    }
}
function setPageSize(pageSize) {
    return {
        type: DailyOralEnglishTypes.SET_DAILYORALENGLISH_PAGESIZE,
        pageSize
    }
}
function setPageNum(pageNum) {
    return {
        type: DailyOralEnglishTypes.SET_DAILYORALENGLISH_PAGENUM,
        pageNum
    }
}
function setLoading(loading) {
    return {
        type: DailyOralEnglishTypes.SET_DAILYORALENGLISH_LOADING,
        loading
    }
}
//初始化页面资料
export function initDailyOralEnglish() {
    return async (dispatch, getState) => {
        dispatch(setLoading(true))//加载中
        SQLite.selectData("select count(1) as COUNT from THF_DAILY_ORAL_ENGLISH where date(PUSHDATE) <= date('now') and STATUS = 'Y' ", []).then(result => {
            let count = result.raw()[0].COUNT
            dispatch(setTotalCount(count))
            return SQLite.selectData("select * from THF_DAILY_ORAL_ENGLISH where date(PUSHDATE) <= date('now') and STATUS = 'Y' order by date(PUSHDATE) desc limit 0,10 ", [])
        }).then(result => {
            let data = [];
            let raw = result.raw()
            for (let item of raw) {
                item.PUSHDATE = Common.dateFormatNoTime(item.PUSHDATE)
                data.push(item);
            }
            dispatch(loadData(data))
            dispatch(setLoading(false))//加载完成
        })
    }
}
//上拉加载更多资料
export function loadMoreDailyOralEnglishData() {
    return async (dispatch, getState) => {
        dispatch(setLoading(true))//加载中
        let dailyOralEnglishState = getState()['DailyOralEnglish']
        let size = dailyOralEnglishState.pageSize
        let num = dailyOralEnglishState.pageNum
        let totalCount = dailyOralEnglishState.totalCount
        if (size * num >= totalCount) {//如果页数*每页笔数达到或超过总笔数则return
            dispatch(setLoading(false))//加载完成
            return
        }
        let count = num * size
        SQLite.selectData("select * from THF_DAILY_ORAL_ENGLISH where date(PUSHDATE) <= date('now') and STATUS = 'Y' order by date(PUSHDATE) desc limit " + count + "," + size, []).then(result => {
            let data = [];
            let raw = result.raw()
            for (let item of raw) {
                item.PUSHDATE = Common.dateFormatNoTime(item.PUSHDATE)
                data.push(item);
            }
            dispatch(loadMoreData(data))
            dispatch(setPageNum(num + 1))
            dispatch(setLoading(false))//加载完成
        })
    }
}
//退出画面重置页面资料
export function resetDailyOralEnglish() {
    return (dispatch, getState) => {
        let dailyOralEnglishState = getState().DailyOralEnglish
        let size = dailyOralEnglishState['pageSize']
        let data = dailyOralEnglishState['data']
        dispatch(loadData([]))
        dispatch(setTotalCount(size))
        dispatch(setPageNum(1))
    }
}