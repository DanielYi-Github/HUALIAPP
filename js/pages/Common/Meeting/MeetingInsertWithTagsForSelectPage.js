import React from 'react';
import { View, FlatList, RefreshControl, VirtualizedList, Platform, Alert, Keyboard, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Container, Header, Left, Content, Body, Right, Item, Input, Button, Icon, Title, Text, Card, CardItem, Label, Footer, connectStyle } from 'native-base';
import { tify, sify} from 'chinese-conv'; 
import { connect }   from 'react-redux';
import TagInput      from 'react-native-tags-input';
import { bindActionCreators } from 'redux';
import * as RNLocalize from "react-native-localize";
import ModalWrapper from "react-native-modal";
import { NavigationContainer, useRoute, useNavigationState } from '@react-navigation/native';
import SearchInput, { createFilter } from 'react-native-search-filter'; 
const KEYS_TO_FILTERS = ['name'];

import * as UpdateDataUtil    from '../../../utils/UpdateDataUtil';
import * as NavigationService from '../../../utils/NavigationService';
import ToastUnit              from '../../../utils/ToastUnit';
import TinyCircleButton       from '../../../components/TinyCircleButton';
import * as MeetingAction     from '../../../redux/actions/MeetingAction';
import MeetingItemForAttendees      from '../../../components/Meeting/MeetingItemForAttendees';
import MeetingItemForOrgnize        from '../../../components/Meeting/MeetingItemForOrgnize';
import MeetingSelectAttendeesFooter from '../../../components/Meeting/MeetingSelectAttendeesFooter';

class MeetingInsertWithTagsForSelectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title              : this.props.route.params.title,        //畫面標題
      orgManager         : this.props.route.params.orgManager,   
      selectList         : this.props.route.params.selectList,   //用哪一種模式下去選擇
      onItemPress        : this.props.route.params.onItemPress,
      renderItemMode     : this.props.route.params.renderItemMode,
      onItemNextIconPress: this.props.route.params.onItemNextIconPress,
      showFooter         : this.props.route.params.showFooter,
      isShowSearch       : false,       //是否顯示關鍵字搜尋的輸入匡
      isChinesKeyword    : false,       //用來判斷關鍵字是否為中文字
      keyword            : "",          //一般搜尋
      sKeyword           : "",          //簡體中文
      tKeyword           : "",          //繁體中文
      isSearch           : false,       //是反顯示關鍵字搜尋結果
      checkState         : false,
      loading_index      : false,
      showAllSelectChk   : this.props.route.params.showAllSelectChk  ? this.props.route.params.showAllSelectChk: false,
      onSelectChkValueChange  : this.props.route.params.onSelectChkValueChange ? this.props.route.params.onSelectChkValueChange: null
    };
  }

  render() {
    //過濾關鍵字所查詢的資料
    let filteredData;
    if (this.state.isChinesKeyword) {
      filteredData = this.state.selectList.filter(createFilter(this.state.tKeyword, KEYS_TO_FILTERS));
      let data = this.state.selectList.filter(createFilter(this.state.sKeyword, KEYS_TO_FILTERS));
      
      for (var i = 0; i < data.length; i++) {
        filteredData.push(data[i]);
      }
    } else {
      filteredData = this.state.selectList.filter(createFilter(this.state.keyword, KEYS_TO_FILTERS));
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
                    {/*this.props.lang.MeetingPage.attendeesInvite*/}
                    {this.state.title}
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
          extraData             = {this.state.checkState}
          ListHeaderComponent   = {this.state.orgManager ? this.renderHeaderComponent: null}
          renderItem            = {this.renderTapItem}
          ListEmptyComponent    = {this.renderEmptyComponent}
        />

        {
          this.state.showFooter ? 
            <MeetingSelectAttendeesFooter
              lang         = {this.props.state.Language.lang}
              selectNumber = {this.props.state.Meeting.attendees.length}
              onPress      = { () => NavigationService.navigate("MeetingAttendeesReorder")}
              MeetingInsertWithTagsPageRouterKey  = {this.props.MeetingInsertWithTagsPageRouterKey}
              // 要不要顯示全選按鈕
              showAllSelectChk       = {this.state.showAllSelectChk}
              // 全選之後需要給定的值           
              allSelectChkValue      = {this.allSelectChkValue(filteredData)}
              // 全選與取消全選要做的事
              onSelectChkValueChange = {(value)=>{    
                this.state.onSelectChkValueChange(value, filteredData)
              }}
            />
          :
            null
        }

        <ModalWrapper 
          style             ={{flex: 1}} 
          isVisible         ={this.props.state.Meeting.blocking}
          animationInTiming ={5}
          backdropOpacity   ={0}
        >
          <View style={{ flex: 1 }}/>
        </ModalWrapper>

      </Container>
    );
  }

  renderHeaderComponent = () => {
    return (
      <View>
        <Label style={{
          paddingTop   : 25,
          paddingBottom: 5, 
          paddingLeft  : 10, 
          color        : this.props.style.inputWithoutCardBg.inputColorPlaceholder}}
        >
          {this.props.state.Language.lang.MeetingPage.departmentHead}
        </Label>
        {this.multiAttendees(this.state.orgManager[0])}

        <Label style={{
          paddingTop   : 25,
          paddingBottom: 5, 
          paddingLeft  : 10, 
          color        : this.props.style.inputWithoutCardBg.inputColorPlaceholder}}
        >
          {this.props.state.Language.lang.MeetingPage.departmentOfCharged}
        </Label>
      </View>
    );
  }

  renderTapItem = (item) => {
    switch(this.state.renderItemMode) {
      case "normal": // 一般
        return this.normal(item.item);
        break;
      case "multiCheck": // 多選
        return this.multiCheck(item.item, item.index);
        break;
      case "multiAttendees": // 多選參與人
        return this.multiAttendees(item.item);
        break;
    } 
  }

  normal = (item) => {
    return (
      <Item 
        fixedLabel 
        style   ={{padding: 10, backgroundColor: this.props.style.InputFieldBackground }} 
        onPress ={ async ()=>{ 
          this.setState({ loading_index:item.key })
          this.state.onItemPress(item);
        }} 
      >
        <Label>{item.name}</Label>
        <ActivityIndicator
          animating ={this.props.state.Meeting.blocking && item.key == this.state.loading_index}
          color     ={this.props.style.SpinnerColor}
          style     ={{marginRight: 10}}
        />
      </Item>
    );
  }

  multiCheck = (item, index) => {
    let allOrgAttendees = this.getAllOrgAttendees(item);
    let selectedCount = 0;
    let included = false;
    
    // 確認有沒有已經包含在裡面，用來顯示不同的勾勾顏色
    for(let positionAttendee of allOrgAttendees){
      for(let propsAttendee of this.props.state.Meeting.attendees){
        if( positionAttendee.id == propsAttendee.id ){
          included = true;
          selectedCount++;
          break;
        }
      }
    }
    let checked = selectedCount == allOrgAttendees.length ? true: false;
    let checkBoxColor = checked == included ? "#00C853": "#9E9E9E";
    return (
      <MeetingItemForOrgnize
        item            = {item}
        checked         = {checked}
        included        = {included}
        checkBoxColor   = {checkBoxColor}
        itemOnPress     = {(value)=>{
          this.setState({ loading_index:index });
          this.state.onItemPress(value);
        }}
        onItemNextIconPress = {this.state.onItemNextIconPress}
        loading         = {this.props.state.Meeting.blocking && index == this.state.loading_index}
      />
    );
  }

  getAllOrgAttendees = (checkItemAttendees) => {
    let tempAttendees = [];
    if( checkItemAttendees.members !== null ){
      tempAttendees = tempAttendees.concat(checkItemAttendees.members)
    }

    if ( checkItemAttendees.subDep !== null ) {
      for(let subDep of checkItemAttendees.subDep){
        tempAttendees = tempAttendees.concat(this.getAllOrgAttendees(subDep));
      }
    }

    return tempAttendees;
  }

  multiAttendees = (item) => {
    let checked = false;
    for(let attendee of this.props.state.Meeting.attendees){
      if (attendee.id == item.id) {
        checked = true;
      }
    }
    
    return (
      <MeetingItemForAttendees
        item            = {item}
        checked         = {checked}
        itemOnPress     = {this.props.actions.attendeeItemOnPress}
        calendarOnPress = {this.props.actions.attendeeItemCalendarOnPress}
      />
    );
  }

  renderEmptyComponent = () => {
    let footer = (
          <Item style={{padding: 15, justifyContent: 'center', backgroundColor: this.props.style.InputFieldBackground}}>
              <Label>{this.props.state.Language.lang.ListFooter.NoMore}</Label>
          </Item>
        );
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

  removeSpace(string){
    string = string.replace(/\r\n/g,"");
    string = string.replace(/\n/g,"");
    string = string.replace(/\s/g,"");
    return string;
  }

  allSelectChkValue = (items) => {
    console.log("allSelectChkValue", items);

    // 清單的全部有沒有包含已選擇的全部
    let isAllSelected = false;
    for(let item of items){
      isAllSelected = false
      for(let attendee of this.props.state.Meeting.attendees){
        if(item.id == attendee.id){
          isAllSelected = true;
          break;
        }
      }
      if(!isAllSelected) break;
    }

    return isAllSelected
  }
}

// Wrap and export
let MeetingInsertWithTagsForSelectPagefunction = (props) => {
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

  return <MeetingInsertWithTagsForSelectPage {...props} MeetingInsertWithTagsPageRouterKey={MeetingInsertWithTagsPageRouterKey} />;
}

export let MeetingInsertWithTagsForSelectPageStyle = connectStyle( 'Page.FormPage', {} )(MeetingInsertWithTagsForSelectPagefunction);

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
)(MeetingInsertWithTagsForSelectPageStyle);