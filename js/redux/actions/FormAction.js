import * as types          from '../actionTypes/FormTypes';
import * as LoginTypes     from '../actionTypes/LoginTypes';
import * as CommonTypes    from '../actionTypes/CommonTypes';
import * as SQLite         from '../../utils/SQLiteUtil';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';
import * as LoggerUtil     from '../../utils/LoggerUtil';
import FormUnit            from '../../utils/FormUnit';
import ToastUnit 		   from '../../utils/ToastUnit';

export function loadFormTypeIntoState(user,lang) {
	return async (dispatch, getState) => {
		// 載入語系給FormUnit元件
		FormUnit.language = getState().Language.lang.FormUnit;

		let appOid, functionData = getState().Home.FunctionData;
		for(let i in functionData){
			if (functionData[i].ID == "Sign") {
				appOid = functionData[i].OID
				break;
			}
		}

		// 取得開單公司清單
		let companies = null;
		let sql =  `select * 
					from THF_MASTERDATA 
					where CLASS1='HRCO' and STATUS='Y' and OID in (
						select DATA_OID 
						from THF_PERMISSION 
						where DATA_TYPE='masterdata' and FUNC_OID='${appOid}'
					) 
					order by SORT;`
		SQLite.selectData( sql, [] ).then((result) => {	
			let data          = [];
			let defaultCO     = {
				CLASS3: "ALL",
				CONTENT: getState().Language.lang.FormTypeListPage.AllCompanies,
			};

			// 0筆 1筆 多筆 需要個別做判斷
			if (result.length == 0) {
				dispatch( setCompanyList_FormSign( data, false) ); 
			} else if(result.length == 1){
				data = [...result.raw()[0]];
				dispatch( setCompanyList_FormSign( data, data[0]) ); 
			} else {
				data = [defaultCO, ...result.raw()];
				dispatch( setCompanyList_FormSign( data, defaultCO) ); 
			}	

			companies = (data.length == 0) ? false: true;
		}).catch((e)=>{
			LoggerUtil.addErrorLog("FormAction loadFormTypeIntoState", "APP Action", "ERROR", e);
		});

		// 取得表單大分類跟子分類
		let formTypes = await getFormTypes("CLASS1", 'FormType',lang).then(async (types) => {
			for (var index in types) {
				types[index].content = await getFormTypes("CLASS4", types[index].key, lang).then((result) => {
					return result;
				});
			}
			return types;
		});

		dispatch(FormTypesIntoState(formTypes)); //第一次載入state
		
		// 取得開單公司的所有表單
		if (companies) {
			let content = { id: user.id };
			UpdateDataUtil.getBPMTaskList(user, content).then((taskList)=>{
				dispatch(FormSignsIntoState( taskList, true)); // 第二次載入state，第二個參數表示已撈取結束
			}).catch( e => {
				if (e.code == "0") {
					dispatch(logout()); //已在其他裝置登入，強制登出
      				ToastUnit.show('error', getState().Language.lang.Common.TokenTimeout);	//使用者Token已過期，請重新登入!
					
				}else{
					dispatch(LoadFormError(e.message)); //撈取中出現問題
				}
			});
		} else {
			dispatch(LoadFormError("No Company Data")); //撈取中出現問題
		}
		
	}
}

async function getFormTypes(key, value,lang) {
	let list = [];
	var sql = `select CLASS3,ifnull(b.LANGCONTENT,a.CONTENT) as CONTENT
				from THF_MASTERDATA a
				left join (select LANGID,LANGCONTENT from THF_LANGUAGE where LANGTYPE='${lang}' and STATUS='Y') b on a.LEN=b.LANGID
				where STATUS='Y' and ${key}='${value}' order by a.SORT`;
	await SQLite.selectData(sql, []).then((result) => {
		for (let i = 0, len = result.length; i < len; i++) {
			list.push({
				key  : result.item(i).CLASS3,
				label: result.item(i).CONTENT,
				data : []
			});
		}

	}).catch((e)=>{
		LoggerUtil.addErrorLog("FormAction loadFormTypeIntoState", "APP Action", "ERROR", e);
	});
	return list;
}

