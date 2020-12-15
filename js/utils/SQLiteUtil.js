import { Platform } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(false);
let db;
function open(){
	if(Platform.OS==='android'){
		db = SQLite.openDatabase({name:'AppDB.db',createFromLocation:'~AppDB.db'},
			()=>{
				successCB("open");
			},(err)=>{
				errorCB("open",err);
			}
		);
	}else{
		db = SQLite.openDatabase({name:'AppDB',createFromLocation:1}, 	//for ios
			()=>{
				successCB("open");
			},(err)=>{
				errorCB("open",err);
			}
		);
	}
}
/**
 * 	SQLite查詢共用方法
 *	@param string sql select語句 ex. select * from THF_APP where OID=?
 *	@param array value 問號的值 用數組表示 ex.['1111']
*/
export function selectData(sql,values){
	if(!db){
		open();
	}
	let promise = new Promise((resolve,reject)=>{
		
		db.transaction((tx)=>{
			tx.executeSql(sql,values,(tx,results)=>{
				successCB('executeSql');
				let data = results.rows;
				resolve(data);
			},(err)=>{
				reject(err);
				errorCB('executeSql', err);
			})
		},(err)=>{
			reject(err);
			errorCB('transaction', err);
		},()=>{
			successCB('transaction');
		})
	});

	return promise;
}
/**
 * 	SQLite插入共用方法
 *	@param string sql select語句 ex. INSERT INTO THF_APP VALUES(?,?,?)
 *	@param array value 問號的值 用數組表示 ex.['1111','222','333']
*/
export function insertData(sql,values){
	if(!db){
		open();
	}
	let promise = new Promise((resolve,reject)=>{
		db.transaction((tx)=>{
			try{
				tx.executeSql(sql,values);
				successCB('insert');
				resolve();
			}catch(err){
				console.log("err", err);
				errorCB('insert', err);
				reject(err);
			}
		},(err)=>{
			console.log("err2", err);
			errorCB('transaction', err);
			reject(err);
		},()=>{
			successCB('transaction');
		});
	});
	return promise;
}


/** 測試批量新增值方法
 * 	SQLite插入共用方法
 *	@param string sqls 語句 [ [sql語句,[變量]] ]
	ex [ 
		['INSERT INTO THF_APP VALUES(?,?,?)', ['1111','222','333']],
		['INSERT INTO THF_APP VALUES(?,?,?)', ['1111','222','333']],
		['INSERT INTO THF_APP VALUES(?,?,?)', ['1111','222','333']] 
	]
*/
export function insertData_new(sqls, index = null){
	if(!db){
		open();
	}
	let promise = new Promise((resolve,reject)=>{
		db.transaction((tx)=>{
			try{
				for(let i in sqls) tx.executeSql(sqls[i][0],sqls[i][1]);
			}catch(err){
				errorCB('insert', err);
				reject(err);
			}
		},(err)=>{
			errorCB('transaction', err);
			reject(err);
		},(success)=>{
			successCB('transaction');
			resolve();
		});
	});
	return promise;
}

/**
 * 	SQLite更新共用方法
 *	@param string sql select語句 ex. UPDATE THF_APP SET ID=? WHERE OID=?
 *	@param array value 問號的值 用數組表示 ex.['1111','222']
*/
export function updateData(sql,values){
	if(!db){
		open();
	}
	let promise = new Promise((resolve,reject)=>{
		db.transaction((tx)=>{
			try{
				tx.executeSql(sql,values);
				successCB('update');
				resolve();
			}catch(err){
				errorCB('update', err);
				reject(err);
			}
		},(err)=>{
			errorCB('transaction', err);
			reject(err);
		},()=>{
			successCB('transaction');
		});
	});
	return promise;
}
/** 測試批量更新值方法
 * 	SQLite更新共用方法
 *	@param string sqls 語句 [ [sql語句,[變量]] ]
	ex [ 
		['UPDATE THF_APP SET ID=? WHERE OID=?', ['1111','222']],
		['UPDATE THF_APP SET ID=? WHERE OID=?', ['1111','222']],
		['UPDATE THF_APP SET ID=? WHERE OID=?', ['1111','222']] 
	]
*/
export function updateData_new(sqls){
	if(!db){
		open();
	}
	let promise = new Promise((resolve, reject) => {
		db.transaction((tx) => {
			try {
				for (let i in sqls) tx.executeSql(sqls[i][0], sqls[i][1]);
				successCB('insert');
				resolve();
			} catch (err) {
				errorCB('insert', err);
				reject(err);
			}
		}, (err) => {
			errorCB('transaction', err);
			reject(err);
		}, () => {
			successCB('transaction');
		});
	});
	return promise;
}

/**
 * 	SQLite刪除共用方法
 *	@param string sql select語句 ex. DELETE FROM THF_APP WHERE OID=?
 *	@param array value 問號的值 用數組表示 ex.['1111','222']
*/
export function deleteData(sql,values){
	if(!db){
		open();
	}
	let promise = new Promise((resolve,reject)=>{
		db.transaction((tx)=>{
			try{
				tx.executeSql(sql,values);
				successCB('delete');
				resolve();
			}catch(err){
				errorCB('delete', err);
				reject(err);
			}
		},(err)=>{
			errorCB('transaction', err);
			reject(err);
		},()=>{
			successCB('transaction');
		});
	});
	return promise;
}

