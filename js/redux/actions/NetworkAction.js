'use strict';
import NetInfo from "@react-native-community/netinfo";
import * as types from '../actionTypes/NetworkTypes';

export function setNetworkStatus() {
	// status = 'OFFLINE'; //測試目前網路狀態圍籬縣
	return async dispatch => {
		// 監聽網路狀況
		NetInfo.addEventListener(state => {
			if (state.isConnected) {
				dispatch({
					type: types.ONLINE,
				});
			} else {
				dispatch({
					type: types.OFFLINE,
				});
			}
		});
	}
}