function FormTypesIntoState(data, isLoadDone = false) {
	return {
		type: types.LOADFORMTYPES,
		data,
		isLoadDone
	}
}

function setCompanyList_FormSign(data, defaultCO){
	return {
		type: types.SET_COMPANIES_FORMSIGN,
		data,
		defaultCO
	}
}

export function loadAllFormsIntoState() {
	return async (dispatch, getState) => {
		dispatch(FormSignsIntoState([], false)); //顯示載入動態

		let user = getState().UserInfo.UserInfo;
		let companies = (getState().Form.Companies_FormSign.companyList.length == 0) ? false : true;
		if (companies) {
			let content = { id: user.id };
			UpdateDataUtil.getBPMTaskList(user, content).then((taskList)=>{
				dispatch(FormSignsIntoState( taskList, true)); // 第二次載入state，第二個參數表示已撈取結束
			}).catch( e => {
				if (e.code == "0") {
					dispatch(logout()); //已在其他裝置登入，強制登出
      				ToastUnit.show('error', getState().Language.lang.Common.TokenTimeout);	//使用者Token已過期，請重新登入!
				}else{
					dispatch(LoadFormError(e.message)); //撈取中出現問題
				}
			});
		} else {
			dispatch(LoadFormError("No Company Data")); //撈取中出現問題
		}
	}
}

function FormSignsIntoState(data , isLoadDone = false) {
	return {
		type: types.LOADFORMSIGNS,
		data,
		isLoadDone
	}
}

export function	loadFormContentIntoState(userData, formData, lang){
	return (dispatch, getState) => {
		dispatch(refresh()); //顯示載入動態

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
		let processid = formData.processid
		let id = formData.id
		let rootid = formData.rootid
		let tskid = formData.tskid
		let isReview = formData.isReview
		let reviewOid = formData.reviewOid

		let content_getBPMForm = {
			"proid" : processid,
			"lineid": id,
			"tskid" : rootid,
			"lang"  : lang,
			"userid": userData.id,
			isReview,
			reviewOid
		};
		let content_getAllSignResult = {
			"rootid" : rootid,
			"lang" : lang,
			isReview
		};
		let content_getBPMSignState = {
			"proid" : id,
			"lang"  : lang,
			"tskid" : tskid,
			isReview,
		};

		let p1 = UpdateDataUtil.getBPMForm(userData, content_getBPMForm);
		let p2 = UpdateDataUtil.getAllSignResult(userData, content_getAllSignResult);
		let p3 = UpdateDataUtil.getBPMSignState(userData, content_getBPMSignState);

		Promise.all([p1, p2, p3]).then( async (value) => {
			console.log("value", value);
			let isLevelEditable  = value[0].edit == "Y" ? true : false;             //判斷這關卡能不能編輯
			let handsign         = value[0] ? value[0].handsign : false;			//是否需要手寫板簽名
			let showsign         = value[0] ? value[0].showsign : false;			//是否需要顯示核決層級
			let signresult       = value[0] ? value[0].signresult : false;			//是否需要顯示回簽
			let allowAddSign     = ( value[2].allowAddSign ) ? true : false;		//是否顯示加簽
			let allowAddAnnounce = ( value[2].allowAddAnnounce ) ? true : false; 	//是否顯示加會

			let formRecords         = value[1] ? value[1] : [];
			let formSignBtn         = value[2];
			formSignBtn.listBack    = dealArraytoObject(formSignBtn.listBack);
			formSignBtn.listSignbtn = dealArraytoObject(formSignBtn.listSignbtn);

			let apList      = [];
			let apListIndex = -1;
			
			// 整理申請人資訊、更多申請人資訊
			var tmpList = value[0] ? value[0].tmpList : []; 
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
					if (tmpList[i].component.name == "cboApporveLevel" && showsign) {
					} else {
						apList[apListIndex].content.push(tmpList[i]);			
					}
				}
			}
			
			// 表單具體內容
			tmpList = value[0] ? value[0].comList : []; 
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
					// 附值進defaultvalue
					tmpList[i] = await FormUnit.formatEditalbeFormField(tmpList[i]);	// 取得該欄位的動作
					// 整理成可編輯的表格格式
					if ( tmpList[i].isedit == "Y" && isLevelEditable ) {
						for(let j in tmpList[i].listComponent){
							tmpList[i].listComponent[j].defaultvalue = null;
						}
					}

					tmpList[i].show = true; 	   		   // 該欄位要不要顯示
					tmpList[i].requiredAlbert = false; 	   // 該欄位空值警告
					tmpList[i].actionValue = isLevelEditable ? await FormUnit.getActionValue(userData, tmpList[i]): null;	// 取得該欄位的動作
					apList[apListIndex].content.push(tmpList[i]);	
				}
			}
			
			// 判斷附件有沒有值
			tmpList = value[0] ? value[0].tmpBotomList : []; 
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
			if (value[0].formview == "Y") {
				bpmImage = await UpdateDataUtil.getBPMTaskImage(userData, rootid, tskid).then((result)=>{
					return result;
				});
			}	

			dispatch( 
				loadFormContent( 
					apList, 
					formRecords, 
					formSignBtn, 
					handsign, 
					showsign, 
					signresult, 
					bpmImage,
					allowAddSign,
					allowAddAnnounce,
					isLevelEditable
				) 
			); 
			
			
		}).catch((err) => {
			LoggerUtil.addErrorLog("FormAction loadFormContentIntoState", "APP Action", "ERROR", err);
			if (err.code == "0") {
				dispatch(logout()); //已在其他裝置登入，強制登出
      			ToastUnit.show('error', getState().Language.lang.Common.TokenTimeout);//使用者Token已過期，請重新登入!
				
			}else{
				dispatch(LoadFormError(err.message)); //撈取中出現問題
			}
			
		})
	}
}