/** 
 * 	測試批量刪除共用方法
 *	@param string sql select語句 ex. DELETE FROM THF_APP WHERE OID=?
 *	@param array value 問號的值 用數組表示 ex.['1111','222']
*/
export function deleteData_new(sqls){
	if(!db){
		open();
	}
	let promise = new Promise((resolve,reject)=>{
		db.transaction((tx)=>{
			try{
				for(let i in sqls) tx.executeSql(sqls[i][0],sqls[i][1]);
				successCB('delete');
				resolve();
			}catch(err){
				errorCB('delete', err);
				reject(err);
			}
		},(err)=>{
			errorCB('transaction', err);
			reject(err);
		},()=>{
			successCB('transaction');
		});
	});
	return promise;
}



//清除表單資料
/**
 * 	SQLite清除table資料
 *	@param string sql select語句 ex. [ DELETE FROM THF_APP, DELETE FROM THF_BBB ]
*/
export function cleanTableData(sqls){
	if(!db){
		open();
	}
	let promise = new Promise((resolve,reject)=>{
		db.transaction((tx)=>{
			try{
				for(let i in sqls) tx.executeSql(sqls[i]);
				successCB('delete');
				resolve();
			}catch(err){
				errorCB('delete', err);
				reject(err);
			}
		},(err)=>{
			errorCB('transaction', err);
			reject(err);
		},()=>{
			successCB('transaction');
		});
	});
	return promise;
}

//檢查欄位資料
/**
 * 	檢查某張table是否有某張欄位
 *	table = 表單名稱, field = 欄位名稱
 *  return true 有此欄位, false 無此欄位
*/
export function checkTableField(table ,field){
	if(!db){
		open();
	}
	let promise = new Promise((resolve,reject)=>{
		db.transaction((tx)=>{
			try{
				let sql = `PRAGMA table_info(${table})`;
				tx.executeSql(sql, [], (tx, results) => {
					successCB('executeSql');
					let data = results.rows;
					for (var i = 0, len = data.length; i < len; i++) {
						if (data.item(i).name == field) resolve(true);
					}
					resolve(false);
				}, (err) => {
					errorCB('executeSql', err);
					resolve(false);
					// reject(err);
				})
			}catch(err){
				errorCB('delete', err);
				resolve(false);
				// reject(err);
			}
		},(err)=>{
			errorCB('transaction', err);
			resolve(false);
			// reject(err);
		},()=>{
			successCB('transaction');
		});
	});
	return promise;
}

//新增表單欄位
/**
 *  return true 新增成功, false 新增失敗
*/
export function insertTableField(sql){
	if(!db){
		open();
	}
	let promise = new Promise((resolve,reject)=>{
		db.transaction((tx)=>{
			try{
				tx.executeSql(sql, [], (tx, results) => {
					successCB('executeSql');
					let data = results.rows;
					resolve(data);
				}, (err) => {
					errorCB('executeSql', err);
					reject(err);
				})
			}catch(err){
				errorCB('delete', err);
				reject(err);
			}
		},(err)=>{
			errorCB('transaction', err);
			reject(err);
		},()=>{
			successCB('transaction');
		});
	});
	return promise;
}

//刪除整張表單
/**
 *  return true 刪除成功, false 刪除失敗
*/
export function dropTable(table){
	if(!db){
		open();
	}
	let promise = new Promise((resolve,reject)=>{
		db.transaction((tx)=>{
			try{
				let sql = `DROP TABLE ${table}`;
				tx.executeSql(sql, [], (tx, results) => {
					successCB('executeSql');
					let data = results.rows;
					resolve(true);

				}, (err) => {
					errorCB('executeSql', err);
					resolve(false);
					// reject(err);
				})
			}catch(err){
				errorCB('delete', err);
				resolve(false);
				// reject(err);
			}
		},(err)=>{
			errorCB('transaction', err);
			// reject(err);
			resolve(false);
		},()=>{
			successCB('transaction');
		});
	});
	return promise;
}


//新建Table
/**
 *  return true 新建成功, false 新建失敗
*/
export function createTable(sql){
	if(!db){
		open();
	}
	let promise = new Promise((resolve,reject)=>{
		db.transaction((tx)=>{
			try{
				tx.executeSql(sql, [], (tx, results) => {
					successCB('executeSql');
					console.log(results.rows);
					let data = results.rows;
					resolve(true);

				}, (err) => {
					errorCB('executeSql', err);
					resolve(false);
					// reject(err);
				})
			}catch(err){
				errorCB('delete', err);
				resolve(false);
				// reject(err);
			}
		},(err)=>{
			errorCB('transaction', err);
			// reject(err);
			resolve(false);
		},()=>{
			successCB('transaction');
		});
	});
	return promise;
}

//檢查Table是否存在
/**
 *  return true 新建成功, false 新建失敗
*/
export function checkTable(table){
	if(!db){
		open();
	}
	let promise = new Promise((resolve,reject)=>{
		db.transaction((tx)=>{
			try{
        		let sql = `SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='${table}'`;
				tx.executeSql(sql, [], (tx, results) => {
					successCB('executeSql');
					if (results.rows.item(0).count !== 0) {
						resolve(true);
					} else {
						resolve(false);
					}
				}, (err) => {
					errorCB('executeSql', err);
					resolve(false);
					// reject(err);
				})
			}catch(err){
				errorCB('delete', err);
				resolve(false);
				// reject(err);
			}
		},(err)=>{
			errorCB('transaction', err);
			// reject(err);
			resolve(false);
		},()=>{
			successCB('transaction');
		});
	});
	return promise;
}

export function close(){
	if(db){
		db.close();
		successCB('close');
	}else{
		console.log("SQLiteStorage not open");
	}
	db = null;
}
function successCB(name){
    //console.log("SQLiteStorage "+name+" success");
}
function errorCB(name, err){
    console.log("SQLiteStorage "+name+" error:",err.message);
}