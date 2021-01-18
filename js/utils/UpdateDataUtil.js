import { Platform }      from 'react-native';
import NetInfo           from "@react-native-community/netinfo";
import JPush          	 from './JpushUtil';
import DeviceStorageUtil from './DeviceStorageUtil';
import * as SQLite       from './SQLiteUtil';
import * as Device       from './DeviceInfoUtil';
import NetUtil           from './NetUtil';
import Common            from './Common';
import User              from '../object/User';

/**
* 回寫THF_LOG到Server
*/
/**
* 重點中的重點 回傳錯誤訊息
*/

export async function setErrorLog(user, position, level, msg) {
	let promise = new Promise((resolve, reject) => {
		let obj = [];
		for (var i in msg) {
			let content = {
				userid  : user[i].loginID,
				position: position[i],
				loglevel: level[i],
				content : JSON.stringify(msg[i]),
				crtemp  : user[i].id,
			}
			obj.push(content);
		}

		NetUtil.setErrorlog(user[0], obj).then((data) => {
			if (data != null) {
				if (data.code === "0") {
					reject(data); //已在其他裝置登入
					return promise;
				}
				resolve();
			} else {
				resolve();
			}
		})
	});
	return promise;
}

/**
 * AD帳號登入,驗證成功後會把token兩邊保存和把登入資訊存在server,並會取得人員基本資料
 * @param user User
 * @return promise
 */
export async function loginByAD(user){
	
    await JPush.getRegistrationID( result => {
    	user.setRegID(result.registerID) 	
    });
    

	let lang;
	await DeviceStorageUtil.get('locale').then((data) => {
		lang = data ? JSON.parse(data) : data;
	})
	let promise = new Promise((resolve, reject) => {
		let version  = Device.getVersion();
		let url = "login/loginByAD";
		let params = {
			"userId":Common.encrypt(user.loginID),
			"lang"  : lang,
			"content":{
				"userid"    : Common.encrypt(user.loginID),
				"pwd"       : user.password,
				"regid"     : user.regID,
				"appversion": version,
				"platform"  : Platform.OS
			}
		};

		NetUtil.getRequestContent(params, url).then((data) => {
			if (data.code == 200) {
				data = data.content;

				user.token      = data.token;
				user.id         = data.member.id;
				user.name       = data.member.name;
				user.email      = data.email;
				user.membereMail= data.member.email; 	// 取郵相SID所使用的email
				user.depID      = data.member.depid;
				user.depName    = data.member.depname;
				user.co         = data.member.coid;
				user.plantID    = data.member.plantid;
				user.plantName  = data.member.plantname;
				user.sex        = data.member.sex;
				user.isPush     = data.userConfig.push;
				user.cellphone  = data.cellphone;
				user.telphone   = data.telphone;
				user.skype      = data.skype;
                // user.picture = data.picture ? { uri: `data:image/png;base64,${data.picture}`} : user.picture;
				user.pictureUrl = data.picture;
				user.birthday   = data.member.brndat ? data.member.brndat : user.birthday;
				user.certTips = data.userConfig.certTips;

				DeviceStorageUtil.set('User', user); //存在客戶端
				params = {
					"Message": "success",
					"Value": {
						user: user,
						lang: data.lang
					},
				}
				resolve(params);
			} else {
				reject(data.message);
			}
		});
	});
	return promise;
}

/**
 * 利用token取得MB人員資料
 * @param String loginID
 * @return Promise
 */
export async function getMBUserInfoByToken(user){
	let promise = new Promise((resolve, reject) => {
		let url = "org/getUserByToken";
		let version  = Device.getVersion();
		let content = {
			"appversion":version,
			"platform":Platform.OS
		}

		let params = {
			"lang"  :  user.lang,
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(content))
		};

		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code == 200) {
				resolve(data.content)
			}else{
				reject(data.message);
			}
		});
	});
	return promise;
}

/**
 * EMPID帳號登入,驗證成功後會把token兩邊保存和把登入資訊存在server,並會取得人員基本資料
 * @param user User
 * @return promise
 */
export async function loginByEmpid(user, lang) {
    await JPush.getRegistrationID( result => user.setRegID(result.registerID) );

	let params = {};
	let promise = new Promise((resolve, reject) => {
		let version  = Device.getVersion();
		let url = "login/empid";
		let params = {
			"userId": Common.encrypt(user.loginID),
			"lang": lang,
			"token": "",
			"content": {
				"userid": Common.encrypt(user.loginID),
				"pwd": Common.encrypt(user.password),
				"regid": user.regID,
				"appversion":version,
				"platform":Platform.OS
			}
		};

		NetUtil.getRequestContent(params, url).then((data) => {
			if (data.content){
				let tempData=data.content;
				if(tempData.userConfig.reset=="Y"){
					params = {
						"Message": "initialEmp",
						"basicData": tempData
					}
					resolve(params);
				}else{
					//工號登陸需將login內容改為id內容
					user.setLoginID(tempData.member.id);				
		    		user.setPassword(Common.encrypt(user.getPassword()));

					user.setCO(tempData.member.coid);
					user.setDepID(tempData.member.depid);
					user.setDepName(tempData.member.depname);
					user.setEmail(tempData.email);
					user.setID(tempData.member.id);
					user.setName(tempData.member.name);
					user.setPlantID(tempData.member.plantid);
					user.setPlantName(tempData.member.plantname);
					user.setSex(tempData.member.sex);
					user.setToken(tempData.token);
					user.lang = tempData.lang;
					user.birthday = tempData.member.brndat;
					user.cellphone = tempData.cellphone;
					user.isPush = tempData.userConfig.push;
					user.skype = tempData.skype;;
					user.telphone = tempData.telphone;
					user.pictureUrl = tempData.picture;
					// user.picture = tempData.picture ? {uri: `data:image/png;base64,${tempData.picture}`} : user.picture;
					user.membereMail= tempData.member.email;
					user.certTips = tempData.userConfig.certTips;
					DeviceStorageUtil.set('User', user); //存在客戶端

					params = {
						"Message": "success",
						"Value": {
							user: user,
							lang: tempData.lang
						},
					}
					resolve(params);
				} 
			}else {
				// reject(data);
				resolve(data);
			}
		});
	});
	return promise;
}

export async function updateAPP(user) {
	let deleteSQL = "DELETE FROM THF_APP";
	SQLite.deleteData(deleteSQL, null);

	let promise = new Promise((resolve, reject) => {
		let start = new Date().getTime();

		let content = {
			"empid": user.id,
			"co"   : user.co,
			"pzid" : user.plantID,
			"depid": user.depID,
			"lang": user.lang,
		}
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(content))
		};
		let url = "data/getUserApp";

		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) reject(data); 

			let insertSQL = "INSERT INTO THF_APP VALUES";
			let apps = [];

			data = data.content;
			for (let i in data) {
				if (i == data.length - 1) {
					insertSQL += "(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
				} else {
					insertSQL += "(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?),";
				}

				apps = apps.concat([
					data[i].oid,
					data[i].id,
					data[i].name,
					data[i].type,
					data[i].explain,
					data[i].moduleOid,
					data[i].position,
					data[i].packagename,
					data[i].downurl,
					data[i].icon,
					data[i].webtitle,
					data[i].weburl,
					data[i].appurl,
					data[i].langid,
					data[i].status,
					data[i].crtdat,
					data[i].txdat
				]);
			}

			if (data.length > 0) {
				SQLite.insertData(insertSQL, apps).then( () => resolve() );

				let end = new Date().getTime();
				console.log("updateAPP:" + (end - start) / 1000);
			} else {
				resolve();
			}
		});
	});
	return promise;
}

export async function updateMSG(user) {
	let start = new Date().getTime();

	let lSQL   = "SELECT MAX(TXDAT) as TXDAT FROM THF_MSG"; //取最大的更新時間的SQL指令
	let lData  = await SQLite.selectData(lSQL, []);			//執行查詢指令
	let ltxdat = lData.item(0).TXDAT; 						//更新時間

	let promise = new Promise((resolve, reject) => {
		let content = {
			"empid": user.id,
			"co"   : user.co,
			"pzid" : user.plantID,
			"depid": user.depID,
			"txdat": (ltxdat == null) ? '' : ltxdat,
		}
		let params = {
			"token"  :Common.encrypt(user.token),
			"userId" :Common.encrypt(user.loginID),
			"content":Common.encrypt(JSON.stringify(content)),
			"lang"   :user.lang
		};
		let url = "data/getMsg";
		
		NetUtil.getRequestContent(params, url).then( async (data)=>{
			if (data.code != 200) reject(data);		// code如果錯誤則直接回報錯誤
			
			// 共用參數			
			data    = data.content;
			let max = 35;

			// 刪除使用相關參數
			let prepareToDeleteOidArray  = [];
			let deleteOidArraySQL        = "DELETE FROM THF_MSG WHERE OID in (";
			let executeDeleteOidArraySQL = [];

			/*
				先確認有沒有需要刪除的資料
				有的話，先刪除再新增
			*/
			if (ltxdat !== null) {
				for (let [index, deleteData] of data.entries()) {
					prepareToDeleteOidArray = prepareToDeleteOidArray.concat([deleteData.oid]);

					if ((index + 1) % max == 0) {
						deleteOidArraySQL += "?)";
						executeDeleteOidArraySQL.push(SQLite.deleteData(deleteOidArraySQL, prepareToDeleteOidArray));
						prepareToDeleteOidArray = [];
						deleteOidArraySQL = "DELETE FROM THF_MSG WHERE OID in (";
					} else if (index == data.length - 1) {
						deleteOidArraySQL += "?)";
						executeDeleteOidArraySQL.push(SQLite.deleteData(deleteOidArraySQL, prepareToDeleteOidArray));
					} else {
						deleteOidArraySQL += "?,";
					}
				}
				await Promise.all(executeDeleteOidArraySQL).then(() => {});
			}

			// 新增使用相關參數
			let prepareToInsertMSGArray  = [];
			let insertMSGArraySQL        = "INSERT INTO THF_MSG ";
			let executeInsertMSGArraySQL = [];
			
			for (let [ index, insertData] of data.entries() ) {
				prepareToInsertMSGArray = prepareToInsertMSGArray.concat([
					insertData.oid,
					insertData.type,
					insertData.title,
					insertData.content,
					insertData.eventoid,
					insertData.ispush,
					insertData.ext1,
					insertData.ext2,
					insertData.ext3,
					insertData.status,
					Common.dateFormat(insertData.crtdat),
					Common.dateFormat(insertData.txdat)
				]);

				if ((index + 1) % max == 0) {
					insertMSGArraySQL += " select ?,?,?,?,?,?,?,?,?,?,?,? ";
					executeInsertMSGArraySQL.push([insertMSGArraySQL, prepareToInsertMSGArray]);
					insertMSGArraySQL = "INSERT INTO THF_MSG ";
					prepareToInsertMSGArray = [];
				} else if (index == data.length - 1) {
					insertMSGArraySQL += " select ?,?,?,?,?,?,?,?,?,?,?,? ";
					executeInsertMSGArraySQL.push([insertMSGArraySQL, prepareToInsertMSGArray]);
				} else {
					insertMSGArraySQL += " select ?,?,?,?,?,?,?,?,?,?,?,? union all";
				}
			}

			SQLite.insertData_new(executeInsertMSGArraySQL).then(() => {
				resolve();

				let end = new Date().getTime();
				console.log("updateMSG_end:" + (end - start) / 1000);
			});
		})
	});
	return promise;
}

