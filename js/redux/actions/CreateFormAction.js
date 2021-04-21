import * as types          from '../actionTypes/CreateFormType';
import * as LoginTypes     from '../actionTypes/LoginTypes';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';
import * as LoggerUtil     from '../../utils/LoggerUtil';
import FormUnit            from '../../utils/FormUnit';
import ToastUnit 		   from '../../utils/ToastUnit';

/*
	欄位顯示的代辦事項
	1.每比欄位資料會多一個值與欄位id，控制該id是否顯示欄位，第一次加載時就要取得這些資料
	2.action 回傳直多一欄位 ，說明哪些id欄位要賦予什麼值
*/
/*
	[
		{"columntype":"rdo","id":"rdoYes","value":"true"},
		{"columntype":"rdo","id":"rdoNo","value":"false"},
		{"columntype":"txt","id":"txtEndPlace","value":"中山志捷"},
		{"columntype":"txt","id":"txtStratPlace","value":"中山志捷"},
		{"columntype":"txt","id":"txtPhoneManName","value":"楊孟璋"},
		{"columntype":"tar","id":"tarContent","value":"返台休假"},
		{"columntype":"cbo","id":"cboApporveLevel","value":"45"},
		{"columntype":"tab","id":"tabDispatchCarTime","value":[
			{"ROWINDEX":"0","ITEM1":"2019/09/24","ITEM2":"04:45","ITEM3":""},
			{"ROWINDEX":"1","ITEM1":"2019/09/25","ITEM2":"04:45","ITEM3":""}
			]
		},
		{"columntype":"tab","id":"tabManName","value":[]},
		{"columntype":"tab","id":"tabManNameBack","value":[]}
	]
*/

export function getFormFormat(formID){
	return (dispatch, getState) => {
		//顯示載入動態
		dispatch(
			refresh( getState().Language.lang.CreateFormPage.Creating )
		); 

		let user = getState().UserInfo.UserInfo;
		let content = {
			id  : formID,
			lang: getState().Language.langStatus
		};

		// 載入語系給FormUnit元件
		FormUnit.language = getState().Language.lang.FormUnit;
		
		UpdateDataUtil.getBPMCreateForm(user, content).then( async (data)=>{
			console.log(data);
			let stepsTitle       = [];
			let apList           = [];
			let apListIndex      = -1;
			let dataArray        = data.listComponent;
			let comfirmComponent = [];
			let unShowColumns	 = []; 	//暫時紀錄不顯示的欄位

			for(let columnData of dataArray){
				if (columnData.columntype == "ap") {
					let temp = {
						id        :columnData.component.id,
						columntype:columnData.columntype,
						labelname :columnData.component.name,
						content   :[]
					};
					stepsTitle.push(columnData.component.name);
					apList.push(temp);
					apListIndex++;
				} else {
					columnData.show = true; 	   		   // 該欄位要不要顯示
					columnData.requiredAlbert = false; 	   // 該欄位空值警告
					
					for(let unShowColumn of unShowColumns){
						if (unShowColumn.id == columnData.component.id) {
							columnData.defaultvalue = unShowColumn.value;
							columnData.paramList    = unShowColumn.paramList;
							columnData.show         = (unShowColumn.visible || unShowColumn.visible == "true") ? true : false;
							columnData.required     = (unShowColumn.required) ? "Y" : "F";
						}
					}

					let columnactionValue = await FormUnit.getColumnactionValue(user, columnData);   // 取得該欄位欲隱藏的欄位
					columnData.actionValue = await FormUnit.getActionValue(user, columnData);	// 取得該欄位的動作

					unShowColumns = unShowColumns.concat(columnactionValue);
					apList[apListIndex].content.push(columnData);
					comfirmComponent.push(columnData);
				}
			}
			
			apList.push({
				id        :"finallComfirm",
				name      :getState().Language.lang.CreateFormPage.FinallComfirm, 	// 確認內容
				columntype:"ap",
				content   :comfirmComponent
			})

			stepsTitle.push(getState().Language.lang.CreateFormPage.FinallComfirm); // 確認內容
			dispatch(
				renderFormFormat(
					stepsTitle, 
					apList,
					{
						id           : formID,
						empid        : user.id,
						proid        : data.proid,
						astid        : data.astid,
						listComponent: formatSubmitFormValue(comfirmComponent)
					},
				)
			);

		}).catch( e => {
			LoggerUtil.addErrorLog("CreateFormAction getFormFormat", "APP Action", "ERROR", e);
			
			
			if (e.code == "0") {
				dispatch(logout()); //已在其他裝置登入，強制登出
      			ToastUnit.show('error', getState().Language.lang.Common.TokenTimeout); //使用者Token已過期，請重新登入!
			}else{
				dispatch(renderFormFormatError(e)); //撈取中出現問題
			}
			
		});
	}
}

