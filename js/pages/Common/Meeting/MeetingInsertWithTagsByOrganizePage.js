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
import MeetingSelectAttendeesFooter from '../../../components/Meeting/MeetingSelectAttendeesFooter';
import * as MeetingAction     from '../../../redux/actions/MeetingAction';
import { NavigationContainer, useRoute, useNavigationState } from '@react-navigation/native';

import SearchInput, { createFilter } from 'react-native-search-filter'; 
const KEYS_TO_FILTERS = ['name'];

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
      isFooterRefreshing: false,
    };
  }

  componentDidMount(){
    this.props.actions.getCompanies();    // 獲取公司列表資料
  }

  render() {
    //過濾關鍵字所查詢的資料
    let filteredData;
    if (this.state.isChinesKeyword) {
      filteredData = this.props.state.Meeting.companies.filter(createFilter(this.state.tKeyword, KEYS_TO_FILTERS));
      let data = this.props.state.Meeting.companies.filter(createFilter(this.state.sKeyword, KEYS_TO_FILTERS));
      
      for (var i = 0; i < data.length; i++) {
        filteredData.push(data[i]);
      }
    } else {
      filteredData = this.props.state.Meeting.companies.filter(createFilter(this.state.keyword, KEYS_TO_FILTERS));
    }

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
                  });
                }}>
                  <Icon name="close" style={{color:this.props.style.color}}/>
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
                    {this.props.lang.MeetingPage.invitedByOrganization}
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
          data                  = {filteredData}
          extraData             = {this.props.state.Meeting}
          renderItem            = {this.renderTapItem}
          ListFooterComponent   = {this.renderFooter}
          ListEmptyComponent    = {this.renderEmptyComponent}
        />

        <MeetingSelectAttendeesFooter
          lang         = {this.props.state.Language.lang}
          selectNumber = {this.props.state.Meeting.attendees.length}
          onPress      = {()=> NavigationService.navigate("MeetingAttendeesReorder")}
          MeetingInsertWithTagsPageRouterKey = {this.props.MeetingInsertWithTagsPageRouterKey}
        />
      </Container>
    );
  }

  renderTapItem = (item) => {
    item = item.item;
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
              this.props.actions.blocking(true); 
              await this.props.actions.getOrg(value); // 取得組織架構資料
              this.navigateNextOrg();
            },
            renderItemMode:"normal",  // normal一般, multiCheck多選, multiAttendees多選參與人
            showFooter    :true,
            title         :this.props.state.Language.lang.PublishSubmitSelectPage.SelectFactory
          });
        }} 
      >
        <Label>{item.name} </Label>
      </Item>
    );
  }

  getFactories = async (com) => {
    let sql = `select * from THF_MASTERDATA 
               where CLASS1='HRPZID' and CLASS3='${com}' and STATUS='Y' 
               order by SORT;`
    let factories = await SQLite.selectData( sql, []).then((result) => {
      let items = [];
      for (let i in result.raw()) {
        items.push({
          key  :result.raw()[i].SORT,
          name:result.raw()[i].CONTENT,
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
    if(org){
      NavigationService.push("MeetingInsertWithTagsForSelect", {
        orgManager    :org.members == null ? false : org.members,
        selectList    :org.subDep,
        onItemPress   :async (value)=>{
          this.props.actions.organizeCheckboxOnPress( value );
        },
        onItemNextIconPress:(value)=>{
          if(value.subDep == null){
            NavigationService.push("MeetingInsertWithTagsForSelect", {
              selectList    :value.members,
              onItemPress   :this.props.actions.getPositions,
              renderItemMode:"multiAttendees",  // normal一般, multiCheck多選, multiAttendees多選參與人
              showFooter    :true,
              title         :this.props.lang.MeetingPage.attendeesInvite
            });
          }else{
            this.navigateNextOrg(value);
          }
        },
        renderItemMode:"multiCheck",  // normal一般, multiCheck多選, multiAttendees多選參與人
        showFooter    :true,
        title         : this.props.lang.MeetingPage.attendeesInvite
      });
      this.props.actions.blocking(false);
    }else{
      // 表示org為null, 沒有東西顯示
      Alert.alert(
        this.props.state.Language.lang.Common.Alert,
        this.props.state.Language.lang.MeetingPage.noneNextOrg,
        [
          { text: "OK", onPress: () => this.props.actions.blocking(false) }
        ],
        { cancelable: false }
      );
    }
  }

  renderFooter = () => {
    let footer = null
    footer = (
      <Item style={{padding: 15, justifyContent: 'center', backgroundColor: this.props.style.InputFieldBackground}}>
          <Label>{this.props.state.Language.lang.ListFooter.NoMore}</Label>
      </Item>
    )

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
}

// Wrap and export
let MeetingInsertWithTagsFurtherPagefunction = (props) => {
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

  return <MeetingInsertWithTagsByOrganizePage {...props} MeetingInsertWithTagsPageRouterKey={MeetingInsertWithTagsPageRouterKey} />;
}

export let MeetingInsertWithTagsByOrganizePageStyle = connectStyle( 'Page.FormPage', {} )(MeetingInsertWithTagsFurtherPagefunction);

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