export async function updateNotice(user) {
	var start = new Date().getTime();

	let lSQL = "SELECT MAX(TXDAT) as TXDAT FROM THF_NOTICE"; //取最大的更新時間
	let lData = await SQLite.selectData(lSQL, []);
	let ltxdat = lData.item(0).TXDAT; //更新時間
	let promise = new Promise((resolve, reject) => {

		let params = {
			"token": Common.encrypt(user.token),
			"userId": Common.encrypt(user.loginID),
			"content": Common.encrypt(ltxdat ? ltxdat: '')
		}

		let url = "data/getNotice";

		if (ltxdat === null) {
			let start = new Date().getTime();

			NetUtil.getRequestContent(params, url).then((data) => {
				if (data.code == 200) {
					data = data.content;

					let max = 50;
					let lInsert = "INSERT INTO THF_NOTICE ";
					let iArray = [];
					let execute = [];

					for (let i in data) {
						i = parseInt(i);

						iArray = iArray.concat([
							data[i].oid,
							data[i].title,
							data[i].content,
							data[i].emp,
							data[i].type,
							Common.dateFormatNoTime(data[i].noticedate),
							data[i].completedate,
							data[i].status,
							Common.dateFormat(data[i].crtdat),
							Common.dateFormat(data[i].txdat)
						]);


						if ((i + 1) % max == 0) {
							//達到分批數量，要重置資料
							lInsert += " select ?,?,?,?,?,?,?,?,?,? ";
							execute.push([lInsert, iArray]);
							lInsert = "INSERT INTO THF_NOTICE ";
							iArray = [];
						} else if ((i + 1) == data.length) {
							lInsert += " select ?,?,?,?,?,?,?,?,?,? ";
							execute.push([lInsert, iArray]);
						} else {
							lInsert += " select ?,?,?,?,?,?,?,?,?,? union all";
						}
					}

					SQLite.insertData_new(execute).then(() => {
						let end = new Date().getTime();
						console.log("updateNotice_end:" + (end - start) / 1000);
						resolve();
					});
				} else {
					reject(data); //已在其他裝置登入
					return promise;
				}
			})
		} else {
			NetUtil.getRequestContent(params, url).then((data) => {
				if (data.code == 200) {
					data = data.content;
					
					let max = 50;
					let dArray = [];
					let iArray = [];
					let lDelete = "DELETE FROM THF_NOTICE WHERE OID in (";
					let lInsert = "INSERT INTO THF_NOTICE ";
					let dExecute = [];
					let iExecute = [];

					for (let i in data) {
						i = parseInt(i);
						let nCrtDat = Common.dateFormat(data[i].crtdat);
						let nTxDat = Common.dateFormat(data[i].txdat);
						let nNoticeDat = Common.dateFormatNoTime(data[i].noticedate);
						dArray = dArray.concat([data[i].oid]);

						iArray = iArray.concat([
							data[i].oid,
							data[i].title,
							data[i].content,
							data[i].emp,
							data[i].type,
							nNoticeDat,
							data[i].completedate,
							data[i].status,
							nCrtDat,
							nTxDat
						]);

						if ((i + 1) % max == 0) {
							lDelete += "?)";
							lInsert += " select ?,?,?,?,?,?,?,?,?,? ";
							dExecute.push(SQLite.deleteData(lDelete, dArray));
							iExecute.push(SQLite.insertData(lInsert, iArray));
							dArray = [];
							iArray = [];
							lDelete = "DELETE FROM THF_NOTICE WHERE OID in (";
							lInsert = "INSERT INTO THF_NOTICE ";
						} else if (i == data.length - 1) {
							lDelete += "?)";
							lInsert += " select ?,?,?,?,?,?,?,?,?,? ";
							dExecute.push(SQLite.deleteData(lDelete, dArray));
							iExecute.push(SQLite.insertData(lInsert, iArray));
						} else {
							lDelete += "?,";
							lInsert += " select ?,?,?,?,?,?,?,?,?,? union all";
						}
					}

					Promise.all(dExecute).then(() => {
						Promise.all(iExecute).then(() => {
							let end = new Date().getTime();
							console.log("updateNotice:" + (end - start) / 1000);

							resolve();
						})
					})
				} else {
					reject(data); //已在其他裝置登入
					return promise;
				}
			});
		}
	});
	return promise;
}

