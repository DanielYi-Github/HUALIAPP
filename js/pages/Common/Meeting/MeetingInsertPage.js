import React from 'react';
import { View, Keyboard, TouchableOpacity, Platform, Modal, Alert } from 'react-native';
import { Container, Header, Content, Item, Icon, Input, Text, Label, Button, ListItem, Spinner, connectStyle} from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DateFormat from  'dateformat';
import TagInput   from 'react-native-tags-input';
import ActionSheet from 'react-native-actionsheet';
import DateTimePicker from '@react-native-community/datetimepicker';

import HeaderForGeneral       from '../../../components/HeaderForGeneral';
import FormInputContent       from '../../../components/Form/FormInputContent';
import * as NavigationService from '../../../utils/NavigationService';
import * as MeetingAction     from '../../../redux/actions/MeetingAction';
import ToastUnit              from '../../../utils/ToastUnit';

class MeetingInsertPage extends React.PureComponent  {
	constructor(props) {
	    super(props);
      let oid              = "";
      let isParams         = this.props.route.params ? true : false;
      let isEditable       = true;
      let headerName       = "新增會議";
      let isModify         = false;
      let subject          = "";
      let description      = "";
      let startTime        = new Date().getTime();
      let endTime          = new Date().getTime();
      startTime            = startTime + (600000-(startTime%600000));
      endTime              = endTime + (600000-(endTime%600000));
      let initiator        = { id : props.state.UserInfo.UserInfo.id };  //發起人
      let chairperson      = { id : props.state.UserInfo.UserInfo.id };  //主席
      let chairpersonLabel = props.state.UserInfo.UserInfo.name;
      let attendees        = [];
      let meetingMode      = "A";
      let meetingPlace     = "";
      let meetingPlaceName = "";
      let meetingNumber    = "";
      let meetingPassword  = "";
      let remindtime       = 15;
      let now              = startTime;
      let isSearchedMeeting = true;    // 有沒有找到此會議的訊息


      // 判斷當前頁面,從哪個畫面來
      if (isParams) {
        let meetingParam = props.route.params.meeting;
        switch (props.route.params.fromPage) {
          case 'MeetingList': //從我的會議進來的
            // 會議發起人要是自己才可進行編輯
            oid              = meetingParam.oid;
            isEditable       = false;
            headerName       = isEditable ? "修改會議": "查看會議";
            isModify         = meetingParam.initiator.id == props.state.UserInfo.UserInfo.id ? true: false;;
            subject          = meetingParam.subject;
            description      = meetingParam.description;
            startTime        = `${meetingParam.datetime.date} ${meetingParam.datetime.starttime}`.replace(' ', 'T');
            endTime          = `${meetingParam.datetime.date} ${meetingParam.datetime.endtime}`.replace(' ', 'T');
            initiator        = meetingParam.initiator;
            chairperson      = meetingParam.chairperson;
            chairpersonLabel = meetingParam.chairperson.name;
            attendees        = meetingParam.attendees;
            meetingMode      = meetingParam.meetingMode;
            meetingPlace     = meetingParam.meetingPlace ? meetingParam.meetingPlace : meetingPlace;
            meetingPlaceName = meetingParam.meetingPlaceName ? meetingParam.meetingPlaceName : meetingPlaceName;
            meetingNumber    = meetingParam.meetingNumber ? meetingParam.meetingNumber : meetingNumber;
            meetingPassword  = meetingParam.meetingPassword ? meetingParam.meetingPassword : meetingPassword;
            remindtime       = meetingParam.min;
            break;
          case 'MeetingSearch': // 參與人員搜尋那邊過來的
            now              = meetingParam.startdate.replace(' ', 'T');;
            startTime        = meetingParam.startdate.replace(' ', 'T');;
            endTime          = meetingParam.enddate.replace(' ', 'T');;
            attendees        = meetingParam.attendees;
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
              headerName       = isEditable ? "修改會議": "查看會議";
              isModify         = meetingParam.initiator.id == props.state.UserInfo.UserInfo.id ? true: false;;
              subject          = meetingParam.subject;
              description      = meetingParam.description;
              startTime        = `${meetingParam.datetime.date} ${meetingParam.datetime.starttime}`.replace(' ', 'T');
              endTime          = `${meetingParam.datetime.date} ${meetingParam.datetime.endtime}`.replace(' ', 'T');
              initiator        = meetingParam.initiator;
              chairperson      = meetingParam.chairperson;
              chairpersonLabel = meetingParam.chairperson.name;
              attendees        = meetingParam.attendees;
              meetingMode      = meetingParam.meetingMode;
              meetingPlace     = meetingParam.meetingPlace ? meetingParam.meetingPlace : meetingPlace;
              meetingPlaceName = meetingParam.meetingPlaceName ? meetingParam.meetingPlaceName : meetingPlaceName;
              meetingNumber    = meetingParam.meetingNumber ? meetingParam.meetingNumber : meetingNumber;
              meetingPassword  = meetingParam.meetingPassword ? meetingParam.meetingPassword : meetingPassword;
              remindtime       = meetingParam.min;
            } else {
              isSearchedMeeting = false;
            }
            break;
          default:
            // console.log(`Sorry, we are out of ${expr}.`);
        }
      }

