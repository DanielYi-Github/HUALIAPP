import React from 'react';
import { View, Keyboard, TouchableOpacity, Platform, Modal, Alert } from 'react-native';
import { Container, Header, Content, Item, Icon, Input, Text, Label, Button, ListItem, Spinner, Switch, Right, connectStyle} from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DateFormat from  'dateformat';
import TagInput   from 'react-native-tags-input';
import ActionSheet from 'react-native-actionsheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as RNLocalize from "react-native-localize";
import Moment from 'moment-timezone';

import HeaderForGeneral       from '../../../components/HeaderForGeneral';
import FormInputContent       from '../../../components/Form/FormInputContent';
import * as NavigationService from '../../../utils/NavigationService';
import * as MeetingAction     from '../../../redux/actions/MeetingAction';
import * as UpdateDataUtil    from '../../../utils/UpdateDataUtil';
import ToastUnit              from '../../../utils/ToastUnit';
import Common                 from '../../../utils/Common';

class MeetingInsertPage extends React.PureComponent  {
	constructor(props) {
	    super(props);

      let time1 = new Date();
      let time2 = new Date( DateFormat( time1, "yyyy-mm-dd HH:MM:ss").replace(/-/g, "/") );
      let isChangeTime = time1.getHours() == time2.getHours() ? false: true;

      let oid               = null;
      let isParams          = this.props.route.params ? true : false;
      let isEditable        = true;                                  //是不是在編輯中
      let headerName        = props.lang.MeetingPage.insertMeeting; 
      let isModify          = false;                                 //有沒有資格編輯
      let subject           = "";
      let description       = "";
      let startTime         = new Date().getTime();
      let endTime           = new Date().getTime();
      startTime             = startTime + (600000-(startTime%600000));
      endTime               = endTime + (600000-(endTime%600000)) + 3600000;
      let initiator         = { id : props.state.UserInfo.UserInfo.id };  //發起人
      let chairperson       = { id : props.state.UserInfo.UserInfo.id };  //主席
      let chairpersonLabel  = props.state.UserInfo.UserInfo.name;
      let attendees         = [];
      let meetingMode       = "A";
      let isOnlineAndPlace  = false;
      let meetingPlace      = "";
      let meetingPlaceName  = "";
      let meetingNumber     = "";
      let meetingPassword   = "";
      let remindtime        = 15;
      let now               = startTime;
      let isEndDateChange   = false;
      let isSearchedMeeting = true;                     // 有沒有找到此會議的訊息
      let timezone          = RNLocalize.getTimeZone(); 
      let showTimezone      = false;                    // 顯示時區資訊
      let regularMeetingEnable = true;                 // 例行性會議是否可行
      let repeatType           = props.state.Meeting.repeatType;
      let repeatEndDate        = props.state.Meeting.repeatEndDate;
      let weekDays             = props.state.Meeting.weekDays;
      let notified             = false;                 // 被通知會議
      let notifierNM           = "";                    // 通知人姓名

      // 判斷當前頁面,從哪個畫面來
      if (isParams) {
        let meetingParam = props.route.params.meeting;
        switch (props.route.params.fromPage) {
          case 'MeetingList': //從我的會議進來的
            // 會議發起人要是自己才可進行編輯
            oid              = meetingParam.oid;
            isEditable       = false;
            headerName       = isEditable ? props.lang.MeetingPage.modifyMeeting: props.lang.MeetingPage.seeMeetiog;
            isModify         = meetingParam.initiator.id == props.state.UserInfo.UserInfo.id ? true: false;;
            subject          = meetingParam.subject;
            description      = meetingParam.description;
            startTime        = meetingParam.datetime.startdate.replace(/-/g, "/");
            endTime          = meetingParam.datetime.enddate.replace(/-/g, "/");
            initiator        = meetingParam.initiator;
            chairperson      = meetingParam.chairperson;
            chairpersonLabel = meetingParam.chairperson.name;
            attendees        = this.dedup(meetingParam.attendees);
            meetingMode      = meetingParam.meetingMode;
            isOnlineAndPlace = meetingParam.place;
            meetingPlace     = meetingParam.meetingPlace ? meetingParam.meetingPlace : meetingPlace;
            meetingPlaceName = meetingParam.meetingPlaceName ? meetingParam.meetingPlaceName : meetingPlaceName;
            meetingNumber    = meetingParam.meetingNumber ? meetingParam.meetingNumber : meetingNumber;
            meetingPassword  = meetingParam.meetingPassword ? meetingParam.meetingPassword : meetingPassword;
            remindtime       = meetingParam.remindtime;
            timezone         = meetingParam.timezone;
            showTimezone     = true;
            regularMeetingEnable = false;
            repeatType       = meetingParam.repeatType;
            repeatEndDate    = meetingParam.repeatEndDate;
            weekDays         = meetingParam.weekDays;
            notified         = meetingParam.manager;
            notifierNM       = meetingParam.managers.join(",");
            break;
          case 'MeetingSearch': // 參與人員搜尋那邊過來的
            startTime = new Date( meetingParam.startdate.replace(/-/g, "/") ).getTime();
            startTime = isChangeTime ? startTime-28800000 : startTime;
            endTime   = new Date( meetingParam.enddate.replace(/-/g, "/") ).getTime();
            endTime   = isChangeTime ? endTime-28800000 : endTime;
            
            attendees = meetingParam.attendees;
            isEndDateChange = true;
            break;
          case "MessageFuc": // 消息那邊過來的
            isSearchedMeeting = false;
            for(let meeting of this.props.state.Meeting.meetingList){
              if (this.props.route.params.meetingParam.oid == meeting.oid) {
                meetingParam = meeting;
                isSearchedMeeting = true;
                break;
              }
            }
            
            if (isSearchedMeeting) {
              // 會議發起人要是自己才可進行編輯
              oid              = meetingParam.oid;
              isEditable       = false;
              isModify         = true;
              headerName       = isEditable ? props.lang.MeetingPage.modifyMeeting: props.lang.MeetingPage.seeMeetiog;
              isModify         = meetingParam.initiator.id == props.state.UserInfo.UserInfo.id ? true: false;;
              subject          = meetingParam.subject;
              description      = meetingParam.description;
              startTime        = meetingParam.datetime.startdate.replace(/-/g, "/");
              endTime          = meetingParam.datetime.enddate.replace(/-/g, "/");
              initiator        = meetingParam.initiator;
              chairperson      = meetingParam.chairperson;
              chairpersonLabel = meetingParam.chairperson.name;
              attendees        = meetingParam.attendees;
              meetingMode      = meetingParam.meetingMode;
              isOnlineAndPlace = meetingParam.place;
              meetingPlace     = meetingParam.meetingPlace ? meetingParam.meetingPlace : meetingPlace;
              meetingPlaceName = meetingParam.meetingPlaceName ? meetingParam.meetingPlaceName : meetingPlaceName;
              meetingNumber    = meetingParam.meetingNumber ? meetingParam.meetingNumber : meetingNumber;
              meetingPassword  = meetingParam.meetingPassword ? meetingParam.meetingPassword : meetingPassword;
              remindtime       = meetingParam.remindtime;
              timezone         = meetingParam.timezone;
              showTimezone     = true;
              regularMeetingEnable = false;
              repeatType       = meetingParam.repeatType;
              repeatEndDate    = meetingParam.repeatEndDate;
              weekDays         = meetingParam.weekDays;
              notified         = meetingParam.manager;
              notifierNM       = meetingParam.managers.join(",");

            } else {
              isSearchedMeeting = false;
            }
            break;
          default:
        }
      }

      startTime = isModify && isChangeTime ? new Date(startTime).getTime()-28800000: startTime;
      endTime = isModify && isChangeTime  ? new Date(endTime).getTime()-28800000: endTime;

	    this.state = {
        isChangeTime    :isChangeTime, //記錄部分機型會將時間直接+8小時
        oid             :oid,
        now             :now,
        isEditable      :isEditable, //預設只有發起人可以修改
        isModify        :isModify,   //是不是修改表單
        headerName      :headerName,
        isLoading       :false,
        subject         :subject,
        description     :description,
        startdate       :DateFormat( new Date(startTime), "yyyy-mm-dd HH:MM:ss"),
        enddate         :DateFormat( new Date(endTime), "yyyy-mm-dd HH:MM:ss"),
        meetingMode     :meetingMode,
        isOnlineAndPlace:isOnlineAndPlace,        // 線上與實體會議同時進行
        meetingPlace    :meetingPlace,
        meetingPlaceName:meetingPlaceName ,
        meetingNumber   :meetingNumber,
        meetingPassword :meetingPassword,
        remindtime      :remindtime,
        initiator       :initiator  ,  //發起人
        chairperson     :chairperson,  //主席
        chairpersonLabel:chairpersonLabel,
        attendees       :attendees,  //參與者
        isOnlineMeeting :meetingMode!=="A" ? true :false, //判斷是否是線上會議
        actionSheetType :"O",  //控制下拉式選單要出現哪種選項，O->選擇哪一種會議、M->會議前幾分鐘提醒
        remindtimeOptions:[
          {
            label:props.lang.MeetingPage.noAlert,
            value:0
          },{
            label:props.lang.MeetingPage.min5,
            value:5
          },{
            label:props.lang.MeetingPage.min15,
            value:15
          },{
            label:props.lang.MeetingPage.min30,
            value:30
          },{
            label:props.lang.MeetingPage.min60,
            value:60
          },{
            label:props.lang.MeetingPage.min1day,
            value:3600
          }
        ],
        showDatePicker        : false,
        showTimePicker        : false,
        showDateTimePicker    : false, // for ios
        editDatetimeValue     : new Date(),
        editStartorEndDatetime: true, // true for start, false for end
        isSearchedMeeting     : isSearchedMeeting,
        isEndDateChange       : isEndDateChange,
        isDelete              : false,  // 是否刪除表單
        timezone              : timezone,
        showTimezone          : showTimezone,
        regularMeetingEnable  : regularMeetingEnable,
        repeatType            : repeatType,
        repeatEndDate         : repeatEndDate,
        weekDays              : weekDays,
        notified              : notified,
        notifierNM            : notifierNM
      }
	}

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.state.Meeting.actionResult !== null) {
        if (nextProps.state.Meeting.actionResult.success) {
          if (this.state.isDelete) {
            ToastUnit.show('success', this.props.lang.MeetingPage.deleteMeetingSuccess);
          } else {
            ToastUnit.show('success', this.state.isModify ? this.props.lang.MeetingPage.modifyMeetingSuccess :this.props.lang.MeetingPage.insertMeetingSuccess);
          }
        } else {
          let actionResultMsg = "";
          let serverErrorString = nextProps.state.Meeting.actionResultMsg.indexOf('###');
          if (serverErrorString < 0) {
            actionResultMsg = nextProps.state.Meeting.actionResultMsg;
          } else {
            actionResultMsg = "伺服器調整中，請稍候再試。";
          }

          ToastUnit.show('error', actionResultMsg, false, this.props.actions.resetMeetingMessage);          
        }
    }
  }

  componentDidMount(){
    this.props.actions.setRegularMeetingOptionsDefaultValue();  //設定多語系值

    if (this.state.isSearchedMeeting) {
      this.props.actions.getMeetingModeType();  //獲取參會方式的選項
    } else {
      Alert.alert(
        this.props.lang.MeetingPage.meetingAlreadyDone,
        "",
        [
          {
            text: this.props.lang.Common.Close,   // 關閉 
            style: 'cancel',
            onPress: () => {
              NavigationService.goBack();
            }, 
          }
        ],
      )
      
    }
  }

	render() {
    //整理tags的資料格式
    let tagsArray = [];
    for(let value of this.state.attendees) {
     tagsArray.push(value.name); 
    }
    let tags = { tag: '', tagsArray: tagsArray }

    // 整理會議前提醒資料
    let remindtimeLabel = "";
    for(let remindtimeOption of this.state.remindtimeOptions){
      if (this.state.remindtime == remindtimeOption.value) {
        remindtimeLabel = remindtimeOption.label;
      }
    }

    // 整理例行性會議資料
    let regularMeetingLabel = "";
    for(let regularMeetingOptions of this.props.state.Meeting.regularMeetingOptions){
      if(  this.props.state.Meeting.regularMeetingDefaultOptions == regularMeetingOptions.value ){
        regularMeetingLabel = regularMeetingOptions.label;
      }
    }

    // 整理參會方式名稱
    let meetingPlaceName = "";
    for(let meetingModeTypes of this.props.state.Meeting.meetingModeTypes){
      if (this.state.meetingMode == meetingModeTypes.paramcode) {
        meetingPlaceName = meetingModeTypes.paramname;
      }
    }
    let startdate = new Date( this.state.startdate.replace(/-/g, "/") );
    let enddate = new Date( this.state.enddate.replace(/-/g, "/") );
    startdate = this.state.isChangeTime ? startdate-28800000 : startdate;
    enddate = this.state.isChangeTime ? enddate-28800000 : enddate;

    // 整理例行性會議的文字內容
    let selectedRepeatTypeLabel = this.props.lang.MeetingPage.repeatType[this.props.state.Meeting.selectedRepeatType];

    let nowTimeZone = RNLocalize.getTimeZone();
    let differentZone = this.state.timezone == nowTimeZone ? false : true;
    let timezone = nowTimeZone.split("/")[1];

    return (
      <Container>
        <HeaderForGeneral
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:"arrow-back"}}
          leftButtonOnPress     = {() =>NavigationService.goBack()} 
          isRightButtonIconShow = {false}
          rightButtonIcon       = {null}
          rightButtonOnPress    = {null} 
          title                 = {this.state.headerName}
          isTransparent         = {false}
        />
        <Content>
          {/* 被通知会议提示 */}
          { this.state.notified ?
              <Label style={{marginTop: 20, paddingLeft: 10, color: 'red'}}>
                {this.props.lang.MeetingPage.NotifiedTips.replace("xxx", this.state.notifierNM)}
              </Label>
            :
              null
          }

          {/*會議主題*/}
          <Item style={{ backgroundColor: this.props.style.InputFieldBackground, borderWidth: 0, paddingLeft: 10, marginTop: this.state.notified ? null: 20 }}>
              <Label>{this.props.lang.MeetingPage.meetingSubject}</Label>
              <Input 
                scrollEnabled ={false}
                textAlign     ="right"
                editable      ={this.state.isEditable}
                placeholder   ={this.state.isEditable ? null : this.state.subject}
                value         ={this.state.isEditable ? this.state.subject : null}
                onChangeText  ={(text)=>{ this.setState({ subject:text }); }}
              />
          </Item>

          <Item style={{ backgroundColor: this.props.style.InputFieldBackground, borderWidth: 0, paddingLeft: 10 }}>
              <Label>{this.props.lang.MeetingPage.meetingdescription}</Label>
              <Input 
                multiline 
                scrollEnabled ={false}
                textAlign     ="right"
                editable      ={this.state.isEditable}
                value         ={this.state.isEditable ? this.state.description : null}
                placeholder   ={this.state.isEditable ? null : this.state.description }
                onChangeText  ={(text)=>{ this.setState({ description:text }); }}
              />
          </Item>
          
          {/*時間*/}
          {
            this.state.showTimezone ? <Label style={{marginTop: 20, paddingLeft: 10}}>{this.props.lang.MeetingPage.yourTimezone} ( {timezone} {this.props.lang.MeetingPage.meetingTimezone} )</Label> : null
          }
           <Item style={{ backgroundColor: this.props.style.InputFieldBackground,  borderWidth: 0, flexDirection: 'row', marginTop: this.state.showTimezone ? null: 20 }}>
            <TouchableOpacity 
              style    ={{flex:1, flexDirection: 'column', padding: 10}}
              disabled ={!this.state.isEditable}
              onPress  ={()=>{ 
                this.showDateTimePicker(true); 
                Keyboard.dismiss();
              }}
            >
              <Text>{this.dateFormat(startdate)}</Text>
              <Text>{Moment( new Date(startdate) ).tz(RNLocalize.getTimeZone()).format("HH:mm")}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style    ={{flex:1, flexDirection: 'column', padding: 10}}
              disabled ={!this.state.isEditable}
              onPress  ={()=>{ 
                this.showDateTimePicker(false); 
                Keyboard.dismiss();
              }}
            >
              <Text>{this.dateFormat(enddate)}</Text>
              <Text>{Moment( new Date(enddate) ).tz(RNLocalize.getTimeZone()).format("HH:mm")}</Text>
            </TouchableOpacity>
          </Item>
          
          {/*會議主席*/}
          <Item 
            style={{
              backgroundColor: this.props.style.InputFieldBackground,
              height         : this.props.style.inputHeightBase,
              marginTop      : 20,
              paddingLeft    : 10,
              paddingRight   : 5,
              borderWidth    : 0
            }}
            disabled= {!this.state.isEditable}
            onPress = {()=>{
              NavigationService.navigate("MeetingInsertChairperson", {
                startdate: this.state.startdate,
                enddate  : this.state.enddate,
                onPress  : this.selectChairperson,
                oid      : this.state.oid
              });
            }}
          >
            <Icon name='person-outline' style={{color: this.props.style.textColor}}/>
            <Label style={{flex:1}}>{this.props.lang.MeetingPage.chairperson}</Label>
            {
              this.state.isEditable ? <Text>{this.state.chairpersonLabel}</Text> : <Label>{this.state.chairpersonLabel}</Label>
            }
            {
              this.state.isEditable ? <Icon name='arrow-forward' /> : null
            }
          </Item>

          {/*會議參與人*/}
          <Item style={{
            backgroundColor: this.props.style.InputFieldBackground,
            height         : tags.tagsArray.length == 0 ? this.props.style.inputHeightBase: null,
            paddingTop     : 10,
            paddingLeft    : 10,
            paddingRight   : 5,
            flexDirection  : 'column',
          }}>
            <View style={{ flexDirection: 'row',  width: '100%' }}>
              <Icon name='people-outline' style={{color: this.props.style.textColor}}/>
              <Label style={{alignSelf: 'center', flex:1}}>{this.props.lang.MeetingPage.attendeesInvite}</Label>
              {
                this.state.isEditable ? 
                  <Icon 
                    name    ="add-circle" 
                    type    ="MaterialIcons" 
                    style   ={{fontSize:30, color: '#20b11d'}}
                    onPress ={()=>{
                      NavigationService.navigate("MeetingInsertWithTags",{
                        attendees: this.deepClone(this.state.attendees),
                        startdate: this.state.startdate,
                        enddate  : this.state.enddate,
                        onPress  : this.selectAttendees,
                        oid      : this.state.oid
                      });
                    }}
                  />
                :
                  null
              }
            </View>
            <TagInput
              disabled            ={true}
              autoFocus           ={false}
              tags                ={tags}
              deleteIconStyles    ={this.state.isEditable ? null: {width: 0, height: 0}}
              containerStyle      ={{paddingLeft: 0, paddingRight: 0 }}
              inputContainerStyle ={{ height: 0 }}
              tagsViewStyle       ={{ marginTop: 0 }}
              tagStyle            ={{ backgroundColor:"#DDDDDD" }}
              tagTextStyle        ={{ color:"#666" }}
              updateState         ={(state)=>{  this.state.isEditable ? this.deleteTag(state) : null; }}
            />
          </Item>

          {/*參與方式*/}
          <Item 
            style={{
              backgroundColor: this.props.style.InputFieldBackground,
              height: this.props.style.inputHeightBase,
              paddingLeft: 10,
              paddingRight: 5,
              marginTop: 20,
            }}
            disabled={!this.state.isEditable}
            onPress = {()=>{
              this.setState({ actionSheetType:"O" });
              setTimeout( this.showActionSheet, 50);
            }}
          >
            <Icon name='meeting-room' type="MaterialIcons" style={{color: this.props.style.textColor}}/>
            <Label style={{flex:1}}>{this.props.lang.MeetingPage.meetingMode}</Label>
            {
              this.state.isEditable ? <Text>{meetingPlaceName}</Text> : <Label>{meetingPlaceName}</Label>
            }
            {
              this.state.isEditable ?  <Icon name='arrow-forward' /> : null
            }
          </Item>

          {/*顯示參會方式會議室資訊*/}
          { this.renderMeetingPlaceInfo() }
          
          {/*會議前提醒*/}
          <Item 
            style={{
              backgroundColor: this.props.style.InputFieldBackground,
              height         : this.props.style.inputHeightBase,
              paddingLeft    : 10,
              paddingRight   : 5,
              marginTop      : 20,
            }}
            disabled = {!this.state.isEditable}
            onPress  = {()=>{
              this.setState({ actionSheetType:"M" });
              setTimeout( this.showActionSheet, 50);
              Keyboard.dismiss();
            }}
          >
            <Icon name='clock-alert-outline' type="MaterialCommunityIcons" style={{color: this.props.style.textColor}}/>
            <Label style={{flex:1}}>{this.props.lang.MeetingPage.reminder}</Label>
            {
             this.state.isEditable ? <Text>{remindtimeLabel}</Text> : <Label>{remindtimeLabel}</Label>  
            }
            {
              this.state.isEditable ? <Icon name='arrow-forward' /> : null
            }
          </Item>

          {/*例行性會議*/}
          {/*
            this.state.regularMeetingEnable ? 
              <Item 
                style={{
                  backgroundColor: this.props.style.InputFieldBackground,
                  height         : this.props.style.inputHeightBase,
                  paddingLeft    : 10,
                  paddingRight   : 5,
                  marginTop      : 20,
                }}
                disabled = {!this.state.isEditable}
                onPress  = {()=>{
                  Keyboard.dismiss();
                  NavigationService.navigate("MeetingInsertWithRegular", {
                    startdate: this.state.startdate,
                    enddate  : this.state.enddate,
                    onPress  : "",
                    // oid      : this.state.oid
                  });
                }}
              >
                <Icon name='reload-circle-outline' />
                <Label style={{flex:1}}>{this.props.lang.MeetingPage.regularMeeting}</Label>
                {
                 this.state.isEditable ? <Text>{selectedRepeatTypeLabel}</Text> : <Label>{selectedRepeatTypeLabel}</Label>  
                }
                {
                  this.state.isEditable ? <Icon name='arrow-forward' /> : null
                }
              </Item>
            :
              null
          */}

          {/*顯示例行性會議的提示文字*/}
          { this.formatRegularMeetingAlertLabel() }

          {/*顯示會議的按鈕*/}
          { this.renderMeetingActionButton() }

        </Content>
        {this.renderActionSheet()}

        {/*選擇日期*/}
        {
          (this.state.showDatePicker) ? 
            <DateTimePicker 
              value       ={new Date(this.state.editDatetimeValue)}
              minimumDate ={new Date(this.state.now)}
              mode        ={"date"}
              is24Hour    ={true}
              display     ="default"
              onChange    ={this.setDate}
            />
          :
            null
        }
        {/*選擇時間*/}
        {
          (this.state.showTimePicker) ? 
            <DateTimePicker 
              value    ={new Date(this.state.editDatetimeValue)}
              mode     ={"time"}
              is24Hour ={true}
              display  ="spinner"
              onChange ={this.setTime}
              minuteInterval = {10}
            />
          :
            null
        }
        {/*選擇日期時間for ios*/}
        {
          this.state.showDateTimePicker ?
            <Modal animationType="fade" transparent={true} visible={this.state.showDateTimePicker} >
                <View style={{flex:1, backgroundColor:"rgba(0,0,0,.4)", flexDirection:"column", justifyContent:"flex-end"}}>
                  <View style={{backgroundColor:"white"}}>
                    <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                      <Button transparent onPress ={()=>{ 
                        this.setState({ 
                          showDateTimePicker:false, 
                          editDatetimeValue :null, 
                          isEndDateChange   :true
                        });
                      }}>
                        <Text style={{color: "black"}}>{this.props.state.Language.lang.Common.Cancel}</Text>
                      </Button>
                      <Button transparent onPress={this.setDatetime}>
                        <Text style={{color: "black"}}>{this.props.state.Language.lang.FormSign.Comfirm}</Text>
                      </Button>
                    </View>
                    <DateTimePicker 
                      mode     ={"datetime"}
                      value    ={this.state.editDatetimeValue}
                      minimumDate = {new Date(this.state.now)}
                      minuteInterval = {10}
                      is24Hour ={true}
                      display  ={"spinner"}
                      locale   ={this.props.state.Language.lang.LangStatus}
                      onChange ={this.setDatetime_ios}
                    />
                  </View>
                </View>
            </Modal>
          :
            null
        }

        {/*是否顯示loading 畫面*/}
        <Modal animationType="fade" transparent={true} visible={this.props.state.Meeting.isRefreshing} >
          <Container style={{justifyContent: 'center', alignItems: 'center', backgroundColor:this.props.style.SpinnerbackgroundColor}}>
            <Spinner color={this.props.style.SpinnerColor}/>
          </Container>
        </Modal>
      </Container>
    );
	}

  showDateTimePicker = (editStartorEndDatetime) => {
    let startdate = new Date( this.state.startdate.replace(/-/g, "/") ).getTime();
    let enddate = new Date( this.state.enddate.replace(/-/g, "/") ).getTime();

    if (this.state.isEndDateChange) {
    } else {
      // enddate = startdate + 3600000;
    }
    
    if (Platform.OS == "ios") {
      this.setState({
        editStartorEndDatetime: editStartorEndDatetime,
        editDatetimeValue: editStartorEndDatetime ? startdate: enddate,
        showDateTimePicker: true,
        isEndDateChange: editStartorEndDatetime ? false: true,
      });
    } else {
      this.setState({
        editStartorEndDatetime: editStartorEndDatetime,
        editDatetimeValue: editStartorEndDatetime ? startdate: enddate,
        showDatePicker: true,
        isEndDateChange: editStartorEndDatetime ? false: true,
      });
    }
  }

  setDatetime_ios = (event, date) => {
    this.setState({
      editDatetimeValue:date,
    });
  }

  setDate = (date) => {
    if (date.type == "set") {
      this.setState({
        editDatetimeValue:date.nativeEvent.timestamp,
        showDatePicker   :false,
        showTimePicker   :true,
      });
    }else{
      this.setState({
        showDatePicker:false
      });
    }
  }

  setTime = (time) => {
    if (time.type == "set") {
      if (this.state.editStartorEndDatetime) {
        //start
        if (this.state.isModify) {
          this.setState({
            startdate      :DateFormat( time.nativeEvent.timestamp, "yyyy-mm-dd HH:MM:ss"),
            showTimePicker    : false,
          });
        } else {
          // 編輯開始時間要自動幫結束時間增加一小時
          let enddate = time.nativeEvent.timestamp.getTime()+3600000;
          this.setState({
            startdate      :DateFormat( time.nativeEvent.timestamp, "yyyy-mm-dd HH:MM:ss"),
            enddate        :DateFormat( new Date(enddate), "yyyy-mm-dd HH:MM:ss"),
            showTimePicker    : false,
          });
        }
      } else {
        //end
        this.setState({
          enddate        :DateFormat( time.nativeEvent.timestamp, "yyyy-mm-dd HH:MM:ss"),
          showTimePicker    : false, 
        });
      }
    }else{
      this.setState({
        showTimePicker:false
      });
    }
  }
  
  setDatetime = () => {
    if (this.state.editStartorEndDatetime) {
      //start 
      let editDatetimeValue = this.state.editDatetimeValue-1000 >= this.state.now ? this.state.editDatetimeValue : this.state.now;

      // 查看是不是編輯模式，如果是，結束時間不作變動，如果不是，結束時間要變更
      if (this.state.isModify) {
        this.setState({
          startdate      :DateFormat( new Date(editDatetimeValue), "yyyy-mm-dd HH:MM:ss"),
          showDateTimePicker    : false, // for ios
        });
      } else {
        // 編輯開始時間要自動幫結束時間增加一小時
        let enddate = (new Date(editDatetimeValue)).getTime()+3600000;
        this.setState({
          startdate      :DateFormat( new Date(editDatetimeValue), "yyyy-mm-dd HH:MM:ss"),
          enddate        :DateFormat( new Date(enddate), "yyyy-mm-dd HH:MM:ss"),
          showDateTimePicker    : false, // for ios
        });
      }
    } else {
      //end
      let editDatetimeValue = this.state.editDatetimeValue;
      this.setState({
        enddate        :DateFormat( new Date(editDatetimeValue), "yyyy-mm-dd HH:MM:ss"),
        showDateTimePicker    : false, // for ios
      });
    }
  }

  dateFormat = (datetime) => {
    let datetimeString = "";
    switch (this.props.state.Language.langStatus) {
      case 'zh-TW':
      case 'zh-CN':
        datetimeString = DateFormat( new Date(datetime), "m月d日 ") + this.props.state.Language.lang.Common.week[DateFormat( new Date(datetime), "dddd")];
        break;
      case 'vi':
        datetimeString = DateFormat( new Date(datetime), "mm-dd ") + this.props.state.Language.lang.Common.week[DateFormat( new Date(datetime), "dddd")];
        break;
      default:
        datetimeString = DateFormat( new Date(datetime), "mmm dd dddd");
    }
    return datetimeString;
  }

  dateFormatWithoutWeek = (datetime) => {
    let datetimeString = "";
    switch (this.props.state.Language.langStatus) {
      case 'zh-TW':
      case 'zh-CN':
        datetimeString = DateFormat( new Date(datetime), "m月d日 ");
        break;
      case 'vi':
        datetimeString = DateFormat( new Date(datetime), "mm-dd ");
        break;
      default:
        datetimeString = DateFormat( new Date(datetime), "mmm dd dddd");
    }
    return datetimeString;
  }

  dateFormatWithoutMonthWeek = (datetime) => {
    let datetimeString = "";
    switch (this.props.state.Language.langStatus) {
      case 'zh-TW':
      case 'zh-CN':
        datetimeString = DateFormat( new Date(datetime), "d日 ");
        break;
      case 'vi':
      case 'en':
        datetimeString = DateFormat( new Date(datetime), "dS");
        break;
      default:
        datetimeString = DateFormat( new Date(datetime), "mmm dd dddd");
    }
    return datetimeString;
  }

  selectChairperson = (chairperson) => {
    this.setState({
      chairperson    :{ id: chairperson.id },  //主席
      chairpersonLabel:chairperson.name,
    });
  }

  selectAttendees = (attendees) => {
    this.setState({
      attendees:[...attendees]
    });
  }

  deleteTag = (state) => {
    let data = this.state.attendees;
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

    this.setState({
     attendees: [...data]
    });
  }

  showActionSheet = () => {
    this.ActionSheet.show();
  }

  renderActionSheet = () => { 

    let BUTTONS = [];
    let isShowDestructiveButton = false;
    let DestructiveButtonIndex = -1;
    switch (this.state.actionSheetType) {
      case 'O':
        for (let type of this.props.state.Meeting.meetingModeTypes) {
          BUTTONS.push(type.paramname);
        }
        // isShowDestructiveButton = true;
        DestructiveButtonIndex = BUTTONS.length-1;
        break;
      case 'M':
        for (let option of this.state.remindtimeOptions) {
          BUTTONS.push(option.label);
        }
        break;
    }
    BUTTONS.push(this.props.state.Language.lang.Common.Cancel);
    let CANCEL_INDEX = BUTTONS.length-1;

    return (
      <ActionSheet
      ref               ={o => this.ActionSheet = o}
      title             ={this.props.lang.MeetingPage.choose}
      options           ={BUTTONS}
      // destructiveButtonIndex = { isShowDestructiveButton ? DestructiveButtonIndex: null}
      cancelButtonIndex ={CANCEL_INDEX}
      onPress           ={(buttonIndex) => { 
          if (buttonIndex != CANCEL_INDEX) {
            this.nextActionSheetStep(this.state.actionSheetType, buttonIndex);
          }
        }}  
      />
    );
  }

  nextActionSheetStep = (actionSheetType, buttonIndex) => {
    switch (actionSheetType) {
      case 'O':
        if (this.props.state.Meeting.meetingModeTypes[buttonIndex].paramcode == "A") {
          // 顯示會議的實際地點
          this.setState({
            meetingMode    :this.props.state.Meeting.meetingModeTypes[buttonIndex].paramcode,
            meetingPlaceName:this.props.state.Meeting.meetingModeTypes[buttonIndex].paramname,
            isOnlineMeeting :false
          });
        } else {
          // 顯示線上會議的帳號與密碼
          this.setState({
            meetingMode     :this.props.state.Meeting.meetingModeTypes[buttonIndex].paramcode,
            meetingPlaceName:this.props.state.Meeting.meetingModeTypes[buttonIndex].paramname,
            isOnlineMeeting :true,
            meetingPlace    :"",
            meetingNumber   :"",
            meetingPassword :"",
          });
        }
        break;
      case 'M':
        this.setState({
          remindtime     :this.state.remindtimeOptions[buttonIndex].value,
          remindtimeLabel:this.state.remindtimeOptions[buttonIndex].label,
        });
        break;
    }
  }

  renderMeetingPlaceInfo = () => {
    let compontent = [];
    let isOnlineMeeting = this.state.isOnlineMeeting;

    if (this.state.isOnlineMeeting) {
      let setStateFunction1, setStateFunction2;

      switch (this.state.meetingMode) {
        case 'Z': // ZOOM
          setStateFunction1 = (text)=>{ this.setState({ meetingNumber:text }); }
          compontent.push(
            this.renderMeetingPlaceInfoItem( this.props.lang.MeetingPage.meetingNumber, this.state.isEditable, this.state.meetingNumber, setStateFunction1 )
          );
          setStateFunction2 = (text)=>{ this.setState({ meetingPassword:text }); }
          compontent.push(
            this.renderMeetingPlaceInfoItem( this.props.lang.MeetingPage.meetingPassword, this.state.isEditable, this.state.meetingPassword, setStateFunction2 )
          );
          break;
        case 'S': // SKYPE
          setStateFunction1 = (text)=>{ this.setState({ meetingNumber:text }); }
          compontent.push(
            this.renderMeetingPlaceInfoItem( this.props.lang.MeetingPage.meetingPlaceInfo, this.state.isEditable, this.state.meetingNumber, setStateFunction1 )
          );
          break;
        case 'W': // WeChat
          setStateFunction1 = (text)=>{ this.setState({ meetingNumber:text }); }
          compontent.push(
            this.renderMeetingPlaceInfoItem( this.props.lang.MeetingPage.meetingPlaceInfo, this.state.isEditable, this.state.meetingNumber, setStateFunction1 )
          );
          break;
        case 'T': // Tencent
          setStateFunction1 = (text)=>{ this.setState({ meetingNumber:text }); }
          compontent.push(
            this.renderMeetingPlaceInfoItem( this.props.lang.MeetingPage.meetingNumber, this.state.isEditable, this.state.meetingNumber, setStateFunction1 )
          );
          setStateFunction2 = (text)=>{ this.setState({ meetingPassword:text }); }
          compontent.push(
            this.renderMeetingPlaceInfoItem( this.props.lang.MeetingPage.meetingPassword, this.state.isEditable, this.state.meetingPassword, setStateFunction2 )
          );
          break;
        case 'M': // Team
          setStateFunction1 = (text)=>{ this.setState({ meetingNumber:text }); }
          compontent.push(
            this.renderMeetingPlaceInfoItem( this.props.lang.MeetingPage.meetingPlaceLink, this.state.isEditable, this.state.meetingNumber, setStateFunction1 )
          );
          break;
        case 'D': // 釘釘
          setStateFunction1 = (text)=>{ this.setState({ meetingNumber:text }); }
          compontent.push(
            this.renderMeetingPlaceInfoItem( this.props.lang.MeetingPage.meetingPlaceNO, this.state.isEditable, this.state.meetingNumber, setStateFunction1 )
          );
          break;
      }

      compontent.push(
        <Item 
          style={{
            backgroundColor: this.props.style.InputFieldBackground,
            height: this.props.style.inputHeightBase,
            paddingLeft: 10,
            paddingRight: 15,
          }}
        >
          <Label>{this.props.lang.MeetingPage.isShowPhysicalmeetingPlace}</Label>
          <Right>
          <Switch 
            disabled={!this.state.isEditable}
            value    = {this.state.isOnlineAndPlace} 
            onChange = {()=>{this.setState({isOnlineAndPlace:!this.state.isOnlineAndPlace})}}
          />
          </Right>
        </Item>
      );

      if (this.state.isOnlineAndPlace) {
        let setStateFunction = (text)=>{ this.setState({ meetingPlace:text }); }
        compontent.push(
          this.renderMeetingPlaceInfoItem(
            this.props.lang.MeetingPage.meetingPlace,
            this.state.isEditable,
            this.state.meetingPlace,
            setStateFunction
          )
        );
      }
    } else {
      let setStateFunction = (text)=>{ this.setState({ meetingPlace:text }); }
      compontent.push(
        this.renderMeetingPlaceInfoItem(
          this.props.lang.MeetingPage.meetingPlace,
          this.state.isEditable,
          this.state.meetingPlace,
          setStateFunction
        )
      );
    }

    return compontent;
  }

  renderMeetingPlaceInfoItem = (label, isEditable, value, setStateFunction) => {
    return (
      <Item 
        style={{
          backgroundColor: this.props.style.InputFieldBackground,
          height: this.props.style.inputHeightBase,
          paddingLeft: 10,
          paddingRight: 5,
        }}
      >
        <Label>{label}</Label>
        <Input 
          scrollEnabled = {false}
          textAlign     = "right"
          editable      = {isEditable}
          value         = {isEditable ? value : null}
          placeholder   = {isEditable ? null : value }
          onChangeText  = {setStateFunction}
        />
      </Item>
    );
  }

  renderMeetingActionButton = () => {
    let button = null;

    if (this.state.isModify) {
      if (this.state.isEditable) {
        this.setState({
          headerName:this.props.lang.MeetingPage.modifyMeeting
        });
        button = [];
        button.push(
          <Button info style={{ alignSelf: 'center', marginTop: 40, marginBottom: 40, width: '60%', justifyContent: 'center' }}
            onPress={()=>{ this.addMeeting(); }}
          >
            <Text>{this.props.state.Language.lang.FormSign.Comfirm}</Text>
          </Button>
        );
        button.push(
          <Button danger style={{ alignSelf: 'center', marginTop: -20, marginBottom: 40, width: '60%', justifyContent: 'center' }}
            onPress={()=>{ this.cancelMeeting(); }}
          >
            <Text>{this.props.lang.MeetingPage.deleteMeeting}</Text>
          </Button>
        );
      } else {
        button = (
          <Button info style={{ alignSelf: 'center', marginTop: 40, marginBottom: 40, width: '60%', justifyContent: 'center' }}
            onPress={()=>{
              this.setState({
                isEditable: true
              });
            }}
          >
            <Text>{this.props.lang.MeetingPage.modifyMeeting}</Text>
          </Button>
        );
      }

    } else {
      if (this.state.isEditable) {
        button = (
          <Button info style={{ alignSelf: 'center', marginTop: 40, marginBottom: 40, width: '60%', justifyContent: 'center' }}
            onPress={()=>{ this.addMeeting(); }}
          >
            <Text>{this.props.state.Language.lang.FormSign.Comfirm}</Text>
          </Button>
        );
      }
    }

    return button;
  }

  formatRegularMeetingAlertLabel = () => {
    let regularMeetingAlertLabel = "";
    let reduxMeeting = this.props.state.Meeting;
    let langMeeting = this.props.state.Language.lang.MeetingPage;

    if( 
      this.state.regularMeetingEnable && 
      this.props.state.Meeting.selectedRepeatType != "NR" && 
      reduxMeeting.repeatEndDate !== ""
    ){
      
      let label1, label2, label3, label4, label5, label6;
      regularMeetingAlertLabel = `${langMeeting.repeatType[reduxMeeting.selectedRepeatType]}`;

      switch (reduxMeeting.selectedRepeatType) {
        case 'ED':
          label1 = langMeeting.repeatType[reduxMeeting.selectedRepeatType];
          label2 = Moment( new Date(this.state.startdate) ).tz(RNLocalize.getTimeZone()).format("HH:mm");
          label3 = Moment( new Date(this.state.enddate) ).tz(RNLocalize.getTimeZone()).format("HH:mm");
          label4 = DateFormat(reduxMeeting.repeatEndDate, "yyyy")+"年 "+this.dateFormatWithoutWeek(reduxMeeting.repeatEndDate);

          if(this.props.state.Language.langStatus == "en"){
            regularMeetingAlertLabel = `The meeting will be scheduled ${label2}-${label3} everyday, end on ${DateFormat(reduxMeeting.repeatEndDate, "mmmm dS, yyyy")}.`;
          }else{
            regularMeetingAlertLabel = `${langMeeting.regularMsg1}${label1}${langMeeting.regularMsg2} ${label2} ${langMeeting.regularMsg3} ${label3} ${langMeeting.regularMsg4} ${label4}${langMeeting.regularMsg5}`;
          }
          break;
        case 'EW':
          label1 = langMeeting.repeatType[reduxMeeting.selectedRepeatType];
          label2 = this.props.state.Language.lang.Common.week[DateFormat( new Date(this.state.startdate), "dddd")];
          label3 = Moment( new Date(this.state.startdate) ).tz(RNLocalize.getTimeZone()).format("HH:mm");
          label4 = this.props.state.Language.lang.Common.week[DateFormat( new Date(this.state.enddate), "dddd")];
          label5 = Moment( new Date(this.state.enddate) ).tz(RNLocalize.getTimeZone()).format("HH:mm");
          label6 = this.dateFormatWithoutWeek(reduxMeeting.repeatEndDate);

          if(this.props.state.Language.langStatus == "en"){
            regularMeetingAlertLabel = `The meeting will be scheduled from ${DateFormat(new Date(this.state.startdate),"HH:MM, ddd")} to ${DateFormat(new Date(this.state.enddate),"HH:MM, ddd")} every week, end on ${DateFormat(reduxMeeting.repeatEndDate, "mmmm dS, yyyy")}.`;
          }else{
            regularMeetingAlertLabel = `${langMeeting.regularMsg1}${label1}${langMeeting.regularMsg2} ${label2}${label3} ${langMeeting.regularMsg3} ${label4}${label5} ${langMeeting.regularMsg4} ${label6}${langMeeting.regularMsg5}`;
          }

          break;
        case 'EM':
          label1 = `${langMeeting.repeatType[reduxMeeting.selectedRepeatType]}`;
          label2 = this.dateFormatWithoutMonthWeek(new Date(this.state.startdate));
          label3 = Moment( new Date(this.state.startdate) ).tz(RNLocalize.getTimeZone()).format("HH:mm");
          label4 = this.dateFormatWithoutMonthWeek(new Date(this.state.enddate));
          label5 = Moment( new Date(this.state.enddate) ).tz(RNLocalize.getTimeZone()).format("HH:mm");
          label6 = this.dateFormatWithoutWeek(reduxMeeting.repeatEndDate);

          if(this.props.state.Language.langStatus == "en"){
            regularMeetingAlertLabel = `The meeting will be scheduled from ${DateFormat(new Date(this.state.startdate),"HH:MM, dS")} to ${DateFormat(new Date(this.state.enddate),"HH:MM, dS")} every month, end on ${DateFormat(reduxMeeting.repeatEndDate, "mmmm dS, yyyy")}.`;
          } else {
            regularMeetingAlertLabel = `${langMeeting.regularMsg1}${label1}${langMeeting.regularMsg2} ${label2}${label3} ${langMeeting.regularMsg3} ${label4}${label5} ${langMeeting.regularMsg4} ${label6}${langMeeting.regularMsg5}`;
          }

          break;
        case 'DM':
          label1 = [];
          for (const [key, value] of Object.entries(langMeeting.weekDays)) {
            for(let day of reduxMeeting.selectedWeekDays){
              if(day == key) label1.push(value);
            }
          }

          label2 = Moment( new Date(this.state.startdate) ).tz(RNLocalize.getTimeZone()).format("HH:mm");
          label3 = Moment( new Date(this.state.enddate) ).tz(RNLocalize.getTimeZone()).format("HH:mm");
          label4 = this.dateFormatWithoutWeek(reduxMeeting.repeatEndDate);
          
          if(this.props.state.Language.langStatus == "en"){
            regularMeetingAlertLabel = `The meeting will be scheduled ${label2}-${label3}, ${label1} every week, end on ${DateFormat(reduxMeeting.repeatEndDate, "mmmm dS, yyyy")}.`;
          } else {
            regularMeetingAlertLabel = `${langMeeting.regularMsg1}${langMeeting.repeatType.EW} ${langMeeting.regularMsg2}${label1} ${label2} ${langMeeting.regularMsg3} ${label3} ${langMeeting.regularMsg4} ${label4}${langMeeting.regularMsg5}`;
          }

          break;
      }

      return <Label style={{margin: 15}}>{regularMeetingAlertLabel}</Label>

    } else {
      return null;
    }
  }

  addMeeting = async () =>{
    // subject
    // description
    // attendees
    // meetingMode
    // meetingPlace
    if (this.isEmptyString(this.state.subject)) {
      Alert.alert(
        this.props.lang.Common.Error,   
        this.props.lang.MeetingPage.meetingSubjectRequire, //`會議主題必須填寫`
        [{
            text: this.props.state.Language.lang.Common.Close,   // 關閉 
            onPress: () => { }, 
        }],
      )
    } else if ( new Date(this.state.startdate.replace(/-/g, "/")).getTime() < new Date().getTime() ) {
      Alert.alert(
        this.props.lang.Common.Error,   // 表單動作失敗
        this.props.lang.MeetingPage.alertMessage_earlierNow, //`會議開始時間不能\"早於\"現在時間`
        [{
            text: this.props.state.Language.lang.Common.Close,   // 關閉 
            onPress: () => { }, 
        }],
      )
    } else if( new Date(this.state.enddate.replace(/-/g, "/")).getTime() == new Date(this.state.startdate.replace(/-/g, "/")).getTime() ) {
      Alert.alert(
        this.props.lang.Common.Error,   // 表單動作失敗
        this.props.lang.MeetingPage.alertMessage_equal, //`會議結束時間不能\"等於\"開始時間`
        [{
            text: this.props.state.Language.lang.Common.Close,   // 關閉 
            onPress: () => {}, 
        }],
      )
    } else if (new Date(this.state.enddate.replace(/-/g, "/")) < new Date(this.state.startdate.replace(/-/g, "/"))) {
      Alert.alert(
        this.props.lang.Common.Error,   // 表單動作失敗
        this.props.lang.MeetingPage.alertMessage_earlier, //`會議結束時間不能\"早於\"開始時間`
        [{
            text: this.props.state.Language.lang.Common.Close,   // 關閉 
            onPress: () => { }, 
        }],
      )
    }  else if (this.state.meetingMode == "A" && this.isEmptyString(this.state.meetingPlace)) {
      Alert.alert(
       this.props.lang.Common.Error,   // 表單動作失敗
       this.props.lang.MeetingPage.meetingPlaceRequire, //`會議室地點必須填寫`
        [{
            text: this.props.state.Language.lang.Common.Close,   // 關閉 
            onPress: () => { }, 
        }],
      )
    } else {
      this.props.actions.setRefreshing(true);

      let startdate;
      if (this.state.isChangeTime) {
        startdate = new Date(this.state.startdate.replace(/-/g, "/")).getTime()+1000-28800000;
      } else {
        startdate = new Date(this.state.startdate.replace(/-/g, "/")).getTime()+1000;
      }
      startdate = DateFormat( startdate, "yyyy-mm-dd HH:MM:ss");

      // 先檢測與會人員時間有無重複 沒有重複為true 有重複為false 
      let enableMeeting = await this.checkHaveMeetingTime(this.state.attendees, startdate, this.state.enddate);
      if(enableMeeting.result) {
        
        let meetingParams = {
            subject        :this.state.subject,
            description    :this.state.description,
            startdate      :startdate,
            enddate        :this.state.enddate,
            meetingMode    :this.state.meetingMode,
            meetingPlace   :this.state.meetingPlace,
            place          :this.state.isOnlineAndPlace,
            meetingNumber  :this.state.meetingNumber,
            meetingPassword:this.state.meetingPassword,
            remindtime     :this.state.remindtime,
            initiator      :this.state.initiator,
            chairperson    :this.state.chairperson,
            attendees      :this.state.attendees,
            timezone       :RNLocalize.getTimeZone(),
        }

        if (this.state.regularMeetingEnable) {
          // 先檢測有沒有啟用例行性會議，如果有要確認有沒有設定結束時間，如果沒有設定自動幫他加入過去一年
          let repeatEndDate = this.props.state.Meeting.repeatEndDate;
          if(this.props.state.Meeting.selectedRepeatType != 'NR' && repeatEndDate == ""){
            var d1 = new Date();
            var d2 = new Date(d1);
            d2.setFullYear(d2.getFullYear()+1);
            d2.setDate(d2.getDate()-1);
            repeatEndDate = DateFormat( d2, "yyyy-mm-dd");
          }

          meetingParams.repeatType = this.props.state.Meeting.selectedRepeatType;
          meetingParams.repeatEndDate = repeatEndDate;
          meetingParams.weekDays = this.props.state.Meeting.selectedWeekDays 
        }
        
        if (this.state.isModify) {
          // 修改會議
          meetingParams.oid = this.state.oid;
          this.props.actions.modifyMeeting(meetingParams);
        } else {
          // 新增會議
          this.props.actions.addMeeting(meetingParams);
        }
      } else {

        let actions = this.props.actions;
        Alert.alert(
         this.props.lang.Common.Error,   // 表單動作失敗
         enableMeeting.message, //`與會人員此段時間已安排其他會議`
          [{
              text: this.props.state.Language.lang.Common.Close,   // 關閉 
              onPress: () => {
                actions.setRefreshing(false);
              }, 
          }],
        )
      }
    }    
  }

  dedup(arr) {
    var hashTable = {};

    return arr.filter(function (el) {
      var key = JSON.stringify(el);
      var match = Boolean(hashTable[key]);

      return (match ? false : hashTable[key] = true);
    });
  }

  cancelMeeting = () => {
    Alert.alert(
      this.props.lang.MeetingPage.alert, // "提醒！"
      this.props.lang.MeetingPage.deleteConfirm, //"確定刪除此會議" 
      [
        {
          text: this.props.lang.Common.Cancel, //"取消"
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: this.props.lang.Common.Comfirm, onPress: () => {
          this.setState({isDelete:true});
          this.props.actions.cancelMeeting(this.state.oid);
        }}
      ]
    );
  }

  isEmptyString = (string) => {
    string = string.replace(/\r\n/g,"");
    string = string.replace(/\n/g,"");
    string = string.replace(/\s/g,"");
    return string.length == 0 ? true : false;
  }

  // deep clone
  deepClone(src) {
    return JSON.parse(JSON.stringify(src));
  }

  componentWillUnmount(){
    this.props.actions.resetMeetingRedux();
  }

  checkHaveMeetingTime = async (ids, startTime, endTime) => {
    let user = this.props.state.UserInfo.UserInfo;
    let meetingParams = {
      startdate: startTime,
      enddate  : endTime,
      attendees: [this.state.chairperson, ...ids],
      timezone : RNLocalize.getTimeZone(),
      oid      : this.state.oid
    }
    let searchMeetingResult = await UpdateDataUtil.searchMeeting(user, meetingParams).then((result)=>{
      if (result.length == 0) {
        return {
          result: true,
        };
      } else {
        let unableAttendees = [];
        for(let item of result){
          if(unableAttendees.length == 0){
            unableAttendees.push(item.name);

          }else{
            let isAdd = true;
            for(let unable of unableAttendees){
              if(item.name == unable){
                isAdd = false;
                break;
              }
            }

            if(isAdd){
              unableAttendees.push(item.name);
            }

          }
        }

        return {
          result: false,
          message: unableAttendees.toString()+this.props.lang.MeetingPage.alertMessage_meetingAttendeesAlready
        };
      }
    }).catch((errorResult)=>{
      console.log("errorResult",errorResult.message);
      return {
          result: false,
          message: "系統維護中，請收到再試" 
      };
    });

    return searchMeetingResult;
  }
}

let MeetingInsertPageStyle = connectStyle( 'Page.MeetingPage', {} )(MeetingInsertPage);
export default connect(
  (state) => ({
    state: { ...state },
    lang: { ...state.Language.lang }
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...MeetingAction
    }, dispatch)
  })
)(MeetingInsertPageStyle);
