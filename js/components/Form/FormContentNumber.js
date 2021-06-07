import React, { Component } from 'react';
import { Content, Item, Label, Input, Icon, connectStyle } from 'native-base';

class FormContentNumber extends Component {
	constructor(props) {
		super(props);

		// 名稱、值、參數、能否編輯、強制編輯、欄位資料
		this.state = {
			labelname: props.data.component.name,	//API回傳預設的值
			value: "",							//組件的值
			editValue: "",							//編輯中要顯示在畫面得值
			isEditing: false                        //是否在編輯中
		};
	}

	/**格式化不规范数字 */
	formatNumber(text) {
		let value = text
		if (value != "") {
			value = "" + parseFloat(value)
		}
		return value
	}

	render() {
		// 確認是否可編輯
		let editable = this.props.editable;
		if (editable == null) {
			if (typeof this.props.data.isedit != "undefined") {
				editable = (this.props.data.isedit == "Y") ? true : false;
			} else {
				editable = false;
			}
		}

		let required = (this.props.data.required == "Y") ? "*" : "  ";
		let value = this.props.lang.Common.None; //預設文字內容為"無"

		if (editable) {
			value = (this.props.data.defaultvalue == null || this.props.data.defaultvalue == "") ? value : this.props.data.defaultvalue;
			value = (this.state.value != "") ? this.state.value : value;

			return (
				<Item fixedLabel
					style={[
						this.props.style.CreateFormPageFiledItemWidth,
						this.props.style.fixCreateFormPageFiledItemWidth
					]}
					error={this.props.data.requiredAlbert}>
					<Label style={{ flex: 0, color: "#FE1717" }}>{required}</Label>
					<Label style={{ flex: 0 }}>{this.state.labelname}</Label>
					<Input
						ref="focusInput"
						keyboardType="numeric"
						value={this.state.isEditing ? this.state.editValue : value}
						style={{ textAlign: 'right' }}
						onEndEditing={async (text) => {
							let endValue = this.formatNumber(text.nativeEvent.text)
							if (endValue == "") {
								this.setState({
									isEditing: false,
									editValue: ""
								});
							} else {
								this.setState({
									isEditing: false,
									value: "",
									editValue: ""
								});
								await this.props.onPress(endValue, this.props.data);
							}


						}}
						onFocus={(e) => {
							this.setState({
								isEditing: true
							});
						}}
						onChangeText={(text) => {
							this.setState({ editValue: text });
						}}
					/>

					<Icon
						name='edit'
						type='MaterialIcons'
						onPress={() => {
							this.refs["focusInput"].wrappedInstance.focus();
						}}
					/>
					{
						(this.props.data.requiredAlbert) ?
							<Icon name='alert' />
							:
							null
					}
				</Item>
			);
		} else {
			value = (this.props.data.defaultvalue == null || this.props.data.defaultvalue == "") ? value : this.props.data.defaultvalue;
			return (
				<Item fixedLabel
					style={[
						this.props.style.CreateFormPageFiledItemWidth,
						this.props.style.fixCreateFormPageFiledItemWidth
					]}
				>
					<Label style={{ flex: 0, color: "#FE1717" }}>{required}</Label>
					<Label style={{ flex: 0 }}>{this.state.labelname}</Label>
					<Input
						scrollEnabled={false}
						// multiline     = {false}
						value={value.toString()}
						// placeholder={value.toString()}
						editable={editable}
						style={{ textAlign: 'right', color: this.props.style.labelColor }}
					/>
				</Item>
			);
		}
	}
}

export default connectStyle('Component.FormContent', {})(FormContentNumber);
