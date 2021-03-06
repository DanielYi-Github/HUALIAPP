import React from 'react';
import { View, FlatList, RefreshControl, VirtualizedList, Platform, Alert, Keyboard, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Content, Body, Right, Item, Input, Button, Icon, Title, Text, Card, CardItem, Label, Footer, connectStyle } from 'native-base';
import * as NavigationService from '../../../utils/NavigationService';
import * as MeetingAction     from '../../../redux/actions/MeetingAction';
import SortableRow         from '../../../components/Form/SortableRow';
import MeetingSelectAttendeesFooter from '../../../components/Meeting/MeetingSelectAttendeesFooter';
import CheckBox from '@react-native-community/checkbox';

import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";


import { connect }   from 'react-redux';
import { bindActionCreators } from 'redux';

class MeetingAttendeesReorderPage extends React.Component {
    constructor(props) {
      super(props);
      
      let attendees = props.state.Meeting.attendees;
      for(let person of attendees){
        person.checked = false;
      }
      this.props.actions.setAttendees(attendees);
    }

    render() {
      let checkedAttendees = 0;
      for(let person of this.props.state.Meeting.attendees){
        if(person.checked) checkedAttendees++
      }
      let isCheckedAllAttendees = checkedAttendees == this.props.state.Meeting.attendees.length ? true: false;
      isCheckedAllAttendees = 0 == this.props.state.Meeting.attendees.length ? false: isCheckedAllAttendees;

      return (
        <View style ={{height: "100%", width: '100%'}}>
          <Header style={this.props.style.HeaderBackground}>
            <Left>
              <Button transparent onPress={() =>NavigationService.goBack()}>
                <Label style={{marginLeft: 5}}>{this.props.state.Language.lang.Common.Cancel}</Label>
              </Button>
            </Left>
            <Body onPress={()=>{ this.setState({ isShowSearch:true });}}>
                <Title style={{color:this.props.style.color}} onPress={()=>{ this.setState({ isShowSearch:true });}}>
                  {this.props.state.Language.lang.MeetingPage.selectedAttendeeReorder}
                </Title>
            </Body>
            <Right style={{alignItems: 'center'}}>
              <TouchableOpacity 
                style={{
                  backgroundColor: '#47ACF2', 
                  paddingLeft: 10, 
                  paddingRight: 10,
                  paddingTop: 5,
                  paddingBottom: 5, 
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#47ACF2'
                }}
                onPress={()=>{
                  NavigationService.goBack();
                }}
              >
                <Text style={{color: '#FFF'}}>{this.props.state.Language.lang.CreateFormPage.Done}</Text>
              </TouchableOpacity>
            </Right>
          </Header>
          <DraggableFlatList
            extraData    ={this.props.state.Meeting} 
            data         ={this.props.state.Meeting.attendees}
            onDragEnd    ={({ data }) => this.props.actions.setAttendees(data)}
            keyExtractor ={(item) => item.key}
            renderItem   ={this.renderSortableRow}
          />
          <Footer>
            <Item style={{borderWidth: 1, paddingLeft: 10, borderBottomWidth: 0, borderWidth: 1}}
              onPress ={()=>{
                this.onAllCheckBoxTap(!isCheckedAllAttendees);
              }} 
            >
                <CheckBox
                  disabled      ={ Platform.OS == "android" ? false : true }
                  onValueChange={(newValue) => {
                    if (Platform.OS == "android") this.onAllCheckBoxTap(!isCheckedAllAttendees);
                  }}
                  value             = {isCheckedAllAttendees}
                  boxType           = {"square"}
                  onCheckColor      = {"#F44336"}
                  onTintColor       = {"#F44336"}
                  tintColors        = {{true: "#F44336", false: '#aaaaaa'}}
                  style             = {{ marginRight: 20 }}
                  animationDuration = {0.01}
                />
                  <Label>{this.props.state.Language.lang.Common.selectAll}</Label>
            </Item>
            <Body style={{justifyContent: 'flex-end', paddingRight: 10 }}>
              <Text style={{marginLeft: 15}}>
                {`${this.props.state.Language.lang.MeetingPage.selected} ${checkedAttendees} ${this.props.state.Language.lang.MeetingPage.person}`}
                </Text>
            </Body>
            <Right style={{flex: 0}}>
              <TouchableOpacity 
                style={{
                  marginRight    : 15,
                  paddingLeft    : 10, 
                  paddingRight   : 10,
                  paddingTop     : 5,
                  paddingBottom  : 5, 
                  borderRadius   : 10,
                  borderWidth    : 1,
                  backgroundColor: checkedAttendees == 0 ? "#757575": '#F44336', 
                  borderColor    : checkedAttendees == 0 ? "#757575": '#F44336'
                }}
                onPress={()=>{
                  this.removeCheckItem();
                }}
                disabled={checkedAttendees == 0 ? true: false}
              >
                <Text style={{color: '#FFF'}}>{this.props.state.Language.lang.PublishSubmitPage.Delete}</Text>
              </TouchableOpacity>
            </Right>
          </Footer>
        </View>
        
      )
    };
   
   renderSortableRow = ({item, drag, isActive}) => {
    return(
      <SortableRow 
        data           ={item} 
        active         ={isActive} 
        index          ={item.index}
        onCheckBoxTap  ={this.onCheckBoxTap}
        name           ={item.name}
        departmentName ={item.depname}
        onLongPress    ={drag}
      />
    );

   }

    changeDefaultvalueArray = (currentOrder) => {
      let array = [];
      for(let index of currentOrder){
        index = parseInt(index);
        array.push(this.props.state.Meeting.attendees[index]);
      }
      this.props.actions.setAttendees(array);
    }

    onCheckBoxTap = (index, data) => {
      let array = this.props.state.Meeting.attendees;
      array[index].checked = !array[index].checked;
      this.props.actions.setAttendees(array);
    }

    onAllCheckBoxTap = (isCheckedAllAttendees) => {
      let array = this.props.state.Meeting.attendees;
      for(let item of array){
        item.checked = isCheckedAllAttendees;
      }
      this.props.actions.setAttendees(array);
    }

    removeCheckItem = () => {
      let array = [];
      for(let item of this.props.state.Meeting.attendees){
        if (item.checked == false) {
          array.push(item);
        }
      }
      this.props.actions.setAttendees(array);
    }
};

export let MeetingAttendeesReorderPageStyle = connectStyle( 'Page.FormPage', {} )(MeetingAttendeesReorderPage);

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
)(MeetingAttendeesReorderPageStyle);

