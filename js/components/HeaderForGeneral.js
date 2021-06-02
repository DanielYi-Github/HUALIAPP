import React, { Component } from 'react';
import { Platform, View, Dimensions } from 'react-native';
import { Left, Body, Right, Icon, Text, Button, Title, Header, Item, Input, connectStyle } from 'native-base';

class HeaderForGeneral extends Component {
	constructor(props) {
		super(props);
		this.state = {
			iosPlatform : Platform.OS === "ios" ? true : false,
			isTransparent : (typeof props.isTransparent == "undefined") ? null : props.isTransparent,
            isMiddleTitle : (typeof props.isMiddleTitle == "undefined") ? false : props.isMiddleTitle,
		}
	}

	render() {
		let header = null;
		let leftButton = (<Button transparent/>);  // 預設給定一個button來支撐高度
		let rightButton = (<Button transparent/>); // 預設給定一個button來支撐高度

		if (this.props.isLeftButtonIconShow) {
			leftButton = (
				<Button transparent onPress={this.props.leftButtonOnPress}>
				  <Icon 
				  	name={this.props.leftButtonIcon.name} 
				  	style = {{color: (this.state.isTransparent) ? this.props.style.colorForTransparent :this.props.style.color}}
				  />
				</Button>
			);
		}

		if (this.props.isRightButtonIconShow) {
			rightButton = (
				<Button transparent onPress={this.props.rightButtonOnPress}>
				  <Icon 
				  	name={this.props.rightButtonIcon.name} 
				  	style = {{color: (this.state.isTransparent) ? this.props.style.colorForTransparent :this.props.style.color}}
				  />
				</Button>
			);
		}

		let title = (
			<Title style = {{
					color: (this.state.isTransparent) ? this.props.style.colorForTransparent :this.props.style.color,
					// width: Platform.OS === "ios" ? Dimensions.get('window').width-200 : null
				}}>
				{this.props.title}
			</Title>
		);

		
		if (this.state.iosPlatform) {
			if (this.state.isTransparent) {
				header = (
					<Header transparent noShadow style={this.props.style.HeaderBackgroundWithTransparent}>
					  <Left >
					  	{leftButton}
					  </Left>
					  <Body style={{flex:0}}>
					  	{title}
					  </Body>
					  <Right >
					  	{rightButton}
					  </Right>
					</Header>
				)
			} else {
				header = (
					<View>
					<Header style={this.props.style.HeaderBackground} rounded>
					  <Left >
					  	{leftButton}
					  </Left>
					  <Body>
					  	{title}
					  </Body>
					  <Right >
					  	{rightButton}
					  </Right>
					</Header>
					</View>
				);
			}
		} else {
			let titleWhere = null;
			if (this.state.isMiddleTitle) {
				titleWhere = (
					<Body style={{alignItems: 'center' }}>
						{title}
					</Body>
				);
			} else {
				titleWhere = (
					<Body>
						{title}
					</Body>
				);
			}

			if (this.state.isTransparent) {
				header = (
					<View>
					  <Header noShadow style={{backgroundColor:'rgba(255,255,255,0)'}}>
					    <Left >
					    	{leftButton}
					    </Left>
					    {titleWhere}
					    <Right >
					    	{rightButton}
					    </Right>
					  </Header>
					</View>
				);
			}else{
				header = (
					<Header rounded style={this.props.style.HeaderBackground} >
					  <Left>
					  	{leftButton}
					  </Left>
					  {titleWhere}
					  <Right>
					  	{rightButton}
					  </Right>
					</Header>
				);
			}
		}
		

		return header;
	}
}

export default connectStyle( 'Component.HeaderForGeneral', {} )(HeaderForGeneral);