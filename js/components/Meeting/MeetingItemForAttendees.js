import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import {Card, CardItem, Left, Body, Right, Icon, Text, Button, connectStyle, Thumbnail, Title, Label, Item } from 'native-base';
import CheckBox from '@react-native-community/checkbox';


class MeetingItemForAttendees extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Item 
			  fixedLabel 
			  style   ={{paddingLeft: 10, backgroundColor: this.props.style.InputFieldBackground}} 
			  onPress ={()=>{
			  	this.props.itemOnPress(this.props.item);
			  }} 
			>
				<CheckBox
					value         ={this.props.checked}
					disabled      ={ Platform.OS == "android" ? false : true }
					onValueChange ={(newValue) => {
						if (Platform.OS == "android") this.props.itemOnPress(this.props.item);
					}}
					boxType       = {"square"}
					onCheckColor  = {"#00C853"}
					onTintColor   = {"#00C853"}
          			tintColors    ={{true: "#00C853", false: '#aaaaaa'}}
					style         ={{ marginRight: 20 }}
				/>
				<Label>{this.props.item.name} </Label><Text note>{this.props.item.depname}</Text>
				<Icon 
					name='calendar-outline'
					onPress={()=>{ this.props.calendarOnPress(this.props.item); }}
					style={{borderWidth: 0, padding: 10, paddingRight: 20}}
				/>
			</Item>
		);
	}

}

export default connectStyle( 'Page.MeetingPage', {} )(MeetingItemForAttendees);

