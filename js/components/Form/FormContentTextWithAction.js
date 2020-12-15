import React, { Component } from 'react';
import { TextInput } from 'react-native';
import { Content, Item, Label, Input, Form, Icon, Button, Text, Body, Card, CardItem, Title, connectStyle } from 'native-base';
import * as NavigationService   from '../../utils/NavigationService';

class FormContentTextWithAction extends Component {
	constructor(props) {
		super(props);
		// 名稱、值、參數、能否編輯、強制編輯、欄位資料
		this.state = {
			labelname: props.data.component.name,
			showEditModal: false,
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
		let defaultvalue = this.props.data.defaultvalue ? this.props.data.defaultvalue : this.props.lang.Common.None;
		let renderItem = null;

		if (editable) {
			renderItem = (
	  				<Item fixedLabel 
	  				style={[
	  					this.props.style.CreateFormPageFiledItemWidth
	  				]}
	  				error={this.props.data.requiredAlbert}>
 			   		  <Label style={{flex: 0, color:"#FE1717"}}>{ required }</Label>
 			   		  <Label style={{flex: 0 }}>{this.state.labelname}</Label>
 			   		  <Text 
 			   		  	style={{
 			   		  		flex: 1, 
 			   		  		textAlign: 'right', 
 			   		  		lineHeight: 50, 
 			   		  		paddingRight: 10,
 			   		  	}} 
 			   		  	onPress={this.goSelectPage} 
 			   		  >
 			   		  	{defaultvalue}
 			   		  </Text>
 			   		  <Icon 
		   		  		name='arrow-forward' 
 			   		  	onPress={this.goSelectPage} 
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
			renderItem = (
	  			//新版本的排版
  				  <Item fixedLabel 
  				  style={[
  				  	this.props.style.CreateFormPageFiledItemWidth,
  				  	this.props.style.fixCreateFormPageFiledItemWidth
  				  ]}
  				  >
 			   		<Label style={{flex: 0, color:"#FE1717"}}>{ required }</Label>
  				  	<Label style={{flex: 0}}>{this.state.labelname}</Label>
  				    <Input 
  				    	scrollEnabled = {false}
  				    	multiline 
  				    	value={defaultvalue} 
  				    	editable={editable} 
  				    	style={{textAlign: 'right'}}/>
  				  </Item>
			);
		}

		return renderItem;
	}

	goSelectPage = () => {
		NavigationService.navigate("FormContentTextWithAction", {
		  data: this.props.data,
		  onPress:this.selectOneItem
		});
	}

	selectOneItem = (item) => {
		this.props.onPress(item, this.props.data);
	}

	// deep clone
	deepClone(src) {
	  return JSON.parse(JSON.stringify(src));
	}
}

export default connectStyle( 'Component.FormContent', {} )(FormContentTextWithAction);
