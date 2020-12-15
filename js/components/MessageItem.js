import React,{Component} from 'react';
import { View, ImageBackground,  } from 'react-native';
import { Card, CardItem, Left, Thumbnail, Body, Right, Icon, Text } from 'native-base';

export default class MessageItem extends Component{
	constructor(props) {
	  super(props);
	}

	render(){
		let cardItem = (
			<CardItem button onPress={this.props.onPress}>
			  <Left>
				{/*
			    <Thumbnail source={require("../image/user.png")} style={{alignSelf: 'flex-start'}}/>
			    */}
			    <ImageBackground 
			    	source={require("../image/user.png")} 
			    	imageStyle={{ borderRadius: 25 }}
			    	style={{
			    		width: 50, 
			    		height: 50, 
			    		alignItems: 'flex-end', 
			    		justifyContent: 'flex-end'
			    	}} 
			    >
			    	{
			    		(this.props.data.ISREAD == "F")?
					    	<View style={{
					    		width: 10, 
					    		height: 10, 
					    		borderWidth: 0, 
					    		borderRadius: 50, 
					    		backgroundColor: '#ed1727'
					    	}} />
			    		:
				    		null
			    	}
			    </ImageBackground>
			    <Body>
			    	<Body style={{flexDirection: 'row', width:"100%"}}>
			    		<Body style={{flex:1, alignItems: 'flex-start'}}>
			      			<Text ellipsizeMode="tail" numberOfLines={1}>{this.props.data.TITLE}</Text>
			    		</Body>
			    		<Body style={{alignItems: 'flex-end', flex:0}}>
			      			<Text note>{this.props.data.TXDAT.split(" ")[0]}</Text>
			      		</Body>
			    	</Body>
			      <Text note ellipsizeMode="tail" numberOfLines={3}>{this.props.data.CONTENT}</Text>
			    </Body>

			  </Left>
			</CardItem>
		);

		if (this.props.FindPageFilterItem) {
			return cardItem;
		} else {
			return(
				<Card style={{alignSelf: 'center'}}>
					{cardItem}
				</Card>
			);
		}


	}
}