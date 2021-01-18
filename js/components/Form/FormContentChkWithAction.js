import React, { Component } from 'react';
import { View, Platform} from 'react-native';
import { Content, Item, Label, Input, Form, Icon, Button, Text, Body, Card, CardItem, Title, connectStyle } from 'native-base';
import SortableList from 'react-native-sortable-list';
import TagInput          from 'react-native-tags-input';
import SortableRow         from './SortableRow';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';
import * as NavigationService   from '../../utils/NavigationService';

class FormContentChkWithAction extends Component {
	constructor(props) {
		super(props);

		// 名稱、值、參數、能否編輯、強制編輯、欄位資料
		this.state = {
			labelname    : props.data.component.name,
			showEditModal: false,
		};
	}

	render() {
		let defaultvalueArray = (this.props.data.defaultvalue == null ) ? []: this.props.data.defaultvalue;
		// 用來確認checkBox的狀態
		for(let item of defaultvalueArray){
			if ((typeof item.checked) == "undefined") {
				item.checked = false
			}
		}

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
				<View style={{width: '100%', alignItems: 'center', flex: 1}}>
					<View style={{backgroundColor: this.props.style.InputFieldBackground, width: '100%',alignItems: 'center' }}>
	  				<Item 
	  					fixedLabel 
	  					style={[
	  						this.props.style.CreateFormPageFiledItemWidth,
	  						this.props.style.fixCreateFormPageFiledItemWidth
	  					]}
	  					error={this.props.data.requiredAlbert}
	  				>
 			   		  <Label style={{flex: 0, /*color:"#FE1717"*/}}>{ required }</Label>
 			   		  <Label style={{flex: 0 }}>{this.state.labelname}</Label>
 			   		  <Input 
 			   		  	multiline 
 			   		  	value={""} 
 			   		  	editable={false} 
 			   		  	style={{textAlign: 'right'}}/>
	                  <Icon 
	  					name    ="add-circle" 
	  					type    ="MaterialIcons" 
	  					style   ={{fontSize:30, color: '#20b11d'}}
	  					onPress ={this.goSelectPage}
	                  />
		                {
		                	(defaultvalueArray.length == 0) ?
		                		null
		                	:
	      		                <Icon 
	      							name  ="trash" 
	      							style ={{fontSize:30, color: "#EA4C88"}}
	      							onPress={this.removeCheckItem}
	      		                />
		                }
		   		  	   {
		   		  	   	(this.props.data.requiredAlbert) ?
		   		  	   		<Icon name='alert' />
		   		  	   	:
		   		  	   		null
		   		  	   }
		            </Item>
		            </View>
		            <View style={{flex:1}}>
		            	<SortableList
							style                 ={{flex:1}}
							contentContainerStyle ={{width: this.props.style.PageSize.width}}
							data                  ={defaultvalueArray}
							renderRow             ={this.renderSortableRow} 
							onReleaseRow = {(key,currentOrder)=>{ this.changeDefaultvalueArray(currentOrder);}}
							renderFooter = {this.renderFooter}
		            	/>
		            </View>
	            </View>
			);
		} else {
			//整理tags的資料格式
			let tagsArray = [];
			let defaultvalue = this.props.data.defaultvalue;
			defaultvalue = (defaultvalue.lenght == 0) ? [] : defaultvalue;
			for(let value of defaultvalue){
				tagsArray.push(value.COLUMN2);
			}
			let tags = { tag: '', tagsArray: tagsArray }

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

		return renderItem;
	}

	renderSortableRow = ({key, index, data, disabled, active}) => {
	  return <SortableRow 
	  			data={data} 
	  			active={active} 
	  			index={index}
				onCheckBoxTap = {this.onCheckBoxTap}
	  		/>
	}

	changeDefaultvalueArray = (currentOrder) => {
		let array = [];
		for(let index of currentOrder){
			index = parseInt(index);
			array.push(this.props.data.defaultvalue[index]);
		}
		this.props.onPress(array, this.props.data);
	}

	onCheckBoxTap = (index, data) => {
		let array = this.props.data.defaultvalue;
		array[index].checked = !array[index].checked;
		this.props.onPress(array, this.props.data);
	}

	removeCheckItem = () => {
		let array = [];
		for(let item of this.props.data.defaultvalue){
			if (item.checked == false) {
				array.push(item);
			}
		}
		this.props.onPress(array, this.props.data);
	}

	renderFooter = () => {
		let reorderInfo = null
		if(this.props.data.defaultvalue.length != 0){
			reorderInfo = (
				<View style={{flexDirection: 'row', padding: 20, alignItems: 'center', justifyContent: 'center'}}>
					<Label>{`${this.props.lang.FormSign.LongPress} `}</Label>
            		<Icon name={"reorder-two"}/>
					<Label>{` ${this.props.lang.FormSign.ReorderSequence}`}</Label>
				</View>
			);
		}
		return (
			<View style={{width: '100%'}}>
				{reorderInfo}
			</View>
		);
	}

	goSelectPage = () => {
		NavigationService.navigate("FormContentChkWithAction", {
		  data: this.props.data,
		  onPress:this.showSelectedArray
		});
	}

	showSelectedArray = (array) => {
		this.props.onPress(array, this.props.data);
	}

	// deep clone
	deepClone(src) {
	  return JSON.parse(JSON.stringify(src));
	}
}

export default connectStyle( 'Component.FormContent', {} )(FormContentChkWithAction);
