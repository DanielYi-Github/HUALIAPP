import React from 'react';
import { View, Keyboard, TouchableOpacity, Platform, Modal, Alert } from 'react-native';
import { Container, Header, Content, Item, Icon, Input, Title, Text, Label, Button, ListItem, connectStyle, Card, CardItem, Body} from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DateFormat             from  'dateformat';
import TagInput               from 'react-native-tags-input';
import DateTimePicker         from '@react-native-community/datetimepicker';
import HeaderForGeneral       from '../../../components/HeaderForGeneral';
import * as NavigationService from '../../../utils/NavigationService';
import * as MeetingAction     from '../../../redux/actions/MeetingAction';
import * as UpdateDataUtil    from '../../../utils/UpdateDataUtil';
import MainPageBackground     from '../../../components/MainPageBackground';
import FunctionPageBanner     from '../../../components/FunctionPageBanner';
import * as RNLocalize from "react-native-localize";
import Moment from 'moment-timezone';

class MeetingSearchPage extends React.PureComponent  {
	constructor(props) {
    super(props);

    let time1 = new Date();
    let time2 = new Date( DateFormat( time1, "yyyy-mm-dd HH:MM:ss").replace(/-/g, "/") );
    let isChangeTime = time1.getHours() == time2.getHours() ? false: true;
    // console.log(Platform.OS, time1.getHours() , time2.getHours(), isChangeTime);

    let startTime = new Date( Moment( new Date() ).tz(RNLocalize.getTimeZone()).format() ).getTime();
    let endTime   = new Date( Moment( new Date() ).tz(RNLocalize.getTimeZone()).format() ).getTime();
    startTime     = startTime + (600000-(startTime%600000));
    endTime       = endTime + (600000-(endTime%600000));

    this.state = {
      isChangeTime          : isChangeTime, //記錄部分機型會將時間直接+8小時
      now                   : startTime,
      startdate             : DateFormat( new Date(startTime), "yyyy-mm-dd HH:MM:ss"),
      enddate               : DateFormat( new Date(endTime), "yyyy-mm-dd HH:MM:ss"),
      attendees             : [],  //參與者
      showDatePicker        : false,
      showTimePicker        : false,
      showDateTimePicker    : false, // for ios
      editDatetimeValue     : new Date(),
      editStartorEndDatetime: true, // true for start, false for end
      showNavigationMessage : false, // 顯示要前往新增會議的功能
      isEndDateChange       : false
    }
	}

	render() {
    //整理tags的資料格式
    let tagsArray = [];
    for(let value of this.state.attendees) { tagsArray.push(value.name); }
    let tags = { tag: '', tagsArray: tagsArray }

    let startdate = new Date( this.state.startdate.replace(/-/g, "/") );
    let enddate = new Date( this.state.enddate.replace(/-/g, "/") );
    startdate = this.state.isChangeTime ? startdate-28800000 : startdate;
    enddate = this.state.isChangeTime ? enddate-28800000 : enddate;

    return (
      <Container>
        <MainPageBackground height={null}/>
        <HeaderForGeneral
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:"arrow-back"}}
          leftButtonOnPress     = {() =>NavigationService.goBack()} 
          isRightButtonIconShow = {false}
          rightButtonIcon       = {null}
          rightButtonOnPress    = {null} 
          title                 = {this.props.lang.MeetingPage.attendeesTimeSearch} //"與會人員時間查詢"
          isTransparent         = {false}
        />
        <Content>
          <FunctionPageBanner
             explain         ={this.props.lang.MeetingPage.functionMsg} 
             isShowButton    ={this.state.selectedCompany ? true : false}
             buttonText      ={this.state.selectedCompany }
             imageBackground ={require("../../../image/functionImage/meetingCalendarsSearch.jpeg")}
           />

          <Card>
            <CardItem style={{flexDirection: 'column', alignContent: 'flex-start', justifyContent: 'flex-start'   }}>        
              {/*時間*/}
               <Item style={{ flexDirection: 'row', borderBottomWidth: 0 }}>
                <TouchableOpacity 
                  style={{flex:1, flexDirection: 'column', padding: 10}}
                  onPress={()=>{this.showDateTimePicker(true)}}
                >
                  <Text>{this.dateFormat(startdate)}</Text>
                  {/*<Text>{DateFormat( startdate, "HH:MM")  }</Text>*/}
                  <Text>{Moment( new Date(startdate) ).tz(RNLocalize.getTimeZone()).format("HH:mm")}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={{flex:1, flexDirection: 'column', padding: 10}}
                  onPress={()=>{ this.showDateTimePicker(false) }}
                >
                  <Text>{this.dateFormat(enddate)}</Text>
                  {/*<Text>{DateFormat( enddate, "HH:MM")  }</Text>*/}
                  <Text>{Moment( new Date(enddate) ).tz(RNLocalize.getTimeZone()).format("HH:mm")}</Text>
                </TouchableOpacity>
              </Item>
            </CardItem >        
          </Card>

