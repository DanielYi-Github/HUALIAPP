import RNFetchBlob from 'rn-fetch-blob';
import * as RNLocalize from "react-native-localize";
import NetInfo from "@react-native-community/netinfo";
import { TAIPEI_HOST, ZHONGSHAN_HOST, ZHONGSHAN_HOST_WIFI }   from './Contant';
import Common            from './Common';
import * as LoggerUtil   from './LoggerUtil';

const FETCH_TIMEOUT         = 100; 		// 設定timeout時間
let isTimeOut               = false; 	// 判斷是否是timeout
// let isOnlyConnectTaipeiHost = null;     // 判斷是否主機只能連台北, false只能連台北, true兩邊都能連

// 用公司wifi連qas.app.huali-group.com:8080 	會得到 119.145.249.181
// 用公司wifi連10.0.0.113:8088 				會得到 10.0.17.254
// let phoneConnectIP = null;     // 用來判斷是要連中山還是台北主機的ip
// let TOMCAT_HOST    = "";

/* 
	訊息錯誤等級說明:
	DEBUG  LEVEL 訊息事件對調適應用程序非常有幫助
	INFO   LEVEL 訊息凸顯強調應用程式的應用過程
	WARN   LEVEL 表明會出現淺在錯誤的情況
	ERROR  LEVEL 會發生錯誤，但不影響系統繼續運行
	FATAL  LEVEL 嚴重錯誤將會導致應用程式退出
*/

let NetUtil = {
	isOnlyConnectTaipeiHost: null, 	// 判斷是否主機只能連台北, false只能連台北, true兩邊都能連
	phoneConnectIP         : null,	// 用來判斷是要連中山還是台北主機的ip
	TOMCAT_HOST            : "",
	async getIsOnlyConnectTaipeiHost(){
		let params = { "content": "APIHostSwitch" };
		let fetchOptions = {
			method : 'POST',
			headers: { 'Content-Type': 'application/json' },
			body   : JSON.stringify(params)
		};

		try {
			let response = await fetch(`${TAIPEI_HOST}public/getAPIHostSwitch`, fetchOptions);
			let responseJson = await response.json();
			console.log("responseJson", responseJson);

			if(responseJson.code=="200"){
				this.isOnlyConnectTaipeiHost = responseJson.content.Switch;
				this.phoneConnectIP = responseJson.content.IP;
			}else{
				this.isOnlyConnectTaipeiHost = null;
			}
			return null;
		} catch (err) {
			this.isOnlyConnectTaipeiHost = true;
			return null;
		}
	},
	async get_TOMCAT_HOST(){
		// 決定是否只能連去台北機房
		
		if( this.isOnlyConnectTaipeiHost == null) await this.getIsOnlyConnectTaipeiHost();
		// 決定是否是中國機房,false只能連台北, true兩邊都能連
		this.isOnlyConnectTaipeiHost = this.isOnlyConnectTaipeiHost == null ? false: this.isOnlyConnectTaipeiHost;
		if( !this.isOnlyConnectTaipeiHost ){
			this.TOMCAT_HOST = TAIPEI_HOST;
		}else{
			// 決定目前所在地區
			if( RNLocalize.getTimeZone() != "Asia/Shanghai" ){
				this.TOMCAT_HOST = TAIPEI_HOST;
			}else{
				// 決定是不是使用wifi
				let isWifi = await NetInfo.fetch().then(state => {
				  console.log("isWifi", state.type);
				  return state.type == "wifi" ? true: false;
				});
				// 決定是否是公司wifi ip
				if( isWifi && this.phoneConnectIP == "119.145.249.181"){
					this.TOMCAT_HOST = ZHONGSHAN_HOST_WIFI;
				}else{
					this.TOMCAT_HOST = ZHONGSHAN_HOST;
				}
			}
		}
		return null;
	},
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
		await this.get_TOMCAT_HOST();	// 取得連線主機

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
			console.log(this.TOMCAT_HOST, url);
			let response = await fetch(`${this.TOMCAT_HOST}${url}`, fetchOptions);
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
	async getRequestContentFromTaipei(params, url){
		let fetchOptions = {
			method : 'POST',
			headers: { 'Content-Type': 'application/json' },
			body   : JSON.stringify(params)
		};

		try {
			let response = await fetch(`${TAIPEI_HOST}${url}`, fetchOptions);
			let responseJson = await response.json();
			
			if(responseJson.code=="200"){
				responseJson.code = 200
				return responseJson;
			}else{
				return responseJson; 
			}
		} catch (err) {
			return { message:`Request Error at API ${url}, message:"${err}"`, code:-2 };
		}
	},
	async getDownloadFile(params, url, RNFetchBlobTemp) {
		await this.get_TOMCAT_HOST();	
		let response = await RNFetchBlobTemp.fetch(
			'POST',
			`${this.TOMCAT_HOST}${url}`,
			{
				'Content-Type': 'application/json',
				'Cache-Control': 'no-store',
			},
			JSON.stringify(params)
		).progress((received, total) => {
		  console.log('progress', received / total);

		}).then(res => {
		  return res;

		}).catch(err => {
		  console.log('download err:', err);
		  LoggerUtil.addErrorLog(url, "APP utils in FileUtil", "ERROR", "" + err);
		  return null;
		})

		return response;
	},
	async setErrorlog( user, obj ) {
		await this.get_TOMCAT_HOST();	
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
			let response = await fetch(`${this.TOMCAT_HOST}data/setlog`, fetchOptions);
			let responseJson = await response.json();

			if(responseJson.code=="200"){
				return responseJson.content;
			}else{
				// console.log(responseJson.message);
				if(responseJson.message=="tokenerror") return { "code":"0" };
			}

		} catch (err) {
			console.log(err);
		}
		return null;
	},
}
export default NetUtil;