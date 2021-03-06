import React, { Component } from 'react';
import { Container, Header, Left, Content, Right, Item, Label, Input, Body, Card, CardItem, Title, Button, Icon, Text, CheckBox, Toast, connectStyle, Spinner } from 'native-base';
import { View, FlatList, TextField, Alert, Platform, AlertIOS }from 'react-native';
import FormInputContent                   from './FormInputContent';
import FormInputContentGridLabel          from './FormInputContentGridLabel';
import FormContentGridForEvaluationButton from './FormContentGridForEvaluationButton';
import * as NavigationService             from '../../utils/NavigationService';
import FormUnit                           from '../../utils/FormUnit';

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
		let isShowTabButtons = this.state.data.listButton.length == 0 ? false : true;
		let tabButtons = [];
		for(let i in this.state.data.listButton){
			switch(this.state.data.listButton[i].columntype) {
			  case "btn":
			    tabButtons.push(
			    	<FormContentGridForEvaluationButton
			    		iconId = {this.state.data.listButton[i].component.id}
			    		label={this.state.data.listButton[i].component.name}
			    		onPress = {()=>{
			    			this.activeColumnaction(this.state.data.listButton[i], i);
			    		}} 
			    	/>
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
		this.props.formActions.reloadFormContentIntoState_fromGetColumnactionValue(
			this.props.user, 
			button,
			this.props.formContent
		);
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
				data :this.deepClone(nextProps.data),
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
	            		style={{
							borderBottomWidth: 0, 
							borderWidth      : 5,
							// paddingTop       : showLabelname ? 15: 0, 
							// paddingBottom    : 15, 
	            		}} 
	            		error={this.props.data.requiredAlbert}
	            	>
		                {/*
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
		                */}


		                {  	/*控制顯示表格上方的按鈕*/
		                	(this.state.isShowTabButtons) ? 
        		                this.state.tabButtons
		                	:
		                	 	null
		                }

		                <Body style={{flexDirection: 'row', alignContent: 'flex-end', justifyContent: 'flex-end' }}>
		                {
		                	(this.state.loadingMark) ? 
        		                <Label style={{textAlign: 'right'}}>{this.props.lang.ListFooter.Loading}</Label>
		                	:
		                		null
		                }
		                {
		                	(this.state.loadingMark) ? 
        		                <Spinner  style={{height: 30}}/>
		                	:
		                		null
		                }
		                {
		                	(this.state.data.enableCreateData != false && !this.state.loadingMark) ? 
        		                <Icon 
        							name  ="add-circle" 
        							type  ="MaterialIcons" 
        							style ={{fontSize:30, color: '#20b11d'}}
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
		            		<View style={{borderRadius: 10, borderWidth:0.6, borderColor:"#D9D5DC", width: '100%', }}>
		            			<FlatList
									keyExtractor           = {(item, index) => index.toString()}
									extraData              = {this.state}
									data                   = {this.props.data.defaultvalue.slice(0,3)}
									renderItem             = {this.rendercheckItem}
									ItemSeparatorComponent = {this.renderSeparator}
									ListFooterComponent    = {this.props.data.defaultvalue.length > 3 ? this.renderFooter : null}    //尾巴
		            			/>
		            		</View>
		            }
	            </View>
			);
		} else {
			let value = this.props.lang.Common.None;
			let defaultvalue = ( this.props.data.defaultvalue == null ) ? [] : this.props.data.defaultvalue;
			if ( defaultvalue.length == 0 ) {
				renderItem =
					<Item 
						fixedLabel 
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
		       	renderItem = (
					<View style={{width: '100%'}}>
	            		<View style={{borderRadius: 10, borderWidth:0.6, borderColor:"#D9D5DC", width: '100%', }}>
	            			<FlatList
								keyExtractor           = {(item, index) => index.toString()}
								extraData              = {this.state}
								data                   = {this.props.data.defaultvalue.slice(0,3)}
								renderItem             = {this.rendercheckItem}
								ItemSeparatorComponent = {this.renderSeparator}
								ListFooterComponent    = {this.props.data.defaultvalue.length > 3 ? this.renderFooter : null}    //尾巴
	            			/>
	            		</View>
					</View>
		       	)	
			}
		}

		return renderItem;
	}

	// 顯示前三筆的編輯畫面
	rendercheckItem = (item) => {
		let index = item.index;
		item = item.item;
		let labels = [];

		for (let i in item) {
			if(item[i].outsidevisible == "Y"){	// 沒有值得話不做顯示
				labels.push(<FormInputContentGridLabel key={i} data={item[i]}/>);
			}
		}

		if (this.state.editable) {
			return (
				<Body style={{
					flexDirection: 'row', 
					marginTop: 10, 
					marginBottom: 10, 
					width: '90%'
				}}>
					{
						(this.state.data.enableDeleteData || typeof this.state.data.enableDeleteData == "undefined" ) ? 
							<Left style={{flex:0, paddingRight: 30, borderWidth: 0}}>
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
							</Left>
						:
							null
					}
					<Body style={{alignItems: 'flex-start'}}>
						{labels}
					</Body>
					<Right style={{flex:0}}>
		                <Icon 
							name  ="create" 
							style ={{fontSize:30, color: "#aaa"}}
		                	onPress={()=>{
		                		let data = this.deepClone(this.props.data);
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

		this.setState({ 
			loadingMark:false,
		});
		
		NavigationService.navigate("FormInputContentGridPage", {
			formContent 	  : this.props.formContent,
			propsData         : this.props.data,
			data              : data,
			lang              : this.props.lang, 
			user              : this.props.user,
			confirmOnPress    : this.confirmFormData,
			editCheckItemIndex: editCheckItemIndex
		});
	}

	// 確認編輯後的資料驗證與上傳至APP state做資料更新
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
			this.setState({ editCheckItemRecord: array });
		}
		// 送值
		await this.props.onPress(this.deepClone(value), this.props.data);
		this.modalWrapperClose(value);
	}
	
	// 顯示底部可編輯畫面
	renderFooter = () => {
		return (
			<View>
				<View style={[this.props.style.Separator, {width: '90%', alignSelf: 'center'}]}/>
				<CardItem 
					button						
					style={{flexDirection: 'row', alignItems: 'flex-start'}}
					onPress = {()=>{
						NavigationService.navigate("FormContentGridDataTable", { 
							propsData        : this.props.data,
							data             : this.props.data,
							lang             : this.props.lang, 
							user             : this.props.user,
							confirmAllOnPress: this.confirmAllOnPress,
							formContent      : this.props.formContent,
							editable 		 : this.state.editable
						});
					}}
				>
					<Text>{this.props.lang.Common.ViewMore}</Text>
				</CardItem>
			</View>
		);
	}

	confirmAllOnPress = async (formValues) => {
		// 將listComponent變成最原本的樣子
		formValues.listComponent = this.deepClone(this.props.data.listComponent);
		// 自己的state做改變
		this.setState({
			data:formValues
		});
		// 送值
		this.props.onPress(this.deepClone(formValues), this.props.data);
	}

	modalWrapperClose = (value) => {
		// this.state.data 變回原本的state
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
					data.listComponent[i].defaultvalue = (unShowColumn.value == "") ? data.listComponent[i].defaultvalue : unShowColumn.value;
					data.listComponent[i].paramList    = unShowColumn.paramList;
					data.listComponent[i].show         = (unShowColumn.visible || unShowColumn.visible == "true") ? true : false;
					data.listComponent[i].required     = (unShowColumn.required) ? "Y" : "F";
				}
			}
			
			let columnactionValue = await FormUnit.getColumnactionValue(
				this.props.user, 
				data.listComponent[i], 
				data.listComponent,
				this.props.formContent
			);   // 取得該欄位欲隱藏的欄位

			unShowColumns = unShowColumns.concat(columnactionValue.columnList);

			data.listComponent[i].actionValue = await FormUnit.getActionValue(
				this.props.user, 
				data.listComponent[i], 
				this.props.data.listComponent
			);	// 取得該欄位的動作
			
		}
		
		return data;
	}
}

export default connectStyle( 'Component.FormContent', {} )(FormContentGridForEvaluation);
