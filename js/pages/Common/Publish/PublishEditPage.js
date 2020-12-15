import React from 'react';
import { Image, StyleSheet, Platform } from 'react-native';
import { Icon, Button, Text, Input, Content, Container, Header, Left, Body, Title, Right, Form, Label, Item, connectStyle } from 'native-base';
import ActionSheet from 'react-native-actionsheet';
import { connect }           from 'react-redux';
import { bindActionCreators }from 'redux';

import HeaderForGeneral   from '../../../components/HeaderForGeneral';
import * as PublishAction from '../../../redux/actions/PublishAction';
 

class PublishEditPage extends React.Component {
	constructor(props) {
	  super(props);

	  let editData = props.state.Publish.editData;
	  let languageList = props.state.Publish.languageList;
	  let isEdit = false;
	  let LanguageList = null;
	  if (editData) {
	  	isEdit = true;
	  	LanguageList = this.setEditLanguageList(languageList, editData);
	  } else {
	  	isEdit = false;
	  	LanguageList = this.setLanguageList(languageList);
	  }

	  this.state = {
		languageList    : LanguageList.languageList,
		languageSelected: LanguageList.languageSelected,
		title  :editData ? LanguageList.title : "",
		context:editData ? LanguageList.context : "",
		isEdit :isEdit
	  }
	}

	setEditLanguageList = (languageList, data) => {
		let list=[];
		let languageSelected=null;

		for (var i = 0; i < languageList.length; i++) {
			if (languageList[i].key == data.languageKey) {
				languageSelected = languageList[i]; 
			}

			if (!languageList[i].isSelected) {
				list.push(languageList[i]);
			}
		}

		return {
			languageList    :[...list],
			languageSelected:languageSelected,
			title  :data.title,
			context:data.context
		} 
	}

	setLanguageList = (languageList) => {
		let data=[];
		let languageSelected=null;
		let langDefault=null
		for (var i = 0; i < languageList.length; i++) {
			if(!languageList[i].isSelected){
				if(languageList[i].key==this.props.state.Language.langStatus){
					langDefault=languageList[i];
				}
				data.push(languageList[i]);
			}
		}
		if(!languageSelected){
			if(langDefault){
				languageSelected = langDefault;
			}else{
				if(data){
					languageSelected = data[0];
				}
			}
		}

		return {
			languageList:[...data], 
			languageSelected:languageSelected ? languageSelected : null
		}
	}

	render() {
		return (
			<Container>
          	{/*標題列*/}
          	<HeaderForGeneral
          	  isLeftButtonIconShow  = {true}
          	  leftButtonIcon        = {{name:"close"}}
          	  leftButtonOnPress     = {this.cancelPublish.bind(this)} 
          	  isRightButtonIconShow = {false}
          	  rightButtonIcon       = {null}
          	  rightButtonOnPress    = {null} 
          	  title                 = {this.props.lang.PublishEditPageTitle}
          	  isTransparent         = {false}
          	/>
				<Content 
					ref = { (scrollView) => this.scrollView = scrollView } 
					scrollEventThrottle = {200} 
					contentContainerStyle = {{paddingTop: 35, paddingLeft:"5%", paddingRight:"5%"}}
				>
					<Form>
						<Body style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
							<Label style={{marginLeft: 5, color: this.props.style.inputWithoutCardBg.inputColorPlaceholder}}>
								{this.props.lang.SelectMagLanguage}{/*選擇訊息語系*/}
							</Label>
						</Body>
						<Item style= {{marginLeft: 0}}>
						  	<Button light bordered 
								iconRight
								style     ={{/*backgroundColor: '#FFF', borderRadius: 10,*/ paddingLeft: 20, width: "100%"}}
								alignSelf ='flex-end'
								onPress   ={() => this.ActionSheet.show()}
							>
						   		<Body style={styles.dropdownView}>
									<Text style={[styles.dropdownTitle,{color:this.props.style.inputWithoutCardBg.inputColor}]}>{this.state.languageSelected.label}</Text>
									<Image style={styles.dropdownImage} source={require('../../../image/publish/dropdownarrow.png')} />
								</Body> 		
						  	</Button>
						</Item>

						<Body style={{flexDirection: 'row', alignSelf: 'flex-start', paddingTop: 15}}>
							<Label style={{marginLeft: 5, color: this.props.style.inputWithoutCardBg.inputColorPlaceholder}}>{this.props.lang.Title}{/*主旨*/}</Label>
						</Body>
						<Item fixedLabel style= {{marginLeft: 0}}>
							<Input 
								placeholder          = {this.props.lang.InputTitle}
								placeholderTextColor = {this.props.style.inputWithoutCardBg.inputColorPlaceholder}
								value                = {this.state.title}
								onChangeText         = {(text)=>{ this.setState({ title:text }); }}
								style                = {{color:this.props.style.inputWithoutCardBg.inputColor}}
							/>
						</Item>


					  	<Body style={{flexDirection: 'row', alignSelf: 'flex-start', paddingTop: 15}}>
					  		<Label style={{marginLeft: 5, color: this.props.style.inputWithoutCardBg.inputColorPlaceholder}}>{this.props.lang.Context}{/*內容*/}</Label>
					  	</Body>
					  	<Item fixedLabel 
					  		style={[
					  			this.props.style.CreateFormPageFiledItemWidth,
					  			this.props.style.fixCreateFormPageFiledItemWidth,
					  			{marginLeft: 0}
					  		]}
					  		>
					  	  <Input 
					    	style= {{
								// textAlignVertical: 'top',
								// backgroundColor  : '#f7fafb',
								height           : this.props.style.PageSize.height*0.3,
								borderWidth      : 1,
								borderRadius     : 2,
								borderColor      : '#ebebeb',
					        }} 
							placeholder  = {this.props.lang.InputMsg}
                  			placeholderTextColor  = {this.props.style.inputWithoutCardBg.inputColorPlaceholder}
							value        = {this.state.context}
							onChangeText = {(text)=>{ this.setState({ context:text }); }}
							style        = {{color:this.props.style.inputWithoutCardBg.inputColor}}
							multiline    = {true}
					  	  />
					  	</Item>
					</Form>

					<Button onPress = {this.save.bind(this)} style = {[styles.startButton, {marginTop:20}]}>
					    <Text style={styles.startText}>{this.props.lang.Save}{/*儲存*/}</Text>
					</Button>
				</Content>   
        		{this.renderActionSheet()}
			</Container>
		);
	}