	    this.state = {
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
            label:"無提醒",
            value:0
          },{
            label:"5分鐘前",
            value:5
          },{
            label:"15分鐘前",
            value:15
          },{
            label:"30分鐘前",
            value:30
          },{
            label:"一小時前",
            value:60
          },{
            label:"一天前",
            value:3600
          }
        ],
        showDatePicker        : false,
        showTimePicker        : false,
        showDateTimePicker    : false, // for ios
        editDatetimeValue     : new Date(),
        editStartorEndDatetime: true, // true for start, false for end
        isSearchedMeeting: isSearchedMeeting 
      }
	}

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.state.Meeting.actionResult !== null) {
        if (nextProps.state.Meeting.actionResult.success) {
          ToastUnit.show('success', this.state.isModify ?"修改會議成功" :"新增會議成功");
          this.props.actions.resetMeetingRedux();
          NavigationService.goBack();
        } else {
          ToastUnit.show('error', nextProps.state.Meeting.actionResultMsg);          
        }
    }
  }

  componentDidMount(){
    if (this.state.isSearchedMeeting) {
      this.props.actions.getMeetingModeType();  //獲取參會方式的選項
    } else {

      Alert.alert(
        "此會議已結束",
        "",
        [
          {
            text: this.props.state.Language.lang.Common.Close,   // 關閉 
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
    console.log(this.state.startdate, Platform.OS);

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

    // 整理參會方式名稱
    let meetingPlaceName = "";
    for(let meetingModeTypes of this.props.state.Meeting.meetingModeTypes){
      if (this.state.meetingMode == meetingModeTypes.paramcode) {
        meetingPlaceName = meetingModeTypes.paramname;
      }
    }

    let startdate = new Date( this.state.startdate.replace(' ', 'T') );
    let enddate = new Date( this.state.enddate.replace(' ', 'T') );
    console.log(startdate, enddate);
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
          {/*會議主題*/}
          <Item style={{ backgroundColor: this.props.style.InputFieldBackground, marginTop: 30, borderWidth: 0, paddingLeft: 10 }}>
              <Label>會議主題</Label>
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
              <Label>說明</Label>
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
           <Item style={{ backgroundColor: this.props.style.InputFieldBackground, marginTop: 30, borderWidth: 0, flexDirection: 'row' }}>
            <TouchableOpacity 
              style    ={{flex:1, flexDirection: 'column', padding: 10}}
              disabled ={!this.state.isEditable}
              onPress  ={()=>{ this.showDateTimePicker(true); }}
            >
              <Text>{this.dateFormat(startdate)}</Text>
              <Text>{DateFormat( startdate, "HH:MM")}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style    ={{flex:1, flexDirection: 'column', padding: 10}}
              disabled ={!this.state.isEditable}
              onPress  ={()=>{ this.showDateTimePicker(false); }}
            >
              <Text>{this.dateFormat(enddate)}</Text>
              <Text>{DateFormat( enddate, "HH:MM")}</Text>
            </TouchableOpacity>
          </Item>
          
          {/*會議主席*/}
          <Item 
            style={{
              backgroundColor: this.props.style.InputFieldBackground,
              height         : this.props.style.inputHeightBase,
              marginTop      : 30,
              paddingLeft    : 10,
              paddingRight   : 5,
              borderWidth    : 0
            }}
            disabled= {!this.state.isEditable}
            onPress = {()=>{
              NavigationService.navigate("MeetingInsertChairperson", {
                startdate: this.state.startdate,
                enddate  : this.state.enddate,
                onPress  : this.selectChairperson
              });
            }}
          >
            <Icon name='person-outline' />
            <Label style={{flex:1}}>會議主席</Label>
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
              <Icon name='people-outline' />
              <Label style={{alignSelf: 'center', flex:1}}>{"邀請與會人員"}</Label>
              {
                this.state.isEditable ? 
                  <Icon 
                    name    ="add-circle" 
                    type    ="MaterialIcons" 
                    style   ={{fontSize:30, color: '#20b11d'}}
                    onPress ={()=>{
                      NavigationService.navigate("MeetingInsertWithTags",{
                        attendees: this.state.attendees,
                        startdate: this.state.startdate,
                        enddate  : this.state.enddate,
                        onPress  : this.selectAttendees,
                      });
                    }}
                  />
                :
                  null
              }
            </View>
            <TagInput
              disabled            ={false}
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
              marginTop: 30,
            }}
            disabled={!this.state.isEditable}
            onPress = {()=>{
              this.setState({ actionSheetType:"O" });
              setTimeout( this.showActionSheet, 50);
            }}
          >
            <Icon name='meeting-room' type="MaterialIcons"/>
            <Label style={{flex:1}}>與會方式</Label>
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
              marginTop      : 30,
            }}
            disabled = {!this.state.isEditable}
            onPress  = {()=>{
              this.setState({ actionSheetType:"M" });
              setTimeout( this.showActionSheet, 50);
            }}
          >
            <Icon name='clock-alert-outline' type="MaterialCommunityIcons" />
            <Label style={{flex:1}}>會議前提醒</Label>
            {
             this.state.isEditable ? <Text>{remindtimeLabel}</Text> : <Label>{remindtimeLabel}</Label>  
            }
            {
              this.state.isEditable ? <Icon name='arrow-forward' /> : null
            }
          </Item>

          {/*顯示會議的按鈕*/}
          { this.renderMeetingActionButton() }

        </Content>
        {this.renderActionSheet()}

        {/*選擇日期*/}
        {
          (this.state.showDatePicker) ? 
            <DateTimePicker 
              value    ={this.state.editDatetimeValue}
              minimumDate = {new Date(this.state.now)}
              mode     ={"date"}
              is24Hour ={true}
              display  ="default"
              onChange ={this.setDate}
            />
          :
            null
        }
        {/*選擇時間*/}
        {
          (this.state.showTimePicker) ? 
            <DateTimePicker 
              value    ={this.state.editDatetimeValue}
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
                      <Button transparent onPress ={()=>{ this.setState({ showDateTimePicker:false, editDatetimeValue :null });}} >
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
        {
          (this.props.state.Meeting.isRefreshing) ? 
            <Modal animationType="fade" transparent={true} visible={true} >
              <Container style={{justifyContent: 'center', alignItems: 'center', backgroundColor:this.props.style.SpinnerbackgroundColor}}>
                <Spinner color={this.props.style.SpinnerColor}/>
              </Container>
            </Modal>
          :
            null
        }
      </Container>
    );
	}

  showDateTimePicker = (editStartorEndDatetime) => {

    let startdate = new Date( this.state.startdate.replace(' ', 'T') );
    let enddate = new Date( this.state.enddate.replace(' ', 'T') );

    enddate = this.state.isModify ? enddate : startdate;
    if (Platform.OS == "ios") {
      this.setState({
        editStartorEndDatetime: editStartorEndDatetime,
        editDatetimeValue: editStartorEndDatetime ? startdate: enddate,
        showDateTimePicker: true
      });
    } else {
      this.setState({
        editStartorEndDatetime: editStartorEndDatetime,
        editDatetimeValue: editStartorEndDatetime ? startdate: enddate,
        showDatePicker: true
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
        editDatetimeValue:new Date(DateFormat( date.nativeEvent.timestamp, "yyyy/mm/dd HH:MM")),
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
        this.setState({
          startdate      :DateFormat( time.nativeEvent.timestamp, "yyyy-mm-dd HH:MM:ss"),
          showTimePicker    : false,
        });
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
      let editDatetimeValue = this.state.editDatetimeValue.getTime();
      this.setState({
        startdate      :DateFormat( new Date(editDatetimeValue), "yyyy-mm-dd HH:MM:ss"),
        showDateTimePicker    : false, // for ios
      });
    } else {
      //end
      let editDatetimeValue = this.state.editDatetimeValue.getTime();
      this.setState({
        enddate        :DateFormat( new Date(editDatetimeValue), "yyyy-mm-dd HH:MM:ss"),
        showDateTimePicker    : false, // for ios
      });
    }
  }

  dateFormat = (datetime) => {
    let datetimeString = "";
    console.log("datetime", this.state.startdate, new Date() );
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

    // console.log( DateFormat( new Date(), "yyyy-mm-dd HH:MM:ss") );
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
      attendees:[...this.state.attendees]
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
        isShowDestructiveButton = true;
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
      title             ={"請選擇"}
      options           ={BUTTONS}
      destructiveButtonIndex = { isShowDestructiveButton ? DestructiveButtonIndex: null}
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
            meetingMode    :this.props.state.Meeting.meetingModeTypes[buttonIndex].paramcode,
            meetingPlaceName:this.props.state.Meeting.meetingModeTypes[buttonIndex].paramname,
            isOnlineMeeting :true
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
            this.renderMeetingPlaceInfoItem( "會議室-號碼", this.state.isEditable, this.state.meetingNumber, setStateFunction1 )
          );
          setStateFunction2 = (text)=>{ this.setState({ meetingPassword:text }); }
          compontent.push(
            this.renderMeetingPlaceInfoItem( "會議室-密碼", this.state.isEditable, this.state.meetingPassword, setStateFunction2 )
          );
          break;
        case 'S': // SKYPE
          setStateFunction1 = (text)=>{ this.setState({ meetingNumber:text }); }
          compontent.push(
            this.renderMeetingPlaceInfoItem( "會議室資訊", this.state.isEditable, this.state.meetingNumber, setStateFunction1 )
          );
          break;
        case 'W': // WeChat
          setStateFunction1 = (text)=>{ this.setState({ meetingNumber:text }); }
          compontent.push(
            this.renderMeetingPlaceInfoItem( "會議室資訊", this.state.isEditable, this.state.meetingNumber, setStateFunction1 )
          );
          break;
        case 'T': // Tencent
          setStateFunction1 = (text)=>{ this.setState({ meetingNumber:text }); }
          compontent.push(
            this.renderMeetingPlaceInfoItem( "會議室-號碼", this.state.isEditable, this.state.meetingNumber, setStateFunction1 )
          );
          setStateFunction2 = (text)=>{ this.setState({ meetingPassword:text }); }
          compontent.push(
            this.renderMeetingPlaceInfoItem( "會議室-密碼", this.state.isEditable, this.state.meetingPassword, setStateFunction2 )
          );
          break;
        case 'M': // Mircasoft Lync
          setStateFunction1 = (text)=>{ this.setState({ meetingNumber:text }); }
          compontent.push(
            this.renderMeetingPlaceInfoItem( "會議連結", this.state.isEditable, this.state.meetingNumber, setStateFunction1 )
          );
          break;
        case 'D': // Mircasoft Lync
          setStateFunction1 = (text)=>{ this.setState({ meetingNumber:text }); }
          compontent.push(
            this.renderMeetingPlaceInfoItem( "入會號", this.state.isEditable, this.state.meetingNumber, setStateFunction1 )
          );
          break;
      }

    } else {
      let setStateFunction = (text)=>{ this.setState({ meetingPlace:text }); }
      compontent.push(
        this.renderMeetingPlaceInfoItem(
          "會議室地點",
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
          headerName:"編輯會議"
        });
        button = (
          <Button info style={{ alignSelf: 'center', marginTop: 40, marginBottom: 40, width: '60%', justifyContent: 'center' }}
            onPress={()=>{ this.addMeeting(); }}
          >
            <Text>確定</Text>
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
            <Text>編輯會議</Text>
          </Button>
        );
      }

    } else {
      if (this.state.isEditable) {
        button = (
          <Button info style={{ alignSelf: 'center', marginTop: 40, marginBottom: 40, width: '60%', justifyContent: 'center' }}
            onPress={()=>{ this.addMeeting(); }}
          >
            <Text>確定</Text>
          </Button>
        );
      }
    }

    return button;
  }

  addMeeting = () =>{
    // subject
    // description
    // attendees
    // meetingMode
    // meetingPlace
    if (this.isEmptyString(this.state.subject)) {
      Alert.alert(
        "錯誤",   // 表單動作失敗
        `會議主題必須填寫`,
        [{
            text: this.props.state.Language.lang.Common.Close,   // 關閉 
            onPress: () => { }, 
        }],
      )
    } else if( new Date(this.state.enddate).getTime() == new Date(this.state.startdate).getTime() ) {
      Alert.alert(
        "錯誤",   // 表單動作失敗
        `會議結束時間不能\"等於\"開始時間`,
        [{
            text: this.props.state.Language.lang.Common.Close,   // 關閉 
            onPress: () => {}, 
        }],
      )
    } else if (new Date(this.state.enddate) < new Date(this.state.startdate)) {
      Alert.alert(
        "錯誤",   // 表單動作失敗
        `會議結束時間不能\"早於\"開始時間`,
        [{
            text: this.props.state.Language.lang.Common.Close,   // 關閉 
            onPress: () => { }, 
        }],
      )
    }  else if (this.state.meetingMode == "A" && this.isEmptyString(this.state.meetingPlace)) {
      Alert.alert(
        "錯誤",   // 表單動作失敗
        `會議室地點必須填寫`,
        [{
            text: this.props.state.Language.lang.Common.Close,   // 關閉 
            onPress: () => { }, 
        }],
      )
    } else {
      let meetingParams = {
          subject        :this.state.subject,
          description    :this.state.description,
          startdate      :DateFormat( new Date(this.state.startdate.replace(' ', 'T')).getTime()+1000, "yyyy-mm-dd HH:MM:ss"),
          enddate        :this.state.enddate,
          meetingMode    :this.state.meetingMode,
          meetingPlace   :this.state.meetingPlace,
          meetingNumber  :this.state.meetingNumber,
          meetingPassword:this.state.meetingPassword,
          remindtime     :this.state.remindtime,
          initiator      :this.state.initiator,
          chairperson    :this.state.chairperson,
          attendees      :this.state.attendees,
          timezone       :new Date( this.state.startdate.replace(' ', 'T') ).getTimezoneOffset().toString()
      }
      console.log("meetingParams", meetingParams);

      if (this.state.isModify) {
        // 修改會議
        meetingParams.oid = this.state.oid;
        this.props.actions.modifyMeeting(meetingParams);
      } else {
        // 新增會議
        this.props.actions.addMeeting(meetingParams);
      }
    }    
  }

  isEmptyString = (string) => {
    string = string.replace(/\r\n/g,"");
    string = string.replace(/\n/g,"");
    string = string.replace(/\s/g,"");
    return string.length == 0 ? true : false;
  }

  componentWillUnmount(){
    this.props.actions.resetMeetingRedux();
  }
}

let MeetingInsertPageStyle = connectStyle( 'Page.MeetingPage', {} )(MeetingInsertPage);
export default connect(
  (state) => ({
    state: { ...state }
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...MeetingAction
    }, dispatch)
  })
)(MeetingInsertPageStyle);