function dealArraytoObject(array) {
	if (array == null || array.length ==0 ) {
		return null;
	}

	let temp;
	for (var i in array) {
		temp = array[i].split("=");
		array[i] = {
			key: temp[1],
			label: temp[0]
		}
	}
	return array;
}

function loadFormContent(data, records, signBtns, handsign, showsign, signresult, bpmImage, allowAddSign, allowAddAnnounce, isLevelEditable) {
	return {
		type: types.LOADFORMCONTENT,
		data,
		records,
		signBtns,
		handsign,
		showsign,
		signresult,
		bpmImage,
		allowAddSign, 
		allowAddAnnounce,
		isLevelEditable
	}
}

export function checkRequiredFormValue(formFormat) {
	return (dispatch, getState) => {
		let isRequiredAlert = false; //是否發出必填警告

		for(let content of formFormat){
			for (let item of content.content) {
				if (item.isedit=="Y" && item.required == "Y") {
					if (item.defaultvalue == null || item.defaultvalue.length == 0 || isNull(item.defaultvalue)) {
						item.requiredAlbert = true;
						isRequiredAlert = getState().Language.lang.CreateFormPage.RequiredFieldAlert; // 新增必填資訊警告
					} else {
						item.requiredAlbert = false;
					}

					// 檢查是不是必填的文字輸入匡，而且需要必填
					if (item.columntype == "txt" || item.columntype == "tar") {
					  let string = item.defaultvalue;
					  string = string.replace(/\r\n/g,"");
					  string = string.replace(/\n/g,"");
					  string = string.replace(/\s/g,"");
					  if (string.length ==0){
					   item.requiredAlbert = true;
					   isRequiredAlert = `"${item.component.name}" ${getState().Language.lang.CreateFormPage.RequiredFieldAlert}`; // 新增必填資訊警告
					  }
					}
				}
			}
		}

		dispatch(updateDefaultValue(formFormat, isRequiredAlert));
	}
}

function isNull( str ){
	if ( str == "" ) return true;
	var regu = "^[ ]+$";
	var re = new RegExp(regu);
	return re.test(str);
}

