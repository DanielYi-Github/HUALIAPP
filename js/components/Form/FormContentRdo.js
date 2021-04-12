import React, { Component } from 'react';
import { TextInput } from 'react-native';
import { Content, Item, Label, Input, Form, Icon, Button, Text, Body, connectStyle } from 'native-base';
import ActionSheet from 'react-native-actionsheet';

class FormContentRdo extends Component {
	constructor(props) {
		super(props);
		// 確認參數
		let paramList = [];
		for (let i in props.data.listComponent) {
			paramList.push({
				name :props.data.listComponent[i].component.name,
				value:props.data.listComponent[i].component.id,
			});				
		}

		// 名稱、值、參數、能否編輯、強制編輯、欄位資料
		this.state = {
			labelname   :props.data.component.name,
			paramList   :paramList,
			data 		:props.data,
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
		let defaultvalue = this.props.data.defaultvalue;
		let paramname = this.props.lang.Common.None;

		for (let i in this.state.paramList) {
			if (this.state.paramList[i].value == this.props.data.defaultvalue) {
				paramname = this.state.paramList[i].name;
				break;
			}
		}
		let renderItem = null;

		if (editable) {
			renderItem = (
	  				<Item fixedLabel style={[
	  					this.props.style.CreateFormPageFiledItemWidth, 
	  					this.props.style.fixCreateFormPageFiledItemWidth
	  				]}>
 			   		  <Label style={{flex: 0, color:"#FE1717"}}>{ required }</Label>
 			   		  <Label style={{flex: 2}}>{this.state.labelname}</Label>
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
	  			//新版本的排版
  				  <Item fixedLabel 
  				  style={[
  				  	this.props.style.CreateFormPageFiledItemWidth,
  				  	this.props.style.fixCreateFormPageFiledItemWidth
  				  ]}
  				  >
 			   		<Label style={{flex: 0, color:"#FE1717"}}>{ required }</Label>
  				  	<Label >{this.state.labelname}</Label>
  				    <Input 
  				    	scrollEnabled = {false}
  				    	multiline 
  				    	value={paramname} 
  				    	editable={editable} 
  				    	style={{textAlign: 'right', color:this.props.style.labelColor}}
  				    />
  				  </Item>
			);
		}

		return renderItem;
	}

	renderActionSheet = () => {	
		let BUTTONS = [];
		let CANCEL_INDEX = this.state.paramList.length;

		for (let i in this.state.paramList) BUTTONS.push( this.state.paramList[i].name );
		BUTTONS.push(this.props.lang.Common.Cancel);

		return (
		  <ActionSheet
			ref               ={o => this.ActionSheet = o}
			title             ={this.state.labelname}
			options           ={BUTTONS}
			cancelButtonIndex ={CANCEL_INDEX}
		    onPress={(buttonIndex) => { 
		      if (buttonIndex != CANCEL_INDEX) {
		        this.props.onPress(this.state.paramList[buttonIndex].value, this.state.data);
		      }
		    }}  
		  />
		);
	}
}

export default connectStyle( 'Component.FormContent', {} )(FormContentRdo);
