import React, { Component } from 'react';
import { NavigationContainer, useRoute, useNavigationState } from '@react-navigation/native';
import { Container, Header, Left, Content, Body, Right, Item, Input, Button, Icon, Title, Text, Card, CardItem, Label, Footer, connectStyle } from 'native-base';
import { View, FlatList, RefreshControl, VirtualizedList, Platform, Alert, Keyboard, TouchableOpacity } from 'react-native';
import * as NavigationService from '../../utils/NavigationService';

class MeetingSelectAttendeesFooter extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Footer>
			  <Body>
			    <Text onPress={ this.props.onPress } style={{marginLeft: 15}}>
			    	{`${this.props.lang.MeetingPage.selected} ${this.props.selectNumber} ${this.props.lang.MeetingPage.person}`}
			    </Text>
			    <Icon onPress={ this.props.onPress } name={"chevron-up-outline"} />
			  </Body>
			  <Right>
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

