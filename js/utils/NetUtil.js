import { TOMCAT_HOST }   from './Contant';
import Common            from './Common';
import * as LoggerUtil   from './LoggerUtil';

const FETCH_TIMEOUT = 100; // 設定timeout時間
let isTimeOut = false; 	   // 判斷是否是timeout

/* 
	訊息錯誤等級說明:
	DEBUG  LEVEL 訊息事件對調適應用程序非常有幫助
	INFO   LEVEL 訊息凸顯強調應用程式的應用過程
	WARN   LEVEL 表明會出現淺在錯誤的情況
	ERROR  LEVEL 會發生錯誤，但不影響系統繼續運行
	FATAL  LEVEL 嚴重錯誤將會導致應用程式退出
*/

let NetUtil = {
	async getRequestData(params, url) {
		return await this.dealResponseCode(params, url, "data");
	},
	async getRequestContent(params, url) {
		return await this.dealResponseCode(params, url, "content");
	},
	async getRequestJson(params, url) {
		return await this.dealResponseCode(params, url, "json");
	},
	async dealResponseCode(params, url, returnType){
		let fetchOptions = {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(params)
		};

		/* 之後再量想想如何處理請求過久問題
		let isTimeOut = false; 
		let timeout = setTimeout(function() {
			let timeoutMessage = { message:'Request timed out', code:"-1" };
			LoggerUtil.addErrorLog(url, "API request in APP", "FATAL", timeoutMessage);

			isTimeOut = true;
			return timeoutMessage;

		}, FETCH_TIMEOUT);
		*/

		try {
			let response = await fetch(`${TOMCAT_HOST}${url}`, fetchOptions);
			// clearTimeout(timeout); 
			// if (!isTimeOut){
				if (response.ok) {
					let responseJson = await response.json();
					switch (responseJson.code) {
						case "200": 	// 資料請求成功，內容正確
							responseJson.code = 200
							return responseJson;
							break;
						case "24": 	// 資料請求成功，內容正確
							responseJson.code = 200
							return responseJson;
							break;
						case "13": 		// 憑證不存在
							responseJson.message = responseJson.message=="" ? "憑證不存在" : responseJson.message;
							LoggerUtil.addErrorLog(url, "API request in APP", "DEBUG", responseJson);
							return responseJson; 
							break;
						case "0": 		// token失效
							responseJson.code = 0;
							responseJson.message = responseJson.message=="" ? "Token Error" : responseJson.message;
							LoggerUtil.addErrorLog(url, "API request in APP", "DEBUG", responseJson);
							return responseJson; 
							break;
						case "204": 	// 成功請求但是沒有返回內容
							LoggerUtil.addErrorLog(url, "API request in APP", "DEBUG", responseJson);
							return responseJson; 
							break;
						case "400": 	// 錯誤的請求  不存在的域名
							LoggerUtil.addErrorLog(url, "API request in APP", "WARN", responseJson);
							return responseJson; 
							break;
						case "401": 	// 沒有認證權限 認證錯誤
							LoggerUtil.addErrorLog(url, "API request in APP", "WARN", responseJson);
							return responseJson; 
							break;
						case "500": 	// 服務器出錯
							LoggerUtil.addErrorLog(url, "API request in APP", "FATAL", responseJson);
							return responseJson; 
							break;
						case "10": 		// 帳號錯誤
						case "11": 		// 密碼錯誤
						case "12": 		// 人員不存在
							LoggerUtil.addErrorLog(url, "API request in APP", "DEBUG", responseJson);
							return responseJson; 
							break;
						default: 		// 上述皆沒返回表示其他錯誤產生
							LoggerUtil.addErrorLog(url, "API request in APP", "WARN", responseJson);
							return responseJson; 
					}
				} else {
					response.text().then( err => {
						LoggerUtil.addErrorLog(url, "API request in APP", "FATAL", err);
					});
					return { message:"Response is not OK!", code:-2 }; 
				}
			// }else{
				// isTimeOut = false;
			// }
		} catch (err) {
			// LoggerUtil.addErrorLog(url, "API request in APP", "ERROR", err);
			return { message:`Request Error at API ${url}, message:"${err}"`, code:-2 };
		}
	},
	async setErrorlog( user, obj ) {
		let params = {
			"token"  :Common.encrypt(user.token),
			"userId" :Common.encrypt(user.loginID),
			"content":Common.encrypt(JSON.stringify(obj))
		}
		var fetchOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(params)
		};
		try {
			let response = await fetch(`${TOMCAT_HOST}data/setlog`, fetchOptions);
			let responseJson = await response.json();

			if(responseJson.code=="200"){
				return responseJson.content;
			}else{
				console.log(responseJson.message);
				if(responseJson.message=="tokenerror") return { "code":"0" };
			}

		} catch (err) {
			console.log(err);
		}
		return null;
	},
}
export default NetUtil;