import React, { Component } from 'react';
import { NavigationContainer, useRoute, useNavigationState } from '@react-navigation/native';
import { Container, Header, Left, Content, Body, Right, Item, Input, Button, Icon, Title, Text, Card, CardItem, Label, Footer, connectStyle } from 'native-base';
import { View, FlatList, RefreshControl, VirtualizedList, Platform, Alert, Keyboard, TouchableOpacity } from 'react-native';
import * as NavigationService from '../../utils/NavigationService';
import CheckBox from '@react-native-community/checkbox';

class MeetingSelectAttendeesFooter extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Footer>
				{
					this.props.showAllSelectChk ? 
					  <Item style={{borderWidth: 1, paddingLeft: 10, borderBottomWidth: 0, borderWidth: 1}}
					  	onPress ={()=>{
					  		// console.log(!this.props.allSelectChkValue);
					  		this.props.onSelectChkValueChange(!this.props.allSelectChkValue);
					  	}} 
					  >
		  			    <CheckBox
		  					disabled      ={ Platform.OS == "android" ? false : true }
		  			        onValueChange={(newValue) => {
		  						// if (Platform.OS == "android") this.props.itemOnPress(item);
		  			        }}
							value             = {this.props.allSelectChkValue}
							boxType           = {"square"}
							onCheckColor      = {"#00C853"}
							onTintColor       = {"#00C853"}
							tintColors        = {{true: "#00C853", false: '#aaaaaa'}}
							style             = {{ marginRight: 20 }}
							animationDuration = {0.01}
		  			      />
		  			    <Label>{"全選"}</Label>
					  </Item>
					:
						null
				}
			  
			  <Body style={{justifyContent: 'flex-end', paddingRight: 10 }}>
			    <Text onPress={ this.props.onPress } style={{marginLeft: 15}}>
			    	{`${this.props.lang.MeetingPage.selected} ${this.props.selectNumber} ${this.props.lang.MeetingPage.person}`}
			    </Text>
			    <Icon onPress={ this.props.onPress } name={"chevron-up-outline"} />
			  </Body>
			  <Right style={{flex: 0}}>
			    <TouchableOpacity 
			      style={{
			        backgroundColor: '#47ACF2', 
			        borderColor    : '#47ACF2',
			        borderWidth    : 1,
			        borderRadius   : 10,
			        marginRight    : 15,
			        paddingLeft    : 10, 
			        paddingRight   : 10,
			        paddingTop     : 5,
			        paddingBottom  : 5, 
			      }}
			      onPress={()=>{
			        Keyboard.dismiss();                
			        NavigationService.navigate({
			          key: this.props.MeetingInsertWithTagsPageRouterKey
			        });
			      }}
			    >
			      <Text style={{color: '#FFF'}}>{this.props.lang.CreateFormPage.Done}</Text>
			    </TouchableOpacity>
			  </Right>
			</Footer>
		);
	}

}

export default connectStyle( 'Page.MeetingPage', {} )(MeetingSelectAttendeesFooter);

