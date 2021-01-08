import React from 'react';
import { View, FlatList, RefreshControl, VirtualizedList, Platform, Alert, Keyboard } from 'react-native';
import { Container, Header, Left, Content, Body, Right, Item, Input, Button, Icon, Title, Text, Card, CardItem } from 'native-base';
import { tify, sify} from 'chinese-conv'; 
import { connect }   from 'react-redux';
import ActionSheet   from 'react-native-actionsheet';
import SearchInput, { createFilter } from 'react-native-search-filter'; 
const KEYS_TO_FILTERS = ['EMPID', 'DEPNAME', 'NAME', 'MAIL', 'SKYPE', 'CELLPHONE','TELPHONE','JOBTITLE'];

import * as UpdateDataUtil    from '../../../utils/UpdateDataUtil';
import * as SQLite            from '../../../utils/SQLiteUtil';
import * as NavigationService from '../../../utils/NavigationService';
import FunctionPageBanner     from '../../../components/FunctionPageBanner';
import ContactItem            from '../../../components/ContactItem';
import NoMoreItem             from '../../../components/NoMoreItem';
import WaterMarkView          from '../../../components/WaterMarkView';
import HeaderForSearch        from '../../../components/HeaderForSearch';
import MainPageBackground     from '../../../components/MainPageBackground';


class ContactPage extends React.Component {
  constructor(props) {
    super(props);

    let Companies_Contact = this.props.state.Common.Companies_Contact;
    if (Companies_Contact.companyList.length != 0) {
      Companies_Contact.defaultCO = Companies_Contact.defaultCO ? Companies_Contact.defaultCO : Companies_Contact.companyList[0];
    }

    this.state = {
      isChinesKeyword:false,       //用來判斷關鍵字是否為中文字
      keyword        :"",          //一般搜尋
      sKeyword       :"",          //簡體中文
      tKeyword       :"",          //繁體中文
      selectedCompany:Companies_Contact.defaultCO,
      ContactData    :[],
      isShowSearch   :false,
      isLoading      :false,
      showFooter     :false
    }
  }

  componentDidMount() {
    this.loadContactData(this.state.selectedCompany); 
  }

  loadContactData = async (defaultCO) => {
    let data = [];

    this.setState({
      ContactData: data,
      isLoading  : true,
      showFooter : false
    });
    // 當今天找不到預設資料，不顯示任何通訊錄資料
    await SQLite.selectData(`select * from THF_CONTACT where status='Y' and co=? order by DEPNAME, EMPID`, [defaultCO]).then((result) => {
      this.setState({
        ContactData: result.raw(),
        isLoading  : false,
        showFooter : true
      });
    });
  }

  render() {
    //過濾關鍵字所查詢的資料
    let filteredData;
    if (this.state.isChinesKeyword) {
      filteredData = this.state.ContactData.filter(createFilter(this.state.tKeyword, KEYS_TO_FILTERS));
      let data = this.state.ContactData.filter(createFilter(this.state.sKeyword, KEYS_TO_FILTERS));
      
      for (var i = 0; i < data.length; i++) {
        filteredData.push(data[i]);
      }
    } else {
      filteredData = this.state.ContactData.filter(createFilter(this.state.keyword, KEYS_TO_FILTERS));
    }

    let contactPage = (
      <Container>
        <MainPageBackground height={null}/>
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
          closeSearchButtomOnPress={() =>{
            this.setState({ 
              isShowSearch   :false,
              isChinesKeyword:false, 
              keyword        :"",    
              sKeyword       :"",    
              tKeyword       :"",
            })
          }}
          searchButtomOnPress={Keyboard.dismiss}
          searchButtomText={this.props.state.Language.lang.Common.Search}
          /*標題框的部分*/
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:'arrow-back'}}
          leftButtonOnPress     = {() =>NavigationService.goBack()} 
          isRightButtonIconShow = {true}
          rightButtonIcon       = {{name:'search'}}
          rightButtonOnPress    = {()=>{ this.setState({ isShowSearch:true }); }} 
          title                 = {this.props.state.Language.lang.HomePage.Contacts}
          titleOnPress          = {()=>{ this.setState({ isShowSearch:true }) }}
        />
        <View>
          <VirtualizedList
            keyExtractor        ={(item, index) => index.toString()}
            getItemCount        ={(data) => data.length}
            getItem             ={(data, index) => { return { key: index, item:data[index] }; }}
            data                ={filteredData}
            ListHeaderComponent ={this.renderHeader}
            renderItem          ={this.renderContactItem}
            ListFooterComponent ={this.renderFooter}    //尾巴
          />

