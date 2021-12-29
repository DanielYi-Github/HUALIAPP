import React from 'react';
import { View, Keyboard, TouchableOpacity, Platform, Modal, Alert, FlatList } from 'react-native';
import { Container, Header, Content, Item, Icon, Input, Text, Label, Button, ListItem, Spinner, Switch, Right, connectStyle} from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DateFormat from  'dateformat';
import ActionSheet from 'react-native-actionsheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from '@react-native-community/checkbox';


import HeaderForGeneral       from '../../../components/HeaderForGeneral';
import * as NavigationService from '../../../utils/NavigationService';
import * as MeetingAction     from '../../../redux/actions/MeetingAction';


class MeetingInsertWithRegularCustomizePage extends React.PureComponent  {
	constructor(props) {
	    super(props);

	}

  componentDidMount(){
  }

	render() {
    return (
      <Container>
        <HeaderForGeneral
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:"arrow-back"}}
          leftButtonOnPress     = {() =>NavigationService.goBack()} 
          isRightButtonIconShow = {false}
          rightButtonIcon       = {null}
          rightButtonOnPress    = {null} 
          title                 = {this.props.lang.MeetingPage.customEveryWeek}
          isTransparent         = {false}
        />
        
        <FlatList
          keyExtractor        ={item => item.id}
          data                ={this.props.state.Meeting.weekDays}
          ListHeaderComponent ={this.ListHeaderComponent}
          renderItem          ={this.renderItem}
          ListFooterComponent ={this.ListFooterComponent}
        />

      </Container>
    );
	}

  ListHeaderComponent = () => {
    return (
      <Item 
        style={{
          backgroundColor: this.props.style.InputFieldBackground,
          height         : this.props.style.inputHeightBase,
          paddingLeft    : 10,
          paddingRight   : 5,
          marginBottom   : 35
        }}
      >
          <Label style={{flex:1}}>{this.props.lang.MeetingPage.frequency}</Label>
          <Label >{this.props.lang.MeetingPage.frequencyByWeek}</Label>
      </Item>
    );
  }

  renderItem = (item) => {
    let isChecked = false;
    for(let selected of this.props.state.Meeting.selectedWeekDays){
      if( item.item.value == selected ){
        isChecked = true;
        break;
      }
    }

    let label = this.props.lang.MeetingPage.weekDays[item.item.value];
    return (
      <Item 
        style={{
          backgroundColor: this.props.style.InputFieldBackground,
          height         : this.props.style.inputHeightBase,
          paddingLeft    : 10,
          paddingRight   : 5,
        }}
        onPress  = {()=>{ this.setRepeatWeekDays(item.item.value); }}
      >
          <Label style={{flex:1}}>{label}</Label>
          <CheckBox
            disabled      ={ Platform.OS == "android" ? false : true }
            onValueChange={(newValue) => { this.setRepeatWeekDays(item.item.value); }}
            value             = {isChecked}
            boxType           = {"square"}
            onCheckColor      = {"#00C853"}
            onTintColor       = {"#00C853"}
            tintColors        = {{true: "#00C853", false: '#00C853'}}
            style             = {{ marginRight: 20 }}
            animationDuration = {0.01}
          />
      </Item>
    )
  }

  setRepeatWeekDays = (value) => {
    let selectedWeekDays = this.props.state.Meeting.selectedWeekDays;
    let isInclude = false;
    let inclueIndex = 0;
    selectedWeekDays.forEach((select, index) => {
      if(select == value){
        isInclude = true;
        inclueIndex = index;
      }
    });

    if( isInclude ){
      selectedWeekDays.splice(inclueIndex, 1);
    } else {
      selectedWeekDays.push(value);
    }

    this.props.actions.setRepeatType({ selectedWeekDays:selectedWeekDays });
  }


  componentWillUnmount () {
    if(this.props.state.Meeting.selectedWeekDays.length == 0){
      this.props.actions.setRepeatType({ 
        selectedRepeatType:"NR" 
      });
    }
  }
}

let MeetingInsertWithRegularCustomizePageStyle = connectStyle( 'Page.MeetingPage', {} )(MeetingInsertWithRegularCustomizePage);
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
)(MeetingInsertWithRegularCustomizePageStyle);
