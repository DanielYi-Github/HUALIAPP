import React from 'react';
import { View, Image, Platform} from 'react-native';
import { Container, Content, Text, Icon, connectStyle, Title, Card, CardItem, Body, Button, Header, Left, Right, CheckBox, ListItem} from 'native-base';
import { connect }           from 'react-redux';
import { bindActionCreators }from 'redux';
import ActionSheet           from 'react-native-actionsheet'
import Carousel              from 'react-native-snap-carousel';
import ModalWrapper          from "react-native-modal";

import * as NavigationService from '../../utils/NavigationService';
import ToastUnit              from '../../utils/ToastUnit';
import HeaderForInitial       from '../../components/HeaderForInitial';
import * as LanguageAction    from '../../redux/actions/LanguageAction';
import * as LoginAction       from '../../redux/actions/LoginAction';
import * as CommonAction      from '../../redux/actions/CommonAction';

class IntroductionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      banner1: null,
      banner2: null,
      publishFunction: [],
      initialPageContents: [],
      language: [
        { key: 'zh-TW', text: '繁體中文'}, 
        { key: 'zh-CN', text: '简体中文'}, 
        { key: 'en', text: 'English'}, 
        { key: 'vi', text: 'Tiếng Việt'}, 
      ],
      loginButton: false,
      bioMark: true,
      isAlreadyShowAdvertisement:false,
      isShowAdvertisementAgain:false
    }
  } 

  componentDidMount(){
    Platform.OS == 'android' ? this.props.actions.isShowAndroidChangeAPPMessage(): null;
    // 用以顯示登出時出現的訊息提示，例如token error等等
    if(this.props.state.Login.logoutInfo !== null){
      ToastUnit.show('error', this.props.state.Login.logoutInfo);
      this.props.actions.reset_mix();
    }
    this.props.actions.loadLoginMode();  // 檢核登陸模式 tab/single
  }

  render() {
    let content;
    let lang = this.props.state.Language.lang;
    let banner1, banner2;
    switch (lang) {
      case "en":
        banner1 = require(`../../image/banner/banner1_en.png`);
        banner2 = require(`../../image/banner/banner2_en.png`);
        break;
      case "vi":
        banner1 = require(`../../image/banner/banner1_vi.png`);
        banner2 = require(`../../image/banner/banner2_vi.png`);
        break;
      case "zh-TW":
        banner1 = require(`../../image/banner/banner1_zh-TW.png`);
        banner2 = require(`../../image/banner/banner2_zh-TW.png`);
        break;
      default:
        banner1 = require(`../../image/banner/banner1_zh-CN.png`);
        banner2 = require(`../../image/banner/banner2_zh-CN.png`);
    }
    return (
      <Container>
        <HeaderForInitial
          isLeftButtonIconShow    = {true}
          leftButtonIcon          = {{name:"menu"}}
          leftButtonOnPress       = {this.openDrawer} 
          isRightButtonIconShow   = {this.props.state.Network.networkStatus}
          rightButtonIcon         = {{name: "person-circle-sharp"}}
          rightButtonOnPress      = {this.loginWay}
          rightButtonOnPress_lang = {this.showActionSheet} 
          title                   = {lang.InitialPage.HF}
          isMiddleTitle           = {true}
        />
        <Content contentContainerStyle={{alignItems:"center"}}>
            <Carousel
              data={[
                { key:2, source:banner1 },
                { key:3, source:banner2 }
              ]}
              renderItem    ={this.renderCarouselItem}
              sliderWidth   ={this.props.style.HomePageBanner.width}
              itemWidth     ={this.props.style.HomePageBanner.width}
              loop          ={true}
              autoplay      ={true}
              autoplayDelay ={1000}
            />
            {
              (this.props.state.Common.IntroductionPageContent.length !== 0) ?
                this.renderinitialPageContents()
              :
                null
            }
            {this.renderModalSelector()}
        </Content>
        {
          this.props.state.Common.isShowAndroidChangeAPPMessage && !this.state.isAlreadyShowAdvertisement ? 
            this.showAdvertisement()
            : 
            null
        }
      </Container>
    );
  }

  loginWay = async() => {
    // console.log(this.props.state.Biometric);
    //決定是否直接跳轉生物識別畫面
    // if( this.props.state.BiosUserInfo.BiosUser.isBios && this.props.state.BiosUserInfo.supportBios ){
    if(this.props.state.Biometric.biosUser.biometricEnable){
      NavigationService.navigate('AuthStack', {screen:'LoginByBios'});
    }else{
      NavigationService.navigate('AuthStack', {screen:'Login'});
    }
  }

  openDrawer = () => { 
    this.props.navigation.toggleDrawer();
  };

  showActionSheet = () => {
    this.ActionSheet.show();
  }

  //顯示多語系選擇視窗
  renderModalSelector = () => {
    var langs = [];
    this.state.language.forEach((item, index, array) => {
      langs.push(item.text);
    });

    var BUTTONS = [...langs, this.props.state.Language.lang.Common.Cancel]; // 取消
    var CANCEL_INDEX = langs.length;

    return (
      <ActionSheet
        ref               ={o => this.ActionSheet = o}
        title             ={this.props.state.Language.lang.MinePage.lang_select}
        options           ={BUTTONS}
        cancelButtonIndex ={CANCEL_INDEX}
        onPress           ={(buttonIndex) => { 
          if (buttonIndex != CANCEL_INDEX) {
            this.props.actions.setLang(this.state.language[buttonIndex].key);
          }
        }}
      />
    );
  }

  // 顯示輪播圖訊息
  renderCarouselItem = ({item, index}) => {
    return (
      <View style={this.props.style.HomePageBanner}>
          <Image
            resizeMode ='contain' 
            source={item.source}
            style={{height:"100%", width:"100%"}}
          />
      </View>
    ); 
  }

  // 顯示抽屜欄位  
  renderinitialPageContents = () => {
    let contents = [];
    for (let i in this.props.state.Common.IntroductionPageContent) {
      switch(this.props.state.Common.IntroductionPageContent[i].paramcode) {
        case "GroupIntroduction":
          contents.push(this.renderGroupIntroduction(i));
          break;
        case "ServiceItems":
          contents.push(this.renderServiceItems(i));
          break;
        case "ManagementIdea":
          contents.push(this.renderManagementIdea(i));
          break;
      }
    }
    
    return contents;
  }

  // 集團介紹
  renderGroupIntroduction = (key) => {
    return (
      <View key={key}>
        <Title style={{paddingTop:30, alignSelf: 'center'}}>
          {this.props.state.Language.lang.InitialPage.GroupIntroduction}
        </Title>
        <Card>
          <CardItem style={{height:this.props.style.InitialPageCompanyLogo.height}}>
            <Image
              resizeMode ='contain' 
              source={require(`../../image/initialPage/company1.jpg`)}
              style={{height:"100%", width:"100%"}}
            />
          </CardItem>
          <CardItem style={{paddingBottom:0}}>
            <Body>
              <Text>
                {this.props.state.Language.lang.InitialPage.IntroductionContent1}
              </Text>
            </Body>
          </CardItem>
          <CardItem style={{paddingBottom:0}}>
            <Body>
              <Text>
                {this.props.state.Language.lang.InitialPage.IntroductionContent2}
              </Text>
            </Body>
          </CardItem>
          <CardItem>
            <Body>
              <Text>
                {this.props.state.Language.lang.InitialPage.IntroductionContent3}
              </Text>
            </Body>
          </CardItem>
        </Card>
      </View>
    )
  }

  // 服務項目
  renderServiceItems = (key) => {
    return(
      <View key={key}>
        <Title style={{paddingTop:30, alignSelf: 'center'}}>{this.props.state.Language.lang.InitialPage.ServiceItems}</Title>
        <Card>
          <CardItem style={{height:this.props.style.InitialPageServiceImage.height}}>
            <Image
              resizeMode ='contain' 
              source={require(`../../image/initialPage/services.jpg`)}
              style={{height:"100%", width:"100%"}}
            />
          </CardItem>
          <CardItem>
            <Body style={{flexDirection:"column"}}>
              <Body style={{flexDirection:"row"}}>
                <Body>
                    <Button 
                        rounded
                        light
                        style = {
                          {
                            alignSelf: 'center',
                            height: 55,
                            width: 55,
                            alignItems: 'center',
                            justifyContent: 'center'
                          }
                        }
                      >
                      <Icon name={"pricetag"}/>
                    </Button>
                    <Text style={{paddingTop:5}}>{this.props.state.Language.lang.InitialPage.MajorCmmodities}</Text>
                </Body>
                <Body>
                  <Button 
                    rounded
                    light
                    style = {
                        {
                          alignSelf: 'center',
                          height: 55,
                          width: 55,
                          alignItems: 'center',
                          justifyContent: 'center'
                        }
                      } >
                    <Icon name={"cellular"}/>
                  </Button>
                  <Text style={{paddingTop:5}}>{this.props.state.Language.lang.InitialPage.ConsecutiveGrowth}</Text>
                </Body>
              </Body>
              <Body style={{flexDirection:"row", paddingTop:15}}>
                <Body>
                  <Text>
                  {this.props.state.Language.lang.InitialPage.ConsecutiveGrowthContet1}
                  </Text>
                </Body>
                <Body>
                  <Text>
                  {this.props.state.Language.lang.InitialPage.ConsecutiveGrowthContet2}
                  </Text>
                </Body>
              </Body>
            </Body>
          </CardItem>
        </Card>
      </View>
    );
  }

  // 經營理念
  renderManagementIdea = (key) => {
    return(
      <View key={key}>
        <Title style={{paddingTop:30, alignSelf: 'center'}}>{this.props.state.Language.lang.InitialPage.ManagementIdea}</Title>
        <Card>
          <CardItem>
            <Body>
                <Text style={{fontWeight: 'bold',fontSize: 18,paddingBottom:10}}>
                  {this.props.state.Language.lang.InitialPage.CoreValue}
                </Text>
                <Text style={{paddingBottom:5}}>
                  {this.props.state.Language.lang.InitialPage.CoreValueContent1}
                </Text>
                <Text style={{paddingBottom:5}}>
                  {this.props.state.Language.lang.InitialPage.CoreValueContent2}
                </Text>
                <Text style={{paddingBottom:5}}>
                  {this.props.state.Language.lang.InitialPage.CoreValueContent3}
                </Text>
                <Text style={{paddingBottom:5}}>
                  {this.props.state.Language.lang.InitialPage.CoreValueContent4}
                </Text>
                <Text style={{paddingBottom:5}}>
                  {this.props.state.Language.lang.InitialPage.CoreValueContent5}
                </Text>
                <Text style={{paddingBottom:5}}>
                  {this.props.state.Language.lang.InitialPage.CoreValueContent6}
                </Text>
                <Text style={{paddingBottom:5}}>
                  {this.props.state.Language.lang.InitialPage.CoreValueContent7}
                </Text>
                <Text style={{paddingBottom:5}}>
                  {this.props.state.Language.lang.InitialPage.CoreValueContent8}
                </Text>
                <Text style={{paddingBottom:5}}>
                  {this.props.state.Language.lang.InitialPage.CoreValueContent9}
                </Text>
                <Text>
                  {this.props.state.Language.lang.InitialPage.CoreValueContent10}
                </Text>
            </Body>
          </CardItem>
        </Card>
      </View>
    );
  }

  // 顯示重新安裝訊息
  showAdvertisement = () => {
    let lang = this.props.state.Language.lang.Common;
    return(
      <ModalWrapper 
        isVisible={!this.state.isAlreadyShowAdvertisement}
        onBackdropPress = {(e)=>{ this.setState({isAlreadyShowAdvertisement:true}) }}
      >
        <Content>
        <Card style={{width: '100%'}}>
          <CardItem style={{flexDirection: 'column'}}>
            <Title>{lang.androidChangeAPPMessage1}</Title>
            <Text></Text>
            <Text>{lang.androidChangeAPPMessage2}<Text style={{color:"red"}}>{lang.androidChangeAPPMessage3}</Text>{lang.androidChangeAPPMessage4}<Text style={{color:"red"}}>{lang.androidChangeAPPMessage5}</Text>{lang.androidChangeAPPMessage6}</Text>
            <Text></Text>
            <Text>{lang.androidChangeAPPMessage7}<Text style={{color:"red"}}>{lang.androidChangeAPPMessage8}</Text>{lang.androidChangeAPPMessage9}<Text style={{color:"red"}}>{lang.androidChangeAPPMessage10}</Text>{lang.androidChangeAPPMessage11}</Text>
            <Text></Text>
            <Text>{lang.androidChangeAPPMessage12}</Text>
            <Image  
              style={{ 
                width:this.props.style.PageSize.width*0.8, 
                height:this.props.style.PageSize.width*734/1242*0.8
              }} 
              resizeMode={"contain"}
              source={require(`../../image/changeAPP.png`)}
            />
            <Text></Text>
            <ListItem >
              <CheckBox 
                checked={!this.state.isShowAdvertisementAgain} 
                onPress={()=>{
                  this.setState({isShowAdvertisementAgain:!this.state.isShowAdvertisementAgain});
                }}
              />
                <Text>{lang.androidChangeAPPMessage13}</Text>
            </ListItem>
            <Button 
              style={{alignSelf: 'center', width: '100%', alignContent: 'center', justifyContent: 'center'}}
              onPress={()=>{
                this.setState({isAlreadyShowAdvertisement:true})
                if(!this.state.isShowAdvertisementAgain) this.props.actions.noMoreShowAndroidChangeAPPMessage();
              }}
            >
              <Text>{lang.Close}</Text>
            </Button>
          </CardItem>          
        </Card>
        </Content>
      </ModalWrapper>
    );
  }
}

let IntroductionPageStyle = connectStyle( 'Page.HomePage', {} )(IntroductionPage);
export default connect(
  (state) => ({
    state: { ...state }
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...LanguageAction,
      ...LoginAction,
      ...CommonAction,
      // ...NetworkAction,
      // ...UserInfoAction,
      // ...BiosUserInfoAction
    }, dispatch)
  })
)(IntroductionPageStyle);