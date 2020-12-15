import React, { Component } from 'react';
import {Card, CardItem, Body, Icon, Text, Thumbnail, connectStyle} from 'native-base';

class ExplainCardItem extends Component {
	constructor(props) {
		super(props);
		let iconIsImage = this.props.style.ExplainIcon.iconIsImage ? true : false 
		let icomImage = `icon${Math.floor(Math.random()*6)+1}`; //回傳0或5
		this.state = {
			iconIsImage: iconIsImage,
			iconImage : iconIsImage ? this.props.style.ExplainIcon[icomImage] : null 
		}
	}

	render() {
		if (this.state.iconIsImage) {
			return (
				<CardItem header style={this.props.itemStyle}>
        		  <Thumbnail square small style={{marginRight: 5}} source={this.state.iconImage}/>
				  <Text style={this.props.style.ExplainText}>{this.props.text}</Text>
				</CardItem>
			);
		} else {
			return (
				<CardItem header style={this.props.itemStyle}>
				  <Icon style={this.props.style.ExplainText} name={this.props.iconName}/>
				  <Text style={this.props.style.ExplainText}>{this.props.text}</Text>
				</CardItem>
			);
		}
	}

}

export default connectStyle( 'Component.ExplainCardItem', {} )(ExplainCardItem);
