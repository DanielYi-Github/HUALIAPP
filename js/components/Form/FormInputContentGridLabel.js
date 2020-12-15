import React, { Component } from 'react';
import { Label } from 'native-base';
import DateFormat from  'dateformat';	//	https://www.npmjs.com/package/dateformat


export default class FormInputContentGridLabel extends Component {
	constructor(props) {
		super(props);
	}

	render() {		
		let value = this.props.data.defaultvalue;

		switch(this.props.data.columntype) {
		  case "cbo":
		  	for(let param of this.props.data.paramList){
		  		if (param.paramcode == value) {
					value = param.paramname;			
		  		}
		  	}
		    break;
		  case "hidetxt":
			return null;			
		    break;
		  default:
		    // code block
		}
		value = (value == null || value == "null" || value == "" || value == " " ) ? " " : value;
		return(
			<Label>{`${this.props.data.component.name}:${value}`}</Label>
		);
	}
}
