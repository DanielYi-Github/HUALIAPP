import React from 'react';
import { Alert, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Button, Text, Spinner, Left, Icon, Body, Title, Right, Item, Input, Label, connectStyle  } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as LoginAction       from '../../redux/actions/LoginAction';
import * as NavigationService from '../../utils/NavigationService';
import ToastUnit              from '../../utils/ToastUnit';
import LinearGradient         from 'react-native-linear-gradient';

class SignPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account : '',
      password: '',
      password1: '',
      lang: this.props.Language.lang.SignPage
    }
  }

  render() {
    let context = this.props.Language.lang.LoginPage; //LoginPage的文字內容
    return (
      <Container>
        <LinearGradient start={{x: 1, y: 0}} end={{x: 0, y: 1}} colors={['#A7DBFF', '#1976D2']} style={{flex:1}}>
          <Header transparent>
            <Left>
              {
                (this.state.noBackButton) ? 
                  null
                :
                  <Button transparent 
                    style={{
                      height         : 55,
                      width          : 55, 
                      alignItems     : 'center', 
                      justifyContent : 'center' 
                    }}
                    onPress={()=>{
                      NavigationService.goBack();
                    }}
                  >
                    <Icon name="close" style={{color:"#FFF"}}/>
                  </Button>
              }
            </Left>
            <Body />
            <Right/>
          </Header>
          <View style={{alignItems:"center", flexDirection:"column", flex:1}}>

            <View style={{alignItems:"flex-start", width:"80%", flex:1, justifyContent:"center"}}>
              <Item floatingLabel>
                <Label style={{color:"#FFF"}}>{this.state.lang.InputYourMail}</Label>
                <Input 
                  style={{color:"#FFF"}} 
                  selectionColor={"#FFF"} 
                  onChangeText  = {(text)=>{ this.setState({ account:text }); }}
                />
                <Icon name='mail' style={{color:"#FFF"}} />
              </Item>
              <Item style={{height:this.props.style.PageSize.height*.035}}/>
              
              <Item floatingLabel>
                <Label style={{color:"#FFF"}}>{this.state.lang.InputYourPassword1}</Label>
                <Input 
                  style={{color:"#FFF"}} 
                  secureTextEntry={true} 
                  selectionColor={"#FFF"}
                  onChangeText  = {(text)=>{ this.setState({ password:text }); }}
                />
                <Icon name={'lock-closed'} style={{color:"#FFF"}} />
              </Item>

              <Item style={{height:this.props.style.PageSize.height*.035}}/>

              <Item floatingLabel>
                <Label style={{color:"#FFF"}}>{this.state.lang.InputYourPassword2}</Label>
                <Input 
                  style={{color:"#FFF"}} 
                  secureTextEntry={true} 
                  selectionColor={"#FFF"}
                  onChangeText  = {(text)=>{ this.setState({ password1:text }); }}
                />
                <Icon name={'lock-closed'} style={{color:"#FFF"}} />
              </Item>

            </View>

            <View style={{width:"80%", flex:1, justifyContent:"center"}}>
              <Button bordered light 
                style={{width:"100%", alignItems:"center", justifyContent:"center"}}
                onPress = {this.login.bind(this)}
              >
                {
                  (this.props.Login.masking) ?
                    <Spinner color='white'/>
                  :
                    <Text>{this.state.lang.Sign}</Text>
                }
              </Button>
            </View>
          </View>
        </LinearGradient>
      </Container>
    );
  }

  login() {
    if (this.props.Network.networkStatus) {
      if (!this.state.account || this.state.account.replace(/[\r\n]/g,"").replace(/^[\s　]+|[\s　]+$/g, "").length == 0) {
        ToastUnit.show('error', this.state.lang.MailIsNotNull, true);
      }else if(!this.state.password || this.state.password.replace(/[\r\n]/g,"").replace(/^[\s　]+|[\s　]+$/g, "").length == 0){
        ToastUnit.show('error', this.state.lang.PasswordIsNotNull, true);
      }else if(!this.state.password1 || this.state.password1.replace(/[\r\n]/g,"").replace(/^[\s　]+|[\s　]+$/g, "").length == 0){
        ToastUnit.show('error', this.state.lang.PasswordIsNotNull, true);
      }else if(this.state.password !== this.state.password1){
        ToastUnit.show('error', this.state.lang.CheckPassword, true);
      }else{
        Alert.alert(
          this.state.lang.SignSucess,
          this.state.lang.SignSucessInfo,    //無法連線，請確定網路連線狀況
          [
            {text: 'OK', onPress: () => NavigationService.goBack()}
          ]
        );
      }
    } else {
      Alert.alert( 
        this.props.Language.lang.Common.Error ,    //錯誤
        this.props.Language.lang.Common.NoInternetAlert,   //無法連線，請確定網路連線狀況        
      );
    }
  };

  showForgetPassword() {
    Alert.alert(
      this.props.Language.lang.LoginPage.ForgetPassword,
      this.props.Language.lang.LoginPage.ForgetPasswordAlert
    );
  }
}

let SignPageStyle = connectStyle( 'Page.LoginPage', {} )(SignPage);
export default connect(
  (state) => ({...state}),
  (dispatch) => ({
    actions: bindActionCreators(LoginAction, dispatch)
  })
)(SignPageStyle);