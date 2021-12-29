import React from 'react';
import { View, Keyboard, TouchableOpacity, Platform, Modal, Alert, FlatList } from 'react-native';
import { Container, Header, Content, Item, Icon, Input, Text, Label, Button, ListItem, Spinner, Switch, Right, connectStyle} from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DateFormat from  'dateformat';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as RNLocalize from "react-native-localize";
import Moment from 'moment-timezone';
import CheckBox from '@react-native-community/checkbox';

import HeaderForGeneral       from '../../../components/HeaderForGeneral';
import * as NavigationService from '../../../utils/NavigationService';
import * as MeetingAction     from '../../../redux/actions/MeetingAction';
import ToastUnit              from '../../../utils/ToastUnit';

class MeetingInsertWithRegularPage extends React.PureComponent  {
	constructor(props) {
	    super(props);

      var d1 = new Date();
      var d2 = new Date(d1);
      d2.setFullYear(d2.getFullYear()+1);
      d2.setDate(d2.getDate()-1);

	    this.state = {
        startdate     : props.route.params.startdate,
        enddate       : props.route.params.enddate,
        showDatePicker: false,
        editDatetimeValue : new Date(),
        maximumDate : new Date(d2)
      }
	}

  componentWillUnmount(){
    if( 
      this.props.state.Meeting.selectedRepeatType != "NR" &&
      this.props.state.Meeting.repeatEndDate == ""
    ){
      NavigationService.navigate("MeetingInsertWithRegular", {
        startdate: this.state.startdate,
        enddate  : this.state.enddate,
        onPress  : "",
        // oid      : this.state.oid
      });

      Alert.alert(
        this.props.lang.Common.Alert,
        this.props.lang.MeetingPage.needEndDate,
        [
          { text: "OK", onPress: () => {
            this.setState({ 
              showDatePicker: true,
              editDatetimeValue : this.props.state.Meeting.repeatEndDate == "" ? this.state.editDatetimeValue : new Date(this.props.state.Meeting.repeatEndDate)
            });
          }}
        ]
      );
    }
  }

	render() {
    return (
      <Container>
        <HeaderForGeneral
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:"arrow-back"}}
          leftButtonOnPress     = {() =>{
            if( 
              this.props.state.Meeting.selectedRepeatType != "NR" &&
              this.props.state.Meeting.repeatEndDate == ""
            ){
              Alert.alert(
                this.props.lang.Common.Alert,
                this.props.lang.MeetingPage.needEndDate,
                [
                  { text: "OK", onPress: () => {
                    this.setState({ 
                      showDatePicker: true,
                      editDatetimeValue : this.props.state.Meeting.repeatEndDate == "" ? this.state.editDatetimeValue : new Date(this.props.state.Meeting.repeatEndDate)
                    });
                  }}
                ]
              );
            }else{
              NavigationService.goBack();
            }
          }} 
          isRightButtonIconShow = {false}
          rightButtonIcon       = {null}
          rightButtonOnPress    = {null} 
          title                 = {this.props.lang.MeetingPage.regularMeeting}
          isTransparent         = {false}
        />

        <FlatList
          keyExtractor        ={item => item.id}
          data                ={this.props.state.Meeting.repeatType}
          renderItem          ={this.renderItem}
          ListFooterComponent ={this.ListFooterComponent}
        />


        {/*選擇日期*/}
        {
          (this.state.showDatePicker && Platform.OS == 'android') ? 
            <DateTimePicker 
              value       ={this.state.editDatetimeValue}
              minimumDate ={new Date()}
              maximumDate ={this.state.maximumDate}
              mode        ={"date"}
              display     ="default"
              onChange    ={this.setDate}
            />
          :
            null
        }

        {/*選擇日期for ios*/}
        {
          this.state.showDatePicker &&  Platform.OS == 'ios' ?
            <Modal animationType="fade" transparent={true} visible={this.state.showDatePicker} >
                <View style={{flex:1, backgroundColor:"rgba(0,0,0,.4)", flexDirection:"column", justifyContent:"flex-end"}}>
                  <View style={{backgroundColor:"white"}}>
                    <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                      <Button transparent onPress ={()=>{ 
                        this.setState({ 
                          showDatePicker   :false, 
                          editDatetimeValue:null, 
                        });
                      }}>
                        <Text style={{color: "black"}}>{this.props.state.Language.lang.Common.Cancel}</Text>
                      </Button>
                      <Button transparent onPress={this.setDatetime}>
                        <Text style={{color: "black"}}>{this.props.state.Language.lang.FormSign.Comfirm}</Text>
                      </Button>
                    </View>
                    <DateTimePicker 
                      mode           ={"date"}
                      value          ={this.state.editDatetimeValue}
                      minimumDate    ={new Date()}
                      maximumDate    ={this.state.maximumDate}
                      minuteInterval ={10}
                      is24Hour       ={true}
                      display        ={"spinner"}
                      locale         ={this.props.state.Language.lang.LangStatus}
                      onChange       ={this.setDatetime_ios}
                    />
                  </View>
                </View>
            </Modal>
          :
            null
        }

