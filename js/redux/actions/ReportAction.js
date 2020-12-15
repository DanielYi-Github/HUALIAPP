import * as types from '../actionTypes/ReportTypes';
import { Linking, Platform } from 'react-native';
import { Toast } from 'native-base';

import NetUtil             from '../../utils/NetUtil';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';
import * as SQLite         from '../../utils/SQLiteUtil';
import * as LoggerUtil     from '../../utils/LoggerUtil';
import NavigationService   from '../../utils/NavigationService';
import ReportUtil          from '../../utils/ReportUtil';


export function loadReportInitState(user) {
	return async (dispatch) => {
		this.loadReportCategoriesNewsIntoState(user);
		this.loadReportCategoriesTypesIntoState(user);
	}
}

export function loadReportCategoriesNewsIntoState(user) {
	return async (dispatch, getState) => {
		var lang = getState().Language.langStatus;
		let reportList = await getReportNews("CLASS1", 'Report', lang).then(async (datalist) => {
			return datalist;
		}).catch((e)=>{
			LoggerUtil.addErrorLog("ReportAction loadReportCategoriesNewsIntoState", "APP Action", "ERROR", e);
	      	return [];
	    });
		dispatch(loadReportNewsState(reportList));
	}
}

export function loadReportCategoriesTypesIntoState(user) {
	return async (dispatch, getState) => {
		var lang = getState().Language.langStatus;

		let reportTypes = await getReportTypes("CLASS1", 'ReportType', lang).then(async (types) => {
			return types;
		}).catch((e)=>{
			LoggerUtil.addErrorLog("ReportAction loadReportCategoriesTypesIntoState", "APP Action", "ERROR", e);
	      	return [];
	    });
		dispatch(loadReportCategoriesState(reportTypes));
		dispatch(refresh_success()); 
	}
}

async function getReportTypes(key, value, lang) {

	let list = [];
	var sql = `select  CLASS3,a.oid,a.CLASS5,a.LEN,b.LANGCONTENT,ifnull(b.LANGCONTENT,a.CONTENT) as CONTENT,a.TXDAT from THF_MASTERDATA a
              left join (select LANGID,LANGCONTENT from THF_LANGUAGE where LANGTYPE='${lang}' and STATUS='Y') b on  a.OID=b.LANGID
			  where a.STATUS='Y' and  ${key}='${value}' order by SORT`;

	await SQLite.selectData(sql, []).then((result) => {
		for (let i = 0, len = result.length; i < len; i++) {
			list.push({
				type : result.item(i).CLASS3,
				id  : result.item(i).OID,
				icon : result.item(i).CLASS5,
				content: result.item(i).CONTENT
			});
		}
	}).catch((e)=>{
		LoggerUtil.addErrorLog("ReportAction getReportTypes", "APP Action", "ERROR", e);
	});
	let len=list.length%4;
	if(len!=0){
		for(let i=0;i<4-len;i++){
			list.push({type:"SPACE"});
		}
	}
	return list;
}


 async function getReportNews(key, value, lang, tid) {
	let list = [];
	var sql =ReportUtil.ReportContentSql(null,lang);

	await SQLite.selectData(sql, []).then((result) => {
		for (let i = 0, len = result.length; i < len; i++) {
			list.push({
				page : result.item(i).page,
				tid  : result.item(i).tid,
				icon : result.item(i).icon,
				pageName: result.item(i).content,
				txdat: result.item(i).txdat,
				did: result.item(i).did,
				reportType:result.item(i).type
			});
		}
	}).catch((e)=>{
		LoggerUtil.addErrorLog("ReportAction getReportNews", "APP Action", "ERROR", e);
	});

	return list;
}

function loadReportNewsState(ReportNewsData){
	return {
		type: types.LOADREPORTNEWS,
		ReportNewsData,
	}
}

function loadReportCategoriesState(ReportTypesData , isLoadDone = false) {
	return {
		type: types.LOADREPORTTYPES,
		ReportTypesData,
		isLoadDone
	}
}

function refresh_success() {
	return {
		type: types.REFRESH_SUCCESS
	}
}

