import { Platform, NativeModules } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import * as RNLocalize from "react-native-localize";

export function getLocale(){
	let lang = RNLocalize.getLocales()[0];
	let langCode = lang.languageCode;
	if (langCode == "zh") {
		langCode = `${langCode}-${lang.scriptCode}`
	}
	return langCode;
}

export function getAPILevel(){
	let apiLevel = "";
	if(Platform.OS==='android'){
		apiLevel = DeviceInfo.getAPILevel();
		return apiLevel;
	}else{
		return apiLevel;
	}
}
export function getAppName(){
	return DeviceInfo.getApplicationName();
}
export function getCarrier(){
	//電信
	return DeviceInfo.getCarrier();
}
export function getDeviceId(){
	return DeviceInfo.getDeviceId();
}
export async function getIP(){
	let data = await DeviceInfo.getIpAddress().then(ip => {
	  return ip;
	});
	return data;
}
export function getSystemVersion(){
	// iOS: "11.0"
	// Android: "7.1.1"
	return DeviceInfo.getSystemVersion();
}
export function getVersion(){
	return DeviceInfo.getVersion();
}
export function getModel(){
	//手機型號
	return DeviceInfo.getModel();
}

export function getDeviceName(){
	return DeviceInfo.getDeviceName();
}

export function getUniqueId(){
	return DeviceInfo.getUniqueId();;
}

export function getDevice(){
	return DeviceInfo.getDevice();
}

export function getBrand(){
	return DeviceInfo.getBrand();
}
