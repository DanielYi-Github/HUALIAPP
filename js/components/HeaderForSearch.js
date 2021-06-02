import React, { Component } from 'react';
import {Left, Body, Right, Icon, Text, Button, connectStyle, Title, Header, Item, Input } from 'native-base';

class HeaderForSearch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isShowSearch : this.props.isShowSearch
		}
	}

	render() {
		let header = null;
		let leftButton = null;
		let rightButton = null;

		if (this.props.isLeftButtonIconShow) {
			leftButton = (
				<Button transparent onPress={this.props.leftButtonOnPress}>
				  <Icon name={this.props.leftButtonIcon.name} style = {{color: this.props.style.color}}/>
				</Button>
			);
		}

		if (this.props.isRightButtonIconShow) {
			rightButton = (
				<Button transparent onPress={this.props.rightButtonOnPress}>
				  <Icon name={this.props.rightButtonIcon.name} style = {{color: this.props.style.color}}/>
				</Button>
			);
		}

		let title = (
			<Title onPress={this.props.titleOnPress} style = {{color: this.props.style.color}}>{this.props.title}</Title>
		);


		if (this.props.isShowSearch) {
			header = (
				<Header style={[this.props.style.HeaderBackground, {borderBottomWidth: 0}]} searchBar rounded hasSegment>
				  <Left style={{flex:0, flexDirection: 'row'}}>
				  </Left>
				  <Item style={{borderWidth: 1}}>
				    <Icon name="search" />
				    <Input 
						placeholder     ={this.props.placeholder}
						keyboardType    = "web-search" 
						returnKeyType   = "search"
						clearButtonMode = "while-editing" 
						autoFocus       = {true}
						onChangeText    ={this.props.onChangeText}
						onSubmitEditing ={this.props.onSubmitEditing}
				     />
				  </Item>
				  <Right style={{flex:0, flexDirection: 'row'}}>
				    <Button transparent onPress={this.props.closeSearchButtomOnPress}>
				      <Icon name="close" style = {{color: this.props.style.color}}/>
				    </Button>      
				    {
				    	(this.props.searchButtomText != null)?
				    		<Button transparent onPress={this.props.searchButtomOnPress}>
				    		  <Title style = {{color: this.props.style.color}}>{this.props.searchButtomText}</Title>
				    		</Button>
				    	:
				    		null
				    }
				    
				  </Right>
				</Header>
			);
		} else {
			header = (
				<Header style={[this.props.style.HeaderBackground, {borderBottomWidth: 0}]} searchBar rounded hasSegment>
					<Left>
						{leftButton}
					</Left>
					<Body onPress={this.props.titleOnPress} >
						{title}
					</Body>
					<Right>
						{rightButton}
					</Right>
				</Header>
			);
		}	

		return header;
	}
}

export default connectStyle( 'Component.HeaderForGeneral', {} )(HeaderForSearch);