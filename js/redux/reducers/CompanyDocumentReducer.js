import * as CompanyDocumentTypes from "../actionTypes/CompanyDocumentTypes";

const initialState = {
    companyDocumentAppOid: "",//公司文件AppOid
    companyDocumentNewestData: [],//最新文件
    companyDocumentData: [],//公司文件
    companyDocumentType: [],//文件分类
    companyDocumentVisitData: {},//公司文件访问数资料
    companyDocumentFileUrlData: {},//公司文件fileUrl资料
    loading: true,//加载中
}

export default function index(state = initialState, action = {}) {
    switch (action.type) {
        case CompanyDocumentTypes.SET_COMPANYDOCUMENT_APPOID:
            return {
                ...state,
                companyDocumentAppOid: action.companyDocumentAppOid
            }
        case CompanyDocumentTypes.LOAD_COMPANYDOCUMENT_NEWESTDATA:
            return {
                ...state,
                companyDocumentNewestData: action.companyDocumentNewestData
            }
        case CompanyDocumentTypes.LOAD_COMPANYDOCUMENT_DATA:
            return {
                ...state,
                companyDocumentData: action.companyDocumentData
            }
        case CompanyDocumentTypes.LOAD_COMPANYDOCUMENT_TYPE:
            return {
                ...state,
                companyDocumentType: action.companyDocumentType
            }
        case CompanyDocumentTypes.LOAD_COMPANYDOCUMENT_VISITDATA:
            return {
                ...state,
                companyDocumentVisitData: action.companyDocumentVisitData
            }
        case CompanyDocumentTypes.ADD_COMPANYDOCUMENT_VISITCOUNT:
            return {
                ...state,
                companyDocumentVisitData: {
                    ...state.companyDocumentVisitData,
                    [action.oid]: state.companyDocumentVisitData[action.oid] + 1
                }
            }
        case CompanyDocumentTypes.SET_LOADING:
            return {
                ...state,
                loading: action.loading
            }
        default:
            return state
    }
}