function renderFormFormat(stepsTitle, apList, formValue) {
	return {
		type: types.RENDERFORMFORMAT,
		stepsTitle, 
		apList,
		formValue
	}
}

function renderFormFormatError(e){
	console.log(e);
	return {
		type: types.RENDERFORMFORMATERROR,
		e
	}
}

export function updateFormDefaultValue(value, formItem, pageIndex){
	return async (dispatch, getState) => {
		let formFormat = getState().CreateForm.formFormat;
		let editIndex  = formFormat[pageIndex].content.indexOf(formItem);
		let allIndex   = formFormat[formFormat.length-1].content.indexOf(formItem);

		// 欄位自己的規則比較
		let ruleCheck = await FormUnit.formFieldRuleCheck(
								value, 
								formItem, 
								formFormat[formFormat.length-1].content, 
								formItem.columntype
							  );
		if( ruleCheck != true){
			dispatch(updateDefaultValueError(ruleCheck));
		} else {
			// console.log(value, formItem, formFormat[pageIndex].content);
			// 進行該欄位的新值舊值更換
			formItem = await FormUnit.updateFormValue( value, formItem, formFormat[pageIndex].content );
			// console.log("formItem", formItem);
			formFormat[pageIndex].content[editIndex] = formItem;
			formFormat[formFormat.length-1].content[allIndex] = formItem;

			// 判斷是否有url 的 action動作
			let	columnactionValue = await FormUnit.getColumnactionValue(
										getState().UserInfo.UserInfo, 
										formItem, 
										formFormat[pageIndex].content 
									);
			// console.log(columnactionValue);

			// 欄位隱藏或顯示控制
			// 判斷該值是否填寫表單中顯示
			// console.log(columnactionValue, formFormat[pageIndex].content);
			formFormat[pageIndex].content = FormUnit.checkFormFieldShow(
												columnactionValue, 
												formFormat[pageIndex].content
											);
			// console.log('formFormat[pageIndex].content', formFormat[pageIndex].content);

			// 判斷該值是否全部表單中顯示
			formFormat[formFormat.length-1].content = FormUnit.checkFormFieldShow(
														columnactionValue, 
														formFormat[formFormat.length-1].content
													  );	

			dispatch(updateDefaultValue(formFormat));
		}
	}
}

function updateDefaultValue(formFormat) {
	return {
		type: types.UPDATEDEFAULTVALUE,
		formFormat
	}
}

function updateDefaultValueError(ruleCheckMessage){
	return {
		type: types.UPDATEDEFAULTVALUEERROR,
		ruleCheckMessage
	}
}

export function checkRequiredFormValue(pageIndex, gotoPageIndex = null){
	return (dispatch, getState) => {
		let formFormat = getState().CreateForm.formFormat; 
		let formItems = formFormat[pageIndex].content;
		let checkRequired = true; //有沒有通過驗證 

		// 跳往下一頁要驗證，回前頁不用驗證
		if ( gotoPageIndex == null || pageIndex < gotoPageIndex ) {

			for(let item of formItems){
				if (item.required == "Y") {
					if (item.defaultvalue == null || item.defaultvalue.length == 0 || isNull(item.defaultvalue) ) {
						item.requiredAlbert = true;
						checkRequired = false;
					}else{
						item.requiredAlbert = false;
					}
				}
			}
		}

		formFormat[pageIndex].content = formItems;
		dispatch(checkRequiredValue(formFormat, checkRequired, gotoPageIndex));
	}
}

function checkRequiredValue(formFormat, checkRequired, gotoPageIndex){
	return {
		type: types.CHECKREQUIREDVALUE,
		formFormat,
		checkRequired,
		gotoPageIndex
	}
}

function isNull( str ){
	if ( str == "" ) return true;
	var regu = "^[ ]+$";
	var re = new RegExp(regu);
	return re.test(str);
}

export function closeCreateForm(){
	return (dispatch, getState) => {
		dispatch(closeForm());
	}
}

function closeForm() {
	return {
		type: types.CLOSECREATEFORM,
	}
}

export function submitFormValue(){
	return async (dispatch, getState) => {
		dispatch(
			refresh(getState().Language.lang.CreateFormPage.Sending)
		); //顯示載入動態

		let user       = getState().UserInfo.UserInfo;
		let formFormat = getState().CreateForm.formFormat;
		let formValue  = getState().CreateForm.formValue;
		formValue.listComponent = FormUnit.formatSubmitFormValue(formFormat[formFormat.length-1].content);
		// formValue.listComponent = formatSubmitFormValue(formFormat[formFormat.length-1].content);
		// console.log(formValue);
		// console.log("formValue",formValue);
		UpdateDataUtil.registerForm(user, formValue).then((data)=>{
			let message = getState().Language.lang.CreateFormPage.FormApplySucess;
			if (!data.success) {
				message = data.errorList[0];
			}

			dispatch(registerFormResult(data.success, message));
		}).catch((e)=>{
			LoggerUtil.addErrorLog("CreateFormAction submitFormValue", "APP Action", "ERROR", e);
		})
		
	}
}

