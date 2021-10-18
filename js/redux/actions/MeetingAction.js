import * as MeetingTypes      from '../actionTypes/MeetingTypes';
import * as UpdateDataUtil    from '../../utils/UpdateDataUtil';
import * as SQLite            from '../../utils/SQLiteUtil';
import * as NavigationService from '../../utils/NavigationService';
import { Alert } from 'react-native';
import * as RNLocalize from "react-native-localize";

export function getMeetingModeType() {
	return async (dispatch, getState) => {
		dispatch(refreshing(true)); 	
		let user = getState().UserInfo.UserInfo;
		let meetingModeTypes = await UpdateDataUtil.getMeetingModeType(user).then((result)=>{
			return result;
		}).catch((e)=>{
			console.log("e", e);
			return [];
		});
		dispatch(loadModeType(meetingModeTypes)); 	
		dispatch(refreshing(false)); 	

	}
}

function refreshing(isRefreshing){
	return {
		type: MeetingTypes.MEETING_REFRESHING,
		isRefreshing
	}
}

// 載入"參會方式"種類
function loadModeType(meetingModeTypes){
	return {
		type: MeetingTypes.MEETING_LOADMODETYPE,
		meetingModeTypes
	}
}

export function setInitialMeetingInfoInRedux(attendees, oid, startdate, enddate){
	return async (dispatch, getState) => {
		dispatch({
			type     :MeetingTypes.MEETING_SET_DEFAULT_MEETION_INFO,
			oid      : oid,
			attendees: attendees,
			startdate: startdate,
			enddate  : enddate
		}); 
	}
}

export function setAttendees(attendees){
	return async (dispatch, getState) => {
		dispatch({
			type     :MeetingTypes.MEETING_SET_ATTENDEES,
			attendees: attendees,
		}); 
	}
}

export function removeAttendee(state){
	return async (dispatch, getState) => {

		let data = getState().Meeting.attendees;
		for(let [i, value] of data.entries()){
		  let spliceIndex = 0;
		  for(let item of state.tagsArray){
		    if (value.name == item){
		     spliceIndex = null;          
		     break; 
		    }
		    spliceIndex = i;
		  }

		  if(spliceIndex != null){
		   data.splice(spliceIndex,1);
		   break; 
		  }
		}

		dispatch({
			type     :MeetingTypes.MEETING_SET_ATTENDEES,
			attendees:data,
		}); 
	}
}

export function addMeeting(meetingParams){
	return async (dispatch, getState) => {
		dispatch( refreshing(true) ); 	
		let user = getState().UserInfo.UserInfo;
		let addMeetingResult = await UpdateDataUtil.addMeeting(user, meetingParams).then((result)=>{
			return result;
		}).catch((e)=>{
			console.log("e", e);
			let resultMsg = { success:false, msg:e.message};
			return resultMsg;
		});
		dispatch(refreshing(false)); 
		dispatch({
			type     :MeetingTypes.MEETING_ACTIONRESULT,
			result   :addMeetingResult,
			resultMsg:addMeetingResult.success ? null: addMeetingResult.msg
		}); 

		if (addMeetingResult.success) this.getMeetings();
	}
}

export function modifyMeeting(meetingParams){
	return async (dispatch, getState) => {
		dispatch(refreshing(true)); 	
		let user = getState().UserInfo.UserInfo;
		
		let modifyMeetingResult = await UpdateDataUtil.modifyMeeting(user, meetingParams).then((result)=>{
			return result;
		}).catch((e)=>{
			let resultMsg = { success:false, msg:e.message };
			return resultMsg;
		});
		dispatch(refreshing(false)); 
		dispatch({
			type: MeetingTypes.MEETING_MODIFYRESULT,
			result:modifyMeetingResult,
			resultMsg:modifyMeetingResult.success ? null: modifyMeetingResult.msg
		}); 

		if (modifyMeetingResult.success) {
			this.getMeetings();
		}
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
			// count    :getState().Meeting.meetingList.length,
			// condition:condition, //查詢使用
		}
		let meetingsResult = await UpdateDataUtil.getMeetings(user, content).then((result)=>{
			return result;
		}).catch((e)=>{
			console.log("e", e);
			return [];
		});

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
			// console.log("meeting/getDateTime", result); //顯示此人有哪些會議
			return result;
		}).catch((e)=>{
			console.log("e", e);
			return [];
		});

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

