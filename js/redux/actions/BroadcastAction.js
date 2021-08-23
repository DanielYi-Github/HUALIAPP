import * as BroadcastTypes from "../actionTypes/BroadcastTypes"
import * as SQLite from "../../utils/SQLiteUtil"

//加载广播资料 action creator
function loadData(data) {
    return {
        type: BroadcastTypes.BROADCAST_LOADDATA,
        data
    }
}

export function initBroadcastData() {
    return async (dispatch, getState) => {
        let state = getState()
        let lang = state.Language.langStatus
        //APP类型
        let appSql = `select a.CLASS2,ifnull(c.LANGCONTENT,b.NAME) as TITLE,ifnull(d.LANGCONTENT,a.CONTENT) as CONTENT,a.CLASS4,a.CLASS5,a.SORT
                    from THF_MASTERDATA a
                    join THF_APP b on a.CLASS2 = b.ID
                    left join THF_LANGUAGE c on b.LANGID = c.LANGID and c.LANGTYPE = '${lang}'
                    left join THF_LANGUAGE d on a.LEN = d.LANGID and d.LANGTYPE = '${lang}'
                    where a.CLASS1 = 'Broadcast' and a.CLASS3 = 'APP' and a.STATUS = 'Y' `
        //MSG类型
        let msgSql = `select a.CLASS2,ifnull(ifnull(b.LANGCONTENT,c.LANGCONTENT),a.CLASS2) as TITLE,ifnull(d.LANGCONTENT,a.CONTENT) as CONTENT,a.CLASS4,a.CLASS5,a.SORT
                    from THF_MASTERDATA a
                    left join THF_LANGUAGE b on a.CLASS2 = b.LANGID and b.LANGTYPE = '${lang}'
                    left join THF_LANGUAGE c on a.CLASS2 = c.LANGID and c.LANGTYPE = 'zh-CN'
                    left join THF_LANGUAGE d on a.LEN = d.LANGID and d.LANGTYPE = '${lang}'
                    where a.CLASS1 = 'Broadcast' and a.CLASS3 = 'MSG' and a.STATUS = 'Y' and a.OID in(
                        select DATA_OID from THF_PERMISSION where DATA_TYPE = 'masterdata'
                    ) `
        let sql = `select * from (
                    ${appSql} union all ${msgSql}
                    ) order by SORT`
        SQLite.selectData(sql, []).then(result => {
            let raw = result.raw()
            let data = filterBroadCast(raw, state)//过滤广播内容
            dispatch(loadData(data))
        })
    }
}

//过滤广播内容
function filterBroadCast(data, state) {
    let newData = []
    for (const item of data) {
        let id = item.CLASS2
        let newItem
        //判断生日内容是否显示
        switch (id) {
            case "birthday":
                newItem = Object.assign({}, item)
                let birthday = state.UserInfo.UserInfo.birthday
                // let birthday = '2021/08/17'
                if (checkBirthday(birthday)) {
                    newData.push(newItem)
                }
                break
            default:
                newItem = Object.assign({}, item)
                newData.push(newItem)
                break
        }
    }
    return newData
}

//检查今天是否是生日
function checkBirthday(birthday) {
    birthday = birthday ? birthday : ''
    if (birthday == '') {
        return false
    }
    let timestamp = Date.parse(birthday.replace(/-/g, "/"))
    let bDate = new Date(timestamp)
    let nowDate = new Date()
    if (bDate.getMonth() == nowDate.getMonth() && bDate.getDate() == nowDate.getDate()) {
        return true
    } else {
        return false
    }
}