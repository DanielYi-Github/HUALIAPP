import React, { Component } from 'react';
import { Container, Header, Left, Content, Right, Item, Label, Input, Body, Card, CardItem, Title, Button, Icon, Text, CheckBox, Toast, connectStyle } from 'native-base';
import { View, FlatList, TextField, Alert, Platform, AlertIOS }from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import FormInputContent          from './FormInputContent';
import FormInputContentGridLabel from './FormInputContentGridLabel';
import * as NavigationService    from '../../utils/NavigationService';
import FormUnit                  from '../../utils/FormUnit';
import HeaderForGeneral          from '../HeaderForGeneral';
import ToastUnit              from '../../utils/ToastUnit';


class FormInputContentGridPage extends Component {
	constructor(props) {
		super(props);
		// 名稱、值、參數、能否編輯、強制編輯、欄位資料	
		this.state = {
			formContent       : this.props.route.params.formContent,
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
			if (items[i].show) {
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
					<Body style={{width:"100%", height:100}}/>
				</KeyboardAwareScrollView>
			</Container>
		);
	}

	updateFormData = async (value, item) => {
		let preAllItem = this.deepClone(this.state.data);
		let AllItem    = this.state.data;
		let editIndex  = AllItem.listComponent.indexOf(item);

		// 欄位自己的規則比較
		let ruleCheck = await FormUnit.formFieldRuleCheck(
			value,
			item,
			AllItem.listComponent,
			item.columntype
		);

		// 特殊規則比較 需要考慮 再次編輯的問題
		if (ruleCheck == true) {
			ruleCheck = await FormUnit.formRowRuleCheck(value, item, AllItem, this.state.editCheckItemIndex);
		}

		if (ruleCheck != true) {
			Alert.alert(
				this.state.lang.CreateFormPage.WrongData,
				ruleCheck.message, [{
					text: this.state.lang.CreateFormPage.GotIt,
					onPress: () => {}
				}], {
					cancelable: false
				}
			)
			
		} else {
			// 替換值，同時驗證grid之間 個筆資料的特殊驗證關係
			item = FormUnit.updateFormValue(value, item, AllItem.listComponent);
			AllItem.listComponent[editIndex] = item;

			// 判斷是否有url 的 action動作
			let columnactionValue = await FormUnit.getColumnactionValue(
				this.state.user,
				item,
				AllItem.listComponent,
				this.state.formContent
			);
			
			let isShowMessageOrUpdateDate = FormUnit.isShowMessageOrUpdateDate(columnactionValue, this.state.lang);
			// 是否顯示提示訊息
			if (isShowMessageOrUpdateDate.showMessage) {
				ToastUnit.show(isShowMessageOrUpdateDate.showMessage.type, isShowMessageOrUpdateDate.showMessage.message);
			}
			// 是否確認更換資料
			if (isShowMessageOrUpdateDate.updateData) {
				AllItem.listComponent = FormUnit.checkFormFieldShow(
					columnactionValue.columnList,
					AllItem.listComponent
				);
				this.setState({
					data: AllItem
				});
			}else{
				this.setState({
					data:preAllItem
				});
			}
		}
	}

	confirmFormData = async () => {
		// grid 的必填判斷
		// 判斷是否有必填空值存在
		let checkRequired = true;
		let tempData = this.state.data;
		for (let data of tempData.listComponent) {
			if (data.required == "Y") {
				if (
					data.defaultvalue === null || 
					data.defaultvalue === "" || 
					data.defaultvalue.length === 0
				) {
					checkRequired = false;
				}
			}
		}

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
			this.state.confirmOnPress( this.deepClone(tempData), this.state.editCheckItemIndex);
			this.pageClose();
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
}

export default connectStyle( 'Component.FormContent', {} )(FormInputContentGridPage);
