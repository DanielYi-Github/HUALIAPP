import React from 'react';
import { FlatList, Platform, RefreshControl, View, ActivityIndicator, Keyboard } from 'react-native';
import { Container, Header, Icon, Left, Button, Body, Right, Title, Content, Text, Card, CardItem, Badge, Item, Input, connectStyle} from 'native-base';
import { tify, sify} from 'chinese-conv'; 
import ActionSheet from 'react-native-actionsheet';
import SearchInput, { createFilter } from 'react-native-search-filter'; 

import FunctionPageBanner from '../../../components/FunctionPageBanner';
import FormItem           from '../../../components/Form/FormItem';
import NoMoreItem         from '../../../components/NoMoreItem';
import HeaderForSearch    from '../../../components/HeaderForSearch';
import * as NavigationService  from '../../../utils/NavigationService';
import ToastUnit               from '../../../utils/ToastUnit';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as FormAction from '../../../redux/actions/FormAction';

class FormTypeListPage extends React.Component {
  constructor(props) {
    super(props);

    let Companies_FormSign = this.props.state.Form.Companies_FormSign;
    this.state = {
      isShowSearch   :false,
      isChinesKeyword:false, 
      keyword        :"",    
      sKeyword       :"",    
      tKeyword       :"",
      isSelectedCompany:false,
      selectedCompany  :( Companies_FormSign.companyList.length == 0 ) ? false : Companies_FormSign.defaultCO.CONTENT,
    }
  }

  componentDidMount() {
    //檢查是否發生錯誤訊息
    if (this.props.state.Form.loadMessgae) {
      this.props.actions.loadFormTypeIntoState( this.props.state.UserInfo.UserInfo, this.props.state.Language.langStatus );
    } else {
      this.isLoadError(this.props.state.Form.loadMessgae);
      // 重新仔入表單
      if (this.props.state.Form.isLoadDone) this.props.actions.loadAllFormsIntoState();
    }
  }

  componentDidUpdate(){
    this.isLoadError(this.props.state.Form.loadMessgae);
  }

  //檢查是否發生錯誤訊息
  //
  isLoadError(error){ if(error) ToastUnit.show('error', error); }

  // 公司清單的篩選
  filterCompany = (forms) => {
    let KEYS_TO_FILTERS = ['creatorCO'];
    return forms.filter(createFilter(this.state.isSelectedCompany.CLASS3, KEYS_TO_FILTERS));
  }

  // 關鍵字搜尋的篩選與排版
  filterKeyword = (FormTypes) => {
    let signforms = [], unSignForms = [];
    for (let i in FormTypes) {
      if ( i == (FormTypes.length-1) ) {
        unSignForms = FormTypes[i].data;
      } else {
        signforms = [...signforms, ...FormTypes[i].data];
      }
    }

    let filteredData = [this.filter(signforms), this.filter(unSignForms)];

    /***進行關鍵字搜尋後排版動作***/
      let filteredView = (
        <Body style={{width: '100%'}}>
          {/*可以簽核的單子*/}
          {
            (filteredData[0].length !== 0)?
              <Body style={{width: '100%'}}>
                <Title style={{paddingTop: 20}}>{this.props.state.Language.lang.FindPage.SearchResult}</Title>
                <View style={{width:"50%", height:3, backgroundColor:"#757575", alignSelf: 'center', marginBottom: 10}}/>
                <FlatList
                  keyExtractor = {(item, index) => index.toString()}
                  data         = {filteredData[0]}
                  renderItem   = {this.renderFormItem}
                />
              </Body>
            :
              null
          }
          {/*不能簽核的單子*/}
          {
            (filteredData[1].length !== 0)?
              <Body style={{width: '100%'}}>
                <Title style={{paddingTop: 20}}>{this.props.state.Language.lang.FormTypeListPage.SignByPC}</Title>
                <View style={{width:"50%", height:3, backgroundColor:"#757575", alignSelf: 'center', marginBottom: 10}}/>
                <FlatList
                  keyExtractor = {(item, index) => index.toString()}
                  data         = {filteredData[1]}
                  renderItem   = {this.renderFormItem}
                />
              </Body>
            :
              null
          }


          {
          (this.props.state.Form.isRefreshing) ?
            <View style={{height:200,width:"100%", paddingTop:20}}>
              <ActivityIndicator size="large" color="#47ACF2" />
            </View>
          :
            <NoMoreItem text={this.props.state.Language.lang.ListFooter.NoMore}/>
          }
        </Body>
      );
    /***排版動作結束***/

    return filteredView;
  }

