import * as types          from '../actionTypes/MessageTypes';
import * as SQLite         from '../../utils/SQLiteUtil';
import * as LoggerUtil     from '../../utils/LoggerUtil';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';

export function messageInitial(user){
	return async dispatch => {
		dispatch( refresh() ); 			//顯示載入動態
		// this.loadMessageIntoState();	//載入第一頁資料
		this.message_refresh(user);
	}
}

export function message_refresh(user){
	return async dispatch => {
		dispatch( refresh() ); //顯示載入動態

		/*server資料同步*/
		/*
		Promise.all([
			UpdateDataUtil.updateMSG(user),	//手機消息
		]).then( async () => {
		})
		*/
		this.loadMessageIntoState();	//載入第一頁資料
	}
}

export function loadMessageIntoState( page = 0, data = []) {
	return async dispatch => {
		/*計算資料的總比數，用總比數判斷是否需要重新載入資料*/
		// console.log("page="+page);
		/*
		var totleSql = `SELECT COUNT(*) from THF_MSG a left join THF_MSG_USERREAD r on  r.MSGOID=a.OID
				   WHERE a.STATUS='Y'`; 
		await SQLite.selectData(totleSql, []).then((result) => {
		  	console.log("總筆數:",result.item(0));
		});
		*/

		if (page == 0) {
			// var allReadSql = `SELECT case when r.ISREAD is null then 'F' else r.ISREAD end ISREAD,a.* 
			// 		   from THF_MSG a left join THF_MSG_USERREAD r on  r.MSGOID=a.OID
			// 		   WHERE a.STATUS='Y' order by a.CRTDAT DESC limit ${page*10},10`;
			var allReadSql = `SELECT case when r.ISREAD is null then 'F' else r.ISREAD end ISREAD,a.* 
					   from THF_MSG a left join THF_MSG_USERREAD r on r.MSGOID=a.OID
					   WHERE a.STATUS='Y' group by a.OID order by a.CRTDAT DESC`;
			let p1 = SQLite.selectData(allReadSql, []);

			var unReadSql = `SELECT case when r.ISREAD is null then 'F' else r.ISREAD end ISREAD , a.* 
					    from THF_MSG a left join THF_MSG_USERREAD r on r.MSGOID=a.OID
					    WHERE a.STATUS='Y' AND r.ISREAD is null group by a.OID order by a.CRTDAT DESC `;
			let p2 = SQLite.selectData(unReadSql, []);

			Promise.all([p1, p2]).then((value) => {
				let allReads = []; 
				for (let i = 0, len = value[0].length; i < len; i++) {
				  value[0].item(i).findPageItemType = "MSG";
				  allReads.push(value[0].item(i));
				}

				let unReads = []; 
				for (let i = 0, len = value[1].length; i < len ; i++) {
				  value[0].item(i).findPageItemType = "MSG";
				  unReads.push(value[1].item(i));
				}

				dispatch( loadInitialMessage(allReads, unReads) ); //開始顯示載入資料畫面
			}).catch((err) => {
				LoggerUtil.addErrorLog("MessageAction loadMessageIntoState", "APP Action", "ERROR", err);
			})
		} else {
			var sql = `SELECT case when r.ISREAD is null then 'F' else r.ISREAD end ISREAD,a.* 
					   from THF_MSG a left join THF_MSG_USERREAD r on  r.MSGOID=a.OID
					   WHERE a.STATUS='Y' order by a.CRTDAT DESC limit ${page*10},10`;

			await SQLite.selectData(sql, []).then((result) => {
			  for (let i = 0; i < result.length; i++) {
				result.item(i).findPageItemType = "MSG";
			    data.push(result.item(i));
			  }
			}).catch((e)=>{
				LoggerUtil.addErrorLog("MessageAction loadMessageIntoState", "APP Action", "ERROR", e);
			});

			dispatch( loadMoreMessage(data) ); //開始顯示載入資料畫面
		}
	}
}

export function updateMessageStateAllRead(user, oldMessage) {
	/*未讀訊息尚未實作*/
	return async (dispatch, getState) => {
		//清除未讀訊息的指定資料
		var sql = `insert into THF_MSG_USERREAD(MSGOID,USERID,ISREAD,ISUPDATE)
				   select a.OID,?,?,? from THF_MSG a 
				   WHERE STATUS='Y' AND 
				   not exists(select 1 from THF_MSG_USERREAD where ISREAD='Y' and MSGOID=a.OID)`;
		var value = [user.loginID, 'Y', 'N'];

		await SQLite.insertData(sql, value);

		oldMessage.forEach(function(element) {
			if (element.ISREAD === 'F') element.ISREAD = 'Y';
		});

		if (getState().Network.networkStatus == 'ONLINE') UpdateDataUtil.setReads(user);

		dispatch(updateMessage(oldMessage)); //開始顯示載入資料畫面
		dispatch(removeAllUnRead()); //開始顯示載入資料畫面
	}
}

function refresh(){
	return {
		type: types.MESSAGE_REFRESHING,
	}
}

function showFooterLoading(){
	return {
		type: types.SHOWFOOTER,
	}
}

function loadInitialMessage(allReads, unReads){
	return {
		type: types.LOADINITIAL,
		allReads, 
		unReads
	}	
}

function loadMoreMessage(data){
	return {
		type: types.LOADMORE,
		data
	}
}

function updateMessage(newMessage) {
	return {
		type: types.STATE_UPDATE,
		newMessage
	}
}

function removeUnRead(index){
	return {
		type: types.REMOVE_UNREAD,
		index
	}	
}

function removeAllUnRead(){
	return {
		type: types.REMOVE_ALLUNREAD,
	}	
}

/*
export function updateMessageState(user, item, oldMessage, unReadIndex = null) {
	return async dispatch => {
		//清除未讀訊息的指定資料
		if(unReadIndex != null){
			dispatch( removeUnRead(unReadIndex) );
		}
		
		if(network=='ONLINE'){
			UpdateDataUtil.setRead(user,item.OID);
		}

		var sql = `INSERT INTO THF_MSG_USERREAD(MSGOID,USERID,ISREAD,ISUPDATE) VALUES(?,?,?,?)`;
		var value = [item.OID,user.loginID,'Y','N'];
		await SQLite.insertData(sql, value);

		//找尋原本陣列中的該值，將該值改為Y
		oldMessage.filter(
			function(oldMessage){
				if(oldMessage.OID === item.OID){
					oldMessage.ISREAD='Y';
				}
			}
		);

		dispatch( updateMessage(oldMessage) ); //開始顯示載入資料畫面
	}
}
*/