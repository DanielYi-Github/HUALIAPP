import React, { Component } from 'react';
import { Content, Item, Label, Input, connectStyle } from 'native-base';

class FormContentTextWithText extends Component {
	constructor(props) {
		super(props);

		// 名稱、值、參數、能否編輯、強制編輯、欄位資料
		this.state = {
			labelname: props.data.component.name,
		};
	}

	render() {
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
		let value = this.props.lang.Common.None;

		if (this.props.data.listComponent.length != 0) {
			value = this.props.data.listComponent[0].defaultvalue;
			for (let i=1, length=this.props.data.listComponent.length; i<length; i++) {
				value = value + " / " + this.props.data.listComponent[i].defaultvalue;
			}
		}

		if (editable) {
			value = (this.props.data.defaultvalue == null ) ? "" : this.props.data.defaultvalue;
			return(
				 	<Item fixedLabel 
				 	style={[
				 		this.props.style.CreateFormPageFiledItemWidth,
				 		this.props.style.fixCreateFormPageFiledItemWidth
				 	]}
				 	error={this.props.data.requiredAlbert}>
		 			   <Label style={{flex: 0, color:"#FE1717"}}>{required}</Label>
		               <Label>{this.state.labelname}</Label>
		               <Input 
		               		multiline
		               		value = {value}
		               		style={{ textAlign: 'right'}}
							onChangeText ={(text)=>{
								this.props.onPress(text, this.props.data);
							}}
							onFocus = {(e)=>{
								this.props.onPress("", this.props.data);
							}}
		               	/>
		               	{
		               		(this.props.data.requiredAlbert) ?
		               			<Icon name='alert' />
		               		:
		               			null
		               	}
		            </Item>
			);
		} else {		
			value = (this.props.data.defaultvalue == null ) ? value : this.props.data.defaultvalue;
			return(
				  <Item fixedLabel 
				  style={[
				  	this.props.style.CreateFormPageFiledItemWidth,
				  	this.props.style.fixCreateFormPageFiledItemWidth
				  ]}
				  >
		 			<Label style={{flex: 0, color:"#FE1717"}}>{required}</Label>
				  	<Label style={{flex: 0}}>{this.state.labelname}</Label>
				    <Input 
  				    	scrollEnabled = {false}
				    	// multiline 
				    	value={value} 
				    	editable={editable} 
				    	style={{textAlign: 'right', color:this.props.style.labelColor}}
				    />
				  </Item>
			);
		}	
	}
}

export default connectStyle( 'Component.FormContent', {} )(FormContentTextWithText);
