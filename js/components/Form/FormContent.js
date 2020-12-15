import React, { Component } from 'react';
import { View, Image, TouchableOpacity} from 'react-native';
import { Container, Header, Icon, Left, Button, Body, Right, Title, Content, Text, Card, CardItem, Accordion} from 'native-base';
import FormInputContent  from './FormInputContent';

export default class FormContent extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
	        <Card style={{alignSelf: 'center'}}>
				<Accordion
					dataArray     ={[this.props.data]}
					animation     ={true}
					expanded      ={this.props.isOpen}
					renderHeader  ={this.renderHeader}
					renderContent ={this.renderContent}
					style         ={{ borderRadius: 10 }}
				/>
			</Card>
		);
	}
	
	renderHeader = (item, expanded) => {
		let backgroundColorExpanded = "#2196F3";
		let backgroundColorUnexpand = "#1976D2";

		//調整背景顏色
		if( (typeof this.props.headerBackgroundColor) != "undefined" ){
			backgroundColorExpanded = this.props.headerBackgroundColor.backgroundColorExpanded;
			backgroundColorUnexpand = this.props.headerBackgroundColor.backgroundColorUnexpand;
		}

		//去除首尾空格
		item.labelname = item.labelname.replace(/(^\s*)|(\s*$)/g,"");
		return(	
			<CardItem header 
				style={{
					justifyContent         : 'space-between', 
					borderTopLeftRadius    : 10,
					borderTopRightRadius   : 10,
					borderBottomLeftRadius : expanded ? 0: 10,
					borderBottomRightRadius: expanded ? 0: 10,
					backgroundColor        : expanded ? backgroundColorExpanded : backgroundColorUnexpand,
				}}>
				<Text style={{color:"#FFF"}}>{item.labelname}</Text>
			  	<Right style={{flex:0, alignSelf: 'flex-end'}}>
			  		{
			  			expanded ? 
			  				<Icon name="remove" style={{color: "white"}} /> 
			  			: 
			  				<Icon name="add" style={{color: "white"}} />
			  		}
			  	</Right>
			</CardItem>
		);
	}

	renderContent = (item) => {
		// 是否可進行編輯
		let onPress = null;
		let editable = false;
		if(typeof this.props.onPress != "undefined" ){
			onPress = this.props.onPress;
			editable = null;
		}

		let content = item.content;
		let render=[];
		for(let index in content){
			content[index].component.name = content[index].component.name.replace(/\n/ig, '') ; // 字串處理
			render.push(
				<FormInputContent 
					key      ={index} 
					data     ={content[index]} 
					onPress  ={onPress}
					editable ={editable}
					lang     ={this.props.lang}
              		user   	 ={this.props.user}
				/>
			);
		}
		
		return (
			<CardItem style={{flexDirection: 'column'}}>
				{render}
			</CardItem>
		);
	}
}