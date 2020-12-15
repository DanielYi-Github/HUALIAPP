import * as types from '../actionTypes/CreateFormType';

const initialState = {
	refreshing      : false,
	refreshInfo     : "",
	submitResult    : null,
	stepsTitle      : ["",""],	// 顯示目前處在第幾個階段
	formFormat      : [],		// 用來展示表格狀態
	formValue       : {}, 		// 最後要傳給server 的格式
	checkRequired   : null, 	// 檢查是否必填的欄位都有填
	ruleCheckMessage: null,  	// 顯示欄位比對失敗的訊息
	gotoPageIndex   : null, 	// 即將跳轉的畫面
	renderResult    : null      // 紀錄是否畫面產生成功   
}

export default function createForm(state = initialState, action) {
	switch (action.type) {
		case types.CREATEFORM_REFRESHING:
			return {
				...state,
				refreshing: true,
				refreshInfo:action.info,
				renderResult: null,
			}
			break;
		case types.RENDERFORMFORMAT:
			return {
				...state,
				refreshing: false,
				refreshInfo: "",
				stepsTitle: action.stepsTitle,
				formFormat: action.apList,
				formValue : action.formValue,
				renderResult: true,
			}
			break;
		case types.RENDERFORMFORMATERROR:
			return {
				...state,
				refreshing: false,
				refreshInfo: action.e,
				renderResult: false,
			}
			break;
		case types.UPDATEDEFAULTVALUE:
			return {
				...state,
				formFormat: action.formFormat,
				checkRequired : null,
				ruleCheckMessage: null,
			}
			break;
		case types.UPDATEDEFAULTVALUEERROR:
			return {
				...state,
				ruleCheckMessage: action.ruleCheckMessage.message
			}
			break;
		case types.CHECKREQUIREDVALUE:
			return {
				...state,
				formFormat   : action.formFormat,
				checkRequired: action.checkRequired,
				gotoPageIndex: action.gotoPageIndex,
			}
			break;
		case types.REGISTERFORMRESULT:
			return {
				...state,
				refreshing 	  : false,
				submitResult  : action.submitResult,
				refreshInfo   : action.msg,
			}	
			break;
		case types.CLOSECREATEFORM:
			return {
				refreshing      : false,
				refreshInfo     : "",
				submitResult    : null,
				stepsTitle      : ["",""],	// 顯示目前處在第幾個階段
				formFormat      : [],		// 用來展示表格狀態
				formValue       : {}, 		// 最後要傳給server 的格式
				checkRequired   : null, 	// 檢查是否必填的欄位都有填
				ruleCheckMessage: null,  	// 顯示欄位比對失敗的訊息
				gotoPageIndex   : null, 	// 即將跳轉的畫面
				renderResult    : null      // 紀錄是否畫面產生成功   
			}
			break;
		case types.DEFAULTSUBMITRESULT:
			return {
				...state,
				refreshInfo  : "",
				submitResult : null,
			}
			break;
		default:
			return state;
	}
}