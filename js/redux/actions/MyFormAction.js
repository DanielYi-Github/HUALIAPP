import * as types          from '../actionTypes/MyFormTypes';
import * as LoginTypes     from '../actionTypes/LoginTypes';
import * as SQLite         from '../../utils/SQLiteUtil';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';
import * as LoggerUtil     from '../../utils/LoggerUtil';
import FormUnit            from '../../utils/FormUnit';
import ToastUnit 		   from '../../utils/ToastUnit';

export function myFormInitial(userID) {
	return async dispatch => {
		dispatch(refresh()); //顯示載入動態
		this.loadSelectFormListIntoState(); //載入篩選條件裡的所有表單資料
		this.loadSelectFormState(), 		//載入篩選條件裡的表單型別
		this.loadMyFormIntoState(userID);   //預設載入表單
	}
}

export function loadSelectFormListIntoState() {
	return async (dispatch, getState) => {
		var lang = getState().Language.langStatus;
		let formTypes = await getFormTypes("CLASS1", 'FormType', lang).then(async (types) => {
			for (var index in types) {
				let forms = await getFormTypes("CLASS4", types[index].key, lang).then((result) => {
					return result;
				});
				types[index].content = forms
			}
			return types;
		});

		formTypes = [ { key:'all', label:getState().Language.lang.MyFormListPage.FormTypeAll } , ...formTypes]; //新增表單總類的多語系功能，目前已"全部表單"為主 
		dispatch(selectFormListIntoState(formTypes));
	}
}

async function getFormTypes(key, value, lang) {
	let list = [];
	var sql = `select a.CLASS3 as CLASS3,ifnull(b.LANGCONTENT,a.CONTENT) as CONTENT
				from THF_MASTERDATA a
				left join (select LANGID,LANGCONTENT from THF_LANGUAGE where LANGTYPE='${lang}' and STATUS='Y') b on a.LEN=b.LANGID
				where STATUS='Y' and ${key}='${value}'`;
	await SQLite.selectData(sql, []).then((result) => {
		for (let i = 0, len = result.length; i < len; i++) {
			list.push({
				key  : result.item(i).CLASS3,
				label: result.item(i).CONTENT,
			});
		}
	}).catch((e)=>{
		LoggerUtil.addErrorLog("MyFormAction getFormTypes", "APP Action", "ERROR", e);
	});
	return list;
}

export function loadSelectFormState(){
	return async (dispatch, getState) => {

		var sql =  `select a.CLASS3, ifnull(b.LANGCONTENT,CONTENT) as CONTENT 
					from THF_MASTERDATA a
				   	left join (
				   		select LANGCONTENT,LANGID 
				   		from THF_LANGUAGE 
				   		where LANGTYPE='${getState().Language.langStatus}' and STATUS='Y' ) 
				   		b on b.LANGID=a.LEN
					where CLASS1='ProcessTrackingType' and a.STATUS='Y' order by SORT;`;
		SQLite.selectData(sql, []).then((result) => {
			let list = [];
			for(let i in result.raw()){
				list.push({
					key: result.raw()[i].CLASS3,
					label: result.raw()[i].CONTENT
				});
			}
			dispatch( selectFormState(list) ); 
		}).catch((e)=>{
			dispatch( selectFormState([]) ); 
			LoggerUtil.addErrorLog("MyFormAction loadSelectFormState","APP Action", "ERROR", e);
		});
	}
}

function selectFormState(selectFormState){
	return {
		type: types.LOADMYFORMSELECTSTATE,
		selectFormState
	}
}

export function loadMyFormIntoState(userData, type = null, datetype = 'M', statetype = null, protype = null, processid = null) {
	type      = (type === 'mine') ? null : type;
	statetype = (statetype === "all") ? null : statetype;
	protype   = (protype === "all") ? null : protype;
	processid = (processid === "all") ? null : processid;

	return (dispatch, getState) => {
		dispatch(refresh()); //顯示載入動態
		let content = {
			id       : userData.id,
			type     : type, 		// 我立案=null 我追蹤=tracking 我經手join
			datetype : datetype, 	// M=一個月 M3=三個月 M6=半年 Y=一年
			statetype: statetype, 	// 全部=null 執行中=running 已完成=complete
			protype  : protype,
			processid: processid 	// 表單ID 
		};

		UpdateDataUtil.getBPMRootTask(userData, content).then((data) => {
			for(var i in data){ 
				data[i].findPageItemType = 'MYF'; 
			}

			dispatch(loadMyForms(data)); //開始顯示載入資料畫面
		}).catch((e) => {
			if (e.code == "0") {
				dispatch(logout()); //已在其他裝置登入，強制登出
      			ToastUnit.show('error', getState().Language.lang.Common.TokenTimeout);//使用者Token已過期，請重新登入!
			}else{
				dispatch(LoadMyFormError(e.message)); //撈取中出現問題
			}
			// LoggerUtil.addErrorLog("MyFormAction loadMyFormIntoState", "APP Action", "ERROR", e);
		});
	}
}

