import React from 'react';
import { View, Keyboard, SafeAreaView, SectionList, StyleSheet } from 'react-native';
import { Container, Header, Body, Left, Right, Button, Item, Icon, Input, Title, Text, Label, Segment, Card, CardItem, connectStyle} from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionButton from 'react-native-action-button';
import ActionSheet  from 'react-native-actionsheet';
import SearchInput, { createFilter } from 'react-native-search-filter'; 
const KEYS_TO_FILTERS = ['EMPID', 'DEPNAME', 'NAME', 'MAIL', 'SKYPE', 'CELLPHONE','TELPHONE','JOBTITLE'];

import * as NavigationService from '../../../utils/NavigationService';
import HeaderForGeneral       from '../../../components/HeaderForGeneral';
import MeetingItemForPerson   from '../../../components/MeetingItemForPerson';
import MeetingTimeSuggestItem from '../../../components/MeetingTimeSuggestItem'; 
import NoMoreItem             from '../../../components/NoMoreItem';
import * as MeetingAction     from '../../../redux/actions/MeetingAction';

class MeetingTimeForPersonPage extends React.PureComponent  {
	constructor(props) {
	    super(props);
	    this.state = {
        meetingDateTime : props.route.params.searchMeetingResult ? props.route.params.searchMeetingResult:[],
        meetingParams   : props.route.params.meetingParams,
        isShowMoreButton: false
      }
	}

	render() {
    let meetingDateTime = this.formatPersonDateTime(this.state.meetingDateTime);
    return (
      <Container>
      <HeaderForGeneral
        isLeftButtonIconShow  = {true}
        leftButtonIcon        = {{name:"arrow-back"}}
        leftButtonOnPress     = {() =>NavigationService.goBack()} 
        isRightButtonIconShow = {true}
        rightButtonIcon       = {{name:"timer-outline"}}
        rightButtonOnPress    = {null} 
        title                 = {`參與人的會議時程`}
        isTransparent         = {false}
      />
        <SectionList
          sections            ={meetingDateTime}
          keyExtractor        ={(item, index) => item + index}
          renderItem          ={this.renderItem}
          ListEmptyComponent  ={this.renderEmptyComponent}
          renderSectionHeader ={({ section: { title } }) => (
            <Label 
              style={{
                backgroundColor: this.props.style.containerBgColor,
                paddingLeft: '3%'
              }}
            >
              {title}
            </Label >
          )}
        />
        <View style={{ height: 1, backgroundColor: '#e6e6e6', width: '90%', alignSelf: 'center' }}/>
      {/*
        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item 
            buttonColor='#3498db' 
            title="智能搜尋可會議時間" 
            onPress={() => {
              console.log(this.state.meetingParams);
            }}
          >
            <Icon 
              name="selection-search" 
              style={styles.actionButtonIcon} 
              type="MaterialCommunityIcons"
            />
          </ActionButton.Item>      
        </ActionButton>
        */}
      </Container>
    );
	}

  renderItem = (item) => {
    let itemComponent;
    switch (item.item) {
      case 'SuggestMeetingDateTime':
        itemComponent = (
          <MeetingTimeSuggestItem
            text={"建議安排會議時間"}
            data={item.item}
            onPress={()=>{
              //顯示此人有哪些會議
              NavigationService.navigate("MeetingInsert", {
                meeting: this.state.meetingParams,
                fromPage:"MeetingSearch"
              });
            }}
          />
        );
        break;
      case 'MoreButton':
       itemComponent = (
         <Card style={{alignSelf: 'center'}}>
          <CardItem button 
            onPress={()=>{
              console.log(this.state.meetingDateTime);
              //顯示此人有哪些會議
              NavigationService.navigate("MeetingTimeForPerson", {
                meetingDateTime: this.state.meetingDateTime,
              });
            }}
            style={{alignSelf: 'center'}}
          >
            <Text>{"查看更多"}</Text>
          </CardItem>
         </Card>
       );

        break;
      default:
        itemComponent = (
          <MeetingItemForPerson 
            name={item.section.meetings[item.index].name}
            item={item.item}
            data={item.section.meetings[item.index]}
          />
        );
    }

    return itemComponent;
  }

  renderEmptyComponent = () => {
    return (
      <NoMoreItem
        text={"暫時無會議"}
      />
    )
  }

  ListFooterComponent = () => {
    return (
      <NoMoreItem
        text={"查看更多已安排會議"}
      />
    )
  }

  formatPersonDateTime(meetings){
    let isShowMoreButton = false;
    if (meetings.length > 5) {
      meetings = meetings.slice(0, 5);
      isShowMoreButton = true;
      this.setState({
        isShowMoreButton:isShowMoreButton
      });
    }

    let dateArray = [];
    for(let [i, dateMeeting] of meetings.entries()){
      if (dateArray.length == 0) {
        dateMeeting.type = "Meetings";
        dateArray.push({
          title:dateMeeting.date,
          data:[dateMeeting.date],
          meetings:[dateMeeting]
        })
      } else {
        dateMeeting.type = "Meetings";
        if (dateMeeting.date == dateArray[dateArray.length-1].title) {
          dateArray[dateArray.length-1].data.push(dateMeeting.date);
          dateArray[dateArray.length-1].meetings.push(dateMeeting);
        } else {
          dateArray.push({
            title:dateMeeting.date,
            data:[dateMeeting.date],
            meetings:[dateMeeting]
          })
        }
      }

      // 加入新增更多的按鈕
      if ( isShowMoreButton && i+1 == meetings.length ) {
        let moreButton = { type: "MoreButton" };
        dateArray[dateArray.length-1].data.push("MoreButton");
        dateArray[dateArray.length-1].meetings.push(moreButton);
      }
    }

    dateArray.push({
      title:"建議會議時間",
      data:["SuggestMeetingDateTime"],
      suggestDateTime:[{}],
    })
    return dateArray;
  }
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

let MeetingTimeForPersonPageStyle = connectStyle( 'Page.MeetingPage', {} )(MeetingTimeForPersonPage);
export default connect(
  (state) => ({
    state: { ...state }
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...MeetingAction
    }, dispatch)
  })
)(MeetingTimeForPersonPageStyle);

