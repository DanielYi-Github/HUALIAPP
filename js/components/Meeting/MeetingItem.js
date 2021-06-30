import React, { Component } from 'react';
import { View } from 'react-native';
import {Card, CardItem, Left, Body, Right, Icon, Text, Button, connectStyle, Thumbnail, Title, Label } from 'native-base';
import DateFormat from  'dateformat';

class MeetingItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let image, imageText = this.props.data.meetingMode;
		switch(imageText) {
		  case "M":
		    image = require("../../image/meeting/MicrosoftLync.png");
		    imageText = "MicrosoftLync";
		    break;
		  case "S":
		    image = require("../../image/meeting/Skype.png");
		    imageText = "Skype";
		    break;
		  case "T":
		    image = require("../../image/meeting/Tencent.png");
		    imageText = "Tencent";
		    break;
		  case "W":
		    image = require("../../image/meeting/WeChart.png");
		    imageText = "WeChart";
		    break;
		  case "Z":
		    image = require("../../image/meeting/Zoom.png");
		    imageText = "Zoom";
		    break;
		  default:
		    image = require("../../image/meeting/meeting.png");
		    imageText = this.props.data.meetingPlace;
		}

		// 整理參加人員
		let attendeesString = "";
		for(let attendee of this.props.data.attendees){
			if (attendeesString.length == 0) {
				attendeesString = attendee.name;  
			} else {
				attendeesString = `${attendeesString}、${attendee.name}`
			}
		}

		let cardItem = (
				<CardItem button onPress={this.props.onPress}>				
				    <Left style={{flex:0.25, flexDirection: 'column', borderWidth: 0}}> 
	    			    <Thumbnail square source={ image } />
	    			    <Label style={{fontSize: 12}}>{imageText}</Label>
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
								<Title style={{alignSelf: 'flex-start'}}> {this.props.data.subject}</Title>
							</View>
							<Text style={{flex:0, marginRight: 0}}>{this.props.data.datetime.starttime}-{this.props.data.datetime.endtime}</Text>
						</View>
						<View style={{
							width         : '100%', 
							marginLeft: 7
						}}>
							<Label>會議主席：{this.props.data.chairperson.name}</Label>
							<Label>與會人員：{attendeesString}</Label>
						</View>
					</Body>
					<Right style={{flex:0}}>
						<Icon name="arrow-forward" />
					</Right>
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

export default connectStyle( 'Page.MeetingPage', {} )(MeetingItem);

