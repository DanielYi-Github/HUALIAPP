import React,{Component} from 'react';
import {Card, CardItem, Left, Body, Right, Icon, Title, Text, Button, connectStyle } from 'native-base';

class FormItem extends Component{
	constructor(props) {
	  super(props);
	  let icon, color, backgroundColor, status, titleColor;
	  switch (props.item.formtype) {
	    case "General":
	      icon = "document";
	      color = "#3F51B5",
	      backgroundColor = "#E8EAF6";
	      break;
	    case "GeneralAffairs":
	      icon = "attach";
	      color = "#558B2F",
	      backgroundColor = "#F1F8E9";
	      break;
	    case "Information":
	      icon = "desktop";
	      color = "#2196F3",
	      backgroundColor = "#E3F2FD";
	      break;
	    case "HR":
	      icon = "people";
	      color = "#009688",
	      backgroundColor = "#E0F2F1";
	      break;
	    case "Administration":
	      icon = "folder";
	      color = "#616161",
	      backgroundColor = "#F5F5F5";
	      break;
	    case "Inventory":
	      icon = "cube";
	      color = "#607D8B",
	      backgroundColor = "#ECEFF1";
	      break;
	    case "Finance":
	      icon = "cash";
	      color = "#FFC107",
	      backgroundColor = "#FFF3E0";
	      break;  
	    default:
	      icon = "code-working";
	      color = "#f8f8fc",
	      backgroundColor = "#3d4650";
	      break;
	  }


	  switch(props.item.status){
	    case "running":
	      status = props.Lang_FormStatus.running;
	      titleColor = '#328afb';
	      break;
	    case "ready":
	      status = props.Lang_FormStatus.ready;
	      titleColor = "#607D8B";
	      break;
	    case "complete":
	      status = props.Lang_FormStatus.complete;
	      titleColor = "#11d911";
	      break;
	    case "dead":
	      status = props.Lang_FormStatus.dead;
	      titleColor = "#FDD835";
	      break;
	    case "suspended":
	      status = props.Lang_FormStatus.suspended;
	      titleColor = "#FF5722";
	      break;
	    case "retrieved":
	      status = props.Lang_FormStatus.retrieved;
	      titleColor = "#795548";
	      break;
		case "signing":
 			status = props.Lang_FormStatus.signing;
 			titleColor = "#FF9800";
	    default:
	      status = props.Lang_FormStatus.default;
	      titleColor = "#3d4650";
	      break;
	  }

	  let str = props.item.excutetime.split("_");
	  let excutetime = str[0]+"天"+str[1]+"小時"+str[2]+"分";

	  this.state = {
		icon           :icon, 
		color          :color, 
		backgroundColor:backgroundColor, 
		status         :status,
		excutetime     :excutetime,     
		titleColor     :titleColor 
      }
	}

	render(){
		//如果為真，表示該頁為MyFormListPage，應顯示表單狀態明細
		let whichTypeForm;
		if (this.props.myFormList) {
			whichTypeForm = (
				<CardItem button onPress={this.props.onPress}>
				  <Left style={{flex:0}}>
					<Button rounded 
					    style={{
					       alignSelf      : 'center',
					       height         : 55,
					       width          : 55, 
					       backgroundColor: this.state.backgroundColor, 
					       alignItems     : 'center', 
					       justifyContent : 'center',
					    }}
					  >
					  <Icon name={this.state.icon} style={{color:this.state.color}} />
					</Button>
				  </Left>
				  <Body style={{marginLeft: 10}}>
				  	<Title>{this.props.item.processname}</Title>
				  	<Text note style={{color:this.props.style.labelColor}}>{this.props.item.keyword}</Text>
				  	<Body style={{flexDirection: 'row'}}>
				  		<Left style={{flex:0}}>
				  			<Title style={this.state.titleColor ? {color:this.state.titleColor} : this.props.style.ExplainText}>
				  				{this.state.status}
				  			</Title>
				  		</Left>
				  		<Body style={{flex:1, alignItems: 'flex-start', marginLeft: 10}}>
				  			<Text note style={this.props.style.ExplainText}>{this.props.item.starttime}</Text>
				  			<Text note style={this.props.style.ExplainText}>{this.state.excutetime}</Text>
				  		</Body>
				  	</Body>
				  </Body>
				  <Right style={{flex:0}}>
				  	<Icon name="arrow-forward"/>
				  </Right>
				</CardItem>
			);
		} else {
			whichTypeForm = (
				<CardItem button onPress={this.props.onPress}>
				  <Left style={{flex:0}}>
					<Button rounded 
					    style={{
					       alignSelf      : 'center',
					       height         : 55,
					       width          : 55, 
					       backgroundColor: this.state.backgroundColor, 
					       alignItems     : 'center', 
					       justifyContent : 'center',
					    }}
					  >
					  <Icon name={this.state.icon} style={{color:this.state.color}} />
					</Button>
				  </Left>
				  <Body style={{marginLeft: 10}}>
				  	<Title>{this.props.item.processname}</Title>
				  	<Text note style={{color:this.props.style.labelColor}}>{this.props.item.keyword}</Text>
				  	<Body style={{flexDirection: 'row'}}>
				  		<Left style={{flex:0}}>
				  			<Title style={this.props.style.ExplainText}>{this.props.item.name}</Title>
				  		</Left>
				  		<Body style={{flex:1, alignItems: 'flex-start', marginLeft: 10}}>
				  			<Text note style={this.props.style.ExplainText}>{this.props.item.starttime}</Text>
				  			<Text note style={this.props.style.ExplainText}>{this.state.excutetime}</Text>
				  		</Body>
				  	</Body>
				  </Body>
				  <Right style={{flex:0}}>
				  	<Icon name="arrow-forward"/>
				  </Right>
				</CardItem>
			);
		}

		if (this.props.FindPageFilterItem) {
			return whichTypeForm;
		} else {
			return (
				<Card style={{alignSelf: 'center'}}>
					{whichTypeForm}
				</Card>
			);
		}		
	}
}

export default connectStyle( 'Component.FormItem', {} )(FormItem);
