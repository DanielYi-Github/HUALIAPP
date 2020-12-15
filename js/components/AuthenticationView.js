import React, { Component } from 'react';
import { View, Modal, Platform, Keyboard} from 'react-native';
import {Container, Spinner, Icon, Text, Button, connectStyle, Body, Form, Item, Label, Input, Content, Title} from 'native-base';
import ReactNativeBiometrics from 'react-native-biometrics';

import { connect }           from 'react-redux';
import { bindActionCreators }from 'redux';
import * as CommonAction     from '../redux/actions/CommonAction';
import HeaderForGeneral      from './HeaderForGeneral';
import Common                from '../utils/Common';

class AuthenticationView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isBioAuthentication: props.state.Biometric.isServerExist,
			originalvertifyMode: props.state.Biometric.biosType,
			vertifyMode        : props.state.Biometric.biosType, // "", TouchID, FaceID, Biometrics 
			vertifyModeImage   : {
				type:"MaterialCommunityIcons",
				name:"face"
			},
			password : "",
			isShowPasswordError:false,
			isShowPasswordErrorMessage:""
		}
	}

	componentDidMount(){
		if (this.state.isBioAuthentication && this.state.originalvertifyMode !== "") {
			setTimeout(()=>{
			  this.confirm();
			},200);
		}
	}

	render() {
		let type, name;
		if (this.state.isBioAuthentication) {
			switch(this.state.vertifyMode) {
			  case "FaceID":
			  	type = "MaterialCommunityIcons";
			  	name = "face-recognition";
			  	break;
			  case "TouchID":
			  	type = "Ionicons";
			  	name = "ios-finger-print";
			  	break;
			  case "Biometrics":
			  	type = "FontAwesome5";
			  	name = "user-shield";
			    break;
			  default:
			    type = "Ionicons";
			    name = "lock-closed-sharp";
			} 
		} else {
			type = "Ionicons";
			name =  "lock-closed-sharp";
		}

		let passwordMode = (
			<Content contentContainerStyle={{paddingTop: 35, paddingLeft:"5%", paddingRight:"5%", alignItems: 'center'}}>
				<Icon type={type} name={name}style={{fontSize: 200}}/>
	            <Form style={{ width: "100%" }}>
	              <Body style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
	                <Icon 
	                	name={"lock-closed-sharp"} 
	                	style={{color:this.props.style.inputWithoutCardBg.inputColor}}
	                />
	                <Label style={{marginLeft: 5, color:this.props.style.inputWithoutCardBg.inputColor}}>
	                	{this.props.state.Language.lang.AuthenticationView.passwordVertify}
	                </Label>
	              </Body>
	              <Item style= {{marginLeft: 0}}>
	                <Input 
						placeholder          = {this.props.state.Language.lang.AuthenticationView.loginPassword}
						onChangeText 		 = {(text)=>{
													this.setState({
														password:text,
														isShowPasswordError:false
													});
												}}
						placeholderTextColor = {this.props.style.inputWithoutCardBg.inputColorPlaceholder}
						multiline            = {false}
						style                = {{color:this.props.style.inputWithoutCardBg.inputColor}}
						secureTextEntry      = {true} 
	                />
	              </Item>
	            </Form>

	            <Button block info 
	              style={{width:"70%", alignSelf: 'center', marginTop:40}} 
	              onPress = {this.confirm} 
	            >
	                <Text>{this.props.state.Language.lang.Common.Comfirm}</Text>
	            </Button>
	            {
	            	(this.state.isBioAuthentication) ?
	            		<Text
							style   = {{marginTop:35}} 
							onPress = {()=>{this.setState({vertifyMode:this.state.originalvertifyMode});}}
	            		>
	            			{this.props.state.Language.lang.AuthenticationView.useBiosAuth}
	            		</Text>	
	            	:	
	            		null
	            }

	            {
	            	(this.state.isShowPasswordError) ? 
	            		<Title style={{
	            			marginTop:20,
	            			color:"red"
	            		}}>
	            			{this.state.isShowPasswordErrorMessage}
	            		</Title>
	            	:
	            		null	
	            }

	            
	        </Content>
		);

		let bioAuthMode = (
			<Content contentContainerStyle={{paddingTop: 35, paddingLeft:"5%", paddingRight:"5%", alignItems: 'center'}}>
				<Icon 
					type={type} 
					name={name}
					style={{fontSize: 200}}
				/>
	            <Button block info 
	              style={{width:"70%", alignSelf: 'center', marginTop:40}} 
	              onPress = {this.confirm} 
	             >
				    <Text>{this.props.state.Language.lang.AuthenticationView.hitToVertify}</Text>
	            </Button>
	            {
	            	(this.state.isBioAuthentication) ?
	            		<Text
	            			style = {{marginTop:35}} 
	            			onPress={()=>{this.setState({vertifyMode:""});}}
	            		>
	            			{this.props.state.Language.lang.AuthenticationView.usePassword}
	            		</Text>	
	            	:	
	            		null
	            }
	        </Content>
		);

		let authenticationMethod = passwordMode;
		if (this.state.isBioAuthentication) {
			authenticationMethod = ( this.state.vertifyMode == "" ) ? passwordMode: bioAuthMode; 
		}else{
			authenticationMethod = passwordMode;
		}
		return (
		  <View style={{ flex: 1 }}>
	          <Container>
	            <HeaderForGeneral
	              isLeftButtonIconShow  = {true}
	              leftButtonIcon        = {{name:"close"}}
	              // leftButtonOnPress     = {() => this.props.actions.closeAuthentication()} 
	              leftButtonOnPress     = {() => {
	              	this.props.actions.closeAuthentication()	
	              	this.props.navigation.pop()
	              }} 
	              // leftButtonOnPress     = {() => } 
	              isRightButtonIconShow = {false}
	              rightButtonIcon       = {null}
	              rightButtonOnPress    = {null} 
	              title                 = {this.props.state.Language.lang.AuthenticationView.Vertify}
	              isTransparent         = {false}
	            />
	            	{authenticationMethod}
	          </Container>
		  </View>
		)
	}

	confirm = () => {
		Keyboard.dismiss();
		let optionalConfigObject = {
			title                 : this.props.state.Language.lang.AuthenticationView.BiosAuth, 			// Android
			imageColor            : '#e00606', 			// Android
			imageErrorColor       : '#ff0000', 			// Android
			sensorDescription     : 'Touch sensor', 	// Android
			sensorErrorDescription: this.props.state.Language.lang.AuthenticationView.sensorErrorDescription, 			// Android
			cancelText            : this.props.state.Language.lang.AuthenticationView.cancelText, 				// Android
			fallbackLabel         : 'Show Passcode', 	// iOS (if empty, then label is hidden)
			unifiedErrors         : false, 				// use unified error messages (default false)
			passcodeFallback      : false, 				// iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
		};

		if (this.state.isBioAuthentication) {
			switch(this.state.vertifyMode) {
			  case "FaceID":
			  case "TouchID":
			  case "Biometrics":
			  	// 使用react-native-biometrics
			  	ReactNativeBiometrics.simplePrompt({promptMessage: this.props.state.Language.lang.AuthenticationView.promptMessage}).then((resultObject) => {
			  	    if (resultObject.success) {
			  			this.props.actions.authenticateApprove();
			  			setTimeout(()=>{
			  				this.props.navigation.pop();
			  			},500);
			  	    }else{
			  	    	console.log("面部辨識失敗", resultObject.error);
			  	    }
			  	}).catch((err) => {
			  	    console.log("面部辨識失敗", err);
			  	})
			    break;
			  default:
			  	let isNull = this.isNull(this.state.password);
			  	if (isNull) {
			  		this.setState({
			  			isShowPasswordError:true,
			  			isShowPasswordErrorMessage:this.props.state.Language.lang.AuthenticationView.PwdNotNull
			  		});
			  		
			  	} else {
			  		let isPass = this.checkPassword(this.state.password);
			  		if (isPass) {
			  			this.props.actions.authenticateApprove();
			  			setTimeout(()=>{
			  				this.props.navigation.pop();
			  			},500);
			  		} else {
			  			this.setState({
			  				isShowPasswordError:true,
			  				isShowPasswordErrorMessage:this.props.state.Language.lang.AuthenticationView.PasswordError
			  			});
			  			
			  		}	
			  	}
			}
		} else {
			let isNull = this.isNull(this.state.password);
			if (isNull) {
				this.setState({
					isShowPasswordError:true,
					isShowPasswordErrorMessage:this.props.state.Language.lang.AuthenticationView.PwdNotNull
				});
				
			} else {
				let isPass = this.checkPassword(this.state.password);
				if (isPass) {
					this.props.actions.authenticateApprove();
					setTimeout(()=>{
						this.props.navigation.pop();
					},500);
				} else {
					this.setState({
						isShowPasswordError:true,
						isShowPasswordErrorMessage:this.props.state.Language.lang.AuthenticationView.PasswordError
					});
					
				}	
			}
		}
	}

	isNull( str ){
		if ( str == "" ) return true;
		return false;
	}

	checkPassword = (str) => {
		if (this.props.state.UserInfo.UserInfo.password == Common.encrypt(str)) {
			return true;
		} else {
			return false;
		}
	}
}

export let AuthenticationViewStyle = connectStyle( 'Component.AuthenticationView', {} )(AuthenticationView);

export default connect(
  (state) => ({
    state: {...state}
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...CommonAction,
    }, dispatch)
  })
)(AuthenticationViewStyle);


