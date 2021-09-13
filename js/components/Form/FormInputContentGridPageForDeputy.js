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
		let items = this.state.data.listComponent;	// listComponent
		let index = this.state.editCheckItemIndex;	// 多规则列表的index，新增点进来时index为-1
		let isedit = false;							// 此笔资料是否可编辑
		if(index != -1){
			isedit = this.state.data.iseditList[index];
		}

		// 多规则代理内容
		let listComponent = []; 	// 多规则代理内容列表
		let duptyComponent = null;	// 确定按钮/提示文字	
		if(index == -1 || isedit){
		// 新增或可编辑时
			// 组件列表
			for (let i in items) {
				// 多规则组件
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

			// 确定按钮
			duptyComponent = (
				<Button
					onPress = {this.confirmFormData} 
					style   = {{
						backgroundColor: '#47ACF2', 
						marginTop      : 15,
						width          : '95%',
						borderRadius   : 5,
						justifyContent : 'center',
						alignSelf      : "center",
					}}
			  	>
					<Text>
						{this.state.lang.FormSign.Comfirm}
					</Text>
			  	</Button>
			);
		}else {
		// 不可编辑时
			// 组件列表
			let arrItems = this.deepClone(items);
			for (let i in arrItems) {
				// 显示条件 + 代理人
				if(arrItems[i].component.id == "txtCond" || arrItems[i].component.id == "txtRuleDeputyName"){
					arrItems[i].columntype = "txt";
					arrItems[i].required = "N";
					listComponent.push(
						<FormInputContent 
							key      ={i} 
							data     ={arrItems[i]}
							editable ={false}
							onPress  ={this.updateFormData} 
							lang 	 ={this.state.lang} 
							user 	 ={this.state.user}
						/>
					);
				}
			}

			// 提示文字
			duptyComponent = (
				<View>
					<Label style={{color: "red"}}>
						{this.state.lang.DeputyPage.RulesNotSupport}
					</Label>
				</View>
			);
		}

		return(
			<Container>
				{/*標題列*/}
				<HeaderForGeneral
				  isLeftButtonIconShow  = {true}
				  leftButtonIcon        = {{name:"arrow-back"}}
				  leftButtonOnPress     = {NavigationService.goBack} 
				  isRightButtonIconShow = {false}
				  rightButtonIcon       = {null}
				  rightButtonOnPress    = {null} 
				  title                 = {this.state.data.component.name}
				  isTransparent         = {false}
				/>

				{/* 内容 */}
				<KeyboardAwareScrollView
					contentContainerStyle ={{
						alignItems: 'center', 
						justifyContent: 'center',
					}}
				>
					{/* 多规则代理组件列表 */}
					<Card style={{margin: "2.5%"}}>
						<CardItem style={{flexDirection: 'column', alignItems: 'center'}}>
							{listComponent}
						</CardItem>
					</Card>

					{/* 确定按钮/提示文字 */}
					{duptyComponent}
				</KeyboardAwareScrollView>
			</Container>
		);
	}

	updateFormData = async (value, item) => {
		item.columnaction = null;
		item.columnactionColumn = [];
		let AllItem = this.state.data;
		let editIndex = AllItem.listComponent.indexOf(item);	// 当前编辑栏位在listComponent中的index

		// 替換值，同時驗證grid之間 個筆資料的特殊驗證關係
		// 改变item的defaultvalue值为当前所选（paramcode）或填的值
		item = FormUnit.updateFormValue(value, item, AllItem.listComponent);
		
		// 改变listComponent的defaultvalue值为当前所选（paramcode）或填的值
		if (editIndex >= 0) {
			// 当前编辑组件值
			AllItem.listComponent[editIndex] = item;
			// 当前编辑组件对应的隐藏ID组件
			if(editIndex < 8){
				let editCodeIndex = editIndex - 1;
				AllItem.listComponent[editCodeIndex].defaultvalue = AllItem.listComponent[editIndex].defaultvalue;
			}
		}

		//取得根據條件1撈取對應條件2的action
		if(editIndex == 3){
			for(let i in item.paramList){
				if(item.paramList[i].paramcode == item.defaultvalue){
					item.columnaction = item.paramList[i].columnaction;
					break;
				}
			}
		}

		// 判斷是否有url的action動作
		// call API捞取资料（item.columnaction）
		let columnactionValue = await FormUnit.getCreateproActionValue(
			this.state.user,
			item,
			AllItem.listComponent
		);
		
		// 根据条件1所选项设定条件2为cbo/txt，以及条件2 paramList值
		if(editIndex == 3){
    		// 進行分類
    		switch(item.defaultvalue) {
    		  case "$AF$PRJ":
    		  case "$AF$PRO":
    		  	AllItem.listComponent[7].columntype = "cbo";
    		  	AllItem.listComponent[7].defaultvalue = null;
    		  	let paramList = [];
    		  	for(let component of columnactionValue.contentList){
    		  		paramList.push({
    		  			paramcode:component.VALUE,
    		  			paramname:component.NAME
    		  		});
    		  	}
    		  	AllItem.listComponent[7].paramList = paramList;
				AllItem.listComponent[6].defaultvalue = null;
    		    break;
    		  default:
    		  	AllItem.listComponent[7].columntype = "txt";
				AllItem.listComponent[7].defaultvalue = null;
				AllItem.listComponent[7].paramList = null;
				AllItem.listComponent[7].defaultvalue = null;
    		}
		}
		this.setState({
			data: AllItem
		});
	}

	// 确定按钮点击事件
	confirmFormData = async () => {
		// grid 的必填判斷
		// 判斷是否有必填空值存在
		let checkRequired = true;
		let checkIdisMe = true;
		let tempData = this.state.data;
		let temList = this.deepClone(tempData.listComponent);

		//判斷是否為不可編輯的狀態
		if(temList[5].columntype != "txt" && temList[5].isedit == "Y"){
			if(temList[2].defaultvalue==null && temList[4].defaultvalue==null && temList[6].defaultvalue==null){
				//判斷是否為新增
				let tempCond1 = temList[3].defaultvalue;
				temList[2].defaultvalue = tempCond1;
				let tempRelation = temList[5].defaultvalue;
				temList[4].defaultvalue = tempRelation;
				let tempCond2 = temList[7].defaultvalue;
				temList[6].defaultvalue = tempCond2;	
			}else{
				//判斷是否為修改
				let ckeckParam1 = this.getParamValue(temList[3].defaultvalue);
				if(ckeckParam1){
					let tempCond1 = temList[3].defaultvalue;
					temList[2].defaultvalue = tempCond1;
				}

				let ckeckParam2 = this.getParamValue(temList[5].defaultvalue);
				if(ckeckParam2){
					let tempRelation = temList[5].defaultvalue;
					temList[4].defaultvalue = tempRelation;
				}

				let ckeckParam3 = this.getParamValue(temList[7].defaultvalue);
				if(ckeckParam3){
					let tempCond2 = temList[7].defaultvalue;
					temList[6].defaultvalue = tempCond2;	
				}else{
					if(!temList[6].defaultvalue){
						let tempCond2 = temList[7].defaultvalue;
						temList[6].defaultvalue = tempCond2;	
					}
				}
			}
		}

		// 代理人不能为自己
		let tempId = temList[8].defaultvalue;
		if(tempId != "" && tempId != null){
			if(this.state.user.id == tempId){
				checkIdisMe = false;
			}
		}

		//必填檢核
		for (let i in temList) {
			if ((temList[i].required == "Y") && (i > 1) ) {	//排除条件代号及条件检核
				if (temList[i].defaultvalue == null || temList[i].defaultvalue == "" || temList[i].defaultvalue.length == 0) {
					checkRequired = false;
				}
			}
		}
		tempData.listComponent = temList;

		if ( !checkRequired ) {
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
			if( !checkIdisMe ){
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
				// 拼接条件
				let cond1ID = temList[2].defaultvalue;
				let cond1 = this.getParamName(temList[3]);
				let relationID = temList[4].defaultvalue;
				let relation = this.getParamName(temList[5]);
				let cond2ID = temList[6].defaultvalue;
				let cond2 = this.getParamName(temList[7]);
				temList[0].defaultvalue =  cond1ID + ' ' + relationID + ' "' + cond2ID + '"';	// 条件代号
				temList[1].defaultvalue =  cond1 + ' ' + relation + ' "' + cond2 + '"';			// 条件
				tempData.listComponent = temList;
				// iseditList
				let index = this.state.editCheckItemIndex;	// 多规则列表的index，新增点进来时index为-1
				if(index == -1){
					if(tempData.isedit == null || tempData.isedit == ''){
						let arrIsedit = [];
						arrIsedit.push(true);
						tempData.iseditList = arrIsedit;
					}else {
						tempData.iseditList.push(true);
					}
				}

				// 回调函数
				this.state.confirmOnPress(tempData);
				// this.pageClose();
				NavigationService.goBack();
			}
		}
	}

	componentWillUnmount(){
		this.pageClose();
	}

	pageClose = () => {
		// this.state.data 變回原本的state
		let value = this.state.data;
		value.listComponent = this.deepClone(this.state.propsData.listComponent);
		this.setState({
			data: value,
			editCheckItemIndex: -1,
		});
	}

	getParamValue(key){
		let value = null;
		let mixParam = this.props.mixParam;
		for(let i in mixParam){
			if(mixParam[i].key == key){
				value = mixParam[i].value;
				break;
			}
		}
		return value;
	}

	getParamName(value){
		let pn = null;
		let key = value.defaultvalue;
		let columntype = value.columntype;
		if(columntype == "cbo") {
			let ParamList = value.paramList;
			for(let i in ParamList){
				if(key == ParamList[i].paramcode){
					pn = ParamList[i].paramname;
					break;
				}
			}
		}else {
			pn = key;
		}
		return pn;
	}

	// deep clone
	deepClone(src) {
		return JSON.parse(JSON.stringify(src));
	}
}

export default connectStyle( 'Component.FormContent', {} )(FormInputContentGridPageForDeputy);
