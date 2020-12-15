import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  StyleSheet
} from 'react-native';
import * as Toast from '../../utils/ToastUtil';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as SubmitAction from '../../actions/SubmitAction';

class BindEmailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldEmail:'',
      newEmail:'',
    }
  }

  render() {
    // const context = this.props.Language.lang.LoginPage; //LoginPage的文字內容

    return (
      <View style={styles.container}>
        <View style={styles.passwordContainer}>
          <TextInput 
            ref                   = {input => { this.oldEmail = input }}
            style                 = {styles.textInput} 
            placeholder           = "目前綁定的Email"
            underlineColorAndroid = {'transparent'}  //输入框的线框为透明
            keyboardType          = 'email-address'
            onChangeText          = {(text)=>{ this.setState({ oldEmail:text }); }}
          />
          <TextInput 
            ref                   = {input => { this.newEmail = input }}
            style                 = {styles.textInput} 
            placeholder           = "更換綁定的Email"
            underlineColorAndroid = {'transparent'}  //输入框的线框为透明
            keyboardType          = 'email-address'
            onChangeText          = {(text)=>{ this.setState({ newEmail:text }); }}
          />
          <TouchableOpacity 
            onPress = {this.confirm.bind(this)} 
            style   = {styles.loginButton}>
              <Text style={styles.loginText}>
                提交
              </Text>
          </TouchableOpacity>
        </View>
        {this._renderActivityIndicator()}
      </View>
    );
  }

  confirm(){
    Keyboard.dismiss();


    //值不能為空
    if (!this.state.oldEmail) {
      Toast.toastShort("請輸入目前綁定的Email");
    } 
    else if(!this.state.newEmail) {
      Toast.toastShort("輸入欲更換綁定的Email");
    }
    else if(this.state.oldEmail === this.state.newEmail){
      //新密碼與舊密碼是否相同
      Toast.toastShort("新Email不能與舊Email相同");
    }
    else{
      //確認舊密碼
      this.props.actions.bindEmail(this.state.oldEmail, this.state.newEmail);
      this.setState({
        oldEmail:'',
        newEmail:'',
      });
      this.oldEmail.clear();
      this.newEmail.clear();
    }
  }

  _renderActivityIndicator = () => {
    if(this.props.Submit.isSubmitting){
      return(
        <View style={styles.ActivityIndicator}>
          <ActivityIndicator size="large" color="#3691ec"/>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  passwordContainer: {
    position: 'absolute',
    width:'100%',
    height:'100%',
    alignItems: 'center',
    flexDirection: 'column', 
    backgroundColor: '#fff',
    paddingTop: 36,
    zIndex: 0
  },
  textInput: {
    justifyContent: 'center',
    marginTop: 18,
    paddingLeft: 15,
    height: 55,
    width: '90%',
    color: '#9fa2a4',
    backgroundColor: '#f7fafb',
    fontSize: 18,
    // fontFamily: 'RobotoRegular',
    borderWidth: 1,
    borderRadius:2,
    borderColor: '#ebebeb',
  },
  loginButton: {
    marginTop: 36,
    height: 55,
    width: '90%',
    backgroundColor: '#04b9e6',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:2,
  },
  loginText: {
    color: '#fff',
    fontSize: 20,
  },
  ActivityIndicator:{
    position: 'absolute',
    zIndex: 1,
    alignItems: 'center',
    width:'100%',
    height:'100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingTop:131
  }
});


export default connect(
  (state) => ({
    Submit: state.Submit,
  }),
  (dispatch) => ({
    actions: bindActionCreators(SubmitAction, dispatch)
  })
)(BindEmailPage);
