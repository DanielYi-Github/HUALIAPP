import React, { Component } from 'react';
import { Container, Header, Left, Content, Right, Item, Label, Input, Body, Card, CardItem, Title, Button, Icon, Text, CheckBox, Toast, connectStyle } from 'native-base';
import { View, FlatList, TextField, Alert, Platform, AlertIOS }from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import FormInputContent          from './FormInputContent';
import FormInputContentGridLabel from './FormInputContentGridLabel';
import * as NavigationService    from '../../utils/NavigationService';
import FormUnit                  from '../../utils/FormUnit';
import HeaderForGeneral          from '../HeaderForGeneral';

class FormInputContentGridPageForDeputy extends Component {
	constructor(props) {
		super(props);
		// 名稱、值、參數、能否編輯、強制編輯、欄位資料	
		this.state = {
			propsData         : this.props.route.params.propsData,
			data              : this.props.route.params.data,
			lang              : this.props.route.params.lang,
			user              : this.props.route.params.user,
			editCheckItemIndex: this.props.route.params.editCheckItemIndex,
			confirmOnPress    : this.props.route.params.confirmOnPress,
		};
	}

	render() {
		let listComponent = [];
		let items = this.state.data.listComponent;
		for (let i in items) {
			listComponent.push(
				<FormInputContent 
					key      ={i} 
					data     ={items[i]} 
					editable ={null} 
					onPress  ={this.updateFormData} 
					lang 	 ={this.state.lang} 
					user 	 ={this.state.user}
				/>
			);
		}

		return(
			<Container>
				{/*標題列*/}
				<HeaderForGeneral
				  isLeftButtonIconShow  = {true}
				  leftButtonIcon        = {{name:"arrow-back"}}
				  leftButtonOnPress     = {this.pageClose} 
				  isRightButtonIconShow = {false}
				  rightButtonIcon       = {null}
				  rightButtonOnPress    = {null} 
				  title                 = {this.state.data.component.name}
				  isTransparent         = {false}
				/>
				<KeyboardAwareScrollView
					contentContainerStyle ={{
						alignItems: 'center', 
						justifyContent: 'center',
					}}
				>
					<Card style={{margin: "2.5%"}}>
						<CardItem style={{flexDirection: 'column', alignItems: 'center'}}>
							{listComponent}
						</CardItem>
					</Card>

					<Button 
					  onPress = {this.confirmFormData} 
					  style   = {{
					    backgroundColor: '#47ACF2', 
					    marginTop      : 15,
					    width          : '95%',
					    borderRadius   : 5,
					    justifyContent : 'center',
					    alignSelf      : "center",
					  }}>
					    <Text>
					      {this.state.lang.FormSign.Comfirm}
					    </Text>
					</Button>

				</KeyboardAwareScrollView>
			</Container>
		);
	}

	updateFormData = async (value, item) => {

		item.columnaction = null;
		item.columnactionColumn = [];

		let AllItem = this.state.data;
		let editIndex = AllItem.listComponent.indexOf(item);

		// 替換值，同時驗證grid之間 個筆資料的特殊驗證關係
		item = FormUnit.updateFormValue(value, item, AllItem.listComponent);
		if (editIndex>=0) {
			AllItem.listComponent[editIndex] = item;
		}
		//取得根據條件一撈取對應條件二action
		for(let i in item.paramList){
			if(item.paramList[i].paramcode==item.defaultvalue){
				item.columnaction=item.paramList[i].columnaction;
			}
		}
		// 判斷是否有url的action動作
		let columnactionValue = await FormUnit.getColumnactionValue(
			this.state.user,
			item,
			AllItem.listComponent
		);
		if(editIndex == 1){
    		// 進行分類
    		switch(item.defaultvalue) {
    		  case "$AF$PRJ":
    		  case "$AF$PRO":
    		  	AllItem.listComponent[5].columntype = "cbo";
    		  	AllItem.listComponent[5].defaultvalue = null;
    		  	let paramList = [];
    		  	for(let component of  columnactionValue.contentList){
    		  		paramList.push({
    		  			paramcode:component.VALUE,
    		  			paramname:component.NAME
    		  		});
    		  	}
    		  	AllItem.listComponent[5].paramList = paramList;
    		    break;
    		  default:
    		  	AllItem.listComponent[5].columntype = "txt";
    		  	AllItem.listComponent[5].defaultvalue = null;
    		  	AllItem.listComponent[4].defaultvalue = null;
    		}
		}
		this.setState({
			data: AllItem
		});
	}

