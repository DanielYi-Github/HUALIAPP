import React, { Component } from 'react';
import { Card, CardItem, Left, Thumbnail, Body, Right, Icon, Text } from 'native-base';
import Styles from '../styles/Basic';

export default class RecruitItem extends React.PureComponent  {
	constructor(props) {
		super(props);
	}
	//时间戳转换方法    date:时间戳数字
	formatDate(date) {
	  var date = new Date(date);
	  var YY = date.getFullYear() + '-';
	  var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	  var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
	  return YY + MM + DD ;
	}

	render() {
		return(
		<Card style={[Styles.CardStyle,{alignSelf: 'center'}]}>
			<CardItem style={Styles.CardItemStyle} button onPress={this.props.onPress}>
			    <Body>
					<Text >{this.props.recruitInfo.title}</Text>
			    	<Body style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
						<Left>
							<Text note>{this.formatDate(this.props.recruitInfo.informationdate)}</Text>
						</Left>
						<Right>
							<Text style={{paddingRight:10}} note>點擊數 {this.props.recruitInfo.hits}</Text>	
						</Right>				      					  
			    	</Body>
			    </Body>
			    <Right style={{flex:0}}>
				    <Icon name="arrow-forward" />
			    </Right>
			</CardItem>
		</Card>
		)
	}
}