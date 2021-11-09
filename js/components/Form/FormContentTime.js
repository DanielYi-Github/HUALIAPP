import React, { Component } from 'react';
import { Modal, Platform, View } from 'react-native';
import { Content, Item, Label, Input, Icon, Text, DatePicker, Button, connectStyle } from 'native-base';
import DateFormat from  'dateformat';	//	https://www.npmjs.com/package/dateformat
import DateTimePicker from '@react-native-community/datetimepicker';
import ModalWrapper from 'react-native-modal';
import { TimePicker } from "react-native-wheel-picker-android";

class FormContentTime extends Component {
	constructor(props) {
		super(props);
		let minuteInterval = props.data.columnsubtype ? parseInt(props.data.columnsubtype) : 0;
		let minuteIntervalArray = []
		for (var i = 0; i < 60; i++) {
			if ( (i%minuteInterval) == 0 ) {
				let number = i.toString();
				number = number.length == 1 ? "0"+number : number;
				minuteIntervalArray.push(number);
			}
		}

		console.log("minuteIntervalArray", minuteIntervalArray);

		// 名稱、值、參數、能否編輯、強制編輯、欄位資料
		this.state = {
			labelname     : props.data.component.name,
			showDatePicker: false,
			iosTime: null,		//	用來記錄ios的時間
			isIosPlatform: (Platform.OS == "ios") ? true : false,
			minuteInterval     : minuteInterval ? minuteInterval : 1,
			minuteIntervalArray: minuteIntervalArray.length ? minuteIntervalArray : false,  // for android 分鐘數的間隔
			minuteIntervalTime : null  // for android 有間隔分鐘數的值
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
		let value = new Date();
		let text = " ";

		if (this.state.isIosPlatform) {
			if (this.state.iosTime != null) {
				value = new Date(this.state.iosTime);
			}
		} else {
			value = value.getTime();
		}

		if (this.props.data.defaultvalue != null) {
			let date = DateFormat(new Date(), "yyyy/mm/dd");
			text = this.props.data.defaultvalue;
			value = this.state.isIosPlatform ? (new Date(`${date} ${text}:00`)) : (new Date(`${date} ${text}`)).getTime();
			// value = new Date(`${date} ${text}:00`);

			let tempTime = this.state.isIosPlatform ? value.getTime() : value;
			if ( this.state.isIosPlatform && tempTime != this.state.iosTime) {
				value = new Date(this.state.iosTime);
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
	 					// {borderWidth:0}
	 				]}
	 				error={this.props.data.requiredAlbert ? true : false}>
					<Label style={{flex: 0, color:"#FE1717"}}>{required}</Label>
					<Label>{this.state.labelname}</Label>
					<Text 
						style = {{paddingRight: 10, lineHeight: 50, flex:1, textAlign: 'right'}}
						onPress = {()=>{
							this.setState({showDatePicker:true});
						}}
					>
						{text}
					</Text>
					<Icon 
						name    ="time" 
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
					{/*沒有時間區隔的選項*/}
		            {
		            	(this.state.showDatePicker && (Platform.OS != "ios") && !this.state.minuteIntervalArray ) ? 
		            		<DateTimePicker 
								value    ={new Date(value)}
								mode     ={"time"}
								is24Hour ={true}
								display  ="spinner"
								onChange ={this.setTime}
		            		/>
		            	:
		            		null
		            }
		        	{/*有時間區隔的選項*/}
		        	{
		            	(this.state.showDatePicker && (Platform.OS != "ios") && this.state.minuteIntervalArray ) ? 
		            		<ModalWrapper
								animationIn     = {"fadeIn"}
								animationOut    = {"fadeOut"}
								isVisible       = {this.state.showDatePicker}
								onBackdropPress = {(e)=>{ this.setState({showDatePicker:false}) }}
								backdropOpacity = {0.5}
								style           = {{justifyContent: 'center', alignItems: 'center'}}
		            		>
		            		    <View style={{ 
		            		    	width: '50%', 
		            		    	height: '33%', 
		            		    	backgroundColor: '#FFF',
		            		    	justifyContent: 'center' 
		            		    }}>
		            		      <TimePicker
		            		      	initDate = {value}
		            		      	minutes = {this.state.minuteIntervalArray}
		            		      	format24 = {true}
		            		      	onTimeSelected = {(time)=>{
		            		      		this.setState({minuteIntervalTime:time});
		            		      	}}
		            		      />
		            		      <View style={{flexDirection: 'row', justifyContent: 'space-around' }}>
		            		      	<Text 
		            		      		style={{color: '#008577'}} 
		            		      		onPress={()=>{
		            		      			this.setState({showDatePicker:false})
		            		      		}}
		            		      	>
		            		      		{this.props.lang.Common.Cancel}
		            		      	</Text>
		            		      	<Text 
		            		      		style={{color: '#008577'}} 
		            		      		onPress={()=>{
		            		      			this.setTime({
		            		      				type:"set",
		            		      				nativeEvent:{ timestamp: this.state.minuteIntervalTime }
		            		      			})
		            		      		}}
		            		      	>
		            		      		{this.props.lang.FormSign.Comfirm}
		            		      	</Text>
		            		      </View>
		            		    </View>
		            		</ModalWrapper>

		            	:
		            		null
		        	}

         			{/*for ios*/}
         			{
         				(Platform.OS == "ios" && this.state.showDatePicker) ?
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
	             			            				iosTime:null
	             			            			}); 

	             			            		}}>
	             			            		<Text style={{color: "black"}}>{this.props.lang.Common.Cancel}</Text>
	             			            	</Button>
	             			            	<Button transparent 
	             			            		style={{flex:0}} 
	             			            		onPress={this.setTime}
	             			            	>
	             			            		<Text style={{color: "black"}}>{this.props.lang.FormSign.Comfirm}</Text>
	             			            	</Button>
	             			            </View>
	             			            <View>
		            	            		<DateTimePicker 
		            							value    ={value}
		            							mode     ={"time"}
		            							is24Hour ={true}
		            							display  ="spinner"
		            							onChange ={this.setTime_ios}
			            						locale = {this.props.lang.LangStatus}
			            						minuteInterval = {this.state.minuteInterval}
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
			//新版本的排版
			text = ( text == " " ) ? this.props.lang.Common.None : text ;
			return(
				  <Item fixedLabel 
				  style={[
				  	this.props.style.CreateFormPageFiledItemWidth,
				  	this.props.style.fixCreateFormPageFiledItemWidth
				  ]}
				  >
		 			<Label style={{flex: 0, color:"#FE1717"}}>{required}</Label>
				  	<Label style={{flex: 0}}>{this.state.labelname}</Label>
				    <Input 
  				    	scrollEnabled = {false}
				    	// multiline 
				    	value={text} 
				    	editable={editable} 
				    	style={{textAlign: 'right', color:this.props.style.labelColor}}
				    />
				  </Item>
			);
		}	
	}

	setTime_ios = (event, time) => {
		this.setState({
			iosTime:time.getTime()
		});
	}

	setTime = (time) => {
		if(this.state.isIosPlatform){
			if(this.state.iosTime != null){
				this.setState({
					showDatePicker:false
				});
				setTimeout(()=>{
					this.props.onPress(DateFormat( this.state.iosTime, "HH:MM"), this.props.data);
				},200);
			}else{
				this.setState({
					showDatePicker:false
				});
				setTimeout(()=>{
					this.props.onPress(DateFormat( this.state.iosTime, "HH:MM"), this.props.data);
				},200);
			}
		}else{
			if (time.type == "set") {
				this.setState({
					showDatePicker:false
				});
				this.props.onPress(DateFormat( time.nativeEvent.timestamp, "HH:MM"), this.props.data);
			}else{
				this.setState({
					showDatePicker:false
				});
			}
		}
	}
}

export default connectStyle( 'Component.FormContent', {} )(FormContentTime);