/**
* 更新通訊錄個人資料
*/
export async function updateContact(user) {
	var start = new Date().getTime();

	let lSQL = "SELECT MAX(TXDAT) as TXDAT FROM THF_CONTACT"; //取最大的更新時間
	let lData = await SQLite.selectData(lSQL, []);
	let ltxdat = lData.item(0).TXDAT; //更新時間
	let promise = new Promise( async (resolve, reject) => {
		if (ltxdat === null) {
			let start = new Date().getTime();

			let content = {
				empid      : user.id,
				companyList: [],
				maxDat     : ltxdat
			}

			let params = {
				"token"  :Common.encrypt(user.token),
				"userId" :Common.encrypt(user.loginID),
				"content":Common.encrypt(JSON.stringify(content))
			};

			let url = "data/getContactData";

			NetUtil.getRequestContent(params, url).then((data)=>{
				// console.log(data);
				if (data.code != 200) {
					reject(data); //已在其他裝置登入
					return promise;
				}
				data = data.content;

				/* 修改後版本 */
				let max = 50;
				let lInsert = `INSERT INTO THF_CONTACT (OID,AD,EMPID,NAME,SEX,CO,DEPID,DEPNAME,JOBTITLE,TELPHONE,CELLPHONE,MAIL,SKYPE,PICTURE,STATUS,CRTDAT,TXDAT) VALUES `;
				let iArray = [];
				let execute = [];
				let index = 0;
				for (let i in data) {	
					i = parseInt(i);

					if (
						/*找出錯誤的資料，然後剔除他*/
						// data[i].oid == "34343EC9D52B1165E050A8C0631E763D" || 
						// data[i].oid == "34343EC9D7B51165E050A8C0631E763D" ||
						// data[i].oid == "6E3CE6750A9C394CE050A8C0631E42D0" ||
						// data[i].oid == "6D9BF7A208D46137E050A8C0631E6934"
						false
					) {
						/*錯誤資料不做任何處理*/
					} else {
						index++;

						let cellphone = cellphone ? data[i].cellphone.replace(/\'/g,"") : "";	
						iArray = iArray.concat([
							data[i].oid, 
							data[i].ad == null ? "" : data[i].ad, 
							data[i].empid == null ? "" : data[i].empid, 
							data[i].name == null ? "" : data[i].name, 
							data[i].sex == null ? "" : data[i].sex, 
							data[i].co == null ? "" : data[i].co,
							data[i].depid == null ? "" : data[i].depid,
							data[i].depname == null ? "" : data[i].depname,
							data[i].jobtitle == null ? "" : data[i].jobtitle,
							data[i].telphone == null ? "" : data[i].telphone,
							data[i].cellphone == null ? "" : data[i].cellphone,
							data[i].mail == null ?  "" : data[i].mail,
							data[i].skype == null ? "" : data[i].skype,
							"",// data[i].picture,
							data[i].status == null ? "" : data[i].status,
							Common.dateFormat(data[i].crtdat), 
							Common.dateFormat(data[i].txdat)
						]);

						
						if( (index)%max == 0){
							//達到分批數量，要重置資料
							lInsert+= "( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";
							execute.push([lInsert, iArray]);
							lInsert = "INSERT INTO THF_CONTACT (OID,AD,EMPID,NAME,SEX,CO,DEPID,DEPNAME,JOBTITLE,TELPHONE,CELLPHONE,MAIL,SKYPE,PICTURE,STATUS,CRTDAT,TXDAT) VALUES ";
							iArray = [];
						}else if( i == data.length-1 ){
							lInsert+= "( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";
							execute.push([lInsert, iArray]);
						}else{
							lInsert+= "( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ),";
						}
					}
				}
				
				SQLite.insertData_new(execute).then(()=>{
					let end = new Date().getTime();
					console.log("updateContact_end:"+ (end - start) / 1000);
					updateContactPic(user, ltxdat, content);				//獲取通訊錄圖片資料
					resolve();
				});			
			})
			
		} else {
			lSQL = "select DISTINCT CO from THF_CONTACT;"; //取最大的更新時間
			lData = await SQLite.selectData(lSQL, []);
			let companyList = [];
			for(let co of lData.raw()){
				if (co.CO) {companyList.push(co.CO); }
			}

			let content = {
				empid      : user.id,
				companyList: companyList,
				maxDat     : ltxdat
			}

			let params = {
				"token"  :Common.encrypt(user.token),
				"userId" :Common.encrypt(user.loginID),
				"content":Common.encrypt(JSON.stringify(content))
			};

			let url = "data/getContactData";

			NetUtil.getRequestContent(params, url).then((data)=>{
				// console.log(data);
				if (data.code != 200) {
					reject(data); //已在其他裝置登入
					return promise;
				}
				data = data.content;				
				
				let max = 30;
				let dArray = [];
				let iArray = [];
				let lDelete = "DELETE FROM THF_CONTACT WHERE OID in (";
				let lInsert = "INSERT INTO THF_CONTACT ";
				let dExecute = [];
				let iExecute = [];
				let index = 0;
				
				for (let i = 0; i < data.length; i++) {
					index++;

					dArray = dArray.concat([data[i].oid]);
					
					let nCrtDat = Common.dateFormat(data[i].crtdat);
					let nTxDat = Common.dateFormat(data[i].txdat);
					iArray = iArray.concat([
						data[i].oid, 
						data[i].ad, 
						data[i].empid, 
						data[i].name, 
						data[i].sex, 
						data[i].co,
						data[i].depid,
						data[i].depname,
						data[i].jobtitle,
						data[i].telphone,
						data[i].cellphone,
						data[i].mail,
						data[i].skype,
						// data[i].picture,
						"",
						data[i].status,
						nCrtDat, 
						nTxDat
					]);
					
					if(index==max){
						lDelete+= "?)";
						lInsert+= " select ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,? ";
						dExecute.push(SQLite.deleteData(lDelete, dArray));
						iExecute.push(SQLite.insertData(lInsert, iArray));
						dArray = [];
						iArray = [];
						lDelete = "DELETE FROM THF_CONTACT WHERE OID in (";
						lInsert = "INSERT INTO THF_CONTACT ";
						index = 0;
					}else if(i==data.length-1){
						lDelete+= "?)";
						lInsert+= " select ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,? ";
						dExecute.push(SQLite.deleteData(lDelete, dArray));
						iExecute.push(SQLite.insertData(lInsert, iArray));
					}else{
						lDelete+= "?,";
						lInsert+= " select ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,? union all";
					}
				}
				
				Promise.all(dExecute).then(()=>{
					Promise.all(iExecute).then(()=>{
						let end = new Date().getTime();
						console.log("updateContact:"+ (end - start) / 1000);
						
						updateContactPic(user, ltxdat, content);				//獲取通訊錄圖片資料
						resolve();
					})
				})
			});
		}
	});
	return promise;
}

export function updateContactPic(user, ltxdat, content) {
	let params = {
		"token"  :Common.encrypt(user.token),
		"userId" :Common.encrypt(user.loginID),
		"content":Common.encrypt(JSON.stringify(content))
	};

	let url = "data/getContactPic";

	NetUtil.getRequestContent(params, url).then((data)=>{
		data = data.content;

		let execute = [];
		for (let pic of data) {
			execute.push([
				"UPDATE THF_CONTACT SET PICTURE=? WHERE OID=?", [pic.picture, pic.oid]
			])
		}
		SQLite.updateData_new(execute).then(() => {
			// resolve();
		});
			
	})
}

export async function updateMasterData(user) {
	var start = new Date().getTime();

	let lSQL = "SELECT MAX(TXDAT) as TXDAT FROM THF_MASTERDATA"; //取最大的更新時間
	let lData = await SQLite.selectData(lSQL, []);
	let ltxdat = lData.item(0).TXDAT; //更新時間
	let promise = new Promise((resolve, reject) => {

		let url = "data/getMasterData";
		let params = {
			"token": Common.encrypt(user.token),
			"userId": Common.encrypt(user.loginID),
			"content": Common.encrypt(ltxdat ? ltxdat : '')
		}

		if (ltxdat === null) {
			let start = new Date().getTime();
			NetUtil.getRequestContent(params, url).then((data) => {
				if (data.code != 200) {
					reject(data); //已在其他裝置登入
					return promise;
				}
				data = data.content;

				let max = 30;
				let lInsert = "INSERT INTO THF_MASTERDATA ";
				let iArray = [];
				let execute = [];
				
				for (let i in data) {
					i = parseInt(i);
					iArray = iArray.concat([ 
						data[i].oid,  
						data[i].class1,  
						data[i].class2,  
						data[i].class3,  
						data[i].class4,
						data[i].class5, 
						data[i].len, 
						data[i].content, 
						data[i].sort, 
						data[i].status,
						Common.dateFormat(data[i].txdat), 
						Common.dateFormat(data[i].crtdat)
					]);
					
					if( (i+1)%max == 0 ){
						//達到分批數量，要重置資料
						lInsert+= " select ?,?,?,?,?,?,?,?,?,?,?,? ";
						execute.push([lInsert, iArray]);
						lInsert = "INSERT INTO THF_MASTERDATA ";
						iArray = [];
					}else if( i == data.length-1 ){
						lInsert+= " select ?,?,?,?,?,?,?,?,?,?,?,? ";
						execute.push([lInsert, iArray]);
					}else{
						lInsert+= " select ?,?,?,?,?,?,?,?,?,?,?,? union all";
					}
				}

				SQLite.insertData_new(execute).then(()=>{
				let end = new Date().getTime();
					console.log("updateMasterData_end:"+ (end - start) / 1000);
					resolve();
				});
			})
		} else {
			NetUtil.getRequestContent(params, url).then((data) => {
				if (data.code != 200) {
					reject(data); //已在其他裝置登入
					return promise;
				}
				data = data.content;

				let max = 30;
				let dArray = [];
				let iArray = [];
				let lDelete = "DELETE FROM THF_MASTERDATA WHERE OID in (";
				let lInsert = "INSERT INTO THF_MASTERDATA ";
				let dExecute = [];
				let iExecute = [];
				let index = 0;
				
				for (let i = 0; i < data.length; i++) {
					index++;

					dArray = dArray.concat([data[i].oid]);
					
					let nCrtDat = Common.dateFormat(data[i].crtdat);
					let nTxDat = Common.dateFormat(data[i].txdat);
					iArray = iArray.concat([data[i].oid, data[i].class1, data[i].class2, data[i].class3, data[i].class4,
						data[i].class5,data[i].len,data[i].content,data[i].sort,data[i].status,nCrtDat, nTxDat
					]);
					
					if(index==max){
						lDelete+= "?)";
						lInsert+= " select ?,?,?,?,?,?,?,?,?,?,?,? ";
						dExecute.push(SQLite.deleteData(lDelete, dArray));
						iExecute.push(SQLite.insertData(lInsert, iArray));
						dArray = [];
						iArray = [];
						lDelete = "DELETE FROM THF_MASTERDATA WHERE OID in (";
						lInsert = "INSERT INTO THF_MASTERDATA ";
						index = 0;
					}else if(i==data.length-1){
						lDelete+= "?)";
						lInsert+= " select ?,?,?,?,?,?,?,?,?,?,?,? ";
						dExecute.push(SQLite.deleteData(lDelete, dArray));
						iExecute.push(SQLite.insertData(lInsert, iArray));
					}else{
						lDelete+= "?,";
						lInsert+= " select ?,?,?,?,?,?,?,?,?,?,?,? union all";
					}
				}
				
				Promise.all(dExecute).then(()=>{
					Promise.all(iExecute).then(()=>{
						let end = new Date().getTime();
						console.log("updateMasterData:"+ (end - start) / 1000);
						resolve();
					})
				})
			});
		}
	});

	
	return promise;
}

/**
* 更新多語系檔
*/
export async function updateLanguage(user) {
	let start = new Date().getTime();
	let lSQL = "SELECT MAX(TXDAT) as TXDAT FROM THF_LANGUAGE"; //取最大的更新時間
	let lData = await SQLite.selectData(lSQL, []);
	let ltxdat = lData.item(0).TXDAT; //更新時間
	let promise = new Promise((resolve, reject) => {
		let url = "data/getLanguage";
		let params = {
			"token": Common.encrypt(user.token),
			"userId": Common.encrypt(user.loginID),
			"content": Common.encrypt(ltxdat ? ltxdat : "")
		}

		if (ltxdat === null) {
			NetUtil.getRequestContent(params, url).then((data) => {
				if (data.code != 200) {
					reject(data); //已在其他裝置登入
					return promise;
				}
				data = data.content;

				let max = 45;
				let lInsert = "INSERT INTO THF_LANGUAGE ";
				let iArray = [];
				let execute = [];

				for(let i in data){
					i = parseInt(i);
					iArray = iArray.concat([
						data[i].oid,
					 	data[i].langid,
					 	data[i].langtype,
					 	data[i].langcontent,
						data[i].status,
						Common.dateFormat(data[i].crtdat),
						Common.dateFormat(data[i].txdat)
					]);

					if( (i+1)%max == 0 ){
						//達到分批數量，要重置資料
						lInsert+= " select ?,?,?,?,?,?,? ";
						execute.push([lInsert, iArray]);
						lInsert = "INSERT INTO THF_LANGUAGE ";
						iArray = [];
					}else if(i==data.length-1){
						lInsert+= " select ?,?,?,?,?,?,? ";
						execute.push([lInsert, iArray]);
					}else{
						lInsert+= " select ?,?,?,?,?,?,? union all";
					}
				}

				SQLite.insertData_new(execute).then(()=>{
				let end = new Date().getTime();
					console.log("updateLanguage_end:"+ (end - start) / 1000);
					resolve();
				});

			})
		} else {
			NetUtil.getRequestContent(params, url).then((data) => {
				if (data.code != 200) {
					reject(data); //已在其他裝置登入
					return promise;
				}
				data = data.content;

				let max = 50;
				let dArray = [];
				let iArray = [];
				let lDelete = "DELETE FROM THF_LANGUAGE WHERE OID in (";
				let lInsert = "INSERT INTO THF_LANGUAGE ";
				let dExecute = [];
				let iExecute = [];
				let index = 0;
				
				for (let i = 0; i < data.length; i++) {
					index++;

					dArray = dArray.concat([data[i].oid]);
					
					let nCrtDat = Common.dateFormat(data[i].crtdat);
					let nTxDat = Common.dateFormat(data[i].txdat);
					iArray = iArray.concat([data[i].oid, data[i].langid, data[i].langtype, data[i].langcontent,
						data[i].status,nCrtDat, nTxDat
					]);
					
					if(index==max){
						lDelete+= "?)";
						lInsert+= " select ?,?,?,?,?,?,? ";
						dExecute.push(SQLite.deleteData(lDelete, dArray));
						iExecute.push(SQLite.insertData(lInsert, iArray));
						dArray = [];
						iArray = [];
						lDelete = "DELETE FROM THF_LANGUAGE WHERE OID in (";
						lInsert = "INSERT INTO THF_LANGUAGE ";
						index = 0;
					}else if(i==data.length-1){
						lDelete+= "?)";
						lInsert+= " select ?,?,?,?,?,?,? ";
						dExecute.push(SQLite.deleteData(lDelete, dArray));
						iExecute.push(SQLite.insertData(lInsert, iArray));
					}else{
						lDelete+= "?,";
						lInsert+= " select ?,?,?,?,?,?,? union all";
					}
				}
				
				Promise.all(dExecute).then(()=>{
					Promise.all(iExecute).then(()=>{
						let end = new Date().getTime();
						console.log("updateLanguage:"+ (end - start) / 1000);
						resolve();
					})
				})

			});
		}
	});

	
	return promise;
}

/**
* 更新事件表
*/
export async function updateEvent(user) {
	let lSQL = "SELECT MAX(TXDAT) as TXDAT FROM THF_EVENT"; //取最大的更新時間
	let lData = await SQLite.selectData(lSQL, []);
	let ltxdat = lData.item(0).TXDAT; //更新時間
	let promise = new Promise((resolve, reject) => {

		let url = "data/getEvent";
		let params = {
			"token": Common.encrypt(user.token),
			"userId": Common.encrypt(user.loginID),
			"content": Common.encrypt(ltxdat ? ltxdat : '' )
		}

		if (ltxdat === null) {
			NetUtil.getRequestContent(params, url).then((data) => {
				if (data.code != 200) {
					reject(data); //已在其他裝置登入
					return promise;
				}
				data = data.content;

				let max = 40;
				let lInsert = "INSERT INTO THF_EVENT ";
				let iArray = [];
				let execute = [];
				let index = 0;
			
				for (let i = 0; i < data.length; i++) {
					index++;
					
					let nCrtDat = Common.dateFormat(data[i].crtdat);
					let nTxDat = Common.dateFormat(data[i].txdat);
					iArray = iArray.concat([
						data[i].oid, 
						data[i].id, 
						data[i].type, 
						data[i].content1, 
						data[i].content2, 
						data[i].content3, 
						data[i].content4,
						data[i].status,
						nCrtDat, 
						nTxDat
					]);
					
					if(index==max){
						//達到分批數量，要重置資料
						lInsert+= " select ?,?,?,?,?,?,?,?,?,? ";
						execute.push(SQLite.insertData(lInsert, iArray));
						lInsert = "INSERT INTO THF_EVENT ";
						iArray = [];
						index=0;
					}else if(i==data.length-1){
						lInsert+= " select ?,?,?,?,?,?,?,?,?,? ";
						execute.push(SQLite.insertData(lInsert, iArray));
					}else{
						lInsert+= " select ?,?,?,?,?,?,?,?,?,? union all";
					}
				}

				Promise.all(execute).then(()=>{
					resolve();
				})

			})
		} else {
			NetUtil.getRequestContent(params, url).then((data) => {
				if (data.code != 200) {
					reject(data); //已在其他裝置登入
					return promise;
				}
				data = data.content;

				let max = 50;
				let dArray = [];
				let iArray = [];
				let lDelete = "DELETE FROM THF_EVENT WHERE OID in (";
				let lInsert = "INSERT INTO THF_EVENT ";
				let dExecute = [];
				let iExecute = [];
				let index = 0;
				
				for (let i = 0; i < data.length; i++) {
					index++;

					dArray = dArray.concat([data[i].oid]);
					
					let nCrtDat = Common.dateFormat(data[i].crtdat);
					let nTxDat = Common.dateFormat(data[i].txdat);
					iArray = iArray.concat([
						data[i].oid,
						data[i].id,
						data[i].type,
						data[i].content1,
						data[i].content2,
						data[i].content3,
						data[i].content4,
						data[i].status,
						nCrtDat,
						nTxDat
					]);
					
					if(index==max){
						lDelete+= "?)";
						lInsert+= " select ?,?,?,?,?,?,?,?,?,? ";
						dExecute.push(SQLite.deleteData(lDelete, dArray));
						iExecute.push(SQLite.insertData(lInsert, iArray));
						dArray = [];
						iArray = [];
						lDelete = "DELETE FROM THF_EVENT WHERE OID in (";
						lInsert = "INSERT INTO THF_EVENT ";
						index = 0;
					}else if(i==data.length-1){
						lDelete+= "?)";
						lInsert+= " select ?,?,?,?,?,?,?,?,?,? ";
						dExecute.push(SQLite.deleteData(lDelete, dArray));
						iExecute.push(SQLite.insertData(lInsert, iArray));
					}else{
						lDelete+= "?,";
						lInsert+= " select ?,?,?,?,?,?,?,?,?,? union all";
					}
				}
				
				Promise.all(dExecute).then(()=>{
					Promise.all(iExecute).then(()=>{
						resolve();
					})
				})

			});
		}
	});
	return promise;
}

/**
* 取得同步APP Banner API
*/
export async function updateBanner(user){
	let lSQL = "SELECT MAX(TXDAT) as TXDAT FROM THF_BANNER"; //取最大的更新時間
	let lData = await SQLite.selectData(lSQL, []);
	let ltxdat = lData.item(0).TXDAT; //更新時間
	let promise = new Promise((resolve, reject) => {
		let start = new Date().getTime();

		let url = "data/getBanner";
		let params = {
			"token": Common.encrypt(user.token),
			"userId": Common.encrypt(user.loginID),
			"content": Common.encrypt(ltxdat ? ltxdat : '')
		}

		if (ltxdat === null) {
			NetUtil.getRequestContent(params, url).then((data) => {
				// console.log(data);
				if (data.code != 200) {
					reject(data); //已在其他裝置登入
					return promise;
				}
				data = data.content;
				
				let max     = 50;
				let lInsert = "INSERT INTO THF_BANNER ";
				let iArray  = [];
				let execute = [];
				
				for(let i in data ){
					i = parseInt(i);

					iArray = iArray.concat([
						data[i].oid, 
						data[i].id, 
						data[i].downurl, 
						data[i].opentype, 
						data[i].appid,
						data[i].portalurl,
						data[i].sort,
						data[i].lang,
						data[i].status,
						Common.dateFormat(data[i].crtdat),
						Common.dateFormat(data[i].txdat),
					]);
					
					if( (i+1)%max == 0 ){
						//達到分批數量，要重置資料
						lInsert+= " select ?,?,?,?,?,?,?,?,?,?,? ";
						execute.push([lInsert, iArray]);
						lInsert = "INSERT INTO THF_BANNER ";
						iArray = [];
					}else if( (i+1) == data.length ){
						lInsert+= " select ?,?,?,?,?,?,?,?,?,?,? ";
						execute.push([lInsert, iArray]);
					}else{
						lInsert+= " select ?,?,?,?,?,?,?,?,?,?,? union all";
					}
				}

				SQLite.insertData_new(execute).then(()=>{
				let end = new Date().getTime();
					console.log("updateBanner_end:"+ (end - start) / 1000);
					resolve();
				});
			})
		} else {
			NetUtil.getRequestContent(params, url).then((data) => {
				if (data.code != 200) {
					reject(data); //已在其他裝置登入
					return promise;
				}
				data = data.content;
				
				let max      = 50;
				let dArray   = [];
				let iArray   = [];
				let lDelete  = "DELETE FROM THF_BANNER WHERE OID in (";
				let lInsert  = "INSERT INTO THF_BANNER ";
				let dExecute = [];
				let iExecute = [];
				
				for(let i in data){
					i = parseInt(i);
					dArray = dArray.concat([data[i].oid]);
					iArray = iArray.concat([
						data[i].oid, 
						data[i].id, 
						data[i].downurl, 
						data[i].opentype, 
						data[i].appid,
						data[i].portalurl,
						data[i].sort,
						data[i].lang,
						data[i].status,
						Common.dateFormat(data[i].crtdat),
						Common.dateFormat(data[i].txdat),
					]);

					if( (i+1)%max == 0 ){
						lDelete+= "?)";
						lInsert+= " select ?,?,?,?,?,?,?,?,?,?,? ";
						dExecute.push(SQLite.deleteData(lDelete, dArray));
						iExecute.push(SQLite.insertData(lInsert, iArray));
						dArray = [];
						iArray = [];
						lDelete = "DELETE FROM THF_BANNER WHERE OID in (";
						lInsert = "INSERT INTO THF_BANNER ";
					}else if( i == data.length-1 ){
						lDelete+= "?)";
						lInsert+= " select ?,?,?,?,?,?,?,?,?,?,? ";
						dExecute.push(SQLite.deleteData(lDelete, dArray));
						iExecute.push(SQLite.insertData(lInsert, iArray));
					}else{
						lDelete+= "?,";
						lInsert+= " select ?,?,?,?,?,?,?,?,?,?,? union all";
					}

				}

				Promise.all(dExecute).then(()=>{
					Promise.all(iExecute).then(()=>{
						let end = new Date().getTime();
						console.log("updateBanner_end:"+ (end - start) / 1000);
						resolve();
					})
				})
			});
		}
	});
	return promise;
}

export async function updateVersion() {
	let start = new Date().getTime();
	
	let lSQL   = "SELECT MAX(TXDAT) as TXDAT FROM THF_VERSION"; //取最大的更新時間
	let lData  = await SQLite.selectData(lSQL, []);
	let ltxdat = lData.item(0).TXDAT; 							//更新時間
	let url    = "version/getVersion";
	let params = { "content":ltxdat ? ltxdat : "" };

	let promise = new Promise((resolve, reject) => {
		if (ltxdat === null) {
			NetUtil.getRequestContent(params, url).then((data) => {
				if (data.code != 200) {
					resolve(data);
					return promise;
				}
				data = data.content;

				let lInsert = "INSERT INTO THF_VERSION ";
				let iArray = [];
				let execute = [];

				for(let i in data){
					i = parseInt(i);
					iArray = iArray.concat([
						data[i].oid, 
						data[i].no, 
						data[i].explain, 
						data[i].type, 
						data[i].url,
						data[i].platform,
						data[i].islatest,
						data[i].ismust,
						data[i].status,
						Common.dateFormat(data[i].crtdat), 
						Common.dateFormat(data[i].txdat)
					]);

					if( i == data.length-1){
						lInsert+= " select ?,?,?,?,?,?,?,?,?,?,? ";
						execute.push([lInsert, iArray]);
					}else{
						lInsert+= " select ?,?,?,?,?,?,?,?,?,?,? union all";
					}
				}

				SQLite.insertData_new(execute).then(()=>{
					let end = new Date().getTime();
					console.log("updateVersion_end:"+ (end - start) / 1000);

					resolve();
				});
			});
		} else {
			NetUtil.getRequestContent(params, url).then((data) => {
				if (data.code != 200) {
					resolve(data);
					return promise;
				}

				data = data.content;

				let dArray = [];
				let iArray = [];
				let lDelete = "DELETE FROM THF_VERSION WHERE OID in (";
				let lInsert = "INSERT INTO THF_VERSION ";
				let dExecute = [];
				let iExecute = [];

				for(let i in data){
					i = parseInt(i);
					dArray = dArray.concat([data[i].oid]);

					iArray = iArray.concat([
						data[i].oid, 
						data[i].no, 
						data[i].explain, 
						data[i].type, 
						data[i].url,
						data[i].platform,
						data[i].islatest,
						data[i].ismust,
						data[i].status,
						Common.dateFormat(data[i].crtdat), 
						Common.dateFormat(data[i].txdat)
					]);

					if( i == data.length-1 ){
						lDelete+= "?)";
						lInsert+= " select ?,?,?,?,?,?,?,?,?,?,? ";
						dExecute.push([lDelete, dArray]);
						iExecute.push([lInsert, iArray]);
					}else{
						lDelete+= "?,";
						lInsert+= " select ?,?,?,?,?,?,?,?,?,?,? union all";
					}
				}

				if (dExecute.length==0 && iExecute.length==0) {
					let end = new Date().getTime();
					console.log("updateVersion:"+ (end - start) / 1000);
					resolve();
				} else {
					SQLite.deleteData_new(dExecute).then(()=>{
						SQLite.insertData_new(iExecute).then(()=>{
							let end = new Date().getTime();
							console.log("updateVersion:"+ (end - start) / 1000);
							resolve();
						});
					});
				}

			}).catch( e => {
				console.log(e);
			});
		}
	});
	return promise;

}

/**
* 如果本地THF_MSG_USERREAD沒資料的話，更新Server端資料
*/
export async function updateRead(user){
	var start = new Date().getTime();
	let lSQL = "SELECT 1 FROM THF_MSG_USERREAD";
	let lData = await SQLite.selectData(lSQL, []);
	let promise = new Promise((resolve, reject) => {
		if(lData.length==0){
			let start = new Date().getTime();

			let params = {
				"token"  :Common.encrypt(user.token),
				"userId" :Common.encrypt(user.loginID),
				"content":Common.encrypt(user.loginID)
			};

			let url = "data/getUserread";

			NetUtil.getRequestContent(params, url).then((data)=>{
				if (data.code != 200) {
					reject(data); //已在其他裝置登入
					return promise;
				}
				data = data.content;

				let max = 30;
				let lInsert = "INSERT INTO THF_MSG_USERREAD(MSGOID,USERID,ISREAD,READTIME,ISUPDATE,STATUS,CRTDAT,TXDAT) ";
				let iArray = [];
				let execute = [];
				for (let i in data) {
					i = parseInt(i);
					iArray = iArray.concat([
						data[i].msgoid, 
						data[i].userid, 
						data[i].isread, 
						Common.dateFormat(data[i].readtime),
						data[i].isupdate,
						data[i].status,
						Common.dateFormat(data[i].crtdat), 
						Common.dateFormat(data[i].txdat)
					]);

					if( (i+1)%max == 0 ){
						//達到分批數量，要重置資料
						lInsert+= " select ?,?,?,?,?,?,?,? ";
						execute.push([lInsert, iArray]);
						lInsert = "INSERT INTO THF_MSG_USERREAD(MSGOID,USERID,ISREAD,READTIME,ISUPDATE,STATUS,CRTDAT,TXDAT) ";
						iArray = [];
					}else if( i == data.length-1 ){
						lInsert+= " select ?,?,?,?,?,?,?,? ";
						execute.push( [lInsert, iArray] );
					}else{
						lInsert+= " select ?,?,?,?,?,?,?,? union all";
					}
				}

				SQLite.insertData_new(execute).then(()=>{
				let end = new Date().getTime();
					console.log("updateRead_end:"+ (end - start) / 1000);
					resolve();
				});	
			})
		}else{
			let end = new Date().getTime();
			console.log("updateRead:"+ (end - start) / 1000);
			resolve();
		}
	});
	return promise;
}

/**
* 回寫THF_MSG_UserRead到Server
*/
export async function setRead(user,msgoid){
	let lSQL = "SELECT * FROM THF_MSG_USERREAD WHERE ISUPDATE='N' AND MSGOID=?";
	let lData = await SQLite.selectData(lSQL, [msgoid]);
	console.log("lData", lData);
	let promise = new Promise((resolve, reject) => {
		if(lData.length>0){
			let obj = [];
			let readtime = new Date(lData.item(0).READTIME).getTime();

			let content = {
				msgoid:lData.item(0).MSGOID,
				userid:lData.item(0).USERID,
				isread:lData.item(0).ISREAD,
				readtime:readtime,
				isupdate:'Y',
				crtemp:user.loginID
			}
			
			obj.push(content);

			let params = {
				"token"  :Common.encrypt(user.token),
				"userId" :Common.encrypt(user.loginID),
				"content": Common.encrypt(JSON.stringify(obj))
			};

			let url = "data/setUserread";

			NetUtil.getRequestContent(params, url).then((data)=>{
				if (data.code != 200) {
					reject(data); //已在其他裝置登入
					return promise;
				}
				data = data.content;

				if(data!=null){
					let uSQL = "UPDATE THF_MSG_USERREAD SET ISUPDATE='Y' WHERE ISUPDATE='N' AND MSGOID=?";
					SQLite.updateData(uSQL,[msgoid]).then(()=>{ resolve(); })
				}else{
					resolve();
				}
			})
		}else{
			resolve();
		}
	});
	return promise;
	
}

export async function setReads(user){
	let lSQL = "SELECT * FROM THF_MSG_USERREAD WHERE ISUPDATE='N'";
	let lData = await SQLite.selectData(lSQL, []);
	let promise = new Promise((resolve, reject) => {
		if(lData.length>0){
			let obj = [];
			for(let i=0;i<lData.length;i++){
				let readtime = new Date(lData.item(i).READTIME).getTime();
				let content = {
					msgoid:lData.item(i).MSGOID,
					userid:lData.item(i).USERID,
					isread:lData.item(i).ISREAD,
					readtime:readtime,
					isupdate:'Y',
					crtemp:user.loginID
				}
				obj.push(content);
			}
			
			let params = {
				"token"  :Common.encrypt(user.token),
				"userId" :Common.encrypt(user.loginID),
				"content": Common.encrypt(JSON.stringify(obj))
			};

			let url = "data/setUserread";

			NetUtil.getRequestContent(params, url).then((data)=>{
				if (data.code != 200) {
					reject(data); //已在其他裝置登入
					return promise;
				}
				data = data.content;

				if(data!=null){
					let uSQL = "UPDATE THF_MSG_USERREAD SET ISUPDATE='Y' WHERE ISUPDATE='N'";
					SQLite.updateData(uSQL,[]).then(()=>{
						resolve();
					})
				}else{
					resolve();
				}
			})
		}else{
			resolve();
		}
	});
	return promise;
}

/**
* 更新本地DB
*
*/
export async function setContact(user,id,context){
	let sql = `update THF_CONTACT set ${id}='${context}' where EMPID='${user.id}'`;
	SQLite.updateData(sql,[]);
	let promise = new Promise((resolve, reject) => {
		SQLite.updateData(sql,[]).then(()=>{
			resolve();
		});
	});
	return promise;
}

export async function updateContactToServer(user){
	let lSQL = "SELECT * FROM THF_CONTACT WHERE EMPID=? and STATUS='Y'";
	let lData = await SQLite.selectData(lSQL, [user.id]);
	let promise = new Promise((resolve, reject) => {
		if(lData.length>0){
			let content = {
				empid    : user.id,
				cellphone: lData.item(0).CELLPHONE,
				telphone : lData.item(0).TELPHONE,
				mail     : lData.item(0).MAIL,
				skype    : lData.item(0).SKYPE,
				picture  : lData.item(0).PICTURE,
				depname	 : lData.item(0).DEPNAME,
				jobtitle : lData.item(0).JOBTITLE
			}

			let params = {
				"token"  :Common.encrypt(user.token),
				"userId" :Common.encrypt(user.loginID),
				"content":Common.encrypt(JSON.stringify(content))
			};

			let url = "org/setContact";

			NetUtil.getRequestContent(params, url).then((data)=>{
				if (data.code != 200) {
					reject(data); //已在其他裝置登入
					return promise;
				}

 				resolve();
			})
		}else{
			resolve();
		}
	});
	return promise;
}

export async function updateContactImageToServer(user, lang, content){
	let promise = new Promise((resolve, reject) => {
		let url = "upload/headimage";
		let params = {
			"token"  :Common.encrypt(user.token),
			"userId" :Common.encrypt(user.loginID),
			"lang"   :lang,
			"content":Common.encrypt(content)
		};
		
		NetUtil.getRequestJson(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			resolve(data);
		})
		
	});
	return promise;
}

