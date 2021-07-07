import React, { Component } from 'react';
import { View } from 'react-native';
import {Card, CardItem, Left, Body, Right, Icon, Text, Button, connectStyle, Thumbnail, Title, Label } from 'native-base';

class MeetingItemForPerson extends Component {
	constructor(props) {
		super(props);
	}

	render() {

		let startDate, startTime, endDate, endTime;
		let startDateTime = this.props.data.startdate.split(" ");
		let endDateTime   = this.props.data.enddate.split(" ");

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
								<Title style={{alignSelf: 'flex-start'}}> {`${this.props.name} ${this.props.lang.haveaMeeting}`}</Title>
							</View>
						</View>
						<View style={{
							width         : '100%', 
							marginLeft: 7
						}}>
						<Text style={{flex:0, marginRight: 0}}>{meetingTime}</Text>
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

