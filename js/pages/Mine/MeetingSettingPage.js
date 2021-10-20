import React from 'react';
import { View, Image, ActivityIndicator, Platform, NativeModules, Alert, TouchableOpacity} from 'react-native';
import { Container, Header, Item, Switch, ListItem, Left, Input, Content, Body, Right, Button, Icon, Title, Text, Toast, Card, CardItem, Separator, Label, connectStyle } from 'native-base';
import { connect }            from 'react-redux'; 
import { bindActionCreators } from 'redux';
import HeaderForGeneral       from '../../components/HeaderForGeneral';
import * as NavigationService from '../../utils/NavigationService';

class MeetingSettingPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
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
          title                 = {this.props.state.Language.lang.AccountSafePage.AccountSafe}
          isTransparent         = {false}
        />
          <Content> 
            <ListItem 
              last 
              style       = {[{marginTop:30}]} 
              // onPress     = {()=>this.switchBios( user, !biometricInfo.biosUser.biometricEnable )}
            >           
              <Left>
                <Text style={{fontSize: 18}}>{"同步所有會議至手機行事曆"}</Text>
              </Left>
              <Right style={{flexDirection: 'row', flex: 0}}>
                <Switch 
                  value    = {biometricInfo.biosUser.biometricEnable} 
                  // onChange = {()=>this.switchBios( user, !biometricInfo.biosUser.biometricEnable )}
                />
              </Right>
            </ListItem> 
            <Label style={{marginTop: 10, paddingLeft: 10, paddingRight: 10}}>{"此開關決定是否將\"我的會議\"裡面的所有會議時程，同步至您的手機行事曆中，方便您直接用行事曆進行會議時程查看。"}</Label>

            <ListItem 
              last 
              style       = {[{marginTop:30}]} 
              // onPress     = {()=>this.switchBios( user, !biometricInfo.biosUser.biometricEnable )}
            >           
              <Left>
                <Text style={{fontSize: 18}}>{"是否繼續接收會議提醒"}</Text>
              </Left>
              <Right style={{flexDirection: 'row', flex: 0}}>
                <Switch 
                  value    = {biometricInfo.biosUser.biometricEnable} 
                  // onChange = {()=>this.switchBios( user, !biometricInfo.biosUser.biometricEnable )}
                />
              </Right>
            </ListItem> 
            <Label style={{marginTop: 10, paddingLeft: 10, paddingRight: 10}}>{"當您決定將華利實業APP的會議功能同步至您的手機行事曆後，您可決定是否繼續接受來自華利實業APP的會議提醒。此開關啟用後，有可能在會議提醒時，會同時收到來自\"華利實業APP\"與\"手機行事曆\"的提醒通知。"}</Label>
          </Content>
      </Container>
    );
  }

  switchPush(){
  }

  switchAcc(){
  }
}

export let AccountSafePageStyle = connectStyle( 'Page.MinePage', {} )(MeetingSettingPage);
export let MinePageStyle = connectStyle( 'Page.MinePage', {} )(MeetingSettingPage);

export default connect(
  (state) => ({
    state: {...state}
  }),
  (dispatch) => ({
    actions: bindActionCreators({
    }, dispatch)
  })
)(AccountSafePageStyle,MinePageStyle);