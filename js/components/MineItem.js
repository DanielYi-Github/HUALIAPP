import React,{Component} from 'react';
import { Icon, Button, Left, Right, Text, CardItem, Switch } from 'native-base';

export default class MineButton extends Component{
	constructor(props) {
	  	super(props);
	}

	render(){
		return(
			<CardItem button onPress ={this.props.onPress}>
			  <Left> 
			    <Button 
			    	rounded 
			    	style={{ 
						backgroundColor: this.props.iconBackgroundColor, 
						height         :55, 
						width          :55, 
						alignItems     : 'center', 
						justifyContent : 'center'
			    	}}>
			      <Icon active name={this.props.iconName} type={this.props.iconType}/>
			    </Button>
			     <Text>{this.props.title}</Text>
			  </Left>
			  {
			  	(this.props.text) ?
			   		<Right style={{flexDirection: 'row', flex: 0}}>
			   		  	<Text note>{this.props.text}</Text>
			   		</Right>
			  	:
			   		<Right style={{flexDirection: 'row', flex: 0}}>
			   			{
			   				(typeof this.props.switchValue !== 'undefined') ? 
			   			  		<Switch onValueChange={this.props.onPress} value={this.props.switchValue}/>
			   				:
			   					<Icon name="arrow-forward" />
			   			}
			   		</Right>
			  }
			</CardItem>
		);
	}
}