export function loadMyFormContentIntoState(userData, processid, id, rootid, lang, tskid) {
	return async (dispatch, getState) => {

		dispatch(myFormContent_refresh());
		/*
			1.根據資料進行分類，將ap的資料取出作為該資料的header
			2.遇到下一個ap之前，將所有資料塞進上個ap的data項下
			3.再根據ap項下的data衍生出各種欄位
		*/

		// txt, 文字視窗
		// cbo, 下拉式選單
		// chk, 多選項
		// rdo, 單選項
		// tar, 多行文字
		// ap   header

		let content = {
			"proid" : processid,
			"lineid": id,
			"tskid" : rootid,
			"lang"  : lang
		};

		let content1 = {
			"rootid" : rootid,
			"lang" : lang
		};
		
		let formRecords = await UpdateDataUtil.getAllSignResult(userData, content1).then((data) => {
			return data;
		}).catch((e) => {
			LoggerUtil.addErrorLog("MyFormAction loadMyFormContentIntoState", "APP Action", "ERROR", e);
		});

		await UpdateDataUtil.getBPMForm(userData, content).then( async (data) => {
			// console.log("loadMyFormContentIntoState",data);
			let apList = [];
			let apListIndex = -1;
			var tmpList = data.tmpList; 

			for(var i in tmpList){
				if(tmpList[i].columntype == "ap" || tmpList[i].columntype == "applyap" ){
					let temp = {
						columntype:tmpList[i].columntype,
						labelname :tmpList[i].component.name,
						content   :[]
					};
					apList.push(temp);
					apListIndex++;
				} else {
					if (tmpList[i].component.id == "cboApporveLevel" && data.showsign == "N") {
					} else {
						apList[apListIndex].content.push(tmpList[i]);					
					}
				}
			}

			tmpList = data.comList; 
			for(var i in tmpList){
				if(tmpList[i].columntype == "ap"){
					let temp = {
						columntype:tmpList[i].columntype,
						labelname :tmpList[i].component.name,
						content   :[]
					};
					apList.push(temp);
					apListIndex++;
				} else {
					// 整理成可編輯的表格格式
					if ( tmpList[i].isedit == "Y" ) {
						tmpList[i] = await FormUnit.formatEditalbeFormField(tmpList[i]);	// 取得該欄位的動作
						tmpList[i].isedit = "N";
					}
					apList[apListIndex].content.push(tmpList[i]);					
				}
			}

			// 判斷附件有沒有值
			tmpList = data.tmpBotomList; 
			if (
				tmpList.length != 0 
				&& tmpList[1].defaultvalue != null 
				&& tmpList[1].defaultvalue.length != 0
			) {
				for(var i in tmpList){
					if(tmpList[i].columntype == "ap"){
						let temp = {
							columntype:tmpList[i].columntype,
							labelname :tmpList[i].component.name,
							content   :[]
						};
						apList.push(temp);
						apListIndex++;
					} else {
						apList[apListIndex].content.push(tmpList[i]);					
					}
				}
			}

			// 是否要取得BPM圖片
			let bpmImage = false; 
			if (data.formview == "Y") {
				bpmImage = await UpdateDataUtil.getBPMTaskImage(userData, rootid, tskid).then((result)=>{
					return result;
				});
			}		
			dispatch( loadMyFormContent(apList,formRecords,bpmImage) ); 

		}).catch((e) => {
			if (e.code == "0") {
				dispatch(logout()); //已在其他裝置登入，強制登出
      			ToastUnit.show('error', getState().Language.lang.Common.TokenTimeout);//使用者Token已過期，請重新登入!
			}else{
				dispatch(LoadMyFormError(e)); //撈取中出現問題
			}
			LoggerUtil.addErrorLog("MyFormAction loadMyFormContentIntoState", "APP Action", "ERROR", e);
		});
	}
}

function refresh() {
	return {
		type: types.MYFORM_REFRESHING,
	}
}

function myFormContent_refresh(){
	return {
		type: types.MYFORMCONTENT_REFRESHING,
	}	
}

function selectFormListIntoState(data) {
	return {
		type: types.LOADMYFORMTYPES,
		data
	}
}

function loadMyForms(data) {
	return {
		type: types.LOADMYFORMS,
		data
	}
}

function LoadMyFormError(message = null){
	return {
		type: types.LOADMYFORMSERROR,
		message
	};	
}

function loadMyFormContent(data,records,bpmImage) {
	return {
		type: types.LOADMYFORMCONTENT,
		data,
		records,
		bpmImage
	}
}

export function logout(message = null) {
	return {
		type: LoginTypes.UNLOGIN,
		message
	};
}

