import React, { Component } from 'react';
import { Card, CardItem, Left, Thumbnail, Body, Right, Icon, Text } from 'native-base';

export default class ContactItem extends React.PureComponent  {
	constructor(props) {
		super(props);
	}

	render() {
		let item = this.props.contactInfo;
		// 判斷該筆資料的圖片是否有值與圖片型態為何
		if (item.PICTURE == "" || item.PICTURE == null || typeof item.PICTURE == "number" || !this.props.isNetWork) {
		  item.PICTURE = (item.SEX == "F") ? require("../image/user_f.png") : require("../image/user_m.png");
		} else {
		  // 因可能重新渲染所以需在此處稍加判斷
		  if (typeof item.PICTURE == "string") {
		    item.PICTURE = (item.PICTURE.indexOf("http://") < 0) ? {
		      uri: `data:image/png;base64,${item.PICTURE}`
		    } : {
		      uri: `${item.PICTURE}`
		    }
		  }
		}

		let cardItem = (
			<CardItem button onPress={this.props.onPress}>
			  <Left>
			    <Thumbnail source={ item.PICTURE } />
			    <Body>
			    	<Body style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
			      		<Text>{this.props.contactInfo.NAME} </Text>
			      		<Text note>{this.props.contactInfo.EMPID}</Text>
			    	</Body>
			      <Text note>{this.props.contactInfo.DEPNAME}</Text>
			    </Body>
			  </Left>
			  <Right>
			    <Icon name="arrow-forward" />
			  </Right>
			</CardItem>
		);

		if (this.props.FindPageFilterItem) {
			return cardItem;
		} else {
			return (
				<Card style={{alignSelf: 'center'}}>
					{cardItem}
				</Card>
			);
		}
	}
}