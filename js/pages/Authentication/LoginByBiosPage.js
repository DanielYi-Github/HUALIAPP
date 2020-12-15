import React from 'react';
import { Alert, View, Platform } from 'react-native';
import { Thumbnail, Container, Header, Button, Text, Spinner, Toast, Left, Icon, Body, Right, Item, Card, CardItem, connectStyle } from 'native-base';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import LinearGradient         from 'react-native-linear-gradient';
import ReactNativeBiometrics  from 'react-native-biometrics'
import * as BiometricAction   from '../../redux/actions/BiometricAction';
import * as LoginAction       from '../../redux/actions/LoginAction';
import * as NavigationService from '../../utils/NavigationService';
import * as UpdateDataUtil    from '../../utils/UpdateDataUtil';
import Common                 from '../../utils/Common';

class BiosForLoginPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.pressHandler();
  }

  render() {
    let biosUser = this.props.Biometric.biosUser;
    let picture;
    if (biosUser.pictureUrl == null ) {
      picture = (biosUser.sex == "F") ? require("../../image/user_f.png") : require("../../image/user_m.png")
    } else {
      picture = { uri: biosUser.pictureUrl };
    }

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
                  onPress={()=>{ NavigationService.goBack(); }}
                >
                  <Icon name="close" style={{color:"#FFF"}}/>
                </Button>     
              </Left>
            <Body />
            <Right/>
          </Header>

          <Body style={{alignItems:"flex-start", width:"80%",flex:0, marginTop:20, paddingBottom:20}}>
            <Text style={{fontSize:44, color:"#FFF", fontWeight:"bold"}}>{this.props.Language.lang.BiosForLoginPage.BiosForLogin}</Text>
            <Text style={{fontSize:24, color:"#FFF", fontWeight:"bold", paddingTop:12}}>{this.props.Language.lang.BiosForLoginPage.TouchAccLogin}</Text>
          </Body>

          <View style={{alignItems:"center", flexDirection:"column", flex:1}}>

            <View style={{alignItems:"flex-start", width:"80%", flex:1}}>
              <Item style={{height:this.props.style.PageSize.height*.035}}/>

              <Card transparent style={{width:"110%", paddingBottom:20}}>
                <CardItem button style={{width:"100%",backgroundColor:"rgba(0,0,0,0)",borderWidth: 0}}
                  onPress = {this.pressHandler}
                >
                  <Thumbnail source={picture} />     
                    <Text style={{paddingLeft:this.props.style.PageSize.width*.035,color:'white'}}>{biosUser.userID}</Text>
                </CardItem>
              </Card>

              <Item style={{height:this.props.style.PageSize.height*.035}}/>
              <Item>
                <Button bordered light 
                  style={{width:"100%", alignItems:"center", justifyContent:"center"}}
                  onPress = {this.changeAccLogin}
                >
                  {
                    (this.props.Login.loginPageMasking||this.props.Login.checkloading) ?
                      <Spinner color='white'/>
                    :
                      <Text>{this.props.Language.lang.BiosForLoginPage.HitToChangeAcc}</Text>
                  }
                </Button>
              </Item>


              <Item style={{height:this.props.style.PageSize.height*.035}}/>
              {(this.props.Login.loginPageMasking||this.props.Login.checkloading)?
                null
                :
                <Button  transparent light
                  style={{width:"100%", alignItems:"center", justifyContent:"center"}}
                  onPress = {this.deletBiosUser}
                >
                   <Text>{this.props.Language.lang.BiosForLoginPage.DeleteTelRecord}</Text>
                </Button>
              }
            </View>
          </View>
        </LinearGradient>
      </Container>
    );
  }

  deletBiosUser = () => {
    Alert.alert(
      //溫馨提示
      this.props.Language.lang.Common.Alert,
      //是否要删除设备信息
      this.props.Language.lang.BiosForLoginPage.isDeleteMBinfo, [{
          text: this.props.Language.lang.Common.Comfirm,
          onPress: () => {
            this.props.actions.setIsBiometricEnable( this.props.Biometric.biosUser, false );
            NavigationService.goBack();
          }
        }, //獲取
        {
          text: this.props.Language.lang.Common.Cancel,
          onPress: () => {},
          style: 'cancel'
        }, //取消
      ], {
        cancelable: false
      }
    );
  }

  pressHandler = () => {
    ReactNativeBiometrics.simplePrompt({ promptMessage: this.props.Language.lang.Common.BiosAuth }).then((resultObject) => {
      let { success } = resultObject
      if (success) this.props.actions.loginByImei(this.props.Biometric, this.props.Language.langStatus);
    }).catch((err) => {
      console.log();
      /*
      Alert.alert(
          this.props.Language.lang.Common.Alert,                          
          this.props.Biometric.errorMsg
      );
      */
     Alert.alert(
        this.props.Biometric.errorMsg,                          
        "請確認是否開啟生物識別功能"
      );
    })
  }

  changeAccLogin = () => {
    console.log("123", NavigationService);
    NavigationService.navigate('AuthStack', {screen:'Login'});
  }
  

}

let BiosForLoginPageStyle = connectStyle( 'Page.LoginPage', {} )(BiosForLoginPage);

export default connect(
  (state) => ({ ...state }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...LoginAction,
      ...BiometricAction
    }, dispatch)
  })
)(BiosForLoginPageStyle);



