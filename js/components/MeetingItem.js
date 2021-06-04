import React, { Component } from 'react';
import { View } from 'react-native';
import {Card, CardItem, Left, Body, Right, Icon, Text, Button, connectStyle, Thumbnail, Title, Label } from 'native-base';

class MeetingItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let image, imageText = "meeting"
		switch(imageText) {
		  case "MicrosoftLync":
		    image = require("../image/meeting/MicrosoftLync.png");
		    break;
		  case "Skype":
		    image = require("../image/meeting/Skype.png");
		    break;
		  case "Tencent":
		    image = require("../image/meeting/Tencent.png");
		    break;
		  case "WeChart":
		    image = require("../image/meeting/WeChart.png");
		    break;
		  case "Zoom":
		    image = require("../image/meeting/Zoom.png");
		    break;
		  default:
		    image = require("../image/meeting/meeting.png");
		}

		let cardItem = (
				<CardItem button onPress={this.props.onPress}>				
				    <Left style={{flex:0.25, flexDirection: 'column', borderWidth: 0}}> 
	    			    <Thumbnail square source={ image } />
	    			    <Label style={{fontSize: 12}}>{"一樓會議室"}</Label>
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
								<Title style={{alignSelf: 'flex-start'}}> {this.props.item}</Title>
							</View>
							<Text note style={{flex:0, marginRight: 0}}>{"10:00-11:00"}</Text>
						</View>
						<View>
							<Text note>會議主席：</Text>
							<Text note>參與人：</Text>
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

