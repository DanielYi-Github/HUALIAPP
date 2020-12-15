import * as types           from '../actionTypes/BirthdayTypes';
import { Linking, Platform }from 'react-native';
import { Toast }            from 'native-base';
import NetUtil              from '../../utils/NetUtil';
import * as UpdateDataUtil  from '../../utils/UpdateDataUtil';
import * as SQLite          from '../../utils/SQLiteUtil';
import * as LoggerUtil      from '../../utils/LoggerUtil';
import NavigationService    from '../../utils/NavigationService';


export function loadBirthdayInitState(user) {
	return async (dispatch) => {
		this.loadBirthdayWeekDataIntoState(user);
		this.loadBirthdayMineDataIntoState(user);
		// dispatch(refresh_success());
	}
}

export function loadBirthdayWeekDataIntoState(user) {
	return async (dispatch) => {
	    UpdateDataUtil.getBirthdayWeekData(user,"CB","2019").then(async (data)=>{
	    	dispatch( loadBirthdayWeekDataState(data) );
	    	dispatch( refresh_week_success());
	    }).catch((e)=>{
			LoggerUtil.addErrorLog("BirthdayAction loadBirthdayWeekDataIntoState", "APP Action", "ERROR", e);
			dispatch( loadBirthdayWeekDataState([]) );
	    });		
	}
}

export function loadBirthdayMineDataIntoState(user) {
	return async (dispatch) => {
	    UpdateDataUtil.getBirthdayData(user,"2019","CB",user.id).then(async (data)=>{
	    	// console.log("QQQ");
	    	// console.log(data);
	    	dispatch( loadBirthdayMineDataState(data) );
	    	dispatch( refresh_msg_success() );
	    }).catch((e)=>{
			LoggerUtil.addErrorLog("BirthdayAction loadBirthdayMineDataIntoState", "APP Action", "ERROR", e);
			dispatch( loadBirthdayMineDataState([]) );
	    }); 	
	}
}

export function personalBirthdayDataUpdate(user) {
	return (dispatch, getState) => {
		let list = getState().Birthday.BirthdayWeekData;
		for(let i in list){
			if (list[i].oid == user.oid) {
				list[i] = user;
			}
		}

		dispatch( personalBirthdayDataUpdateState(list) );
	}
}

function loadBirthdayWeekDataState(BirthdayWeekData){
	return {
		type: types.LOADBIRTHDAYWEEKDATA,
		BirthdayWeekData,
	}
}

function loadBirthdayMineDataState(BirthdayMineData){
	return {
		type: types.LOADBIRTHDAYMINEDATA,
		BirthdayMineData,
	}
}

function personalBirthdayDataUpdateState(list) {
	return {
		type: types.PERSONALBIRTHDATDATAUPDATE,
		list
	}
}

function refresh_week_success() {
	return {
		type: types.REFRESH_WEEK_SUCCESS
	}
}

function refresh_msg_success() {
	return {
		type: types.REFRESH_MSG_SUCCESS
	}
}


