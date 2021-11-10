import React,{Component} from 'react';
import { Body, Label, Picker, Icon, connectStyle} from 'native-base';
import { Platform } from 'react-native';

class MyFormSelectListButton extends Component{
	constructor(props) {
	  super(props);
	}

	render(){
		let os = Platform.OS
		let data = this.props.data, pickers = [];
		for(var i in data){
			pickers.push(
			    <Picker.Item label={data[i].label} value={data[i].label} key={i}/>
			);
		}
			
		return(
			<Body style={[this.props.style.MyFormListFilterModalSelect, {height: os == "ios" ? null : 50}]}>
			  <Label style={{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}}>{this.props.text}</Label>
			  <Picker 
			  	// note
			  	mode="dropdown" 
			  	iosHeader={this.props.text}
			  	headerTitleStyle={{color:this.props.style.inputWithoutCardBg.inputColor}}
			  	headerBackButtonTextStyle={{color:this.props.style.inputWithoutCardBg.inputColor}}

			  	iosIcon={<Icon name="arrow-down" style={{color:this.props.style.inputWithoutCardBg.inputColor}}/>}
			  	style={
			  		(os == "ios") ?
			  			{width: "100%"}
			  			:
			  			{ width: "100%", color: this.props.style.inputWithoutCardBg.inputColor }
			  	} 
			  	textStyle={{color:this.props.style.inputWithoutCardBg.inputColor}}

			  	itemStyle={{
			  	  marginLeft: 0,
			  	  paddingLeft: 10
			  	}}

			  	selectedValue={this.props.defaultData.label} 
			  	onValueChange={this.props.onPress}
			  	enabled = {typeof(this.props.enabled) ? this.props.enabled : true}
			  >
			  	{pickers}
			  </Picker>
			</Body>
		);
	}
}

export default connectStyle( 'Component.InputWithoutCardBackground', {} )(MyFormSelectListButton);