export async function updateMBUserToServer(user){
	let content = {
		'userid':user.loginID,
		'ispush':user.isPush,
		'lang'  :user.lang
    }

    let params = {
			"token"  :Common.encrypt(user.token),
			"userId" :Common.encrypt(user.loginID),
			"content":Common.encrypt(JSON.stringify(content)),
			"lang"   :user.lang
    };

    let url = "org/setUser";
	
	let promise = new Promise((resolve, reject) => {
	    NetUtil.getRequestContent(params, url).then((data)=>{
	    	if (data.code != 200) {
	    		reject(data); //已在其他裝置登入
	    		return promise;
	    	}

 			resolve();
		})
	});

	return promise;
}

export async function updateMBUserNotificationEnable(user){
	let lang;
    await DeviceStorageUtil.get('locale').then((data)=>{
    	lang = data?JSON.parse(data):data;
    })

	let content = {
      'push':user.isPush,
    }

    let params = {
		"token"  :Common.encrypt(user.token),
		"userId" :Common.encrypt(user.loginID),
		"content":Common.encrypt(JSON.stringify(content)),
		"lang"   :lang,
    };

    let url = "org/user/config/update";
	
	let promise = new Promise((resolve, reject) => {
	    NetUtil.getRequestContent(params, url).then((data)=>{
	    	if (data.code != 200) {
	    		reject(data.message); //已在其他裝置登入
	    		return promise;
	    	}
 			resolve(data.content);
		})
	});

	return promise;
	
}

