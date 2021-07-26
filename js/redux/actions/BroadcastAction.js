import * as BroadcastTypes from "../actionTypes/BroadcastTypes"
import * as SQLite from "../../utils/SQLiteUtil"

function loadData(data) {
    return {
        type: BroadcastTypes.BROADCAST_LOADDATA,
        data
    }
}
function setIsBirthday(isBirthday) {
    return {
        type: BroadcastTypes.SET_ISBIRTHDAY,
        isBirthday
    }
}

export function initBroadcastData() {
    return async (dispatch, getState) => {
        let lang = getState().Language.langStatus
        let sql = `select a.CLASS3,ifnull(ifnull(c.LANGCONTENT,b.NAME),d.LANGCONTENT) as TITLE,ifnull(e.LANGCONTENT,a.CONTENT) as CONTENT,a.CLASS4,a.CLASS5,a.CLASS6  
                    from THF_MASTERDATA a
                    left join THF_APP b on b.ID = a.CLASS3
                    left join THF_LANGUAGE c on b.LANGID = c.LANGID and c.LANGTYPE = '${lang}'
                    left join THF_LANGUAGE d on a.CLASS3 = d.LANGID and d.LANGTYPE = '${lang}'
                    left join THF_LANGUAGE e on a.LEN = e.LANGID and e.LANGTYPE = '${lang}'
                    where a.CLASS1 = 'Broadcast' and a.STATUS = 'Y' `
        SQLite.selectData(sql,[]).then(result => {
            let raw = result.raw()
            let data = []
            for (let item of raw) {
                if (item.CLASS3 == 'Birthday') {//判断时候生日，生日则显示此笔资料
                    let birthday = getState().UserInfo.UserInfo.birthday
                    let isBirthday = checkBirthday(birthday)
                    if (isBirthday) {
                        data.push(item)
                    }
                    continue
                }
                if (item.TITLE != null && item.CONTENT != null) {//标题内容不能为空
                    data.push(item)
                }
            }
            dispatch(loadData(data))
            let birthday = getState().UserInfo.UserInfo.birthday
            let isBirthday = checkBirthday(birthday)
            dispatch(setIsBirthday(isBirthday))
        })
    }
}

//检查今天是否是生日
function checkBirthday(birthday){
    birthday = birthday ? birthday : ''
    if (birthday == '') {
        return false
    }
    let timestamp = Date.parse(birthday.replace(/-/g, "/"))
    let bDate = new Date(timestamp)
    let nowDate = new Date()
    if (bDate.getMonth() == nowDate.getMonth() && bDate.getDate() == nowDate.getDate()) {
        return true
    }else {
        return false
    }
}