export function getFreeDateTime(meetingParams, freeTimeUnit){
	return async (dispatch, getState) => {
		dispatch(refreshing(true)); 	

		let user = getState().UserInfo.UserInfo;
		let content = {
			startdate:meetingParams.startdate,
			enddate  :meetingParams.enddate,
			attendees:meetingParams.attendees,
			min      :freeTimeUnit,
			timezone :RNLocalize.getTimeZone()
		}
		
		let getFreeDateTimeResult = await UpdateDataUtil.getFreeDateTime(user, content).then((result)=>{
			// console.log("result", result);
			return result;
		}).catch((e)=>{
			console.log("e", e);
			return [];
		});
		
		dispatch({
			type: MeetingTypes.GET_MEETINGS_FREE_DATETIME,
			getFreeDateTimeResult
		});
		dispatch(refreshing(false)); 
	}
}

export function cancelMeeting(oid){
	return async (dispatch, getState) => {
		dispatch(refreshing(true)); 	
		let user = getState().UserInfo.UserInfo;
		let meetingParams = { "oid":oid };
		
		let cancelMeetingResult = await UpdateDataUtil.cancelMeeting(user, meetingParams).then((result)=>{
			return result;
		}).catch((e)=>{
			let resultMsg = { success:false, msg:e.message };
			return resultMsg;
		});

		dispatch(refreshing(false)); 
		
		dispatch({
			type: MeetingTypes.MEETING_CANCELRESULT,
			result:cancelMeetingResult,
			resultMsg:cancelMeetingResult.success ? null: cancelMeetingResult.msg
		}); 

		if (cancelMeetingResult.success) {
			this.getMeetings();
		}
		
	}
}

export function resetMeetingMessage(){
	return async (dispatch, getState) => {
		dispatch({
			type: MeetingTypes.MEETING_RESETMEETINGMESSAGE,
		}); 	
	}
}

export function setRegularMeetingOptionsDefaultValue(regularMeetingDefaultOptions = "never"){
	return async (dispatch, getState) => {
		let regularMeetingOptions = [
			{
				label: getState().Language.lang.MeetingPage.never,
				value: "never"
			},
			{
				label: getState().Language.lang.MeetingPage.everyday,
				value: "everyday"
			},
			{
				label: getState().Language.lang.MeetingPage.workday,
				value: "workday"
			},
			{
				label: getState().Language.lang.MeetingPage.everyWeek,
				value: "everyWeek"
			},
			{
				label: getState().Language.lang.MeetingPage.everyMonth,
				value: "everyMonth"
			},
			{
				label: getState().Language.lang.MeetingPage.custom,
				value: "custom"
			}
		];

		let regularMeetingCustomizeOptions = [
			{
				label:getState().Language.lang.Common.week.Monday,
				value:"Monday",
				checked:false
			},
			{
				label:getState().Language.lang.Common.week.Tuesday,
				value:"Tuesday",
				checked:false
			},
			{
				label:getState().Language.lang.Common.week.Wednesday,
				value:"Wednesday",
				checked:false
			},
			{
				label:getState().Language.lang.Common.week.Thursday,
				value:"Thursday",
				checked:false
			},
			{
				label:getState().Language.lang.Common.week.Friday,
				value:"Friday",
				checked:false
			},
			{
				label:getState().Language.lang.Common.week.Saturday,
				value:"Saturday",
				checked:false
			},
			{
				label:getState().Language.lang.Common.week.Sunday,
				value:"Sunday",
				checked:false
			}
		];
		
		dispatch({
			type                          :MeetingTypes.MEETING_SETREGULARMEETINGOPTIONS,
			regularMeetingDefaultOptions  :regularMeetingDefaultOptions,
			regularMeetingOptions         :regularMeetingOptions,
			regularMeetingCustomizeOptions:regularMeetingCustomizeOptions
		}); 	
	}
}

