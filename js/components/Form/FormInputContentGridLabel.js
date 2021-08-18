import React, { Component } from 'react';
import { Label } from 'native-base';
import DateFormat from  'dateformat';	//	https://www.npmjs.com/package/dateformat
import { View }from 'react-native';



export default class FormInputContentGridLabel extends Component {
	constructor(props) {
		super(props);
	}

	render() {		
		// let value = this.props.data.defaultvalue;
		let value = "";
		switch(this.props.data.columntype) {
			// case "cbo":
			// case "cbotab":	
			// 	for(let param of this.props.data.paramList){
			// 		if (param.paramcode == value) {
			// 			value = param.paramname;			
			// 		}
			// 	}
			// 	break;
			// case "rdotab":
			// 	value = value.toString();
			// 	for(let param of this.props.data.paramList){
			// 		if (param.paramcode == value) {
			// 			value = param.paramname;			
			// 		}
			// 	}
			// 	break;
			case "hidetxt":
				return null;			
				break;
			case "deputytxt":
				value = this.props.data.defaultvalue;
				break;
			case "txtwithaction":
				value = this.props.data.defaultvalue;
				break;
			default:
				return null;
				break;
		    // code block
		}

		value = (value == null || value == "null" || value == "" || value == " " ) ? " " : value;
		return(
			<View style = {{width: '100%', flexDirection: 'row'}}>
				<View style={{flex:2.8}}>
					<Label>{`${this.props.data.component.name}`}</Label>
				</View>
				<Label>:</Label>
				<View style={{flex:6.3}}>
					<Label>{`${value}`}</Label>
				</View>
			</View>
		);
	}
}
