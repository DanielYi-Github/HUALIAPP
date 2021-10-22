import React, { Component } from 'react';
import { View, Platform, ActivityIndicator } from 'react-native';
import {Card, CardItem, Left, Body, Right, Icon, Text, Button, connectStyle, Thumbnail, Title, Label, Item } from 'native-base';
import CheckBox from '@react-native-community/checkbox';


class MeetingItemForOrgnize extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let checked = this.props.checked;
		let included = this.props.included;
		let checkBoxColor = this.props.checkBoxColor;
		let item = this.props.item;

		return (
		  <Item 
		    fixedLabel 
		    style   ={{paddingLeft: 10, paddingRight: 5, backgroundColor: this.props.style.InputFieldBackground}} 
		    onPress ={ async ()=>{ 
			  this.props.itemOnPress(item);
		    }} 
		  >
		    <CheckBox
				disabled      ={ Platform.OS == "android" ? false : true }
		        onValueChange={(newValue) => {
					if (Platform.OS == "android") this.props.itemOnPress(item);
		        }}
		        value        ={checked || included}
		        boxType      ={"square"}
		        onCheckColor ={checkBoxColor}
		        onTintColor  ={checkBoxColor}
          		tintColors    ={{true: checkBoxColor, false: '#aaaaaa'}}
		        style        ={{ marginRight: 20 }}
		        animationDuration = {0.01}
		      />
		    <Label>{item.name} </Label>

		    <ActivityIndicator 
		    	animating={this.props.loading}
		    	color     ={this.props.style.SpinnerColor}
		    	style     ={{marginRight: 10}}
		    />
		    <Icon 
		      style ={{borderWidth: 0, padding: 10, paddingRight: 10}}
		      name  ='arrow-forward'
		      onPress={()=>this.props.onItemNextIconPress(item)}
		    />
		  </Item>
		);
	}

}

export default connectStyle( 'Page.MeetingPage', {} )(MeetingItemForOrgnize);

