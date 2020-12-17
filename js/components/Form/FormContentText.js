import React, { Component } from 'react';
import { Content, Item, Label, Input, Icon, Text, connectStyle } from 'native-base';

class FormContentText extends Component {
	constructor(props) {
		super(props);

		// 名稱、值、參數、能否編輯、強制編輯、欄位資料
		this.state = {
			labelname: props.data.component.name,
			value:null,
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

		if (editable) {
			value = (this.props.data.defaultvalue == null ) ? null : this.props.data.defaultvalue;
			if (value == null) {
				value = (value == this.state.value) ? value : this.state.value;
			} else {
				value = (this.state.value == null) ? value : this.state.value; 
			}

			return(
				 	<Item fixedLabel 
				 		style={[
				 			this.props.style.CreateFormPageFiledItemWidth,
				 			// this.props.style.fixCreateFormPageFiledItemWidth
				 		]} 
				 		error={this.props.data.requiredAlbert}>
		 			   <Label style={{flex: 0, color:"#FE1717"}}>{required}</Label>
		               <Label style={{flex: 0}}>{this.state.labelname}</Label>
		               <Input 
		               		// multiline
                          	ref="focusInput"
		               		value = {value}
		               		style={{ textAlign: 'right'}}
		               		onEndEditing ={ async (text)=>{
		               			await this.props.onPress(text.nativeEvent.text, this.props.data);
		               			this.setState({ value:null });
		               		}}
							onFocus = {(e)=>{
								// this.setState({ value:value });
							}}
							onChangeText ={(text)=>{
								this.setState({ value:text });
							}}
		               	/>
		               	<Icon 
		               		name='edit' 
		               		type='MaterialIcons'
		               		onPress={()=>{
		               		   this.refs["focusInput"].wrappedInstance.focus();
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
			value = (this.props.data.defaultvalue == null || this.props.data.defaultvalue == "") ? value : this.props.data.defaultvalue;
			return(
				  <Item fixedLabel 
					  style={[
					  	this.props.style.CreateFormPageFiledItemWidth,
					  	this.props.style.fixCreateFormPageFiledItemWidth,
					  ]}
				  >
		 			<Label style={{flex: 0, color:"#FE1717"}}>{required}</Label>
				  	<Label style={{flex: 0}}>{this.state.labelname}</Label>
				    <Input 
						multiline 
						scrollEnabled = {false}
						value         ={value} 
						editable      ={editable} 
						style         ={{textAlign: 'right', backgroundColor: 'rgba(0,0,0,0)'}}
				    />
				  </Item>
			);
		}	
	}
}

export default connectStyle( 'Component.FormContent', {} )(FormContentText);