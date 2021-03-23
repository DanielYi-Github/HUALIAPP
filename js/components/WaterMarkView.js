import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import {Card, CardItem, Left, Body, Right, Icon, Text, Button, connectStyle } from 'native-base';
import CustomWatermarkView from "../extendThirdModule/CustomWatermarkView";
import { connect } from 'react-redux';

class WaterMarkView extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let user = this.props.state.UserInfo.UserInfo;
		let watermarkerconfig = {
			watermark : `${user.id}  ${user.name}`,
			itemWidth : 130,
			itemHeight: 120,
			rotateZ   : -25,
			watermarkTextStyle:this.props.style.watermarkTextStyle
		};

		let showWaterMark = false, waterMarkArray = this.props.state.Common.waterViewConfig; 
		for (let i in waterMarkArray) {
			if (waterMarkArray[i].pageId == this.props.pageId) {
				showWaterMark = true;
				break;
			}
		}

		if (showWaterMark) {
			return(
				<CustomWatermarkView
				    foreground ={(this.props.foreground == "N") ? false : true}
				    watermark  ={watermarkerconfig.watermark}
				    itemWidth  ={watermarkerconfig.itemWidth}
				    itemHeight ={watermarkerconfig.itemHeight}
				    rotateZ    ={watermarkerconfig.rotateZ}
				    compontentHeight ={this.props.height ? this.props.height : Dimensions.get('window').height}
				    style = {{backgroundColor: 'rgba(0,0,0,0)'}}
				    watermarkTextStyle={watermarkerconfig.watermarkTextStyle }
				>
					  {this.props.contentPage}
				</CustomWatermarkView>
			);
		} else {
			return this.props.contentPage
		}
	}
}

export let WaterMarkViewStyle = connectStyle( 'Component.WaterMarkView', {} )(WaterMarkView);

export default connect(
  (state) => ({
    state: {...state}
  })
)(WaterMarkViewStyle);