          <Card>
            <CardItem style={{flexDirection: 'column', alignContent: 'flex-start', justifyContent: 'flex-start'   }}>    
              {/*會議參與人*/}
              <Item style={{
                borderWidth: 10,
                height: tags.tagsArray.length == 0 ? this.props.style.inputHeightBase: null,
                paddingLeft: 10,
                paddingRight: 5,
                flexDirection: 'column',
                alignContent: 'flex-start',
                justifyContent: 'flex-start',
                paddingTop: 10,
                borderBottomWidth: 0,
              }}>
                <View style={{
                  flexDirection: 'row', 
                  justifyContent: 'flex-start', 
                  alignContent: 'flex-start', 
                  width: '100%',
                  borderWidth: 0
                }}>
                  <Icon name='people-outline' />
                  <Label style={{alignSelf: 'center', flex:1}}>{this.props.lang.MeetingPage.insertAttendees}</Label>
                  <Icon 
                    name    ="add-circle" 
                    type    ="MaterialIcons" 
                    style   ={{fontSize:30, color: '#20b11d'}}
                    onPress ={()=>{
                      NavigationService.navigate("MeetingSearchWithTags",{
                        attendees: this.state.attendees,
                        startdate: this.state.startdate,
                        enddate  : this.state.enddate,
                        onPress  : this.selectAttendees,
                      });
                    }}
                  />
                </View>
                <TagInput
                  updateState         ={(state)=>{ this.deleteTag(state); }}
                  disabled            ={false}
                  autoFocus           ={false}
                  tags                ={tags}
                  style               ={{width: '100%'}}
                  containerStyle      ={{paddingLeft: 0, paddingRight: 0}}
                  inputContainerStyle ={{ height: 0}}
                  tagsViewStyle       ={{ marginTop: 0}}
                  tagStyle            ={{backgroundColor:"#DDDDDD"}}
                  tagTextStyle        ={{color:"#666"}}
                />
              </Item>
            </CardItem >        
          </Card>
           
          <Button info
            style={{
              alignSelf: 'center',
              marginTop: 30,
              marginBottom: 30,
              width: '95%',
              justifyContent: 'center'  
            }}
            onPress={()=>{
              this.searchMeeting();
            }}
          >
            <Text>{this.props.lang.MeetingPage.search}</Text>
          </Button>

