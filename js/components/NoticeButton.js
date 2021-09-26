import React,{PureComponent } from 'react';
import { Icon, Text, Card, CardItem, Left, Right, Body } from 'native-base';

export default class NoticeButton extends PureComponent{
	constructor(props) {
	  super(props);
	}

	render(){
		let cardItem = (
			<CardItem button onPress={this.props.onPress}>
				<Body>
					<Text style={[{alignSelf: 'flex-start'}]} numberOfLines={1} >{this.props.title}</Text>
					<Text style={{alignSelf: 'flex-start'}} note>{this.props.time}</Text>
				</Body>
				<Right style={{flex: 0}}>
					<Icon name='arrow-forward'/>
				</Right>
			</CardItem>
		);

		if (this.props.FindPageFilterItem === undefined) {
			return cardItem;
		} else if(this.props.FindPageFilterItem){
			return cardItem;
		}
		else {
			return (
				<Card style={{alignSelf: 'center'}}>
					{cardItem}
				</Card>
			)
		}
	}
}