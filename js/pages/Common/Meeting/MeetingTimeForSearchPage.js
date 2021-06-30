import React from 'react';
import { View, Keyboard, SafeAreaView, SectionList, StyleSheet } from 'react-native';
import { Container, Header, Body, Left, Right, Button, Item, Icon, Input, Title, Text, Label, Segment, Card, CardItem, Spinner, connectStyle} from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionSheet  from 'react-native-actionsheet';
import SearchInput, { createFilter } from 'react-native-search-filter'; 
const KEYS_TO_FILTERS = ['EMPID', 'DEPNAME', 'NAME', 'MAIL', 'SKYPE', 'CELLPHONE','TELPHONE','JOBTITLE'];
import DateFormat             from  'dateformat';


import * as NavigationService from '../../../utils/NavigationService';
import HeaderForGeneral       from '../../../components/HeaderForGeneral';
import MeetingItemForPerson   from '../../../components/Meeting/MeetingItemForPerson';
import MeetingTimeSuggestItem from '../../../components/Meeting/MeetingTimeSuggestItem'; 
import NoMoreItem             from '../../../components/NoMoreItem';
import * as MeetingAction     from '../../../redux/actions/MeetingAction';


class MeetingTimeForPersonPage extends React.PureComponent  {
	constructor(props) {
	    super(props);
	    this.state = {
        meetingDateTime : props.route.params.searchMeetingResult ? props.route.params.searchMeetingResult:[],
        meetingParams   : this.deepClone(props.route.params.meetingParams),
        isShowMoreButton: false,
        freeTimeUnit: 60, // 30 60 120 240 
        freeTimeUnitOptions:[
          {
            label:"30分鐘",
            value:30
          },{
            label:"一小時",
            value:60
          },{
            label:"二小時",
            value:120
          },{
            label:"四小時",
            value:240
          }
        ]
      }
	}

  componentDidMount(){
    this.props.actions.getFreeDateTime(this.state.meetingParams, this.state.freeTimeUnit);
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
        rightButtonOnPress    = {()=>{ this.ActionSheet.show() }} 
        title                 = {`參與人的會議時程`}
        isTransparent         = {false}
      />
        <SectionList
          sections            ={meetingDateTime}
          keyExtractor        ={(item, index) => item + index}
          renderItem          ={this.renderItem}
          ListFooterComponent ={this.renderFooterComponent}
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
        {this.renderActionSheet()}
      </Container>
    );
	}

  renderItem = (item) => {
    let itemComponent = null;
    switch (item.item) {
      case 'SuggestMeetingDateTime':
        if (item.section.isRefreshing) {
          itemComponent = (
            null
            // <Spinner />
            // 載入撈取的ＵＩ需要玩善
            // <NoMoreItem text={this.props.state.Language.lang.ListFooter.Loading}/>
          );
        } else {
          
          itemComponent = (
            
            <MeetingTimeSuggestItem
              text={"建議安排會議時間"}
              data={item.section.suggestDateTime[item.index]}
              onPress={()=>{
                let meetingParams       = this.state.meetingParams;
                meetingParams.startdate = item.section.suggestDateTime[item.index].startdate;
                meetingParams.enddate   = item.section.suggestDateTime[item.index].enddate;
                NavigationService.navigate("MeetingInsert", { meeting: meetingParams, fromPage:"MeetingSearch" });
              }}
            />
            
          );
          
        }
        
        break;
      case 'MoreButton':
      
       itemComponent = (
         <Card style={{alignSelf: 'center'}}>
          <CardItem button 
            onPress={()=>{
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

  renderFooterComponent = () => {
    let component = null;
    let startdate = new Date( this.state.meetingParams.startdate.replace(' ', 'T')  );
    let enddate =new Date( this.state.meetingParams.enddate.replace(' ', 'T') )
    if (this.props.state.Meeting.isRefreshing) {
      component = (
        <Spinner />
      );
    } else {
      if (this.props.state.Meeting.suggestMeetingDateTime.length == 0) {
        component = (
          <Card>
            <CardItem >
              <Body style={{width:"95%", alignContent: 'flex-start'}}>
                <Text style={{color:"#757575", fontWeight: 'bold', fontSize: 22, marginTop: 3, marginBottom: 3}}>
                  {`無建議時間`}
                </Text>
                    <Text style={{color:"#757575", fontWeight: 'bold'}}>
                      {`${DateFormat( startdate, "m/dd HH:MM")} - ${DateFormat( enddate, "mm/dd HH:MM")}`}
                    </Text>
                <Body style={{width: '100%', flexDirection: 'row', alignContent: 'space-between', marginTop: 3, marginBottom: 3}} >
                  <Text style={{color:"#757575", fontWeight: 'bold'}}>
                    {`查無此段的建議會議時間，請點擊右上角修改會議長度或返回上頁調整會議時間。`}
                  </Text>
                </Body>
              </Body>
            </CardItem>
          </Card>
        );
      }
    }

    return component;
  }

  renderEmptyComponent = () => {
    return (
      null
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

    // if (this.props.state.Meeting.suggestMeetingDateTime.length != 0) {
    let data = [];
    for(let suggestMeetingDateTime of this.props.state.Meeting.suggestMeetingDateTime){
      data.push("SuggestMeetingDateTime");
    }
    dateArray.push({
      title          :"建議的會議時間",
      data           :data,
      suggestDateTime:this.props.state.Meeting.suggestMeetingDateTime,
      isRefreshing   :this.props.state.Meeting.isRefreshing
    });
    // }

    return dateArray;
  }

  renderActionSheet = () => { 
    let BUTTONS = [];
    for (let option of this.state.freeTimeUnitOptions) {
      BUTTONS.push(option.label);
    }
    BUTTONS.push(this.props.state.Language.lang.Common.Cancel);
    let CANCEL_INDEX = BUTTONS.length-1;

    return (
      <ActionSheet
      ref               ={o => this.ActionSheet = o}
      title             ={"請選擇"}
      options           ={BUTTONS}
      cancelButtonIndex ={CANCEL_INDEX}
      onPress           ={(buttonIndex) => { 
          if (buttonIndex != CANCEL_INDEX) {
            this.setState({
              freeTimeUnit: this.state.freeTimeUnitOptions[buttonIndex].value
            });
            this.props.actions.getFreeDateTime(
              this.state.meetingParams, this.state.freeTimeUnitOptions[buttonIndex].value
            );
          }
        }}  
      />
    );
  }

  deepClone(src) {
    return JSON.parse(JSON.stringify(src));
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