/**
* 拿到流程追蹤資料
* {
	"id":"A10433",
	"datetype":"M", M=一個月 M3=三個月 M6=半年 Y=一年
	"statetype":"running",
	"type":"tracking",
	"processid":"A123"
* }
*
*/
export async function getBPMRootTask(user,content){
	let promise = new Promise((resolve, reject) => {
		let url = "app/bpm/getRootTaskList";
		let params = {
			"token"  :Common.encrypt(user.token),
			"userId" :Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(content))
		};

		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;

			if (Array.isArray(data)) {
				resolve(data); 
			} else {
				reject(data);
			}
		}).catch(response => {
			reject(response);
		});
	});
	return promise;
}

/**
* 拿到待辦清單 (目前只有批簽的)
* {
	"id":"A10433",
* }
*
*/
export async function getBPMTaskList(user,content){
	let promise = new Promise((resolve, reject) => {
		let url = "app/bpm/getTaskList";
		let params = {
			"token"  :Common.encrypt(user.token),
			"userId" :Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(content))
		};
		NetUtil.getRequestContent(params, url).then((data)=>{
			// console.log(data);
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;

			if (Array.isArray(data)) {
				resolve(data); 
			} else {
				reject(data);
			}
		}).catch(response => {
			reject(response);
		});
	});
	return promise;
}

/**
* 由收到的OID去更新MSG資料
*/
export async function updateMSGByOID(user,oid,lang) {
	let url = "data/getMsgByOID";
	let content = {
		"msgoid":oid,
		"empid" :user.id,
		"co"    :user.co,
		"pzid"  :user.plantID,
		"depid" :user.depID
	};

	let params = {
		"token"  :Common.encrypt(user.token),
		"userId" :Common.encrypt(user.loginID),
		"content":Common.encrypt(JSON.stringify(content)),
		"lang"   :lang,
	};
	
	let promise = new Promise((resolve, reject) => {
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;

			let lSelect = "SELECT * FROM THF_MSG WHERE OID=?";
			SQLite.selectData(lSelect,[data.oid]).then((data1)=>{
				if(data1.length==0){
					let lInsert = "INSERT INTO THF_MSG select ?,?,?,?,?,?,?,?,?,?,?,? ";
					let nCrtDat = Common.dateFormat(data.crtdat);
					let nTxDat = Common.dateFormat(data.txdat);
					let iArray = [
							data.oid, 
							data.type, 
							data.title, 
							data.content,
							data.eventoid, 
							data.ispush, 
							data.ext1, 
							data.ext2, 
							data.ext3, 
							data.status,
							nCrtDat, 
							nTxDat
						];
					SQLite.insertData(lInsert, iArray).then(()=>{
						resolve();
					})
				}else{
					let lUpdate = "UPDATE THF_MSG SET TITLE=?,CONTENT=? where OID=?";
					SQLite.updateData(lUpdate,[data.title, data.content, data.oid]).then(()=>{
						resolve();
					})
				}
			})
		}).catch(e=>{
			console.log(e);
		})
	});
	return promise;
}

/**
* 設定Push資料
*/
export async function setPushMsg(user,content) {
	let promise = new Promise((resolve, reject) => {
		let url = "msg/setPushMsg";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(content))
		};
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;
			resolve(data);
		})
	});
	return promise;
}

export async function getBPMForm(user,content){
	let promise = new Promise((resolve, reject) => {
		let url = "app/bpm/getBPMForm";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(content))
		};
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}

			if (typeof data.content != "undefined" && data.content == null) {
				reject(data.message ? data.message : "Loading Error");
			}
			
			resolve(data.content);
			return promise;
		})
	});
	return promise;
}

export async function getAllSignResult(user,content){
	let promise = new Promise((resolve, reject) => {
		let url = "app/bpm/getAllSignResult";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(content))
		};
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;
			
 			resolve(data);
		})
	});
	return promise;
}

export async function updateVisitLogToServer(user){
	let sql = "select * from THF_APPVISITLOG where VISITCOUNT>0";
	let sData = await SQLite.selectData(sql, []);
	let promise = new Promise((resolve, reject) => {
		if(sData.length>0){
			let contents = [];
			for(let i=0;i<sData.length;i++){
				let content = {
					"userid"    :sData.item(i).USERID,
					"appid"     :sData.item(i).APPID,
					"visitcount":sData.item(i).VISITCOUNT,
					"visitdate" :sData.item(i).VISITDATE,
				}
				contents.push(content);
			}

			let params = {
				"token"  :Common.encrypt(user.token),
				"userId" :Common.encrypt(user.loginID),
				"content":Common.encrypt(JSON.stringify(contents))
			};

			let url = "data/setVisitLog";

			NetUtil.getRequestContent(params, url).then((data)=>{
				if (data.code != 200) {
					reject(data); //已在其他裝置登入
					return promise;
				}
				data = data.content;

				let uSQL = "update THF_APPVISITLOG set VISITCOUNT=0 where VISITCOUNT>0";
				SQLite.updateData(uSQL,[]).then((data)=>{
					resolve();
				}).catch((err)=>{
					reject(err);
				})
			})
		}else{
			resolve();
		}
		
	});
	return promise;
}

/**
* 拿到簽核選項包含送出按紐跟退回選項
* {
	"proid":"PROXXXX",  //關卡ID
	"lang":"en"  //語系
* }
*
*/
export async function getBPMSignState(user,content){
	let promise = new Promise((resolve, reject) => {
		let url = "app/bpm/getBPMSignState";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(content))
		};
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;
			
 			resolve(data);
		})
	});
	return promise;
}

/**
* 簽核送出
* {
	"proid":"PROXXXX",  //關卡ID
	"tskid":"TSKXXX",  //工作ID
	"sign":"ASTXXX",   //送出的流程線ID 如果IAP或SGN就不需要填
	"message":"OK",   //簽核意見內容
	"listKey":["tfwWriterID","txtWriterNM"],  //修改欄位的ID
	"listValue":["A10433","楊孟璋"]            //修改欄位的內容
* }
*
*/
export async function completeTask(user,content){
	let promise = new Promise((resolve, reject) => {
		
		let url = "app/bpm/completeTask";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(content))
		};
		NetUtil.getRequestJson(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}			
 			resolve(data);
		})
	});
	return promise;
}

/**
* 簽核退回
* {
	"proid":"PROXXXX",  //關卡ID
	"tskid":"TSKXXX",  //工作ID
	"sign":"ASTXXX",   //要退回的關卡
	"message":"OK",   //簽核意見內容
	"listKey":["tfwWriterID","txtWriterNM"],  //修改欄位的ID
	"listValue":["A10433","楊孟璋"]            //修改欄位的內容
* }
*
*/
export async function goBackTask(user,content){
	let promise = new Promise((resolve, reject) => {
		let url = "app/bpm/goBackTask";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(content))
		};
		NetUtil.getRequestJson(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			
 			resolve(data);
		})
	});
	return promise;
}

/**
* 儲存
* {
	"tskid":"TSKXXX",  //工作ID
	"message":"OK",   //簽核意見內容
	"listKey":["tfwWriterID","txtWriterNM"],  //修改欄位的ID
	"listValue":["A10433","楊孟璋"]            //修改欄位的內容
* }
*
*/
export async function suspendTask(user,content){
	let promise = new Promise((resolve, reject) => {
		let url = "app/bpm/suspendTask";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(content))
		};
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;
			
 			resolve(data);
		})
	});
	return promise;
}

