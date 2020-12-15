import React, {Component} from 'react';
import {Text, Container, Content , Body, Tab, Tabs, ScrollableTab, Icon, TabHeading, connectStyle} from 'native-base';
import FunctionPageBanner from '../../components/FunctionPageBanner';
import BirthdayMineTabList from '../../components/Birthday/BirthdayMineTabList';
import {DeviceEventEmitter} from 'react-native';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';
import Common from '../../utils/Common';
import { connect } from 'react-redux';

class BirthdayMineTabs extends Component {
	constructor(props) {
    super(props);
	    this.state = {
	      msgData:"",
        tabsHeaderbHeight:50.13334350585937,
        tabsViewbHeight:null,   //整個Tabs的高度
        isTabDroping:true,    //是否讓TabsVView可以自動加載高度
        activeTab: 'CAKE',
        cakeListHeight:null,
        giftListHeight:null,
        msgListHeight:null,
        contentOffset_Y:0,
        isMineRefreshing:true,
        cakelist:[],
        giftlist:[],
        msglist:[]
    	}
	}

  // //改componentDidMount不會觸發顯示
  UNSAFE_componentWillMount () {
    this.loadBirthdayMineData(this.props.state.UserInfo.UserInfo);
  }

  componentWillReceiveProps(){
    this.setState({
        msgData:this.state.msgData
    });
  }

	componentDidMount() {
      //IPUSH推送更新資訊
      //APP的監聽事件
      this.listener = DeviceEventEmitter.addListener('loadMyBirthdayDataState',(data)=>{
         this.setState({
          msgData:"",
          tabsViewbHeight:null,   //整個Tabs的高度
          isTabDroping:true,    //是否讓TabsVView可以自動加載高度
          activeTab: 'CAKE',
          cakeListHeight:null,
          giftListHeight:null,
          msgListHeight:null,
          contentOffset_Y:0,
          isMineRefreshing:true,
          cakelist:[],
          giftlist:[],
          msglist:[]
         });
         this.loadBirthdayMineData(this.props.state.UserInfo.UserInfo);
      });
	}

	componentWillUnmount(){
		//移除监听
	    if (this.listener) {
	      this.listener.remove();
	    }
  	}

  onLayoutTabsView = (event) => {
    let { height } = event.nativeEvent.layout
    let msgcount=0;
    if(this.state.msgData.msglist){
      msgcount=this.state.msgData.msglist.length;
    }
    let giftcount=this.state.msgData.giftcount;
    let cakecount=this.state.msgData.cakecount;
    let totalcount=giftcount+msgcount+cakecount;

    if (totalcount == 0) {
      this.setState({
        tabsHeaderbHeight:height-this.props.style.ItemHeight.height
      });
    }
  }

  getListHeight = (listHeight) => {
      //返回list高度做判斷
      if(this.state.msgData && !this.state.isMineRefreshing){
          let olderHeight;
          if (this.state.msgData.cakecount!=0 && this.state.activeTab=="CAKE") {
              olderHeight = this.state.cakeListHeight;
              this.setState({ 
                cakeListHeight:listHeight
              });
          }else if (this.state.msgData.giftcount!=0 && this.state.activeTab=="GIFT") {
              olderHeight = this.state.giftListHeight;
              this.setState({ 
                giftListHeight:listHeight
              });
          }else if (this.state.msgData.msglist.length!=0 && this.state.activeTab=="MSG") {
              olderHeight = this.state.msgListHeight;
              this.setState({ 
                msgListHeight:listHeight
              });
          }
          if(olderHeight < listHeight){
              this.setState({
                tabsViewbHeight: listHeight+this.state.tabsHeaderbHeight,
                isTabDroping: false,
              });
          }
      }
  }

