import React, { Component } from 'react';
import { Button, Text, Icon, connectStyle } from 'native-base';

class FormContentGridForEvaluationButton extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let icon, iconId = this.props.iconId;
		switch(iconId) {
		  case "loadLastScore": 
		  	// 載入前期分數
		  	icon = "cloud-download-outline";
		    break;
		  case "sort": 
		  	//排序
		  	icon = "swap-vertical-outline";
		    break;
		  default:
		  	icon = "alert-outline";
		}

		return (
	    	<Button 
	    		Danger
	    		iconLeft 
	    		bordered
	    		onPress = {this.props.onPress} 
	    		style={{
					height       : null,
					paddingTop   : 4,
					paddingBottom: 4,
					padding      : 8,
					marginRight  : 5,
					marginBottom : 15, 
	    		}}
	    	>
				<Icon 
					name={icon}
					style={{
						marginLeft: null,
						paddingLeft: null,
						paddingRight: 4,
						fontSize: 16
					}} 
				/>
	            <Text
	            	style={{
	            		paddingLeft: null,
						paddingRight: null,
						fontSize: 14
	            	}} 
	            >
	            {this.props.label}
	            </Text>
	        </Button>
		);
	}
}

export default connectStyle( 'Component.FormContent', {} )(FormContentGridForEvaluationButton);
