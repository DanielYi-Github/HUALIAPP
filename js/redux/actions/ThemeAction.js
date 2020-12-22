'use strict';
// import RNFetchBlob from 'rn-fetch-blob';
import * as types          from '../actionTypes/ThemeTypes';
import DeviceStorageUtil   from '../../utils/DeviceStorageUtil';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';


/*****
	初始化節慶主題皮膚的設置，分別有三個變數做決定
	server 端的
	seasonThemeDisplayFromServer:管理平台決定是否開啟節慶主題模式

	local 端的
	showTheme: 目前APP所顯示的模式
	seasonThemeDisplay: 是否同意接管"管理平台"所決定的節慶主題模式
	
	當
	seasonThemeDisplayFromServer端為T，seasonThemeDisplay為T
	開啟節慶主題模式，showTheme保留為本主題

	seasonThemeDisplayFromServer端為F，seasonThemeDisplay為F
	強制切換回原本主題(預設為platform)
	seasonThemeDisplay改為true	
*****/
export function setThemeState(theme = null, netStatus) {
	return async (dispatch, getState) => {
		let seasonThemeDisplayFromServer = false;
		if (netStatus) seasonThemeDisplayFromServer = await UpdateDataUtil.getSeasonThemeDisplay();
		
		let storageTheme = await DeviceStorageUtil.get('storageTheme').then( async (data)=>{
			let defaultTheme = {
				showTheme : "platform",
				seasonThemeDisplay : true
			};

			data = (data == "" || data == null || typeof data == "undefined") ? defaultTheme : await JSON.parse(data);
			if ( typeof data.showTheme == "undefined") {
				data = {
					showTheme:data,
					seasonThemeDisplay:true
				}	
			}
			return data;
		});

		if (seasonThemeDisplayFromServer) {
			if (storageTheme.seasonThemeDisplay) {
				dispatch({ 
					type: "season",
					initial: true,
					serverSeasonTheme:seasonThemeDisplayFromServer
				});
			} else {
				dispatch({ 
					type: storageTheme.showTheme,
					initial: true,
					serverSeasonTheme:seasonThemeDisplayFromServer
				});
			}
		} else {
			storageTheme.showTheme = storageTheme.showTheme == "season" ? "platform" : storageTheme.showTheme;
			if (storageTheme.seasonThemeDisplay) {
				dispatch({ 
					type: storageTheme.showTheme,
					initial: true,
					serverSeasonTheme:seasonThemeDisplayFromServer
				});
			} else {
				dispatch({ 
					type: storageTheme.showTheme,
					initial: true,
					serverSeasonTheme:seasonThemeDisplayFromServer
				});
				storageTheme.seasonThemeDisplay = true;
			}
		}
		DeviceStorageUtil.set('storageTheme',storageTheme);
	}
}

export function changeTheme(theme = null){
	return async (dispatch, getState) => {
		DeviceStorageUtil.set('storageTheme', {
			showTheme: theme,
			seasonThemeDisplay: false
		});

		switch (theme) {
			case types.dark:
				theme = {
					type: types.dark
				};
				break;
			case types.season:
				theme = {
					type: types.season
				};
				break;
			default:
				theme = {
					type: types.platform
				};
		}

		dispatch(theme);

		setTimeout(() => {
			dispatch({
				type: types.themeChangeDone
			});
		}, 5);
		

		/*		
		switch (theme) {
			case types.dark:
				await DeviceStorageUtil.set('storageTheme',dark);
				theme = { type: types.dark};
				break;
			case types.seasion:
				await DeviceStorageUtil.set('storageTheme',seasion);
				theme = { type: types.dark};
				break;
			default:
				const { fs, fetch, wrap } = RNFetchBlob

				fetch(
					'http://172.16.0.39:8080/Theme/platform.js'
				).then(	res => {
					console.log(res.json());
					// console.log(res.text());
					
					return res.text();
				}).then(txt => {
				   let js = eval(txt);
				   console.log(js);
				});
				
				RNFetchBlob.config({
						fileCache: true,
						appendExt : 'js'
					}).fetch(
						'GET',
						'http://172.16.0.39:8080/Theme/platform.js', {
						},
					).then( async (res) => {
						const path = res.path();
						console.log(path);
						await DeviceStorageUtil.set('storageThemePath',path);
						
						let content = await RNFetchBlob.fs.readFile(path, 'utf8').then((data) => {
							return data;
							// let text = eval(data);
							// console.log(text);
						})
						
						// RNRestart.Restart();
					}).catch((error) => {
						console.log(error);
					})
		}
		*/
		// theme = { type: theme};
		// dispatch(theme);
	}
}