export function submitSignForm(user, form, info, allowAddValue, isLevelEditable){
	return async (dispatch, getState) => {
		dispatch( refresh() ); //顯示載入動態

		// 判斷在FindPage裡面有沒有這筆資料
		let isFromFindPage = false, indexInFindPage, indexInFindPageSections;
		let keywordSearchResult = getState().Common.keywordSearchResult;
		for (let i in keywordSearchResult) {
			if ( keywordSearchResult[i].type == "SIG" ) {
				indexInFindPageSections = i;
				indexInFindPage = keywordSearchResult[i].data.indexOf(form);
				isFromFindPage = ( indexInFindPage >= 0) ? true : false; 
			}
		}

		/*整理加會簽資料*/
		let asTitle=null, asType=null, asMembers=[];
		if(allowAddValue != null){
			asTitle=allowAddValue.asTitleFormat.defaultvalue;
			asType = allowAddValue.asTypeFormat.defaultvalue;
			for(let item of allowAddValue.asMembersFormat.defaultvalue){
				asMembers.push(item.COLUMN1);
			}
		}

		/*整理表單類型資料*/
		let formSignOption = null;
		if ( info.formSignState ) { formSignOption = (form.id.substr(0,3)=="PRO") ? info.formSignOption[0].key : null } 
		else { formSignOption = info.formSignOption[0].key }

		/*整理表單可編輯欄位回傳資料*/
		let listComponent = [];
		// 判斷現在這個關卡需不需要編輯
		if (isLevelEditable) {
			let FormContent = getState().Form.FormContent;
			for (let i = 2, length = FormContent.length; i < length; i++) {
				for(let content of FormContent[i].content){
					// if (content.isedit == "Y") listComponent.push(content);
					listComponent.push(content);
				}
			}
			listComponent = await FormUnit.formatSubmitFormValue(listComponent);
		}

		/**
		* 簽核送出
		* {
			proid        :"PROXXXX",  	//關卡ID
			tskid        :"TSKXXX",  	//工作ID
			sign         :"ASTXXX",   	//送出的流程線ID 如果IAP或SGN就不需要填
			message      :"OK",   		//簽核意見內容
			listComponent:[], 			//儲存欄位資訊，空值的話為空array	
			isAddSign    :"false"		//是否加簽
			asTitle      :"主旨1111",	//加會簽主旨
			asType       :"AddParallelAnnounce",	//加會簽類型
			asMembers    :["A10433"]	//加會簽人員
		* }
		*/

		
		let sign = {
			proid        : form.id,  	
			tskid        : form.tskid,  
			sign         : formSignOption,
			message      : info.signOpinion,
			handsign     : info.handsign, 	// img base64
			listComponent: listComponent,
			isAddSign    : form.isAddSign,
			asTitle      : asTitle,
			asType       : asType,
			asMembers    : asMembers,
			isReview	 : form.isReview,
			reviewOid    : form.reviewOid
		}
		// console.log("sign",sign);
		
		
		//	簽核狀況判斷
		let data = {};
		if ( info.formSignState ){ 
			data = await UpdateDataUtil.completeTask(user, sign); 
		} else { 
			data = await UpdateDataUtil.goBackTask(user, sign) 
		}
		
		dispatch( submitResult(data, form) ); 
		dispatch( { type: types.FORMSIGNDONE } ); 
		if (isFromFindPage && data.success){
			dispatch( 
				removeResultInFindPageList(indexInFindPageSections, indexInFindPage)
			);	
		}
		
	}
}

function submitResult(data, form) {
	return {
		type: types.SUBMITRESULT,
		data,
		form,
	}
}

export function logout(message = null) {
	return {
		type: LoginTypes.UNLOGIN,
		message
	};
}

export function LoadFormError(message = null){
	return {
		type: types.LOADFORMTYPESERROR,
		message
	};	
}

function removeResultInFindPageList(sectionIndex, index){
	return {
		type: CommonTypes.REMOVERESULTINFAIDPAGE,
		sectionIndex,
		index
	}
}

function refresh() {
	return {
		type: types.FORM_REFRESHING,
	}
}

export function setInitialState() {
	return {
		type: types.INITIALSTATE,
	}
}

export function deleteAllForms() {
	return {
		type: types.DELETEALLFORMS,
	}
}

