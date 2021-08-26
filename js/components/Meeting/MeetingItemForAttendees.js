import React, { Component } from 'react';
import { View } from 'react-native';
import {Card, CardItem, Left, Body, Right, Icon, Text, Button, connectStyle, Thumbnail, Title, Label } from 'native-base';

class MeetingItemForAttendees extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Item 
			  fixedLabel 
			  style   ={{paddingLeft: 15, backgroundColor: this.props.style.InputFieldBackground}} 
			  onPress ={ async ()=>{ 
			    let enableMeeting = await this.checkHaveMeetingTime(item.item.id, this.state.startdate, this.state.enddate);
			    if (enableMeeting) {
			      this.addTag(item.item);
			    } else {
			      Alert.alert(
			        this.props.lang.MeetingPage.alertMessage_duplicate, //"有重複"
			        `${this.props.lang.MeetingPage.alertMessage_period} ${item.item.name} ${this.props.lang.MeetingPage.alertMessage_meetingAlready}`,
			        [
			          { text: "OK", onPress: () => console.log("OK Pressed") }
			        ],
			        { cancelable: false }
			      );
			    }
			  }} 
			>
			  <Label>{item.item.name} </Label><Text note>{item.item.depname}</Text>
			  <Icon 
			    name='calendar-outline'
			    onPress={()=>{
			      //顯示此人有哪些會議
			      NavigationService.navigate("MeetingTimeForPerson", {
			        person: item.item,
			      });
			    }}
			    style={{borderWidth: 0, padding: 10, paddingRight: 20}}
			  />
			</Item>
		);
	}

}

export default connectStyle( 'Page.MeetingPage', {} )(MeetingItemForAttendees);

