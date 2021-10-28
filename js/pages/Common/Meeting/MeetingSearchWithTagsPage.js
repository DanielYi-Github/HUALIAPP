import React from 'react';
import { View, FlatList, RefreshControl, VirtualizedList, Platform, Alert, Keyboard, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Content, Body, Right, Item, Input, Button, Icon, Title, Text, Card, CardItem, Label, connectStyle } from 'native-base';
import { tify, sify} from 'chinese-conv'; 
import { connect }   from 'react-redux';
import TagInput      from 'react-native-tags-input';
import { bindActionCreators } from 'redux';
import * as RNLocalize from "react-native-localize";

import * as MeetingAction     from '../../../redux/actions/MeetingAction';
import * as UpdateDataUtil    from '../../../utils/UpdateDataUtil';
import * as NavigationService from '../../../utils/NavigationService';
import ToastUnit              from '../../../utils/ToastUnit';
import TinyCircleButton        from '../../../components/TinyCircleButton';
import MeetingItemForAttendees from '../../../components/Meeting/MeetingItemForAttendees';

class MeetingSearchWithTagsPage extends React.Component {
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
      attendees         :this.deepClone(this.props.route.params.attendees),  //參與人
      isFooterRefreshing:false,
      isEnd             :false        //紀錄搜尋結果是否已經沒有更多資料
    };
  }

  componentDidMount(){
    //將與會人員放入redux state中
    this.props.actions.setInitialMeetingInfoInRedux(
      this.state.attendees,
      null,
      this.state.startdate,
      this.state.enddate,
      false  // 不需要檢測會議時間衝突的設定
    );

    this.loadMoreData();
  }

  render() {
    // 紀錄是否是關鍵字搜尋結果的資料
    let contentList = this.state.isSearch ? this.state.searchedData : this.state.data;
    // let contentList = [];

    /*
    //整理tags的資料格式
    let tagsArray = [];
    for(let value of this.state.attendees) tagsArray.push(value.name);
    let tags = { tag: '', tagsArray: tagsArray }
    */

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
                <Button transparent onPress={() =>{
                  Alert.alert(
                    this.props.lang.FormContentGridForEvaluation.continueToGoBack, //請確認是否執行返回?
                    this.props.lang.FormContentGridForEvaluation.continueToGoBackMsg, //確認返回將不儲存已編輯資料；如欲儲存已編輯資料，請點擊畫面右上角“完成”按鈕
                    [
                      {
                        text: this.props.lang.FormContentGridForEvaluation.cancel, //取消
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                      },
                      { 
                        text: this.props.lang.FormContentGridForEvaluation.goBack, //確認返回, 
                        onPress: () => NavigationService.goBack(),
                      style: "destructive",
                      }
                    ]
                  );
                }}>
                  <Icon name='close' style={{color:this.props.style.color}}/>
                </Button>
              </Left>
              <Body onPress={()=>{ this.setState({ isShowSearch:true });}}>
                  <Title style={{color:this.props.style.color}} onPress={()=>{ this.setState({ isShowSearch:true });}}>
                    {`${this.props.state.Language.lang.CreateFormPage.AlreadyAdd} ${this.props.lang.MeetingPage.attendees}`}
                  </Title>
              </Body>
              <Right style={{alignItems: 'center'}}>
                <Button transparent onPress={()=>{ this.setState({ isShowSearch:true }); }}>
                  <Icon name='search' style={{color:this.props.style.color}}/>
                </Button>
                <TouchableOpacity 
                  style={{
                    backgroundColor: '#55AE3B', 
                    borderColor    : '#55AE3B',
                    paddingLeft    : 10, 
                    paddingRight   : 10,
                    paddingTop     : 5,
                    paddingBottom  : 5, 
                    borderRadius   : 10,
                    borderWidth    : 0,
                  }}
                  onPress={()=>{
                    Keyboard.dismiss();
                    // this.state.sendValueBack(this.state.attendees);
                    this.state.sendValueBack(this.props.state.Meeting.attendees);
                    NavigationService.goBack();
                  }}
                >
                  <Text style={{color: '#FFF'}}>{this.props.state.Language.lang.CreateFormPage.Done}</Text>
                </TouchableOpacity>
              </Right>
            </Header>
        }
        <Item style={{ 
          justifyContent: 'space-between', 
          paddingLeft   : 10, 
          paddingRight  : 10, 
          paddingTop    : 20, 
          paddingBottom : 5, 
        }}>
          <Label style={{ color:this.props.style.inputWithoutCardBg.inputColorPlaceholder }}>
            {`${this.props.state.Language.lang.CreateFormPage.AlreadyAdd} ${this.props.lang.MeetingPage.attendees}`}
          </Label>
        </Item>

        <View style={{flex:0.3, backgroundColor: this.props.style.InputFieldBackground}}>
            <Content ref ={(c) => { this._content = c; }}>
              <Item style={{backgroundColor: this.props.style.InputFieldBackground, borderBottomWidth: 0}}>
                <TagInput
                  disabled            ={true}
                  autoFocus           ={false}
                  // updateState      ={(state)=>{ this.deleteTag(state); }}
                  updateState         ={(state)=>{ this.props.actions.removeAttendee(state); }}
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
            <Label style={{flex:1}}>{this.props.lang.MeetingPage.invitedByPosition}</Label>
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
            <Label style={{flex:1}}>{this.props.lang.MeetingPage.invitedByOrganization}</Label>
            <Icon name='arrow-forward' />
        </Item>

        <View style={{flex: 1, paddingTop: 20}}>
          <Label style={{paddingLeft: 10, paddingBottom: 5, paddingTop: 5, color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}}>
            {`${this.props.state.Language.lang.CreateFormPage.QuickSelect} ${this.props.lang.MeetingPage.attendees}`}
          </Label>
          <FlatList
            keyExtractor          ={(item, index) => index.toString()}
            data                  = {contentList}
            extraData             = {this.state}
            renderItem            = {this.renderTapItem}
            ListFooterComponent   = {this.renderFooter}
            onEndReachedThreshold = {0.3}
            onEndReached          = {this.state.isEnd ? null :this.loadMoreData}
          />
        </View>
      </Container>
    );
  }

  loadMoreData = (isSearching = {}, searchedData = null) => {
    isSearching = (typeof isSearching == "object") ? false : isSearching;
    let isSearch = isSearching ? isSearching : this.state.isSearch;
    searchedData = (searchedData == null) ? this.state.searchedData : searchedData;

    let user = this.props.state.UserInfo.UserInfo;
    let action = "org/hr/getMBMembers";

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
            UpdateDataUtil.getCreateFormDetailFormat(user, action, {count:count, condition:sKeyword}),
            UpdateDataUtil.getCreateFormDetailFormat(user, action, {count:count, condition:tKeyword})
          ];
        } else {
          let keyword = this.removeSpace(this.state.keyword); 
          let lowKeyword = keyword.toLowerCase(); 
          searchList = [
            UpdateDataUtil.getCreateFormDetailFormat(user, action, {count:count, condition:keyword}),
            UpdateDataUtil.getCreateFormDetailFormat(user, action, {count:count, condition:lowKeyword})
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
        let actionObject = { condition:"" };//查詢使用
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
        });
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
    /*
    return (
      <Item 
        fixedLabel 
        style   ={{paddingLeft: 15, padding:15, backgroundColor: this.props.style.InputFieldBackground}} 
        onPress ={ async ()=>{ 
          this.addTag(item.item);
        }} 
      >
        <Label>{item.item.name}</Label><Text note>{item.item.depname}</Text>
      </Item>
    );
    */

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

  /*
  addTag = (item) => {      
      let attendees = this.state.attendees;
      let isAdded = false;

      for(let value of attendees){
        if(item.id == value.id) isAdded = true; 
      }

      if (isAdded) {
        ToastUnit.show('error', this.props.state.Language.lang.CreateFormPage.NoAreadyItem);
      } else {
          attendees.push(item);
          this.setState({
            attendees: attendees
          });  
      }
      
      this._content.wrappedInstance.scrollToEnd({animated: true});
  }
  */

  /*
  deleteTag = (state) => {
    let data = this.state.attendees;
    for(let [i, value] of data.entries()){
      let spliceIndex = 0;
      for(let item of state.tagsArray){
        if (value.name == item){
         spliceIndex = null;          
         break; 
        }
        spliceIndex = i;
      }

      if(spliceIndex != null){
       data.splice(spliceIndex,1);
       break; 
      }
    }

    this.setState({
     attendees: data
    });
  }
  */

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

  dedup(arr) {
    var hashTable = {};

    return arr.filter(function (el) {
      var key = JSON.stringify(el);
      var match = Boolean(hashTable[key]);

      return (match ? false : hashTable[key] = true);
    });
  }

  /*
  checkHaveMeetingTime = async (id, startTime, endTime) => {
    let user = this.props.state.UserInfo.UserInfo;
    let meetingParams = {
      startdate:startTime,
      enddate  : endTime,
      attendees:[ {id:id} ],
      timezone :RNLocalize.getTimeZone()
    }
    let enableMeeting = await UpdateDataUtil.searchMeeting(user, meetingParams).then((result)=>{
      if (result.length == 0) {
        return true;
      } else {
        return false;
      }
    }).catch((errorResult)=>{
      console.log("errorResult",errorResult.message);
      return false;
    });

    return enableMeeting;
  }
  */

  deepClone(src) {
    return JSON.parse(JSON.stringify(src));
  }

  removeSpace(string){
    string = string.replace(/\r\n/g,"");
    string = string.replace(/\n/g,"");
    string = string.replace(/\s/g,"");
    return string;
  }
}

export let MeetingSearchWithTagsPageStyle = connectStyle( 'Page.FormPage', {} )(MeetingSearchWithTagsPage);

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
)(MeetingSearchWithTagsPageStyle);