export function updateFormDefaultValue(value, formItem, pageIndex){
	return async (dispatch, getState) => {
		let formFormat = getState().Form.FormContent;
		let editIndex  = formFormat[pageIndex].content.indexOf(formItem);
		
		// console.log(1);
		// 欄位自己的規則比較
		let ruleCheck = await FormUnit.formFieldRuleCheck(
								value, 
								formItem, 
								formFormat[formFormat.length-1].content, 
								formItem.columntype
							  );
		if( ruleCheck != true){
			// console.log(2);
			dispatch(updateDefaultValueError(ruleCheck.message));
		} else {
			// console.log(3);
			// 進行該欄位的新值舊值更換
			formItem = await FormUnit.updateFormValue( value, formItem, formFormat[pageIndex].content );
			formFormat[pageIndex].content[editIndex] = formItem;

			// 判斷是否有url 的 action動作
			// console.log(4);
			let	columnactionValue = await FormUnit.getColumnactionValue(
										getState().UserInfo.UserInfo, 
										formItem, 
										formFormat[pageIndex].content,
										formFormat
									);
			// 欄位隱藏或顯示控制
			// 判斷該值是否填寫表單中顯示
			// console.log(5);
			formFormat[pageIndex].content = FormUnit.checkFormFieldShow(
												columnactionValue.columnList, 
												formFormat[pageIndex].content
											);	
			dispatch(updateDefaultValue(formFormat));
		}
		
	}
}

function updateDefaultValue(FormContent, isRequiredAlert = false) {
	return {
		type: types.UPDATEDEFAULTVALUE_FOR_FORMSIGN,
		FormContent,
		isRequiredAlert
	}
}

function updateDefaultValueError(ruleCheckMessage){
	return {
		type: types.UPDATEDEFAULTVALUEERROR_FOR_FORMSIGN,
		ruleCheckMessage
	}
}

export function	reloadFormContentIntoState_fromGetColumnactionValue(
		user, 
		button, 
		formContent
	){
	return async (dispatch, getState) => {
		//顯示載入動態
		dispatch(refresh());

		// 獲取載入前期分數
		let columnactionValueList = await FormUnit.getColumnactionValueForButton(
			user, 
			button, 
			formContent
		);
		console.log("columnactionValueList", columnactionValueList);

		let formFormat = getState().Form.FormContent;
		let loadMessgaeObject = {
			type   :'success',
			message:getState().Language.lang.FormContentGridForEvaluation.loadPreviousScore_Success
		};

		/*
		// API請求是否成功
		if (columnactionValueList.requstError) {
			// API請求失敗
			loadMessgaeObject = {
				type   :'error',
				message:getState().Language.lang.FormContentGridForEvaluation.loadPreviousScore_Error
			}
		} else {
			// API請求成功,如果msgList有資料，取決serverComfirmUpdateData決定是否進行資料更新
			if ( columnactionValueList.msgList.length == 0 ) {
				// msgList沒資料，進行資料更新
				formFormat = getFormFormat(columnactionValueList, formFormat);
				loadMessgaeObject = {
					type   :'success',
					// message:getState().Language.lang.FormContentGridForEvaluation.loadPreviousScore_Success
					message:"成功"
				}
			} else {
				// msgList有資料，serverComfirmUpdateData決定是否資料更新
				if (columnactionValueList.serverComfirmUpdateData) {
					// serverComfirmUpdateData決定資料更新
					formFormat = getFormFormat(columnactionValueList, formFormat);
					loadMessgaeObject = {
						type   :'info',
						message:columnactionValueList.msgList[0]
					}
				} else {
					// serverComfirmUpdateData決定不做資料更新
					loadMessgaeObject = {
						type   :'info',
						message:columnactionValueList.msgList[0]
					}
				}
			}
		}
		*/

		let isShowMessageOrUpdateDate = FormUnit.isShowMessageOrUpdateDate(columnactionValueList, getState().Language.lang);
		// 是否顯示提示訊息
		if (isShowMessageOrUpdateDate.showMessage) {
			loadMessgaeObject = {
				type   :isShowMessageOrUpdateDate.showMessage.type,
				message:isShowMessageOrUpdateDate.showMessage.message
			}
		}
		// 是否確認更換資料
		if (isShowMessageOrUpdateDate.updateData) {
			formFormat = getFormFormat(columnactionValueList, formFormat);
		}

		// 回傳結果
		dispatch(updateDefaultValue(formFormat));

		// 新增提示字
		dispatch(
			showLoadMessgae(
				loadMessgaeObject.type,
				loadMessgaeObject.message
			)
		);
	}
}