          {
            this.state.showNavigationMessage ? 
              <Card>
                <CardItem button style={{borderWidth: 3, borderColor: '#5cb85c'}}
                  onPress={()=>{
                    NavigationService.navigate("MeetingInsert", {
                      meeting: this.state.meetingParams,
                      fromPage:"MeetingSearch"
                    });
                  }}
                >
                  <Body style={{width:"95%", alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                    <Text style={{color:"#5cb85c", fontWeight: 'bold', fontSize: 22, paddingBottom: 5}}>{this.props.lang.MeetingPage.good}</Text>
                    <Text style={{ fontWeight: 'bold', paddingBottom: 2.5}} >
                      {`${this.props.lang.MeetingPage.period}：${DateFormat( startdate, "m/dd HH:MM")} - ${DateFormat( enddate, "m/dd HH:MM")}`}
                    </Text>
                    {/*"您所選的與會人員沒有安排會議，是否直接用此設定幫您新增會議？"*/}
                    <Text style={{fontWeight: 'bold', paddingRight: 10}}>
                      {this.props.lang.MeetingPage.sugguestMsg} 
                    </Text>
                  </Body>
                  <Body style={{flex:null, justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: '#757575' }}>
                    {/*前往新增*/}
                    <Title style={{paddingLeft: 10, color:"#5cb85c", fontWeight: 'bold'}}>
                      {this.props.lang.MeetingPage.gotoInsert}
                    </Title>
                  </Body>

                </CardItem>
              </Card>
              
            :
             null
          }

        </Content>

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
              minimumDate    = {new Date(this.state.now)}
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
                                editDatetimeValue :null,
                                isEndDateChange   :true
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
                            value          ={this.state.editDatetimeValue}
                            mode           ={"datetime"}
                            minimumDate    = {new Date(this.state.now)}
                            is24Hour       ={true}
                            display        ="default"
                            onChange       ={this.setDatetime_ios}
                            locale         ={this.props.state.Language.lang.LangStatus}
                            display        ={"spinner"}
                            minuteInterval = {10}
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
     attendees: [...data],
     showNavigationMessage: false
    });
  }

  showDateTimePicker = (editStartorEndDatetime) => {
    let startdate = new Date( this.state.startdate.replace(/-/g, "/") ).getTime();
    let enddate = new Date( this.state.enddate.replace(/-/g, "/") ).getTime();
    startdate = this.state.isChangeTime ? startdate-28800000: startdate;
    enddate = this.state.isChangeTime ? enddate-28800000: enddate;


    if (this.state.isEndDateChange) {
    } else {
      enddate = startdate;
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
        editDatetimeValue:date.nativeEvent.timestamp ,
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
        showNavigationMessage : false
      });
    } else {
      //end
      this.setState({
        enddate        :DateFormat( this.state.editDatetimeValue, "yyyy-mm-dd HH:MM:ss"),
        showDateTimePicker    : false, // for ios
        showNavigationMessage : false
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

  selectAttendees = (attendees) => {
    this.setState({
      attendees:[...attendees],
      showNavigationMessage : false
    });
  }

  searchMeeting = async () =>{
    let attendees = this.state.attendees;
    if ( new Date(this.state.startdate.replace(/-/g, "/")).getTime() >  new Date(this.state.enddate.replace(/-/g, "/")).getTime() ) {
      Alert.alert(
        this.props.lang.Common.Error,   // 表單動作失敗
        this.props.lang.MeetingPage.alertMessage_earlier, //`會議結束時間不能\"早於\"開始時間`
        [{
            text: this.props.state.Language.lang.Common.Close,   // 關閉 
            onPress: () => { }, 
        }],
      )
    } else if ( new Date(this.state.startdate.replace(/-/g, "/")).getTime() == new Date(this.state.enddate.replace(/-/g, "/")).getTime() ) {
      Alert.alert(
        this.props.lang.Common.Error,   // 表單動作失敗
        this.props.lang.MeetingPage.alertMessage_equal, //`會議結束時間不能\"等於\"開始時間`
        [{
            text: this.props.state.Language.lang.Common.Close,   // 關閉 
            onPress: () => {}, 
        }],
      )
    } else if ( attendees.length == 0 ) {
      Alert.alert(
        this.props.lang.Common.Error,   // 表單動作失敗
        this.props.lang.MeetingPage.pleaseInsertAttendees, //"請新增與會人員",
        [{
            text: this.props.state.Language.lang.Common.Close,   // 關閉 
            onPress: () => { }, 
        }],
      )
    } else {
      let user = this.props.state.UserInfo.UserInfo;
      let meetingParams = {
          startdate      :this.state.startdate,
          enddate        :this.state.enddate,
          attendees      :attendees,
          timezone       :RNLocalize.getTimeZone()
      }

      let isRequestSussce = false;
      let errorMessage = "";
      let searchMeetingResult = await UpdateDataUtil.searchMeeting(user, meetingParams).then((result)=>{
        isRequestSussce = true;
        return result;
      }).catch((errorResult)=>{
        errorMessage = errorResult.message;
        isRequestSussce = false;
        return [];
      });

      if (isRequestSussce) {
        if (searchMeetingResult.length == 0) {
          this.setState({
            showNavigationMessage:true,
            meetingParams        :meetingParams
          });
        } else {
          NavigationService.navigate("MeetingTimeForSearch", {
            searchMeetingResult: searchMeetingResult,
            meetingParams : meetingParams
          });
        }
      } else {
        Alert.alert(
          this.props.lang.Common.Sorry, //"出錯了！",
          errorMessage,
          [
            { 
              text: "OK", 
              onPress: () => {}
            }
          ],
          { cancelable: false }
        );
      }

    }
  }

  componentWillUnmount(){
    this.props.actions.resetMeetingRedux();
  }
}

let MeetingSearchPageStyle = connectStyle( 'Page.MeetingPage', {} )(MeetingSearchPage);
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
)(MeetingSearchPageStyle);
