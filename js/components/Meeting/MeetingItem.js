import React, { Component } from 'react';
import { View } from 'react-native';
import {Card, CardItem, Left, Body, Right, Icon, Text, Button, connectStyle, Thumbnail, Title, Label } from 'native-base';

class MeetingItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let image, imageText = this.props.data.meetingMode;
		// 缺丁丁跟微軟
		switch(imageText) {
		  case "M":
		    image = require("../../image/meeting/Team.png");
		    imageText = "Teams";
		    break;
		  case "D":
		    image = require("../../image/meeting/Ding.png");
		    imageText = "釘釘";
		    break;
		  case "S":
		    image = require("../../image/meeting/Skype.png");
		    imageText = "Skype";
		    break;
		  case "T":
		    image = require("../../image/meeting/Tencent.png");
		    imageText = "騰訊會議";
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

		let startDate, startTime, endDate, endTime;
		let startDateTime = this.props.data.startdate.split(" ");
		let endDateTime = this.props.data.enddate.split(" ");

		let isCrossDate = startDateTime[0] == endDateTime[0]? false: true;

		startDate = startDateTime[0].split("-");
		startTime = startDateTime[1].split(":");
		endDate = endDateTime[0].split("-");
		endTime = endDateTime[1].split(":");

		startDate[1] = startDate[1].indexOf('0') == 0 ? startDate[1].replace('0', ''): startDate[1];
		startDate[2] = startDate[2].indexOf('0') == 0 ? startDate[2].replace('0', ''): startDate[2];
		endDate[1] = endDate[1].indexOf('0') == 0 ? endDate[1].replace('0', ''): endDate[1];
		endDate[2] = endDate[2].indexOf('0') == 0 ? endDate[2].replace('0', ''): endDate[2];

		let meetingTime = "";

		if (isCrossDate) {
			meetingTime= `${startDate[1]}/${startDate[2]} ${startTime[0]}:${startTime[1]} - ${endDate[1]}/${endDate[2]} ${endTime[0]}:${endTime[1]}`;
		} else {
			meetingTime = `${startTime[0]}:${startTime[1]} - ${endTime[0]}:${endTime[1]}`;
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
							<Text style={{flex:0, marginRight: 0}}>{meetingTime}</Text>
						</View>
						<View style={{
							width         : '100%', 
							marginLeft: 7
						}}>
							<Label>{this.props.lang.chairperson}：{this.props.data.chairperson.name}</Label>
							<Label>{this.props.lang.attendees}：{attendeesString}</Label>
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

