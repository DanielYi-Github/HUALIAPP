import React, { Component } from 'react';
import {Card, CardItem, Body, Icon, Text, Label } from 'native-base';

export default class MeetingTimeSuggestItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Card style={{alignSelf: 'center'}}>
			  <CardItem button onPress={this.props.onPress}
			  	style={{flexDirection: 'column', alignContent: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#03A9F4'}}>
			  	<Body style={{flexDirection: 'row', padding: 10}}>
				    <Body style={{flex:1, alignItems: 'center'}}>
				        <Text>{"9:45"}</Text>
				    </Body>
				    <Body style={{flex:1, alignItems: 'center'}}>
				        <Text>{" - "}</Text>
				    </Body>
				    <Body style={{flex:1, alignItems: 'center'}}>
				        <Text>{"10:45"}</Text>
				    </Body>
			    </Body>
			    <Body style={{flex:1, alignContent: 'center', justifyContent: 'center', borderWidth: 0}}>
			    	<Label style={{alignSelf: 'center'}}>{"此段時間各位都有空"}</Label>
			    </Body>
			  </CardItem>
			</Card>
		);
	}

}
