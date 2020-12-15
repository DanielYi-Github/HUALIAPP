import React from 'react';
import { View, FlatList, RefreshControl, VirtualizedList, Platform, Alert, Keyboard, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Body, Right, Item, Input, Button, Icon, Title, Text, Card, CardItem, Label, connectStyle } from 'native-base';
import { tify, sify} from 'chinese-conv'; 
import { connect }   from 'react-redux';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';
import * as NavigationService   from '../../utils/NavigationService';

class FormContentChkWithActionPage extends React.Component {
  constructor(props) {
    super(props);
    let data = this.deepClone(this.props.route.params.data); // 深層複製
    let defaultvalue = ( data.defaultvalue == null || data.defaultvalue == ""  ) ? [] : data.defaultvalue;

    this.state = {
      sendValueBack     :this.props.route.params.onPress,       // 將直傳回上一個物件,
      data              :data,
      isShowSearch      :false,       //是否顯示關鍵字搜尋的輸入匡
      isSearch          :false,       //是反顯示關鍵字搜尋結果
      isChinesKeyword   :false,       //用來判斷關鍵字是否為中文字
      keyword           :"",          //一般搜尋
      sKeyword          :"",          //簡體中文
      tKeyword          :"",          //繁體中文
      searchedData      :[],          //關鍵字搜尋出來的資料
      searchedCount     :0,           //關鍵字搜尋出來的筆數
      isFooterRefreshing:false,
      selectedArray     :defaultvalue, //紀錄已經被選擇的選項
      isEnd             :false         //紀錄搜尋結果是否已經沒有更多資料
    };
  }

