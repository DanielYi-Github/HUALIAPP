import * as salaryTypes    from '../actionTypes/SalaryTypes';
import * as LoginTypes     from '../actionTypes/LoginTypes';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';
import DateFormat from 'dateformat'; 
import { Platform} from 'react-native';
import { RSA } from 'react-native-rsa-native';

let appKeysPair = "";
let serverPublicKey = "";

export function getMisPsalyms() {
	return async (dispatch, getState) => {
		dispatch(refreshing(true)); 	

		UpdateDataUtil.getMisPsalyms(getState().UserInfo.UserInfo).then((data)=>{
			let psalymsDate_jsonFormat = jsonFormat(data.content);
			dispatch({
				type: salaryTypes.GET_SALARY_SELECT_DAYS,
				salarySelectDays: psalymsDate_jsonFormat
			});

			let year = psalymsDate_jsonFormat[psalymsDate_jsonFormat.length-1];
			let month = year.value[year.value.length-1];
			let defaultSelectDay = year.key+month.key;

			this.exchangeRSAPubliceKey(defaultSelectDay);
		}).catch( errorData => {
			if (errorData == null ){
				errorData = {};
				errorData.code = -1;
				errorData.message = getState().Language.lang.SalaryPage.AppServerResponseInvalid;
			}
			if (errorData.content == null ) {
				errorData.code = -1;
				errorData.message = getState().Language.lang.SalaryPage.NoSalaryData;
			}

			if (errorData.code == 0) {	
				//已在其他裝置登入，強制登出
				dispatch(logout(errorData.message)); 
			} else {
				// appserver 回傳錯誤
				dispatch(getMisSalay_fail(errorData.message));
			}
		});
		
	}
}

export function exchangeRSAPubliceKey(defaultSelectDay = null){
	return async (dispatch, getState) => {

		let keysPair = await RSA.generateKeys(2048).then((keys) => {
			appKeysPair = keys;
		    return keys;
		});
		
		UpdateDataUtil.exchangeRSAPubliceKey(
			getState().UserInfo.UserInfo, 
			keysPair.public 
		).then((data)=>{
			serverPublicKey = data.dataObj;
			this.getMisSalary(defaultSelectDay);
		}).catch(errorData => {

			if (errorData == null){
				errorData = {};
				errorData.apiState = false;
				errorData.message = getState().Language.lang.SalaryPage.AppServerResponseInvalid;
			}

			if (errorData.apiState) {
				if (errorData.hasOwnProperty("content")) {
					// 表示HR server 回傳空字串
					dispatch(getMisSalay_fail(getState().Language.lang.SalaryPage.HRServerResponseInvalid)); // 沒有拿到鑰使
				} else {
					// 表示HR server API回傳失敗
					dispatch(getMisSalay_fail(errorData.message));
				}
			} else {
				if (errorData.code == 0) {
					// 登出
					dispatch(logout(errorData.message)); //已在其他裝置登入，強制登出
				} else {
					// appserver 回傳錯誤
					dispatch(getMisSalay_fail(errorData.message));
				}
			}
		});
		
	}
}

