import * as types from '../actionTypes/DocumentTypes';
import { Alert, Linking, Platform } from 'react-native';
import { Toast } from 'native-base';

import NetUtil             from '../../utils/NetUtil';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';
import * as SQLite         from '../../utils/SQLiteUtil';
import * as LoggerUtil     from '../../utils/LoggerUtil';
import NavigationService   from '../../utils/NavigationService';

export function loadDocInitState(user,page) {
	return async (dispatch) => {
		this.loadDocCategoriesNewsIntoState(user);
		this.loadDocCategoriesTypesIntoState(user);
	}
}

export function loadDocCategoriesNewsIntoState(user) {
	return async (dispatch, getState) => {
		var lang = getState().Language;
		UpdateDataUtil.getGroupFileNewsData(user, lang.langStatus, {page:1, condition:null}).then(async (data) => {
			dispatch(loadGroupFilesNewsState(data));
		}).catch((e) => {
			LoggerUtil.addErrorLog( "DocumentAction loadDocCategoriesNewsIntoState", "APP Action", "ERROR", e );
			dispatch(loadGroupFilesNewsState([]));
		});
	}
}

export function loadDocCategoriesTypesIntoState(user) {
	return async (dispatch, getState) => {
		var lang = getState().Language.langStatus;
		let groupFileTypes = await getGroupFileTypes("CLASS1", 'GroupFileType', lang).then(async (types) => {
			let typesList =getGroupFileContent(user, types);
			return typesList;
		}).catch((e)=>{
	      	return [];
	    });
		dispatch(loadGroupFileTypesState(groupFileTypes));
		dispatch(refresh_success()); 
	}
}

function getGroupFileContent(user, types){
	// for (var indexT in types) {
	// 	//根据TID獲取主表資料
	//     let contentList = UpdateDataUtil.getGroupFileContentData(user,types[indexT].tid).then((dataT)=>{
	// 		return getGroupFileDetail(user, dataT);
	//     }).catch((e)=>{
	//       	return [];
	//     });
	//     //主表資料存入contentList
	// 	types[indexT].contentList = contentList
	// }
	return types;
}

function getGroupFileDetail(user, dataT){
	for (var indexD in dataT) {
		//根據DID獲取從表資料
	    let detailList = UpdateDataUtil.getGroupFileDetailData(user,dataT[indexD].tid,dataT[indexD].did).then((dataD)=>{
			return dataD;
	    }).catch((e)=>{
	      	return [];
	    });
	    //從表資料存入detailList
		dataT[indexD].detailList = detailList
	}
	return dataT;
}

async function getGroupFileTypes(key, value, lang, tid) {
	let list = [];

	var sql = `select  a.CLASS3 as CLASS3,a.CLASS4 as CLASS4,a.CLASS5 as CLASS5,a.LEN,ifnull(b.LANGCONTENT,a.CONTENT) as CONTENT from THF_MASTERDATA a
              left join (select LANGID,LANGCONTENT from THF_LANGUAGE where LANGTYPE='${lang}' and STATUS='Y') b on a.OID=b.LANGID
			  where a.STATUS='Y' and  ${key}='${value}'`;
				if(tid){
					sql =sql+` and CLASS4='${tid}'`;
				}
 				sql =sql+` order by SORT`;
	await SQLite.selectData(sql, []).then((result) => {
		for (let i = 0, len = result.length; i < len; i++) {
			list.push({
				type : result.item(i).CLASS3,
				tid  : result.item(i).CLASS4,
				icon : result.item(i).CLASS5,
				content: result.item(i).CONTENT
			});
		}
	}).catch((e)=>{
		LoggerUtil.addErrorLog( "DocumentAction getGroupFileTypes", "APP Action", "ERROR", e );
	});

	let len=list.length%4;
	if(len!=0){
		for(let i=0;i<4-len;i++){
			list.push({type:"SPACE"});
		}
	}
	return list;
	
}


export function loadGroupFilesNewsState(GroupFilesNewsData){
	return {
		type: types.LOADGROUPFILESNEWS,
		GroupFilesNewsData,
	}
}


function loadGroupFileTypesState(GroupFileTypesData , isLoadDone = false) {
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

