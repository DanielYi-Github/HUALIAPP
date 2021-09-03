import React from 'react';
import { View, FlatList, RefreshControl, VirtualizedList, Platform, Alert, Keyboard, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Content, Body, Right, Item, Input, Button, Icon, Title, Text, Card, CardItem, Label, connectStyle } from 'native-base';
import { tify, sify} from 'chinese-conv'; 
import { connect }   from 'react-redux';
import TagInput      from 'react-native-tags-input';
import { bindActionCreators } from 'redux';
import * as RNLocalize from "react-native-localize";
import CheckBox from '@react-native-community/checkbox';

import * as MeetingAction      from '../../../redux/actions/MeetingAction';
import * as UpdateDataUtil     from '../../../utils/UpdateDataUtil';
import * as NavigationService  from '../../../utils/NavigationService';
import ToastUnit               from '../../../utils/ToastUnit';
import TinyCircleButton        from '../../../components/TinyCircleButton';
import MeetingItemForAttendees from '../../../components/Meeting/MeetingItemForAttendees';

class MeetingInsertWithTagsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sendValueBack : this.props.route.params.onPress,       // 將直傳回上一個物件,
      text : {
              COLUMN1: null, 
              name   : null, 
              COLUMN3: null, 
              COLUMN4: null
            },
      startdate         :this.props.route.params.startdate,
      enddate           :this.props.route.params.enddate,
      isShowSearch      :false,       //是否顯示關鍵字搜尋的輸入匡
      isSearch          :false,       //是反顯示關鍵字搜尋結果
      isChinesKeyword   :false,       //用來判斷關鍵字是否為中文字
      keyword           :"",          //一般搜尋
      sKeyword          :"",          //簡體中文
      tKeyword          :"",          //繁體中文
      searchedData      :[],          //關鍵字搜尋出來的資料
      searchedCount     :0,           //關鍵字搜尋出來的筆數
      data              :[],          //搜尋出來的資料
      isFooterRefreshing:false,
      isEnd             :false,        //紀錄搜尋結果是否已經沒有更多資料
      oid               :this.props.route.params.oid
    };
  }

  componentDidMount(){
    //將與會人員放入redux state中
    this.props.actions.setInitialMeetingInfoInRedux(
      this.props.route.params.attendees,
      this.state.oid,
      this.state.startdate,
      this.state.enddate
    );
    this.loadMoreData();
  }

  render() {
    // 紀錄是否是關鍵字搜尋結果的資料
    let contentList = this.state.isSearch ? this.state.searchedData : this.state.data;

    //整理tags的資料格式
    let tagsArray = [];
    for(let value of this.props.state.Meeting.attendees) tagsArray.push(value.name);
    let tags = { tag: '', tagsArray: tagsArray }

    return (
      <Container>
        {/*標題列*/}
        {
          (this.state.isShowSearch) ?
            <Header style={this.props.style.HeaderBackground} searchBar rounded>
              <Item style={{borderWidth: 1}}>
                <Icon name="search" />
                <Input 
                  placeholder={this.props.state.Language.lang.ContactPage.SearchKeyword}
                  keyboardType    = "web-search" 
                  returnKeyType   = "search"
                  clearButtonMode = "while-editing" 
                  autoFocus       = {true}
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
                  onSubmitEditing = {()=>{
                    Keyboard.dismiss();
                    // 搜尋的值不能為空白
                    let key = this.state.isChinesKeyword ? this.state.sKeyword.length : this.state.keyword.length;
                    if ( key!==0 ) {
                      this.setState({
                        isSearch     :true,
                        searchedData :[],          
                        searchedCount:0,
                        isEnd        :false           
                      });
                      this.loadMoreData(true, [])
                    }    
                  }}
                />
              </Item>
              <Right style={{flex:0, flexDirection: 'row'}}>
                <Button transparent 
                  onPress={() =>{this.setState({ 
                    isShowSearch   :false,
                    isSearch       :false,
                    isChinesKeyword:false, 
                    keyword        :"",    
                    sKeyword       :"",    
                    tKeyword       :"",
                    searchedData   :[],
                    searchedCount  :0,
                    isEnd:false
                  });
                }}>
                  <Icon name="close" style={{color:this.props.style.color}}/>
                </Button>      
                <Button transparent onPress={()=>{
                  Keyboard.dismiss();
                  // 搜尋的值不能為空白
                  let key = this.state.isChinesKeyword ? this.state.sKeyword.length : this.state.keyword.length;
                  if ( key!==0 ) {
                    this.setState({
                      isSearch     :true,
                      searchedData :[],          
                      searchedCount:0,
                      isEnd        :false           
                    });
                    this.loadMoreData(true, [])
                  }
                }}>
                  <Title style={{color:this.props.style.color}}>
                      {this.props.state.Language.lang.Common.Search}
                  </Title>
                </Button>
              </Right>
            </Header>
          :
            <Header style={this.props.style.HeaderBackground}>
              <Left>
                <Button transparent onPress={() =>NavigationService.goBack()}>
                  <Icon name='arrow-back' style={{color:this.props.style.color}}/>
                </Button>
              </Left>
              <Body onPress={()=>{ this.setState({ isShowSearch:true });}}>
                  <Title style={{color:this.props.style.color}} onPress={()=>{ this.setState({ isShowSearch:true });}}>
                    {this.props.lang.MeetingPage.attendeesInvite}
                  </Title>
              </Body>
              <Right style={{alignItems: 'center'}}>
                <Button transparent onPress={()=>{ this.setState({ isShowSearch:true }); }}>
                  <Icon name='search' style={{color:this.props.style.color}}/>
                </Button>
                <TouchableOpacity 
                  style={{
                    backgroundColor: '#47ACF2', 
                    paddingLeft    : 10, 
                    paddingRight   : 10,
                    paddingTop     : 5,
                    paddingBottom  : 5, 
                    borderRadius   : 10,
                    borderWidth    : 1,
                    borderColor    : '#47ACF2'
                  }}
                  onPress={()=>{
                    Keyboard.dismiss();
                    this.state.sendValueBack(this.props.state.Meeting.attendees);
                    NavigationService.goBack();
                  }}
                >
                  <Text style={{color: '#FFF'}}>{this.props.state.Language.lang.CreateFormPage.Done}</Text>
                </TouchableOpacity>
              </Right>
            </Header>
        }
        <Item style={{justifyContent: 'space-between', paddingLeft: 5, paddingRight: 10, paddingTop: 20, paddingBottom: 5}}>
          <Label style={{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder }}>
            {`${this.props.state.Language.lang.CreateFormPage.AlreadyAdd} ${this.props.lang.MeetingPage.attendees}`}
          </Label>
          {
            this.props.state.Meeting.attendees.length > 1 ?
              <TinyCircleButton
                text    = {"排序"}
                color   = {"#FF6D00"}
                onPress = {()=>{
                  NavigationService.navigate("MeetingAttendeesReorder");
                }}
              />
            :
              null
          }
        </Item>

        <View style={{flex:0.3, backgroundColor: this.props.style.InputFieldBackground}}>
            <Content ref ={(c) => { this._content = c; }}>
              <Item style={{backgroundColor: this.props.style.InputFieldBackground, borderBottomWidth: 0}}>
                <TagInput
                  disabled            ={true}
                  autoFocus           ={false}
                  updateState         ={(state)=>{ 
                    this.props.actions.removeAttendee(state); 
                  }}
                  tags                ={tags}
                  inputContainerStyle ={{ height: 0 }}
                  tagsViewStyle       ={{ margin:0 }}
                  tagStyle            ={{backgroundColor:"#DDDDDD", borderWidth:0}}
                  tagTextStyle        ={{color:"#666"}}
                />
              </Item> 
            </Content>
        </View>

        {/*依職級選擇*/}
        <Item 
          style={{ 
            backgroundColor: this.props.style.InputFieldBackground, 
            height         : this.props.style.inputHeightBase,
            paddingLeft    : 10,
            paddingRight   : 5,
            marginTop      : 30 
          }}
          onPress  = {()=>{ NavigationService.navigate("MeetingInsertWithTagsByPosition"); }}
        >
            <Label style={{flex:1}}>{"依職級選擇"}</Label>
            <Icon name='arrow-forward' />
        </Item>

        {/*依組織架構選擇*/}
        <Item 
          style={{ 
            backgroundColor  : this.props.style.InputFieldBackground, 
            height           : this.props.style.inputHeightBase,
            paddingLeft      : 10,
            paddingRight     : 5,
            borderBottomWidth: 0, 
          }}
          onPress = {()=>{ NavigationService.navigate("MeetingInsertWithTagsByOrganize"); }}
        >
            <Label style={{flex:1}}>{"依組織架構選擇"}</Label>
            <Icon name='arrow-forward' />
        </Item>

        <View style={{flex: 1, paddingTop: 30}}>
          <Label style={{marginLeft: 5, paddingBottom: 5, color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}}>
            {`${this.props.state.Language.lang.CreateFormPage.QuickSelect} ${this.props.lang.MeetingPage.attendees}`}
          </Label>
          <FlatList
            keyExtractor          ={(item, index) => index.toString()}
            data                  = {contentList}
            extraData             = {this.state}
            renderItem            = {this.renderTapItem}
            ListFooterComponent   = {this.renderFooter}
            ListEmptyComponent    = {this.renderEmptyComponent}
            onEndReachedThreshold = {0.3}
            onEndReached          = {this.state.isEnd ? null :this.loadMoreData}
          />
        </View>
      </Container>
    );
  }

  loadMoreData = (isSearching, searchedData = null) => {
    isSearching = (typeof isSearching == "object") ? false : isSearching;
    let isSearch = isSearching ? isSearching : this.state.isSearch;
    searchedData = (searchedData == null) ? this.state.searchedData : searchedData;

    let user = this.props.state.UserInfo.UserInfo;
    let action = "org/hr/meeting/getMBMembers";

    this.setState({ isFooterRefreshing: true });
    if (!this.state.isFooterRefreshing) {
      // 是不是關鍵字搜尋
      if (isSearch) {
        let count = (searchedData.length == 0) ? searchedData.length : searchedData.length+20
        let searchList = [];

        if (this.state.isChinesKeyword) {
          let sKeyword = this.removeSpace(this.state.sKeyword); 
          let tKeyword = this.removeSpace(this.state.tKeyword);
          searchList = [
            UpdateDataUtil.getCreateFormDetailFormat(user, action, { count:count, condition:sKeyword}),
            UpdateDataUtil.getCreateFormDetailFormat(user, action, { count:count, condition:tKeyword})
          ];
        } else {
          let keyword = this.removeSpace(this.state.keyword); 
          let lowKeyword = keyword.toLowerCase(); 
          searchList = [
            UpdateDataUtil.getCreateFormDetailFormat(user, action, { count:count, condition:keyword}),
            UpdateDataUtil.getCreateFormDetailFormat(user, action, { count:count, condition:lowKeyword}),
          ];
        }

        Promise.all(searchList).then((result) => {
          let temparray = this.state.isChinesKeyword ? [...result[0], ...result[1]]: [...result[0], ...result[1]];
          let isEnd = this.dealIsDataEnd(searchedData, temparray);
          this.setState({
           searchedData: isEnd? searchedData: this.dedup([...searchedData, ...temparray]),
           isFooterRefreshing:false,
           isEnd:isEnd
          })
        }).catch((err) => {
          // ToastUnit.show('error', this.props.lang.MeetingPage.searchError);
          this.setState({ 
            isShowSearch   :false,
            isSearch       :false,
            isChinesKeyword:false, 
            keyword        :"",    
            sKeyword       :"",    
            tKeyword       :"",
            searchedData   :[],
            searchedCount  :0,
            isEnd          :false,
            isFooterRefreshing:false
          });

          let message = this.props.lang.MeetingPage.searchError;
          setTimeout(function(){ 
            ToastUnit.show('error', message);
          }, 300);
          console.log(err);
        })
      } else {
        let actionObject = { condition:"" }; //查詢使用
        actionObject.count = this.state.data.length;
        UpdateDataUtil.getCreateFormDetailFormat(user, action, actionObject).then((result)=>{
          let isEnd = this.dealIsDataEnd(this.state.data, result);
          this.setState({
            data              :isEnd ? this.state.data: this.state.data.concat(result) ,
            isFooterRefreshing:false,
            isEnd             :isEnd
          });
        }).catch((err) => {
          this.setState({ 
            isShowSearch   :false,
            isSearch       :false,
            isChinesKeyword:false, 
            keyword        :"",    
            sKeyword       :"",    
            tKeyword       :"",
            searchedData   :[],
            searchedCount  :0,
            isEnd          :false,
            isFooterRefreshing:false
          });

          let message = this.props.lang.MeetingPage.searchError;
          setTimeout(function(){ 
            ToastUnit.show('error', message);
          }, 300);
          console.log(err);
        })
      }
    }
  }

  dealIsDataEnd = (stateData, resultData) => {
    let isEnd = false;
    if (
      resultData.length == 0 ||
      ( stateData.length != 0 && stateData[stateData.length-1].id == resultData[resultData.length-1].id )
    ) {
      isEnd = true;
    } else {
      isEnd = false;
    }

    return isEnd;
  }

  renderTapItem = (item) => {
    let checked = false;
    let availableChange = true;
    for(let attendee of this.props.state.Meeting.attendees){
      if (attendee.id == item.item.id) {
        checked = true;
      }
    }

    return (
      <MeetingItemForAttendees
        item            = {item.item}
        checked         = {checked}
        availableChange = {availableChange}
        itemOnPress     = {this.props.actions.attendeeItemOnPress}
        calendarOnPress = {this.props.actions.attendeeItemCalendarOnPress}
      />
    );
  }

  renderFooter = () => {
    let footer = null
    if(this.state.isFooterRefreshing){
      footer = (
        <Item style={{padding: 15, justifyContent: 'center', backgroundColor: this.props.style.InputFieldBackground}}>
          <Label>{this.props.state.Language.lang.ListFooter.Loading}</Label>
        </Item>
      );
    }else{
      footer = (
        <Item style={{padding: 15, justifyContent: 'center', backgroundColor: this.props.style.InputFieldBackground}}>
            <Label>{this.props.state.Language.lang.ListFooter.NoMore}</Label>
        </Item>
      )  
    }

    return footer;
  }

  renderEmptyComponent = () => {
    return (
      null
    );
  }

  dedup(arr) {
    var hashTable = {};

    return arr.filter(function (el) {
      var key = JSON.stringify(el);
      var match = Boolean(hashTable[key]);

      return (match ? false : hashTable[key] = true);
    });
  }

  removeSpace(string){
    string = string.replace(/\r\n/g,"");
    string = string.replace(/\n/g,"");
    string = string.replace(/\s/g,"");
    return string;
  }

  /*
  itemOnPress = async (item) => {
    let enableMeeting = await this.checkHaveMeetingTime(item.id, this.state.startdate, this.state.enddate);
    if (enableMeeting) {
      this.addTag(item);
    } else {
      Alert.alert(
        this.props.lang.MeetingPage.alertMessage_duplicate, //"有重複"
        `${this.props.lang.MeetingPage.alertMessage_period} ${item.name} ${this.props.lang.MeetingPage.alertMessage_meetingAlready}`,
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ],
        { cancelable: false }
      );
      
    }
  }
  */

  /*
  checkHaveMeetingTime = async (id, startTime, endTime) => {
    let user = this.props.state.UserInfo.UserInfo;
    let meetingParams = {
      startdate:startTime,
      enddate  : endTime,
      attendees:[ {id:id} ],
      timezone :RNLocalize.getTimeZone(),
      oid      : this.state.oid
    }
    let searchMeetingResult = await UpdateDataUtil.searchMeeting(user, meetingParams).then((result)=>{
      if (result.length == 0) {
        return true;
      } else {
        return false;
      }
    }).catch((errorResult)=>{
      console.log("errorResult",errorResult.message);
      return false;
    });

    return searchMeetingResult;
  }
  */

  /*
  addTag = (item) => {      
    let attendees = this.props.state.Meeting.attendees;
    let isAdded = false;

    for(let value of attendees){
      if(item.id == value.id) isAdded = true; 
    }

    if (isAdded) {
      this.removeTag(item);
      // ToastUnit.show('error', this.props.state.Language.lang.CreateFormPage.NoAreadyItem);
    } else {
        attendees.push(item);
        this.props.actions.setAttendees(attendees);
    }
    
    this._content.wrappedInstance.scrollToEnd({animated: true});
  }
  */
  /*
  calendarOnPress = (item) => {
    //顯示此人有哪些會議
    NavigationService.navigate("MeetingTimeForPerson", {
      person: item,
    });
  }
  */

  /*
  removeTag = (item) => {
    let attendees = this.props.state.Meeting.attendees;

    let removeIndex = 0;
    for(let i in attendees){
      if(item.id == attendees[i].id) removeIndex = i;
    }

    attendees.splice(removeIndex, 1);

    this.props.actions.setAttendees(attendees);
  }
  */
}

export let MeetingInsertWithTagsPageStyle = connectStyle( 'Page.FormPage', {} )(MeetingInsertWithTagsPage);

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
)(MeetingInsertWithTagsPageStyle);