export function getMisSalary( date ) {
	return async (dispatch, getState) => {
		dispatch(refreshing(true)); 	
		
		UpdateDataUtil.getMisSalary(
			getState().UserInfo.UserInfo, 
			date,
			appKeysPair.public
		).then( async (data)=>{

			let encryptedParts = data.publicdata.split("==");
			let unSignedPart = `${encryptedParts[0]}==`;

			// 在ios先跳過驗證
			let verified = false;
			if(Platform.OS == 'android'){
				verified = await RSA.verify64WithAlgorithm(
					data.signdata, 
					unSignedPart, 
					serverPublicKey, 
					'SHA256withRSA'
				).then(result => {
					console.log("data", 0);
					return result;
				}).catch( err => {
					console.log("err", err);
				});
			}else{
				verified = true;
			}

			if (verified) {
				let decryptedParts = "";
				for (let i in encryptedParts) {
					i = parseInt(i);
					if (i + 1 !== encryptedParts.length) {
						await RSA.decrypt(encryptedParts[i] + "==", appKeysPair.private)
							.then(decryptedMessage => {
								decryptedParts = decryptedParts + decryptedMessage;
							});
					}
				}
				
				data = await JSON.parse(decryptedParts);

				if (data.isSuccess) {
					data.dataObj.ATNDDAT  = usefulData_format(data.dataObj.ATNDDAT);
					data.dataObj.BASDAT   = usefulData_format(data.dataObj.BASDAT);
					data.dataObj.MSDDSTOT = usefulData_format(data.dataObj.MSDDSTOT);
					data.dataObj.MSGETTOT = usefulData_format(data.dataObj.MSGETTOT);
					dispatch(getMisSalay_success(data.dataObj));
				} else {
					console.log(data);
					dispatch(getMisSalay_fail(data.message));
				}
			} else {
				dispatch(getMisSalay_fail(getState().Language.lang.SalaryPage.HRServerVertifyInvalid));
			}
			
		}).catch(errorData => {

			if (errorData == null){
				errorData = {};
				errorData.apiState = false;
				errorData.message = getState().Language.lang.SalaryPage.AppServerResponseInvalid;
			}

			if (errorData.apiState) {
				if (errorData.hasOwnProperty("content")) {
					// 表示HR server 回傳空字串
					dispatch(getMisSalay_fail(getState().Language.lang.SalaryPage.HRServerResponseInvalid)); // 沒有拿到鑰使
				} else {
					// 表示HR server API回傳失敗
					dispatch(getMisSalay_fail(errorData.message));
				}
			} else {
				if (errorData.code == 0) {
					// 登出
					dispatch(logout(errorData.message)); //已在其他裝置登入，強制登出
				} else {
					// appserver 回傳錯誤
					dispatch(getMisSalay_fail(errorData.message));
				}
			}
		});

		/*
        RSA.verify64WithAlgorithm(data.signdata, data.publicdata, serverPublicKey, 'SHA256withRSA').then(result => {
        	console.log("是不是成功:",result);
        });

        RSA.decrypt(data.publicdata, appKeysPair.private)
		.then(decryptedMessage => {
			console.log("解密後:",decryptedMessage);
			// decryptedParts = decryptedParts + decryptedMessage;
		});
		*/
	}
}

function jsonFormat(misPsalyms_array){
	let dateJson = [];
	// 整理年分
	for (let index in misPsalyms_array) {
		misPsalyms_array[index] = parseInt(misPsalyms_array[index])*1000;
		let date  = new Date(misPsalyms_array[index]);
		let year  = DateFormat( date, "yyyy");

		if (dateJson.length == 0) {
		  	dateJson.push({ key:year, label:year, value:[]});
		} else {
			let isMoreYear = true;
			for (let i in dateJson) {
				if (year == dateJson[i].key) isMoreYear = false;
			}

			if (isMoreYear) dateJson.push({ key:year, label:year, value:[]});
		}
	}
	// 整理月份
	for (let index in misPsalyms_array) {
		let date  = new Date(misPsalyms_array[index]);
		let year  = DateFormat( date, "yyyy");
		let month = DateFormat( date, "mm");

		for (let i in dateJson) {
			if (year == dateJson[i].key) {
				dateJson[i].value.push({
					key:month,
					label:month
				});
			}
		}
	}
	return dateJson;
}

function refreshing(isRefreshing) {
	return {
		type: salaryTypes.SALARY_REFRESHING,
		isRefreshing
	}
}

function getMisSalay_success(data){
	return {
		type: salaryTypes.GETMISSALAY_SUCCESS,
		data
	}
}

function getMisSalay_fail(message){
	return {
		type: salaryTypes.GETMISSALAY_FAIL,
		message
	}
}

function usefulData_format(data){
	/* 要排成的格式 */
	/*
		{
			action: null
			actionColumn: []
			columnaction: null
			columnactionColumn: []
			columnsubtype: null
			columntype: "txt"
			component: {name: "申請日期", id: "tfwApplyDate"}
			defaultvalue: "2020/04/07"
			isedit: "N"
			listComponent: null
			paramList: null
			required: "N"
			rulesList: null
		}
	*/
	for(let i in data){
		data[i] = {
			action: null,
			actionColumn: [],
			columnaction: null,
			columnactionColumn: [],
			columnsubtype: null,
			columntype: "txtWithoutDefaultValue", // 無防呆機制
			component: {name: data[i].ITEM, id: ""},
			defaultvalue: data[i].VALUE,
			isedit: "N",
			listComponent: null,
			paramList: null,
			required: "N",
			rulesList: null,
		}
	}
	return data;
}

export function logout(message = null) {
	return {
		type     : LoginTypes.UNLOGIN,
		loginPage: true,
		message
	};
}