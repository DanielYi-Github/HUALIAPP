import React from 'react';
import { View, FlatList, RefreshControl, VirtualizedList, Platform, Alert, Keyboard, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Content, Body, Right, Item, Input, Button, Icon, Title, Text, Card, CardItem, Label, connectStyle } from 'native-base';
import { tify, sify} from 'chinese-conv'; 
import { connect }   from 'react-redux';
import TagInput      from 'react-native-tags-input';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';
import * as NavigationService   from '../../utils/NavigationService';
import ToastUnit              from '../../utils/ToastUnit';


class FormContentTextWithTagsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sendValueBack : this.props.route.params.onPress,       // 將直傳回上一個物件,
      data : this.deepClone(this.props.route.params.data), // 深層複製,
      text : {
              COLUMN1: null, 
              COLUMN2: null, 
              COLUMN3: null, 
              COLUMN4: null
            },
      isShowSearch      :false,       //是否顯示關鍵字搜尋的輸入匡
      isSearch          :false,       //是反顯示關鍵字搜尋結果
      isChinesKeyword   :false,       //用來判斷關鍵字是否為中文字
      keyword           :"",          //一般搜尋
      sKeyword          :"",          //簡體中文
      tKeyword          :"",          //繁體中文
      searchedData      :[],          //關鍵字搜尋出來的資料
      searchedCount     :0,           //關鍵字搜尋出來的筆數
      isFooterRefreshing:false,
      isEnd             :false        //紀錄搜尋結果是否已經沒有更多資料
    };
  }

  render() {
    // 紀錄是否是關鍵字搜尋結果的資料
    let contentList = this.state.isSearch ? this.state.searchedData : this.state.data.actionValue.contentList;

    //整理tags的資料格式
    let tagsArray = [];
    this.state.data.defaultvalue = this.state.data.defaultvalue ? this.state.data.defaultvalue : [];
    for(let value of this.state.data.defaultvalue) tagsArray.push(value.COLUMN2);
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
                    {this.state.data.component.name}
                  </Title>
              </Body>
              <Right style={{alignItems: 'center'}}>
                <Button transparent onPress={()=>{ this.setState({ isShowSearch:true }); }}>
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
                    this.state.sendValueBack(this.state.data);
                    NavigationService.goBack();
                  }}
                >
                  <Text style={{color: '#FFF'}}>{this.props.state.Language.lang.CreateFormPage.Done}</Text>
                </TouchableOpacity>
              </Right>
            </Header>
        }

        <Label style={{marginLeft: 5, paddingTop: 20, color:this.props.style.inputWithoutCardBg.inputColorPlaceholder }}>{`${this.props.state.Language.lang.CreateFormPage.AlreadyAdd}${this.state.data.component.name}`}</Label>
        <View style={{flex:0.3, backgroundColor: this.props.style.InputFieldBackground}}>
            <Content ref ={(c) => { this._content = c; }}>
              <Item style={{backgroundColor: this.props.style.InputFieldBackground, borderBottomWidth: 0}}>
                <TagInput
                  disabled            ={true}
                  autoFocus           ={false}
                  updateState         ={(state)=>{ this.deleteTag(state); }}
                  tags                ={tags}
                  inputContainerStyle ={{ height: 0 }}
                  tagsViewStyle       ={{ margin:0 }}
                  tagStyle={{backgroundColor:"#DDDDDD", borderWidth:0}}
                  tagTextStyle={{color:"#666"}}
                />
              </Item> 
            </Content>
        </View>

        <View style={{flex:0 ,paddingTop: 20}}>
          <Label style={{marginLeft: 5, color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}}>{`${this.props.state.Language.lang.CreateFormPage.Add}${this.state.data.component.name}`}</Label>
          <Item style={{backgroundColor: this.props.style.InputFieldBackground, paddingLeft: 5, paddingRight: 5}}>
            <Input 
              ref ={(input) => { this.addTagInput = input; }}
              placeholder={`${this.props.state.Language.lang.CreateFormPage.KeyIn}${this.state.data.component.name}`}
              clearButtonMode = "while-editing" 
              maxLength = {20}
              onChangeText ={(text) => { 
                this.setState({
                  text:{
                    COLUMN1: null, 
                    COLUMN2: text, 
                    COLUMN3: null, 
                    COLUMN4: null
                  }
                }); 
              }}
              onSubmitEditing = {()=>{this.addTag(this.state.text);}}
            />

            <Icon 
              name    ="add-circle" 
              type    ="MaterialIcons" 
              style   ={{fontSize:30, color: '#20b11d'}}
              onPress ={()=>{this.addTag(this.state.text);}}
            />
          </Item>
        </View>

        <View style={{flex: 1, paddingTop: 20}}>
          <Label style={{marginLeft: 5, color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}}>{`${this.props.state.Language.lang.CreateFormPage.QuickSelect}${this.state.data.component.name}`}</Label>
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
            let searchedData = this.state.searchedData.concat(result[0].contentList);
            searchedData = searchedData.concat(result[1].contentList);

            this.setState({
              searchedData:this.dedup(searchedData),
              isFooterRefreshing:false,
              isEnd:(result[0].contentList.length == 0 && result[1].contentList.length == 0) ? true: false
            })
          } else {
            this.setState({
              searchedData:this.state.searchedData.concat(result[0].contentList),
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
        onPress ={()=>{ this.addTag(item.item);}} 
      >
        <Label>{item.item.COLUMN2}</Label>
      </Item>
    );
  }

  addTag = (item) => {
    this.addTagInput.wrappedInstance.clear();

    if (item.COLUMN2 == null || item.COLUMN2.replace(/^[\s　]+|[\s　]+$/g, "").length == 0) {
      ToastUnit.show('error', this.props.state.Language.lang.CreateFormPage.NoEmpty);
    } else {
      let data = this.state.data;
      let isAdded = false;

      for(let value of data.defaultvalue){
        if(item.COLUMN2 == value.COLUMN2) isAdded = true; 
      }

      if (isAdded) {
        ToastUnit.show('error', this.props.state.Language.lang.CreateFormPage.NoAreadyItem);
      } else {
          data.defaultvalue.push(item);
          this.setState({
            data: data
          });  
      }

      this._content.wrappedInstance.scrollToEnd({animated: true});
    }
  }

  deleteTag = (state) => {
    let data = this.state.data;
    for(let [i, value] of data.defaultvalue.entries()){
      let spliceIndex = 0;
      for(let item of state.tagsArray){
        if (value.COLUMN2 == item){
         spliceIndex = null;          
         break; 
        }
        spliceIndex = i;
      }

      if(spliceIndex != null){
       data.defaultvalue.splice(spliceIndex,1);
       break; 
      }
    }

    this.setState({
     data: data
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
      let keyword = this.state.isChinesKeyword ? this.state.tKeyword : this.state.keyword;
      if (this.state.isSearch && this.state.searchedData.length == 0) {
        footer = (
          <Item style={{padding: 15, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
              <Label style={{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}}>{`${this.props.state.Language.lang.CreateFormPage.SearchNothing} "${this.state.data.component.name}"`}</Label>
              <Label style={{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}}>{`${this.props.state.Language.lang.CreateFormPage.AddSearchItemOrNot} "${keyword}" ${this.state.data.component.name} ?`}</Label>
              <Button light
                style={{
                  marginTop: 15,
                  padding: 15,
                  alignSelf: 'center', 
                  borderColor: '#575757'
                }}
                onPress={()=>{
                  this.addTag({
                    COLUMN1: null, 
                    COLUMN2: keyword, 
                    COLUMN3: null, 
                    COLUMN4: null
                  });
                }}
              >
                <Text>{this.props.state.Language.lang.CreateFormPage.AddSearchItem}</Text>
                <Icon name="add" />
              </Button>
          </Item>
        )
      } else {
        footer = (
          <Item style={{padding: 15, justifyContent: 'center', backgroundColor: this.props.style.InputFieldBackground}}>
              <Label>{this.props.state.Language.lang.ListFooter.NoMore}</Label>
          </Item>
        )  
      }
    }

    return footer;
  }

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

export let FormContentTextWithTagsPageStyle = connectStyle( 'Page.FormPage', {} )(FormContentTextWithTagsPage);

export default connect(
  (state) => ({
    state: {...state}
  })
)(FormContentTextWithTagsPageStyle);