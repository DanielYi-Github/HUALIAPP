import React, { Component } from 'react';
import { Container, Header, Left, Content, Right, Item, Label, Input, Body, Card, CardItem, Title, Button, Icon, Text, CheckBox, connectStyle } from 'native-base';
import { View, FlatList, TextField }from 'react-native';
import TagInput          from 'react-native-tags-input';
import * as NavigationService from '../../utils/NavigationService';

class FormContentTabOneItem extends Component {
	constructor(props) {
		super(props);

		// 名稱、值、參數、能否編輯、強制編輯、欄位資料	
		this.state = {
			labelname    : props.data.component.name,
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
		let renderItem = null;

		//整理tags的資料格式
		let tagsArray = [];
		this.props.data.defaultvalue = this.props.data.defaultvalue ? this.props.data.defaultvalue : [];
		for(let value of this.props.data.defaultvalue) tagsArray.push(value.COLUMN2);
		let tags = { tag: '', tagsArray: tagsArray }

		if (editable) {
			renderItem = (
				<View style={{width: '100%'}}>
	            	<Item 
	            		fixedLabel 
	            		style={{
	            			borderBottomWidth: 0, 
	            			paddingTop: 15, 
	            		}} 
	            	>
		 			  	<Label style={{flex: 0, color:"#FE1717"}}>{ required }</Label>
		                <Label>{this.state.labelname}</Label>
		                <Icon 
							name    ="add-circle" 
							type    ="MaterialIcons" 
							style   ={{fontSize:30, color: '#20b11d'}}
							onPress ={this.goSelectPage}
		                />
		            </Item>
                	{/*可以刪除，不能新增*/}
        			<TagInput
        				disabled={true}
        				autoFocus={false}
        				updateState={(state)=>{ this.deleteTag(state); }}
        				tags={tags}
        				inputContainerStyle={{ height: 0 }}
        				tagsViewStyle={{ margin:0 }}
        				tagStyle={{backgroundColor:"#DDDDDD", borderWidth:0}}
        				tagTextStyle={{color:"#666"}}
        			/>
        			{
        				(this.props.data.requiredAlbert) ?
        					<Icon name='alert'/>
        				:
        					null
        			}
                    <Item fixedLabel error={this.props.data.requiredAlbert} /> 
	            </View>
			);
		} else {
			let value = this.props.lang.Common.None;
			if (this.props.data.defaultvalue == null || this.props.data.defaultvalue.length == 0) {
				renderItem = 
					  <Item fixedLabel 
					  style={[
					  	this.props.style.CreateFormPageFiledItemWidth,
					  	this.props.style.fixCreateFormPageFiledItemWidth,
					  	// {borderWidth:0}
					  ]}
					  >
			 			<Label style={{flex: 0, color:"#FE1717"}}>{ required }</Label>
					  	<Label style={{flex: 0}}>{this.state.labelname}</Label>
					    <Input 
  				    		scrollEnabled = {false}
					    	multiline 
					    	value={value} 
					    	editable={editable} 
					    	style={{textAlign: 'right'}}
					    />
					  </Item>
			} else {
				renderItem = 
					<View style={{width: '100%'}}>
		            	<Item fixedLabel style={{borderBottomWidth: 0, paddingTop: 15}}>
			 			  	<Label style={{flex: 0, color:"#FE1717"}}>{ required }</Label>
			                <Label>{this.state.labelname}</Label>
			            </Item>
			        	{/*不可以編輯*/}
						<TagInput
							disabled={true}
							autoFocus={false}
							updateState={(state)=>{ 
								
							}}
							tags={tags}
							inputContainerStyle={{ height: 0 }}
							tagsViewStyle={{ margin:0 }}
							deleteIconStyles={{ width: 0, height: 0 }}
							tagStyle={{backgroundColor:"#DDDDDD", borderWidth:0}}
							tagTextStyle={{color:"#666"}}
						/>
			            <Item fixedLabel/> 
					</View>
			}
		}

		return renderItem;
	}

	goSelectPage = () => {
		NavigationService.navigate("FormContentTextWithTags", {
		  data: this.props.data,
		  onPress:this.selectOneItem
		});
	}

	selectOneItem = (item) => {
		this.props.onPress(item, this.props.data);
	}

	deleteTag = (state) => {
	  let data = this.deepClone(this.props.data);

	  for(let [i, value] of data.defaultvalue.entries()){
	    let spliceIndex = 0;
	    for(let item of state.tagsArray){
	      if (value.COLUMN2 == item){
	       spliceIndex = null;          
	       break; 
	      }
	      spliceIndex = i;
	    }

	    if(spliceIndex != null){
	     data.defaultvalue.splice(spliceIndex,1);
	     break; 
	    }
	  }

	  this.props.onPress(data, this.props.data);
	}

	deepClone(src) {
	  return JSON.parse(JSON.stringify(src));
	}
}

export default connectStyle( 'Component.FormContent', {} )(FormContentTabOneItem);