  //判斷是否拉到底部
  isCloseToBottom = ({ layoutMeasurement , contentOffset , contentSize }) => {
    const paddingToBottom = 1;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  onEndReached = (type = null, contentOffset_Y) => {
    //觸發底部事件，判斷對應tab是否超過初始畫面臨界值高度，超過則開啟自動加載高度
    let flag=false;
    switch(type) {
      case "GIFT":
        if(this.state.giftListHeight>=1455){
          flag=true;
        }
        break;
      case "MSG":
        if(this.state.msgListHeight>=1455){
          flag=true;
        }
        break;
      default:
        if(this.state.cakeListHeight>=1455){
          flag=true;
        }
    }
      this.setState({
        isTabDroping:flag
      });
  }

  loadPicRefreshing = (data,type) =>{
    switch(type){
      case "cake":
      this.setState({
        cakelist: data
      });
      break;      
      case "gift":
      this.setState({
        giftlist: data
      });
      break;      
      case "msg":
      this.setState({
        msglist: data
      });
      break;
    }
  }

  loadBirthdayMineData = (user) => {      
      this.setState({
        msgData : [],
        isMineRefreshing: true
      });
      let start = new Date().getTime();
      var myDate = new Date();
      var nowYear=myDate.getFullYear().toString();

      //當前時間
      var nowDate=new Date().getTime();;
      //當前年份生日時間
      var t2=Common.dateFormatNoTime(user.birthday);
      var arr2 = t2.split('-');
      var nbirthday=nowYear+"-"+arr2[1]+"-"+(arr2[2]);
      //当年生日时间戳
      var nbTimestamp=new Date(nbirthday);
      //時間戳-7
      var nbirthdayDate=nbTimestamp - 7 * 24 * 3600 * 1000;

      //若當前時間小於區間則取去年資料
      if(nowDate<nbirthdayDate){
        nowYear=(nowYear-1).toString();
      }

      UpdateDataUtil.getBirthdayData(user,nowYear,user.co,user.id).then(async (data)=>{
          if(data!=null){
            if(data.code=="0"){
              this.setState({
                  data: [],
                  isMineRefreshing: false,
              });
            }else{
                this.setState({
                    msgData: data,
                    isMineRefreshing: false,
                    cakelist:data.cakelist,
                    giftlist:data.giftlist,
                    msglist:data.msglist
                });
                let end = new Date().getTime();
                console.log("BirthdayMine_end:"+ (end - start) / 1000);
            }
          }else{
            this.setState({
                data: [],
                isMineRefreshing: false,
            });
          }
      }).catch((e)=>{
          console.log("getBirthdayData異常",e);
      }); 
  }

  onChangeTab = (e)=>{
    let tabs = ["CAKE","GIFT","MSG"];

    let giftcount=this.state.msgData.giftcount;
    let msgcount=this.state.msgData.msglist.length;
    let cakecount=this.state.msgData.cakecount;
    let totalcount=giftcount+msgcount+cakecount;
    //tab標籤欄+暫無資料初始高度
    let height=this.state.tabsHeaderbHeight+this.props.style.ItemHeight.height;
    //若總數存在資料則需要對各標籤進行判斷，決定tab展開hight
    if (totalcount != 0) {
      switch(tabs[e.i]) {
        case "CAKE":
            if(cakecount!=0){
              height=this.state.cakeListHeight ? this.state.tabsHeaderbHeight+this.state.cakeListHeight: null;
            }
          break;
        case "GIFT":
            if(giftcount!=0){
              height=this.state.giftListHeight ? this.state.tabsHeaderbHeight+this.state.giftListHeight: null;
            }
          break;
        case "MSG":
            if(msgcount!=0){
              height=this.state.msgListHeight ? this.state.tabsHeaderbHeight+this.state.msgListHeight: null;
            }
          break;
      }
        this.setState({ 
          activeTab:tabs[e.i],
          isTabDroping: false,
          tabsViewbHeight:height
        });
    }
  }

  cancelSelect(){
    this.props.navigation.goBack();
  }

	render() {
    let caketitle="";
    let gifttitle="";
    let msgtitle="";
    let lang=this.props.state.Language.lang.BirthdayMineTabs;
    if(this.state.msgData!=""){
        caketitle=this.state.msgData.cakecount+lang.msg1;
        gifttitle=this.state.msgData.giftcount+lang.msg1;
        msgtitle=this.state.msgData.msglist.length+lang.msg2;
    }
		return (
	      <Container>         
          <Content>
              <FunctionPageBanner
                explain         ={lang.msg3}
                imageBackground ={require("../../image/functionImage/birthdayMine.jpg")}
              />      
              <Body 
                  style={{ backgroundColor:this.props.style.flastBgColor,flexDirection: 'row', height:(this.state.isTabDroping) ? null:this.state.tabsViewbHeight }} 
                  onLayout={this.onLayoutTabsView}
                >
                <Tabs 
                  transparent
                  onChangeTab={this.onChangeTab}
                  tabBarUnderlineStyle={{backgroundColor:'#FFBBFF'}} 
                  renderTabBar         ={()=> 
                    <ScrollableTab
                      style={{
                        backgroundColor: this.props.style.flastBgColor,
                        width:"100%",
                        justifyContent:"center", 
                        alignItems:"center", 
                        alignSelf:"center",
                        borderWidth:0,
                      }}
                      tabsContainerStyle={{
                        borderWidth:0,
                        width:"100%",
                        backgroundColor: 'rgba(255,255,255,0)',
                      }}
                    />
                  } 
                >
                  <Tab heading={ 
                      <TabHeading  style={this.props.style.tabStyle}>
                        <Text style={this.props.style.title}>{caketitle}{" "}</Text>
                        <Icon name="cake" type="MaterialCommunityIcons" style={{color:'#FFBBFF'}}/>
                      </TabHeading>
                    }
                    tabStyle        ={this.props.style.tabStyle} 
                    activeTabStyle  ={this.props.style.tabStyle} 
                    textStyle       ={this.props.style.title} 
                    activeTextStyle ={this.props.style.title}
                  >
                      <BirthdayMineTabList 
                        data          ={this.state.cakelist} 
                        langData      ={this.props.state.Language.lang}
                        userInfo      ={this.props.state.UserInfo.UserInfo}
                        isRefreshing  ={this.state.isMineRefreshing}
                        picRefreshing ={this.loadPicRefreshing}
                        page          ={1}
                        type          ="cake"
                        getListHeight   ={this.getListHeight}
                      />
                  </Tab>
                  <Tab
                    heading         ={ 
                      <TabHeading style={this.props.style.tabStyle}>
                        <Text style={this.props.style.title}>{gifttitle}{" "}</Text>
                        <Icon name="gift" type="AntDesign" style={{color:'#FFBBFF'}}/>
                      </TabHeading>
                    }
                    tabStyle        ={this.props.style.tabStyle} 
                    activeTabStyle  ={this.props.style.tabStyle} 
                    textStyle       ={this.props.style.title} 
                    activeTextStyle ={this.props.style.title}
                  >
                      <BirthdayMineTabList 
                        data          ={this.state.giftlist} 
                        langData      ={this.props.state.Language.lang}
                        userInfo      ={this.props.state.UserInfo.UserInfo}
                        isRefreshing  ={this.state.isMineRefreshing}
                        picRefreshing ={this.loadPicRefreshing}
                        page          ={1}
                        type          ="gift"
                        getListHeight   ={this.getListHeight}
                      />
                  </Tab>
                  <Tab
                    heading         ={msgtitle}
                    tabStyle        ={this.props.style.tabStyle} 
                    activeTabStyle  ={this.props.style.tabStyle} 
                    textStyle       ={this.props.style.title} 
                    activeTextStyle ={this.props.style.title}
                  >
                      <BirthdayMineTabList 
                        data          ={this.state.msglist} 
                        langData      ={this.props.state.Language.lang}
                        userInfo      ={this.props.state.UserInfo.UserInfo}
                        isRefreshing  ={this.state.isMineRefreshing}
                        picRefreshing ={this.loadPicRefreshing}
                        page          ={1}
                        type          ="msg"
                        getListHeight   ={this.getListHeight}
                      />
                  </Tab>
                </Tabs>
            </Body>
          </Content>
             

        </Container>
		);
	}

}

export let BirthdayMineTabsStyle = connectStyle( 'Component.BirthdayComponent', {} )(BirthdayMineTabs);
export default connect(
  (state) => ({
    state: {...state}
  })
)(BirthdayMineTabsStyle);