	confirmFormData = async () => {
		
		// grid 的必填判斷
		// 判斷是否有必填空值存在
		let checkRequired = true;
		let checkId = true;
		let checkIdisMe = true;
		let tempData = this.state.data;
		let temList=this.deepClone(tempData.listComponent);

		//判斷是否為不可編輯的狀態
		if(temList[3].columntype!="txt"&&temList[3].isedit=="Y"){
			if(temList[0].defaultvalue==null && temList[2].defaultvalue==null && temList[4].defaultvalue==null){
				//判斷是否為新增
				let tempCond1=temList[1].defaultvalue;
				temList[0].defaultvalue=tempCond1;
				let tempRelation=temList[3].defaultvalue;
				temList[2].defaultvalue=tempRelation;
				let tempCond2=temList[5].defaultvalue;
				temList[4].defaultvalue=tempCond2;	
			}else{
				//判斷是否為修改
				let ckeckParam1=this.getParamValue(temList[1].defaultvalue);
				if(ckeckParam1){
					let tempCond1=temList[1].defaultvalue;
					temList[0].defaultvalue=tempCond1;
				}
				let ckeckParam2=this.getParamValue(temList[3].defaultvalue);
				if(ckeckParam2){
					let tempRelation=temList[3].defaultvalue;
					temList[2].defaultvalue=tempRelation;
				}	
				let ckeckParam3=this.getParamValue(temList[5].defaultvalue);
				if(ckeckParam3){
					let tempCond2=temList[5].defaultvalue;
					temList[4].defaultvalue=tempCond2;	
				}else{
					if(!temList[4].defaultvalue){
						let tempCond2=temList[5].defaultvalue;
						temList[4].defaultvalue=tempCond2;	
					}
				}
			}
		}

		let tempId=temList[6].defaultvalue;
		if(tempId!=""&&tempId!=null){
			if(this.state.user.id==tempId){
				checkIdisMe=false;
			}
		}
		for (let i in temList) {
			//必填&只檢核value欄位 Ps:key值由dutypage的提交時才做替換
			if ((temList[i].required == "Y") && (i%2==1) ) {
				if (temList[i].defaultvalue == null || temList[i].defaultvalue == "" || temList[i].defaultvalue.length == 0) {
					checkRequired = false;
				}
			}
		}
		tempData.listComponent=temList;

		if (!checkRequired) {
			this.setState({
				data: tempData
			});

			Alert.alert(
				this.state.lang.CreateFormPage.RequiredFieldAlert,
				null, [{
					text: 'Cancel',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel'
				}, {
					text: 'OK',
					onPress: () => console.log('OK Pressed')
				}, ], {
					cancelable: false
				}
			)
		} else {
			if(!checkIdisMe){
				Alert.alert(
					this.state.lang.DeputyPage.DeputyMemNotMeMsg,
					null, [{
						text: 'Cancel',
						onPress: () => console.log('Cancel Pressed'),
						style: 'cancel'
					}, {
						text: 'OK',
						onPress: () => console.log('OK Pressed')
					}, ], {
						cancelable: false
					}
				)
			}else{
				this.state.confirmOnPress(tempData);
				this.pageClose();
			}
		}
	}

	pageClose = () => {
		// this.state.data 變回原本的state
		let value = this.state.data;
		value.listComponent = this.deepClone(this.state.propsData.listComponent);
		this.setState({
			data: value,
			editCheckItemIndex: -1,
		});

		NavigationService.goBack();
	}

	// deep clone
	deepClone(src) {
		return JSON.parse(JSON.stringify(src));
	}

	getParamValue(key){
		let value=null;
		let mixParam=this.props.mixParam;
		for(let i in mixParam){
			if(mixParam[i].key==key){
				value=mixParam[i].value;
				break;
			}
		}
		return value;
	}
}

export default connectStyle( 'Component.FormContent', {} )(FormInputContentGridPageForDeputy);
