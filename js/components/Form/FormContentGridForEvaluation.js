import React, { Component } from 'react';
import { Container, Header, Left, Content, Right, Item, Label, Input, Body, Card, CardItem, Title, Button, Icon, Text, CheckBox, Toast, connectStyle, Spinner } from 'native-base';
import { View, FlatList, TextField, Alert, Platform, AlertIOS }from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FormInputContent          from './FormInputContent';
import FormInputContentGridLabel from './FormInputContentGridLabel';
import * as NavigationService         from '../../utils/NavigationService';
import FormUnit                  from '../../utils/FormUnit';

class FormContentGridForEvaluation extends Component {
	constructor(props) {
		super(props);
		// FormInputGrid類不將editable移至render裡，因為有其他function要用到this.state.editable
		let editable = props.editable;
		if (editable == null) {
			if (typeof props.data.isedit != "undefined") {
				editable = (props.data.isedit == "Y") ? true : false;
			} else {
				editable = false;
			}
		}

		// 名稱、值、參數、能否編輯、強制編輯、欄位資料	
		this.state = {
			labelname          : props.data.component.name,
			editable           : editable,
			data               : this.deepClone(props.data), // 深層複製,
			editCheckItem      : false,
			editCheckItemIndex : -1,
			editCheckItemRecord: [], // 用來記錄被checkBox勾選的項目值是true/false 例如[true, false, false],
			loadingMark        : false,
			isShowTabButtons   : false, // 要不要顯示表格資料上方的按鈕
			tabButtons 		: []
		};
	}

	componentDidMount(){
		// 處理載入上期按鈕
		let isShowTabButtons = this.state.data.listButtons.length == 0 ? false : true;
		let tabButtons = [];
		for(let i in this.state.data.listButtons){
			switch(this.state.data.listButtons[i].columntype) {
			  case "btn":
			    tabButtons.push(
			    	<Button 
			    		iconLeft 
			    		bordered
			    		onPress = {()=>{
			    			this.activeColumnaction(this.state.data.listButtons[i], i);
			    		}} 
			    	>
	    				<Icon name='cloud-download-outline' />
	    	            <Text>載入前期分數</Text>
	    	        </Button>
    			);
			    break;
			  default:
			    break;
			}
		} 

		this.setState({
			isShowTabButtons : isShowTabButtons,
			tabButtons : tabButtons
		});
	}

	activeColumnaction = async (button, index) => {
		console.log(button, index, this.props.data);
		/*
		let columnactionValue = await FormUnit.getColumnactionValueForButton(
			this.props.user, 
			this.state.data.listComponent,
			button,
			this.props.data.listComponent
		);
		console.log("columnactionValue", columnactionValue);
		*/
	}

	shouldComponentUpdate(nextProps, nextState) {
		nextProps.data.defaultvalue = (nextProps.data.defaultvalue == null) ? [] : nextProps.data.defaultvalue; 
		nextState.data.defaultvalue = (nextState.data.defaultvalue == null) ? [] : nextState.data.defaultvalue;
		
		if (nextProps.data.defaultvalue.length !== nextState.data.defaultvalue.length) {

			let editCheckItemRecord = [];
			for(let i = 0; i<nextProps.data.defaultvalue.length; i++){
				editCheckItemRecord.push(false);
			}

			this.setState({
				data:this.deepClone(nextProps.data),
				editCheckItemRecord:editCheckItemRecord
			});
		}
		return true;
	}

