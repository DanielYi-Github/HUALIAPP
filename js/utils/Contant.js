import * as RNLocalize from "react-native-localize";

// let host = 'http://app.huali-group.com:8080/MobileApp/';    	// 正式機
let host = 'http://qas.app.huali-group.com:8080/MobileApp/';	// 測試機
// let host = 'http://10.0.0.116:8080/MobileApp/';					// 開發機

if( RNLocalize.getTimeZone() == "Asia/Shanghai" ){
	// host = 'http://10.0.0.113:8080/';    	// 正式機
	host = 'http://10.0.0.113:8088/';							// 測試機
	// host = 'http://10.0.0.116:8080/MobileApp/';				// 開發機
}else{
	// host = 'http://app.huali-group.com:8080/MobileApp/';    // 正式機
	host = 'http://qas.app.huali-group.com:8080/MobileApp/';   // 測試機
	// host = 'http://10.0.0.116:8080/MobileApp/';				// 開發機
}

export const TOMCAT_HOST = host ;

//AES加密
export const AES_KEY = 'HFFGROUP20180313';
export const AES_VI  = 'HFFGROUP20180313';

// 正式機
// export const CODE_PUSH_KEY_ANDROID = '9ai2v7OA6K1iZDUAtCuCTm91aR6Y4ksvOXqog';
// export const CODE_PUSH_KEY_IOS     = 'pTMusJbFgikGtX7cgHKDGQl1JiYP4ksvOXqog';

// 測試機
export const CODE_PUSH_KEY_ANDROID = 'onpNlKOEeSLvZybeEKXPVQVHmc6O4ksvOXqog';
export const CODE_PUSH_KEY_IOS = 'AJhlSYXl4E1Vhy1XxvQN6Q0IsDKl4ksvOXqog';