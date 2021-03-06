import React from 'react';
import { View, Image, ActivityIndicator, Platform, NativeModules, Alert, TouchableOpacity} from 'react-native';
import { Container, Header, Item, Switch, ListItem, Left, Input, Content, Body, Right, Button, Icon, Title, Text, Toast, Card, CardItem, Separator, Label, connectStyle } from 'native-base';
import { connect }            from 'react-redux'; 
import { bindActionCreators } from 'redux';
import HeaderForGeneral       from '../../components/HeaderForGeneral';
import * as NavigationService from '../../utils/NavigationService';
import * as UpdateDataUtil    from '../../utils/UpdateDataUtil';
import * as UserInfoAction     from '../../redux/actions/UserInfoAction';

class MeetingSettingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openMeetingQuery :    this.props.state.UserInfo.UserInfo.userConfig.openMeetingQuery,
      openMeetingMember:    this.props.state.UserInfo.UserInfo.userConfig.openMeetingMember,
      openMeetingMemberNM:  this.props.state.UserInfo.UserInfo.userConfig.openMeetingMemberNM,
      openMeetingPush  :    this.props.state.UserInfo.UserInfo.userConfig.openMeetingPush
    }
  }

  render(){
    let MeetingSettinLang = this.props.state.Language.lang.MeetingSettingPage;
    let user = this.props.state.UserInfo.UserInfo;
    let biometricInfo = this.props.state.Biometric;
    return(
      <Container>
        <HeaderForGeneral
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:"arrow-back"}}
          leftButtonOnPress     = {() =>NavigationService.goBack()} 
          isRightButtonIconShow = {false}
          rightButtonIcon       = {null}
          rightButtonOnPress    = {null} 
          title                 = {MeetingSettinLang.meetingSettingTitle}
          isTransparent         = {false}
        />
          <Content> 
            {/* <ListItem 
              last 
              style       = {[{marginTop:30}]} 
              // onPress     = {()=>this.switchBios( user, !biometricInfo.biosUser.biometricEnable )}
            >           
              <Left>
                <Text style={{fontSize: 18}}>{"????????????????????????????????????"}</Text>
              </Left>
              <Right style={{flexDirection: 'row', flex: 0}}>
                <Switch 
                  value    = {biometricInfo.biosUser.biometricEnable} 
                  // onChange = {()=>this.switchBios( user, !biometricInfo.biosUser.biometricEnable )}
                />
              </Right>
            </ListItem> 
            <Label style={{marginTop: 10, paddingLeft: 10, paddingRight: 10}}>{"????????????????????????\"????????????\"????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????"}</Label>

            <ListItem 
              last 
              style       = {[{marginTop:30}]} 
              // onPress     = {()=>this.switchBios( user, !biometricInfo.biosUser.biometricEnable )}
            >           
              <Left>
                <Text style={{fontSize: 18}}>{"??????????????????????????????"}</Text>
              </Left>
              <Right style={{flexDirection: 'row', flex: 0}}>
                <Switch 
                  value    = {biometricInfo.biosUser.biometricEnable} 
                  // onChange = {()=>this.switchBios( user, !biometricInfo.biosUser.biometricEnable )}
                />
              </Right>
            </ListItem> 
            <Label style={{marginTop: 10, paddingLeft: 10, paddingRight: 10}}>{"???????????????????????????APP???????????????????????????????????????????????????????????????????????????????????????????????????APP??????????????????????????????????????????????????????????????????????????????????????????\"????????????APP\"???\"???????????????\"??????????????????"}</Label> */}
          
           {/* ?????????????????? */}
            <ListItem 
              last 
              style       = {[{marginTop:30}]} 
            >           
              <Left>
                <Text style={{fontSize: 18, color:this.props.style.inputWithoutCardBg.inputColor}}>{MeetingSettinLang.meetingNotificationAssistant}</Text>
              </Left>
              <Right style={{flexDirection: 'row', flex: 0}}>
                <Switch 
                  value    = {this.state.openMeetingQuery == 'Y' ? true : false} 
                  onChange = {this.openMeetingQueryAct}
                />
              </Right>
            </ListItem>
            <Label style={{marginTop: 10, paddingLeft: 17, paddingRight: 17}}>
              {MeetingSettinLang.meetingNotificationAssistantTxt}
            </Label>
              
            {
              this.state.openMeetingQuery == 'Y' ? 
                // ????????????
                <ListItem 
                  last
                  style   = {[{marginTop:10}]} 
                  onPress = {()=>{
                    NavigationService.navigate("MeetingSettingAssistant", {
                      onPress  : this.selectAssistant
                    });
                  }}
                >
                  <Left>
                    <Text style={{fontSize: 18, color:this.props.style.inputWithoutCardBg.inputColor}}>{MeetingSettinLang.meetingAssistant}</Text>
                  </Left>
                
                  <Right style={{flexDirection: 'row', flex: 0}}>
                    <Text style={{color:this.props.style.inputWithoutCardBg.inputColor}}>{this.state.openMeetingMemberNM}</Text>
                    <Text>  </Text>
                    <Icon name='arrow-forward' />
                  </Right>
                </ListItem>
              :
                null
            }
            {
              this.state.openMeetingQuery == 'Y' ? 
                // ??????????????????
                <ListItem 
                  last 
                  style       = {[{marginTop:30}]} 
                >           
                  <Left>
                    <Text style={{fontSize: 18, color:this.props.style.inputWithoutCardBg.inputColor}}>{MeetingSettinLang.shareMeetingNotice}</Text>
                  </Left>
                  <Right style={{flexDirection: 'row', flex: 0}}>
                    <Switch 
                      value    = {this.state.openMeetingPush == 'Y' ? true : false} 
                      onChange = {this.openMeetingPushAct}
                    />
                  </Right>
                </ListItem>
              :
                null
            }
            {
              this.state.openMeetingQuery == 'Y' ? 
                <Label style={{marginTop: 10, paddingLeft: 17, paddingRight: 17}}>
                  {MeetingSettinLang.shareMeetingNoticeTxt}
                </Label>
              :
                null
            }
            <Label style={{height: 48}}> </Label>
          </Content>
      </Container>
    );
  }

  switchPush(){
  }

  switchAcc(){
  }

  openMeetingQueryAct = () => {
    let AssistantID = this.state.openMeetingMember;
    let AssistantNM = this.state.openMeetingMemberNM;
    let isOpenMeetingQuery = this.state.openMeetingQuery;
    if(AssistantID != "" && AssistantNM != "") {
      let openMeetingQuery;
      if(isOpenMeetingQuery == 'Y') {
        this.setState({
          openMeetingQuery: 'N'
        });
        openMeetingQuery = 'N';
      }else {
        this.setState({
          openMeetingQuery: 'Y'
        });
        openMeetingQuery = 'Y';
      }
  
      let user = this.props.state.UserInfo.UserInfo;
      let lang = this.props.state.Language.lang;
      let idArr = ["openMeetingQuery","openMeetingMember","openMeetingMemberNM","openMeetingPush"];
      let assistantObj = {
        "openMeetingQuery" :    openMeetingQuery,
        "openMeetingMember":    this.state.openMeetingMember,
        "openMeetingMemberNM":  this.state.openMeetingMemberNM,
        "openMeetingPush"  :    this.state.openMeetingPush
      }
      this.props.actions.updateMeetingAssistantData(user, lang, idArr, assistantObj);
    }else {
      if(isOpenMeetingQuery == 'N') {
        NavigationService.navigate("MeetingSettingAssistant", {
          onPress  : this.selectAssistant
        });
      } 
    }
  }

  openMeetingPushAct = () => {
    let isOpenMeetingPush = this.state.openMeetingPush;
    let openMeetingPush;
    if(isOpenMeetingPush == 'Y') {
      this.setState({
        openMeetingPush: 'N'
      });
      openMeetingPush = 'N';
    }else {
      this.setState({
        openMeetingPush: 'Y'
      });
      openMeetingPush = 'Y';
    }

    let user = this.props.state.UserInfo.UserInfo;
    let lang = this.props.state.Language.lang;
    let idArr = ["openMeetingQuery","openMeetingMember","openMeetingMemberNM","openMeetingPush"];
    let assistantObj = {
      "openMeetingQuery" :    this.state.openMeetingQuery,
      "openMeetingMember":    this.state.openMeetingMember,
      "openMeetingMemberNM":  this.state.openMeetingMemberNM,
      "openMeetingPush"  :    openMeetingPush
    }
    this.props.actions.updateMeetingAssistantData(user, lang, idArr, assistantObj);
  }

  selectAssistant = (assistant) => {
    this.setState({
      openMeetingQuery    : "Y",
      openMeetingMember   : assistant.id,
      openMeetingMemberNM : assistant.name,
    });
    
    let user = this.props.state.UserInfo.UserInfo;
    let lang = this.props.state.Language.lang;
    let idArr = ["openMeetingQuery","openMeetingMember","openMeetingMemberNM","openMeetingPush"];
    let openMeetingMember = assistant.id;
    let openMeetingMemberNM = assistant.name;
    let assistantObj = {
      "openMeetingQuery" :    "Y",
      "openMeetingMember":    openMeetingMember,
      "openMeetingMemberNM":  openMeetingMemberNM,
      "openMeetingPush"  :    this.state.openMeetingPush
    }
    this.props.actions.updateMeetingAssistantData(user, lang, idArr, assistantObj);
  }
}

// export let AccountSafePageStyle = connectStyle( 'Page.MinePage', {} )(MeetingSettingPage);
// export let MinePageStyle = connectStyle( 'Page.MinePage', {} )(MeetingSettingPage);

export let MeetingSettingPageStyle = connectStyle( 'Component.InputWithoutCardBackground', {} )(MeetingSettingPage);


export default connect(
  (state) => ({
    state: {...state}
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...UserInfoAction
    }, dispatch)
  })
)(MeetingSettingPageStyle);