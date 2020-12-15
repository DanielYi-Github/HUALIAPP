import React, { Component } from 'react';
import { Content, Item, Label, Input, Icon, Text, Button, connectStyle } from 'native-base';
import { Modal, Platform, View } from 'react-native';
import DateFormat from  'dateformat';	//	https://www.npmjs.com/package/dateformat
import DateTimePicker from '@react-native-community/datetimepicker';
import ModalWrapper from 'react-native-modal';
import { TimePicker } from "react-native-wheel-picker-android";

class FormContentDateTime extends Component {
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

		// 名稱、值、參數、能否編輯、強制編輯、欄位資料
		this.state = {
			labelname          : props.data.component.name,
			date               : null,
			time               : null,
			iosDatetime        : new Date(), 	// for ios
			showDatePicker     : false,
			showTimePicker     : false,
			showDateTimePicker : false, // for ios
			isIosPlatform      : (Platform.OS == "ios") ? true : false,
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
		let dateValue = new Date().getTime();
		let timeValue = new Date().getTime();
		let datetimeValue = new Date(); 		// for ios 預設時間
		let text = " ";

		if (this.props.data.defaultvalue != null) {		// 有預設值
			if (this.state.isIosPlatform) {
				datetimeValue = new Date(this.props.data.defaultvalue);
				// if (this.state.iosDatetime && this.state.iosDatetime!=datetimeValue.getTime()) {
				if (this.state.iosDatetime) {
					datetimeValue = new Date(this.state.iosDatetime);
				}
			} else {
				let dateTime = this.props.data.defaultvalue.split(" ");
				let fuckingtime =  (new Date(`${this.props.data.defaultvalue}`)).getTime();

				dateValue = new Date(`${this.props.data.defaultvalue}`);
				timeValue = new Date(`${this.props.data.defaultvalue}`);
			}

			text = this.props.data.defaultvalue;
		}else{										// 沒預設值
			if (this.state.isIosPlatform) {
				datetimeValue = this.state.iosDatetime ? this.state.iosDatetime : datetimeValue;
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
		 			<Item 
		 				fixedLabel 
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
							onPress = {()=>{
								this.showDatetimePicker();
							}}
						>
							{text}
						</Text>
						<Icon 
							name    = {"time-sharp"} 
							onPress ={()=>{ 
								this.showDatetimePicker();
							}}
						/>
						{
							(this.props.data.requiredAlbert) ?
								<Icon name='alert' />
							:
								null
						}
						{/*選擇日期*/}
			            {
			            	(this.state.showDatePicker && (Platform.OS != "ios") ) ? 
			            		<DateTimePicker 
									value    ={dateValue}
									// minimumDate = {new Date()}
									mode     ={"date"}
									is24Hour ={true}
									display  ="default"
									onChange ={this.setDate}
			            		/>
			            	:
			            		null
			            }
			        	{/*沒有時間區隔的選項*/}
                        {
                        	(this.state.showTimePicker && (Platform.OS != "ios") && !this.state.minuteIntervalArray ) ? 
                        		<DateTimePicker 
            						value    ={timeValue}
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
    		            	(this.state.showTimePicker && (Platform.OS != "ios") && this.state.minuteIntervalArray ) ? 
    		            		<ModalWrapper
									animationIn     = {"fadeIn"}
									animationOut    = {"fadeOut"}
									isVisible       = {this.state.showTimePicker}
									onBackdropPress = {(e)=>{ this.setState({showTimePicker:false}) }}
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
    		            		      	initDate = {timeValue}
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
    		            		      			this.setState({showTimePicker:false})
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
    		            		      		{this.props.lang.Common.Comfirm}
    		            		      	</Text>
    		            		      </View>
    		            		    </View>
    		            		</ModalWrapper>

    		            	:
    		            		null
			        	}

             			{/*for ios*/}
             			{
             				(Platform.OS == "ios") ?
		             			<Modal
		             			    animationType="fade"
		             			    transparent={true}
		             			    visible={this.state.showDateTimePicker}
		             			    onRequestClose={() => { /*alert("Modal has been closed.");*/ }}
		             			>
		             			    <View style={{flex:1,backgroundColor:"rgba(0,0,0,.4)", flexDirection:"column", justifyContent:"flex-end"}}>
		             			    	<View style={{backgroundColor:"white"}}>
		             			            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
		             			            	<Button transparent 
		             			            		style={{flex:0}} 
		             			            		onPress={()=>{ 
		             			            			this.setState({
		             			            				showDateTimePicker:false,
		             			            				iosDatetime:null
		             			            			}); 
		             			            		}}>
		             			            		<Text style={{color: "black"}}>{this.props.lang.Common.Cancel}</Text>
		             			            	</Button>
		             			            	<Button transparent 
		             			            		style={{flex:0}} 
		             			            		onPress={this.setDatetime}>
		             			            		<Text style={{color: "black"}}>{this.props.lang.FormSign.Comfirm}</Text>
		             			            	</Button>
		             			            </View>
		             			            <View>
			            	            		<DateTimePicker 
			            							value    ={datetimeValue}
			            							mode     ={"datetime"}
			            							is24Hour ={true}
			            							display  ="default"
			            							onChange ={this.setDatetime_ios}
			            							locale = {this.props.lang.LangStatus}
			            							minuteInterval = {this.state.minuteInterval}
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
				  <Item 
				  	fixedLabel 
				  	style={[
				  		this.props.style.CreateFormPageFiledItemWidth,
				  		this.props.style.fixCreateFormPageFiledItemWidth
				  	]}
				  >
		 			<Label style={{flex: 0, color:"#FE1717"}}>{ required }</Label>
				  	<Label style={{flex: 0}}>{this.state.labelname}</Label>
				    <Input 
  				    	scrollEnabled = {false}
				    	multiline 
				    	value={text} 
				    	editable={editable} 
				    	style={{textAlign: 'right'}}
				    />
				  </Item>
			);
		}	
	}

	showDatetimePicker = () => {
		if (this.state.isIosPlatform) {
			this.setState({showDateTimePicker:true});
		} else {
			this.setState({showDatePicker:true});
		}
	}

	setDatetime_ios = (event, date) => {
		this.setState({
			iosDatetime:date,
		});
	}

	setDate = (date) => {
		if (date.type == "set") {
			this.setState({
				date          :DateFormat( date.nativeEvent.timestamp, "yyyy/mm/dd"),
				showDatePicker:false,
				showTimePicker:true,
			});
		}else{
			this.setState({
				showDatePicker:false
			});
		}
	}

	setTime = (time) => {
		if (time.type == "set") {
			this.setState({
				showTimePicker:false
			});
			let dateTimeValue = `${this.state.date} ${DateFormat( time.nativeEvent.timestamp, "HH:MM")}`; 
			this.props.onPress( dateTimeValue, this.props.data);
		}else{
			this.setState({
				showTimePicker:false
			});
		}
	}

	setDatetime = () => {
		if(this.state.iosDatetime != null){
			this.setState({
				showDateTimePicker:false,
			});
			setTimeout(()=>{
				this.props.onPress(DateFormat( this.state.iosDatetime, "yyyy/mm/dd HH:MM"), this.props.data);
			},200);
		}else{
			this.setState({
				showDateTimePicker:false,
			});
			setTimeout(()=>{
				this.props.onPress(DateFormat( new Date(), "yyyy/mm/dd HH:MM"), this.props.data);
			},200);
		}
	}
}

export default connectStyle( 'Component.FormContent', {} )(FormContentDateTime);


