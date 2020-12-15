import React, { Component } from 'react';
import { Icon, Left, Body, Right, Title, Text, CardItem, Label } from 'native-base';

export default class PersonItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (this.props.isButton) {
			return(
				<CardItem button onPress={this.props.onPress}>
				  <Left style={{justifyContent: 'center'}}>
				    <Icon name={this.props.icon}/>
				  </Left>
				  <Body style={{flex: 6, flexDirection: 'row'}}>
				  	<Body style={{flex: 2, alignItems: 'flex-start'}}>
				  	  <Title>{this.props.title}</Title>
				  	</Body>
				  	<Body style={{flex: 4, alignItems: 'flex-start'}}>
				  	  <Label selectable>{this.props.value}</Label>
				  	</Body>
				  </Body>
				  <Right style={{flex: 0}}>
				    <Icon name="arrow-forward"/>
				  </Right>
				</CardItem>
			);
		} else {
			return(
				<CardItem>
				  <Left style={{justifyContent: 'center'}}>
				    <Icon name={this.props.icon}/>
				  </Left>
				  <Body style={{flex: 6, flexDirection: 'row'}}>
				  	<Body style={{flex: 2, alignItems: 'flex-start'}}>
				  	  <Title>{this.props.title}</Title>
				  	</Body>
				  	<Body style={{flex: 4, alignItems: 'flex-start'}}>
				  	  <Label selectable>{this.props.value}</Label>
				  	</Body>
				  </Body>
				  <Right style={{flex: 0}}>
				    
				  </Right>
				</CardItem>
			);
		}
	}
}