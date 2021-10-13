import React from 'react';
import { Alert, Platform } from 'react-native';
import { Container, Header, Content, Icon, Button, Left, Body, Right, Title, Text, Card, CardItem, Thumbnail, connectStyle} from 'native-base';
import ActionSheet from 'react-native-actionsheet'
import MainPageBackground from '../../components/MainPageBackground';
import MineItem           from '../../components/MineItem';
import ExplainCardItem    from '../../components/ExplainCardItem';

import * as NavigationService from '../../utils/NavigationService';
import DeviceStorageUtil   from '../../utils/DeviceStorageUtil';
import MessageRouter       from '../../utils/MessageRouter';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';
import Common              from '../../utils/Common';

import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import * as LoginAction        from '../../redux/actions/LoginAction';
import * as LanguageAction     from '../../redux/actions/LanguageAction';
import * as UserInfoAction     from '../../redux/actions/UserInfoAction';
import * as FormAction         from '../../redux/actions/FormAction';
import * as MyFormAction       from '../../redux/actions/MyFormAction';
import * as HomeAction         from '../../redux/actions/HomeAction';
import * as CommonAction       from '../../redux/actions/CommonAction';
import * as ThemeAction        from '../../redux/actions/ThemeAction';
import * as BroadcastAction from '../../redux/actions/BroadcastAction';

class MinePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: [
        { key: 'zh-TW', text: '繁體中文'}, 
        { key: 'zh-CN', text: '简体中文'},
        { key: 'en', text: 'English'},
        { key: 'vi', text: 'Tiếng Việt'}, 
      ],
    };
  }

  render() {
    let isAppNotificationEnable = this.props.state.UserInfo.isAppNotificationEnable;
    let user                    = this.props.state.UserInfo.UserInfo;
    let bios_user               = this.props.state.BiosUserInfo;
    let lang                    = this.props.state.Language.lang;
    let selectThemeName         = "";
    switch(this.props.state.Theme.themeType) {
      case "dark":
        selectThemeName = lang.MinePage.themeDark;
        break;
      case "season":
        selectThemeName = lang.MinePage.themeSeasion;
        break;
      default:
        selectThemeName = lang.MinePage.themeLight; 
    }

    
    let isShowBpmDeputySetting = false;   // 是否顯示代理人設定
    let isShowMeetingSetting = false;     // 是否顯示會議管理設定
    // console.log(this.props.state.UserInfo.UserInfo);
    for(let role of this.props.state.UserInfo.UserInfo.roles){
      if (role == "BPM") isShowBpmDeputySetting = true;
    }
    /*
    for(let FunctionData of this.props.state.Home.FunctionData){
      if (FunctionData.ID == "Sign") isShowBpmDeputySetting = true;
      if (FunctionData.ID == "MeetingList") isShowMeetingSetting = true;
    }
    */

    return (
      <Container>
       <MainPageBackground height={200}/>
        {
          (Platform.OS === "ios") ?
            <Header transparent noShadow style={{height:null}}>
              <Left>
                <Title style={{fontSize: 40, color: this.props.style.HeaderTitleColor}}>
                  {this.props.state.Language.lang.MainPage.Mine}
                </Title>
              </Left>
              <Right/>
            </Header>
          :
            <Header noShadow style={this.props.style.Transparent}>
              <Body style={{marginLeft: 10}}>
                <Title style={{fontSize: 40, color: this.props.style.HeaderTitleColor}}>
                  {this.props.state.Language.lang.MainPage.Mine}
                </Title>
              </Body>
              <Right/>
            </Header>
        }
        <CardItem style={this.props.style.Transparent} button onPress={this.goNext.bind( this, "MineDetail" )}>
          <Left style={{flexDirection: 'row', flex: 1}}>
            <Thumbnail 
              source={user.picture} 
              style={{height:120, width:120, borderRadius: 60, borderWidth: 5, borderColor: '#FFF'}} />
            <Body style={{alignItems: 'flex-start' }}>
                <Title style={{color: this.props.style.HeaderTitleColor}}>{user.name}</Title>
                <Title style={{color: this.props.style.HeaderTitleColor}}>{user.plantName} {user.depName}</Title>
            </Body>
          </Left>
          <Right style={{flex: 0}}>
            <Icon name="arrow-forward" style={{color: this.props.style.HeaderTitleColor}}/>
          </Right>
        </CardItem>   
        <Content>
          <Card>
            {/*我的設定*/}
            <ExplainCardItem
              itemStyle = {{paddingBottom: 0}}
              iconName = {'person'}
              text = {this.props.state.Language.lang.MinePage.Settings}
            />

            {/*訊息通知*/}
            <MineItem
              title    = {this.props.state.Language.lang.MinePage.notification}
              iconBackgroundColor = {"#f44336"}
              iconName    = {"notifications"}
              iconType    = {null}
              switchValue = {(isAppNotificationEnable && user.isPush == 'Y') ? true: false}
              text        = {null}
              onPress     = {this.switchPush.bind(this, user, isAppNotificationEnable, lang)}
            />

            {/*多語系*/}
            <MineItem
              title    = {this.props.state.Language.lang.MinePage.lang_type}
              iconBackgroundColor = {"#007AFF"}
              iconName = {"translate"}
              iconType = {"MaterialIcons"}
              text     = {this.props.state.Language.lang.MinePage.lang_selected}
              onPress  = {this.showActionSheet}
            />

            {/*BPM代理人設定*/}
            {(user.id!=user.loginID && isShowBpmDeputySetting)?
              <MineItem
                title    = {this.props.state.Language.lang.DeputyPage.BpmDeputySetting}
                iconBackgroundColor = {"#FF00FF"}
                iconName = {"people"}
                iconType = {"SimpleLineIcons"}
                text     = {null}
                onPress  = {this.goNext.bind(this,"Deputy")}
              />  
              :
              null
            }

            {/*會議管理設定*/}
            {/* isShowMeetingSetting ?
              <MineItem
                title    = {"會議管理設定"}
                iconBackgroundColor = {"#00B0FF"}
                iconName = {"calendar"}
                iconType = {"MaterialCommunityIcons"}
                text     = {null}
                onPress  = {this.goNext.bind(this,"MeetingSetting")}
              />  
              :
              null
            */}

            {/*主題顏色*/}
            <MineItem
              title    = {lang.MinePage.changeTheme}
              iconBackgroundColor = {"#ffc107"}
              iconName = {"skin"}
              iconType = {"AntDesign"}
              text     = {selectThemeName}
              onPress  = {this.showThemeSheet}
            />

            {/*建議與反饋*/}
            <MineItem
              title    = {this.props.state.Language.lang.MinePage.advices}
              iconBackgroundColor = {"#FF6D00"}
              iconName = {"feedback"}
              iconType = {"MaterialIcons"}
              text     = {null}
              onPress  = {this.goNext.bind(this,"Advices")}
            />   

            {/*關於*/}
            <MineItem
              title    = {this.props.state.Language.lang.MinePage.about}
              iconBackgroundColor = {"#8BC34A"}
              iconName = {"information-variant"}
              iconType = {"MaterialCommunityIcons"}
              text     = {null}
              onPress  = {this.goNext.bind(this,"About")}
            />

            {/*账号与安全*/}
            <MineItem
              title    = {this.props.state.Language.lang.AccountSafePage.AccountSafe}
              iconBackgroundColor = {"#A020F0"}
              iconName = {"shield-account"}
              iconType = {"MaterialCommunityIcons"}
              text     = {null}
              onPress  = {this.goNext.bind(this,"AccountSafe")}
            />    

            {this.renderModalSelector()}
            {this.renderThemeSelector()}
          </Card>
        </Content>
      </Container>
    );
  }

  switchPush = async (user, isAppNotificationEnable, lang) => {
    //檢查手機ＡＰＰ的通知是否開啟
    let detectAppNotificationEnable = await MessageRouter.getIsAppNotificationEnable().then((result)=>{
      return result;
    });

    if (detectAppNotificationEnable) {
      await this.props.actions.updateUserIsNotificationEnable( 
        user, 
        'isPush', 
        user.isPush == 'Y' ? 'N': 'Y',
        detectAppNotificationEnable
      );
    } else {
      Alert.alert(
        lang.Common.Sorry,
        lang.Common.SysNotificationMsg,
        [
          {
            text: lang.Common.Close, 
            onPress: () => console.log('OK Pressed')
          },
        ],
        {cancelable: false},
      );
    }
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
            let user = this.props.state.UserInfo.UserInfo;
            let lang = this.state.language[buttonIndex].key;

            this.props.actions.setLang(lang);
            this.props.actions.updateUserdata( user, "lang", lang); 
            this.props.actions.loadFunctionData(lang);   
            this.props.actions.loadFormTypeIntoState(user, lang);
            this.props.actions.loadSelectFormListIntoState();
            this.props.actions.keywordSearchClean();   
            this.props.actions.loadBannerImages();     
            this.props.actions.loadFunctionType(this.state.language[buttonIndex].key);//thf_module重载
            this.props.actions.initBroadcastData();//切换广播语系
          }
        }}
      />
    );
  }

  showActionSheet = () => {
    this.ActionSheet.show()
  }

  //顯示主題顏色選擇視窗
  renderThemeSelector = () => {
    let lang = this.props.state.Language.lang;

    let themes = [];
    if (this.props.state.Theme.serverSeasonTheme) {
      themes = [
        { key: 'platform', text: lang.MinePage.themeLight }, 
        { key: 'dark', text: lang.MinePage.themeDark },
        { key: 'season', text: lang.MinePage.themeSeasion} 
      ];
    } else {
      if (this.props.state.Theme.themeType == "dark") {
        themes.push({ key: 'platform', text: lang.MinePage.themeLight });
      } else {
        themes.push({ key: 'dark', text: lang.MinePage.themeDark });
      }
    }

    var themeText = [];
    themes.forEach((item, index, array) => {
      themeText.push(item.text);
    });

    var BUTTONS = [...themeText, this.props.state.Language.lang.Common.Cancel]; // 取消
    var CANCEL_INDEX = themes.length;

    return (
      <ActionSheet
        ref               ={o => this.ThemeSheet = o}
        title             ={lang.MinePage.selectThemeMode}
        options           ={BUTTONS}
        cancelButtonIndex ={CANCEL_INDEX}
        onPress           ={(buttonIndex) => { 
          if (
            buttonIndex != CANCEL_INDEX && 
            themes[buttonIndex].key != this.props.state.Theme.themeType 
          ) {
            this.props.actions.changeTheme(themes[buttonIndex].key);
          }
        }}
      />
    );
  }
  
  showThemeSheet = () => {
    this.ThemeSheet.show()
  }
  
  goNext(page){
    NavigationService.navigate(page);
  }

  logout() {
    this.props.actions.deleteAllForms(); //消除所有清單內容
    this.props.actions.logout();         //登出
  }

}
export let MinePageStyle = connectStyle( 'Page.MinePage', {} )(MinePage);

export default connect(
  (state) => ({
    state: {...state}
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...LoginAction,
      ...LanguageAction,
      ...UserInfoAction,
      ...HomeAction,
      ...FormAction,
      ...MyFormAction,
      ...CommonAction,
      ...ThemeAction,
      ...BroadcastAction,
    }, dispatch)
  })
)(MinePageStyle);