function registerFormResult(submitResult, msg){
	return {
		type: types.REGISTERFORMRESULT,
		submitResult, 
		msg
	}
}

export function defaultSubmitResult(){
	return async (dispatch, getState) => {
		dispatch({
			type: types.DEFAULTSUBMITRESULT,
		});
	}
}

function formatSubmitFormValue(allFormFormat = null) {
	let formValue = [];
	for(let item of allFormFormat){	
		switch(item.columntype) {
		  case "rdo":
		    for(let i of item.listComponent){
	    	    formValue.push({
	    			columntype:item.columntype,
	    			id        :i.component.id,
	    			value     :(item.defaultvalue == i.component.id) ? "true" : "false"
	    	    });
		    }	
		    break;
		  case "tab":
		  case "tabcar": 	// 派車單的表格欄位輸入
		    if ( item.defaultvalue==null || item.defaultvalue.length==0 ) {
	    	    formValue.push({
	    			columntype:item.columntype,
	    			id        :item.component.id,
	    			value     :[]
	    	    });
		    } else {
		    	let values=[];
		    	for(let [i, temps] of item.defaultvalue.entries()){
		    		let value = { ROWINDEX : i.toString() };
		    		for(let [j, temp] of temps.entries()){ 
		    			value[temp.component.id] = temp.defaultvalue ? temp.defaultvalue : "";
		    		}
		    		values.push(value);
		    	}
	    	    formValue.push({
	    			columntype:item.columntype,
	    			id        :item.component.id,
	    			value     :values
	    	    });
		    }
		    break;
		  case "tableave": 	// 台級休假單的表格欄位輸入
  		    if ( item.defaultvalue==null || item.defaultvalue.length==0 ) {
  	    	    formValue.push({
  	    			columntype:item.columntype,
  	    			id        :item.component.id,
  	    			value     :[]
  	    	    });
  		    } else {
  		    	let values=[];
  		    	for(let [i, temps] of item.defaultvalue.entries()){
  		    		let value = { ROWINDEX : i.toString() };
  		    		for(let [j, temp] of temps.entries()){ 
  		    			// "ITEM1": "2019/11/12",
  		    			// "ITEM2": "全天_@1@_Ad",
  		    			// "ITEM3": "2019/11/12",
  		    			// "ITEM4": "全天_@1@_Ad",
  		    			// "ITEM5": "年假_@1@_10",
  		    			// "ITEM6": "1"
  		    			if (temp.columntype == "cbo") {
  		    				value[temp.component.id] = "";
  		    				for (let cboObject of temp.paramList) {
  		    					if (temp.defaultvalue == cboObject.paramcode) {
  		    						value[temp.component.id] = `${cboObject.paramname}_@1@_${temp.defaultvalue}`;
  		    					}
  		    				}
  		    			} else {
  		    				value[temp.component.id] = temp.defaultvalue ? temp.defaultvalue : "";
  		    			}
  		    		}
  		    		values.push(value);
  		    	}
  	    	    formValue.push({
  	    			columntype:item.columntype,
  	    			id        :item.component.id,
  	    			value     :values
  	    	    });
  		    }
  		    break;
	  	  case "taboneitem":
	  		// 修改taboneitem 的 formValue, type為tab ，value為 預設為空array
	  	  	if (item.defaultvalue==null || item.defaultvalue.length==0) {
  	  		    formValue.push({
  	  				columntype:"tab",
  	  				id        :item.component.id.substr(0, item.component.id.indexOf('.')),
  	  				value     :[]
  	  		    });
	  	  	} else {
	  		  	  	let values = [];
	  			    let keyMap = Object.keys(item.actionValue.relationMap);
	  		  	  	for(let [i, items] of item.defaultvalue.entries()){
	  			    	let value = { ROWINDEX : i.toString() };
	  			    	for (let [j, key] of keyMap.entries()){
	  			    		value[`ITEM${j+1}`] = items[key];	
	  			    	}
	  			    	values.push(value);
	  		  	  	}

		  	  	    formValue.push({
		  	  			columntype:"tab",
		  	  			id        :item.component.id.substr(0, item.component.id.indexOf('.')),
		  	  			value     :values
		  	  	    });
	  	  	}

	  	    break;
		  default:
		    formValue.push({
				columntype:item.columntype,
				id        :item.component.id,
				value     :item.defaultvalue ? item.defaultvalue : ""
		    });
		}
	}
	return formValue
}