	renderActionSheet = () => {
	    let langs = [];
	    this.state.languageList.forEach((item, index, array) => {
	      langs.push(item.label);
	    });

	    let BUTTONS = [...langs, this.props.state.Language.lang.Common.Cancel]; // 取消
	    let CANCEL_INDEX = langs.length;

	    return (
	      <ActionSheet
	        ref={o => this.ActionSheet = o}
	        title={this.props.state.Language.lang.MinePage.lang_select}
	        options={BUTTONS}
	        cancelButtonIndex={CANCEL_INDEX}
	        onPress={(buttonIndex) => { 
	          if (buttonIndex != CANCEL_INDEX) {
	         	 this.setState({ languageSelected: this.state.languageList[buttonIndex] });
	          }
	        }}
	      />
	    );
	}

	save(){
		let title = this.state.title;
		let context = this.state.context;

		if ( title.replace(/^[\s　]+|[\s　]+$/g, "").length == 0 ) {
			alert(this.props.lang.TitleNotEmpty);  //主旨不能為空
		} else if ( context.replace(/[\r\n]/g,"").replace(/^[\s　]+|[\s　]+$/g, "").length === 0 ) {
			alert(this.props.lang.ContextNotEmpty);  //內容不能為空
		} else {
        	this.props.actions.savePublishItem( title, context, this.state.languageSelected);
        	this.props.navigation.navigate("PublishSubmit");
		}
		
		this.setState({
			title: '',
			context: '',
			isEdit: false,
		});
	}

	cancelPublish(){
		this.props.navigation.goBack();
	}

	componentWillUnmount(){
		if (this.state.isEdit) {
        	this.props.actions.cancelEdit();
		}
	}
}

const styles = StyleSheet.create({
	text: {
		fontSize: 18,
		color: "#000",
		fontWeight: 'bold',
		marginTop: 20,
		marginBottom: 5,
	},
	textInput: {
		height  : 50,
		width   : '100%',
		color   : '#7b8d93',
		fontSize: 18,
		backgroundColor: '#f7fafb',
		justifyContent : 'center',
		paddingLeft : 15,
		borderWidth : 1,
		borderRadius: 2,
		borderColor : '#ebebeb',
	},
	startButton: {
	  height: 40,
	  width: '100%',
	  backgroundColor: '#04b9e6',
	  borderRadius: 5,
	  justifyContent: 'center',
	  alignItems: 'center',
	  marginTop: 20
	},
	startText: {
	  color: '#f8f8f8',
	  fontSize: 20,
	},
	dropdownView: {
	  height: '100%',
	  width: '100%',
	  // justifyContent: 'flex-start',
	  justifyContent: 'space-between', 
	  alignItems: 'center',
	  flexDirection: 'row',
	},
	dropdownTitle: {
	  fontSize: 18,
	  // color: '#7b8d93'
	},
	dropdownImage: {
	  height: 12,
	  width: 12,
	  marginRight: 15
	},
});

export let PublishEditPageStyle = connectStyle( 'Component.InputWithoutCardBackground', {} )(PublishEditPage);

export default connect(
  (state) => ({
    state: {...state},
    lang: state.Language.lang.PublishEditPage
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...PublishAction,
    }, dispatch)
  })
)(PublishEditPageStyle);
