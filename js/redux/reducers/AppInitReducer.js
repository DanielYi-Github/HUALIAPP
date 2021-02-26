// 此檔暫時沒用到
'use strict';

import * as types from '../actionTypes/AppInitTypes';

const initialState = {
	appInitDone               : false,
	appInitDone_navigationPage: null,
	showUpdateProgress        : false,	// 要不要顯示進度條
	downloadProgress          : 0,		// 更新進度
	upgradeMessage            : null,   // 更新時的提示訊息
}

export default function networkOn(state = initialState, action) {
	switch (action.type) {
		case types.APP_INIT_DONE:
			return {
				...state,
				appInitDone: true,
				appInitDone_navigationPage:action.navigationPage
			}
			break;
		case types.APP_INIT_DOING:
			return {
				...state,
				appInitDone: false,
			}
			break;
		case types.APP_HOT_UPDATE:
			return {
				...state,
				showUpdateProgress : action.showUpdateProgress,	// 要不要顯示進度條
				downloadProgress   : action.downloadProgress,	// 更新進度
				upgradeMessage     : action.upgradeMessage,   	// 更新時的提示訊息
			}
			break;
		default:
			return state;
	}
}