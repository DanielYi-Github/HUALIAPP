import React from 'react';
import { View, FlatList, RefreshControl, VirtualizedList, Platform, Alert, Keyboard, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Content, Body, Right, Item, Input, Button, Icon, Title, Text, Card, CardItem, Label, Footer, connectStyle } from 'native-base';
import { tify, sify} from 'chinese-conv'; 
import { connect }   from 'react-redux';
import TagInput      from 'react-native-tags-input';
import { bindActionCreators } from 'redux';
import * as RNLocalize from "react-native-localize";
import CheckBox from '@react-native-community/checkbox';

import * as UpdateDataUtil    from '../../../utils/UpdateDataUtil';
import * as NavigationService from '../../../utils/NavigationService';
import ToastUnit              from '../../../utils/ToastUnit';
import TinyCircleButton       from '../../../components/TinyCircleButton';
import * as MeetingAction     from '../../../redux/actions/MeetingAction';
import MeetingSelectAttendeesFooter from '../../../components/Meeting/MeetingSelectAttendeesFooter';
import MeetingItemForAttendees from '../../../components/Meeting/MeetingItemForAttendees';

import { NavigationContainer, useRoute, useNavigationState } from '@react-navigation/native';

class MeetingInsertWithTagsByPositionPage extends React.Component {
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
      defaultCompany    : props.state.UserInfo.UserInfo.co, //預設公司
    };
  }

  componentDidMount(){
    this.props.actions.getCompanies();    // 獲取公司列表資料
    this.props.actions.getPositions(this.state.defaultCompany);   // 獲取人員清單資料
  }

  render() {
    // 找尋會議公司名稱
    let companyName = "";
    for(let company of this.props.state.Meeting.companies){
      if( company.value == this.props.state.Meeting.selectedCompany ){
        companyName = company.name
      }
    }

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
              <Body /*onPress={()=>{ this.setState({ isShowSearch:true });}}*/>
                  <Title style={{color:this.props.style.color}} /*onPress={()=>{ this.setState({ isShowSearch:true });}}*/>
                    {this.props.lang.MeetingPage.invitedByPosition}
                  </Title>
              </Body>
              <Right style={{alignItems: 'center'}}>
                {/*
                <Button transparent onPress={()=>{ this.setState({ isShowSearch:true }); }}>
                  <Icon name='search' style={{color:this.props.style.color}}/>
                </Button>
                */}
              </Right>
            </Header>
        }

        {/*依不同公司選擇職級*/}
        <View>
          <Label style={{
            paddingTop   : 25,
            paddingBottom: 5, 
            paddingLeft  : 10, 
            color        : this.props.style.inputWithoutCardBg.inputColorPlaceholder}}
          >
            {this.props.lang.ContactPage.SelestCompany}
          </Label>
          <Item 
            style={{ 
              backgroundColor: this.props.style.InputFieldBackground, 
              height         : this.props.style.inputHeightBase,
              paddingLeft    : 10,
              paddingRight   : 5,
            }}
            onPress  = {()=>{
              NavigationService.navigate("MeetingInsertWithTagsForSelect", {
                selectList    :this.props.state.Meeting.companies,
                onItemPress   :(item)=>{
                  this.props.actions.getPositions(item.value);
                  NavigationService.goBack();
                },
                renderItemMode:"normal",  // normal一般, multiCheck多選, multiAttendees多選參與人
                showFooter    :false,
                title: this.props.lang.ContactPage.SelestCompany
              });
            }}
          >
              <Label style={{flex:1}}>{companyName}</Label>
              <Icon name='arrow-forward' />
          </Item>
        </View>
        
        <Label style={{
          paddingTop   : 30,
          paddingBottom: 5, 
          paddingLeft  : 10, 
          color        : this.props.style.inputWithoutCardBg.inputColorPlaceholder}}
        >
          {this.props.lang.MeetingPage.selectPosition}
        </Label>
        <FlatList
          keyExtractor          = {(item, index) => index.toString()}
          data                  = {this.props.state.Meeting.attendees_by_position}
          extraData             = {this.props.state.Meeting}
          renderItem            = {this.renderTapItem}
          ListEmptyComponent    = {this.renderEmptyComponent}
        />

        <MeetingSelectAttendeesFooter
          lang         = {this.props.state.Language.lang}
          selectNumber = {this.props.state.Meeting.attendees.length}
          onPress      = {()=>NavigationService.navigate("MeetingAttendeesReorder")}
          MeetingInsertWithTagsPageRouterKey = {this.props.MeetingInsertWithTagsPageRouterKey}
        />
      </Container>
    );
  }

  renderTapItem = (item) => {
    let selectedCount = 0;
    let included = false;

    // 確認有沒有已經包含在裡面，用來顯示不同的勾勾顏色
    for(let positionAttendee of item.item.value){
      for(let propsAttendee of this.props.state.Meeting.attendees){
        if( positionAttendee.id == propsAttendee.id ){
          included = true;
          selectedCount++;
          break;
        }
      }
    }
    let checked = selectedCount == item.item.value.length ? true: false;
    let checkBoxColor = checked == included ? "#00C853": "#9E9E9E";

    return (
      <Item 
        fixedLabel 
        style   ={{paddingLeft: 10, paddingRight: 5, backgroundColor: this.props.style.InputFieldBackground}} 
        onPress ={ async ()=>{ 
          this.props.actions.positionCheckboxOnPress(!(checked || included), item.item.value);
        }} 
      >
        <CheckBox
          disabled      ={ Platform.OS == "android" ? false : true }
          onValueChange ={(newValue) => {
            if (Platform.OS == "android"){
              this.props.actions.positionCheckboxOnPress(!(checked || included), item.item.value);
            }
          }}
          value         ={checked || included}
          boxType       ={"square"}
          tintColors    ={{true: checkBoxColor, false: '#aaaaaa'}}
          onCheckColor  ={checkBoxColor}
          onTintColor   ={checkBoxColor}
          style         ={{ marginRight: 20 }}
          animationDuration = {0.01}
        />
        <Label>{item.item.label} </Label><Text note>{item.item.depname}</Text>

        <Icon 
          style ={{padding: 10, paddingRight: 10, paddingLeft: '40%'}}
          name  ='arrow-forward'
          onPress={()=>{
            NavigationService.navigate("MeetingInsertWithTagsForSelect", {
              selectList    :item.item.value,
              onItemPress   :this.props.actions.getPositions,
              renderItemMode:"multiAttendees",  // normal一般, multiCheck多選, multiAttendees多選參與人
              showFooter    :true,
              title         :this.props.lang.MeetingPage.attendeesInvite
            });
          }}
        />
      </Item>
    );
    
  }

  renderEmptyComponent = () => {
    return (
      <Item style={{padding: 15, justifyContent: 'center', backgroundColor: this.props.style.InputFieldBackground}}>
          <Label>{this.props.state.Language.lang.ListFooter.NoMore}</Label>
      </Item>
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
let MeetingInsertWithTagsByPositionPagefunction = (props) => {
  const navigationState = useNavigationState(state => state);

  let MeetingInsertWithTagsPageRouterKey = "";
  for(let item of navigationState.routes){
    if (item.name == "MeetingInsertWithTags") {
      MeetingInsertWithTagsPageRouterKey = item.key;
    }

    if (item.name == "MeetingSearchWithTags") {
      MeetingInsertWithTagsPageRouterKey = item.key;
    }
  }

  return <MeetingInsertWithTagsByPositionPage {...props} MeetingInsertWithTagsPageRouterKey={MeetingInsertWithTagsPageRouterKey} />;
}

export let MeetingInsertWithTagsByPositionPageStyle = connectStyle( 'Page.FormPage', {} )(MeetingInsertWithTagsByPositionPagefunction);

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
)(MeetingInsertWithTagsByPositionPageStyle);