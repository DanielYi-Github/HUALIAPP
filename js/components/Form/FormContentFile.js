import React, { Component } from 'react';
import { Container, Header, Left, Content, Right, Item, Label, Input, Body, Card, CardItem, Title, Button, Icon, Text, CheckBox, Toast, connectStyle } from 'native-base';
import { View, FlatList, TextField, Alert }from 'react-native';
import FormInputContent  from './FormInputContent';
import FormInputContentGridLabel  from './FormInputContentGridLabel';
import * as NavigationService from '../../utils/NavigationService';

class FormContentFile extends Component {
	constructor(props) {
		super(props);

		// 名稱、值、參數、能否編輯、強制編輯、欄位資料	
		this.state = {
			labelname    : props.data.component.name,
			data         : props.data,
		};
	}

	render() {	
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
		let renderItem = null;
		let value = this.props.lang.Common.None;

		renderItem = (
			<View style={{width: '100%'}}>
        		<View style={{borderRadius: 10, borderWidth:0.6, borderColor:"#D9D5DC", width: '100%'}}>
        			<FlatList
        				keyExtractor={(item, index) => index.toString()}
        				data          = {this.state.data.defaultvalue}
        				renderItem    = {this.rendercheckItem}
						ItemSeparatorComponent = {this.renderSeparator}
        			/>
        		</View>
            </View>
        );

		return renderItem;
	}

	rendercheckItem = (item) => {
		let index = item.index; 
		item = item.item;

		return (
			<CardItem 
				style={{flexDirection: 'row', borderRadius: 10, paddingLeft: 5}}
				button
				onPress={()=>{
					let content = {
						artId:item.artId,
						ansId:item.ansId,
						itemId:item.itemId,
						fileName:item.fileName,
						fileId:item.fileId
					};
					NavigationService.navigate("ViewFile", {
					  content: content,
					  url:'app/bpm/getAttachedFile'
					});
				}}
			>	
				<Left style={{flex:1, paddingRight: 0, flexDirection: 'column'}}>
					<Body style={{flexDirection: 'row'}}>
						<Label style={{flex:0}}>{this.props.lang.FormFile.FileName} : </Label> 
						<Label style={{flex:1}}>{item.fileName}</Label>
					</Body>
					<Body style={{flexDirection: 'row'}}>
						<Label style={{flex:0}}>{this.props.lang.FormFile.FileSize} : </Label>
						<Label style={{flex:1}}>{item.fileSize}</Label>
					</Body>
					<Body style={{flexDirection: 'row'}}>
						<Label style={{flex:0}}>{this.props.lang.FormFile.UploadTime} : </Label>
						<Label style={{flex:1}}>{item.uploadTime}</Label>
					</Body>
					<Body style={{flexDirection: 'row'}}>
						<Label style={{flex:0}}>{this.props.lang.FormFile.UploadMember} : </Label>
						<Label style={{flex:1}}>{item.name}</Label>
					</Body>
					<Body style={{flexDirection: 'row'}}>
						<Label style={{flex:0}}>{this.props.lang.FormFile.Description} : </Label>
						<Label style={{flex:1}}>{item.note}</Label>
					</Body>
				</Left>

				<Right style={{flex:0}}>
	                <Icon name  ="arrow-forward" />
				</Right>
			</CardItem>
		);
	}

	renderSeparator = () => {
    	return <View style={[this.props.style.Separator, {width: '90%', alignSelf: 'center'}]}/>;
	}
}

export default connectStyle( 'Component.FormContent', {} )(FormContentFile);


