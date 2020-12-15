import React from 'react';
import { View, Image, ActivityIndicator, TextInput, Platform, NativeModules, Alert, TouchableOpacity} from 'react-native';
import { Container, Header, Item, ListItem, Left, Password, Form, Input, Content, Label, Body, Right, Button, Icon, Title, Text, Card, CardItem, connectStyle } from 'native-base';
import HeaderForGeneral    from '../../components/HeaderForGeneral';
import { bindActionCreators } from 'redux';
import DateFormat from  'dateformat'; //  https://www.npmjs.com/package/dateformat
import { connect } from 'react-redux'; 
import * as NavigationService from '../../utils/NavigationService';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';
import * as LoginAction    from '../../redux/actions/LoginAction';
import * as LanguageAction from '../../redux/actions/LanguageAction';
import * as UserInfoAction from '../../redux/actions/UserInfoAction';
import * as FormAction    from '../../redux/actions/FormAction';
import * as MyFormAction  from '../../redux/actions/MyFormAction';
import * as HomeAction    from '../../redux/actions/HomeAction';
import * as CommonAction  from '../../redux/actions/CommonAction';
import * as ThemeAction   from '../../redux/actions/ThemeAction';
import * as SubmitAction  from '../../redux/actions/SubmitAction';
import Common             from '../../utils/Common';
import ToastUnit          from '../../utils/ToastUnit';

class UpdatePasswordPage extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      oldpassword: '',
      newpassword:'',
      confirmpwd:'',
      test: false,
      imageState: false
    }
  }

  render(){
    let user = this.props.state.UserInfo.UserInfo;
    return(
      <Container>
        <HeaderForGeneral
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:"arrow-back"}}
          leftButtonOnPress     = {() =>NavigationService.goBack()} 
          isRightButtonIconShow = {false}
          rightButtonIcon       = {null}
          rightButtonOnPress    = {null} 
          title                 = {this.props.state.Language.lang.AccountSafePage.UpdatePassword}
          isTransparent         = {false}
        />
         <Content contentContainerStyle={{paddingTop: 35, paddingLeft:"5%", paddingRight:"5%"}}>
            <Form>
              <Body style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
                <Icon name={Platform.OS === 'ios' ? "lock-closed-sharp": "lock"}/>
                <Label style={{marginLeft:8}}>{this.props.state.Language.lang.AccountSafePage.OldPassword}</Label>
              </Body>
              <Item style= {{marginLeft: 0}}>
                <Input 
                  returnKeyType = {"done"}
                  placeholder={this.props.state.Language.lang.AccountSafePage.InputOldPwd}
                  secureTextEntry={true}
                  onChangeText = {(text)=>{ this.setState({ oldpassword:text }); }}
                  placeholderTextColor  = {this.props.style.inputWithoutCardBg.inputColorPlaceholder}
                  style={{color:this.props.style.inputWithoutCardBg.inputColor}}
                />
              </Item>

              <Body style={{flexDirection: 'row', alignSelf: 'flex-start', paddingTop: 20}}>
                <Icon name={Platform.OS === 'ios' ? "lock-closed-sharp": "lock"}/>
                <Label style={{marginLeft: 8}}>{this.props.state.Language.lang.AccountSafePage.NewPassword}</Label>
              </Body>
              <Item style= {{marginLeft: 0}}>
                <Input 
                  type="Password"
                  placeholder  = {this.props.state.Language.lang.AccountSafePage.InputNewPwd}
                  secureTextEntry={true}
                  placeholderTextColor  = {this.props.style.inputWithoutCardBg.inputColorPlaceholder}
                  onChangeText = {(text)=>{ this.setState({ newpassword:text }); }}
                  style={{color:this.props.style.inputWithoutCardBg.inputColor}}
                />
              </Item>
              <Body style={{flexDirection: 'row', alignSelf: 'flex-start', paddingTop: 20}}>
                <Icon name={Platform.OS === 'ios' ? "lock-closed-sharp": "lock"}/>
                <Label style={{marginLeft: 8 }}>{this.props.state.Language.lang.AccountSafePage.ComfirmPwd}</Label>
              </Body>
              <Item style= {{marginLeft: 0}}>
                <Input 
                  placeholder  = {this.props.state.Language.lang.AccountSafePage.InputComfirm}
                  secureTextEntry={true}
                  placeholderTextColor  = {this.props.style.inputWithoutCardBg.inputColorPlaceholder}
                  onChangeText = {(text)=>{ this.setState({ confirmpwd:text }); }}
                  style={{color:this.props.style.inputWithoutCardBg.inputColor}}
                />
              </Item>
            </Form>

            <Button block info 
              style={{width:"70%", alignSelf: 'center', marginTop:35}} 
              onPress = {this.confirm.bind(this)} >
               {
                (this.props.state.Submit.isSubmitting) ?
                  <Spinner color='white'/>
                :
                  <Text>{this.props.state.Language.lang.AccountSafePage.ComfirmUpdate}</Text>
              }
            </Button>
        </Content>
      </Container>
    );
  }

  //点击确认修改后进行的动作
  confirm = () => {
    //先对密码进行判断
    let rows=Common.checkPassword(
      this.props.state.Language.lang,
      Common.encrypt(this.state.oldpassword),
      this.state.newpassword,
      this.state.confirmpwd,
      this.props.state.UserInfo.UserInfo.password,
      this.props.state.UserInfo.UserInfo
    );  
    //根据判断结果进行下一步，
    //都正确则进行密码修改的
    if (rows.checkPwdFlag) {
      let user = this.props.state.UserInfo.UserInfo;
      this.props.actions.updataPassword(
      this.state.newpassword, 
      user, 
      this.props.state.Language.lang
      );

    } else {
      ToastUnit.show('error', rows.msg, true);
    }
 }

}




export let UpdatePasswordPageStyle1 = connectStyle( 'Component.InputWithoutCardBackground', {} )(UpdatePasswordPage);
export let UpdatePasswordPageStyle2 = connectStyle( 'Page.MinePage', {} )(UpdatePasswordPage);
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
      ...ThemeAction
    }, dispatch)
  })
)(UpdatePasswordPageStyle1,UpdatePasswordPageStyle2);