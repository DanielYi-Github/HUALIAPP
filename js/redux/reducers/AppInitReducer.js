// 此檔暫時沒用到
'use strict';

import * as types from '../actionTypes/AppInitTypes';

const initialState = {
	appInitDone: false,
	appInitDone_navigationPage:null
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
		default:
			return state;
	}
}