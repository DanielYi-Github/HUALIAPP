import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, FlatList, Platform, ImageBackground, AppState} from 'react-native';
import { Container, Content, Text, Icon, Left, Button, Body, Right, Title, Card, CardItem, Tab, Tabs, ScrollableTab, connectStyle } from 'native-base';

import MessageRouter   from '../../utils/MessageRouter';
import * as Navigation from '../../utils/NavigationService';
import JPush           from '../../utils/JpushUtil';


import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as HomeAction     from '../../redux/actions/HomeAction';
import * as CommonAction   from '../../redux/actions/CommonAction';
import * as UserInfoAction from '../../redux/actions/UserInfoAction';
import * as MessageAction  from '../../redux/actions/MessageAction';
import * as FormAction     from '../../redux/actions/FormAction';
import * as MyFormAction   from '../../redux/actions/MyFormAction';
import * as DocumentAction from '../../redux/actions/DocumentAction';
import * as BirthdayAction from '../../redux/actions/BirthdayAction';
import * as ReportAction   from '../../redux/actions/ReportAction';
import * as MeetingAction  from '../../redux/actions/MeetingAction';
import * as BroadcastAction from '../../redux/actions/BroadcastAction';

import ReactNativeParallaxHeader from '../../extendThirdModule/CustomRNParallax';
import HomePageBanner            from '../../components/HomePageBanner';
import FunctionButton            from '../../components/FunctionButton';
import NoticeTabList             from '../../components/NoticeTabList';
import WaterMarkView             from '../../components/WaterMarkView';
import ExplainCardItem           from '../../components/ExplainCardItem';
import MainPageBackground        from '../../components/MainPageBackground';
import BroadcastCard from "../../components/Broadcast/BroadcastCard";

const showSecurityScreenFromAppState = appState =>['background', 'inactive'].includes(appState);
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
const IS_IPHONE_X       = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 844 || SCREEN_HEIGHT === 896 || SCREEN_HEIGHT === 926;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT     = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT    = HEADER_HEIGHT - STATUS_BAR_HEIGHT;
const bannerHeight      = Platform.OS === 'ios' ? SCREEN_WIDTH*182/455 + STATUS_BAR_HEIGHT: SCREEN_WIDTH*182/455;

