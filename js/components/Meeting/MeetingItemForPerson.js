import React, { Component } from 'react';
import { View } from 'react-native';
import {Card, CardItem, Left, Body, Right, Icon, Text, Button, connectStyle, Thumbnail, Title, Label } from 'native-base';
import DateFormat from  'dateformat';

class MeetingItemForPerson extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let image = require("../../image/meeting/meeting.png");
		let cardItem = (
				<CardItem >				
				    <Left style={{flex:0.25, flexDirection: 'column', borderWidth: 0}}> 
	    			    <Thumbnail square source={ image } />
					</Left>
					<Body style={{paddingLeft: 5}}>
						<View style={{
							width         : '100%', 
							justifyContent: 'space-between', 
							alignItems    : 'center', 
							flexDirection : 'row',
							marginBottom: 5
						}}>
							<View style={{flex:1}}>
								<Title style={{alignSelf: 'flex-start'}}> {`${this.props.name}有一場會議`}</Title>
							</View>
						</View>
						<View style={{
							width         : '100%', 
							marginLeft: 7
						}}>
						<Text style={{flex:0, marginRight: 0}}>{this.props.data.starttime} - {this.props.data.endtime}</Text>
						</View>
					</Body>
				</CardItem>
		);


		if (this.props.FindPageFilterItem) {
			return cardItem;
		} else {
			return (
				<Card style={{alignSelf: 'center'}}>
					{cardItem}
				</Card>
			);
		}
	}

}

export default connectStyle( 'Page.MeetingPage', {} )(MeetingItemForPerson);

