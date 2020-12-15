import React from 'react';
import { View, Image, ActivityIndicator, Platform, NativeModules, Alert, TouchableOpacity} from 'react-native';
import { Container, Header, Item, Switch, ListItem, Left, Input, Content, Body, Right, Button, Icon, Title, Text, Toast, Card, CardItem, connectStyle } from 'native-base';
import ReactNativeBiometrics  from 'react-native-biometrics'
import { connect }            from 'react-redux'; 
import { bindActionCreators } from 'redux';
import HeaderForGeneral       from '../../components/HeaderForGeneral';
import * as NavigationService from '../../utils/NavigationService';
import DeviceStorageUtil      from '../../utils/DeviceStorageUtil';
import * as UpdateDataUtil    from '../../utils/UpdateDataUtil';
import * as LoginAction       from '../../redux/actions/LoginAction';
import * as LanguageAction    from '../../redux/actions/LanguageAction';
import * as UserInfoAction    from '../../redux/actions/UserInfoAction';
import * as HomeAction        from '../../redux/actions/HomeAction';
import * as CommonAction      from '../../redux/actions/CommonAction';
import * as ThemeAction       from '../../redux/actions/ThemeAction';
import * as FormAction        from '../../redux/actions/FormAction';
import * as BiometricAction   from '../../redux/actions/BiometricAction';

class AccountSafePage extends React.Component {
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
            {
              (user.id==user.loginID)?
              <ListItem 
                  last 
                  style={[{marginTop:10}]} 
                  onPress={()=>NavigationService.navigate("UpdatePassword")}
              >           
                 <Left>
                   <Text style={{fontSize: 18}}>{this.props.state.Language.lang.AccountSafePage.UpdatePassword}</Text>
                 </Left>
                 <Right style={{flexDirection: 'row', flex: 0}}>
                    <Icon name="arrow-forward" />
                 </Right>
              </ListItem>
              :
              null
            }
           {
              (biometricInfo.biosSupport)?
                <ListItem 
                  last 
                  style       = {[{marginTop:10}]} 
                  onPress     = {()=>this.switchBios( user, !biometricInfo.biosUser.biometricEnable )}
                >           
                  <Left>
                    <Text style={{fontSize: 18}}>{this.props.state.Language.lang.MinePage.Biometrics}</Text>
                  </Left>
                  <Right style={{flexDirection: 'row', flex: 0}}>
                    <Switch 
                      value    = {biometricInfo.biosUser.biometricEnable} 
                      onChange = {()=>this.switchBios( user, !biometricInfo.biosUser.biometricEnable )}
                    />
                  </Right>
                </ListItem> 
              :
                null   
            }    
            <ListItem 
                  last 
                  style={[{marginTop:30,alignItems:'center',justifyContent:'center'}]} 
                  onPress={this.switchAcc.bind(this, "change")}
              >  
                <View style={{ alignItems: "center"}}>         
                  <Text style={{fontSize: 18 ,textAlign:'center'}}>
                    {this.props.state.Language.lang.MinePage.changeAccount}
                  </Text>
                </View>
            </ListItem>
            <ListItem 
                  last 
                  style={[{marginTop:10,alignItems:'center',justifyContent:'center'}]} 
                  onPress={this.logout.bind(this)}
              >  
                <View style={{ alignItems: "center"}}>         
                  <Text style={{fontSize: 18 ,textAlign:'center'}}>
                    {this.props.state.Language.lang.MinePage.logout}
                  </Text>
                </View>
            </ListItem>
          </Content>
      </Container>
    );
  }

  switchBios = (user, biometricEnable) => {
    if (biometricEnable) {
      ReactNativeBiometrics.simplePrompt({ promptMessage: this.props.state.Language.lang.Common.BiosAuth }).then((resultObject) => {
        let { success, error } = resultObject
        if (success) {
          this.props.actions.setIsBiometricEnable(user, biometricEnable);   //開啟生物識別驗證
        }
      }).catch((error) => {
        console.log(error);
        error = JSON.stringify(error)

        let errorMsg;
        if (error.indexOf("Code=-6") != -1) {         //User has denied the use of biometry for this app
          errorMsg = this.props.state.Language.lang.BiosForLoginPage.BiosErrMsgCode6;
        } else if (error.indexOf("Code=-7") != -1) {  //No identities are enrolled;
          errorMsg = this.props.state.Language.lang.BiosForLoginPage.BiosErrMsgCode7;
        } else {                                      //生物識別功能獲取異常
          errorMsg = this.props.state.Language.lang.BiosForLoginPage.BiosErrMsgOther;  
        }

        Alert.alert(
          this.props.state.Language.lang.Common.Alert,                          
          errorMsg
        );
        
      })
    } else {
      this.props.actions.setIsBiometricEnable(user, biometricEnable);       //删除生物識別資訊
    }
  }

  async switchPush(user){
    await this.props.actions.updateUserdata( user, 'isPush', user.isPush == 'Y' ? 'N': 'Y');

    if(this.props.state.Network.networkStatus){
      UpdateDataUtil.updateMBUserToServer(user).catch((e)=>{
        if(e.code=="0"){
          this.props.actions.logout();
        }
      });
    }else{
      //如果沒有網路操作的話，紀錄storage要更新
      DeviceStorageUtil.set('update','Y');
    }
  }

  switchAcc(flag){
    NavigationService.navigate("ChangeAccount",{fromPage: flag});
  }

  logout() {
    this.props.actions.deleteAllForms(); //消除所有清單內容
    this.props.actions.userLogout();     //登出
  }

}

export let AccountSafePageStyle = connectStyle( 'Page.MinePage', {} )(AccountSafePage);
export let MinePageStyle = connectStyle( 'Page.MinePage', {} )(AccountSafePage);

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
      ...CommonAction,
      ...BiometricAction
    }, dispatch)
  })
)(AccountSafePageStyle,MinePageStyle);