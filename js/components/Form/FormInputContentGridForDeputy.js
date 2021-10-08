import React, { Component } from 'react';
import { Container, Header, Left, Content, Right, Item, Label, Input, Body, Card, CardItem, Title, Button, Icon, Text, CheckBox, Toast, connectStyle } from 'native-base';
import { View, FlatList, TextField, Alert, Platform, AlertIOS }from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FormInputContent          from './FormInputContent';
import FormInputContentGridLabel from './FormInputContentGridLabel';
import * as NavigationService         from '../../utils/NavigationService';
import FormUnit                  from '../../utils/FormUnit';

class FormInputContentGridForDeputy extends Component {
	constructor(props) {
		super(props);
		let data = this.deepClone(props.data);
		let arrEditCheckItemRecord = [];
		for(let i=0 ; i<data.defaultvalue.length ; i++){
			arrEditCheckItemRecord.push(false);
		}

		// 名稱、值、參數、能否編輯、強制編輯、欄位資料	
		this.state = {
			data: data,
			editCheckItem: false,
			editCheckItemIndex: -1,
			editCheckItemRecord: arrEditCheckItemRecord, // 用來記錄被checkBox勾選的項目值是true/false 例如[true, false, false],
		};
	}

	// shouldComponentUpdate(nextProps, nextState) {
	// 	nextProps.data.defaultvalue = (nextProps.data.defaultvalue == null) ? [] : nextProps.data.defaultvalue; 
	// 	nextState.data.defaultvalue = (nextState.data.defaultvalue == null) ? [] : nextState.data.defaultvalue;		
	// 	// 新增资料
	// 	if (nextProps.data.defaultvalue.length !== nextState.data.defaultvalue.length) {
	// 		let arrEditCheckItemRecord = [];
	// 		for(let i = 0; i<nextProps.data.defaultvalue.length; i++){
	// 			arrEditCheckItemRecord.push(false);
	// 		}
	// 		this.setState({
	// 			data:this.deepClone(nextProps.data),
	// 			editCheckItemRecord:arrEditCheckItemRecord
	// 		});
	// 	}
	// 	return true;
	// }