export function getCompanies(){
	return async (dispatch, getState) => {
		let sql = `select * from THF_MASTERDATA 
				   where CLASS1='HRCO' and STATUS='Y' order by SORT;`
		let companies = await SQLite.selectData( sql, []).then((result) => {
			let items = [];
			for (let i in result.raw()) {
				items.push({
					key  :result.raw()[i].SORT,
					name :result.raw()[i].CONTENT,
					value:result.raw()[i].CLASS3
				})
			}
			return items;
		}).catch((e)=>{
			// LoggerUtil.addErrorLog("CommonAction loadCompanyData_HrCO", "APP Action", "ERROR", e);
			return [];
		});
		dispatch(setCompanyList_MeetingCO(companies));
	}
}

function setCompanyList_MeetingCO(companies){
	return {
		type: MeetingTypes.MEETING_SET_COMPANIES,
		companies
	}
}

export function getPositions(selectedCompany){
	return async (dispatch, getState) => {
		let sql = `select * from THF_MASTERDATA 
				   where CLASS1='HRPosition' and STATUS='Y' 
				   order by SORT;`
		let companies = await SQLite.selectData( sql, []).then((result) => {
			let items = [];
			for (let i in result.raw()) {
				items.push({
					index:result.raw()[i].SORT,
					label:result.raw()[i].CONTENT,
					lavel:result.raw()[i].CLASS3,
					value:[]
				})
			}
			return items;
		}).catch((err)=>{
			console.log(err);
			return [];
		});


		let user = getState().UserInfo.UserInfo;
		let action = "org/hr/meeting/getPosition";
        let actionObject = { co : selectedCompany }; //查詢使用
        
        // 取得該公司裡面的廠區
        let positionsPeople = await UpdateDataUtil.getCreateFormDetailFormat(user, action, actionObject).then((result)=>{
        	let keys = Object.keys(result);
        	if(keys.length == 0) return [];

        	let keysArray = [];
        	for(let key of keys){
        		if (result[key].length != 0) {
        			keysArray.push({
        				key:key,
        				value:result[key]
        			});
        		} 
        	}
			return keysArray;
        }).catch((err) => {
			console.log(err);
			return [];
        })
        
        let companyPositions = [];
        for(let company of companies){
        	for(let person of positionsPeople){
        		if (company.lavel == person.key) {
        			company.value = person.value;
        			companyPositions.push(company);
        		}
        	}
        }
		dispatch(setAttendees_by_position(companyPositions, selectedCompany));
	}
}

function setAttendees_by_position(companies, selectedCompany){
	return{
		type: MeetingTypes.MEETING_SET_ATTENDEES_BY_POSITION,
		companies,
		selectedCompany
	}
}

export function getOrg(value){
	return async (dispatch, getState) => {

		let user = getState().UserInfo.UserInfo;
		let action = "org/hr/meeting/getOrg";
        let actionObject = { 
			co  : value.companyValue,
			pzid: value.factoryValue
        }; //查詢使用
        
        // 取得該公司裡面的廠區
        let organization = await UpdateDataUtil.getCreateFormDetailFormat(user, action, actionObject).then((result)=>{
			return result;
        }).catch((err) => {
			console.log(err);
			return null;
        })

		dispatch(setOrganization_tree(organization));
	}
}

function setOrganization_tree(organization){
	return{
		type: MeetingTypes.MEETING_SET_ORGANIZATION,
		organization
	} 
}

