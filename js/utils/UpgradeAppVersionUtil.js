import { Alert, Platform, NativeModules, DeviceEventEmitter} from 'react-native';
import { 
	upgrade, 
	versionName, 
	versionCode, 
	openAPPStore, 
	checkIOSUpdate, 
	addDownLoadListener 
} from 'rn-app-upgrade';
import * as SQLite from './SQLiteUtil';
import * as DeviceInfo     from './DeviceInfoUtil';
import * as LoggerUtil     from './LoggerUtil';

import CodePush from "react-native-code-push";
let CODE_PUSH_CONFIG = require('./Contant');
let CODE_PUSH_KEY    = Platform.OS == 'android' ? CODE_PUSH_CONFIG.CODE_PUSH_KEY_ANDROID : CODE_PUSH_CONFIG.CODE_PUSH_KEY_IOS;


let UpgradeAppVersionUtil = {
	async checkBigUpdate(lang) {
		let promise = new Promise((resolve, reject) => {
				//查詢最新版本
				let platform = (Platform.OS == "ios") ? "I" : "A";
				let sql = `
						select * 
						from THF_VERSION 
						where TYPE='D' 
						and PLATFORM='${platform}'
						and ISLATEST='Y'
					`;

			   SQLite.selectData(sql, []).then((data) => {
			    	if(data.length <= 0) return resolve(false); //搜尋資料為0則表示無更新

					let version  = DeviceInfo.getVersion(); //目前的版本
					let nVersion = data.item(data.length-1).NO;			//最新的版本
					let url      = data.item(data.length-1).URL;
					let isMust   = data.item(data.length-1).ISMUST;

					if(nVersion <= version) return resolve(false);	//版本不符合則表示無更新

					// 表示要進行更新，與是否必要更新
					if (isMust == "Y") {
					  Alert.alert(
					    lang.InitialPage.FindNewPatch,        //檢查到有新的版本
					    lang.InitialPage.FindNewPatchInfo,    //重大版本更新，請下載安裝!
					    [{
					      text: lang.InitialPage.Update,
					      onPress: () => {                    //更新
					        this.doBigUpdate(url);

					        if (platform == "I") {
					        	return resolve(false);
					        } else {
					        	return resolve(true);
					        }
					      }
					    }], {
					      cancelable: false
					    }
					  )
					} else {
					  Alert.alert(
					    lang.InitialPage.FindNewPatch,
					    lang.InitialPage.FindNewPatchIsInstallInfo, //是否進行下載安裝!
					    [{
					      text: lang.InitialPage.IgnoreUpdate,
					      onPress: () => { 					  //稍後再說
					        return resolve(false);
					      }
					    }, {
					      text: lang.InitialPage.Update,
					      onPress: () => { 					  //更新
					        this.doBigUpdate(url);
					        if (platform == "I") {
					        	return resolve(true);
					        } else {
					        	return resolve(true);
					        }
					      }
					    }, ], {
					      cancelable: false
					    }
					  )
					}
			    }).catch((errpr) => {
			      LoggerUtil.addErrorLog("查詢TH_VERSION失敗", "APP Page in InitialPage", "WARN", errpr);
			      return resolve(false);
			    });
		});
		return promise;
	},
	doBigUpdate(url) {
		if (url == "") return resolve(false);			//如果url是空的

		if (Platform.OS === "android") {
			upgrade(url); 								//下載安裝檔
		} else {
			NativeModules.upgrade.openAPPStore(url); 	//開啟APP store  AppId = 上架的APPID
		}
	},
	async checkHotUpdate(lang, isColdActive, downloadProgressCallback) {
		let promise = new Promise( async (resolve, reject) => {
			//通知codepush server 本地使否已完成更新安裝
			CodePush.notifyAppReady();                   

			//從Metadata找出目前是哪個版本，如果沒有就是空
			let oLabel = await CodePush.getUpdateMetadata(CodePush.UpdateState.RUNNING).then((metadata) => {
				return metadata ? metadata.label : "";
			}, (error) => {
				LoggerUtil.addErrorLog("getUpdateMetadata 熱更新失敗", "APP Page in InitialPage", "WARN", error);
				return resolve(false);
			});

			//檢查更新
			CodePush.checkForUpdate(CODE_PUSH_KEY).then((remotePackage) => {
				if(remotePackage == null){
					CodePush.notifyApplicationReady();
					return resolve(false);	
				} 

				//從THF_VERSION找出，比檢查到的版本小 比目前的版本大的裡面有沒有 必須更新的，如果有就顯示提示框，沒有就自動更新
				let { appVersion, label } = remotePackage;
				let platform = (Platform.OS === "android") ? 'A' : 'I';
				let sql = ` 
						select * 
		                from THF_VERSION 
		                where TYPE='H'
		                and NO='${appVersion}'
		                and URL<='${label}'
		                and PLATFORM='${platform}'
		              `;
				sql = (oLabel != "") ? sql + `and URL> '${oLabel}'` : sql;

				SQLite.selectData(sql, []).then((data) => {
					//用戶選擇是否更新 
					if (
						data.length > 0 && 
						data.raw()[0].ISMUST == "N" && 
						!remotePackage.isMandatory 
					) {
						let size = remotePackage.packageSize / 1024;
						CodePush.sync(
							{
								deploymentKey: CODE_PUSH_KEY,
								installMode: CodePush.InstallMode.IMMEDIATE, //立即安裝
								updateDialog: {
									title                     : lang.InitialPage.FindNewHotPatch, 	//檢查到有更新包
									optionalUpdateMessage     : `File Size ${size.toFixed(2)}KB `,
									optionalInstallButtonLabel: lang.InitialPage.Update, 			//立即更新
									optionalIgnoreButtonLabel : lang.InitialPage.IgnoreUpdate 		// 下次再說
								},
							},
							(status) => {
								switch (status) {
									case CodePush.SyncStatus.UPDATE_IGNORED: //下次再說
										return resolve(false);
										break;
									case CodePush.SyncStatus.DOWNLOADING_PACKAGE: // 確定更新
										return resolve(true);
										break;
									case CodePush.SyncStatus.UNKNOWN_ERROR:
										return resolve(false);
										break;
									case CodePush.SyncStatus.UP_TO_DATE:
										return resolve(false);
										break;
								}
							},
							downloadProgressCallback.bind(this, remotePackage.isMandatory)
						);
					} else {
						let size = remotePackage.packageSize / 1024;
						
						//是否是強制安裝
						if (remotePackage.isMandatory) {
							// 如果冷啟動直接更新，如果熱起動要顯示更新按鈕
							let updateDialog = null;
							if (!isColdActive) {
								updateDialog = {
									appendReleaseDescription    : false,
									title                       : lang.InitialPage.FindNewHotPatch, 	//檢查到有更新包
									mandatoryUpdateMessage      : `File Size ${size.toFixed(2)}KB ` , 	//强制更新时的信息.
									mandatoryContinueButtonLabel: lang.InitialPage.Update, 				//强制更新按钮文字，默认为continue
									// optionalUpdateMessage       : `File Size ${size.toFixed(2)}KB `,
									// optionalInstallButtonLabel  : lang.InitialPage.Update, 			//立即更新
									// optionalIgnoreButtonLabel   : lang.InitialPage.IgnoreUpdate 		//下次再說
								}
							}
							
							CodePush.sync({
									deploymentKey       : CODE_PUSH_KEY,
									mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE, //強制更新
									updateDialog        : updateDialog
									// installMode         : CodePush.InstallMode.IMMEDIATE, //可選擇是否立即更新
								},
								(status) => {
									switch (status) {
										case CodePush.SyncStatus.DOWNLOADING_PACKAGE: // 確定更新
											return resolve(true);
											break;
										case CodePush.SyncStatus.UNKNOWN_ERROR: //更新錯誤
											return resolve(false);
											break;
										case CodePush.SyncStatus.UP_TO_DATE:
											return resolve(false);
											break;
										case CodePush.SyncStatus.UPDATE_IGNORED: //下次更新
											return resolve(false);
											break;
									}
								},
							    downloadProgressCallback.bind(this, remotePackage.isMandatory)
							);
						} else {
							//下一次啟動直接更新
							CodePush.sync(
							    {
							      deploymentKey: CODE_PUSH_KEY,
							      installMode: CodePush.InstallMode.ON_NEXT_RESUME,
							    },
							    (status) => {
									switch (status) {
									    case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
									      // 0 - 正在查询CodePush服务器以进行更新。
									      console.info('[CodePush] Checking for update.');
									      break;
									    case CodePush.SyncStatus.AWAITING_USER_ACTION:
									      // 1 - 有可用的更新，并且向最终用户显示了一个确认对话框。（仅在updateDialog使用时适用）
									      console.info('[CodePush] Awaiting user action.');
									      break;
									    case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
									      // 2 - 正在从CodePush服务器下载可用更新。
									      console.info('[CodePush] Downloading package.');
									      return resolve(false);
									      break;
									    case CodePush.SyncStatus.INSTALLING_UPDATE:
									      // 3 - 已下载一个可用的更新，并将其安装。
									      console.info('[CodePush] Installing update.');
									      break;
									    case CodePush.SyncStatus.UP_TO_DATE:
									      // 4 - 应用程序已配置的部署完全最新。
									      console.info('[CodePush] App is up to date.');
									      return resolve(false);
									      break;
									    case CodePush.SyncStatus.UPDATE_IGNORED:
									      // 5 该应用程序具有可选更新，最终用户选择忽略该更新。（仅在updateDialog使用时适用）
									      console.info('[CodePush] User cancelled the update.');
									      return resolve(false);
									      break;
									    case CodePush.SyncStatus.UPDATE_INSTALLED:
									      // 6 - 安装了一个可用的更新，它将根据 SyncOptions 中的 InstallMode指定在 syncStatusChangedCallback 函数返回后立即或在下次应用恢复/重新启动时立即运行。
									      console.info('[CodePush] Installed update.');
									      break;
									    case CodePush.SyncStatus.SYNC_IN_PROGRESS:
									      // 7 - 正在执行的 sync 操作
									      console.info('[CodePush] Sync already in progress.');
									      break;
									    case CodePush.SyncStatus.UNKNOWN_ERROR:
									      // -1 - 同步操作遇到未知错误。
									      console.info('[CodePush] An unknown error occurred.');
									      return resolve(false);
									      break;
									}
								},
							    downloadProgressCallback.bind(this, remotePackage.isMandatory)
							);
						}
					}
				})
				
			}).catch((error) => {
			  LoggerUtil.addErrorLog("checkForUpdate 熱更新失敗", "APP Page in InitialPage", "WARN", error);
			  return resolve(false);
			})

		});
		return promise;
	},
	//熱更新狀態變換的所有狀況，暫時沒用到
	/*
	codePushStatusDidChange(syncStatus){
	  switch (syncStatus) {
	    case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
	      // 0 - 正在查询CodePush服务器以进行更新。
	      console.info('[CodePush] Checking for update.');
	      break;
	    case CodePush.SyncStatus.AWAITING_USER_ACTION:
	      // 1 - 有可用的更新，并且向最终用户显示了一个确认对话框。（仅在updateDialog使用时适用）
	      console.info('[CodePush] Awaiting user action.');
	      break;
	    case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
	      // 2 - 正在从CodePush服务器下载可用更新。
	      console.info('[CodePush] Downloading package.');
	      break;
	    case CodePush.SyncStatus.INSTALLING_UPDATE:
	      // 3 - 已下载一个可用的更新，并将其安装。
	      console.info('[CodePush] Installing update.');
	      break;
	    case CodePush.SyncStatus.UP_TO_DATE:
	      // 4 - 应用程序已配置的部署完全最新。
	      console.info('[CodePush] App is up to date.');
	      break;
	    case CodePush.SyncStatus.UPDATE_IGNORED:
	      // 5 该应用程序具有可选更新，最终用户选择忽略该更新。（仅在updateDialog使用时适用）
	      console.info('[CodePush] User cancelled the update.');
	      break;
	    case CodePush.SyncStatus.UPDATE_INSTALLED:
	      // 6 - 安装了一个可用的更新，它将根据 SyncOptions 中的 InstallMode指定在 syncStatusChangedCallback 函数返回后立即或在下次应用恢复/重新启动时立即运行。
	      console.info('[CodePush] Installed update.');
	      break;
	    case CodePush.SyncStatus.SYNC_IN_PROGRESS:
	      // 7 - 正在执行的 sync 操作
	      console.info('[CodePush] Sync already in progress.');
	      break;
	    case CodePush.SyncStatus.UNKNOWN_ERROR:
	      // -1 - 同步操作遇到未知错误。
	      console.info('[CodePush] An unknown error occurred.');
	      break;
	  }
	}
	*/
}

export default UpgradeAppVersionUtil;