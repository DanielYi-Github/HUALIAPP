import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Alert, Keyboard}from 'react-native';
import { Container, Content, Header, Left, Right, Item, Label, Body, Title, Button, Icon, Text, connectStyle } from 'native-base';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'

import * as NavigationService from '../../utils/NavigationService';
import HeaderForGeneral from '../HeaderForGeneral';
import FormUnit from '../../utils/FormUnit';
import ToastUnit from '../../utils/ToastUnit';

// 資料欄位輸入錯誤，跳回上一個數值問題
class FormContentGridDataTablePage extends Component {
	constructor(props) {
		super(props);
		// let widthArrList = props.route.params.editable ? [27.5, 60]: [27.5];
		let widthArrList = [27.5];
		for (let component of props.route.params.data.listComponent) {
			if (component.columntype != "hidetxt") {
				widthArrList.push(65);
			}
		}
		
		this.state = {
			labelname         : props.route.params.data.component.name,
			preData           : this.deepClone(this.props.route.params.data), // 深層複製
			data              : this.deepClone(this.props.route.params.data), // 深層複製
			lang              : this.props.route.params.lang,
			user              : this.props.route.params.user,
			editable          : this.props.route.params.editable,
			confirmAllOnPress : this.props.route.params.confirmAllOnPress,

			widthArr          : widthArrList,
			editCheckItem     : false,
			editCheckItemIndex: -1,
			editValue 		  : "",
			isEditRowIndex	  :"",
			isEditColumnIndex :"" ,
			editingPosition   : {},
		};
	}

