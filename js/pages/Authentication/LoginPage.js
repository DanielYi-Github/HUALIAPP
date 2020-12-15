import React from 'react';
import { Image, findNodeHandle, Platform, Alert  } from 'react-native';
import { Container, Header, Content, Button, Text, Left, Icon, Body, Right, Item, connectStyle} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import * as LoginAction       from '../../redux/actions/LoginAction';
import * as FormAction        from '../../redux/actions/FormAction';
import * as BiometricAction   from '../../redux/actions/BiometricAction';
import * as NavigationService from '../../utils/NavigationService';
import ToastUnit              from '../../utils/ToastUnit';
import LoginSingleItem        from '../../components/LoginSingleItem';
import LoginTabsItem          from '../../components/LoginTabsItem';



class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChangeAccount :this.props.route.params?.isChangeAccount,
    }
  }

  async componentDidMount() {
    // this.props.actions.loadLoginMode();  // 檢核登陸模式 tab/single
  }
  
  UNSAFE_componentWillReceiveProps(nextProps) {
    // 用以顯示登入時所出現的訊息提示，例如密碼錯誤、人員不存在等
    if(nextProps.Login.loadingInfo !== null){
      ToastUnit.show('error', nextProps.Login.loadingInfo, true);
      this.props.actions.reset_mix();
    }

    // 用以顯示工號登入時，第一次使用或重置密碼過後，使用預設密碼的訊息提示
    if(nextProps.Login.is_EMPID_Reset){
      Alert.alert(
        nextProps.Language.lang.Common.Alert,
        nextProps.Language.lang.LoginPage.FirstTips,
        [
          { text: "OK", onPress: () => this.props.actions.reset_mix() }
        ]
      );
    }
  }

  render() {
    let context = this.props.Language.lang.LoginPage; //LoginPage的文字內容
    return (
      <Container>
        <LinearGradient start={{x: 1, y: 0}} end={{x: 0, y: 1}} colors={['#A7DBFF', '#1976D2']} style={{flex:1}}>
          <Header transparent>
            <Left>
              <Button transparent 
                style={{
                  height         : 55,
                  width          : 55, 
                  alignItems     : 'center', 
                  justifyContent : 'center' 
                }}
                onPress={()=>{ 
                  this.setAccountType();
                  NavigationService.goBack(); 
                }}
              >
                <Icon name="close" style={{color:"#FFF"}}/>
              </Button>     
            </Left>
            <Body/>
            <Right style={{flex: 0}}>
              {
                (this.props.Common.turnOnAppleVerify && !this.state.isChangeAccount) ? 
                  <Button transparent onPress={()=>{ NavigationService.navigate('Sign'); }}>
                    <Text style={{color:"#FFF"}}>{context.Sign}</Text>
                  </Button>
                :
                  null
              }
            </Right>
          </Header>

          <Content contentContainerStyle={{alignItems:"center"}}>
            <Body style={{flex:0}}>
              <Image  
                style={this.props.style.LoginPageIcon} 
                source={require(`../../image/login/icon-noback.png`)}
              />
            </Body>
            <Body style={{alignItems:"flex-start", width:"80%",flex:0, marginTop:20, paddingBottom:20}}>
              <Text style={{fontSize:24, color:"#FFF", fontWeight:"bold"}}>{context.WelcomeToUse}</Text>
              <Text style={{fontSize:44, color:"#FFF", fontWeight:"bold", paddingTop:12}}>{context.HFrun}</Text>
            </Body>
            {
              (this.props.Login.mode == "single")?
                <LoginSingleItem
                  setAccountType = {this.setAccountType}
                  checkBySingle  = {this.checkBySingle}
                  loginByMix     = {this.state.isChangeAccount?this.loginChangeAccount :this.loginByMix} //this.state.isChangeAccount決定是否為切換帳號狀態
                  forgetPassword = {this.forgetPassword}
                />
              :
                <LoginTabsItem/>
            }
          </Content>
        </LinearGradient>
      </Container>
    );
  }

  setAccountType = () => {
    this.props.actions.setAccountType();
  }

  checkBySingle = (account) => {
    this.props.actions.checkBySingle(account);
  }

  loginByMix = (account, password) => {
    switch (this.props.Login.checkAccType) {
      case "AD":
        this.props.actions.loginByAD(account, password);
        break;
      case "EMPID":
        this.props.actions.loginByEmpid(account, password);
        break;
      default:
    };
  }

  loginChangeAccount = (account, password) => {
    let user            = this.props.UserInfo.UserInfo;
    let checkAccType    = this.props.Login.checkAccType;
    let biometricEnable = this.props.Biometric.biosUser.biometricEnable;

    biometricEnable ? this.props.actions.setIsBiometricEnable(user, false) : null;  //删除生物識別資訊
    this.props.actions.deleteAllForms();                                            //消除所有清單內容
    this.props.actions.loginChangeAccount(account, password, checkAccType)          //進行變更帳號登入的動作  
  }

  forgetPassword = (accountType, account) => {
    if (accountType == "AD") {
      //ad登陸的忘記密碼
      Alert.alert(
        this.props.Language.lang.LoginPage.ForgetPassword,
        this.props.Language.lang.LoginPage.ForgetPasswordAlert
      );
    } else {
      //工號登錄的忘記密碼
      this.props.actions.forgetEmpPassword(account);
    }
  }

  componentWillUnmount(){
    this.setAccountType()
  }
}

let LoginPageStyle = connectStyle( 'Page.LoginPage', {} )(LoginPage);

export default connect(
  (state) => ({
    ...state,
    Login   : state.Login,
    Language: state.Language,
    Network : state.Network,
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...LoginAction,
      ...FormAction,
      ...BiometricAction
    },dispatch)
  })
)(LoginPageStyle);