export function attendeeItemOnPress(attendee){
	return async (dispatch, getState) => {
		
		let enableMeeting = await checkHaveMeetingTime(
			getState().Meeting.meetingOid,
			[{id:attendee.id}], 
			getState().Meeting.attendees_startDate, 
			getState().Meeting.attendees_endDate,
			getState().UserInfo.UserInfo
		);

		if (enableMeeting.length == 0) {
		  let attendees = addOrRemoveTag( attendee, getState);
		  dispatch({
		  	type     :MeetingTypes.MEETING_SET_ATTENDEES,
		  	attendees: attendees,
		  }); 
		} else {
		  let lang = getState().Language.lang.MeetingPage;
		  Alert.alert(
		    lang.alertMessage_duplicate, //"有重複"
		    `${lang.alertMessage_period} ${attendee.name} ${lang.alertMessage_meetingAlready}`,
		    [
		      { text: "OK", onPress: () => console.log("OK Pressed") }
		    ],
		    { cancelable: false }
		  );
		}
		
	}
}

async function checkHaveMeetingTime(meetingOid, id, startTime, endTime, user){
    let meetingParams = {
		startdate   : startTime,
		enddate     : endTime,
		attendees   : id,
		timezone    : RNLocalize.getTimeZone(),
		oid         : meetingOid
    }
    let searchMeetingResult = await UpdateDataUtil.searchMeeting(user, meetingParams).then((result)=>{
    	return result;
    }).catch((errorResult)=>{
      	console.log("errorResult",errorResult.message);
      	return [];
    });

    return searchMeetingResult;
}

function addOrRemoveTag( item, getState ){
	let attendees = getState().Meeting.attendees;
	let isAdded = false;

	for(let value of attendees){
	  if(item.id == value.id) isAdded = true; 
	}

	if (isAdded) {
	  let removeIndex = 0;
	  for(let i in attendees){
	    if(item.id == attendees[i].id) removeIndex = i;
	  }
	  attendees.splice(removeIndex, 1);
	} else {
	    attendees.push(item);
	}
	return attendees;
}

export function organizeCheckboxOnPress(checkItemAttendees){
	return async (dispatch, getState) => {
		dispatch({
			type: MeetingTypes.MEETING_BLOCKING,
			isblocking:true
		});

		// 將所有要新增的人員暫存起來
		// 先檢查是要新增還是刪除
		// 新增的話先搜尋有沒有在redux裡面了 然後檢查有無會議衝突
		// 刪除的話搜尋相同id然後刪除

		// let allOrgAttendees = await getAllOrgAttendees(checkItemAttendees);
		let allOrgAttendees = getAllOrgAttendees(checkItemAttendees);
		let reduxAttendees = getState().Meeting.attendees; //已經存在的

		// checkValue檢查看看有沒有全部人包含在裡面
		let included = false;  // 有沒有包含
		let checkValue = false; // 有沒有全部包含
		let selectedCount = 0;
		
		// 確認有沒有已經包含在裡面，用來顯示不同的勾勾顏色
		for(let positionAttendee of allOrgAttendees){
		  for(let propsAttendee of reduxAttendees){
		    if( positionAttendee.id == propsAttendee.id ){
		      included = true;
		      selectedCount++;
		      break;
		    }
		  }
		}
		checkValue = selectedCount == allOrgAttendees.length ? true: false;

		if (!included) {
			// 檢查有哪些人沒有在裡面
			let unInside = [];
			for(let checkItem of allOrgAttendees){
				for(let attendee of reduxAttendees){
					if(checkItem.id == attendee.id){
						break;
					}
				}
				unInside.push(checkItem);
			}

			// 將所有的集體送出檢查時間有無異常
			let enableMeeting = await checkHaveMeetingTime(
				getState().Meeting.meetingOid,
				unInside, 
				getState().Meeting.attendees_startDate, 
				getState().Meeting.attendees_endDate,
				getState().UserInfo.UserInfo
			);
			console.log("456789");

			if (enableMeeting.length == 0) {
				reduxAttendees = [...reduxAttendees, ...allOrgAttendees];
			} else {
				let unAbles = "";
				for(let i in enableMeeting){
					unAbles = i==0 ? unAbles+enableMeeting[i].name : unAbles+", "+enableMeeting[i].name
				}
				
  				let lang = getState().Language.lang.MeetingPage;
				Alert.alert(
					lang.alertMessage_duplicate, //"有重複"
					`${lang.alertMessage_period} ${unAbles} ${lang.alertMessage_meetingAlready}`,
					[
					  { text: "OK", onPress: () => console.log("OK Pressed") }
					],
					{ cancelable: false }
				);
			}

		} else {
			for(let checkItem of allOrgAttendees){
				for(let i in reduxAttendees){
					if(checkItem.id == reduxAttendees[i].id){
						reduxAttendees.splice(i, 1);
						break;
					}
				}
			}
		}

		dispatch({
			type: MeetingTypes.MEETING_BLOCKING,
			isblocking:false
		});

		dispatch({
			type     :MeetingTypes.MEETING_SET_ATTENDEES,
			attendees: reduxAttendees,
		}); 
	}
}