  render() {
    // 紀錄是否是關鍵字搜尋結果的資料
    let contentList = this.state.isSearch ? this.state.searchedData : this.state.data.actionValue.contentList;

    // 搜尋出來結果資料的長度
    let selectCount = this.state.selectedArray.length;
    let FormSign = this.props.state.Language.lang.FormSign;
    selectCount = (selectCount == 0) ? "" : `(${FormSign.AlreadySelect}${selectCount}${FormSign.Members})`;
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
                        isChinesKeyword:false,
                        isEnd          :false
                      }); 
                    } else {                  // 是中文字
                      this.setState({ 
                        sKeyword:sText,
                        tKeyword:tText,
                        isChinesKeyword:true,
                        isEnd          :false
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
                    isEnd        :false        
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
                <Button transparent onPress={() =>{NavigationService.goBack()}}>
                  <Icon name='arrow-back' style={{color:this.props.style.color}}/>
                </Button>
              </Left>
              <Body onPress={()=>{ this.setState({ isShowSearch:true });}}>
                  <Title style={{color:this.props.style.color}} onPress={()=>{ this.setState({ isShowSearch:true });}}>
                    {this.state.data.component.name}{selectCount}
                  </Title>
              </Body>
              <Right style={{alignItems: 'center'}}>
                <Button transparent onPress={()=>{ this.setState({ isShowSearch:true,}); }}>
                  <Icon name='search' style={{color:this.props.style.color}}/>
                </Button>
                <TouchableOpacity 
                  style={{
                    backgroundColor: '#47ACF2', 
                    paddingLeft: 10, 
                    paddingRight: 10,
                    paddingTop: 5,
                    paddingBottom: 5, 
                    borderRadius: 10
                  }}
                  onPress={()=>{
                    Keyboard.dismiss();
                    this.state.sendValueBack(this.state.selectedArray);
                    NavigationService.goBack();
                  }}
                >
                  <Text style={{color: '#FFF'}}>{this.props.state.Language.lang.CreateFormPage.Done}</Text>
                </TouchableOpacity>
              </Right>
            </Header>
        }
        <FlatList
          keyExtractor          ={(item, index) => index.toString()}
          data                  = {contentList}
          extraData             = {this.state}
          renderItem            = {this.renderTapItem}
          ListFooterComponent   = {this.renderFooter}
          onEndReachedThreshold = {0.3}
          onEndReached          = {this.state.isEnd ? null :this.loadMoreData}
        />
      </Container>
    );
  }

  loadMoreData = (isSearching, searchedData = null) => {
    // 檢查是不是關鍵字搜尋
    isSearching = (typeof isSearching == "object") ? false : isSearching;
    let isSearch = isSearching ? isSearching : this.state.isSearch;
    searchedData = (searchedData == null) ? this.state.searchedData : searchedData;

    let user = this.props.state.UserInfo.UserInfo;
    let action = this.state.data.action;

    this.setState({ isFooterRefreshing: true });

    if (!this.state.isFooterRefreshing) {
      // 是不是關鍵字搜尋
      if (isSearch) {
        let count = (searchedData.length == 0) ? searchedData.length : searchedData.length+20
        let searchList = [];

        if (this.state.isChinesKeyword) {
          searchList = [
            UpdateDataUtil.getCreateFormDetailFormat(user, action, {count:count, condition:this.state.sKeyword}),
            UpdateDataUtil.getCreateFormDetailFormat(user, action, {count:count, condition:this.state.tKeyword})
          ];
        } else {
          searchList.push(
            UpdateDataUtil.getCreateFormDetailFormat(user, action, {count:count, condition:this.state.keyword})
          );
        }

        Promise.all(searchList).then((result) => {
            if (this.state.isChinesKeyword) {
              let searchedData = this.state.searchedData.concat(result[0].contentList);
              searchedData = searchedData.concat(result[1].contentList);

              this.setState({
                searchedData:this.dedup(searchedData),
                searchedCount:count,
                isFooterRefreshing:false,
                isEnd:(result[0].contentList.length == 0 && result[1].contentList.length == 0) ? true: false
              })
            } else {
              this.setState({
                searchedData:this.state.searchedData.concat(result[0].contentList),
                searchedCount:count,
                isFooterRefreshing:false,
                isEnd:result[0].contentList.length == 0 ? true: false
              })
            }
        }).catch((err) => {
          console.log(err);
        })

      } else {
        let actionObject = this.state.data.actionValue.actionObject;
        actionObject.count = this.state.data.actionValue.contentList.length;

        UpdateDataUtil.getCreateFormDetailFormat(user, action, actionObject).then((result)=>{

          let data = this.state.data;
          data.actionValue.contentList = data.actionValue.contentList.concat(result.contentList);
          this.setState({
            data:data,
            isFooterRefreshing:false,
            isEnd:result.contentList.length == 0 ? true : false
          })
        });
      }
    }
  }

  renderTapItem = (item) => {
    let checkIcon = null;
    let selectedArray = this.state.selectedArray;
    for(let selectedItem of this.state.selectedArray){
      if(selectedItem.COLUMN1 == item.item.COLUMN1 ){
        checkIcon = (
          <Icon 
            name    ="checkbox" 
            style   ={{color: '#20b11d'}}
          />
        );
      }
    }

    return (
      <Item 
        fixedLabel 
        style   ={{padding: 15, backgroundColor: this.props.style.InputFieldBackground}} 
        onPress ={()=>{ this.checkSelectedArray(item.item); }} 
      >
        <Label>{item.item.COLUMN2}</Label>
        {checkIcon}
      </Item>
    );
  }

  checkSelectedArray = (item) => {
    let selectedArray = this.state.selectedArray;
    let isSelected = false;             // 有沒有選過
    let selectedIndex = null;           // 第幾筆
    for(let [i, selected] of selectedArray.entries()){
      if(selected.COLUMN1 == item.COLUMN1){
        isSelected = true;
        selectedIndex = i;
      }
    }

    if(isSelected){
      selectedArray.splice(selectedIndex, 1);
    }else{
      selectedArray.push(item);
    }

    this.setState({
      selectedArray:selectedArray
    });
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

  // deep clone
  deepClone(src) {
    return JSON.parse(JSON.stringify(src));
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

export let FormContentChkWithActionPageStyle = connectStyle( 'Page.FormPage', {} )(FormContentChkWithActionPage);

export default connect(
  (state) => ({
    state: {...state}
  })
)(FormContentChkWithActionPageStyle);