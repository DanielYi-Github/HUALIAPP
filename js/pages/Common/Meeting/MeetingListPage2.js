import React from 'react';
import { View, Keyboard, SafeAreaView, SectionList, Dimensions, Alert } from 'react-native';
import { Container, Header, Body, Left, Right, Button, Item, Icon, Input, Title, Text, Label, Segment, connectStyle} from 'native-base';
import { tify, sify} from 'chinese-conv'; 
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SearchInput, { createFilter } from 'react-native-search-filter'; 
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

const KEYS_TO_FILTERS = ['initiator.id'];
const Invited_TO_FILTERS = [ "chairperson.id", "chairperson.name", "attendees.id", "attendees.name" ];
const SearchingKey_TO_FILTERS = [
  'subject', 
  'description', 
  'datetime.date',
  'datetime.starttime', 
  'datetime.endtime', 
  'meetingPlace', 
  'initiator.id', 
  'initiator.name', 
  "chairperson.id", 
  "chairperson.name",
  "attendees.id",
  "attendees.name"
];

import * as NavigationService from '../../../utils/NavigationService';
import HeaderForSearch        from '../../../components/HeaderForSearch';
import MeetingItem            from '../../../components/Meeting/MeetingItem';
import NoMoreItem             from '../../../components/NoMoreItem';
import * as MeetingAction     from '../../../redux/actions/MeetingAction';

class MeetingListPage extends React.PureComponent  {
	constructor(props) {
	    super(props);
	    this.state = {
        isChinesKeyword:false,       //用來判斷關鍵字是否為中文字
        keyword        :"",          //一般搜尋
        sKeyword       :"",          //簡體中文
        tKeyword       :"",          //繁體中文
        isShowSearch   :false,
        showFooter     :false,
        SegmentButton  :"all",
        isEnd          :false,
        screenWidth    :Dimensions.get('window').width,
        isLoading      :false,

        readyOpenMeetingParam:props.route.params ?  props.route.params.readyOpenMeetingParam : false,
      }
	}

