import React, { Component } from 'react';
import { Modal, Platform, View } from 'react-native';
import { Content, Item, Label, Input, Icon, Text, DatePicker, Button, connectStyle } from 'native-base';
import DateFormat from  'dateformat';	//	https://www.npmjs.com/package/dateformat
import DateTimePicker from '@react-native-community/datetimepicker';

class FormContentDate extends Component {
	constructor(props) {
		super(props);

		// 名稱、值、參數、能否編輯、強制編輯、欄位資料
		this.state = {
			labelname     : props.data.component.name,
			showDatePicker: false,
			iosDate: null,		//	用來記錄ios的時間
			isIosPlatform: (Platform.OS == "ios") ? true : false,
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
		let text = " ";
		let value = new Date();

		if (this.state.isIosPlatform) {
			if (this.state.iosDate != null) {
				let tempDate = DateFormat( this.state.iosDate, "yyyy/mm/dd");
				value = new Date(`${tempDate} 00:00:00`);
			}
		} else {
			value = value.getTime();
		}

		if (this.props.data.defaultvalue != null) {
			text = this.props.data.defaultvalue;
			value = this.state.isIosPlatform ? new Date(`${text} 00:00:00`) : (new Date(`${text} 00:00:00`)).getTime();

			let tempDate = new Date(`${DateFormat( this.state.iosDate, "yyyy/mm/dd")} 00:00:00`);
			if (value != tempDate) {
				value = tempDate;
			}
		}

		let Version = null;
		let ios_fixCreateFormPageFiledItemWidth = null;
		// 針對ios12的處理
		if (Platform.OS == "ios") {
			Version = Platform.Version.split(".")[0];
			if (text == " ") {
				ios_fixCreateFormPageFiledItemWidth = this.props.style.fixCreateFormPageFiledItemWidth;
				if (Version == "12" || Version == "13") {
					ios_fixCreateFormPageFiledItemWidth = null;
				}
			}
		}

		if (editable) {
			return(
		 		<Item fixedLabel 
		 			style={[
		 				this.props.style.CreateFormPageFiledItemWidth,
		 				ios_fixCreateFormPageFiledItemWidth,
		 			]}
		 			error={this.props.data.requiredAlbert}
		 		>
						<Label style={{flex: 0, color:"#FE1717"}}>{required}</Label>
						<Label>{this.state.labelname}</Label>
						<Text 
							style = {{paddingRight: 10, lineHeight: 50, flex:1, textAlign: 'right'}}
							onPress = {()=>{ this.setState({showDatePicker:true}); }}
						>
							{text.length ? text : " " }
						</Text>
						<Icon 
							name    ="calendar" 
							onPress ={()=>{ 
								this.setState({showDatePicker:true}); 
							}}
						/>
						{
							(this.props.data.requiredAlbert) ?
								<Icon name='alert' />
							:
								null
						}
			            {
			            	(this.state.showDatePicker && (Platform.OS != "ios") ) ? 
			            		<DateTimePicker 
									value       ={value}
									// minimumDate ={new Date()}
									mode        ={"date"}
									is24Hour    ={true}
									display     ="default"
									onChange    ={this.setDate}
			            		/>
			            	:
			            		null
			            }

             			{/*for ios*/}
             			{
             				(Platform.OS == "ios") ?
		             			<Modal
		             			    animationType="fade"
		             			    transparent={true}
		             			    visible={this.state.showDatePicker}
		             			    onRequestClose={() => { /*alert("Modal has been closed.");*/ }}
		             			>
		             			    <View style={{flex:1,backgroundColor:"rgba(0,0,0,.4)", flexDirection:"column", justifyContent:"flex-end"}}>
		             			    	<View style={{backgroundColor:"white"}}>
		             			            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
		             			            	<Button transparent 
		             			            		style={{flex:0}} 
		             			            		onPress={()=>{ 
		             			            			this.setState({
		             			            				showDatePicker:false,
		             			            				iosDate:null
		             			            			}); 
		             			            		}}>
		             			            		<Text style={{color: "black"}}>{this.props.lang.Common.Cancel}</Text>
		             			            	</Button>
		             			            	<Button transparent 
		             			            		style={{flex:0}} 
		             			            		onPress={this.setDate}>
		             			            		<Text style={{color: "black"}}>{this.props.lang.FormSign.Comfirm}</Text>
		             			            	</Button>
		             			            </View>
		             			            <View>
			            	            		<DateTimePicker 
													value       ={value}
													// minimumDate = {new Date()}
													mode        ={"date"}
													is24Hour    ={true}
													display     ="default"
													onChange    ={this.setDate_ios}
													locale      = {this.props.lang.LangStatus}
													display = {"spinner"}
			            	            		/>
		             			            </View>
		             			    	</View>
		             			    </View>
		             			</Modal>
             				:
             					null
             			}
		        </Item>
			);
		} else {		
			text = ( text == " " ) ? this.props.lang.Common.None : text ;
			return(
				  <Item fixedLabel 
				  style={[
				  	this.props.style.CreateFormPageFiledItemWidth,
				  	this.props.style.fixCreateFormPageFiledItemWidth
				  ]}
				  >
		 			<Label style={{flex: 0, color:"#FE1717"}}>{ required }</Label>
				  	<Label style={{flex: 0}}>{this.state.labelname}</Label>
				    <Input 
  				    	scrollEnabled = {false}
				    	// multiline 
				    	value={text} 
				    	editable={editable} 
				    	style={{textAlign: 'right',color:this.props.style.labelColor}}
				    />
				  </Item>
			);
		}	
	}

	setDate_ios = (event, date) => {
		this.setState({
			iosDate:date.getTime()
		});
	}

	setDate = (date) => {
		if(this.state.isIosPlatform){
			if(this.state.iosDate != null){
				this.setState({
					showDatePicker:false
				});
				setTimeout(()=>{
					this.props.onPress(DateFormat( this.state.iosDate, "yyyy/mm/dd"), this.props.data);
				},200);
			}else{
				this.setState({
					showDatePicker:false
				});
				setTimeout(()=>{
					this.props.onPress(DateFormat( new Date(), "yyyy/mm/dd"), this.props.data);
				},200);
			}
		}else{
			if (date.type == "set") {
				this.setState({
					showDatePicker:false
				});
				this.props.onPress(DateFormat( date.nativeEvent.timestamp, "yyyy/mm/dd"), this.props.data);
			}else{
				this.setState({
					showDatePicker:false
				});
			}
		}
	}
}

export default connectStyle( 'Component.FormContent', {} )(FormContentDate);