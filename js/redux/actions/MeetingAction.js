import * as MeetingTypes   from '../actionTypes/MeetingTypes';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';

export function getMeetingModeType() {
	return async (dispatch, getState) => {
		// dispatch(refreshing(true)); 	
		let user = getState().UserInfo.UserInfo;
		let meetingModeTypes = await UpdateDataUtil.getMeetingModeType(user).then((result)=>{
			return result;
		}).catch((e)=>{
			console.log("e", e);
			return [];
		});
		dispatch(loadModeType(meetingModeTypes)); 	

		// dispatch(refreshing(false)); 	
	}
}

function refresh(isRefresh){
	return {
		type: MeetingTypes.MEETING_REFRESHING,
		isRefresh
	}
}

// 載入"參會方式"種類
function loadModeType(meetingModeTypes){
	return {
		type: MeetingTypes.MEETING_LOADMODETYPE,
		meetingModeTypes
	}
}

export function addMeeting(meetingParams){
	return async (dispatch, getState) => {
		// dispatch(refreshing(true)); 	
		let user = getState().UserInfo.UserInfo;
		let resultMsg = "";
		let addMeetingResult = await UpdateDataUtil.addMeeting(user, meetingParams).then((result)=>{
			return result;
		}).catch((e)=>{
			resultMsg = e.message;
			return false;
		});
		// dispatch(refreshing(false)); 
		
		dispatch({
			type: MeetingTypes.MEETING_ACTIONRESULT,
			result:addMeetingResult,
			resultMsg:resultMsg
		}); 
	}
}

export function modifyMeeting(meetingParams){
	return async (dispatch, getState) => {
		// dispatch(refreshing(true)); 	
		let user = getState().UserInfo.UserInfo;
		let resultMsg = "";
		let modifyMeetingResult = await UpdateDataUtil.modifyMeeting(user, meetingParams).then((result)=>{
			return result;
		}).catch((e)=>{
			resultMsg = e.message;
			return false;
		});
		// dispatch(refreshing(false)); 

		dispatch({
			type: MeetingTypes.MEETING_ACTIONRESULT,
			result:modifyMeetingResult,
			resultMsg:resultMsg
		}); 
	}
}

export function resetMeetingRedux(){
	return async (dispatch, getState) => {
		dispatch({
			type: MeetingTypes.MEETING_RESET,
		});
	}
}

export function resetMeetingListRedux(){
	return async (dispatch, getState) => {
		dispatch({
			type: MeetingTypes.MEETINGLIST_RESET,
		});
	}
}

export function getMeetings(condition = ""){
	return async (dispatch, getState) => {
		let user = getState().UserInfo.UserInfo;
		let content = {
			count    :getState().Meeting.meetingList.length,
			condition:condition, //查詢使用
		}
		let meetingsResult = await UpdateDataUtil.getMeetings(user, content).then((result)=>{
			console.log("getMeetings", result);
			return result;
		}).catch((e)=>{
			console.log("e", e);
			return [];
		});
		meetingsResult = [ ...getState().Meeting.meetingList, ...meetingsResult];

		dispatch({
			type: MeetingTypes.GET_MEETINGS,
			meetingsResult
		});
	}
}

function formatMeetingDate(meetings){
	let dateArray = [];
	for(let dateMeeting of meetings){
		
		var res = dateMeeting.startdate.split(" ");
		if (dateArray.length == 0) {
			dateArray.push({
				title:res[0],
				data:[dateMeeting.oid],
				meetings:[dateMeeting]
			})
		} else {
			if (res[0] == dateArray[dateArray.length-1].title) {
				dateArray[dateArray.length-1].data.push(dateMeeting.oid);
				dateArray[dateArray.length-1].meetings.push(dateMeeting);
			} else {
				dateArray.push({
					title:res[0],
					data:[dateMeeting.oid],
					meetings:[dateMeeting]
				})
			}
		}
	}
	return dateArray;
}

export function getPersonDateTime(personId){
	return async (dispatch, getState) => {
		let user = getState().UserInfo.UserInfo;
		let content = {
			empid    :personId
		}
		let meetingsResult = await UpdateDataUtil.getPersonDateTime(user, content).then((result)=>{
			console.log("getPersonDateTime", result); //顯示此人有哪些會議
			return result;
		}).catch((e)=>{
			console.log("e", e);
			return [];
		});
		// meetingsResult = await formatPersonDateTime(meetingsResult);
		
		dispatch({
			type: MeetingTypes.GET_MEETINGSPERSON_DATETIME,
			meetingsResult
		});
		
	}
}

function formatPersonDateTime(meetings){
	let dateArray = [];
	for(let dateMeeting of meetings){
		
		if (dateArray.length == 0) {
			dateArray.push({
				title:dateMeeting.date,
				data:[dateMeeting.date],
				meetings:[dateMeeting]
			})
		} else {
			if (dateMeeting.date == dateArray[dateArray.length-1].title) {
				dateArray[dateArray.length-1].data.push(dateMeeting.date);
				dateArray[dateArray.length-1].meetings.push(dateMeeting);
			} else {
				dateArray.push({
					title:dateMeeting.date,
					data:[dateMeeting.date],
					meetings:[dateMeeting]
				})
			}
		}
	}
	return dateArray;
}

/*
export function searchMeeting(meetingParams){
	return async (dispatch, getState) => {
		// dispatch(refreshing(true)); 	
		let user = getState().UserInfo.UserInfo;
		let resultMsg = "";
		let searchMeetingResult = await UpdateDataUtil.searchMeeting(user, meetingParams).then((result)=>{
			console.log("searchMeeting", result); // 顯示此群人有哪些會議
			return result;
		}).catch((e)=>{
			resultMsg = e.message;
			console.log("searchMeetingError", resultMsg);
			return false;
		});
		// dispatch(refreshing(false)); 
		console.log("searchMeetingResult", searchMeetingResult);
		/*
		dispatch({
			type: MeetingTypes.MEETING_ACTIONRESULT,
			result:searchMeetingResult,
			resultMsg:resultMsg
		}); 
	}
}
*/