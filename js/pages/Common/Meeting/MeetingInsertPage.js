import React from 'react';
import { View, Keyboard, TouchableOpacity, Platform, Modal, Alert } from 'react-native';
import { Container, Header, Content, Item, Icon, Input, Text, Label, Button, ListItem, connectStyle} from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DateFormat from  'dateformat';
import TagInput   from 'react-native-tags-input';
import ActionSheet from 'react-native-actionsheet';
import DateTimePicker from '@react-native-community/datetimepicker';

import HeaderForGeneral   from '../../../components/HeaderForGeneral';
import FormInputContent       from '../../../components/Form/FormInputContent';
import * as NavigationService from '../../../utils/NavigationService';
import * as MeetingAction        from '../../../redux/actions/MeetingAction';
import ToastUnit             from '../../../utils/ToastUnit';

class MeetingInsertPage extends React.PureComponent  {
	constructor(props) {
	    super(props);
      let isParams         = this.props.route.params ? true : false;
      let isEditable       = true;
      let headerName       = "新增會議";
      let isModify         = false;
      let subject          = "";
      let description      = "";
      let startTime        = new Date().getTime();
      let endTime          = new Date().getTime();
      startTime            = startTime + (900000-(startTime%900000));
      endTime              = endTime + (900000-(endTime%900000));
      let initiator        = { id : props.state.UserInfo.UserInfo.id };  //發起人
      let chairperson      = { id : props.state.UserInfo.UserInfo.id };  //主席
      let chairpersonLabel = props.state.UserInfo.UserInfo.name;
      let attendees        = [];
      let meetingMode      = "A";
      let meetingPlace     = "";
      let meetingPlaceName = "";
      let meetingNumber    = "";
      let meetingPassword  = "";
      let remindtime       = 0;

      // 判斷當前頁面,從哪個畫面來
      if (isParams) {
        let meetingParam = props.route.params.meeting;
        switch (props.route.params.fromPage) {
          case 'MeetingList':
            // 會議發起人要是自己才可進行編輯
            isEditable       = meetingParam.initiator.id == props.state.UserInfo.UserInfo.id ? true: false;
            headerName       = isEditable ? "修改會議": "查看會議";
            isModify         = true;
            subject          = meetingParam.subject;
            description      = meetingParam.description;
            startTime        = `${meetingParam.datetime.date} ${meetingParam.datetime.starttime}`,
            endTime          = `${meetingParam.datetime.date} ${meetingParam.datetime.endtime}`
            initiator        = meetingParam.initiator;
            chairperson      = meetingParam.chairperson;
            chairpersonLabel = meetingParam.chairperson.name;
            attendees        = meetingParam.attendees;
            meetingMode      = meetingParam.meetingMode;
            meetingPlace     = meetingParam.meetingPlace ? meetingParam.meetingPlace : meetingPlace;
            meetingPlaceName = meetingParam.meetingPlaceName ? meetingParam.meetingPlaceName : meetingPlaceName;
            meetingNumber    = meetingParam.meetingNumber ? meetingParam.meetingNumber : meetingNumber;
            meetingPassword  = meetingParam.meetingPassword ? meetingParam.meetingPassword : meetingPassword;
            remindtime       = meetingParam.remindtime;
            break;
          case 'MeetingSearch':
            startTime        = meetingParam.startdate;
            endTime          = meetingParam.enddate;
            attendees        = meetingParam.attendees;
            break;
          default:
            // console.log(`Sorry, we are out of ${expr}.`);
        }
      }

	    this.state = {
        now             :startTime,
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
      }
	}

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.state.Meeting.actionResult !== null) {
        if (nextProps.state.Meeting.actionResult) {
          ToastUnit.show('success', this.state.isModify ?"修改會議成功" :"新增會議成功");
          this.props.actions.resetMeetingRedux();
          NavigationService.goBack();
        } else {
          let failMessage = "回傳原因"
          Alert.alert(
            this.state.isModify ?"修改會議失敗" :"新增會議失敗",   // 表單動作失敗
            nextProps.state.Meeting.actionResultMsg,
            [
              {
                text: this.props.state.Language.lang.Common.Close,   // 關閉 
                style: 'cancel',
                onPress: () => {
                  
                }, 
              }
            ],
          )
        }
    }
  }

  componentDidMount(){
    this.props.actions.getMeetingModeType();  //獲取參會方式的選項
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

    // 整理參會方式名稱
    let meetingPlaceName = "";
    for(let meetingModeTypes of this.props.state.Meeting.meetingModeTypes){
      if (this.state.meetingMode == meetingModeTypes.paramcode) {
        meetingPlaceName = meetingModeTypes.paramname;
      }
    }

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
          <Item style={{
            backgroundColor: '#fff',
            marginTop: 20,
            borderWidth: 0,
            paddingLeft: 10,
          }}>
              <Label>會議主題</Label>
              <Input 
                  scrollEnabled ={false}
                  textAlign     ="right"
                  editable      ={this.state.isEditable}
                  placeholder   ={this.state.isEditable ? null : this.state.subject}
                  value         ={this.state.isEditable ? this.state.subject : null}
                  onChangeText  ={(text)=>{
                    this.setState({ subject:text });
                  }}
              />
          </Item>

          <Item style={{
            backgroundColor: '#fff',
            borderWidth: 0,
            paddingLeft: 10,
          }}>
              <Label>說明</Label>
              <Input 
                multiline 
                scrollEnabled ={false}
                textAlign     ="right"
                editable      ={this.state.isEditable}
                value         ={this.state.isEditable ? this.state.description : null}
                placeholder   ={this.state.isEditable ? null : this.state.description }
                onChangeText  ={(text)=>{
                  this.setState({ description:text });
                }}
              />
          </Item>

          {/*時間*/}
           <Item style={{
            backgroundColor: '#fff',
            marginTop: 30,
            borderWidth: 0,
            flexDirection: 'row' 
          }}>
            <TouchableOpacity 
              style={{flex:1, flexDirection: 'column', padding: 10}}
              onPress={()=>{this.showDateTimePicker(true)}}
              disabled={!this.state.isEditable}
            >
              <Text>{this.dateFormat(this.state.startdate)}</Text>
              <Text>{DateFormat( new Date(this.state.startdate), "HH:MM")  }</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{flex:1, flexDirection: 'column', padding: 10}}
              onPress={()=>{ 
                this.showDateTimePicker(false);
              }}
              disabled={!this.state.isEditable}
            >
              <Text>{this.dateFormat(this.state.enddate)}</Text>
              <Text>{DateFormat( new Date(this.state.enddate), "HH:MM")  }</Text>
            </TouchableOpacity>
          </Item>

          {/*會議主席*/}
          <Item 
            style={{
              backgroundColor: '#fff',
              marginTop      : 30,
              borderWidth    : 0,
              height         : this.props.style.inputHeightBase,
              paddingLeft    : 10,
              paddingRight   : 5
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
              this.state.isEditable ?
                <Text>{this.state.chairpersonLabel}</Text>
              :
                <Label>{this.state.chairpersonLabel}</Label>
            }
            {
              this.state.isEditable ? 
                <Icon name='arrow-forward' />
              :
                null
            }
          </Item>

          {/*會議參與人*/}
          <Item style={{
            backgroundColor: '#fff',
            borderWidth: 10,
            height: tags.tagsArray.length == 0 ? this.props.style.inputHeightBase: null,
            paddingLeft: 10,
            paddingRight: 5,
            flexDirection: 'column',
            alignContent: 'flex-start',
            justifyContent: 'flex-start',
            paddingTop: 10
          }}>
            <View style={{
              flexDirection: 'row', 
              justifyContent: 'flex-start', 
              alignContent: 'flex-start', 
              width: '100%',
              borderWidth: 0
            }}>
              <Icon name='people-outline' />
              <Label style={{alignSelf: 'center', flex:1}}>{"邀請參與人"}</Label>
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
              updateState         ={(state)=>{ 
                this.state.isEditable ? this.deleteTag(state) : null;
              }}
              disabled            ={false}
              autoFocus           ={false}
              deleteIconStyles={ this.state.isEditable ? null: {width: 0, height: 0}}
              tags                ={tags}
              containerStyle      ={{paddingLeft: 0, paddingRight: 0 }}
              inputContainerStyle ={{ height: 0 }}
              tagsViewStyle       ={{ marginTop: 0 }}
              tagStyle            ={{backgroundColor:"#DDDDDD", borderWidth:0}}
              tagTextStyle        ={{color:"#666"}}
            />
          </Item>


          {/*參與方式*/}
          <Item 
            style={{
              backgroundColor: '#fff',
              borderWidth: 0,
              height: this.props.style.inputHeightBase,
              paddingLeft: 10,
              paddingRight: 5,
              marginTop: 30,
            }}
            onPress = {()=>{
              this.setState({ actionSheetType:"O" });
              setTimeout( this.showActionSheet, 50);
            }}
            disabled={!this.state.isEditable}
          >
            <Icon name='meeting-room' type="MaterialIcons"/>
            <Label style={{flex:1}}>參會方式</Label>
            {
              this.state.isEditable ? 
                <Text>{meetingPlaceName}</Text>
              :
                <Label>{meetingPlaceName}</Label>
            }
            {
              this.state.isEditable ? 
                <Icon name='arrow-forward' />
              :
                null
            }
          </Item>
          {
            (this.state.isOnlineMeeting)?
              <Item 
                style={{
                  backgroundColor: '#fff',
                  borderWidth: 0,
                  height: this.props.style.inputHeightBase,
                  paddingLeft: 10,
                  paddingRight: 5
                }}
              >
                <Label>會議室-號碼</Label>
                <Input 
                  scrollEnabled = {false}
                  textAlign     = "right"
                  editable      = {this.state.isEditable}
                  value         = {this.state.isEditable ? this.state.meetingNumber : null}
                  placeholder   = {this.state.isEditable ? null : this.state.meetingNumber }
                  onChangeText  = {(text)=>{
                    this.setState({ meetingNumber:text });
                  }}
                />
              </Item>
            :
              <Item 
                style={{
                  backgroundColor: '#fff',
                  borderWidth: 0,
                  height: this.props.style.inputHeightBase,
                  paddingLeft: 10,
                  paddingRight: 5
                }}
              >
                <Label>會議室地點</Label>
                <Input 
                    scrollEnabled ={false}
                    textAlign     ="right"
                    editable      ={this.state.isEditable}
                    value         ={this.state.isEditable ? this.state.meetingPlace: null}
                    placeholder   ={this.state.isEditable ? null : this.state.meetingPlace }
                    onChangeText  ={(text)=>{
                      this.setState({ meetingPlace:text });
                    }}
                />
              </Item>
          }
          {
            (this.state.isOnlineMeeting)?
              <Item 
                style={{
                  backgroundColor: '#fff',
                  borderWidth: 0,
                  height: this.props.style.inputHeightBase,
                  paddingLeft: 10,
                  paddingRight: 5
                }}
              >
                <Label>會議室-密碼</Label>
                <Input 
                    scrollEnabled ={false}
                    textAlign     ="right"
                    editable      ={this.state.isEditable}
                    value         ={this.state.isEditable ? this.state.meetingPassword: null}
                    placeholder   ={this.state.isEditable ? null : this.state.meetingPassword }
                    onChangeText  ={(text)=>{
                      this.setState({ meetingPassword:text });
                    }}
                />
              </Item>
            :
              null
          }
          
          {/*會議前提醒*/}
          <Item 
            style={{
              backgroundColor: '#fff',
              borderWidth    : 0,
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
             this.state.isEditable ?
              <Text>{remindtimeLabel}</Text>
             :
              <Label>{remindtimeLabel}</Label>  
            }
            {
              this.state.isEditable ? 
                <Icon name='arrow-forward' />
              :
                null
            }
          </Item>

          {
            this.state.isEditable ? 
              <Button 
                style={{
                  alignSelf: 'center',
                  marginTop: 40,
                  marginBottom: 40,
                  width: '60%',
                  justifyContent: 'center'  
                }}
                onPress={()=>{
                  this.addMeeting();
                }}
              >
                <Text>確定</Text>
              </Button>
            :
              null
          }

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
              minuteInterval = {15}
            />
          :
            null
        }
        {/*選擇日期時間for ios*/}
        {
          (this.state.showDateTimePicker) ?
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.showDateTimePicker}
            >
                <View style={{flex:1,backgroundColor:"rgba(0,0,0,.4)", flexDirection:"column", justifyContent:"flex-end"}}>
                  <View style={{backgroundColor:"white"}}>
                        <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                          <Button 
                            transparent 
                            style   ={{flex:0}} 
                            onPress ={()=>{ 
                              this.setState({
                                showDateTimePicker:false,
                                editDatetimeValue :null
                              }); 
                            }}
                          >
                            <Text style={{color: "black"}}>{this.props.state.Language.lang.Common.Cancel}</Text>
                          </Button>
                          <Button 
                            transparent 
                            style   ={{flex:0}} 
                            onPress ={this.setDatetime}
                          >
                            <Text style={{color: "black"}}>{this.props.state.Language.lang.FormSign.Comfirm}</Text>
                          </Button>
                        </View>
                        <View>
                          <DateTimePicker 
                            value    ={this.state.editDatetimeValue}
                            mode     ={"datetime"}
                            minimumDate = {new Date(this.state.now)}
                            is24Hour ={true}
                            display  ="default"
                            onChange ={this.setDatetime_ios}
                            locale   ={this.props.state.Language.lang.LangStatus}
                            display  ={"spinner"}
                            minuteInterval = {15}
                          />
                        </View>
                  </View>
                </View>
            </Modal>
          :
            null
        }
      </Container>
    );
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

  showDateTimePicker = (editStartorEndDatetime) => {
    let enddate = this.state.isModify ? new Date(this.state.enddate) : new Date(this.state.startdate);
    if (Platform.OS == "ios") {
      this.setState({
        editStartorEndDatetime: editStartorEndDatetime,
        editDatetimeValue: editStartorEndDatetime ? new Date(this.state.startdate): enddate,
        showDateTimePicker: true
      });
    } else {
      this.setState({
        editStartorEndDatetime: editStartorEndDatetime,
        editDatetimeValue: editStartorEndDatetime ? new Date(this.state.startdate): enddate,
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
      this.setState({
        startdate      :DateFormat( this.state.editDatetimeValue, "yyyy-mm-dd HH:MM:ss"),
        showDateTimePicker    : false, // for ios
      });
    } else {
      //end
      this.setState({
        enddate        :DateFormat( this.state.editDatetimeValue, "yyyy-mm-dd HH:MM:ss"),
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

  addMeeting = () =>{
    if (new Date(this.state.enddate) < new Date(this.state.startdate)) {
      Alert.alert(
        "錯誤",   // 表單動作失敗
        `會議結束時間不能\"早於\"開始時間`,
        [
          {
            text: this.props.state.Language.lang.Common.Close,   // 關閉 
            onPress: () => {
              
            }, 
          }
        ],
      )
    } else if( new Date(this.state.enddate).getTime() == new Date(this.state.startdate).getTime() ) {
      Alert.alert(
        "錯誤",   // 表單動作失敗
        `會議結束時間不能\"等於\"開始時間`,
        [
          {
            text: this.props.state.Language.lang.Common.Close,   // 關閉 
            onPress: () => {
              
            }, 
          }
        ],
      )
    } else {
      let meetingParams = {
          subject        :this.state.subject,
          description    :this.state.description,
          startdate      :DateFormat( new Date(this.state.startdate).getTime()+1000, "yyyy-mm-dd HH:MM:ss"),
          enddate        :this.state.enddate,
          meetingMode    :this.state.meetingMode,
          meetingPlace   :this.state.meetingPlace,
          meetingNumber  :this.state.meetingNumber,
          meetingPassword:this.state.meetingPassword,
          remindtime     :this.state.remindtime,
          initiator      :this.state.initiator,
          chairperson    :this.state.chairperson,
          attendees      :this.state.attendees,
      }

      
      if (this.state.isModify) {
        // 修改會議
        meetingParams.oid = this.props.route.params.meeting.oid;
        this.props.actions.modifyMeeting(meetingParams);
      } else {
        // 新增會議
        this.props.actions.addMeeting(meetingParams);
      }
    }    
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
