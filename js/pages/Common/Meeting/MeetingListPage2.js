import React from 'react';
import { View, Keyboard, SafeAreaView, SectionList, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { Container, Header, Body, Left, Right, Button, Item, Icon, Input, Title, Text, Label, Segment, connectStyle} from 'native-base';
import { tify, sify} from 'chinese-conv'; 
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SearchInput, { createFilter } from 'react-native-search-filter'; 
import {Agenda, DateData, AgendaEntry, AgendaSchedule, LocaleConfig} from 'react-native-calendars';

let testIDs = {
  menu: {
    CONTAINER: 'menu',
    CALENDARS: 'calendars_btn',
    CALENDAR_LIST: 'calendar_list_btn',
    HORIZONTAL_LIST: 'horizontal_list_btn',
    AGENDA: 'agenda_btn',
    EXPANDABLE_CALENDAR: 'expandable_calendar_btn',
    WEEK_CALENDAR: 'week_calendar_btn'
  },
  calendars: {
    CONTAINER: 'calendars',
    FIRST: 'first_calendar',
    LAST: 'last_calendar'
  },
  calendarList: {CONTAINER: 'calendarList'},
  horizontalList: {CONTAINER: 'horizontalList'},
  agenda: {
    CONTAINER: 'agenda',
    ITEM: 'item'
  },
  expandableCalendar: {CONTAINER: 'expandableCalendar'},
  weekCalendar: {CONTAINER: 'weekCalendar'}
};

interface State { items?: AgendaSchedule; }

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
import MeetingItem2            from '../../../components/Meeting/MeetingItem2';
import NoMoreItem             from '../../../components/NoMoreItem';
import * as MeetingAction     from '../../../redux/actions/MeetingAction';

class MeetingListPage extends React.PureComponent  {
	constructor(props) {
    super(props);

    LocaleConfig.defaultLocale = props.lang.LangStatus;
    this.state = {
      isChinesKeyword      :false,       //用來判斷關鍵字是否為中文字
      keyword              :"",          //一般搜尋
      sKeyword             :"",          //簡體中文
      tKeyword             :"",          //繁體中文
      isShowSearch         :false,
      showFooter           :false,
      SegmentButton        :"all",
      screenWidth          :Dimensions.get('window').width,
      readyOpenMeetingParam:props.route.params ?  props.route.params.readyOpenMeetingParam : false,
      
      isFirstLoading       :true,
      selectedDay          : Date.now(),
      dateItems            :{},
      loadItems            :false
    }
	}

  componentDidMount(){
    if (
      this.props.state.Meeting.meetingList.length == 0 && 
      this.props.state.Meeting.isRefreshing_for_background == false
    ) {
      this.props.actions.getMeetings();
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
            fromPage: "MessageFuc"
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
      // 檢查有沒有關鍵字搜尋
      // 檢查有沒有過濾機制
      // 整理顯示會議內容的顯示格式
      // 進行空值日期補充
    }else{
      if (
        nextProps.state.Meeting.meetingList.length == 0 && 
        nextProps.state.Meeting.isRefreshing_for_background == false
      ) {
        this.props.actions.getMeetings();
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    let userId = this.props.state.UserInfo.UserInfo.id;
    let meetingList = this.props.state.Meeting.meetingList;

    // 檢查有沒有關鍵字搜尋
    if (nextState.isShowSearch) {
        if (nextState.isChinesKeyword) {
          meetingList = meetingList.filter(createFilter(nextState.sKeyword, SearchingKey_TO_FILTERS));
          let meetingListFortKeyword = meetingList.filter(createFilter(nextState.tKeyword, SearchingKey_TO_FILTERS));
          meetingList = this.dedup([...meetingList, ...meetingListFortKeyword]);
        } else {
          meetingList = meetingList.filter(createFilter(nextState.keyword, SearchingKey_TO_FILTERS));
        }
    }

    // 檢查有沒有過濾機制
    switch (nextState.SegmentButton) {
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

    if(nextState.loadItems) {
      nextState.loadItems = false;
    } else {
      // 進行空值日期補充
      meetingList = this.loadMoreItems(meetingList, nextState.selectedDay);
      nextState.dateItems = meetingList;    
      nextState.loadItems = false;
    }

    return {
      ...nextState,
    };
  }

  loadMoreItems = (items, selectedDay = Date.now()) => {
    for (let i = -15; i < 90; i++) {
      const time = selectedDay + i * 24 * 60 * 60 * 1000;
      const strTime = this.timeToString(time);

      if (!items[strTime]) {
        items[strTime] = [];
      }
    }
    return items;
  }

	render() {
    let managerMeeting = this.props.state.Meeting.meetingList.filter(value => value.manager).length > 0 ? true : false;
    let btnWidth = managerMeeting ? this.state.screenWidth / 4 : this.state.screenWidth / 3;

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
          searchButtomOnPress   = {Keyboard.dismiss}
          searchButtomText      = {this.props.state.Language.lang.Common.Search}
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:'arrow-back'}}
          leftButtonOnPress     = {() =>NavigationService.goBack()} 
          isRightButtonIconShow = {true}
          rightButtonIcon       = {{name:'search'}}
          rightButtonOnPress    = {()=>{ this.setState({ isShowSearch:true }); }} 
          title                 = {this.props.lang.MeetingPage.myMeetings}        //"我的會議"
          titleOnPress          = {()=>{ this.setState({ isShowSearch:true }) }}
        />
        <Segment style={{backgroundColor: this.props.style.meetingCalendar.calendarBackground}}>
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
            last    ={managerMeeting ? false: true}
            style   ={{width: btnWidth, justifyContent: 'center'}} 
            active  ={this.state.SegmentButton == "invited"}
            onPress ={()=>{
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
          testID            ={testIDs.agenda.CONTAINER}
          current           ={this.state.selectedDay}
          minDate           ={new Date()}
          items             ={this.state.dateItems}
          loadItemsForMonth ={this.loadItems}
          renderItem        ={this.renderItem}
          renderEmptyDate   ={this.renderEmptyDate}
          onDayPress={day => {
            this.setState({ selectedDay: day.timestamp })
          }}
          theme       ={this.props.style.meetingCalendar}
          monthFormat ={'MMMM yyyy'}
        />
      </Container>
    );
	}

  loadItems = (day: DateData) => {
    setTimeout(() => {
      let items = {};
      if (this.state.isFirstLoading) {

        // 整理顯示會議內容的顯示格式
        let meetingList = this.props.state.Meeting.meetingList;
        items = this.formatMeetingDate(meetingList);
      } else {
        items = this.state.dateItems;
      }

      for (let i = -15; i < 90; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);

        if (!items[strTime]) {
          items[strTime] = [];
        }
      }
      
      const newItems: AgendaSchedule = {};
      Object.keys(items).forEach(key => {
        newItems[key] = items[key];
      });

      this.setState({
        dateItems: newItems,
        loadItems: true,
        isFirstLoading: false
      });
      

    }, 1000);
  }

  timeToString(time: number) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  renderEmptyDate = (a) => {
    return (
      <View style={{
        borderWidth: .6,
        borderColor: 'rgba(170, 182, 193, .5)',
        marginTop: 45,
        marginRight: 10,
      }}>
      </View>
    );
  }

  //***** 測試代碼區塊結束 *****//
  formatMeetingDate(meetings){
    let dateArray = {};
    for(let dateMeeting of meetings){
      
      var res = dateMeeting.startdate.split(" ");
      if (dateArray === {}) {
        dateArray[res[0]] = [{
          data    :dateMeeting.oid,
          meetings:dateMeeting
        }];
      } else {        
        if (dateArray[res[0]]) {
          dateArray[res[0]].push({
            data    :dateMeeting.oid,
            meetings:dateMeeting
          });
        } else {
          dateArray[res[0]] = [{
            data    :dateMeeting.oid,
            meetings:dateMeeting
          }];
        }
      }
      
    }
    return dateArray;
  }

  renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
    return (
      <MeetingItem2
        item={reservation}
        data={reservation.meetings}
        onPress = {() => this.navigateDetaile(reservation.meetings)}
        lang = {this.props.lang.MeetingPage}
        isFirst = {isFirst}
      />
    );
  }

  navigateDetaile = (item) => {
    NavigationService.navigate("MeetingInsert", {
      meeting: item,
      fromPage:"MeetingList"
    });
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