function getAllOrgAttendees(checkItemAttendees){
	let tempAttendees = [];
	if( checkItemAttendees.members !== null ){
		tempAttendees = tempAttendees.concat(checkItemAttendees.members)
	}

	if ( checkItemAttendees.subDep !== null ) {
		for(let subDep of checkItemAttendees.subDep){
			tempAttendees = tempAttendees.concat(getAllOrgAttendees(subDep));
		}
	}

	return tempAttendees;
}

export function positionCheckboxOnPress(checkValue, checkItemAttendees){
	return async (dispatch, getState) => {
		// 先檢查是要新增還是刪除
		// 新增的話先搜尋有沒有在裡面了 然後檢查有無會議衝突
		// 刪除的話搜尋相同id然後刪除
		let attendees = getState().Meeting.attendees; //已經存在的
		if (checkValue) {

			// 檢查有哪些人沒有在裡面
			let unInside = [];
			for(let checkItem of checkItemAttendees){
				for(let attendee of attendees){
					if(checkItem.id == attendee.id){
						break;
					}
				}
				unInside.push(checkItem);
			}

			// 將所有的集體送出檢查時間有無異常
			let enableMeeting = await checkHaveMeetingTime(
				getState().Meeting.meetingOid,
				unInside, 
				getState().Meeting.attendees_startDate, 
				getState().Meeting.attendees_endDate,
				getState().UserInfo.UserInfo
			);

			if (enableMeeting.length == 0) {
				attendees = [...attendees, ...checkItemAttendees];
			} else {
				let unAbles = "";
				for(let i in enableMeeting){
					unAbles = i==0 ? unAbles+enableMeeting[i].name : unAbles+", "+enableMeeting[i].name
				}
				
  				let lang = getState().Language.lang.MeetingPage;
				Alert.alert(
					lang.alertMessage_duplicate, //"有重複"
					`${lang.alertMessage_period} ${unAbles} ${lang.alertMessage_meetingAlready}`,
					[
					  { text: "OK", onPress: () => console.log("OK Pressed") }
					],
					{ cancelable: false }
				);
			}

		} else {
			for(let checkItem of checkItemAttendees){
				for(let i in attendees){
					if(checkItem.id == attendees[i].id){
						attendees.splice(i, 1);
						break;
					}
				}
			}
		}

		dispatch({
			type     :MeetingTypes.MEETING_SET_ATTENDEES,
			attendees: attendees,
		}); 
	}
}

export function attendeeItemCalendarOnPress(attendee){
	return async (dispatch, getState) => {
		NavigationService.navigate("MeetingTimeForPerson", {
		  person: attendee,
		});
	}
}

export function blocking(isblocking){
	return async (dispatch, getState) => {
		dispatch({
			type: MeetingTypes.MEETING_BLOCKING,
			isblocking
		});
	}
}