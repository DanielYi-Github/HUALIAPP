import React, { Component } from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { Body, Icon, Button, Text, Title } from 'native-base';
import { connect } from 'react-redux';

class TinyCircleButton extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(
			<TouchableOpacity 
			  style={{
				backgroundColor: 'rgba(0,0,0,0)', 
				paddingLeft    : 9, 
				paddingRight   : 9,
				paddingTop     : 5,
				paddingBottom  : 5, 
				marginBottom   : 5,
				borderRadius   : 10,
				borderColor    : this.props.color,
				borderWidth    : 2
			  }}
			  onPress={this.props.onPress}
			>
			  <Text style={{color: this.props.color}}>{this.props.text}</Text>
			</TouchableOpacity>
		)
	}
}

export default connect(
  (state) => ({
    state: {...state}
  })
)(TinyCircleButton);