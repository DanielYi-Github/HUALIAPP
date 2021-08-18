import React from 'react';
import { View, FlatList, RefreshControl, VirtualizedList, Platform, Alert, Keyboard } from 'react-native';
import { Container, Header, Left, Content, Body, Right, Item, Input, Button, Icon, Title, Text, Card, CardItem, Label, connectStyle } from 'native-base';
import { tify, sify} from 'chinese-conv'; 
import { connect }   from 'react-redux';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';
import * as NavigationService   from '../../utils/NavigationService';
import HeaderForSearch     from '../HeaderForSearch';

class FormContentTextWithActionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sendValueBack : this.props.route.params.onPress,       // 將直傳回上一個物件,
      data : this.deepClone(this.props.route.params.data), // 深層複製,
      isShowSearch      :false,
      isSearch          :false,
      isChinesKeyword   :false,       //用來判斷關鍵字是否為中文字
      keyword           :"",          //一般搜尋
      sKeyword          :"",          //簡體中文
      tKeyword          :"",          //繁體中文
      searchedData      :[],          //關鍵字搜尋出來的資料
      isFooterRefreshing:false,
      isEnd             :false        //紀錄搜尋結果是否已經沒有更多資料
    };
  }

  render() {
    // 紀錄是否是關鍵字搜尋結果的資料
    let contentList = this.state.isSearch ? this.state.searchedData : this.state.data.actionValue.contentList;

    return (
      <Container>
        {/*標題列*/}
        <HeaderForSearch
          /*搜尋框的部分*/
          isShowSearch = {this.state.isShowSearch}
          placeholder  = {this.props.state.Language.lang.ContactPage.SearchKeyword}
          onChangeText ={(text) => { 
            let sText = sify(text);   //簡體中文
            let tText = tify(text);   //繁體中文

            if (tText === sText) {    // 不是中文字
              this.setState({ 
                keyword:text,
                isChinesKeyword:false,
                isEnd:false
              }); 
            } else {                  // 是中文字
              this.setState({ 
                sKeyword:sText,
                tKeyword:tText,
                isChinesKeyword:true,
                isEnd:false
              }); 
            }
          }}
          closeSearchButtomOnPress={() =>{
            this.setState({ 
                isShowSearch   :false,
                isSearch       :false,
                isChinesKeyword:false, 
                keyword        :"",    
                sKeyword       :"",    
                tKeyword       :"",
                searchedData   :[],
                isEnd:false
              });
            }
          }
          searchButtomOnPress={()=>{
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
              this.loadMoreData(true,[])
            }
          }}
          searchButtomText={this.props.state.Language.lang.Common.Search}
          /*標題框的部分*/
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:'arrow-back'}}
          leftButtonOnPress     = {() =>NavigationService.goBack()} 
          isRightButtonIconShow = {true}
          rightButtonIcon       = {{name:'search'}}
          rightButtonOnPress    = {()=>{ this.setState({ isShowSearch:true }); }} 
          title                 = {this.state.data.component.name}
          titleOnPress          = {()=>{ this.setState({ isShowSearch:true }) }}
        />
        <FlatList
          keyExtractor          ={(item, index) => index.toString()}
          data                  = {contentList}
          extraData             = {this.state.isFooterRefreshing}
          renderItem            = {this.renderTapItem}
          ListFooterComponent   = {this.renderFooter}
          onEndReachedThreshold = {0.3}
          onEndReached          = {this.state.isEnd ? null :this.loadMoreData}
        />
      </Container>
    );
  }


  loadMoreData = (isSearching, searchedData = null) => {
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
            searchedData = searchedData.concat(result[0].contentList);
            searchedData = searchedData.concat(result[1].contentList);

            this.setState({
              searchedData:this.dedup(searchedData),
              isFooterRefreshing:false,
              isEnd:(result[0].contentList.length == 0 && result[1].contentList.length == 0) ? true: false
              
            })
          } else {
            this.setState({
              searchedData:searchedData.concat(result[0].contentList),
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
            isEnd:result.contentList.length == 0 ? true: false
          })
        });
      }
    }
  }

  renderTapItem = (item) => {
    return (
      <Item 
        fixedLabel 
        style   ={{padding: 15, backgroundColor: this.props.style.InputFieldBackground}} 
        onPress ={()=>{
          this.state.sendValueBack(item.item);
          NavigationService.goBack();
        }} 
      >
        <Label>{item.item.COLUMN2}</Label><Text note>{item.item.COLUMN3}</Text>
      </Item>
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

export let FormContentTextWithActionPageStyle = connectStyle( 'Page.FormPage', {} )(FormContentTextWithActionPage);

export default connect(
  (state) => ({
    state: {...state}
  })
)(FormContentTextWithActionPageStyle);