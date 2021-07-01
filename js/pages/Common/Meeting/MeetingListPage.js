import React from 'react';
import { View, Keyboard, SafeAreaView, SectionList } from 'react-native';
import { Container, Header, Body, Left, Right, Button, Item, Icon, Input, Title, Text, Label, Segment, connectStyle} from 'native-base';
import { tify, sify} from 'chinese-conv'; 
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SearchInput, { createFilter } from 'react-native-search-filter'; 
const KEYS_TO_FILTERS = ['initiator.id'];
const Invited_TO_FILTERS = [ "attendees.id", "attendees.name" ];
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
        isLoading      :false,
        showFooter     :false,
        SegmentButton  :"all",
        isEnd          :false
      }
	}

  componentDidMount(){
    if (this.props.state.Meeting.meetingList.length == 0) {
      this.props.actions.getMeetings();
      this.setState({
        isEnd:false
      });  
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.state.Meeting.meetingList.length == this.props.state.Meeting.meetingList.length) {
      this.setState({
        isEnd:true
      });
    }else{
      if (nextProps.state.Meeting.meetingList.length == 0) {
        this.props.actions.getMeetings();
        this.setState({
          isEnd:false
        });  
      }
    }
  }

	render() {
    // console.log(this.props.state.Meeting.meetingList);
    let userId = this.props.state.UserInfo.UserInfo.id;
    let meetingList = this.props.state.Meeting.meetingList;
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
          // title                 = {this.props.state.Language.lang.HomePage.Contacts}
          title                 = {"我的會議"}
          titleOnPress          = {()=>{ this.setState({ isShowSearch:true }) }}
        />
        <Segment style={{backgroundColor: "rgba(0,0,0,0)"}}>
          <Button 
            first 
            style={{width:"32%", justifyContent: 'center' }} 
            active={this.state.SegmentButton == "all"}
            onPress={()=>{
              this.setState({SegmentButton:"all"});
            }}
          >
            <Text>全部</Text>
          </Button>
          <Button 
            style={{width:"30%", justifyContent: 'center'}} 
            active={this.state.SegmentButton == "create"}
            onPress={()=>{
              this.setState({SegmentButton:"create"});
            }}
          >
            <Text>我發起</Text>
          </Button>
          <Button 
            last 
            style={{width:"32%", justifyContent: 'center'}} 
            active={this.state.SegmentButton == "invited"}
            onPress={()=>{
              this.setState({SegmentButton:"invited"});
            }}
          >
            <Text>被邀請</Text>
          </Button>
        </Segment>
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
          onEndReachedThreshold = {0.3}
          onEndReached          = {this.state.isEnd ? null :this.endReachedGetMeetings}
        />
      </Container>
    );
	}

  endReachedGetMeetings = () => {
    this.props.actions.getMeetings();
  }

  renderItem = (item) => {
    let items = item.item;
    return (
      <MeetingItem 
        item={items}
        data={item.section.meetings[item.index]}
        onPress = {() => this.navigateDetaile(item.section.meetings[item.index])}
      />
    );
  }

  navigateDetaile = (item) => {
    NavigationService.navigate("MeetingInsert", {
      meeting: item,
      fromPage:"MeetingList"
    });
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

  renderFooter = () => {
    if (this.state.showFooter) {
      return (<NoMoreItem text={this.props.state.Language.lang.ListFooter.NoMore}/>);         
    } else {
      if (this.state.isLoading) {
        return <NoMoreItem text={this.props.state.Language.lang.ListFooter.Loading}/>;
      } else {
        return <NoMoreItem text={this.props.state.Language.lang.ListFooter.NoMore}/>;
      }
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

  componentWillUnmount(){
    // this.props.actions.resetMeetingListRedux();
  }
}

let MeetingListPageStyle = connectStyle( 'Page.MeetingPage', {} )(MeetingListPage);
export default connect(
  (state) => ({
    state: { ...state }
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...MeetingAction
    }, dispatch)
  })
)(MeetingListPageStyle);

