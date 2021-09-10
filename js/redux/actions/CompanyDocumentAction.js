import * as CompanyDocumentTypes from "../actionTypes/CompanyDocumentTypes";
import * as SQLiteUtil from "../../utils/SQLiteUtil";
import { exp } from "react-native/Libraries/Animated/src/Easing";

//设定公司文件AppOid actionCreator
function setCompanyDocumentAppOid(data) {
    return {
        type: CompanyDocumentTypes.SET_COMPANYDOCUMENT_APPOID,
        companyDocumentAppOid: data
    }
}
//加载最新文件actionCreator
function loadCompanyDocumentNewestData(data) {
    return {
        type: CompanyDocumentTypes.LOAD_COMPANYDOCUMENT_NEWESTDATA,
        companyDocumentNewestData: data
    }
}
//加载公司文件actionCreator
function loadCompanyDocumentData(data) {
    return {
        type: CompanyDocumentTypes.LOAD_COMPANYDOCUMENT_DATA,
        companyDocumentData: data
    }
}
//加载公司文件actionCreator
function loadCompanyDocumentType(data) {
    return {
        type: CompanyDocumentTypes.LOAD_COMPANYDOCUMENT_TYPE,
        companyDocumentType: data
    }
}
//加载公司文件访问数资料actionCreator
function loadCompanyDocumentVisitData(data) {
    return {
        type: CompanyDocumentTypes.LOAD_COMPANYDOCUMENT_VISITDATA,
        companyDocumentVisitData: data
    }
}
//增加公司文件访问数actionCreator
function addCompanyDocumentVisitCount(oid) {
    return {
        type: CompanyDocumentTypes.ADD_COMPANYDOCUMENT_VISITCOUNT,
        oid
    }
}
//设置公司文件fileUrl actionCreator
function setCompanyDocumentFileUrlData(oid, fileUrl) {
    return {
        type: CompanyDocumentTypes.SET_COMPANYDOCUMENT_FILEURLDATA,
        oid,
        fileUrl
    }
}
//设置公司文件是否正在加载 actionCreator
function setLoading(loading) {
    return {
        type: CompanyDocumentTypes.SET_LOADING,
        loading
    }
}
//初始化公司文件数据(最新文件、公司文件、文件分类)
export function initCompanyDocument() {
    return async (dispatch, getState) => {
        dispatch(setLoading(true))//加载开始
        let state = getState()
        let lang = state.Language.langStatus//多语系代号
        let appOid = getAppOid(state);
        //设定AppOid
        dispatch(setCompanyDocumentAppOid(appOid))
        //加载访问数资料
        queryCompanyDocumentVisit(appOid).then(result => {
            let arrVisit = result.raw();
            let companyDocumentVisitData = {}
            for (const visit of arrVisit) {
                companyDocumentVisitData[visit.OID] = visit.VISITCOUNT
            }
            dispatch(loadCompanyDocumentVisitData(companyDocumentVisitData))
        })
        //查询分类
        queryCompanyDocumentType(appOid, lang).then(result => {
            let arrDocumentType = result.raw()
            //加载分类
            dispatch(loadCompanyDocumentType(arrDocumentType))
            //查询最新文件
            queryCompanyDocumentData(appOid, 0, 10).then(result => {
                let arrDocumentNewestData = result.raw()
                //将分类的ICON添加加进文件中
                packCompanyDocumentData(arrDocumentType, arrDocumentNewestData)
                //加载最新文件
                dispatch(loadCompanyDocumentNewestData(arrDocumentNewestData))
                //加载结束
                dispatch(setLoading(false))
            })
            //查询分类文件
            Promise.all(
                arrDocumentType.map(
                    typeData => {
                        let type = typeData['TYPE']
                        let typeName = typeData['TYPENAME']
                        let typeIcon = typeData['ICON']
                        return queryCompanyDocumentData(appOid, 0, 10, type).then(result => {
                            let arrFile = result.raw()
                            //将分类的ICON添加加进文件中
                            for (const file of arrFile) {
                                file['ICON'] = typeIcon
                            }
                            let newTypeData = {
                                type,
                                typeName,
                                data: arrFile
                            }
                            return newTypeData
                        })
                    }
                )
            ).then(result => {
                let companyDocumentData = []
                for (const typeData of result) {
                    if (typeData.data.length > 0) {
                        companyDocumentData.push(typeData)
                    }
                }
                dispatch(loadCompanyDocumentData(companyDocumentData))//加载分类文件
            })
        })
    }
}
//获取appOid
function getAppOid(state) {
    let appOid, functionData = state.Home.FunctionData//获取公司文件APP OID
    for (let i in functionData) {
        if (functionData[i].ID == "CompanyDocument") {
            appOid = functionData[i].OID
            break;
        }
    }
    return appOid
}
//查询公司文件分类sql
export function queryCompanyDocumentType(appOid, lang) {
    let sql = `select CLASS3 as TYPE, ifnull(b.LANGCONTENT,a.CONTENT) as TYPENAME, CLASS4 as ICON from THF_MASTERDATA a
    left join THF_LANGUAGE b on a.LEN = b.LANGID and b.LANGTYPE = '${lang}'
    where a.CLASS1 = 'CompanyDocumentType' and a.STATUS = 'Y' and a.OID in (
        select DATA_OID 
        from THF_PERMISSION 
        where DATA_TYPE='masterdata' and FUNC_OID='${appOid}'
    ) order by a.SORT`
    return SQLiteUtil.selectData(sql, [])
}
//查询公司文件sql
export function queryCompanyDocumentData(appOid, pageNum, pageSize, type, arrCondition) {
    //拼接limit条件
    let limitWhere = ""
    if (pageNum != null && pageNum != undefined && pageSize != null && pageSize != undefined) {
        limitWhere = ` limit ${pageNum},${pageSize}  `
    }
    //拼接类型条件
    let typeWhere = ""
    if (type != null && type != undefined) {
        typeWhere = ` and DOC_TYPE = '${type}' `
    }
    //拼接搜寻条件
    let conditionWhere = ""
    if (arrCondition != null && arrCondition != undefined) {
        for (const index in arrCondition) {
            arrCondition[index] = ` SUBJECT like '%${arrCondition[index]}%' `
        }
        if (arrCondition.length > 0) {
            conditionWhere = ` and (${arrCondition.join('or')}) `
        }
    }
    let sql = `select OID, CO, DOC_TYPE, SUBJECT, date(RELEASE_DAT) as RELEASE_DAT, AUTH, VISITCOUNT+LOCALVISITCOUNT as VISITCOUNT, LOCALVISITCOUNT, FILEID, printf('%.2f',FILESIZE/1000/1000)||' MB' as FILESIZE, STATUS, CRTDAT, TXDAT 
        from(
            select *
            from THF_COMPANY_DOC 
            where STATUS = 'Y' and RELEASE_DAT <= datetime('now','localtime')
            ${typeWhere}
            ${conditionWhere}
            and OID in(
                select DATA_OID 
                from THF_PERMISSION 
                where DATA_TYPE='companydoc' and FUNC_OID='${appOid}'
            ) 
            order by RELEASE_DAT desc ${limitWhere}
        )`
    return SQLiteUtil.selectData(sql, [])
}
//查询公司文件访问数
export function queryCompanyDocumentVisit(appOid) {
    let sql = `select OID,VISITCOUNT+LOCALVISITCOUNT as VISITCOUNT from THF_COMPANY_DOC where STATUS = 'Y' 
                and OID in(
                        select DATA_OID 
                        from THF_PERMISSION 
                        where DATA_TYPE='companydoc' and FUNC_OID='${appOid}'
                ) 
                `
    return SQLiteUtil.selectData(sql, [])
}

/**
 * 将分类ICON包装到各个文件
 * @param Array arrType 分类资料数组
 * @param Array arrFile 文件资料数组
 */
export function packCompanyDocumentData(arrType, arrFile) {
    for (const typeData of arrType) {
        let type = typeData['TYPE']
        let icon = typeData['ICON']
        for (const fileData of arrFile) {
            let docType = fileData['DOC_TYPE']
            if (type == docType) {
                fileData['ICON'] = icon
            }
        }
    }
    return arrFile
}
//更新DB和redux的訪問數
export function increaseVisitCount(oid) {
    return async (dispatch, getState) => {
        //修改redux state访问数
        let state = getState()
        dispatch(addCompanyDocumentVisitCount(oid))

        //修改DB访问数
        let sql = `update THF_COMPANY_DOC set LOCALVISITCOUNT=LOCALVISITCOUNT + 1 where OID='${oid}' `
        SQLiteUtil.updateData(sql).catch(e => {
            console.log('increaseVisitCount Error', e);
        })
    }
}