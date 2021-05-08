import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Alert}from 'react-native';
import { Container, Content, Header, Left, Right, Item, Label, Body, Title, Button, Icon, Text, connectStyle } from 'native-base';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import * as NavigationService from '../../utils/NavigationService';
import HeaderForGeneral from '../HeaderForGeneral';
import FormUnit from '../../utils/FormUnit';

// 資料欄位輸入錯誤，跳回上一個數值問題
class FormContentGridDataTablePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			labelname         : props.route.params.data.component.name,
			preData           : this.deepClone(this.props.route.params.data), // 深層複製
			data              : this.deepClone(this.props.route.params.data), // 深層複製
			lang              : this.props.route.params.lang,
			user              : this.props.route.params.user,
			confirmAllOnPress : this.props.route.params.confirmAllOnPress,

			widthArr          : [60, 80, 60, 70, 65, 65, 65, 65, 90, 105, 65, 100, 40],

			editCheckItem     : false,
			editCheckItemIndex: -1,
			isTextEditing 	  : false,
			editingPosition   : {},
		};
	}

	render() {
		let tableHead = ["動作"];
		for(let i in this.state.data.listComponent){
			if(this.state.data.listComponent[i].columntype != "hidetxt"){
				tableHead.push(this.state.data.listComponent[i].component.name);
			}
		}

		let tableData = [];
		for(let i in this.state.data.defaultvalue){
			const rowData = [ this.renderEditButton( this.state.data.defaultvalue[i], i ) ];

			for(let j in this.state.data.defaultvalue[i]){
				if (this.state.data.defaultvalue[i][j].columntype != "hidetxt") {
					if (this.state.data.defaultvalue[i][j].isedit == "Y") {
						rowData.push(this.renderInput(this.state.data.defaultvalue[i][j], i, j));
					} else {
						rowData.push(this.state.data.defaultvalue[i][j].defaultvalue);
					}

				}
			}
			tableData.push(rowData);
		}
		
		return (
			<Container>
				<HeaderForGeneral
				  isLeftButtonIconShow  = {true}
				  leftButtonIcon        = {{name:"arrow-back"}}
				  leftButtonOnPress     = {() =>{
				  	// 返回時如果必填欄位未填，需要提示“有必填欄位未填”字樣，但是依舊可以返回
				  	this.goBackWithRequiredCheck();
				  }} 
				  isRightButtonIconShow = {false}
				  rightButtonIcon       = {null}
				  rightButtonOnPress    = {null} 
				  title                 = {this.state.labelname}
				  isTransparent         = {false}
				/>
				
				<KeyboardAwareScrollView horizontal={true}>
					<View>
						<Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
						  <Row 
								data      ={tableHead} 
								widthArr  ={this.state.widthArr} 
								style     ={{ backgroundColor: this.props.style.MainPageBackground.backgroundColor }} 
								textStyle ={{
									marginTop   : 10, 
									marginBottom: 10, 
									textAlign   : 'center',
									color       : this.props.style.InputFieldBackground
								}}
						  />
						</Table>
						<KeyboardAwareScrollView>
							<Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
								{
									tableData.map((rowData, index) => {
										return(
											<Row
												key       ={index}
												data      ={rowData}
												widthArr  ={this.state.widthArr}
												style     ={[{ backgroundColor: '#FFF'}, index%2 && { backgroundColor: '#E3F2FD' }]}
												textStyle ={{ 
													textAlign   : 'center', 
													fontWeight  : '100',
													marginTop   : 10, 
													marginBottom: 10, 
													color       : '#000'
												}}
											/>
										)
									})
								}
							</Table>
						</KeyboardAwareScrollView>
		      		</View>
		      	</KeyboardAwareScrollView>

			</Container>
		)
	}

	// 點擊跳頁的按鈕
	renderEditButton = (indexData, index) => {
		return(
			<TouchableOpacity onPress={ async () =>{ 
				let data = this.state.data;
		        data.listComponent = this.deepClone(indexData); 

				if (!data.listComponent[0].hasOwnProperty("show")) {
					data = await this.editablelize(data);
				}

        		this.setState({
					editCheckItem     : true,
					editCheckItemIndex: index,
        		});
				
				NavigationService.navigate("FormInputContentGridPage", {
					propsData         : this.props.route.params.data,
					data              : data,
					lang              : this.state.lang, 
					user              : this.state.user,
					confirmOnPress    : this.confirmFormData,
					editCheckItemIndex: index,
				});
				
			}}>
			    <View style={{flex:1, alignContent: 'center', justifyContent: 'center'}}>
			      <Icon name='create' style ={{color: "#aaa", alignSelf: 'center'}} />
			    </View>
			</TouchableOpacity>
		);
	}

	// 點擊跳頁後的值更新，只更新本地state
	confirmFormData = async ( value ) => {
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
		value.listComponent = this.deepClone(this.props.route.params.data.listComponent);

		this.setState({
			preData           : this.deepClone(value),
			data              : this.deepClone(value),
			editCheckItem     : false,
			editCheckItemIndex: -1,
		});
		// 送值
	}

	// 直接在表格輸入
	renderInput = (data, rowIndex, columnIndex) => {
		let isValueExist = data.defaultvalue == "" || data.defaultvalue == " " || data.defaultvalue == null ? false : true;

		if (data.columntype == "txt") {
			let component = null;

			if (
				this.state.isTextEditing && 
				rowIndex == this.state.editingPosition.rowIndex &&
				columnIndex == this.state.editingPosition.columnIndex
			) {
				component = (
					<TextInput
						style        = {{ 
							flex       : 1, 
							borderColor: data.required == "Y" && !isValueExist ? "red" : 'gray', 
							borderWidth: data.required == "Y" && !isValueExist ? 1 : 0,
						}}
						keyboardType = {data.columntype == "number" ? "numeric" : "default"}
						textAlign    = {"right"}
						value        = {data.defaultvalue}
						onChangeText = {text => this.updateStateDefaultValue(text, rowIndex, columnIndex) }
						onEndEditing = {text => {
							this.setState({
								isTextEditing: false,
								editingPosition: null
							});
							this.confirmStateDefaultValue(text.nativeEvent.text, rowIndex, columnIndex);
						}}
						autoFocus = {true}
				    />
				);
			} else {
				component = (
					<View
						style={{
							flex          : 1,
							justifyContent: 'center', 
							borderColor   : data.required == "Y" && !isValueExist ? "red" : 'gray', 
							borderWidth   : data.required == "Y" && !isValueExist ? 1 : 0,
						}}
					>
						<Label
							onPress={()=>{
								this.setState({
									isTextEditing: true,
									editingPosition: {
										rowIndex   :rowIndex,
										columnIndex:columnIndex
									}
								});
							}}
							style={{ textAlign : 'right' }}
						>
							{data.defaultvalue}
						</Label>
					</View>
				)
			}

			return component;
		} else {
			return(
				<TextInput
					style        = {{ 
						flex       : 1, 
						borderColor: data.required == "Y" && !isValueExist ? "red" : 'gray', 
						borderWidth: data.required == "Y" && !isValueExist ? 1 : 0,
					}}
					keyboardType = {data.columntype == "number" ? "numeric" : "default"}
					textAlign    = {"right"}
					value        = {data.defaultvalue}
					onChangeText = {text => this.updateStateDefaultValue(text, rowIndex, columnIndex) }
					onEndEditing = {text => this.confirmStateDefaultValue(text.nativeEvent.text, rowIndex, columnIndex)}
			    />
			);
		}
	}

	// 輸入完資料直接更新本地state
	updateStateDefaultValue = (text, rowIndex, columnIndex) => {
		let data = this.state.data;
		data.defaultvalue[rowIndex][columnIndex].defaultvalue = text;
		this.setState({
			data:data
		});
	}

	// 輸入完成後進行資料驗證,必填欄位用紅匡表示,只更新本地state
	confirmStateDefaultValue = async (value, rowIndex, columnIndex) => {
		let data = this.deepClone(this.state.data);
		let item = data.defaultvalue[rowIndex][columnIndex];

		value = value == "" ? item.defaultvalue:value ;
		// 欄位自己的規則比較
		let ruleCheck = await FormUnit.formFieldRuleCheck(
			value,
			item,
			data.defaultvalue[rowIndex],
			item.columntype
		);
		
		if (ruleCheck != true) {
			Alert.alert(
				this.state.lang.CreateFormPage.WrongData,
				ruleCheck.message, [{
					text: this.state.lang.CreateFormPage.GotIt,
					onPress: () => {
						// 修改回原來的值
						this.setState({
							data:this.deepClone(this.state.preData)
						});
					}
				}], {
					cancelable: false
				}
			)
		} else {
			// 判斷是否有url 的 action動作
			let columnactionValue = await FormUnit.getColumnactionValue(
				this.state.user,
				item,
				data.defaultvalue[rowIndex]
			);

			// 判斷該值是否填寫表單中顯示
			data.defaultvalue[rowIndex] = FormUnit.checkFormFieldShow(
				columnactionValue,
				data.defaultvalue[rowIndex]
			);

			this.setState({
				data:this.deepClone(data),
				preData:this.deepClone(data)
			});
		}
	}

	// 必填欄位的提示，離開表格時也需要提示
	// 返回時直接更新APP state的資料
	goBackWithRequiredCheck(){
		let isGoBack = true;

		for(let [i, defaultvalue] of this.state.data.defaultvalue.entries() ){
			for(let [j, column] of defaultvalue.entries() ){
				if ( 
					column.columntype != "hidetxt" &&
					column.required == "Y" && 
					column.defaultvalue == "" || 
					column.defaultvalue == null 
				) {
					isGoBack = false;
					Alert.alert(
						"有必填資料未填",
						`"第${i+1}筆"的"${column.component.name}"欄位為必填資料，請填寫完成後再返回當前畫面！`,
						[
							{
							  	text: "去填寫",
							  	style: "cancel",
							  	onPress: () => {
							  		this.setState({
							  			isTextEditing: true,
							  			editingPosition: {
							  				rowIndex   :i,
							  				columnIndex:j
							  			}
							  		});
							  	}
							},
							{ 
								text: "堅決返回", 
								style: "destructive",
								onPress: () => {
									this.state.confirmAllOnPress(this.state.data);
									NavigationService.goBack();
								}
							}
						]
					);
					break;
				}
			}
		}

		if (isGoBack) {
			this.state.confirmAllOnPress(this.state.data);
			NavigationService.goBack();	
		}
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
			let columnactionValue = await FormUnit.getColumnactionValue(this.state.user, data.listComponent[i], this.state.data.listComponent);   // 取得該欄位欲隱藏的欄位
			unShowColumns = unShowColumns.concat(columnactionValue);
			data.listComponent[i].actionValue = await FormUnit.getActionValue(this.state.user, data.listComponent[i], this.state.data.listComponent);	// 取得該欄位的動作
		}
		return data;
	}

	// deep clone
	deepClone(src) {
		return JSON.parse(JSON.stringify(src));
	}
}

export default connectStyle( 'Component.FormContent', {} )(FormContentGridDataTablePage);