export async function setFeedBack(user,content,contact){
	let promise = new Promise((resolve, reject) => {
		let url = "data/setFeedBack";
		let obj = {
			"userid": user.loginID,
			"content":content,
			"contact":contact
		}
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(obj))
		};
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;
 			resolve(data);
		})
	});
	return promise;
}
/**
* 模糊查詢派車系統
*/
export async function getCarRelatedData(user,search){
	let promise = new Promise((resolve, reject) => {
		let url = "data/getCarRelatedData";
		let content = {
			"pname": user.name,
			"search": search,
		}
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(content))
		};
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;

			if (data) {
				resolve(data);
			} else {
				resolve([]);
			}
		})
	});
	return promise;
}

/**
* 關鍵字查詢我的表單
*/
export async function getTaskByKeyword(user,search){
	let promise = new Promise((resolve, reject) => {
		let url = "app/bpm/getTaskByKeyword";
		let content = {
			id:user.id,
			keyword:search	
		}
		let params = {
			"token"  :Common.encrypt(user.token),
			"userId" :Common.encrypt(user.loginID),
			"content":Common.encrypt(JSON.stringify(content))
		};
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				// reject(data); //已在其他裝置登入
				resolve([]);
				return promise;
			}
			data = data.content;

			if (data) {
				resolve(data);
			} else {
				resolve([]);
			}
		})
	});
	return promise;
}

/**
* 拿到我的表單關鍵字查詢
* {
	"id":"A10433",
	"keyword":"關鍵字", 
* }
*
*/
export async function getMyTaskByKeyword(user,search){
	let promise = new Promise((resolve, reject) => {
		let url = "app/bpm/getMyTaskByKeyword";
		let content = {
			id:user.id,
			keyword:search	
		}
		let params = {
			"token"  :Common.encrypt(user.token),
			"userId" :Common.encrypt(user.loginID),
			"content":Common.encrypt(JSON.stringify(content))
		};
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				// reject(data); //已在其他裝置登入
				resolve([]);
				return promise;
			}
			data = data.content;

			if (data) {
				resolve(data);
			} else {
				resolve([]);
			}
		})
	});
	return promise;
}

/**
* 查詢通訊錄管理員
*/
export async function getCarAdministrator(user,company){
	let promise = new Promise((resolve, reject) => {
		let url = "app/car/getAdministrator";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(company))
		};
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;
 			resolve(data);
		})
	});
	return promise;
}

/**
* 取得當日後7天生日人員名單與對應留言
* @param user資料
* @param company 要查詢的公司別
* @param year 要查詢的年份
*/
export async function getBirthdayWeekData(user,company,year){
	let promise = new Promise((resolve, reject) => {
		let url = "data/getBirthdayWeekData";
		let obj = {
			"coid": company,
			"year": year,
			"id": user.id
		}
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(obj))
		};
		NetUtil.getRequestJson(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
 			resolve(data);
		})
	});
	return promise;
}

/**
* 對生日人員進行送禮物/取消禮物
* @param user資料
* @param year 送祝福年份
* @param tid 被送祝福人的ID
* @param type 祝福類型（例：蛋糕CAKE/禮物GIFT）
*/
export async function setBirthdayAdmireData(user,year,tid,type){
	let obj = {
		"year": year,
		"id": user.id,
		"tid": tid,
		"type": type,
		"crtemp": user.id,
	}
	let promise = new Promise((resolve, reject) => {
		let url = "data/setBirthdayAdmireData";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(obj))
		};
		NetUtil.getRequestJson(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;
 			resolve(data);
		})
	});
	return promise;
}

/**
* 對生日人員 留言祝福
* @param user資料
* @param year 送祝福年份
* @param tid 被送祝福人的ID
* @param content 留言内容
*/
export async function setBirthdayMsgData(user,year,tid,content){
	let obj = {
		"year": year,
		"id": user.id,
		"tid": tid,
		"content": content,
		"crtemp": user.id,
	}
	let promise = new Promise((resolve, reject) => {
		let url = "data/setBirthdayMsgData";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(obj))
		};
		NetUtil.getRequestJson(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
 			resolve(data);
		})
	});
	return promise;
}

/**
* 實時取得生日人員名單與對應留言
* @param user驗證資料
* @param coid 要查詢的公司別
* @param year 要查詢的年份
* @param tid 要查詢的目標人員
*/
export async function getBirthdayData(user,year,coid,tid){
	let obj = {
		"coid": coid,
		"year": year,
		"id": tid
	}
	let promise = new Promise((resolve, reject) => {
		let url = "data/getBirthdayData";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(obj))
		};
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;
 			resolve(data);
		})
	});
	return promise;
}

/**
* 取得開單結構
* @param user資料
* @param content json包含 id、lang id例如 G00010
*/
export async function getBPMCreateForm(user,content){
	let promise = new Promise((resolve, reject) => {
		let url = "app/bpm/getBPMCreateForm";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(content))
		};
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;
 			resolve(data);
		})
	});
	return promise;
}

/**
* 取得集團分類列表
* @param user資料
* @param language 語系
*/
export async function getGroupFileCategoriesData(user,language){
	let obj = {
		"language": language
	}
	let promise = new Promise((resolve, reject) => {
		let url = "app/eip/getGroupFileCategoriesData";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(obj))
		};
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;
 			resolve(data);
		})
	});
	return promise;
}

/**
* 取得集團分類內容列表
* @param user資料
* @param tid 類別代號
*/
export async function getGroupFileContentData(user,tid, content = {}){
	let obj = {
		"tid": tid,
		"content":content
	}
	let promise = new Promise((resolve, reject) => {
		let url = "app/eip/getGroupFileContentData";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(obj))
		};
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;
 			resolve(data);

		})
	});
	return promise;
}

/**
* 取得集團分類內容明細列表
* @param user資料
* @param tid 類別代號
* @param did 明細代號
*/
export async function getGroupFileDetailData(user,tid,did){
	let obj = {
		"tid": tid,
		"did": did
	}
	let promise = new Promise((resolve, reject) => {
		let url = "app/eip/getGroupFileDetailData";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(obj))
		};
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;
 			resolve(data);

		})
	});
	return promise;
}

/**
* 取得集團最新文件列表
* @param user資料
*/
export async function getGroupFileNewsData(user,lang, content = {}){

	let promise = new Promise((resolve, reject) => {
		let url = "app/eip/getGroupFileNewsData";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(content)),
			"lang" : lang
		};
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;
 			resolve(data);
		})
	});
	return promise;
}

/**
* 取得管理文章列表
* @param user資料
*/
export async function getManArticleContentData(user, content = {}){
	let promise = new Promise((resolve, reject) => {
		let url = "app/eip/getManArticleContentData";
		let params = {
			"token": Common.encrypt(user.token),
			"userId": Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(content))
		}
		NetUtil.getRequestJson(params, url).then((data) => {
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;
 			resolve(data);
		})
	});
	return promise;
}

/**
* 取得公開畫面參數
*/
export async function getPublicView(){
	let promise = new Promise((resolve, reject) => {
		let url = "public/getPublicView";
		let params = {};
		
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;

			if (data.length != 0) {
				resolve(data);
			} else {
				resolve([]);
			}
		}).catch((e)=>{
			reject();
		});
	});
	return promise;
}

/**
* 取得公開畫面內容參數
*/
export async function getPublicViewContent(){
	let promise = new Promise((resolve, reject) => {
		let url = "public/getPublicViewContent";
		let params = {};
		
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;

			if (data.length != 0) {
				resolve(data);
			} else {
				resolve([]);
			}
		}).catch((e)=>{
			reject(e);
		});
	});
	return promise;
}

/**
* 取得招聘信息清單
*/
export async function getRecruitmentList(){
	let promise = new Promise((resolve, reject) => {
		let url = "public/getRecruitmentList";
		let params = {};
		NetUtil.getRequestContent(params, url).then((data) => {
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;

 			if (data !== null) {
 				resolve(data);
 			} else {
 				resolve([]);
 			}
		})
	});
	return promise;
}

/**
* 取得招聘信息
* @param oid 
*/
export async function getRecruitment(oid){
	let promise = new Promise((resolve, reject) => {
		let url = "public/getRecruitment";
		let params = {
			content : oid
		}
		NetUtil.getRequestContent(params, url).then((data) => {
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;
 			resolve(data);
		})
	});
	return promise;
}

/**
* 公開畫面的回饋
*/
export async function setFeedBackByPublic(name, content, contact) {
	let obj = {
		"userid": name,
		"content": content,
		"contact": contact
	}
	let promise = new Promise((resolve, reject) => {
		let url = "public/setFeedBack";
		let params = {
			"token": "",
			"userId":"",
			"content": Common.encrypt(JSON.stringify(obj))

		}
		NetUtil.getRequestContent(params, url).then((data) => {
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;
			if (data) {
				resolve(data);
			} else {
				reject();
			}
		}).catch(() => {
			reject();
		})
	});
	return promise;
}

/**
* 取得Task圖片
* @param user資料
* @param rootid
* @param tskid
*/
export async function getBPMTaskImage(user,rootid,tskid){
	let content = {
		"rootid" : rootid,
		"tskid" : tskid
	}
	let promise = new Promise((resolve, reject) => {
		let url = "app/bpm/getTaskImage";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(content))
		};
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;

			
 			resolve(data);
		})
	});
	return promise;
}

//取得權限資料
export async function updatePermission(user) {

	let deleteSQL = "DELETE FROM THF_PERMISSION";
	SQLite.deleteData(deleteSQL, null);
	let promise = new Promise((resolve, reject) => {
		let start = new Date().getTime();
		
		let url = "data/getDataPermission";
		let params = {
			"token":Common.encrypt(user.token),
			"userId":Common.encrypt(user.loginID),
			"content": Common.encrypt(user.id)
		};
		NetUtil.getRequestContent(params, url).then((data) => {
			// console.log(data);
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;

			let lInsert = "INSERT INTO THF_PERMISSION VALUES";
			let iArray = [];
			for (let i in data) {
				i = parseInt(i);
				if (i == data.length - 1) {
					lInsert += "(?,?)";
				} else {
					lInsert += "(?,?),";
				}
				iArray = iArray.concat([
					data[i].dataOid,
					data[i].dataType
				]);
			}

			if (data.length > 0) {
				SQLite.insertData_new([
					[lInsert, iArray]
				]).then(() => {
					let end = new Date().getTime();
					console.log("updatePermission_end:" + (end - start) / 1000);
					resolve();
				})
			} else {
				let end = new Date().getTime();
				console.log("updatePermission:" + (end - start) / 1000);
				resolve();
			}
		})
	});

	return promise;
}

/**
* 取得BPM附檔內容
*/
export async function getBPMAttachedFile(user,artId,ansId,itemId,fileName){
	let content = {
		"artId" : artId,
		"ansId" : ansId,
		"itemId" : itemId,
		"fileName" : fileName
	}
	let promise = new Promise((resolve, reject) => {
		let url = "app/bpm/getAttachedFile";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(content))
		};
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;

 			resolve(data);
		})
	});
	return promise;
}

/**
* 共用取直方法
*/
export async function getCreateFormDetailFormat(user, url, content = {}){
	let promise = new Promise((resolve, reject) => {
		content = (typeof content == "string") ? content: JSON.stringify(content); 
		let params = {
			"token"  :Common.encrypt(user.token),
			"userId" :Common.encrypt(user.loginID),
			"content":Common.encrypt(content)
		}

		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;
 			resolve(data);
		})
	});
	return promise;
}

export async function registerForm(user, content){
	let promise = new Promise((resolve, reject) => {
		let url = "app/bpm/registerForm";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(content))
		};
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;

			resolve(data);
		})
	});
	return promise;
}

/**
* 對生日人員 留言删除
* @param user資料
* @param oid 
* @param status 设置状态
*/
export async function setBirthdayMsgStatusData(user,oid,status){
	let obj = {
		"oid": oid,
		"status": status
	}
	let promise = new Promise((resolve, reject) => {
		let url = "data/setBirthdayMsgStatusData";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(obj))
		};
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;

 			resolve(data);
		})
	});
	return promise;
}