  //過濾關鍵字所查詢的資料
  filter = (forms) => {
    let isChinesKeyword = this.state.isChinesKeyword; 
    let keyword         = this.state.keyword; 
    let sKeyword        = this.state.sKeyword; 
    let tKeyword        = this.state.tKeyword; 
    let KEYS_TO_FILTERS = ['keyword', 'name', 'processname']; // 關鍵字搜尋的欄位
    let filteredData;
    if (isChinesKeyword) {
    // 是中文
      filteredData = forms.filter(createFilter(tKeyword, KEYS_TO_FILTERS));
      let data = forms.filter(createFilter(sKeyword, KEYS_TO_FILTERS));
      filteredData = [...filteredData, ...data];

    } else {
    // 不是中文 
      filteredData = forms.filter(createFilter(keyword, KEYS_TO_FILTERS));
    }
    return filteredData;
  }

  divideForms = (FormTypes, FormSigns) => {
    for (let i in FormTypes) FormTypes[i].data = [];
    for (let i in FormSigns) {
      if(FormSigns[i].isGroupSign=="true"){
        switch (FormSigns[i].formtype) {
          case FormTypes[0].key:
            FormTypes[0].data.push(FormSigns[i]) ;
            break;
          case FormTypes[1].key:
            FormTypes[1].data.push(FormSigns[i]) ;
            break;
          case FormTypes[2].key:
            FormTypes[2].data.push(FormSigns[i]) ;
            break;
          case FormTypes[3].key:
            FormTypes[3].data.push(FormSigns[i]) ;
            break;
          case FormTypes[4].key:
            FormTypes[4].data.push(FormSigns[i]) ;
            break;
          case FormTypes[5].key:
            FormTypes[5].data.push(FormSigns[i]) ;
            break;
          case FormTypes[6].key:
            FormTypes[6].data.push(FormSigns[i]) ;
            break;
          default:
            break;
        }
      }else{
        FormTypes[7].data.push(FormSigns[i]) ;
      }
    }
    return FormTypes;
  }

  renderFormTypeLayout = (FormTypes) => {
    /***進行功能鍵布局的排版動作***/
      let cardItems = [], cardItemList = [], cardItemView = [];
      for(var i in FormTypes){
        FormTypes[i].formtypeIndex = i;
        cardItems.push(FormTypes[i]);
        if( (parseInt(i)+1) % 3 == 0 ){
          cardItemList.push(cardItems);
          cardItems = [];
        }
      }
      
      if (cardItems.length != 0) {
        for (var i = cardItems.length ; i < 3; i++) {
          cardItems.push({key:"SPACE"});
        }
        cardItemList.push(cardItems);
        cardItems = [];  
      }

      for(var i in cardItemList){
        cardItemView.push(
          <Body key={i} style={{ flexDirection : 'row', width:this.props.style.PageSize.width*0.95 }}>
            <FlatList
              keyExtractor  = {(item, index) => index.toString()}
              numColumns    = {3} 
              renderItem    = {this.renderFormTypeItem}
              data          = {cardItemList[i]}
              scrollEnabled = {false}
            />
          </Body>
        )
      }

      return cardItemView;
    /***排版動作結束***/
  }

