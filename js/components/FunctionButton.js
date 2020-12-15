import React, { Component } from 'react';
import { Platform } from 'react-native';
import { Body, Icon, Button, Text, Title } from 'native-base';
import { connect } from 'react-redux';

class FunctionButton extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let iconParmas = (this.props.functionInfo.ID != "SPACE") ? this.props.functionInfo.ICON.split(',') : [null,null,null];
		let functionName = this.props.functionInfo.NAME, 
		icon = iconParmas[0], 
		color = iconParmas[1], 
		backgroundColor = iconParmas[2], //功能鍵的名稱、圖片、按鈕顏色
		iconType = iconParmas[3] ? iconParmas[3] : "Ionicons";
		let isDarkMode = this.props.state.Theme.themeType == "dark" ? true: false;

		if(icon){
			return(
				<Body style={{alignItems: 'center'}} > 
					<Button 
				    	rounded 
						onPress={() => { this.props.onPress() }} 
				    	style={{
							alignSelf      : 'center',
							height         : 60,
							width          : 60, 
							backgroundColor: backgroundColor, 
							alignItems     : 'center', 
							justifyContent : 'center' 
				    	}}
				    >
					  <Icon name={icon} style={{color:color}} type={iconType}/>
					</Button>
					<Text style={{color:isDarkMode ? backgroundColor:color}}>{functionName}</Text>
				</Body>
			)
		}else{
			return(
				<Body style={{alignItems: 'center'}} /> 
			)
		}
	}
}

export default connect(
  (state) => ({
    state: {...state}
  })
)(FunctionButton);