          {this.renderActionSheet()}
        </View>
      </Container>
    );
    
    return (
      <WaterMarkView 
        contentPage = {contactPage} 
        pageId = {"ContactPage"}
      />
    );
  }

  renderActionSheet = () => {
    let BUTTONS = [...this.props.state.Common.Companies_Contact.companyList, this.props.state.Language.lang.Common.Cancel];
    let CANCEL_INDEX = this.props.state.Common.Companies_Contact.companyList.length;
    return (
      <ActionSheet
        ref={o => this.ActionSheet = o}
        title={this.props.state.Language.lang.ContactPage.SelestCompany}
        options={BUTTONS}
        cancelButtonIndex={CANCEL_INDEX}
        onPress={(buttonIndex) => { 
          if (buttonIndex != CANCEL_INDEX) {
            this.setState({ selectedCompany: BUTTONS[buttonIndex] });
            this.loadContactData(BUTTONS[buttonIndex]); 
          }
        }}  
      />
    );
  }

  renderHeader = () => {
    return(
      <FunctionPageBanner
        explain         ={this.props.state.Language.lang.ContactPage.FunctionInfo}   //無須保存手機信箱，公司同事再多，也能輕鬆找到。
        isShowButton    ={(this.props.state.Common.Companies_Contact.companyList.length >= 1 ) ? true : false }
        buttonText      ={this.state.selectedCompany}
        imageBackground ={require("../../../image/functionImage/contact.png")}
        onPress         ={() => this.ActionSheet.show()}
      />
    );
  }

  renderContactItem = (item) => {
    item = item.item.item;
    return (
      <ContactItem 
        contactInfo = {item} 
        onPress     = {() => this.showContactDetail(item)}
      />
    );
  }

  showContactDetail(item) {
    NavigationService.navigate("ContactDetail", {
      data: item,
    });
  }

  renderFooter = () => {
    let lang = this.props.state.Language.lang.ContactPage;
    if (this.state.showFooter) {
      return (
        <View style={{ justifyContent: 'flex-start', alignItems: 'center', height: 350 }}>
          <NoMoreItem text={this.props.state.Language.lang.ListFooter.NoMore}/> 

          <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', width:'90%'}}>
            <View style={{flexDirection: 'row', alignItems: 'flex-start', paddingTop: 10, paddingBottom: 5}}>
              <Icon name='bulb' style={{fontSize:24}}/>
              <Title style={{paddingLeft: 8 }}>{lang.SearchTipsTitle}</Title>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
              <Text>1.</Text>
              <Text>{lang.SearchTipsText1}「{this.state.selectedCompany}」{lang.SearchTipsText2}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
              <Text>2.</Text>
              <Text>{lang.SearchTipsText3}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
              <Text>3.</Text>
              <Text>
                {lang.SearchTipsText4}「<Text style={{color:"#47ACF2"}} onPress={this.goContactAdministrator}>{lang.SearchTipsText5}</Text>」{lang.SearchTipsText6}
                <Text style={{color:"#47ACF2"}} onPress={this.goContactAdministrator}>{lang.SearchTipsText7}</Text>
              </Text>
            </View>
          </View>
        </View>
      )
    } else {
      if (this.state.isLoading) {
        return <NoMoreItem text={this.props.state.Language.lang.ListFooter.Loading}/>;
      } else {
        return null;
      }
    }
  }

  goContactAdministrator = () =>{
    let user = this.props.state.UserInfo.UserInfo;
    let company = this.state.selectedCompany;
    let page = this.props.state.Language.lang.ContactDetailPage;

    UpdateDataUtil.getCarAdministrator(user, company).then((data)=>{
      SQLite.selectData(`select * from THF_CONTACT where status='Y' and NAME=? and CO=?`, [data.name, data.company]).then((result) => {
        if (result.length==0) {
          Alert.alert(
            page.NoAdministratorTitle,
            page.NoAdministratorText,
            [
              { text: page.Comfirm, onPress: () =>{} },
            ],
            { cancelable: false }
          )
        }else{
          NavigationService.navigate("ContactDetail", {
            data: result.item(0),
          });  
        }
      });
      
    });
  }
}

export default connect(
  (state) => ({
    state: {...state}
  })
)(ContactPage);