	render() {
		let required = (this.props.data.required == "Y") ? "*" : "  ";
		let renderItem = null;
		let showLabelname = (this.state.labelname == "null" || this.state.labelname == null) ? false : true;
		if (this.state.editable) {
			renderItem = (
				<View style={{width: '100%'}}>
	            	<Item 
	            		fixedLabel 
	            		style={{borderBottomWidth: 0, paddingTop: showLabelname ? 15: 0, paddingBottom: 15, borderWidth: 5 }} 
	            		error={this.props.data.requiredAlbert}
	            	>
		                {
		                	(showLabelname) ? 
        		                <Label style={{flex: 0, color:"#FE1717"}}>{required}</Label>
		                	:
		                		null
		                }

		                {
		                	(showLabelname) ? 
		  						<Label>{this.state.labelname}</Label>
		                	:
		                		null
		                }

		                {
		                	(this.state.loadingMark) ? 
        		                <Label style={{textAlign: 'right'}}>{this.props.lang.ListFooter.Loading}</Label>
		                	:
		                		null
		                }

		                {
		                	(this.state.loadingMark) ? 
        		                <Spinner  style={{height: 32}}/>
		                	:
		                		null
		                }

		                {  	/*控制顯示表格上方的按鈕*/
		                	(this.state.isShowTabButtons) ? 
        		                this.state.tabButtons
		                	:
		                	 	null
		                }

		                <Body style={{flexDirection: 'row', alignContent: 'flex-end', justifyContent: 'flex-end' }}>
		                {
		                	(this.state.data.enableCreateData != false && !this.state.loadingMark) ? 
        		                <Icon 
        							name  ="add-circle" 
        							type  ="MaterialIcons" 
        							style ={{fontSize:30, color: '#20b11d'}}
        		                	// onPress={this.getEditField}
        		                	onPress={()=>{this.showEditModal(this.state.data)}}
        		                />
		                	:
		                		null
		                }

		                {
		                	(this.state.editCheckItemRecord.length == 0 || this.state.data.enableCreateData == false) ?
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
		                </Body>
		            </Item>

		            {
		            	( this.props.data.defaultvalue == null || this.props.data.defaultvalue.length == 0  ) ?
         					<Item fixedLabel error={this.props.data.requiredAlbert}/>
		            	:
		            		<View style={{borderRadius: 10, borderWidth:0.6, borderColor:"#D9D5DC", width: '98%', }}>
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
			let value = this.props.lang.Common.None;
			let defaultvalue = ( this.props.data.defaultvalue == null ) ? [] : this.props.data.defaultvalue;
			if ( defaultvalue.length == 0 ) {
				renderItem =
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
					    	multiline 
					    	value={value} 
					    	editable={this.state.editable} 
					    	style={{textAlign: 'right'}}
					    />
					  </Item>
			} else {
				renderItem =
					<View style={{width: '100%'}}>
		            	<Item fixedLabel style={{borderBottomWidth: 0, paddingTop: 15, paddingBottom: 15}}>
			 			  	<Label style={{flex: 0, color:"#FE1717"}}>{required}</Label>
			                <Label>{this.state.labelname}</Label>
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
			// 沒有值得話不做顯示
			if(item[i].defaultvalue !== null) labels.push(<FormInputContentGridLabel key={i} data={item[i]}/>);
		}

		if (this.state.editable) {
			return (
				<Body style={{flexDirection: 'row', paddingLeft: 5, paddingRight: 20, marginTop: 10, marginBottom: 10}}>
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
					<Body style={{alignItems: 'flex-start'}}>
						{labels}
					</Body>
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

	showEditModal = async (data, editCheckItemIndex = -1) => {
		this.setState({loadingMark:true});

		//檢視一下要編輯的項目有沒有進行過可編輯化
		if (!data.listComponent[0].hasOwnProperty("show")) {
			data = await this.editablelize(data);
		}

		this.setState({ loadingMark:false });


		NavigationService.navigate("FormInputContentGridPage", {
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
			value.defaultvalue[this.state.editCheckItemIndex] = this.deepClone(value.listComponent);
		} else {
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
		await this.props.onPress(this.deepClone(value), this.props.data);

		this.modalWrapperClose();
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

	editablelize = async (data) => {
		let unShowColumns	 = []; 	//暫時紀錄不顯示的欄位
		for(let i in data.listComponent){
			data.listComponent[i].show = true; 	   		   		// 該欄位要不要顯示
			data.listComponent[i].requiredAlbert = false; 	    // 該欄位空值警告
			
			for(let unShowColumn of unShowColumns){
				if (unShowColumn.id == data.listComponent[i].component.id) {
					data.listComponent[i].defaultvalue = unShowColumn.value;
					data.listComponent[i].paramList    = unShowColumn.paramList;
					data.listComponent[i].show         = (unShowColumn.visible || unShowColumn.visible == "true") ? true : false;
					data.listComponent[i].required     = (unShowColumn.required) ? "Y" : "F";
				}
			}
			let columnactionValue = await FormUnit.getColumnactionValue(this.props.user, data.listComponent[i], this.props.data.listComponent);   // 取得該欄位欲隱藏的欄位
			unShowColumns = unShowColumns.concat(columnactionValue);
			data.listComponent[i].actionValue = await FormUnit.getActionValue(this.props.user, data.listComponent[i], this.props.data.listComponent);	// 取得該欄位的動作
		}
		return data;
	}
}

export default connectStyle( 'Component.FormContent', {} )(FormContentGridForEvaluation);