	render() {
		// let tableHead = this.state.editable ? [ "", this.state.lang.FormContentGridForEvaluation.tableAction ] : [""] ;
		let tableHead = [""] ;
		for(let i in this.state.data.listComponent){
			if(this.state.data.listComponent[i].columntype != "hidetxt"){
				tableHead.push(this.state.data.listComponent[i].component.name);
			}
		}

		let tableData = [];
		for(let i in this.state.data.defaultvalue){
			const rowData = [parseInt(i)+1];
			// const rowData = this.state.editable ? [ parseInt(i)+1, this.renderEditButton( this.state.data.defaultvalue[i], i ) ] : [parseInt(i)+1];

			for(let j in this.state.data.defaultvalue[i]){
				if (this.state.data.defaultvalue[i][j].columntype != "hidetxt") {
					if (this.state.data.defaultvalue[i][j].isedit == "Y" && this.state.editable) {
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
				<Header style={this.props.style.HeaderBackground}>
				  <Left>
				    <Button transparent onPress={() =>{
				    	// 返回時需要顯示“確認是否執行返回，繼續返回將不儲存已編輯資料；如欲儲存已編輯資料，請點擊畫面右上角“完成”按鈕”
				    	if (this.state.editable) {
				    		this.goBackAlert();
				    	} else {
							NavigationService.goBack();
				    	}
				    }}>
				      <Icon name='arrow-back' style = {{color: this.props.style.color}}/>
				    </Button>
				  </Left>
				  <Body onPress={()=>{ this.setState({ isShowSearch:true });}}>
				      <Title>{this.state.data.component.name}</Title>
				  </Body>
				  <Right style={{alignItems: 'center'}}>
				  	{
				  		this.state.editable ?
				  			<TouchableOpacity 
				  			  style={{
				  			    backgroundColor: '#47ACF2', 
				  			    paddingLeft: 10, 
				  			    paddingRight: 10,
				  			    paddingTop: 5,
				  			    paddingBottom: 5, 
				  			    borderRadius: 10
				  			  }}
				  			  onPress={()=>{
				  			    Keyboard.dismiss();				        
				  				// 完成時如果必填欄位未填，需要提示“有必填欄位未填”字樣
				  				this.goBackWithRequiredCheck();
				  			  }}
				  			>
				  			  <Text style={{color: '#FFF'}}>{this.state.lang.FormContentGridForEvaluation.done}</Text>
				  			</TouchableOpacity>
				  		:
				  			null
				  	}
				  </Right>
				</Header>
				
				<ScrollView horizontal={true}>
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
									color       : this.props.style.colorForTransparent,
								}}
						  />
						</Table>
						<KeyboardAwareScrollView extraScrollHeight = {30}>
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
												}}
											/>
										)
									})
								}
							</Table>
						</KeyboardAwareScrollView>
		      		</View>
		      	</ScrollView>

			</Container>
		)
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
						onChangeText = {text => {
					        this.updateStateDefaultValue(text, rowIndex, columnIndex) 
						}}
						onEndEditing = {text => {
							this.setState({
								isTextEditing: false,
								editingPosition: null
							});
							this.confirmStateDefaultValue(text.nativeEvent.text, rowIndex, columnIndex);
						}}
						autoFocus = {true}
						returnKeyType = "done"
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
			let textInputRef = "textInput"+rowIndex+columnIndex;
			return(
				<TextInput
					ref={input => { this[textInputRef] = input }}
					style        = {{ 
						flex       : 1, 
						borderColor: data.required == "Y" && !isValueExist ? "red" : 'gray', 
						borderWidth: data.required == "Y" && !isValueExist ? 1 : 0,
					}}
					keyboardType = {data.columntype == "number" ? "numeric" : "default"}
					returnKeyType= {data.columntype == "number" ? 'done' : null}
					textAlign    = {"right"}
					value        = {data.defaultvalue}
					onChangeText = {text => {
						let newText = (text != '' && text.substr(0,1) == '.') ? '' : text;
				        newText = newText.replace(/^0+[0-9]+/g, "0"); //不能以0开头输入
				        newText = newText.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
				        newText = newText.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
				        newText  = newText.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
				        newText = newText.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
						this.updateStateDefaultValue(newText, rowIndex, columnIndex)
					}}
					onEndEditing = { text => {
							let tempText = text.nativeEvent.text;
							
							if( tempText == ""){
								this.updateStateDefaultValue(this.state.editValue, rowIndex, columnIndex)
								this.setState({ 
									editValue : "",
								});
							}else{
								this.confirmStateDefaultValue(tempText, rowIndex, columnIndex);
							}
					}}
					
					onFocus={(text) => {
						this.setState({ 
							editValue        : data.defaultvalue,
							isEditRowIndex   : rowIndex,
							isEditColumnIndex: columnIndex
						});
						this.updateStateDefaultValue("", rowIndex, columnIndex)
					}}
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
			// 修改回原來的值
			this.setState({
				data:this.deepClone(this.state.preData)
			});
			let lang = this.state.lang;

			// 顯示提示
			setTimeout(function(){
				Alert.alert(
					lang.CreateFormPage.WrongData,
					ruleCheck.message, [{
						text: lang.CreateFormPage.GotIt,
						onPress: () => {}
					}], {
						cancelable: false
					}
				)
			}, 50);
		} else {
			// 判斷是否有url 的 action動作
			let columnactionValue = await FormUnit.getColumnactionValue(
				this.state.user,
				item,
				data.defaultvalue[rowIndex],
				this.props.route.params.formContent
			);

			// 加上columnactionValue.msgList信息邏輯判斷
			let isShowMessageOrUpdateDate = FormUnit.isShowMessageOrUpdateDate(columnactionValue, this.state.lang);
						
			if (isShowMessageOrUpdateDate.showMessage) {
				ToastUnit.show(isShowMessageOrUpdateDate.showMessage.type, isShowMessageOrUpdateDate.showMessage.message);
			}

			if (isShowMessageOrUpdateDate.updateData) {
				// 判斷該值是否填寫表單中顯示
				data.defaultvalue[rowIndex] = FormUnit.checkFormFieldShow(
					columnactionValue.columnList,
					data.defaultvalue[rowIndex]
				);
				let preData = this.deepClone(data);
				// 判斷下一個編輯欄位是否是編輯狀態，是就給空直，不是的話不處理
				if(rowIndex != this.state.isEditRowIndex || columnIndex != this.state.isEditColumnIndex){
					data.defaultvalue[parseInt(this.state.isEditRowIndex)][parseInt(this.state.isEditColumnIndex)].defaultvalue = "";
				}

				this.setState({
					data   :this.deepClone(data),
					preData:this.deepClone(preData),
				});
				
			}else{
				let preData = this.deepClone(this.state.preData);
				// 判斷下一個編輯欄位是否是編輯狀態，是就給空直，不是的話不處理
				if(rowIndex != this.state.isEditRowIndex || columnIndex != this.state.isEditColumnIndex){
					preData.defaultvalue[parseInt(this.state.isEditRowIndex)][parseInt(this.state.isEditColumnIndex)].defaultvalue = "";
				}

				// 修改回原來的值
				this.setState({
					data         : this.deepClone(preData),
				});
			}


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
					let lang = this.state.lang.FormContentGridForEvaluation;
					isGoBack = false;
					Alert.alert(
						lang.requiredFieldAlert, // 有必填欄位未填
						`${lang.alertMsg1}${i+1}${lang.alertMsg2}"${column.component.name}"${lang.alertMsg3}`,
						[
							{
								text : lang.goToEdit,
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
							}
						]
					);
					break;
				}
			}
		}

		if (isGoBack) this.isGoback();
	}

	isGoback = async () => {
		// 判斷是否有url 的 action動作
		let columnactionValue = await FormUnit.getColumnactionValue(
			this.state.user,
			this.state.data,
			[this.state.data],
			this.props.route.params.formContent
		);

		if (columnactionValue.msgList.length == 0) {
			//沒有錯誤顯示，可以返回至上層
			this.state.confirmAllOnPress(this.state.data);
			NavigationService.goBack();
		} else {
			let alertMsg = "";
			let msgCount = columnactionValue.msgList.length;
			for(let [i, msg] of columnactionValue.msgList.entries() ){

				if ( msgCount == 1 ) {
					alertMsg = msg;
				} else {
					alertMsg = ( i == 0 ) ? `${i+1}.${msg}` : `${alertMsg}\n${i+1}.${msg}`;
				}
			}

			
			Alert.alert(
				this.state.lang.FormContentGridForEvaluation.dataCheckError, //您有資料驗證異常
				alertMsg,
				[
					{
					  	text: this.state.lang.FormContentGridForEvaluation.gotIt, //了解
					  	onPress: () => {
					  		
					  	}
					}
				]
			);
			
		}
	}

	goBackAlert = () => {
		Alert.alert(
		  this.state.lang.FormContentGridForEvaluation.continueToGoBack, //請確認是否執行返回?
		  this.state.lang.FormContentGridForEvaluation.continueToGoBackMsg, //確認返回將不儲存已編輯資料；如欲儲存已編輯資料，請點擊畫面右上角“完成”按鈕
		  [
		    {
		      text: this.state.lang.FormContentGridForEvaluation.cancel, //取消
		      onPress: () => console.log("Cancel Pressed"),
		      style: "cancel"
		    },
		    { 
		    	text: this.state.lang.FormContentGridForEvaluation.goBack, //確認返回, 
		    	onPress: () => NavigationService.goBack(),
				style: "destructive",
		    }
		  ]
		);
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
			unShowColumns = unShowColumns.concat(columnactionValue.columnList);
			data.listComponent[i].actionValue = await FormUnit.getActionValue(this.state.user, data.listComponent[i], this.state.data.listComponent);	// 取得該欄位的動作
		}
		return data;
	}

	// deep clone
	deepClone(src) {
		return JSON.parse(JSON.stringify(src));
	}

	// 點擊跳頁的按鈕
	/*
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
					formContent 	  : this.props.route.params.formContent,
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
	*/

	// 點擊跳頁後的值更新，只更新本地state
	/*
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
	*/
}

export default connectStyle( 'Component.FormContent', {} )(FormContentGridDataTablePage);