const styles = StyleSheet.create({
  navContainer: {
    height: HEADER_HEIGHT,
    marginHorizontal: 10,
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
    backgroundColor: 'transparent',
  },
  navBar: {
    height: NAV_BAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  }
});

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'ALL',

      tabsHeaderbHeight:50.13334350585937,
      tabsViewbHeight:null,   //??????Tabs?????????
      isTabDroping:true,    //?????????TabsVView????????????????????????

      listHeight  :null,
      HRlistHeight:null,
      FRlistHeight:null,
      ITlistHeight:null,
      AGlistHeight:null,
      MTlistHeight:null,

      contentOffset_Y:0,
      isLoadFunctionDataRelateData:false, // ???????????????Function????????????????????????,
      isLoadCompanyData_ContactCO:false, // ???????????????CompanyData_ContactCO????????????????????????,
    }

    let user         = props.state.UserInfo.UserInfo;
    let {langStatus} = props.state.Language;

    //??????APP??????????????????
    props.actions.loadFunctionData(langStatus);            //???????????????????????????Data    
    props.actions.loadFunctionType(langStatus);            //??????Module??????    
    props.actions.loadInitialNoticeData();                 //???????????????????????? 
    props.actions.messageInitial(user);                    //??????????????????????????????????????????redux???state???
    props.actions.getMeetings();                           //??????????????????????????????????????????redux???state???
    props.actions.loadWaterMarkViewConfig();               //??????APP????????????_???????????????????????????
    props.actions.getIsAppNotificationEnable(user);        //??????????????????????????????????????????
    props.actions.initBroadcastData();                     //??????????????????
    Platform.OS == 'android' ? props.actions.enableScreenShot(false) : null; //???????????????????????????(android??????)  
  }

  componentDidMount() {
    MessageRouter.getStoreNotificationMsg(this.props.state, this.props.actions); // ?????????????????????????????????
    AppState.addEventListener('change', this.onChangeAppState);
    if (this.props.state.Home.NoticeData.length == 0 && !this.props.state.Home.isRefreshing) {
      this.props.actions.loadInitialNoticeData(); //???????????????????????? 
    }

    // ?????????APP???????????????????????????????????????????????????????????????APP?????????????????????
    JPush.setBadge({
      "badge":0,
      "appBadge":0
    });
  }

  componentDidUpdate(){
    // ??????CompanyData_ContactCO????????????????????????
    if (this.props.state.Home.FunctionData.length != 0 && this.state.isLoadCompanyData_ContactCO == false) {
      this.props.actions.loadCompanyData_ContactCO();   //??????APP????????????_???????????????
      this.setState({isLoadCompanyData_ContactCO:true})
    }
  }

  render() {
    return (
      <View style={{flex:1}}>
        <MainPageBackground/>
        <ReactNativeParallaxHeader
          headerMinHeight       ={HEADER_HEIGHT}
          headerMaxHeight       ={bannerHeight}
          extraScrollHeight     ={20}
          navbarColor           ={this.props.style.MainPageBackground.backgroundColor}
          backgroundColor       ={this.props.style.HomePageBannerBackgroundColor}
          renderNavBar          ={this.renderNavBar}
          title                 ={this.showHomePageBanner()}
          renderContent         ={this.renderContent}
          containerStyle        ={this.props.style.container}
          innerContainerStyle   ={this.props.style.container}
          contentContainerStyle ={this.props.style.contentContainer}
          alwaysShowTitle       ={false}
          alwaysShowNavBar      ={false}
          scrollViewProps       ={{
            onScroll:({nativeEvent}) => {
              this.setState({ contentOffset_Y:nativeEvent.contentOffset.y });
              if( this.isCloseToBottom(nativeEvent) && !this.props.state.Home.isRefreshing) {
                this.onEndReached(this.state.activeTab, nativeEvent.contentOffset.y);
              }
            }
          }}
        />
      </View>
    );
  }

  renderNavBar = () => {
    return (
      <View style={styles.navContainer}>
          <View style={styles.statusBar} />
          <View style={styles.navBar}>
            <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
              {this.props.state.Language.lang.HomePage.Title}
            </Text>
          </View>
        </View>
    );
  }

  showHomePageBanner = () => {
    return (
        <HomePageBanner 
          title             = {this.props.state.Language.lang.HomePage.Title} 
          data              = {this.props.state.Common.bannerImages}
          checkDirectorPage = {this.props.actions.checkDirectorPage}
        />
    );
  }

  renderContent = () => {
    // ?????????????????????
    if(this.props.state.Home.FunctionData.length == 0) return null;
    // ??????FunctionData???????????????????????????????????????
    if(!this.state.isLoadFunctionDataRelateData) this.LoadFunctionDataRelateData();

    let Home = this.props.state.Home;   //???????????????????????????  
    {/*????????????*/}
    let noticeListBody = (
      <Body 
        style={{ 
          flexDirection: 'row', 
          height:(this.state.isTabDroping) ? null:this.state.tabsViewbHeight ,
          backgroundColor: 'rgba(255,255,255,0)'
        }} 
        onLayout={this.onLayoutTabsView}
      >
        <Tabs  transparent 
               tabBarUnderlineStyle={this.props.style.tabBarUnderlineStyle} 
               renderTabBar={()=> <ScrollableTab tabsContainerStyle={{backgroundColor: this.props.style.cardBackground}}/>}   
               onChangeTab={this.onChangeTab}
               >
          <Tab 
           heading         ={this.props.state.Language.lang.HomePage.noticeAll} 
           tabStyle        ={this.props.style.tabStyle} 
           activeTabStyle  ={this.props.style.tabStyle} 
           textStyle       ={this.props.style.subtitle} 
           activeTextStyle ={this.props.style.title}
          >
           <NoticeTabList 
             data            ={Home.NoticeData} 
             noDataMsg       ={this.props.state.Language.lang.ListFooter.NoMore} 
             loadMoreDataMsg ={this.props.state.Language.lang.ListFooter.LoadMore}
             loadingDataMsg  ={this.props.state.Language.lang.ListFooter.Loading}
             getListHeight   ={this.getListHeight}
             isRefreshing    ={this.props.state.Home.isRefreshing}
             page            ={Home.NoticePage}
           />
          </Tab>
          <Tab 
           heading         ={this.props.state.Language.lang.HomePage.noticeHR} 
           tabStyle        ={this.props.style.tabStyle} 
           activeTabStyle  ={this.props.style.tabStyle} 
           textStyle       ={this.props.style.subtitle} 
           activeTextStyle ={this.props.style.title}
          >
           <NoticeTabList 
             data            ={Home.NoticeHRData} 
             noDataMsg       ={this.props.state.Language.lang.ListFooter.NoMore} 
             loadMoreDataMsg ={this.props.state.Language.lang.ListFooter.LoadMore}
             loadingDataMsg  ={this.props.state.Language.lang.ListFooter.Loading}
             getListHeight   ={this.getListHeight}
             isRefreshing    ={this.props.state.Home.isRefreshing}
             page            ={Home.NoticeHRPage}
           />
          </Tab>
          <Tab 
           heading         ={this.props.state.Language.lang.HomePage.noticeIT} 
           tabStyle        ={this.props.style.tabStyle} 
           activeTabStyle  ={this.props.style.tabStyle} 
           textStyle       ={this.props.style.subtitle} 
           activeTextStyle ={this.props.style.title}
          >
           <NoticeTabList 
             data            ={Home.NoticeITData} 
             noDataMsg       ={this.props.state.Language.lang.ListFooter.NoMore} 
             loadMoreDataMsg ={this.props.state.Language.lang.ListFooter.LoadMore}
             loadingDataMsg  ={this.props.state.Language.lang.ListFooter.Loading}
             getListHeight   ={this.getListHeight}
             isRefreshing    ={this.props.state.Home.isRefreshing}
             page            ={Home.NoticeITPage}
           />
          </Tab>
          <Tab 
           heading         ={this.props.state.Language.lang.HomePage.noticeMT} 
           tabStyle        ={this.props.style.tabStyle} 
           activeTabStyle  ={this.props.style.tabStyle} 
           textStyle       ={this.props.style.subtitle} 
           activeTextStyle ={this.props.style.title}
          >
           <NoticeTabList 
             data          ={Home.NoticeMTData} 
             noDataMsg     ={this.props.state.Language.lang.ListFooter.NoMore} 
             loadMoreDataMsg = {this.props.state.Language.lang.ListFooter.LoadMore}
             loadingDataMsg = {this.props.state.Language.lang.ListFooter.Loading}
             getListHeight ={this.getListHeight}
             isRefreshing  ={this.props.state.Home.isRefreshing}
             page          ={Home.NoticeMTPage}
           />
          </Tab>
          <Tab 
           heading         ={this.props.state.Language.lang.HomePage.noticeFI} 
           tabStyle        ={this.props.style.tabStyle} 
           activeTabStyle  ={this.props.style.tabStyle} 
           textStyle       ={this.props.style.subtitle} 
           activeTextStyle ={this.props.style.title}
          >
           <NoticeTabList 
             data          ={Home.NoticeFRData} 
             noDataMsg     ={this.props.state.Language.lang.ListFooter.NoMore} 
             loadMoreDataMsg = {this.props.state.Language.lang.ListFooter.LoadMore}
             loadingDataMsg = {this.props.state.Language.lang.ListFooter.Loading}
             getListHeight ={this.getListHeight}
             isRefreshing  ={this.props.state.Home.isRefreshing}
             page          ={Home.NoticeFRPage}
           />
          </Tab>
          <Tab 
           heading         ={this.props.state.Language.lang.HomePage.noticeAG} 
           tabStyle        ={this.props.style.tabStyle} 
           activeTabStyle  ={this.props.style.tabStyle} 
           textStyle       ={this.props.style.subtitle} 
           activeTextStyle ={this.props.style.title}
          >
           <NoticeTabList 
             data          ={Home.NoticeAGData}
             noDataMsg     ={this.props.state.Language.lang.ListFooter.NoMore} 
             loadMoreDataMsg = {this.props.state.Language.lang.ListFooter.LoadMore}
             loadingDataMsg = {this.props.state.Language.lang.ListFooter.Loading}
             getListHeight ={this.getListHeight}
             isRefreshing  ={this.props.state.Home.isRefreshing}
             page          ={Home.NoticeAGPage}
           />
          </Tab>
        </Tabs>
      </Body>
    );

    {/*?????????????????????????????????*/}
    let functionList = this.props.state.Home.FunctionData.slice(0, this.props.state.Home.homeFunctionNumber);
    if (functionList.length != 0) {
      for (var i = functionList.length ; i < this.props.state.Home.homeFunctionNumber; i++) functionList.push({ID:"SPACE"});
    }

    return (
        <View style={{alignItems: 'center'}}>
          {/*????????????*/}
        <Card>
          <CardItem>
             <FlatList
               keyExtractor = {(item, index) => index.toString()}
               numColumns   = {4} 
               renderItem   = {this.renderFunctionButton}
               data         = {functionList}
               scrollEnabled = {false}
             />
          </CardItem>
        </Card>

          {/* ?????? */}
          <BroadcastCard />

          {/*????????????*/}
          <Card>
            <ExplainCardItem
              itemStyle = {{paddingBottom: 0}}
              iconName = {'briefcase'}
              text = {this.props.state.Language.lang.HomePage.Announcement}
            />
            <CardItem style={{ paddingTop: 0, paddingBottom: 0}}>
              <WaterMarkView
                contentPage = {noticeListBody} 
                pageId      = {"NoticeList"}
                height      = {this.state.isTabDroping ? null : this.state.tabsViewbHeight}
              />
            </CardItem>
          </Card>
        </View> 
    );
  };

  onLayoutTabsView = (event) => {
    let {width, height} = event.nativeEvent.layout
    if (this.props.state.Home.NoticeData == 0) {
      this.setState({
        tabsHeaderbHeight:height-this.props.style.ItemHeight.height
      });
    }
  }

  getListHeight = (listHeight) => {
    if (this.props.state.Home.NoticeData.length != 0 && !this.props.state.Home.isRefreshing) {

      let olderHeight;
      switch(this.state.activeTab) {
        case "ALL":
          if(this.state.listHeight < listHeight){
            olderHeight = this.state.listHeight;
            this.setState({ 
              listHeight:listHeight,
            });
          }  
          break;
        case "HR":
          if(this.state.HRlistHeight < listHeight){
            olderHeight = this.state.HRlistHeight; 
            this.setState({ 
              HRlistHeight:listHeight,
            });
          }
          break;
        case "FR":
          if(this.state.FRlistHeight < listHeight){
            olderHeight = this.state.FRlistHeight; 
            this.setState({ 
              FRlistHeight:listHeight,
            });
          }
          break;
        case "IT":
          if(this.state.ITlistHeight < listHeight){
            olderHeight = this.state.ITlistHeight; 
            this.setState({ 
              ITlistHeight:listHeight,
            });
          }
          break;
        case "MT":
          if(this.state.MTlistHeight < listHeight){
            olderHeight = this.state.MTlistHeight; 
            this.setState({ 
              MTlistHeight:listHeight,
            });
          }
          break;
        case "AG":
          if(this.state.AGlistHeight < listHeight){
            olderHeight = this.state.AGlistHeight; 
            this.setState({ 
              AGlistHeight:listHeight,
            });
          }
          break;
      }

      if(olderHeight < listHeight){
        this.setState({
          tabsViewbHeight: listHeight+this.state.tabsHeaderbHeight,
          isTabDroping: false,
        });
      }
      
    }
  }

  onChangeTab = (e)=>{
    let tabs = ["ALL","HR","IT","MT","FR","AG"];

    this.setState({
      activeTab:tabs[e.i],
    });

    if (this.props.state.Home.NoticeData.length != 0) {
      switch(tabs[e.i]) {
        case "ALL":
          this.setState({ 
            isTabDroping: false,
            tabsViewbHeight:this.state.listHeight ? this.state.tabsHeaderbHeight+this.state.listHeight: null,
          });
          break;
        case "HR":
          this.setState({ 
            isTabDroping: false,
            tabsViewbHeight:this.state.HRlistHeight ? this.state.tabsHeaderbHeight+this.state.HRlistHeight: null,
          });
          break;
        case "IT":
          this.setState({ 
            isTabDroping: false,
            tabsViewbHeight:this.state.ITlistHeight ? this.state.tabsHeaderbHeight+this.state.ITlistHeight: null,
          });
          break;
        case "FR":
          this.setState({ 
            isTabDroping: false,
            tabsViewbHeight:this.state.FRlistHeight ? this.state.tabsHeaderbHeight+this.state.FRlistHeight: null,
          });
          break;
        case "MT":
          this.setState({ 
            isTabDroping: false,
            tabsViewbHeight:this.state.MTlistHeight ? this.state.tabsHeaderbHeight+this.state.MTlistHeight: null,
          });
          break;
        case "AG":
          this.setState({ 
            isTabDroping: false,
            tabsViewbHeight:this.state.AGlistHeight ? this.state.tabsHeaderbHeight+this.state.AGlistHeight: null,
          });
          break;
      }
    }
  }

  onEndReached = (type = null, contentOffset_Y) => {
    switch(type)
    {
    case "HR":
      if((contentOffset_Y+this.state.HRlistHeight)>=this.props.style.PageSize.height && this.props.state.Home.NoticeHRData.length < this.props.state.Home.NoticeHRCount){
        this.props.actions.loadNoticeData(this.props.state.Home.NoticeHRPage, this.props.state.Home.NoticeHRData, type);
        this.setState({
          isTabDroping:true
        });
      }else{
      }
      break;
    case "FR":
      if((contentOffset_Y+this.state.FRlistHeight)>=this.props.style.PageSize.height && this.props.state.Home.NoticeFRData.length < this.props.state.Home.NoticeFRCount){
        this.props.actions.loadNoticeData(this.props.state.Home.NoticeFRPage, this.props.state.Home.NoticeFRData, type);
        this.setState({
          isTabDroping:true
        });
      }else{
      }
      break;
    case "IT":
      if((contentOffset_Y+this.state.ITlistHeight)>=this.props.style.PageSize.height && this.props.state.Home.NoticeITData.length < this.props.state.Home.NoticeITCount){
        this.props.actions.loadNoticeData(this.props.state.Home.NoticeITPage, this.props.state.Home.NoticeITData, type);
        this.setState({
          isTabDroping:true
        });
      }else{
      }
      break;
    case "MT":
      if((contentOffset_Y+this.state.MTlistHeight)>=this.props.style.PageSize.height && this.props.state.Home.NoticeMTData.length < this.props.state.Home.NoticeMTCount){
        this.props.actions.loadNoticeData(this.props.state.Home.NoticeMTPage, this.props.state.Home.NoticeMTData, type);
        this.setState({
          isTabDroping:true
        });
      }else{
      }
      break;
    case "AG":
      if((contentOffset_Y+this.state.AGlistHeight)>=this.props.style.PageSize.height && this.props.state.Home.NoticeAGData.length < this.props.state.Home.NoticeAGCount){
        this.props.actions.loadNoticeData(this.props.state.Home.NoticeAGPage, this.props.state.Home.NoticeAGData, type);
        this.setState({
          isTabDroping:true
        });
      }else{
      }
      break;
    default:
      if((contentOffset_Y+this.state.listHeight)>=this.props.style.PageSize.height && this.props.state.Home.NoticeData.length < this.props.state.Home.NoticeCount){
        this.props.actions.loadNoticeData(this.props.state.Home.NoticePage, this.props.state.Home.NoticeData);
        this.setState({
          isTabDroping:true
        });
      }else{
      }
    }
  }

  //????????????????????????
  isCloseToBottom = ({ layoutMeasurement , contentOffset , contentSize }) => {
    const paddingToBottom = 1;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  componentWillUnmount(){
    // ???????????????????????????
    this.props.actions.CleanNoticeListState();
    AppState.removeEventListener('change', this.onChangeAppState)
  }

  //?????????????????????????????????
  renderFunctionButton = (item) => {
    return (
      <FunctionButton 
        functionInfo = {item.item}
        onPress      = {() => this.showFunctionPage(item)}
        language     = {this.props.state.Language.lang.FindPage}
      />
    );
  }

  showFunctionPage(item) {
    let app = item.item;
    let userID = this.props.state.UserInfo.UserInfo.id;
    this.props.actions.navigateFunctionPage(app, userID);
  }

  LoadFunctionDataRelateData = () =>{
    this.setState({
      isLoadFunctionDataRelateData:true
    });

    let user         = this.props.state.UserInfo.UserInfo;
    let {langStatus} = this.props.state.Language;
    for(let functionItem of this.props.state.Home.FunctionData){
      switch(functionItem.ID) {
        case "Car":
          this.props.actions.loadCompanyData_CarCO();   //??????APP????????????_??????????????????
          break;
        case "Birthday":
          this.props.actions.loadCompanyData_HrCO(); //??????APP????????????_Hr????????????
          break;
        case "Sign":
          this.props.actions.loadFormTypeIntoState(user, langStatus); //????????????????????????_????????????????????????
          break;
        case "MyForm":
          this.props.actions.myFormInitial(user);  //????????????????????????
          break;
        
      }
    }
  }

  onChangeAppState = async nextAppState => {
    let isAppActive = showSecurityScreenFromAppState(nextAppState);
    if (isAppActive) { 
      this.props.actions.CleanNoticeListState(); 
      this.setState({
        activeTab: 'ALL',
        tabsHeaderbHeight:50.13334350585937,
        tabsViewbHeight:null,   //??????Tabs?????????
        isTabDroping:true,    //?????????TabsVView????????????????????????
        listHeight  :null,
        HRlistHeight:null,
        FRlistHeight:null,
        ITlistHeight:null,
        AGlistHeight:null,
        MTlistHeight:null,
        contentOffset_Y:0,
      });
    }
  }  
}



export let HomePageStyle = connectStyle( 'Page.HomePage', {} )(HomePage);
export default connect(
  (state) => ({
    state: {...state}
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...HomeAction,
      ...CommonAction,
      ...UserInfoAction,
      ...MessageAction,
      ...FormAction,
      ...MyFormAction,
      ...DocumentAction,
      ...BirthdayAction,
      ...ReportAction,
      ...MeetingAction,
      ...BroadcastAction
    }, dispatch)
  })
)(HomePageStyle);