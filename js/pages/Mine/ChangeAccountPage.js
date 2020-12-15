import React from 'react';
import { Alert,View } from 'react-native';
import { Thumbnail, Container, Header, Button, Text, Spinner, Left, Icon, Body, Right, Item , Card, CardItem, connectStyle } from 'native-base';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import * as LoginAction       from '../../redux/actions/LoginAction';
import * as BiometricAction   from '../../redux/actions/BiometricAction';
import * as FormAction        from '../../redux/actions/FormAction';
import * as NavigationService from '../../utils/NavigationService';
import ToastUnit              from '../../utils/ToastUnit';
import LinearGradient         from 'react-native-linear-gradient';



class ChangeAccountPage extends React.Component {
  constructor(props) {
    super(props);
  }

  //改掉沒法抓取異動前的資料
  UNSAFE_componentWillReceiveProps(nextProps) {
    // if(nextProps.Login.isLogin){
    //   NavigationService.navigate('Main');
    // }

    if(nextProps.Login.loadingInfo !== null){
      ToastUnit.show('error', nextProps.Login.loadingInfo, true);
    }
  }

  render() {
    const context = this.props.Language.lang.LoginPage; //LoginPage的文字內容
    let user = this.props.UserInfo.UserInfo;
    if (user.picture == null) {
      user.picture   = (user.sex == "F") ? require("../../image/user_f.png") : require("../../image/user_m.png") ;
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
                 onPress={()=>{
                   NavigationService.goBack();
                 }}
               >
                 <Icon name="arrow-back" style={{color:"#FFF"}}/>
               </Button>
           </Left>
            <Body />
            <Right/>
          </Header>

          <Body style={{alignItems:"flex-start", width:"80%",flex:0, marginTop:20, paddingBottom:20}}>
            <Text style={{fontSize:44, color:"#FFF", fontWeight:"bold"}}>{this.props.Language.lang.ChangeAccountPage.ChangeAccLogin}</Text>
          </Body>
          <View style={{alignItems:"center", flexDirection:"column", flex:1}}>

            <View style={{alignItems:"flex-start", width:"80%", flex:1}}>
              <Item style={{height:this.props.style.PageSize.height*.035}}/>

              <Card transparent style={{width:"110%", paddingBottom:20}}>
                <CardItem  style={{width:"100%",backgroundColor:"rgba(0,0,0,0)",borderWidth: 0}}
                >
                  <Thumbnail source={ user.picture } />     
                  <Text style={{paddingLeft:this.props.style.PageSize.width*.035,color:'white'}}>{this.props.UserInfo.UserInfo.loginID}</Text>
                </CardItem>
              </Card>
              <Item style={{height:this.props.style.PageSize.height*.035}}/>

              <Item>
                <Button bordered light 
                  style={{width:"100%", alignItems:"center", justifyContent:"center"}}
                  onPress = {this.onChangeAcc}
                >
                  {
                    (this.props.Login.masking) ?
                      <Spinner color='white'/>
                    :
                      <Text>{this.props.Language.lang.ChangeAccountPage.HitToChangeAcc}</Text>
                  }
                </Button>
              </Item>
              <Item style={{height:this.props.style.PageSize.height*.035}}/>

              <Button  transparent light
                style={{width:"100%", alignItems:"center", justifyContent:"center"}}
                onPress = {this.deletBiosUser}
              >
                {
                  (this.props.Login.masking) ?
                    <Spinner color='white'/>
                  :
                    <Text>{this.props.Language.lang.ChangeAccountPage.DeleteTelRecord}</Text>
                }
              </Button>
            </View>
          </View>
        </LinearGradient>
      </Container>
    );
  }

  // 刪除此設備上的帳號紀錄
  deletBiosUser =()=>{
      Alert.alert(
        this.props.Language.lang.Common.Alert,  //溫馨提示
        this.props.Language.lang.BiosForLoginPage.isDeleteMBinfo, //是否要删除设备信息
        [
            {
              text: this.props.Language.lang.Common.Comfirm, 
              onPress: () => {
                let user = this.props.UserInfo.UserInfo;
                if (this.props.Biometric.biosUser.biometricEnable) {
                  this.props.actions.setIsBiometricEnable(user, false); //删除生物識別資訊
                }
                this.props.actions.deleteAllForms(); //消除所有清單內容
                this.props.actions.userLogout();     //登出
              }
            },//獲取
            {
              text: this.props.Language.lang.Common.Cancel, 
              onPress: () => {}, 
              style:'cancel'
            },//取消
        ],
        { cancelable: false }
    );
  }

  // 更換帳號
  onChangeAcc = () => {
    this.props.navigation.push('AuthStack', {
      screen: 'Login',
      params: {
        isChangeAccount: true
      }
    });
  }
}

let ChangeAccountPageStyle = connectStyle( 'Page.LoginPage', {} )(ChangeAccountPage);
export default connect(
  (state) => ({...state}),
  (dispatch) => ({
    actions: bindActionCreators({
      ...LoginAction,
      ...BiometricAction,
      ...FormAction
    }, dispatch)
  })
)(ChangeAccountPageStyle);