/**
* 實時取得A對B留言總數
* @param user資料
* @param year 年份
* @param id 留言人
* @param tid 被留言人
* @param status 狀態
*/
export async function getBirthdayMsgTotalData(user,year,id,tid,status){
	let obj = {
		"year": year,
		"id": id,
		"tid": tid,
		"status": status
	}
	let promise = new Promise((resolve, reject) => {
		let url = "data/getBirthdayMsgTotalData";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(obj))
		};
		NetUtil.getRequestJson(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
 			resolve(data);
		})
	});
	return promise;
}	

/**
* 取得登錄人員代理人信息
*/
export async function getBPMDeputySetting(user){
	let promise = new Promise((resolve, reject) => {
		let url = "app/bpm/getDeputySetting";
		let content = {
			"empid" : user.id,
		}
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(content)),
			"lang" : user.lang
		};
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;

 			resolve(data);
		})
	});
	return promise;
}

/**
* 修改登錄人員代理人信息
*/
export async function setBPMDeputySetting(user,content){
	// let content = {
	// 	"deputyState":"true",
	// 	"byDeputyRule":"true",
	// 	"deputyID":"1A5687",
	// 	"deputyRules":[{
	// 		"deputyid":"A10404",
	// 		"rule":"$AF$PRO == \"一般文件签呈\"",
	// 		"synopsis":"流程名稱 等於 \"一般文件簽呈\""
	// 	}],
	// 	"executeDuration":"true",
	// 	"startExecuteTime":"2019/10/28 17:01",
	// 	"endExecuteTime":"2019/10/28 18:01",
	// 	"mailMode":"true",
	// 	"informID":"A10433",
	// 	"disableMsg":"true"
	// }
	let promise = new Promise((resolve, reject) => {
		let url = "app/bpm/setDeputySetting";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(content))
		};
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;

 			resolve(data);
		})
	});
	return promise;
}

/**
* 取得行政KPI報表列表
* @param user資料
* @param co 公司
* @param year 年份
* @param month 月份
*/
export async function getReportManKPIData(user,co,year,month){
	let obj = {
		"co": co,
		"year": year,
		"month": month
	}
	let promise = new Promise((resolve, reject) => {
		let url = "app/bi/getReportManKPIData";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(obj))
		};
		NetUtil.getRequestJson(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;
 			resolve(data);
		})
	});
	return promise;
}	

/**
* 取得生產KPI報表列表
* @param user資料
* @param co 公司
* @param year 年份
* @param month 月份
*/
export async function getReportProKPIData(user,co,year,month){
	let obj = {
		"user": user,
		"co": co,
		"year": year,
		"month": month
	}
	let promise = new Promise((resolve, reject) => {
		let url = "app/bi/getReportProKPIData";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(obj))
		};
		NetUtil.getRequestJson(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;
 			resolve(data);
		})
	});
	return promise;
}	

/**
* 取得生產KPI明細報表列表
* @param user資料
* @param co 公司
* @param year 年份
* @param month 月份
* @param kpi_id kpi代號
* @param belong 歸屬 MAN/PRO
*/
export async function getReportKPIDetailData(user,co,year,month,kpi_id,belong){
	let obj = {
		"user": user,
		"co": co,
		"year": year,
		"month": month,
		"kpi_id": kpi_id,
		"belong": belong
	}
	let promise = new Promise((resolve, reject) => {
		let url = "app/bi/getReportKPIDetailData";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(obj))
		};
		NetUtil.getRequestJson(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;
 			resolve(data);
		})
	});
	return promise;
}	

/**
* 取得同步APP Module API
*/
export async function updateModule(user){
	let lSQL = "SELECT MAX(TXDAT) as TXDAT FROM THF_MODULE"; //取最大的更新時間
	let lData = await SQLite.selectData(lSQL, []);
	let ltxdat = lData.item(0).TXDAT; //更新時間
	let promise = new Promise((resolve, reject) => {
		let start = new Date().getTime();

		let url = "data/getModule";
		let params = {
			"token": Common.encrypt(user.token),
			"userId": Common.encrypt(user.loginID),
			"content": Common.encrypt(ltxdat ? '' : ltxdat)
		}

		if (ltxdat === null) {
			NetUtil.getRequestContent(params, url).then((data) => {
				// console.log(data);
				if (data.code != 200) {
					reject(data); //已在其他裝置登入
					return promise;
				}
				data = data.content;

				
				let max     = 50;
				let lInsert = "INSERT INTO THF_MODULE ";
				let iArray  = [];
				let execute = [];
				
				for(let i in data ){
					i = parseInt(i);

					iArray = iArray.concat([
						data[i].oid, 
						data[i].parentoid, 
						data[i].layer, 
						data[i].id, 
						data[i].name,
						data[i].explain,
						data[i].icon,
						data[i].sort,
						data[i].langid,
						data[i].status,
						Common.dateFormat(data[i].crtdat),
						Common.dateFormat(data[i].txdat),
					]);
					
					if( (i+1)%max == 0 ){
						//達到分批數量，要重置資料
						lInsert+= " select ?,?,?,?,?,?,?,?,?,?,?,? ";
						execute.push([lInsert, iArray]);
						lInsert = "INSERT INTO THF_MODULE ";
						iArray = [];
					}else if( (i+1) == data.length ){
						lInsert+= " select ?,?,?,?,?,?,?,?,?,?,?,? ";
						execute.push([lInsert, iArray]);
					}else{
						lInsert+= " select ?,?,?,?,?,?,?,?,?,?,?,? union all";
					}
				}

				SQLite.insertData_new(execute).then(()=>{
				let end = new Date().getTime();
					console.log("updateModule_end:"+ (end - start) / 1000);
					resolve();
				});
				
			})
		} else {
			NetUtil.getRequestContent(params, url).then((data) => {
				if (data.code != 200) {
					reject(data); //已在其他裝置登入
					return promise;
				}
				data = data.content;
				
				let max      = 50;
				let dArray   = [];
				let iArray   = [];
				let lDelete  = "DELETE FROM THF_MODULE WHERE OID in (";
				let lInsert  = "INSERT INTO THF_MODULE ";
				let dExecute = [];
				let iExecute = [];
				
				for(let i in data){
					i = parseInt(i);
					dArray = dArray.concat([data[i].oid]);
					iArray = iArray.concat([
						data[i].oid, 
						data[i].parentoid, 
						data[i].layer, 
						data[i].id, 
						data[i].name,
						data[i].explain,
						data[i].icon,
						data[i].sort,
						data[i].langid,
						data[i].status,
						Common.dateFormat(data[i].crtdat),
						Common.dateFormat(data[i].txdat),
					]);

					if( (i+1)%max == 0 ){
						lDelete+= "?)";
						lInsert+= " select ?,?,?,?,?,?,?,?,?,?,?,? ";
						dExecute.push(SQLite.deleteData(lDelete, dArray));
						iExecute.push(SQLite.insertData(lInsert, iArray));
						dArray = [];
						iArray = [];
						lDelete = "DELETE FROM THF_BANNER WHERE OID in (";
						lInsert = "INSERT INTO THF_BANNER ";
					}else if( i == data.length-1 ){
						lDelete+= "?)";
						lInsert+= " select ?,?,?,?,?,?,?,?,?,?,?,? ";
						dExecute.push(SQLite.deleteData(lDelete, dArray));
						iExecute.push(SQLite.insertData(lInsert, iArray));
					}else{
						lDelete+= "?,";
						lInsert+= " select ?,?,?,?,?,?,?,?,?,?,?,? union all";
					}

				}

				Promise.all(dExecute).then(()=>{
					Promise.all(iExecute).then(()=>{
						let end = new Date().getTime();
						console.log("updateModule_end:"+ (end - start) / 1000);
						resolve();
					})
				})
			});
		}
	});
	return promise;
}

/**
* 設定LoginInfo資料到Server端  THF_LOGININFO
* @param User user 人員物件
* @return void
*/
export async function setLoginInfo(user) {
	let url = 'data/setLoginInfo';
	let content = {
		"userid": user.loginID,
		"ip": await Device.getIP(),
		"platform": Platform.OS,
		"platformversion": Device.getSystemVersion(),
		"model": Device.getModel(),
		"appversion": Device.getVersion(),
		"empid": user.id
	}
	
	let params = {
		"token": Common.encrypt(user.token),
		"userId": Common.encrypt(user.loginID),
		"content": Common.encrypt(JSON.stringify(content))
	};

	let promise = new Promise((resolve, reject) => {
		NetUtil.getRequestContent(params, url).then((data) => {
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;
			resolve(data);
		})
	});
	return promise;
}

export async function getCarData(user,company,date){
	let promise = new Promise((resolve, reject) => {
		let url = "data/getCarData";
		let content = {
			"company" : company,
			"startdate" : date
		}
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(content))
		};
		NetUtil.getRequestContent(params, url).then((data) => {
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;
			resolve(data);
		})
	});
	return promise;
}

/**
* 取得WebMail登入的SessionID
* @param user User
* @return String
*/
export async function getSessionID(user){
	let promise = new Promise((resolve, reject) => {
		let url = "app/webmail/getSessionID";
		let mail;
		if (user.membereMail == null || user.membereMail == "") {
			mail = user.email;
		}else{
			mail = user.membereMail;
		}
		
		let params = {
			"token"  :Common.encrypt(user.token),
			"userId" :Common.encrypt(user.loginID),
			"content":Common.encrypt(mail)
		}
		NetUtil.getRequestContent(params, url).then((data) => {
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			resolve(data);
		})
		
	});
	return promise;
}

/**
 * 獲取國家地區號
 * @param empid String
 * @param obj 
	let obj={
		"token":"",
		"userId":empid,
		"lang":lang,
		"content":""
	}
 * @param lang 多語係 
 * @return json 
 */
export async function  getCountryData(empid,obj,lang){
	let promise = new Promise((resolve, reject) => {
		let url = "public/nationcode/get";
		let params = {
			"token":"",
			"userId":empid,
			"lang":lang,
			"content":""
		}
		NetUtil.getRequestContent(params, url).then((data) => {
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;
			resolve(data);
		})
	});
	return promise;
}

/**
 * 確認驗證碼資料
 * @param empid String
	 * @param obj OBJECT
 	let obj={
      "empid":this.state.empid,
      "nationCode":this.state.areaSelected.paramcode,
      "phoneNumber":this.state.tel,
      "identityNumber":this.state.idCard,
      "code":this.state.verifyCode
    }
 * @param lang String 多語係
 * @return json 
 */
export async function getVerificationData(empid,obj,lang) {
	let promise = new Promise((resolve, reject) => {
		let url = "app/sms/verify";
		let Empid = Common.encrypt(empid);
		let content = Common.encrypt(JSON.stringify(obj));
		let params = {
			"token":"",
			"userId":Empid,
			"content":content,
			"lang":lang
		};

		NetUtil.getRequestJson(params, url).then((data)=>{
			if(data.code!= 200){
				reject(data);
				return promise;
			}
 			resolve(data);
		})
	});
	return promise;
}
/**
 * 發送驗證碼短信
 * @param empid String 工號
 * @param obj OBJECT
 let obj={
   "empid":"A10437",
   "nationCode":"86",
   "phoneNumber":"XXXXX",
   "identityNumber":"XXXX"
 }
 * @param lang String 多語係
 * @return json 
 */
export async function getVerificationCode(empid,obj,lang) {

	let promise = new Promise((resolve, reject) => {
		let url = "app/sms/send";
		let Empid = Common.encrypt(empid);
		let content = Common.encrypt(JSON.stringify(obj));
		let params = {
			"token":"",
			"userId":Empid,
			"content":content,
			"lang":lang
		};
		NetUtil.getRequestJson(params, url).then((data)=>{
			if(data.code!= 200){
				reject(data);
				return promise;
			}
 			resolve(data);
		})
	});
	return promise;
}
/**
 * 修改登陸密碼
 * @param empid String 工號
 * @param pwd String 密碼
 * @param lang String 多語係
 * @return json 
 */
