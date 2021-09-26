import React from 'react';
import { View, FlatList, RefreshControl, VirtualizedList, Platform, Alert, Keyboard, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Content, Body, Right, Item, Input, Button, Icon, Title, Text, Card, CardItem, Label, Footer, connectStyle } from 'native-base';
import { tify, sify} from 'chinese-conv'; 
import { connect }   from 'react-redux';
import TagInput      from 'react-native-tags-input';
import { bindActionCreators } from 'redux';
import * as RNLocalize from "react-native-localize";

import * as UpdateDataUtil    from '../../../utils/UpdateDataUtil';
import * as NavigationService from '../../../utils/NavigationService';
import * as SQLite            from '../../../utils/SQLiteUtil';
import ToastUnit              from '../../../utils/ToastUnit';
import TinyCircleButton       from '../../../components/TinyCircleButton';
import * as MeetingAction     from '../../../redux/actions/MeetingAction';

import { NavigationContainer, useRoute, useNavigationState } from '@react-navigation/native';

class MeetingInsertWithTagsByOrganizePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowSearch      : false,       //是否顯示關鍵字搜尋的輸入匡
      isChinesKeyword   : false,       //用來判斷關鍵字是否為中文字
      keyword           : "",          //一般搜尋
      sKeyword          : "",          //簡體中文
      tKeyword          : "",          //繁體中文
      isSearch          : false,       //是反顯示關鍵字搜尋結果
      searchedData      : [],          //關鍵字搜尋的資料
      searchedCount     : 0,           //關鍵字搜尋出來的筆數
      data              : [],          //一般搜尋的資料
      isFooterRefreshing: false,
      isEnd             : false,       //紀錄搜尋結果是否已經沒有更多資料
    };
  }

  componentDidMount(){
    this.props.actions.getCompanies();    // 獲取公司列表資料
    // this.loadMoreData();
  }

  render() {
    // 紀錄是否是關鍵字搜尋結果的資料
    let contentList = this.state.isSearch ? this.state.searchedData : this.state.data;

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
                <Button transparent onPress={()=>{
                  NavigationService.goBack();
                }}>
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
              </Right>
            </Header>
        }

        <FlatList
          keyExtractor          = {(item, index) => index.toString()}
          data                  = {this.props.state.Meeting.companies}
          extraData             = {this.props.state.Meeting}
          renderItem            = {this.renderTapItem}
          ListFooterComponent   = {this.renderFooter}
          ListEmptyComponent    = {this.renderEmptyComponent}
        />

        <Footer>
          <Body>
            <Text onPress={ this.showAttendeesReorderPage } style={{marginLeft: 15}}>{`已選擇${this.props.state.Meeting.attendees.length}人`}</Text>
            <Icon onPress={ this.showAttendeesReorderPage } name={"chevron-up-outline"} />
          </Body>
          <Right>
            <TouchableOpacity 
              style={{
                backgroundColor: '#47ACF2', 
                borderColor    : '#47ACF2',
                borderWidth    : 1,
                borderRadius   : 10,
                marginRight    : 15,
                paddingLeft    : 10, 
                paddingRight   : 10,
                paddingTop     : 5,
                paddingBottom  : 5, 
              }}
              onPress={()=>{
                Keyboard.dismiss();                
                NavigationService.navigate({
                  key: this.props.MeetingInsertWithTagsPageRouterKey
                });
              }}
            >
              <Text style={{color: '#FFF'}}>{this.props.state.Language.lang.CreateFormPage.Done}</Text>
            </TouchableOpacity>
          </Right>
        </Footer>
        
      </Container>
    );
  }

  renderTapItem = (item) => {
    item = item.item;
    // 必須檢查member裡面有沒有資料，有的話要顯示主管身份
    return (
      <Item 
        fixedLabel 
        style   ={{padding: 10, backgroundColor: this.props.style.InputFieldBackground }} 
        onPress ={ async ()=>{ 
          // 取得廠區
          let factories = await this.getFactories(item.value);
          NavigationService.navigate("MeetingInsertWithTagsForSelect", {
            selectList    :factories,
            onItemPress   : async (value)=>{
              await this.props.actions.getOrg(value); // 取得組織架構資料
              this.navigateNextOrg();
            },
            renderItemMode:"normal",  // normal一般, multiCheck多選, multiAttendees多選參與人
            showFooter    :true
          });
          
        }} 
      >
        <Label>{item.label} </Label>
      </Item>
    );
  }

  getFactories = async (com) => {
    let sql = `select * from THF_MASTERDATA 
           where CLASS1='HRPZID' and CLASS3='${com}' and STATUS='Y' order by SORT;`
    let factories = await SQLite.selectData( sql, []).then((result) => {
      let items = [];
      for (let i in result.raw()) {
        items.push({
          key  :result.raw()[i].SORT,
          label:result.raw()[i].CONTENT,
          companyValue:result.raw()[i].CLASS3,
          factoryValue:result.raw()[i].CLASS4
        })
      }
      return items;
    }).catch((e)=>{
      // LoggerUtil.addErrorLog("CommonAction loadCompanyData_HrCO", "APP Action", "ERROR", e);
      return [];
    });
    return factories;
  }

  navigateNextOrg = (org = this.props.state.Meeting.organization_tree) => {
    NavigationService.push("MeetingInsertWithTagsForSelect", {
      orgManager    :org.members == null ? false : org.members,
      selectList    :org.subDep,
      onItemPress   :(value)=>{
        // this.props.actions.positionCheckboxOnPress(!(checked || included), item.item.value);
        // 目前的reudx選項有沒有包含在這裡面
        // 這邊決定要不要顯示勾勾選項

        this.props.actions.organizeCheckboxOnPress( value );
        // this.props.actions.getOrg(value); // 取得組織架構資料
        // this.navigateNextOrg();
      },
      onItemNextIconPress:(value)=>{
        if(value.subDep == null){
          NavigationService.push("MeetingInsertWithTagsForSelect", {
            selectList    :value.members,
            onItemPress   :this.props.actions.getPositions,
            renderItemMode:"multiAttendees",  // normal一般, multiCheck多選, multiAttendees多選參與人
            showFooter    :true
          });
        }else{
          this.navigateNextOrg(value);
        }
      },
      renderItemMode:"multiCheck",  // normal一般, multiCheck多選, multiAttendees多選參與人
      showFooter    :true
    });
  }

  loadMoreData = (isSearching, searchedData = null) => {
    isSearching = (typeof isSearching == "object") ? false : isSearching;
    let isSearch = isSearching ? isSearching : this.state.isSearch;
    searchedData = (searchedData == null) ? this.state.searchedData : searchedData;

    let user = this.props.state.UserInfo.UserInfo;
    let action = "";

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

  checkHaveMeetingTime = async (id, startTime, endTime) => {
    let user = this.props.state.UserInfo.UserInfo;
    let meetingParams = {
      startdate:startTime,
      enddate  : endTime,
      attendees:[ {id:id} ],
      timezone :RNLocalize.getTimeZone(),
      oid : this.state.oid
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

  showAttendeesReorderPage = () => {
    NavigationService.navigate("MeetingAttendeesReorder");
  }
}

// Wrap and export
let MeetingInsertWithTagsFurtherPagefunction = (props) => {
  const navigationState = useNavigationState(state => state);

  let MeetingInsertWithTagsPageRouterKey = "";
  for(let item of navigationState.routes){
    if (item.name == "MeetingInsertWithTags") {
      MeetingInsertWithTagsPageRouterKey = item.key;
    }
  }

  return <MeetingInsertWithTagsFurtherPage {...props} MeetingInsertWithTagsPageRouterKey={MeetingInsertWithTagsPageRouterKey} />;
}

export let MeetingInsertWithTagsByOrganizePageStyle = connectStyle( 'Page.FormPage', {} )(MeetingInsertWithTagsByOrganizePage);

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
)(MeetingInsertWithTagsByOrganizePageStyle);