function refresh(info) {
	return {
		type: types.CREATEFORM_REFRESHING,
		info
	}
}

export function logout(message = null) {
	return {
		type: LoginTypes.UNLOGIN,
		message
	};
}

/*
	表單傳值的格式
*/
/*
	{
		"id": "G00010",
		"empid": "A10433",
		"proid": "PRO02121500359745951",
		"astid": "AST04361500359745771",
		"listComponent": [{
			"columntype": "rdo",
			"id": "rdoYes",
			"value": "true"
		}, {
			"columntype": "rdo",
			"id": "rdoNo",
			"value": "false"
		}, {
			"columntype": "txt",
			"id": "txtEndPlace",
			"value": "中山志捷"
		}, {
			"columntype": "txt",
			"id": "txtStratPlace",
			"value": "中山志捷"
		}, {
			"columntype": "txt",
			"id": "txtPhoneManName",
			"value": "楊孟璋"
		}, {
			"columntype": "tar",
			"id": "tarContent",
			"value": "返台休假"
		}, {
			"columntype": "cbo",
			"id": "cboApporveLevel",
			"value": "45"
		}, {
			"columntype": "tab",
			"id": "tabDispatchCarTime",
			"value": [{
				"ROWINDEX": "0",
				"ITEM1": "2019/09/24",
				"ITEM2": "04:45",
				"ITEM3": ""
			}, {
				"ROWINDEX": "1",
				"ITEM1": "2019/09/25",
				"ITEM2": "04:45",
				"ITEM3": ""
			}]
		}, {
			"columntype": "tab",
			"id": "tabManName",
			"value": [{"ROWINDEX":"0","ITEM1":"1"},{"ROWINDEX":"1","ITEM1":"2"}]
		}, {
			"columntype": "tab",
			"id": "tabManNameBack",
			"value": [{"ROWINDEX":"0","ITEM1":"1"},{"ROWINDEX":"1","ITEM1":"2"}]
		}]
	}
*/
/*
{
	"id": "H00070",
	"empid": "A10433",
	"proid": "PRO04761515637264551",
	"astid": "AST09071515637264275",
	"listComponent": [{
		"columntype": "hidetxt",
		"id": "tfwAgentID",
		"value": "1A5687"
	}, {
		"columntype": "txtwithaction",
		"id": "txtAgentNM",
		"value": "馮儀安"
	}, {
		"columntype": "cbo",
		"id": "cboYear",
		"value": "2019"
	}, {
		"columntype": "date",
		"id": "calLeave",
		"value": "2019/11/11"
	}, {
		"columntype": "date",
		"id": "calBack",
		"value": "2019/11/12"
	}, {
		"columntype": "txt",
		"id": "tfwDestination",
		"value": "台灣"
	}, {
		"columntype": "cbo",
		"id": "cboApporveLevel",
		"value": "45"
	}, {
		"columntype": "rdo",
		"id": "rdoYes",
		"value": "false"
	}, {
		"columntype": "rdo",
		"id": "rdoNo",
		"value": "true"
	}, {
		"columntype": "txtwithaction",
		"id": "tfwGAD",
		"value": ""
	}, {
		"columntype": "hidetxt",
		"id": "txtGPlantID",
		"value": null
	}, {
		"columntype": "txt",
		"id": "txtLeaveDays",
		"value": "2"
	}, {
		"columntype": "txt",
		"id": "tfwRemainingDays",
		"value": "2"
	}, {
		"columntype": "tar",
		"id": "tarContent",
		"value": "ooooooooo"
	}, {
		"columntype": "hidetxt",
		"id": "tfwApplyingDays",
		"value": "1"
	}, {
		"columntype": "hidetxt",
		"id": "tfwTotalDays",
		"value": "20"
	}, {
		"columntype": "tableave",
		"id": "tabLeaveTimes",
		"value": [{
			"ROWINDEX": "0",
			"ITEM1": "2019/11/11",
			"ITEM2": "全天_@1@_Ad",
			"ITEM3": "2019/11/11",
			"ITEM4": "全天_@1@_Ad",
			"ITEM5": "年假_@1@_10",
			"ITEM6": "1"
		}, {
			"ROWINDEX": "1",
			"ITEM1": "2019/11/12",
			"ITEM2": "全天_@1@_Ad",
			"ITEM3": "2019/11/12",
			"ITEM4": "全天_@1@_Ad",
			"ITEM5": "年假_@1@_10",
			"ITEM6": "1"
		}]
	}, {
		"columntype": "hidetxt",
		"id": "tfwAnnualLeaveDays",
		"value": "10"
	}, {
		"columntype": "hidetxt",
		"id": "tfwAlreadyDays",
		"value": "10"
	}]
}
*/