      </Container>
    );
	}

  renderItem = (item) => {
    let isChecked = item.item.type == this.props.state.Meeting.selectedRepeatType ? true: false;
    let label = this.props.lang.MeetingPage.repeatType[item.item.type];
    return (
      <Item 
        style={{
          backgroundColor: this.props.style.InputFieldBackground,
          height         : this.props.style.inputHeightBase,
          paddingLeft    : 10,
          paddingRight   : 5,
        }}
        onPress  = {()=>{ this.setRepeatType({ type:item.item.type }); }}
      >
          <Label style={{flex:1}}>{label}</Label>
          {
            isChecked ?
              <CheckBox
                disabled      ={ Platform.OS == "android" ? false : true }
                onValueChange={(newValue) => { this.setRepeatType({ type:item.item.type }); }}
                value             = {isChecked}
                boxType           = {"square"}
                onCheckColor      = {"#00C853"}
                onTintColor       = {"#00C853"}
                tintColors        = {{true: "#00C853", false: '#00C853'}}
                style             = {{ marginRight: 20 }}
                animationDuration = {0.01}
              />
            :
              false
          }
      </Item>
    )
  }

  setRepeatType = (param) => {
    switch (param.type) {
      case 'NR':
        this.props.actions.setRepeatType({ 
          selectedRepeatType:param.type,
          selectedWeekDays  :[],
          repeatEndDate : ""
        });
        break;
      case 'DM':
        NavigationService.navigate("MeetingInsertWithRegularCustomize", {
          startdate: this.state.startdate,
          enddate  : this.state.enddate,
        });
        this.props.actions.setRepeatType({ selectedRepeatType:param.type });
        break;
      default:
        this.props.actions.setRepeatType({ selectedRepeatType:param.type });
    }
  }

  ListFooterComponent = () => {
    // 判斷結束日期的顯示內容
    let endRepeatDate = disabled ? <Label>{this.props.lang.MeetingPage.couldNotOverYear}</Label> : <Text>{this.props.lang.MeetingPage.couldNotOverYear}</Text>;
    if ( this.props.state.Meeting.repeatEndDate != "" ) {
      endRepeatDate = (<Text>{this.props.state.Meeting.repeatEndDate}</Text>);
    }

    let disabled = this.props.state.Meeting.selectedRepeatType == "NR" ? true: false;
    return (
      <View style={{ paddingTop: 30 }}>
        <Item 
          disabled = {disabled}
          style={{
            backgroundColor: this.props.style.InputFieldBackground,
            height         : this.props.style.inputHeightBase,
            paddingLeft    : 10,
            paddingRight   : 5,
          }}
          onPress  = {()=>{
            this.setState({ 
              showDatePicker: true,
              editDatetimeValue : this.props.state.Meeting.repeatEndDate == "" ? this.state.editDatetimeValue : new Date(this.props.state.Meeting.repeatEndDate)
            });
          }}
        >
            { 
              this.props.state.Meeting.selectedRepeatType == "NR" ? 
                null
              :
                <Label style={{flex: 0, color:"#FE1717"}}>{"*"}</Label>
            }
            <Label style={{flex:1}}>{this.props.lang.MeetingPage.needEndDate}</Label>
            { endRepeatDate }
            <Icon name='arrow-forward' />
        </Item>
        <Label style={{margin:10}}>{``}</Label>
      </View>
    );
  }

  setDatetime_ios = (event, date) => {
    this.setState({
      editDatetimeValue:date,
    });
  }

  setDatetime = () => {
    this.setState({
      showDatePicker : false,
      editDatetimeValue : new Date()
    });
    this.props.actions.setRepeatType({ 
      repeatEndDate: DateFormat( new Date(this.state.editDatetimeValue), "yyyy-mm-dd") 
    });
  }

  setDate = (date) => {
    if (date.type == "set") {
      this.setState({
        showDatePicker   :false,
        editDatetimeValue:new Date()
      });

      this.props.actions.setRepeatType({ 
        repeatEndDate: DateFormat( new Date(date.nativeEvent.timestamp), "yyyy-mm-dd") 
      });
    }else{
      this.setState({
        showDatePicker   :false,
        editDatetimeValue:new Date()
      });
    }
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
