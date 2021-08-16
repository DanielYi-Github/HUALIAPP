import React from 'react';
import { View, FlatList, RefreshControl, VirtualizedList, Platform, Alert, Keyboard, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Content, Body, Right, Item, Input, Button, Icon, Title, Text, Card, CardItem, Label, connectStyle } from 'native-base';
import * as NavigationService from '../../../utils/NavigationService';
import * as MeetingAction     from '../../../redux/actions/MeetingAction';
import SortableRow         from '../../../components/Form/SortableRow';
import SortableList from 'react-native-sortable-list';



import { connect }   from 'react-redux';
import { bindActionCreators } from 'redux';

class MeetingAttendeesReorderPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        attendees :this.props.route.params.attendees  //參與人
      };
    }

    render() {
      console.log(this.state.attendees);
      return (
        <Container>
          <Header style={this.props.style.HeaderBackground}>
            <Left>
              <Button transparent onPress={() =>NavigationService.goBack()}>
                <Label style={{marginLeft: 5}}>{"取消"}</Label>
              </Button>
            </Left>
            <Body onPress={()=>{ this.setState({ isShowSearch:true });}}>
                <Title style={{color:this.props.style.color}} onPress={()=>{ this.setState({ isShowSearch:true });}}>
                  {"已選與會人員排序"}
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
                  // this.state.sendValueBack(this.state.attendees);
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
            data                  ={this.state.attendees}
            renderRow             ={this.renderSortableRow} 
            onReleaseRow          ={(key,currentOrder)=>{ this.changeDefaultvalueArray(currentOrder);}}
          />
        </Container>
      )
    };

    renderSortableRow = ({key, index, data, disabled, active}) => {
      // 中間的字會不見
      return <SortableRow 
            data={data} 
            active={active} 
            index={index}
            onCheckBoxTap = {this.onCheckBoxTap}
          />
    }

    changeDefaultvalueArray = (currentOrder) => {
      /*
      let array = [];
      for(let index of currentOrder){
        index = parseInt(index);
        array.push(this.props.data.defaultvalue[index]);
      }
      this.props.onPress(array, this.props.data);
      */
    }

    onCheckBoxTap = (index, data) => {

      // let array = this.props.data.defaultvalue;
      // array[index].checked = !array[index].checked;
      // this.props.onPress(array, this.props.data);
    }

    removeCheckItem = () => {
      let array = [];
      for(let item of this.props.data.defaultvalue){
        if (item.checked == false) {
          array.push(item);
        }
      }
      this.props.onPress(array, this.props.data);
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