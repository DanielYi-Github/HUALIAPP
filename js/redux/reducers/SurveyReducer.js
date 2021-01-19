import * as types from '../actionTypes/SurveyTypes';

const initialState = {
	refreshing      : false,
	refreshInfo     : "",
	submitResult    : null,
	stepsTitle      : ["",""],	// 顯示目前處在第幾個階段
	surveyTitle     :"", 		//問卷的標題
	surveyExplain   :"", 		//問券的輔助說明
	surveyFormat    : [],		// 用來展示表格狀態
	surveyValue     : {}, 		// 最後要傳給server 的格式
	checkRequired   : null, 	// 檢查是否必填的欄位都有填
	ruleCheckMessage: null,  	// 顯示欄位比對失敗的訊息
	// gotoPageIndex   : null, 	// 即將跳轉的畫面
	renderResult    : null,      // 紀錄是否畫面產生成功   
	answerAPI 		: null 		// 回傳結果的API
}

export default function createSurvey(state = initialState, action) {
	switch (action.type) {
		case types.CREATESURVEY_REFRESHING:
			return {
				...state,
				refreshing: true,
				refreshInfo:action.info,
				renderResult: null,
				checkRequired : null
			}
			break;
		case types.RENDERSURVEYFORMAT:
			return {
				...state,
				refreshing   : false,
				refreshInfo  : "",
				stepsTitle   : action.stepsTitle,
				surveyTitle  : action.formValue.title,
				surveyExplain: action.formValue.explain,
				surveyFormat : action.apList,
				surveyValue  : action.formValue,
				renderResult : true,
				answerAPI    : action.formValue.answerAPI
			}
			break;
		case types.RENDERSURVEYFORMATERROR:
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
				surveyFormat: action.formFormat,
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
				surveyFormat   : action.surveyFormat,
				checkRequired: action.checkRequired,
				// gotoPageIndex: action.gotoPageIndex,
			}
			break;
		
		case types.REGISTERSURVEYRESULT:

			return {
				...state,
				refreshing 	  : false,
				submitResult  : action.submitResult,
				refreshInfo   : action.msg,
				checkRequired : null
			}	
			break;
		
		case types.CLOSESURVEYFORM:
			return initialState;
			break;
		/*
		case types.DEFAULTSUBMITRESULT:
			return {
				...state,
				refreshInfo  : "",
				submitResult : null,
			}
			break;
		*/
		default:
			return state;

	}
}