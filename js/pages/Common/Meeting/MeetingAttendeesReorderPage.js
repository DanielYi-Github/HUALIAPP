import React from 'react';
import { View, FlatList, RefreshControl, VirtualizedList, Platform, Alert, Keyboard, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Content, Body, Right, Item, Input, Button, Icon, Title, Text, Card, CardItem, Label, Footer, connectStyle } from 'native-base';
import * as NavigationService from '../../../utils/NavigationService';
import * as MeetingAction     from '../../../redux/actions/MeetingAction';
import SortableRow         from '../../../components/Form/SortableRow';
import SortableList from 'react-native-sortable-list';

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

      return (
        <View style                 ={{flex:1}}>
          <Header style={this.props.style.HeaderBackground}>
            <Left>
              <Button transparent onPress={() =>NavigationService.goBack()}>
                <Label style={{marginLeft: 5}}>{this.props.state.Language.lang.Common.Cancel}</Label>
              </Button>
            </Left>
            <Body onPress={()=>{ this.setState({ isShowSearch:true });}}>
                <Title style={{color:this.props.style.color}} onPress={()=>{ this.setState({ isShowSearch:true });}}>
                  {this.props.state.Language.lang.MeetingPage.selectedAttendeeReorder}{/*已選與會人員排序*/}
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
            <SortableList
              style                 ={{flex:1}}
              contentContainerStyle ={{width: this.props.style.PageSize.width}}
              data                  ={this.props.state.Meeting.attendees}
              renderRow             ={this.renderSortableRow} 
              onReleaseRow          ={(key,currentOrder)=>{ this.changeDefaultvalueArray(currentOrder);}}
            />

          <Footer>
            <Body>
              <Text style={{marginLeft: 15}}>{`${this.props.state.Language.lang.MeetingPage.selected} ${checkedAttendees} ${this.props.state.Language.lang.MeetingPage.person}`}</Text>
            </Body>
            <Right>
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

    renderSortableRow = ({key, index, data, disabled, active}) => {
      return (
        <SortableRow 
          data           ={data} 
          active         ={active} 
          index          ={index}
          onCheckBoxTap  ={this.onCheckBoxTap}
          name           ={data.name}
          departmentName ={data.depname}
        />
      )
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