function showLoadMessgae(type, messgae){
	return{
		type       : types.SHOW_FORMLOADMESSAGE,
		messageType: type,
		message    : messgae
	}
}

function getFormFormat(columnactionValueList, formFormat){
	// console.log(formFormat);
	// console.log(columnactionValueList);

	for(let formContent of formFormat){
		for(let content of formContent.content){
			for(let columnactionValue of columnactionValueList.columnList){
				if (content.component.id == columnactionValue.id) {
					for (let [i, value] of content.defaultvalue.entries()) {

						// console.log(columnactionValue, value);
						if (columnactionValue.voGrid != null){
							for(let voGrid of columnactionValue.voGrid[i]){
								for(let item of value){
									if(voGrid.id == item.component.id){
										item.defaultvalue = voGrid.value;
									}
								}
							}
						}

						if (columnactionValue.voList != null){
						}
						
					}
				}
			}
		}
	}


	return formFormat;
}


/*
	//	簽核狀況判斷
	if (info.formSignState) {
		
		// 簽核送出
		// {
		// 	proid    :"PROXXXX",  	//關卡ID
		// 	tskid    :"TSKXXX",  	//工作ID
		// 	sign     :"ASTXXX",   	//送出的流程線ID 如果IAP或SGN就不需要填
		// 	message  :"OK",   		//簽核意見內容
		// 	listComponent:[], 		//儲存欄位資訊，空值的話為空array	
		// }

		let sign = {
			proid        : form.id,  	
			tskid        : form.tskid,  
			sign         : (form.id.substr(0,3)=="PRO") ? info.formSignOption[0].key : null,
			message      : info.signOpinion,
			handsign     : info.handsign, 	// img base64
			listComponent: [],
			isAddSign    : form.isAddSign
		}
		
		UpdateDataUtil.completeTask(user, sign).then((data)=>{
			console.log(data);
			dispatch( submitResult(data, form)); 
			dispatch( { type: types.FORMSIGNDONE } ); 
			if (isFromFindPage && data.success) dispatch( removeResultInFindPageList(indexInFindPageSections, indexInFindPage)); 
		}).catch((err) => {
			console.log(err.message)
		});
		
	} else {
		// 簽核退回
		// {
		// 	proid    :"PROXXXX",  	//關卡ID
		// 	tskid    :"TSKXXX",  	//工作ID
		// 	sign     :"ASTXXX",   	//要退回的階段，內容為PRO和TSK
		// 	message  :"OK",   		//簽核意見內容
		// 	listComponent:[], 		//儲存欄位資訊，空值的話為空array	
		// }
		
		
		let sign = {
			proid        : form.id,  	
			tskid        : form.tskid,  
			sign         : info.formSignOption[0].key,
			message      : info.signOpinion,
			handsign     : info.handsign, 	// img base64
			listComponent: [],
			isAddSign    : form.isAddSign
		}

		UpdateDataUtil.goBackTask(user, sign).then((data)=>{
			console.log(data);
			dispatch( submitResult(data, form)); 
			dispatch( { type: types.FORMSIGNDONE } ); 
			if (isFromFindPage && data.content.success) dispatch( removeResultInFindPageList(indexInFindPageSections, indexInFindPage)); 
		}).catch((err) => {
			console.log(err.message)
		});
		
	}
*/

/**
* 儲存
* {
	"tskid":"TSKXXX",  //工作ID
	"message":"OK",   //簽核意見內容
	"listKey":["tfwWriterID","txtWriterNM"],  //修改欄位的ID
	"listValue":["A10433","楊孟璋"]            //修改欄位的內容
* }
*
	let sign = {
		tskid    : form.tskid,  
		message  : info.singOpinion,
	}
	UpdateDataUtil.suspendTask(user, sign).then((data)=>{
		dispatch( rejectResult( data, form) ); 
		dispatch( { type: types.FORMSIGNDONE } ); 
		if (isFromFindPage) dispatch( removeResultInFindPageList(indexInFindPageSections, indexInFindPage)); 
	}).catch((err) => {
		console.log(err.message)
	});
*/