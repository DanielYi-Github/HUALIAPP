import React from 'react';
import { Alert ,View , DeviceEventEmitter } from 'react-native';
import { Button, Text, Spinner, Icon, Body, Item, Input, Tab, Tabs, ScrollableTab , Label, connectStyle} from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class LoginSingleItem extends React.PureComponent  {
	constructor(props) {
	    super(props);
	    this.state = {
        account      : "daniel.yi",
        password     : "daniel.yi",
        isLockEyeOpen: false
	    }
	}

	render() {
    let context = this.props.Language.lang.LoginPage; //LoginPage的文字內容
    let mix=(
      <View>
        <Body style={{ flex:0,width:"80%"}}>
          <Item style={{height:this.props.style.PageSize.height*.035}}/>
            
            <Item floatingLabel style={{flex:0, marginTop:this.props.style.PageSize.height*.035}}>
              <Label style={{color:"#FFF"}}>{context.Account}</Label>
              <Input 
                style          ={{color:"#FFF"}} 
                selectionColor ={"#FFF"} 
                onChangeText   = {(text)=>{
                 this.props.setAccountType();   // 輸入的過程中，清除帳號類型的狀態
                 this.setState({ account:text , password:"" }); 
               }}
                value         = {this.state.account}
                returnKeyType = {"done"}
              />
              <Icon name='person' style={{color:"#FFF"}} />
            </Item>
            
            {/*判斷賬號類型-賬號輸入*/}
            {/*顯示密碼 or 下一步按鈕*/}
            { (this.props.Login.checkAccType != null) ?
              <Item floatingLabel style={{marginTop:this.props.style.PageSize.height*.035}}>
                <Label style={{color:"#FFF"}}>{context.Password}</Label>
                <Input 
                  style           = {{color:"#FFF"}} 
                  secureTextEntry = { this.state.isLockEyeOpen ? false : true } 
                  selectionColor  = { "#FFF" }
                  onChangeText    = { text => this.setState({ password:text }) }
                  value           = { this.state.password }
                  returnKeyType   = { "done" }
                />
                <Icon name={ this.state.isLockEyeOpen ? "eye-outline": "eye-off-outline" } style={{color:"#FFF"}} onPress={()=>{
                  this.setState({isLockEyeOpen: !this.state.isLockEyeOpen});
                }}/>
              </Item>
              :
              <Body style={{flexDirection:'row',marginTop:this.props.style.PageSize.height*.08}}>
                  <Button bordered light 
                    style   = {{flex:1,justifyContent:'center'}}
                    onPress = {() => this.props.checkBySingle(this.state.account)}                        
                  >
                    {
                      (this.props.Login.checkloading) ?
                        <Spinner color='white'/>
                      :
                        <Text>{context.Next}</Text>
                    }
                  </Button>
              </Body>
            }
            
            {/*密碼提示 FOR AD */}
            {( this.props.Login.checkAccType == "AD" ) ?
              <Body style={{flexDirection:'row',marginTop:this.props.style.PageSize.height*.035}}>
                <Text 
                  style={{width:"100%",color:"#FFF"}}
                  onPress = {()=>this.props.forgetPassword("AD", this.state.account)}
                  >
                  {context.ForgetPassword}
                </Text>
              </Body>
              :
              null
            }

            {/*密碼提示 FOR EMPID */}
            {/*當EMPID屬於預設密碼密碼登入，由this.props.Login.isReset判斷是否顯示“忘記密碼”欄位 */}
            {( this.props.Login.checkAccType == "EMPID" && this.props.Login.is_EMPID_ForgetPwd_Show) ?
              <Body style={{flexDirection:'row',marginTop:this.props.style.PageSize.height*.035}}>
                <Text 
                  style={{width:"100%",color:"#FFF"}}
                  onPress = {()=>{
                    this.props.forgetPassword("EMPID", this.state.account);
                    this.setState({ password:"" });
                  }}
                >
                  {context.ForgetPassword}
                </Text>
              </Body>
              :
              null
            }
            

            {/*登陸按鈕 FOR AD&EMPID */}
            {(this.props.Login.checkAccType!=null)?
              <Body style={{ alignItems:"flex-start",flex:0, justifyContent:"center",flexDirection:'row', marginTop:this.props.style.PageSize.height*.08}}>
                <Button bordered light 
                  style   = {{width:"80%", alignItems:"center", justifyContent:"center"}}
                  onPress = {() => {
                    this.props.loginByMix(this.state.account, this.state.password);
                    this.setState({ password:"" });
                  }}
                >
                  {
                    ( this.props.Login.loginPageMasking ) ?
                      <Spinner color='white'/>
                    :
                      <Text>{context.LoginButton}</Text>
                  }
                </Button>
              </Body>
              :
              null
            }

        </Body>   
      </View>
    );

    return mix;
	}
}

let LoginSingleItemStyle = connectStyle( 'Page.LoginPage', {} )(LoginSingleItem);
export default connect(
  (state) => ({...state})
)(LoginSingleItemStyle);