import React, { Component } from 'react';
import {Card, CardItem, Body, Icon, Text } from 'native-base';

export default class NoMoreItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Card style={{alignSelf: 'center'}}>
			  <CardItem>
			    <Body style={{flex:1, alignItems: 'center'}}>
			        <Text>{this.props.text}</Text>
			    </Body>
			  </CardItem>
			</Card>
		);
	}

}
