import React, { Component } from 'react';
import { Button, Text, Icon, connectStyle } from 'native-base';

class FormContentGridForEvaluationButton extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
	    	<Button 
	    		iconLeft 
	    		bordered
	    		onPress = {this.props.onPress} 
	    		style={{
	    			height: null,
	    			paddingTop: 4,
	    			paddingBottom: 4,
	    			padding: 8,
	    			marginRight: 5
	    		}}
	    	>
				<Icon 
					name='cloud-download-outline'
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
