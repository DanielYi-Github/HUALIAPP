import * as types from '../actionTypes/DocumentTypes';
import { Alert, Linking, Platform } from 'react-native';
import { Toast } from 'native-base';

import NetUtil from '../../utils/NetUtil';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';
import * as SQLite from '../../utils/SQLiteUtil';
import * as LoggerUtil from '../../utils/LoggerUtil';
import NavigationService from '../../utils/NavigationService';

export function loadDocInitState() {
	return async (dispatch) => {
		this.loadDocCategoriesNewsIntoState();
		this.loadDocCategoriesTypesIntoState();
	}
}

export function loadDocCategoriesNewsIntoState() {
	return async (dispatch, getState) => {
		var lang = getState().Language;
		queryGroupFileData(0, 10).then(result => {
			let data = result.raw()
			dispatch(loadGroupFilesNewsState(data));
		})
	}
}

export function loadDocCategoriesTypesIntoState() {
	return async (dispatch, getState) => {
		var lang = getState().Language.langStatus;
		let groupFileTypes = await getGroupFileTypes(lang).then((types) => {
			return types;
		}).catch((e) => {
			return [];
		});
		dispatch(loadGroupFileTypesState(groupFileTypes));
		dispatch(refresh_success());
	}
}

async function getGroupFileTypes(lang, tid) {
	let list = [];

	var sql = `select  a.CLASS3 as CLASS3,a.CLASS4 as CLASS4,a.CLASS5 as CLASS5,a.LEN,ifnull(b.LANGCONTENT,a.CONTENT) as CONTENT 
			  from THF_MASTERDATA a
              left join (select LANGID,LANGCONTENT from THF_LANGUAGE where LANGTYPE='${lang}' and STATUS='Y') b on a.OID=b.LANGID
			  where a.STATUS='Y' and  a.CLASS1='GroupFileType'`;
	if (tid) {
		sql = sql + ` and CLASS4='${tid}'`;
	}
	sql = sql + ` order by SORT`;
	await SQLite.selectData(sql, []).then((result) => {
		for (let i = 0, len = result.length; i < len; i++) {
			list.push({
				type: result.item(i).CLASS3,
				tid: result.item(i).CLASS4,
				icon: result.item(i).CLASS5,
				content: result.item(i).CONTENT
			});
		}
	}).catch((e) => {
		LoggerUtil.addErrorLog("DocumentAction getGroupFileTypes", "APP Action", "ERROR", e);
	});

	let len = list.length % 4;
	if (len != 0) {
		for (let i = 0; i < 4 - len; i++) {
			list.push({ type: "SPACE" });
		}
	}
	return list;

}


function loadGroupFilesNewsState(GroupFilesNewsData) {
	return {
		type: types.LOADGROUPFILESNEWS,
		GroupFilesNewsData,
	}
}


function loadGroupFileTypesState(GroupFileTypesData, isLoadDone = false) {
	return {
		type: types.LOADGROUPFILETYPES,
		GroupFileTypesData,
		isLoadDone
	}
}

function refresh_success() {
	return {
		type: types.REFRESH_SUCCESS
	}
}
//查询集团文件
export function queryGroupFileData(pageNum, pageSize, tid, arrCondition) {
	//拼接limit条件
	let limitWhere = ""
	if (pageNum != null && pageNum != undefined && pageSize != null && pageSize != undefined) {
		limitWhere = ` limit ${pageNum},${pageSize}  `
	}
	//拼接tid条件
	let tidWhere = ""
	if (tid != null && tid != undefined) {
		tidWhere = ` and a.TID = '${tid}' `
	}
	//拼接搜寻条件
	let conditionWhere = ""
	if (arrCondition != null && arrCondition != undefined) {
		for (const index in arrCondition) {
			arrCondition[index] = ` a.DETAIL like '%${arrCondition[index]}%' `
		}
		if (arrCondition.length > 0) {
			conditionWhere = ` and (${arrCondition.join('or')}) `
		}
	}
	let sql = `select DISTINCT a.TID,a.DID,a.DETAIL,a.DMODIFIED,a.VISITCOUNT + a.LOCALVISITCOUNT as VISITCOUNT,b.CLASS3 as TYPE,b.CONTENT as TYPENAME,b.CLASS5 as ICON  
				from THF_GROUPFILE a
				join THF_MASTERDATA b on a.TID = b.CLASS4 and b.STATUS = 'Y' and b.CLASS1 = 'GroupFileType'
				where a.STATUS = 'Y'
				${tidWhere}
				${conditionWhere}
				order by a.DMODIFIED desc ${limitWhere}
			`
	return SQLite.selectData(sql)
}
//查询did对应的文件
export function queryGroupFileDetailData(did) {
	let sql = ` select * from THF_GROUPFILE where DID = '${did}' and STATUS = 'Y' `
	return SQLite.selectData(sql)
}

//查询访问数
function queryGroupFileVisitData(did) {
	let sql = `select distinct DID,VISITCOUNT+LOCALVISITCOUNT as VISITCOUNT from THF_GROUPFILE where STATUS = 'Y' `
	return SQLite.selectData(sql)
}

//增加访问数
export function increaseDBVisitCount(did) {
	let sql = `update THF_GROUPFILE set LOCALVISITCOUNT = LOCALVISITCOUNT + 1 where DID = '${did}'`
	SQLite.updateData(sql)
}

//最新文件增加访问数
export function increaseNewestFileVisitCount(index, did) {
	return async (dispatch, getState) => {
		let data = getState().Document.GroupFileNewsData
		data[index].VISITCOUNT++
		dispatch(loadGroupFilesNewsState(data))
		increaseDBVisitCount(did)
	}
}

//查询管理文章
export function queryManageDocumentData(pageNum, pageSize, arrCondition) {
	//拼接limit条件
	let limitWhere = ""
	if (pageNum != null && pageNum != undefined && pageSize != null && pageSize != undefined) {
		limitWhere = ` limit ${pageNum},${pageSize}  `
	}
	//拼接搜寻条件
	let conditionWhere = ""
	if (arrCondition != null && arrCondition != undefined) {
		for (const index in arrCondition) {
			arrCondition[index] = ` DETAIL like '%${arrCondition[index]}%' `
		}
		if (arrCondition.length > 0) {
			conditionWhere = ` and (${arrCondition.join('or')}) `
		}
	}
	let sql = `select OID,TID,DID,DETAIL,DOCNAME,DOCTYPE,DOCSIZE,DMODIFIED,VISITCOUNT + LOCALVISITCOUNT as VISITCOUNT 
				from THF_GROUPFILE
				where STATUS = 'Y' and TID = '44'
				${conditionWhere}
				order by DMODIFIED desc ${limitWhere}
			`
	return SQLite.selectData(sql)
}