  render() {
    let forms = this.state.selectedCompany ? this.props.state.Form.FormSigns : [] ;           // 原始清單內容 如果沒有公司選項給空陣列
    forms = this.state.isSelectedCompany ? this.filterCompany(forms) : forms;                             // 公司清單篩選
    forms = this.divideForms(this.props.state.Form.FormTypes, forms);                                     // 進行表單資料的分類與數量
    forms = this.state.isShowSearchResult ? this.filterKeyword(forms) : this.renderFormTypeLayout(forms); // 顯示關鍵字搜尋 或 表單列表

    return(
      <Container>
          {/*標題列*/}
          <HeaderForSearch
            /*搜尋框的部分*/
            isShowSearch             = {this.state.isShowSearch}
            placeholder              = {this.props.state.Language.lang.ContactPage.SearchKeyword}
            onChangeText             = {this.onChangeText}
            onSubmitEditing          = {this.onFormTypeKeywordSearch}
            closeSearchButtomOnPress = {this.closeKeywordSearch}
            searchButtomOnPress      = {this.onFormTypeKeywordSearch}
            searchButtomText         = {this.props.state.Language.lang.Common.Search}
            /*標題框的部分*/
            isLeftButtonIconShow  = {true}
            leftButtonIcon        = {{name:'arrow-back'}}
            leftButtonOnPress     = {()=>NavigationService.goBack()} 
            isRightButtonIconShow = {this.props.state.Form.isLoadDone ? true: false}
            rightButtonIcon       = {{name:'search'}}
            rightButtonOnPress    = {()=>{ this.setState({ isShowSearch:true });}} 
            title                 = {this.props.state.Language.lang.HomePage.FormTypeList}
            titleOnPress          = {()=>{ this.setState({ isShowSearch:true });}}
          />
           <FunctionPageBanner
              explain         ={this.props.state.Language.lang.FormTypeListPage.FunctionInfo} //隨時了解表單狀態，流程追蹤、表單簽核目了然，簡單管理流程進度。
              isShowButton    ={this.state.selectedCompany ? true : false}
              buttonText      ={this.state.selectedCompany }
              imageBackground ={require("../../../image/functionImage/sign.jpg")}
              onPress         ={() => this.ActionSheet.show()}
            />
          <Content
            refreshControl = {
              <RefreshControl
                refreshing ={!this.props.state.Form.isLoadDone}
                onRefresh  ={this.handleOnRefresh.bind(this)}
                colors     ={['#3691ec']}
                progressBackgroundColor = "#fff"
              />
            }
          >
            {/*forms*/}
            {
              (!this.props.state.Form.isLoadDone)?
                <NoMoreItem text={this.props.state.Language.lang.ListFooter.Loading}/>
              :
                forms
            }
          </Content>
          {this.renderActionSheet()}
      </Container>
    )
  }

  onChangeText = (text) => {
    let sText = sify(text);   //簡體中文
    let tText = tify(text);   //繁體中文
    
    if (tText === sText) {    // 不是中文字
      this.setState({ 
        keyword:text,
        isChinesKeyword:false
      }); 
    } else {                  // 是中文字
      this.setState({ 
        keyword:text,
        sKeyword:sText,
        tKeyword:tText,
        isChinesKeyword:true
      }); 
    }
  }

  onFormTypeKeywordSearch = () => { 
    if(this.state.keyword.replace(/^[\s　]+|[\s　]+$/g, "").length != 0){
      this.setState({ isShowSearchResult:true }); 
      Keyboard.dismiss();      
    }
  }

  closeKeywordSearch = () => {
    this.setState({ 
       isShowSearch      :false,
       isShowSearchResult:false,
       isChinesKeyword   :false, 
       keyword           :"",    
       sKeyword          :"",    
       tKeyword          :"",
    });
  }

