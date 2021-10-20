import React from 'react';
import { View, Keyboard, TouchableOpacity, Platform, Modal, Alert, FlatList } from 'react-native';
import { Container, Header, Content, Item, Icon, Input, Text, Label, Button, ListItem, Spinner, Switch, Right, connectStyle} from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DateFormat from  'dateformat';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as RNLocalize from "react-native-localize";
import Moment from 'moment-timezone';

import HeaderForGeneral       from '../../../components/HeaderForGeneral';
import * as NavigationService from '../../../utils/NavigationService';
import * as MeetingAction     from '../../../redux/actions/MeetingAction';
import ToastUnit              from '../../../utils/ToastUnit';

class MeetingInsertWithRegularPage extends React.PureComponent  {
	constructor(props) {
	    super(props);
	    this.state = {
      }
	}

  componentDidMount(){

  }

	render() {
    console.log(this.props.state.Meeting.reCircleMeetingOptions);
    return (
      <Container>
        <HeaderForGeneral
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:"arrow-back"}}
          leftButtonOnPress     = {() =>NavigationService.goBack()} 
          isRightButtonIconShow = {false}
          rightButtonIcon       = {null}
          rightButtonOnPress    = {null} 
          title                 = {"例行性會議"}
          isTransparent         = {false}
        />

        <FlatList
          data={this.props.state.Meeting.reCircleMeetingOptions}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
        />

        <Content>


          
          {/*會議前提醒*/}
          <Item 
            style={{
              backgroundColor: this.props.style.InputFieldBackground,
              height         : this.props.style.inputHeightBase,
              paddingLeft    : 10,
              paddingRight   : 5,
              marginTop      : 20,
            }}
            onPress  = {()=>{
              
            }}
          >
              <Icon name='clock-alert-outline' type="MaterialCommunityIcons" />
              <Label style={{flex:1}}>{"測試"}</Label>
              <Text>{"請選擇"}</Text>
              <Icon name='arrow-forward' />
          </Item>

        </Content>

        {/*選擇日期
        {
          (this.state.showDatePicker) ? 
            <DateTimePicker 
              value       ={this.state.editDatetimeValue}
              minimumDate ={new Date(this.state.now)}
              mode        ={"date"}
              is24Hour    ={true}
              display     ="default"
              onChange    ={this.setDate}
            />
          :
            null
        }
        */}
        {/*選擇時間
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
        */}
        {/*選擇日期時間for ios
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
        */}
      </Container>
    );
	}

  renderItem = (item) => {
    return <View></View>
  }

  showDateTimePicker = (editStartorEndDatetime) => {
    let startdate = new Date( this.state.startdate.replace(/-/g, "/") ).getTime();
    let enddate = new Date( this.state.enddate.replace(/-/g, "/") ).getTime();

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
        // editDatetimeValue:this.state.isChangeTime ? date.nativeEvent.timestamp-28800000: date.nativeEvent.timestamp ,
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
    console.log(DateFormat( time.nativeEvent.timestamp, "yyyy-mm-dd HH:MM:ss"));
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
      let editDatetimeValue = this.state.editDatetimeValue-1000 >= this.state.now ? this.state.editDatetimeValue : this.state.now;
      this.setState({
        startdate      :DateFormat( new Date(editDatetimeValue), "yyyy-mm-dd HH:MM:ss"),
        showDateTimePicker    : false, // for ios
      });
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
}

let MeetingInsertWithRegularPageStyle = connectStyle( 'Page.MeetingPage', {} )(MeetingInsertWithRegularPage);
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
)(MeetingInsertWithRegularPageStyle);