  componentDidMount(){
    if (
      this.props.state.Meeting.meetingList.length == 0 
      && 
      this.props.state.Meeting.isRefreshing_for_background == false
    ) {
      this.props.actions.getMeetings();
      this.setState({
        isEnd:false
      });  
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(
      nextProps.state.Meeting.isRefreshing_for_background == false &&
      this.state.readyOpenMeetingParam
    ){
      let isSearchedMeeting = false;
      for(let meeting of nextProps.state.Meeting.meetingList){
        if ( this.state.readyOpenMeetingParam.oid == meeting.oid) {
          isSearchedMeeting = true;
          break;
        }
      }

      if (isSearchedMeeting) {
        NavigationService.navigate("MeetingInsert", {
            meetingParam: this.state.readyOpenMeetingParam,
            fromPage:"MessageFuc"
          });


      } else {
        Alert.alert( nextProps.state.Language.lang.MeetingPage.meetingAlreadyDone, "",
          [
            {
              text: nextProps.state.Language.lang.Common.Close,   // 關閉 
              style: 'cancel',
              onPress: () => {}, 
            }
          ],
        )
      }

      this.setState({ readyOpenMeetingParam : false });
    }


    if (nextProps.state.Meeting.meetingList.length == this.props.state.Meeting.meetingList.length) {
      this.setState({
        isEnd:true
      });
    }else{
      if (
        nextProps.state.Meeting.meetingList.length == 0 
        && 
        nextProps.state.Meeting.isRefreshing_for_background == false
      ) {
        this.props.actions.getMeetings();
        this.setState({
          isEnd:false
        });  
      }
    }
  }

	render() {
    let userId = this.props.state.UserInfo.UserInfo.id;
    let meetingList = this.props.state.Meeting.meetingList;
    let managerMeeting = meetingList.filter(value => value.manager).length > 0 ? true : false;
    let btnWidth = managerMeeting ? this.state.screenWidth / 4 : this.state.screenWidth / 3;
    let keySearched = [];
    // 關鍵字搜尋的整理
    if (this.state.isShowSearch) {
        if (this.state.isChinesKeyword) {
          meetingList = meetingList.filter(createFilter(this.state.sKeyword, SearchingKey_TO_FILTERS));
          let meetingListFortKeyword = meetingList.filter(createFilter(this.state.tKeyword, SearchingKey_TO_FILTERS));
          meetingList = this.dedup([...meetingList, ...meetingListFortKeyword]);
        } else {
          meetingList = meetingList.filter(createFilter(this.state.keyword, SearchingKey_TO_FILTERS));
        }
    }

    // 需要過濾的代碼處理
    switch (this.state.SegmentButton) {
      case 'create':
        meetingList = meetingList.filter(createFilter(userId, KEYS_TO_FILTERS))
        break;
      case 'invited':
        meetingList = meetingList.filter(createFilter(userId, Invited_TO_FILTERS))
        break;
      case 'manager':
        meetingList = meetingList.filter(value => value.manager)
        break;
    }

    // 整理顯示會議內容的顯示格式
    meetingList = this.formatMeetingDate(meetingList);
    return (
      <Container>
        <HeaderForSearch
          isShowSearch = {this.state.isShowSearch}
          placeholder  = {this.props.state.Language.lang.ContactPage.SearchKeyword}
          onChangeText ={(text) => { 
              let sText = sify(text);   //簡體中文
              let tText = tify(text);   //繁體中文
              if (tText === sText) {    // 不是中文字
                this.setState({ 
                  keyword:text,
                  isChinesKeyword:false
                }); 
              } else {                  // 是中文字
                this.setState({ 
                  sKeyword:sText,
                  tKeyword:tText,
                  isChinesKeyword:true
                }); 
              }
          }}
          closeSearchButtomOnPress={() =>{
            this.setState({ 
              isShowSearch   :false,
              isChinesKeyword:false, 
              keyword        :"",    
              sKeyword       :"",    
              tKeyword       :"",
            })
          }}
          searchButtomOnPress={Keyboard.dismiss}
          searchButtomText={this.props.state.Language.lang.Common.Search}
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:'arrow-back'}}
          leftButtonOnPress     = {() =>NavigationService.goBack()} 
          isRightButtonIconShow = {true}
          rightButtonIcon       = {{name:'search'}}
          rightButtonOnPress    = {()=>{ this.setState({ isShowSearch:true }); }} 
          title                 = {this.props.lang.MeetingPage.myMeetings} //"我的會議"
          titleOnPress          = {()=>{ this.setState({ isShowSearch:true }) }}
        />
        <Segment style={{backgroundColor: "rgba(0,0,0,0)"}}>
          <Button 
            first 
            style={{width: btnWidth, justifyContent: 'center' }} 
            active={this.state.SegmentButton == "all"}
            onPress={()=>{
              this.setState({SegmentButton:"all"});
            }}
          >
            <Text>{this.props.lang.MeetingPage.all}</Text>
          </Button>
          <Button 
            style={{width: btnWidth, justifyContent: 'center'}} 
            active={this.state.SegmentButton == "create"}
            onPress={()=>{
              this.setState({SegmentButton:"create"});
            }}
          >
            <Text>{this.props.lang.MeetingPage.initiator}</Text>
          </Button>
          <Button 
            last = {managerMeeting ? false: true}
            style={{width: btnWidth, justifyContent: 'center'}} 
            active={this.state.SegmentButton == "invited"}
            onPress={()=>{
              this.setState({SegmentButton:"invited"});
            }}
          >
            <Text>{this.props.lang.MeetingPage.invited}</Text>
          </Button>
          {
            managerMeeting ? 
              <Button 
                last 
                style={{width: btnWidth, justifyContent: 'center'}} 
                active={this.state.SegmentButton == "manager"}
                onPress={()=>{
                  this.setState({SegmentButton:"manager"});
                }}
              >
                <Text>{this.props.lang.MeetingPage.Notified}</Text>
              </Button>
            :
              null
          }         
        </Segment>
        <Agenda
          // The list of items that have to be displayed in agenda. If you want to render item as empty date
          // the value of date key has to be an empty array []. If there exists no value for date key it is
          // considered that the date in question is not yet loaded
          items={{
            '2012-05-22': [{name: 'item 1 - any js object'}],
            '2012-05-23': [{name: 'item 2 - any js object', height: 80}],
            '2012-05-24': [],
            '2012-05-25': [{name: 'item 3 - any js object'}, {name: 'any js object'}]
          }}
          // Callback that gets called when items for a certain month should be loaded (month became visible)
          loadItemsForMonth={month => {
            console.log('trigger items loading');
          }}
          // Callback that fires when the calendar is opened or closed
          onCalendarToggled={calendarOpened => {
            console.log(calendarOpened);
          }}
          // Callback that gets called on day press
          onDayPress={day => {
            console.log('day pressed');
          }}
          // Callback that gets called when day changes while scrolling agenda list
          onDayChange={day => {
            console.log('day changed');
          }}
          // Initially selected day
          selected={'2012-05-16'}
          // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
          minDate={'2012-05-10'}
          // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
          maxDate={'2012-05-30'}
          // Max amount of months allowed to scroll to the past. Default = 50
          pastScrollRange={50}
          // Max amount of months allowed to scroll to the future. Default = 50
          futureScrollRange={50}
          // Specify how each item should be rendered in agenda
          renderItem={(item, firstItemInDay) => {
            return <View />;
          }}
          // Specify how each date should be rendered. day can be undefined if the item is not first in that day
          renderDay={(day, item) => {
            return <View />;
          }}
          // Specify how empty date content with no items should be rendered
          renderEmptyDate={() => {
            return <View />;
          }}
          // Specify how agenda knob should look like
          renderKnob={() => {
            return <View />;
          }}
          // Specify what should be rendered instead of ActivityIndicator
          renderEmptyData={() => {
            return <View />;
          }}
          // Specify your item comparison function for increased performance
          rowHasChanged={(r1, r2) => {
            return r1.text !== r2.text;
          }}
          // Hide knob button. Default = false
          hideKnob={true}
          // When `true` and `hideKnob` prop is `false`, the knob will always be visible and the user will be able to drag the knob up and close the calendar. Default = false
          showClosingKnob={false}
          // By default, agenda dates are marked if they have at least one item, but you can override this if needed
          markedDates={{
            '2012-05-16': {selected: true, marked: true},
            '2012-05-17': {marked: true},
            '2012-05-18': {disabled: true}
          }}
          // If disabledByDefault={true} dates flagged as not disabled will be enabled. Default = false
          disabledByDefault={true}
          // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly
          onRefresh={() => console.log('refreshing...')}
          // Set this true while waiting for new data from a refresh
          refreshing={false}
          // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView
          refreshControl={null}
          // Agenda theme
          theme={{
            // ...calendarTheme,
            agendaDayTextColor: 'yellow',
            agendaDayNumColor: 'green',
            agendaTodayColor: 'red',
            agendaKnobColor: 'blue'
          }}
          // Agenda container style
          style={{}}
        />
        {/*
          <SectionList
            extraData           ={this.props.state.Meeting.meetingList} 
            sections            ={meetingList}
            keyExtractor        ={(item, index) => item + index}
            renderItem          ={this.renderItem}
            renderSectionHeader ={({ section: { title } }) => (
              <Label 
                style={{
                  backgroundColor: this.props.style.containerBgColor,
                  paddingLeft: '3%',
                  paddingTop: 5,
                  paddingBottom: 5
                }}
              >
                {title}
              </Label >
            )}
            ListFooterComponent   = {this.renderFooter}
          />
        */}
      </Container>
    );
	}

  formatMeetingDate(meetings){
    let dateArray = [];
    for(let dateMeeting of meetings){
      
      var res = dateMeeting.startdate.split(" ");
      if (dateArray.length == 0) {
        dateArray.push({
          title:res[0],
          data:[dateMeeting.oid],
          meetings:[dateMeeting]
        })
      } else {
        if (res[0] == dateArray[dateArray.length-1].title) {
          dateArray[dateArray.length-1].data.push(dateMeeting.oid);
          dateArray[dateArray.length-1].meetings.push(dateMeeting);
        } else {
          dateArray.push({
            title:res[0],
            data:[dateMeeting.oid],
            meetings:[dateMeeting]
          })
        }
      }
    }
    return dateArray;
  }

  renderItem = (item) => {
    let items = item.item;
    return (
      <MeetingItem 
        item={items}
        data={item.section.meetings[item.index]}
        onPress = {() => this.navigateDetaile(item.section.meetings[item.index])}
        lang = {this.props.lang.MeetingPage}
      />
    );
  }

  navigateDetaile = (item) => {
    NavigationService.navigate("MeetingInsert", {
      meeting: item,
      fromPage:"MeetingList"
    });
  }

  renderFooter = () => {
    if (this.props.state.Meeting.isRefreshing_for_background) {
      return <NoMoreItem text={this.props.state.Language.lang.ListFooter.Loading}/>;
    } else {
      return (<NoMoreItem text={this.props.state.Language.lang.ListFooter.NoMore}/>);         
    }
  }

  // 去除重複的數組
  dedup(arr) {
    var hashTable = {};

    return arr.filter(function (el) {
      var key = JSON.stringify(el);
      var match = Boolean(hashTable[key]);

      return (match ? false : hashTable[key] = true);
    });
  }
}

let MeetingListPageStyle = connectStyle( 'Page.MeetingPage', {} )(MeetingListPage);
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
)(MeetingListPageStyle);

