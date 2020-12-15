'use strict';

import * as types from '../actionTypes/NetworkTypes';

const initialState = {
	networkStatus: false,
}

export default function networkOn(state = initialState, action) {
	switch (action.type) {
		case types.ONLINE:
			return {
				networkStatus: true,
			}
			break;
		case types.OFFLINE:
			return {
				networkStatus: false,
			}
			break;
		default:
			return state;
	}
}