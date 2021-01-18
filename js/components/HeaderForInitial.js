import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import { Left, Body, Right, Icon, Text, Button, Title, Header, connectStyle } from 'native-base';

class HeaderForInitial extends Component {
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
		let rightButton_lang = null;

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
			rightButton_lang = (
				<Button transparent onPress={this.props.rightButtonOnPress_lang}>
				  <Icon 
				  	// name={this.props.rightButtonIcon.name} 
				  	style = {{color: (this.state.isTransparent) ? this.props.style.colorForTransparent :this.props.style.color}}
				  	name='translate' 
				  	type='MaterialIcons'
				  />
				</Button>
			);

		let title = (
			<Title style = {{color: (this.state.isTransparent) ? this.props.style.colorForTransparent :this.props.style.color}}>
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
					<Header rounded style={this.props.style.HeaderBackground}>
					  <Left>
					  	{leftButton}
					  </Left>
					  <Body style={{flex:0}}>
					  	{title}
					  </Body>
					  <Right>
					  	{rightButton_lang}
					  	{rightButton}
					  </Right>
					</Header>
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
					<Header rounded style={this.props.style.HeaderBackground}>
					  <Left>
					  	{leftButton}
					  </Left>
					  {titleWhere}
					  <Right>
					  	{rightButton_lang}
					  	{rightButton}
					  </Right>
					</Header>
				);
			}
		}

		return header;
	}
}

export default connectStyle( 'Component.HeaderForGeneral', {} )(HeaderForInitial);