	render() {
		let editable = this.props.editable;
		if (editable == null) {
			if (typeof this.props.data.isedit != "undefined") {
				editable = (this.props.data.isedit == "Y") ? true : false;
			} else {
				editable = false;
			}
		}

		let required = (this.props.data.required == "Y") ? "*" : "  ";
		let renderItem = null;
		if (editable) {
		// 多规则代理可编辑时
			// 是否显示删除按钮
			let del = false;	// 显示删除按钮注记
			const arrEditCheckItemRecord = this.state.editCheckItemRecord;
			for(let j in arrEditCheckItemRecord){
				if(arrEditCheckItemRecord[j]){
					del = true;
					break;
				}
			}
			renderItem = (
				<View style={{width: '100%'}}>
					{/* 多规则代理title */}
	            	<Item
	            		fixedLabel 
	            		style={{borderBottomWidth: 0, paddingTop: 15, paddingBottom: 15}} 
	            		error={this.props.data.requiredAlbert}
	            	>
						{/* 必填星号 */}
		 			  	<Label style={{flex: 0, color:"#FE1717"}}>{required}</Label>
						{/* 多规则代理 */}
		                <Label>{this.props.data.component.name}</Label>
						{/* 加号按钮 */}
		                {
		                	(this.state.data.enableCreateData != false) ? 
        		                <Icon 
        							name  ="add-circle" 
        							type  ="MaterialIcons" 
        							style ={{fontSize:30, color: '#20b11d'}}
        		                	onPress={ async ()=>{
										this.setState({
											editCheckItem     : false,
											editCheckItemIndex: -1,
										});
        		                		let data = this.state.data;
        		                		// 直接開啟編輯葉面
										this.showEditModal(data, -1);
        		                	}}
        		                />
		                	:
		                		null
		                }
						{/* 删除按钮 */}
		                {
							((!del) || this.state.data.enableCreateData == false) ?
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

					{/* 多规则代理列表 */}
		            {
		            	( this.props.data.defaultvalue == null || this.props.data.defaultvalue.length == 0  ) ?
         					<Item fixedLabel error={this.props.data.requiredAlbert}/>
		            	:
		            		<View style={{borderRadius: 10, borderWidth:0.6, borderColor:"#D9D5DC", width: '98%'}}>
		            			<FlatList
		            				keyExtractor={(item, index) => index.toString()}
        							extraData     = {this.state}
		            				data          = {this.props.data.defaultvalue}
		            				renderItem    = {this.rendercheckItem}
									ItemSeparatorComponent ={this.renderSeparator}
		            			/>
		            		</View>
		            }

		            {/*顯示編輯畫面*/}
		            {/*this.state.showEditModal ? this.showEditModal() : null*/}
	            </View>
			);
		} else {
		// 多规则代理不可编辑时
			let defaultvalue = ( this.props.data.defaultvalue == null ) ? [] : this.props.data.defaultvalue;
			if ( defaultvalue.length == 0 ) {
			// 列表资料为空时
				let value = this.props.lang.Common.None;
				renderItem =
					<Item fixedLabel 
						style={[
							this.props.style.CreateFormPageFiledItemWidth,
							this.props.style.fixCreateFormPageFiledItemWidth
						]}
					>
			 			<Label style={{flex: 0, color:"#FE1717"}}>{required}</Label>
					  	<Label style={{flex: 0}}>{this.props.data.component.name}</Label>
					    <Input 
  				    		scrollEnabled = {false}
					    	multiline 
					    	value={value} 
					    	editable={editable} 
					    	style={{textAlign: 'right'}}
					    />
					</Item>
			} else {
			// 列表资料不为空时
				renderItem =
					<View style={{width: '100%'}}>
		            	<Item fixedLabel style={{borderBottomWidth: 0, paddingTop: 15, paddingBottom: 15}}>
			 			  	<Label style={{flex: 0, color:"#FE1717"}}>{required}</Label>
			                <Label>{this.props.data.component.name}</Label>
			            </Item>
	            		<View style={{borderRadius: 10, borderWidth:0.6, borderColor:"#D9D5DC", width: '98%'}}>
	            			<FlatList
  				    			scrollEnabled = {false}
	            				keyExtractor={(item, index) => index.toString()}
								extraData     = {this.state}
	            				data          = {this.props.data.defaultvalue}
	            				renderItem    = {this.rendercheckItem}
								ItemSeparatorComponent ={this.renderSeparator}
	            			/>
	            		</View>
		            </View>
			}
		}

		return renderItem;
	}

	rendercheckItem = (item) => {
		let index = item.index;
		item = item.item;
		let labels = [];
		for (let i in item) {
			let itemCom = (item[i].columntype == "deputytxt" || item[i].columntype == "txtwithaction") ?
				<View style = {{width: '100%', flexDirection: 'row'}}>
					<View style={{flex:2.8}}>
						<Label>{`${item[i].component.name}`}</Label>
					</View>
					<Label>:</Label>
					<View style={{flex:6.3}}>
						<Label>{`${item[i].defaultvalue}`}</Label>
					</View>
				</View>
			:
				null
			labels.push(itemCom);
		}

		if (this.props.editable) {
			return (
				<Body style={{flexDirection: 'row', paddingLeft: 5, paddingRight: 20, marginTop: 10, marginBottom: 10}}>
					{/* CheckBox多选按钮 */}
					<Left style={{flex:0, paddingRight: 30}}>
					{
						(this.state.data.enableDeleteData || typeof this.state.data.enableDeleteData == "undefined" ) ? 
							<CheckBox 
								checked={this.state.editCheckItemRecord[index]} 
								color={this.state.editCheckItemRecord[index] ? "#EA4C88" : "#aaa" } 
								onPress={(e)=>{
									let array = this.state.editCheckItemRecord;
									array[index] = !this.state.editCheckItemRecord[index]; 
									this.setState({
										editCheckItemRecord:array
									});
								}} 
							/>
						:
							null
					}
					</Left>
					{/* 文字 */}
					<Body style={{alignItems: 'flex-start'}}>
						{labels}
					</Body>
					{/* 编辑按钮 */}
					<Right style={{flex:0}}>
		                <Icon 
							name  ="create" 
							style ={{fontSize:30, color: "#aaa"}}
		                	onPress={()=>{
		                		let data = this.state.data;
		                		data.listComponent = this.deepClone(item); 
		                		this.setState({
									editCheckItem     : true,
									editCheckItemIndex: index,
		                		});
								this.showEditModal(data, index)
		                	}}
		                />
					</Right>
				</Body>
			);
		} else {
			return (
				<Body style={{flexDirection: 'row', paddingLeft: 30, paddingRight: 20, marginTop: 10, marginBottom: 10}}>
					<Body style={{alignItems: 'flex-start'}}>
						{labels}
					</Body>
				</Body>
			)
		}
	}

	// 加号/编辑按钮点击事件
	showEditModal = (data, editCheckItemIndex = -1) => {
		NavigationService.navigate("FormInputContentGridPageForDeputy", {
			propsData         : this.props.data,
			data              : data,
			lang              : this.props.lang, 
			user              : this.props.user,
			confirmOnPress    : this.confirmFormData,
			editCheckItemIndex: editCheckItemIndex
		});
	}

	confirmFormData = async (value) => {
		if (this.state.editCheckItem) {
			// 编辑时点击确认按钮
			value.defaultvalue[this.state.editCheckItemIndex] = this.deepClone(value.listComponent);
		} else {
			// 新增时点击确认按钮
			// 將自己的值新增到 this.state.data 的 defaultvalue 裡面
			if (value.defaultvalue == null) {
				value.defaultvalue = [];
				value.defaultvalue.push(this.deepClone(value.listComponent));
			} else {
				value.defaultvalue.push(this.deepClone(value.listComponent));
			}

			let array = this.state.editCheckItemRecord;
			array = [...array, false];
			this.setState({
				editCheckItemRecord: array
			});
		}
		// 將listComponent變成最原本的樣子
		value.listComponent = this.deepClone(this.props.data.listComponent);
		// 送值
		await this.props.onPress(this.deepClone(value));

		// this.modalWrapperClose();

		this.setState({
			data: value,
			editCheckItem: false,
			editCheckItemIndex: -1,
		});
	}
	
	modalWrapperClose = () => {
		// this.state.data 變回原本的state
		let value = this.state.data;
		value.listComponent = this.deepClone(this.props.data.listComponent);
		this.setState({
			data: value,
			editCheckItem: false,
			editCheckItemIndex: -1,
		});
	}
	
	// 删除按钮点击事件
	removeCheckItem = () => {
		let data = this.state.data;
		let value = this.deepClone(this.props.data);
		let checkArray = this.state.editCheckItemRecord;

		// 剔除要刪除的資料
		for (let i = 0; i < checkArray.length; i++) {
			if (checkArray[i]) {
				data.defaultvalue.splice(i, 1);
				value.defaultvalue.splice(i, 1);
				checkArray.splice(i, 1);
				i--;
			}
		}
		this.props.onPress(value, this.props.data);

		// this.state.editCheckItemRecord 恢復剔除後的紀錄
		this.setState({
			data: data,
			editCheckItemRecord: checkArray
		});
	}

	renderSeparator = () => {
		return <View style={[this.props.style.Separator, {width: '90%', alignSelf: 'center'}]}/>;
	}

	// deep clone
	deepClone(src) {
		return JSON.parse(JSON.stringify(src));
	}
}

export default connectStyle( 'Component.FormContent', {} )(FormInputContentGridForDeputy);
