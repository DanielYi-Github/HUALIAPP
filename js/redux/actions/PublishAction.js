import * as types from '../actionTypes/PublishTypes';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';

export function savePublishItem(title, context, languageSelected) {
	return async dispatch => {
		let publishItem = {
			title: title,
			context: context,
			language: languageSelected.label,
			languageKey: languageSelected.key
		};
		dispatch(save(publishItem));
	}
}

export function editPublishItem(data, index ) {
	return async dispatch => {
		let temp = {
			index: index,
			data: data
		};
		dispatch( edit(temp));
	}
}

export function cancelEdit(){
	return async dispatch => {
		dispatch( cancel_Edit() );
	}	
}

export function deletePublishItem(data) {
	return async dispatch => {
		dispatch(remove(data));
	}
}

export function submitPublish(user, data, com, fac){
	return async dispatch => {
		dispatch( submitting() ); //開始顯示載入資料畫面

		let listLang = new Array();
		for (var i = 0 , len = data.length ; i < len ; i++) {
		  	listLang.push({
				"lang": data[i].languageKey,
				"title": data[i].title,
				"content": data[i].context
			});
		}

		let listReceiver = [];
		if ( fac == 0 ) {
			listReceiver.push({
				"type":"C",
				"userid":com
			});
		} else {
			listReceiver.push({
				"type":"P",
				"userid":com+fac
			});
		}

		let content = {
			msg:{
			   	type:"apppush",
				title:data[0].title,
				content:data[0].context,
				crtemp:user.id
			},
			listLang:listLang,
			listReceiver:listReceiver
		}
		
		/*
		*	server 同步資料	
		*/

		
		Promise.all([
			UpdateDataUtil.setPushMsg(user,content),
		]).then(() => {
			dispatch( submitted() );  			//結束載入資料畫面
		}).catch((e) => {
			if (e.code === "0") {
				dispatch( submit_fail() );  	//結束載入資料畫面
			}
			dispatch( submit_fail() );  		//結束載入資料畫面
		})
		
		
		/*
		{
		   "token":"uglyT2MZX3ml+zxEAUSmhCYG+jEutidOgpLYVnNAaE=",
		   "userId":"8wSNK2qN6Si0pnHHmpfrpA==",
		   "content":{
		          "msg":{
		             "type":"birthday",
		             "title":"生日快樂",
		             "content":"生日快樂",
		             "crtemp":"A10433"
		          },
		          "listLang": [{
		            "lang": "zh-CN",
		            "title": "生日快樂",
		            "content": "生快"
		          }, {
		            "lang": "en",
		            "title": "生日快樂",
		            "content": "happy birthday"
		          }],
		          "listReceiver":[
		           {"type":"C","userid":"CB"},		//C 是公司
		           {"type":"P","userid":"C31"}		//P 是廠區
		          ]
		   }
		}
		*/
	}	
}

export function cancelPublish(){
	return async dispatch => {
		dispatch( cancel_Publish() );
	}
}

function save(publishItem) {
	return {
		type: types.SAVE,
		publishItem
	}
}

function edit(data) {
	return {
		type: types.EDITING,
		data
	}
}

function cancel_Edit(){
	return {
		type: types.EDITED,
	}	
}

function remove(data) {
	return {
		type: types.DELETE,
		data
	}
}

function cancel_Publish() {
	return {
		type:types.CANCEL,
	}
}

function submitting() {
	return {
		type: types.SUBMITTING
	}
}

function submitted() {
	return {
		type: types.SUBMITTED
	}
}

function submit_fail(){
	return {
		type: types.SUBMIT_FAIL
	}
}