import React from 'react';
import { Alert, View, DeviceEventEmitter} from 'react-native';
import { Container, Header, Content, Button, Text, Spinner, Left, Icon, Body, Right, Item, Input, Label, connectStyle } from 'native-base';
import LinearGradient        from 'react-native-linear-gradient';
import { connect }           from 'react-redux';
import { bindActionCreators }from 'redux';
import * as LoginAction       from '../../redux/actions/LoginAction';
import * as UpdateDataUtil    from '../../utils/UpdateDataUtil';
import Common                 from '../../utils/Common';
import ToastUnit              from '../../utils/ToastUnit';


class InitialPasswordPage extends React.Component {
  constructor(props) {
    super(props);
    let params = this.props.route.params;
    
    this.state = {
      empid       :params.empid,
      password    : '',
      password1   : '',
      basicData   :params.basicData
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.Login.loadingInfo !== null){
      ToastUnit.show('error', nextProps.Login.loadingInfo, true);
      this.props.actions.reset_mix();
    }

    if(nextProps.Login.showUpdatePasswordMessage){
      this.props.navigation.popToTop();   // 回到頂頁

      Alert.alert(
        this.props.Language.lang.Common.Alert,                      //溫馨提示
        this.props.Language.lang.InitialPasswordPage.ModifySuccess, //修改密碼成功，請用新密碼進行登陸
        [
          { text: "OK", onPress: () => {
            this.props.actions.cancelEmpidFirstLoginState(); //該帳號不屬於重置狀態
          }}
        ]        
      );
    }
  }

  render() {
    return (
      <Container>
        <LinearGradient start={{x: 1, y: 0}} end={{x: 0, y: 1}} colors={['#A7DBFF', '#1976D2']} style={{flex:1}}>
          <Header transparent>
            <Left>
                <Button transparent 
                  style={{ height: 55, width: 55, alignItems: 'center', justifyContent: 'center'}}
                  onPress = {()=>this.props.navigation.goBack()}
                >
                  <Icon name="arrow-back" style={{color:"#FFF"}}/>
                </Button>
            </Left>
            <Body />
            <Right/>
          </Header>

          <Body style={{alignItems:"flex-start", width:"80%",flex:0, marginTop:20, paddingBottom:20}}>
            <Text style={{fontSize:44, color:"#FFF", fontWeight:"bold"}}>{this.props.Language.lang.InitialPasswordPage.ModifyPwd}</Text>
          </Body>
          <View style={{alignItems:"center", flexDirection:"column", flex:1}}>
            <View style={{alignItems:"flex-start", width:"80%", flex:1, justifyContent:"center"}}>
              <Item style={{height:this.props.style.PageSize.height*.035}}/>
              <Item floatingLabel>
                <Label style={{color:"#FFF"}}>{this.props.Language.lang.InitialPasswordPage.NewPwd}</Label>
                <Input 
                  style           ={{color:"#FFF"}} 
                  secureTextEntry ={true} 
                  selectionColor  ={"#FFF"} 
                  onChangeText    = {(text)=>{ this.setState({ password:text }); }}
                />
                <Icon name={'lock-closed'} style={{color:"#FFF"}} />
              </Item>
              <Item style={{height:this.props.style.PageSize.height*.035}}/>



              <Item floatingLabel>
                <Label style={{color:"#FFF"}}>{this.props.Language.lang.InitialPasswordPage.CheckPwd}</Label>
                <Input 
                  style           ={{color:"#FFF"}} 
                  secureTextEntry ={true} 
                  selectionColor  ={"#FFF"}
                  onChangeText    ={(text)=>{ this.setState({ password1:text }); }}
                />
                <Icon name={'lock-closed'} style={{color:"#FFF"}} />
              </Item>
              
              <Item style={{height:this.props.style.PageSize.height*.035}}/>
            </View>

            <View style={{width:"80%", flex:1, justifyContent:"center"}}>
              <Button bordered light 
                style={{width:"100%", alignItems:"center", justifyContent:"center"}}
                onPress = {()=>{ 
                  this.updateEmpPwd();
                }}
              >
                {
                  (this.props.Login.masking) ?
                    <Spinner color='white'/>
                  :
                    <Text>{this.props.Language.lang.InitialPasswordPage.Confirm}</Text>
                }
              </Button>
            </View>
          </View>
        </LinearGradient>
      </Container>
    );
  }

  //驗證密碼
  updateEmpPwd = () => {
    if (this.props.Network.networkStatus) {
      let obj = Common.checkPassword(
        this.props.Language.lang,
        "temp",
        this.state.password,
        this.state.password1,
        "temp",
        this.state.basicData ? this.state.basicData.member : null
      );
      if (!obj.checkPwdFlag) {
        //密碼不可為空
        ToastUnit.show('error', obj.msg, true);
        return false;
      } else {
        this.props.actions.updateEmpPwd(
          this.state.empid.toUpperCase(), 
          this.state.password1, 
          this.props.Language.lang.LangStatus
        );
        return true;
      }
    } else {
      Alert.alert(
        this.props.Language.lang.Common.Error, //錯誤
        this.props.Language.lang.Common.NoInternetAlert, //無法連線，請確定網路連線狀況        
      );
      return false;
    }
  }
}

let InitialPasswordPageStyle = connectStyle( 'Page.LoginPage', {} )(InitialPasswordPage);
export default connect(
  (state) => ({...state}),
  (dispatch) => ({
    actions: bindActionCreators(LoginAction, dispatch)
  })
)(InitialPasswordPageStyle);



