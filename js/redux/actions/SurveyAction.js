import * as types          from '../actionTypes/SurveyTypes';
import * as LoginTypes     from '../actionTypes/LoginTypes';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';
import * as LoggerUtil     from '../../utils/LoggerUtil';
import FormUnit            from '../../utils/FormUnit';
import ToastUnit 		   from '../../utils/ToastUnit';

export function refreshing(enable){
	return (dispatch, getState) => {
		if (enable) {
			dispatch({
				type: types.SURVEY_REFRESHING,
				info: getState().Language.lang.SurveyPage.Creating
			})
		} else {
			dispatch({
				type: types.SURVEY_REFRESHING_END,
				info: getState().Language.lang.SurveyPage.Creating
			})
		}
	}
}

export function getSurveyFormat( surveyOID ){
	return (dispatch, getState) => {
		//顯示載入動態
		dispatch(
			refresh( getState().Language.lang.SurveyPage.Creating )
		);
		 
		let user = getState().UserInfo.UserInfo;
		let content = {
			id  : surveyOID,
		};

		// 載入語系給FormUnit元件
		FormUnit.language = getState().Language.lang.FormUnit;
		
		UpdateDataUtil.getCreateSurvey(user, content).then( async (data)=>{
			// console.log("getCreateSurvey",data);
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


					unShowColumns = unShowColumns.concat(columnactionValue.columnList);
					apList[apListIndex].content.push(columnData);	
					comfirmComponent.push(columnData);
				}
			}
			/*
			apList.push({
				id        :"finallComfirm",
				name      :getState().Language.lang.CreateFormPage.FinallComfirm, 	// 確認內容
				columntype:"ap",
				content   :comfirmComponent
			})
			
			stepsTitle.push(getState().Language.lang.CreateFormPage.FinallComfirm); // 確認內容
			*/
			
			dispatch(
				renderFormFormat(
					stepsTitle, 
					apList,
					{
						id           : surveyOID,
						title 		 : data.title,
						explain      : data.explain,
						empid        : user.id,
						proid        : data.proid,
						astid        : data.astid,
						listComponent: formatSubmitFormValue(comfirmComponent),
						answerAPI    : data.answerapi
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
		type: types.RENDERSURVEYFORMAT,
		stepsTitle, 
		apList,
		formValue
	}
}

function renderFormFormatError(e){
	return {
		type: types.RENDERSURVEYFORMATERROR,
		e
	}
}

export function updateFormDefaultValue(value, formItem, pageIndex){
	return async (dispatch, getState) => {
		let surveyFormat = getState().Survey.surveyFormat;
		let editIndex  = surveyFormat[pageIndex].content.indexOf(formItem);
		// let allIndex   = formFormat[formFormat.length-1].content.indexOf(formItem);

		// 欄位自己的規則比較
		let ruleCheck = await FormUnit.formFieldRuleCheck(
								value, 
								formItem, 
								surveyFormat[surveyFormat.length-1].content, 
								formItem.columntype
							  );
		if( ruleCheck != true){
			dispatch(updateDefaultValueError(ruleCheck));
		} else {
			// 進行該欄位的新值舊值更換
			formItem = await FormUnit.updateFormValue( value, formItem, surveyFormat[pageIndex].content );
			surveyFormat[pageIndex].content[editIndex] = formItem;
			// formFormat[formFormat.length-1].content[allIndex] = formItem;

			// 判斷是否有url 的 action動作
			let	columnactionValue = await FormUnit.getColumnactionValue(
										getState().UserInfo.UserInfo, 
										formItem, 
										surveyFormat[pageIndex].content 
									);
			
			/*
			// 判斷該值是否填寫表單中顯示
			surveyFormat[pageIndex].content = FormUnit.checkFormFieldShow(
												columnactionValue, 
												surveyFormat[pageIndex].content
											);
			*/
			// 欄位隱藏或顯示控制
			// 判斷該值是否全部表單中顯示
			surveyFormat[pageIndex].content = FormUnit.checkFormFieldShow( columnactionValue.columnList, surveyFormat[pageIndex].content );	
			dispatch(updateDefaultValue(surveyFormat));
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
		let formFormat = getState().Survey.surveyFormat; 
		let formItems = formFormat[pageIndex].content;
		let checkRequired = true; //有沒有通過驗證 

		// 跳往下一頁要驗證，回前頁不用驗證
		// if ( gotoPageIndex == null || pageIndex < gotoPageIndex ) {

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
		// }

		formFormat[pageIndex].content = formItems;
		dispatch(checkRequiredValue(formFormat, checkRequired));
	}
}

function checkRequiredValue(surveyFormat, checkRequired){
	return {
		type: types.CHECKREQUIREDVALUE,
		surveyFormat,
		checkRequired
	}
}

function isNull( str ){
	if ( str == "" ) return true;
	var regu = "^[ ]+$";
	var re = new RegExp(regu);
	return re.test(str);
}

export function closeSurveyForm(){
	return (dispatch, getState) => {
		dispatch(closeForm());
	}
}

function closeForm() {
	return {
		type: types.CLOSESURVEYFORM,
	}
}

export function submitSurveyValue(){
	return async (dispatch, getState) => {
		
		dispatch(
			refresh(getState().Language.lang.SurveyPage.Sending)
		); //顯示載入動態
		
		
		let user         = getState().UserInfo.UserInfo;
		let surveyFormat = getState().Survey.surveyFormat;
		let surveyValue    = getState().Survey.surveyValue;
		surveyValue.listComponent = FormUnit.formatSubmitSurveyValue(surveyFormat[surveyFormat.length-1].content);
		surveyValue = formatSurveySubmitValue(surveyValue);

		// console.log("surveyValue", surveyValue);
		UpdateDataUtil.registerSurvey(user, surveyValue, getState().Survey.answerAPI).then((data)=>{
			/*
			if (!data.success) {
				message = data.errorList[0];
			}
			*/

			let message = getState().Language.lang.SurveyPage.FormApplySucess;
			// dispatch(registerSurveyResult(data.success, message));
			dispatch(registerSurveyResult(true, message));
		}).catch((e)=>{
			LoggerUtil.addErrorLog("SurveyAction submitSurveyValue", "APP Action", "ERROR", e);

			dispatch(renderFormFormatError(e)); //撈取中出現問題
		})
		
	}
}

function formatSurveySubmitValue(surveyValue){
	// 欄位格式
	/*
	{
		'id':'B8BF35C543F2D569E050000A76006341',
		'answer':{
			'B8D2BFF2ED5BECE0E050000A76004D1A':'阳江',
			}
	}
	*/
	let value = {
		id:surveyValue.id,
		answer:{}
	}

	for(let item of surveyValue.listComponent){
		value.answer[item.id] =  item.value;
	}
	return value;
	// console.log(value);

}

function registerSurveyResult(submitResult, msg){
	return {
		type: types.REGISTERSURVEYRESULT,
		submitResult, 
		msg
	}
}

/*
export function defaultSubmitResult(){
	return async (dispatch, getState) => {
		dispatch({
			type: types.DEFAULTSUBMITRESULT,
		});
	}
}
*/
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
		type: types.CREATESURVEY_REFRESHING,
		info
	}
}
/*
export function logout(message = null) {
	return {
		type: LoginTypes.UNLOGIN,
		message
	};
}
*/