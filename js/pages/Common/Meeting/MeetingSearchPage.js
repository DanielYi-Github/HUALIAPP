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
import * as UpdateDataUtil from '../../../utils/UpdateDataUtil';
import MainPageBackground from '../../../components/MainPageBackground';
import FunctionPageBanner from '../../../components/FunctionPageBanner';

const explain = "為了快速得知特定時間內，您想邀請的人員是否已安排其他會議，可使用下列“起迄時間”與”新增參與人員“的設定，快速查詢所有”參與人員“的會議時間，方便您安排會議與發送邀請。";
class MeetingSearchPage extends React.PureComponent  {
	constructor(props) {
    super(props);
    let startTime  = new Date().getTime();
    let endTime    = new Date().getTime();
    startTime      = startTime + (900000-(startTime%900000));
    endTime        = endTime + (900000-(endTime%900000));

    this.state = {
      now                   : startTime,
      startdate             : DateFormat( new Date(startTime), "yyyy-mm-dd HH:MM:ss"),
      enddate               : DateFormat( new Date(endTime), "yyyy-mm-dd HH:MM:ss"),
      attendees             : [],  //參與者
      showDatePicker        : false,
      showTimePicker        : false,
      showDateTimePicker    : false, // for ios
      editDatetimeValue     : new Date(),
      editStartorEndDatetime: true, // true for start, false for end
      showNavigationMessage: false // 顯示要前往新增會議的功能
    }
	}

	render() {
    //整理tags的資料格式
    let tagsArray = [];
    for(let value of this.state.attendees) {
     tagsArray.push(value.name); 
    }
    let tags = { tag: '', tagsArray: tagsArray }

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
          title                 = {"參與人時間查詢"}
          isTransparent         = {false}
        />
        <Content>
          <FunctionPageBanner
             explain         ={explain} //隨時了解表單狀態，流程追蹤、表單簽核目了然，簡單管理流程進度。
             isShowButton    ={this.state.selectedCompany ? true : false}
             buttonText      ={this.state.selectedCompany }
             imageBackground ={require("../../../image/functionImage/meetingCalendarsSearch.jpeg")}
             // onPress         ={() => this.ActionSheet.show()}
           />

          <Card>
            <CardItem style={{flexDirection: 'column', alignContent: 'flex-start', justifyContent: 'flex-start'   }}>        
              {/*時間*/}
               <Item style={{
                backgroundColor: '#fff',
                flexDirection: 'row',
                borderBottomWidth: 0,
              }}>
                <TouchableOpacity 
                  style={{flex:1, flexDirection: 'column', padding: 10}}
                  onPress={()=>{this.showDateTimePicker(true)}}
                >
                  <Text>{this.dateFormat(this.state.startdate)}</Text>
                  <Text>{DateFormat( new Date(this.state.startdate), "HH:MM")  }</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={{flex:1, flexDirection: 'column', padding: 10}}
                  onPress={()=>{ this.showDateTimePicker(false) }}
                >
                  <Text>{this.dateFormat(this.state.enddate)}</Text>
                  <Text>{DateFormat( new Date(this.state.enddate), "HH:MM")  }</Text>
                </TouchableOpacity>
              </Item>
            </CardItem >        
          </Card>

          <Card>
            <CardItem style={{flexDirection: 'column', alignContent: 'flex-start', justifyContent: 'flex-start'   }}>    
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
                  <Label style={{alignSelf: 'center', flex:1}}>{"新增參與人"}</Label>
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
            <Text>查詢</Text>
          </Button>

          {
            /*this.state.showNavigationMessage ? */
            true ? 
              <Card>
                <CardItem style={{borderWidth: 3, borderColor: '#4CAF50'}}>
                  <Body style={{width:"95%", alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                    <Text style={{color:"#757575", fontWeight: 'bold', fontSize: 22, paddingBottom: 5}}>{"太棒了!"}</Text>
                    <Text style={{color:"#757575", fontWeight: 'bold', paddingBottom: 2.5}} >
                      {`期間：${DateFormat( new Date(this.state.startdate), "m/dd HH:MM")} - ${DateFormat( new Date(this.state.enddate), "m/dd HH:MM")}`}
                    </Text>
                    <Text style={{color:"#757575", fontWeight: 'bold', paddingRight: 10}}>
                      {"您所選的參與人沒有安排會議，是否直接用此設定幫您新增會議？"}
                    </Text>
                  </Body>
                  <Body style={{flex:null, justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: '#757575' }}>
                    <Text style={{paddingLeft: 10}}>
                      前往新增
                    </Text>
                  </Body>

                </CardItem>
              </Card>
              
            :
             null
          }
          
          {/*
              <Text style={{marginTop: 10,color:"#757575"}}>
                {"直接前往 → "} 
                <Title style={{color:"#47ACF2", fontWeight: 'bold'}} onPress={()=>{
                  NavigationService.navigate("MeetingInsert", {
                    meeting: this.state.meetingParams,
                    fromPage:"MeetingSearch"
                  });
                }}>
                   新增會議
                </Title>
              </Text>
          */}

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

  showDateTimePicker = (editStartorEndDatetime) => {
    let enddate = new Date(this.state.startdate) > new Date(this.state.enddate) ? new Date(this.state.startdate) : new Date(this.state.enddate);

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

  selectAttendees = (attendees) => {
    this.setState({
      attendees:[...this.state.attendees]
    });
  }

  searchMeeting = async () =>{
    let user = this.props.state.UserInfo.UserInfo;
    let meetingParams = {
        startdate      :this.state.startdate,
        enddate        :this.state.enddate,
        attendees      :this.state.attendees,
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
        "出錯了！",
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

  componentWillUnmount(){
    this.props.actions.resetMeetingRedux();
  }
}

let MeetingSearchPageStyle = connectStyle( 'Page.MeetingPage', {} )(MeetingSearchPage);
export default connect(
  (state) => ({
    state: { ...state }
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...MeetingAction
    }, dispatch)
  })
)(MeetingSearchPageStyle);
