import React, { Component } from 'react';
import { TextInput } from 'react-native';
import { Content, Item, Label, Input, Form, Icon, Button, Text, Body, connectStyle } from 'native-base';
import { connect } from 'react-redux';
import ActionSheet from 'react-native-actionsheet';

class FormContentCbo extends Component {
	constructor(props) {
		super(props);
		// 名稱、值、參數、能否編輯、強制編輯、欄位資料
		this.state = {
			labelname: props.data.component.name,
		};
	}

	render() {
		let paramList = (this.props.data.paramList == null) ? [] : this.props.data.paramList;
		// 確認是否可編輯
		let editable  = this.props.editable;
		if( editable == null ){
			if (typeof this.props.data.isedit != "undefined"){
				editable = (this.props.data.isedit == "Y") ? true : false;	
			}else{
				editable = false;
			}
		}
		let required = (this.props.data.required == "Y") ? "*" : "  ";
		let paramname = this.props.lang.Common.None;
		let defaultvalue = (this.props.data.defaultvalue == null || this.props.data.defaultvalue == "" ) ? paramname: this.props.data.defaultvalue; 
		for (let i in paramList) {
			if (this.props.data.defaultvalue == paramList[i].paramcode) {
				paramname = paramList[i].paramname;
				break;
			}else{
				paramname = defaultvalue; 
			}
		}
		let renderItem = null;

		if (editable) {
			renderItem = (
	  				<Item fixedLabel style={[this.props.style.CreateFormPageFiledItemWidth, this.props.style.fixCreateFormPageFiledItemWidth]}>
 			   		  <Label style={{flex: 0, color:"#FE1717"}}>{ required }</Label>
 			   		  <Label style={{flex: 0 }}>{this.state.labelname}</Label>
 			   		  <Text 
 			   		  	style={{
 			   		  		flex: 1, 
 			   		  		textAlign: 'right', 
 			   		  		lineHeight: 50, 
 			   		  		paddingRight: 10,
 			   		  	}} 
 			   		  	onPress={()=>this.ActionSheet.show()} 
 			   		  >{paramname}
 			   		  </Text>
 			   		  <Icon 
		   		  			name='arrow-forward' 
		   		  			onPress={() => this.ActionSheet.show()} 
		   		  		/>
          			  {this.renderActionSheet()}
		            </Item>
			);
		} else {
			renderItem = (
  				  <Item 
  				  	fixedLabel 
  				  	style={[
  				  		this.props.style.CreateFormPageFiledItemWidth,
  				  		this.props.style.fixCreateFormPageFiledItemWidth
  				  	]}
  				  >
 			   		<Label style={{flex: 0, color:"#FE1717"}}>{ required }</Label>
  				  	<Label style={{flex: 0}}>{this.state.labelname}</Label>
  				    <Input 
  				    	multiline 
  				    	scrollEnabled = {false}
  				    	value={(paramname != null) ? paramname : defaultvalue } 
  				    	editable={editable} 
  				    	style={{textAlign: 'right'}}
  				    />
  				  </Item>
			);
		}

		return renderItem;
	}

	renderActionSheet = () => {	
		let paramList = (this.props.data.paramList == null) ? [] : this.props.data.paramList;
		let BUTTONS = [];
		let CANCEL_INDEX = paramList.length;

		for (let i in paramList) BUTTONS.push( paramList[i].paramname );
		BUTTONS.push(this.props.lang.Common.Cancel);
	
		return (
		  <ActionSheet
			ref               ={o => this.ActionSheet = o}
			title             ={this.state.labelname}
			options           ={BUTTONS}
			cancelButtonIndex ={CANCEL_INDEX}
		    onPress={(buttonIndex) => { 
		      if (buttonIndex != CANCEL_INDEX) {
		        this.props.onPress(paramList[buttonIndex].paramcode, this.props.data);
		      }
		    }}  
		  />
		);
	}
}

export default connectStyle( 'Component.FormContent', {} )(FormContentCbo);