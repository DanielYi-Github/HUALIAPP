'use strict';
import { Platform } from 'react-native';

import * as types from '../actionTypes/LanguageTypes';
import * as Device from '../../utils/DeviceInfoUtil';
import DeviceStorageUtil from '../../utils/DeviceStorageUtil';

export function initLang() {
	return dispatch => {
		DeviceStorageUtil.get("locale").then((value) => {
			//如果本地資料沒有，就取系統語系
			if (value) {
				value = JSON.parse(value);
				dispatch(setLang(value));
			} else {
				let locale = Device.getLocale(); // 抓取作業系統語系
				switch (locale) {
					case types.android_EN:
					case types.ios_EN:
						locale = "en";		// 英文統一代號
						break;
					case types.android_TW:
					case types.ios_TW:
						locale = "zh-TW";	// 繁中統一代號
						break;
					case types.android_CN:
					case types.ios_CN:
						locale = "zh-CN";	// 簡中統一代號
						break;
					case types.android_VI:
					case types.ios_VI:
						locale = "vi";		// 越語統一代號
						break;
					default:
						locale = "zh-CN";   // 預設繁中語系
						break;
				}

				dispatch(setLang(locale));
			}
		})
	}
}

export function setLang(lang) {
	DeviceStorageUtil.set("locale", lang);
	
	switch (lang) {
		case types.EN:
			return {
				type: types.EN,
			}
			break;
		case types.TW:
			return {
				type: types.TW,
			}
			break;
		case types.CN:
			return {
				type: types.CN,
			}
			break;
		case types.VI:
			return {
				type: types.VI,
			}
			break;
		default:
			return {
				type: types.CN,
			}
	}
}