  renderFormTypeItem = (item) => {
    let isDarkMode = this.props.state.Theme.themeType == "dark"? true: false;
    let name, icon, color, backgroundColor, count;
    item = item.item;
    name = item.label;

    switch (item.key) {
      case "General":
        icon = "document";
        color = "#3F51B5",
        backgroundColor = "#E8EAF6";
        count = item.data.length;
        break;
      case "GeneralAffairs":
        icon = "attach";
        color = "#558B2F",
        backgroundColor = "#F1F8E9";
        count = item.data.length;
        break;
      case "Information":
        icon = "desktop";
        color = "#2196F3",
        backgroundColor = "#E3F2FD";
        count = item.data.length;
        break;
      case "HR":
        icon = "people";
        color = "#009688",
        backgroundColor = "#E0F2F1";
        count = item.data.length;
        break;
      case "Administration":
        icon = "folder";
        color = "#616161",
        backgroundColor = "#F5F5F5";
        count = item.data.length;
        break;
      case "Inventory":
        icon = "cube";
        color = "#607D8B",
        backgroundColor = "#ECEFF1";
        count = item.data.length;
        break;
      case "Finance":
        icon = "cash";
        color = "#FFC107",
        backgroundColor = "#FFF3E0";
        count = item.data.length;
        break;  
      case "NotGroupSign"://<ion-icon name="list-box"></ion-icon>
        icon = "browsers";
        color = "#3d4650",
        backgroundColor = "#EEE";
        count = item.data.length;
        break; 
      case "SPACE":
        icon = false;
        break;
      default:
        return null;
        break;
    }

    if(icon){
      return (
          <Card style={{borderRadius: 10, flex: 1}}>
            <CardItem 
              button
              style={{ flexDirection: 'column', alignItems: 'center' }}
              >
               <Button 
                   rounded 
                   onPress={() => this.goNext(item)}
                   style={{
                      alignSelf      : 'center',
                      height         : 60,
                      width          : 60, 
                      backgroundColor: backgroundColor, 
                      alignItems     : 'center', 
                      justifyContent : 'center',
                   }}
                 >
                 <Icon name={icon} style={{color:color}} />
               </Button>
               <Text style={{color:isDarkMode? backgroundColor: color}}>{name}</Text>

            </CardItem>
            {
              (this.props.state.Form.isLoadDone) ? 
                ( count != 0 )?
                  <Badge style={{zIndex: 1, position: 'absolute', right: '15%', top: '5%'}}>
                    <Text>{count}</Text>
                  </Badge>
                :
                  <Badge style={{zIndex: 1, position: 'absolute', right: '15%', top: '5%', backgroundColor: '#95A5A6'}}>
                    <Text style={{color: '#FFF'}}>{count}</Text>
                  </Badge>
              :
                null
            }
          </Card>
      )
    }else{
      return(
          <Body style={{flex:1}}/>
      )
    }
  }

  goNext(item) {
    NavigationService.navigate("FormList", { 
      item : item,
      isSelectedCompany : this.state.isSelectedCompany 
    });
  }

  handleOnRefresh(){
    let user = this.props.state.UserInfo.UserInfo;
    let langStatus = this.props.state.Language.langStatus;
    this.props.actions.loadFormTypeIntoState(user, langStatus); //取得表單簽核資料
    this.setState({ 
      isShowSearch:false,
      isShowSearchResult:false,
    });
  }

  renderFormItem = (item) => {
    let index = item.index;
    item = item.item;
    return(
      <FormItem 
        item = {item}
        onPress = {() => this.goFormPage(item)}
        Lang_FormStatus = {this.props.state.Language.lang.FormStatus}
      />
    );
  }

  goFormPage(item, index) { NavigationService.navigate("Form", { Form : item }); }

  renderActionSheet = () => { 
    let BUTTONS = [], companyList = this.props.state.Form.Companies_FormSign.companyList ;
    for ( let i in companyList ) {
      BUTTONS.push(companyList[i].CONTENT);
    }
    BUTTONS.push(this.props.state.Language.lang.Common.Cancel);
    let CANCEL_INDEX = companyList.length;

    return (
      <ActionSheet
        ref={o => this.ActionSheet = o}
        title={this.props.state.Language.lang.ContactPage.SelestCompany}
        options={BUTTONS}
        cancelButtonIndex={CANCEL_INDEX}
        onPress={(buttonIndex) => { 
          if (buttonIndex != CANCEL_INDEX) {
            this.setState({ 
              isSelectedCompany: (buttonIndex == 0) ? false : companyList[buttonIndex],
              selectedCompany  : BUTTONS[buttonIndex],
            });
          }
        }}  
      />
    );
  }
}

export let FormTypeListPageStyle = connectStyle( 'Page.FormPage', {} )(FormTypeListPage);
export default connect(
  (state) => ({
    state: { ...state}
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...FormAction
    }, dispatch)
  })
)(FormTypeListPageStyle);