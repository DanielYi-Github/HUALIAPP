import * as SQLite         from './SQLiteUtil';

/**
 * 運行過程中發生錯誤，寫進資料庫
 * @param msg String 內容
*/
let UpgradeDBTableUtil = {
	async UpgradeDBTable(){
		//檢查該表單有無此欄位
		SQLite.checkTableField("THF_CONTACT", "SEX").then((data)=>{
		  if (!data) {
		    SQLite.dropTable("THF_CONTACT").then((result)=>{
		      if (result) {
		        let createTable = `CREATE TABLE THF_CONTACT (
		            OID char(32) PRIMARY KEY,
		            AD VARCHAR ( 50 ),
		            EMPID VARCHAR ( 50 ) NOT NULL,
		            NAME VARCHAR ( 50 ) NOT NULL,
		            SEX VARCHAR ( 10 ) ,
		            CO NVARCHAR ( 50 ),
		            DEPID VARCHAR ( 50 ),
		            DEPNAME NVARCHAR ( 50 ),
		            JOBTITLE NVARCHAR ( 50 ),
		            TELPHONE VARCHAR ( 50 ),
		            CELLPHONE VARCHAR ( 50 ),
		            MAIL text,
		            SKYPE VARCHAR ( 50 ),
		            PICTURE text,
		            STATUS char ( 1 ) NOT NULL DEFAULT 'Y',
		            CRTDAT numeric NOT NULL DEFAULT (datetime('now','+8 hour')),
		            TXDAT numeric DEFAULT (datetime('now','+8 hour'))
		         );`
		         SQLite.createTable(createTable).then((e)=>{
		            console.log(e);
		         });
		      }
		    });
		  }
		});
		//檢查有無表單
		/*
		SQLite.checkTable("THF_FIND_INFO").then((data)=>{
		  if (!data) {
		    //檢查沒有進行新增表單
		    let createTable = `CREATE TABLE THF_FIND_INFO ( 
		        OID char ( 32 ) NOT NULL,
		        ID varchar ( 50 ) NOT NULL,
		        NAME nvarchar ( 50 ),
		        FUNC nvarchar ( 50 ),
		        LANGID nvarchar ( 50 ),
		        STATUS char ( 1 ) NOT NULL DEFAULT 'Y',
		        CRTDAT numeric NOT NULL DEFAULT (datetime('now','+8 hour')),
		        TXDAT numeric DEFAULT (datetime('now','+8 hour')), 
		        PRIMARY KEY( OID ) 
		      )`;

		     SQLite.createTable(createTable).then((data)=>{});
		  }
		});
		*/
		//檢查有無表單
		/*
		SQLite.checkTable("THF_PERMISSION").then((data)=>{
		  if (!data) {
		    //檢查沒有進行新增表單
		    let createTable = `CREATE TABLE THF_PERMISSION (
		                        DATA_OID  TEXT NOT NULL,
		                        DATA_TYPE TEXT NOT NULL,
		                        PRIMARY KEY( DATA_OID)
		                      )`;
		     SQLite.createTable(createTable).then((data)=>{});
		  }
		});
		*/
		//檢查該表單有無此欄位
		SQLite.checkTableField("THF_PERMISSION", "FUNC_OID").then((data)=>{
		  if (!data) {
		    SQLite.dropTable("THF_PERMISSION").then((result)=>{
		      if (result) {
		        let createTable = `CREATE TABLE THF_PERMISSION (
		                        DATA_OID  TEXT NOT NULL,
		                        DATA_TYPE TEXT NOT NULL,
		                        FUNC_OID VARCHAR ( 32 ),
		                        CONSTRAINT OID PRIMARY KEY (DATA_OID, FUNC_OID)
		                      )`;
		         SQLite.createTable(createTable).then((e)=>{
		            console.log(e);
		         });
		      }
		    });
		  }
		});
		//檢查該表單有無此欄位
		SQLite.checkTableField("THF_BANNER", "LANG").then((data)=>{
		  if (!data) {
		    SQLite.dropTable("THF_BANNER").then((result)=>{
		      if (result) {
		        let createTable = `CREATE TABLE THF_BANNER ( 
		                            OID char ( 32 ), 
		                            ID VARCHAR ( 50 ) NOT NULL, 
		                            DOWNURL text NOT NULL, 
		                            OPENTYPE VARCHAR ( 50 ), 
		                            APPID VARCHAR ( 50 ), 
		                            PORTALURL text, 
		                            SORT int, 
		                            LANG VARCHAR ( 10 ),
		                            STATUS char ( 1 ) NOT NULL DEFAULT 'Y', 
		                            CRTDAT numeric NOT NULL DEFAULT (datetime('now','+8 hour')), 
		                            TXDAT numeric DEFAULT (datetime('now','+8 hour')), 
		                            PRIMARY KEY(OID) 
		                          )`;
		         SQLite.createTable(createTable).then((e)=>{
		            console.log(e);
		         });
		      }
		    });
		  }
		});
		//檢查該表單有無此欄位
		SQLite.checkTableField("THF_MODULE", "LANGID").then((data)=>{
		  if (!data) {
		    SQLite.dropTable("THF_MODULE").then((result)=>{
		      if (result) {
		        let createTable = `CREATE TABLE THF_MODULE ( 
		                            OID char ( 32 ) NOT NULL, 
		                            PARENTOID char ( 32 ), 
		                            LAYER int NOT NULL, 
		                            ID varchar ( 50 ) NOT NULL, 
		                            NAME nvarchar ( 50 ), 
		                            EXPLAIN text, 
		                            ICON text, 
		                            SORT int NOT NULL, 
		                            LANGID nvarchar ( 50 ),
		                            STATUS char ( 1 ) NOT NULL DEFAULT 'Y', 
		                            CRTDAT numeric NOT NULL DEFAULT (datetime('now','+8 hour')), 
		                            TXDAT numeric DEFAULT (datetime('now','+8 hour')), 
		                            PRIMARY KEY(OID) 
		                          )`;
		         SQLite.createTable(createTable).then((e)=>{
		            console.log(e);
		         });
		      }
		    });
		  }
		});
		//檢查有無表單
		SQLite.checkTable("THF_ERROR_LOG").then((data)=>{
		  if (data) {
		    SQLite.dropTable("THF_ERROR_LOG").then((result)=>{
		      if (result) {
		        let createTable = `CREATE TABLE THF_LOG ( 
		                            OID integer PRIMARY KEY AUTOINCREMENT, 
		                            USERID varchar ( 50 ) NOT NULL, 
		                            POSITION varchar ( 500 ), 
		                            LOGLEVEL varchar ( 10 ) NOT NULL,
		                            CONTENT text, 
		                            STATUS char ( 1 ) NOT NULL DEFAULT 'Y', 
		                            CRTDAT numeric NOT NULL DEFAULT (datetime('now','+8 hour')), 
		                            TXDAT numeric DEFAULT (datetime('now','+8 hour')) 
		                          )`;
		         SQLite.createTable(createTable).then((e)=>{
		            console.log(e);
		         });
		      }
		    });
		  }
		});
	},
}

export default UpgradeDBTableUtil;