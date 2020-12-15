'use strict';

import * as types from '../actionTypes/LanguageTypes';
import en    from '../../languages/en';
import vi    from '../../languages/vi';
import zh_TW from '../../languages/zh_TW';
import zh_CN from '../../languages/zh_CN';

const initialState = {
	langStatus:types.TW,
	lang:zh_TW,
}

export default function langOn(state=initialState,action){
	switch(action.type){
		case types.EN:
			return {
				...state,
				langStatus:types.EN,
				lang:en,
			}
			break;
		case types.TW:
			return {
				...state,
				langStatus:types.TW,
				lang:zh_TW,
			}
			break;
		case types.CN:
			return {
				...state,
				langStatus:types.CN,
				lang:zh_CN,
			}
			break;
		case types.VI:
			return {
				...state,
				langStatus:types.VI,
				lang:vi,
			}
			break;
		default:
			return state;
	}
}