export function getUpdatePwdData(empid,pwd,lang) {
	let promise = new Promise((resolve, reject) => {
		let Empid = Common.encrypt(empid);
		let Pwd = Common.encrypt(pwd);
		let obj={
			"userid":empid,
			"pwd":Pwd
		}
		let content = Common.encrypt(JSON.stringify(obj));
		let params = {
			"token":"",
			"userId":Empid,
			"content":content,
			"lang":lang
		};

		let url = "org/user/pwd/update";
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.message=="ok") {
				resolve(data);
			} else {
				reject(data);
			}
		})
	});
	return promise;
}

export function getIemiExist(iemi){
	let promise = new Promise((resolve, reject) => {
		let url = "data/cert/exists";

		let params = {
			"token"  : "",
			"userId" : "",
			"content": Common.encrypt(iemi)
		};

		NetUtil.getRequestContent(params, url).then((data)=>{
			if(data.code!= 200){
				reject(data);
				return promise;
			}
 			resolve(data);
		});
	});
	return promise;
}

export function setBiosUserIemi(user,iemi,remore=false){
	let promise = new Promise((resolve, reject) => {
		let url = remore ? "data/cert/delete" : "data/cert/add";

		/*
		if(!user.token){
			user.token="";
		}
		*/
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(iemi),
			"lang":user.lang
		};
		NetUtil.getRequestJson(params, url).then((data)=>{
			if(data.code!= 200){
				reject(data);
				return promise;
			}
 			resolve(data);
		});
	});
	return promise;
}

/**
 * 利用token取得MB人員資料
 * @param String loginID
 * @return Promise
 */

export async function getMBUserInfoByImei(biosInfo,lang){
	let promise = new Promise((resolve, reject) => {
		let version  = Device.getVersion();
		let url = "login/certid";
		
		let params = {
			"token": "",
			"userId": Common.encrypt(biosInfo.biosUser.userID),
			"content": {
				"appversion": version,
				"platform": Platform.OS,
				"certid": Common.encrypt(biosInfo.biosUser.iemi)
			},
			"lang": lang
		};
		
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code == 200){

				var user         = new User();
				let tempData     = data.content;
				// 判斷是否登入成功
				user.birthday    = tempData.member.brndat;
				user.co          = tempData.member.coid;
				user.depID       = tempData.member.depid;
				user.depName     = tempData.member.depname;
				user.dutname     = tempData.member.dutname;
				user.dutsort     = tempData.member.dutsort;
				user.email       = tempData.member.email;
				user.id          = tempData.member.id;
				user.name        = tempData.member.name;
				user.plantID     = tempData.member.plantid;
				user.plantName   = tempData.member.plantname;
				user.sex         = tempData.member.sex;
				user.token       = tempData.token;
				//對於工號登錄的情景下，必須將對應的工號替換loginID
				user.loginID     = biosInfo.biosUser.userID;
				user.skype       = tempData.skype;
				user.telphone    = tempData.telphone;
				user.cellphone   = tempData.cellphone;
				user.lang        = tempData.lang;
				user.pictureUrl  = tempData.picture;
				user.isPush      = tempData.userConfig.push;
				user.membereMail = tempData.member.email;
				
				resolve(user)
			} else {
				reject(data.message);
			}
		});
		
	});
	return promise;
}

/**
 * 利用token取得MB人員資料
 * @param String loginID
 * @return Promise
 */

export async function getMBVerifyMode(lang){
	let promise = new Promise((resolve, reject) => {

		let url = "public/verifyMode/get";
		let params = {
			"token"  : "",
			"userId" : "",
			"content": "",
			"lang":lang
		};


		NetUtil.getRequestContent(params, url).then((data)=>{
			if (!data.content) {
				reject("no network");
				return promise;
			} else if (data.code === "0") {
				reject(data); //已在其他裝置登入
				return promise;
			}
			resolve(data)
		});
	});
	return promise;
}

/**
 * 獲取薪資條架構
 */
export async function getMisPsalyms(user, appPublicKey) {
	let promise = new Promise((resolve, reject) => {
		let url = "/app/mis/psalyms/get";
		let company = user.co + user.plantID;

		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(company),
			"lang"   : user.lang
		};

		NetUtil.getRequestContent(params, url).then((data) => {
			if (data != null) {
				if (data.code == 0 ) {
					reject(data); //已在其他裝置登入
				}else if (data.code != 200) {
					reject(data); //有其他失誤
				}else if (data.content == null){
					reject(data); //有其他失誤
				}else{
					resolve(data);
				}
			} else {
				reject(data);
			}
		})
		
	});
	return promise;
}

export async function exchangeRSAPubliceKey(user, PubliceKey){
	let promise = new Promise((resolve, reject) => {
		let key = JSON.stringify({
			"publickey": PubliceKey,
		});

		let url = "app/mis/salary/publickey/get";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(key),
		};

		NetUtil.getRequestContent(params, url).then((data) => {
			if (data != null) {
				if (data.code == 0 ) {		
					//已在其他裝置登入
					data.apiState = false;
					reject(data); 
				}else if(data.code != 200){
					//APP Server API通訊錯誤
					data.apiState = false;
					reject(data);
				}else if(data.content == "" || data.content == null){
					// HR server 回傳值為空
					data.apiState = true;
					reject(data);
				}else{
					data.apiState = true;
					// data = Common.decryptMisInfo(data.content);
					data = JSON.parse(data.content);
					if (data.isSuccess) {
						resolve(data);
					} else {
						// HR server 處理API失敗，回傳false
						reject(data);
					}
				}
			} else {
				reject(data);
			}

		})

	});
	return promise;
}

/**
 * 獲取薪資資訊
 */
export async function getMisSalary(user, date, PubliceKey) {
	let promise = new Promise((resolve, reject) => {
		date = JSON.stringify({
			"psalym": date,
			"publickey": PubliceKey
		});

		let url = "app/mis/salary/get";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(date),
			"lang"   : user.lang
		};

		NetUtil.getRequestContent(params, url).then((data) => {
			if (data != null) {
				if (data.code == 0 ) {		//已在其他裝置登入
					data.apiState = false;
					reject(data); 
				}else if(data.code != 200){ //APP Server API通訊錯誤
					data.apiState = false;
					reject(data);
				}else if(data.content == null || data.content == ""){
					data.apiState = true;
					reject(data);
				}else{
					// data = Common.decryptMisInfo(data.content);
					data = JSON.parse(data.content);
					resolve(data);
				}
				return promise;
			} else {
				reject(data);
			}
			
		})
		
	});
	return promise;
}

/**
 * 檢核身份證與電話號碼是否一致
 * @param empid String 工號
 * @param obj OBJECT
 let obj={
   "empid":"A10437",
   "nationCode":"86",
   "phoneNumber":"XXXXX",
   "identityNumber":"XXXX"
 }
 * @param lang String 多語係
 * @return json 
 */
export async function getVerifyIdentityAndtel(empid,obj,lang) {

	let promise = new Promise((resolve, reject) => {
		let url = "app/sms/identity/verify";
		let Empid = Common.encrypt(empid);
		let content = Common.encrypt(JSON.stringify(obj));
		let params = {
			"token":"",
			"userId":Empid,
			"content":content,
			"lang":lang
		};

		NetUtil.getRequestJson(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data;
			resolve(data);
		})
	});
	return promise;
}

/**
 * 獲取登錄方式 single/tab
 * @return Promise
 */
export async function getLoginMode(){
	let promise = new Promise((resolve, reject) => {

		let url = "public/loginMode/get";
		let params = {
			"token"  : "",
			"userId" : "",
			"content": "",
			"lang":""
		};

		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;
			resolve(data);
		});
	});
	return promise;
}

/**
 * 判斷該人員是工號/AD賬號&&確認工號是否存在
 * @return Promise
 */
export async function getSingleUser(userId,lang){
	let promise = new Promise((resolve, reject) => {

		let url = "login/user/get";
		let params = {
			"token"  : "",
			"userId" : userId,
			"content": "",
			"lang":lang
		};


		NetUtil.getRequestJson(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;
			resolve(data);
		});
	});
	return promise;
}

export async function updateCertTips(user,certTips='N'){
	let lang;
    await DeviceStorageUtil.get('locale').then((data)=>{
    	lang = data?JSON.parse(data):data;
    })

	let content = {
      'certTips':certTips
    }

    let params = {
		"token"  :Common.encrypt(user.token),
		"userId" :Common.encrypt(user.loginID),
		"content":Common.encrypt(JSON.stringify(content)),
		"lang"   :lang,
    };

    let url = "org/user/config/update";
	
	let promise = new Promise((resolve, reject) => {
	    NetUtil.getRequestContent(params, url).then((data)=>{
	    	if (data.code != 200) {
	    		reject(data.message); //已在其他裝置登入
	    		return promise;
	    	}
 			resolve(data.content);
		})
	});

	return promise;
}

export async function getOperationSOP(user) {
	let lang;
	await DeviceStorageUtil.get('locale').then((data) => {
		lang = data ? JSON.parse(data) : data;
	})

	let params = {
		"token": Common.encrypt(user.token),
		"userId": Common.encrypt(user.loginID),
		"content": Common.encrypt(JSON.stringify({})),
		"lang": lang,
	};

	let url = "data/getSOP";

	let promise = new Promise((resolve, reject) => {
		NetUtil.getRequestContent(params, url).then((data) => {
			// console.log(data);

			if (data.code != 200) {
				reject(data.message); //已在其他裝置登入
				return promise;
			}
			resolve(data.content);

		})
	});

	return promise;
}

export async function getSeasonThemeDisplay() {
	let params = {};
	let url = "data/getSeasonThemeDisplay";

	let isConnected = await NetInfo.fetch().then((state) => {
		return state.isConnected;
	});

	if (isConnected) {
		return await NetUtil.getRequestContent(params, url).then((data) => {
			data.content = (data.code != 200) ? false : data.content
			return ( data.content ) ? true : false;
		})
	} else {
		return false ;
	}
}

export async function getAndroidChangeAppMessage(version, platform) {
	let content = {
		no:version,
		platform:platform == "android"? "A": "I"
    }
    let params = {
		"content":content,
    };
	let url = "version/check";

	let isConnected = await NetInfo.fetch().then((state) => {
		return state.isConnected;
	});

	if (isConnected) {
		return await NetUtil.getRequestContent(params, url).then((data) => {
			data.content = (data.code != 200) ? false : data.content
			return data.content;
		})
	} else {
		return false ;
	}
}


/**
* 取得問卷
* @param user資料
* @param content json包含 id、lang id例如 G00010
*/
export async function getCreateSurvey(user, content){
	let promise = new Promise((resolve, reject) => {
		let url = "data/survey/getCreateSurvey";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"lang" : Common.encrypt(user.lang),
			"content": Common.encrypt(JSON.stringify(content))
		};
		NetUtil.getRequestContent(params, url).then((data)=>{
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;
 			resolve(data);
		})
	});
	return promise;
}

/**
* 送出問卷
* @param user資料
* @param content json包含 id、lang id例如 G00010
*/
export async function registerSurvey(user, content){
	let promise = new Promise((resolve, reject) => {
		let url = "data/survey/setSurveyAnswer";
		let params = {
			"token"  : Common.encrypt(user.token),
			"userId" : Common.encrypt(user.loginID),
			"content": Common.encrypt(JSON.stringify(content))
		};
		NetUtil.getRequestContent(params, url).then((data)=>{
			console.log("getRequestContent", data);
			if (data.code != 200) {
				reject(data); //已在其他裝置登入
				return promise;
			}
			data = data.content;
			resolve(data);
		})
	});
	return promise;
}