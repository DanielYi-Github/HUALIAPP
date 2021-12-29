import React, { Component } from 'react';
import { View } from 'react-native';
import { Icon, Body, Right, Title, Text, Card, CardItem, Accordion} from 'native-base';
import Timeline from 'react-native-timeline-flatlist'

export default class FormRecords extends Component {
	constructor(props) {
		super(props);
		this.state = {
			active  :(this.props.active !== undefined) ? this.props.active : 0 ,
			minWidth:86.28571319580078,
		};
	}

	render() {
		return(
			<Card style={{alignSelf: 'center'}}>
				<Accordion
					dataArray     ={[this.props.data]}
					animation     ={true}
					expanded      ={[0]}
					renderHeader  ={this.renderHeader}
					renderContent ={this.renderContent}
					innerCircle   ={'dot'}
					style         ={{ borderRadius: 10 }}
				/>
			</Card>
		);
	}

	renderHeader = (item, expanded) => {
		return (
			<CardItem header 
				style={{
					// backgroundColor:expanded ? "#ff5177" : "#ff4081",
					backgroundColor        : expanded ? "#009688" : "#00796B",
					justifyContent         : 'space-between', 
					borderTopLeftRadius    : 10,
					borderTopRightRadius   : 10,
					borderBottomLeftRadius : expanded ? 0: 10,
					borderBottomRightRadius: expanded ? 0: 10,
				}}>
				<Text style={{color:"#FFF"}}>{this.props.lang.ApprovalRecords}</Text>
			  	<Right style={{flex:0, alignSelf: 'flex-end'}}>
			  		{expanded ? <Icon name="remove" style={{color: "white"}} /> 
			  			: <Icon name="add" style={{color: "white"}} />}
			  	</Right>
			</CardItem>
		);
	}

	renderContent = (item) => {
		return (
			<CardItem style={{flexDirection: 'column'}}>
				<Timeline 
				  style={{width:"100%"}}
				  data={item}
				  renderTime={this.renderTime}
				  renderDetail={this.renderDetail}
				/>
			</CardItem>
		);
	}

	renderTime = (rowData, sectionID, rowID) => {
		let status, titleColor;
		switch(rowData.state){
		  case "running":
	      	status = this.props.Lang_FormStatus.running;
		    titleColor = '#328afb';
		    break;
		  case "ready":
    	    status = this.props.Lang_FormStatus.ready;
		    titleColor = "#607D8B";
		    break;
		  case "complete":
    	    status = this.props.Lang_FormStatus.complete;
		    titleColor = "#11d911";
		    break;
		  case "dead":
         	status = this.props.Lang_FormStatus.dead;
		    titleColor = "#FDD835";
		    break;
		  case "suspended":
	        status = this.props.Lang_FormStatus.suspended;
		    titleColor = "#FF5722";
		    break;
		  case "retrieved":
  	        status = this.props.Lang_FormStatus.retrieved;
		    titleColor = "#795548";
		    break;
  		  case "signing":
    	    status = this.props.Lang_FormStatus.signing;
  		    titleColor = "#FF9800";
  		    break;
		  default:
	        status = this.props.Lang_FormStatus.default;
		    titleColor = "#3d4650";
		    break;
		}


		let content;
		if (rowData.signtime == "") {
			content = (
				<Body style={{alignItems:'flex-start',flex:0, minWidth:this.state.minWidth}}>
					<View style={{backgroundColor:titleColor, padding:10, borderRadius:5, /*width:"100%"*/}}>
						<Text style={{color:'white'}}>{status}</Text>
					</View>
				</Body>	
			)
		} else {
			let time = rowData.signtime.split(" ");
			content = (
				<Body style={{alignItems:'flex-start', flex:0}} onLayout={this._setMinWidth.bind(this)}>
					<View style={{backgroundColor:"#009688", padding:5, borderRadius:5}}>
						<Text style={{color:'white'}}>{time[0]}</Text>
						<Text style={{color:'white'}}>{time[1]}</Text>
					</View>
					<View style={{backgroundColor:titleColor, padding:5, borderRadius:5}}>
						<Text style={{color:'white'}}>{status}</Text>
					</View>
				</Body>
			);
			
		}
		return content;
	}

	renderDetail = (rowData) => {
		return (
			<Body style={{alignItems:'flex-start'}}>
				<Title numberOfLines={10}>{rowData.proname}</Title>
				{/*
				<Text>{rowData.executor}/{rowData.rolename}/{rowData.depname}</Text>
				*/}
				<Text>{rowData.executor}</Text>
				<Text note>{this.props.lang.ApprovalResult}：{rowData.result}</Text>
				<Text note>{this.props.lang.ApprovalComment}：{rowData.note}</Text>
			</Body>
		);
	}

	//自動設置組件加載後主從寬度最大值
	_setMinWidth(event) {
	    this.setState({
	        minWidth: event.nativeEvent.layout.width
	    });
	}
}