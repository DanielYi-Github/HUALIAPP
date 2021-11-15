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
	    this.state = {
        /*
        repeatType:[
          {
            type:"NR",
            label:"不重複"
          },
          {
            type:"ED",
            label:"每天"
          },
          {
            type:"WD",
            label:"工作日(週一到週五)"
          },
          {
            type:"EW",
            label:"每週"
          },
          {
            type:"EM",
            label:"每月"
          },
          {
            type:"DM",
            label:"自定義"
          },
        ],
        selectedRepeatType:"NR",
        weekDays:[
          {
            value:"MON",
            label:"週一"
          },
          {
            value:"TUE",
            label:"週二"
          },
          {
            value:"WEB",
            label:"週三"
          },
          {
            value:"THU",
            label:"週四"
          },
          {
            value:"FRI",
            label:"週五"
          },
          {
            value:"SAT",
            label:"週六"
          },
          {
            value:"SUN",
            label:"週日"
          }
        ],
        selectedWeekDays:[],
        repeatEndDate:null,
        */
        startdate: props.route.params.startdate,
        enddate  : props.route.params.enddate,
      }
	}

  componentDidMount(){

  }

	render() {
    console.log(new Date(this.state.startdate));
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
          keyExtractor        ={item => item.id}
          data                ={this.state.repeatType}
          renderItem          ={this.renderItem}
          ListFooterComponent ={this.ListFooterComponent}
        />
      </Container>
    );
	}

  renderItem = (item) => {
    let isChecked = item.item.type == this.state.selectedRepeatType ? true: false;

    return (
      <Item 
        style={{
          backgroundColor: this.props.style.InputFieldBackground,
          height         : this.props.style.inputHeightBase,
          paddingLeft    : 10,
          paddingRight   : 5,
        }}
        onPress  = {()=>{
          this.setState({ selectedRepeatType:item.item.type });
        }}
      >
          <Label style={{flex:1}}>{item.item.label}</Label>
          {
            isChecked ?
              <CheckBox
                disabled      ={ Platform.OS == "android" ? false : true }
                onValueChange={(newValue) => {
                  this.setState({ selectedRepeatType:item.item.type });
                }}
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

  ListFooterComponent = () => {
    return (
      <View style={{
        paddingTop: 30,
        paddingBottom: 50
      }}>
        <Item 
          style={{
            backgroundColor: this.props.style.InputFieldBackground,
            height         : this.props.style.inputHeightBase,
            paddingLeft    : 10,
            paddingRight   : 5,
          }}
          onPress  = {()=>{
            // this.setState({ selectedRepeatType:item.item.type });
          }}
        >
            <Label style={{flex:1}}>{"結束日期"}</Label>
            <Label >{"不能超過一年"}</Label>
            <Icon name='arrow-forward' />
        </Item>
        <Label style={{margin:10}}>{``}</Label>
      </View>
    );
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
