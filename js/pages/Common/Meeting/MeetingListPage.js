import React from 'react';
import { View, Keyboard, SafeAreaView, SectionList, Dimensions, Alert } from 'react-native';
import { Container, Header, Body, Left, Right, Button, Item, Icon, Input, Title, Text, Label, Segment, connectStyle} from 'native-base';
import { tify, sify} from 'chinese-conv'; 
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SearchInput, { createFilter } from 'react-native-search-filter'; 

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
          // onEndReachedThreshold = {0.3}
          // onEndReached          = {this.state.isEnd ? null :this.endReachedGetMeetings}
        />
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

  componentWillUnmount(){
    // this.props.actions.resetMeetingListRedux();
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

