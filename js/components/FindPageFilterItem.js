import React, { Component }                  from 'react';
import { Content, Icon, Button, Text, Title }from 'native-base';
import { Linking }                           from 'react-native';
import * as NavigationService                from '../utils/NavigationService';
import MessageItem                           from './MessageItem';
import NoticeButton                          from './NoticeButton';
import FormItem                              from './Form/FormItem';
import ContactItem                           from './ContactItem';
import CarItem                               from './CarItem';


export default class FindPageFilterItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let isFindPageFilter = this.props.isFindPageFilter;
		let object = null;
		let item = this.props.item;

		switch(this.props.item.item.findPageItemType) {
		  case "CAR":
		    object = (
		    	<CarItem 
		    	  carInfo = {item.item} 
		    	  callDrivers = {this.callDriversCell.bind(this,`tel:${item.item.driversCell}`)}
		    	  FindPageFilterItem = {isFindPageFilter}
		    	/>
		    );
		    break;
		  case "MSG":
		  	item.item.APPID = "Messages";
		    object = (
		    	<MessageItem 
		    	  index={item.index} 
		    	  data={item.item} 
		    	  onPress={() => this.goNext(item.item)}
		    	  FindPageFilterItem = {isFindPageFilter}
		    	/>
		    );
		    break;
		  case "NOT":
		    object = (
		    	<NoticeButton 
		    		key   = {item.index.toString()}
		    		title = {item.item.TITLE} 
		    		time  = {item.item.NOTICEDATE}
		    	    onPress = {() => this.showNotice(item)}
		    	    FindPageFilterItem = {isFindPageFilter}
		    	/>
		    );
		    break;
		   case "SIG":
		     object = (
		       <FormItem 
		         item = {item.item}
		         onPress = {() => this.goForm(item.item)}
		         Lang_FormStatus = {this.props.Lang_FormStatus}
		         FindPageFilterItem = {isFindPageFilter}
		       />
		     );
		     break;
		   case "MYF":
		     object = (
		       <FormItem 
		         item = {item.item}
		         onPress = {() => this.goMyForm(item.item)}
		         myFormList={true}
		         Lang_FormStatus = {this.props.Lang_FormStatus}
		         FindPageFilterItem = {isFindPageFilter}
		       />
		     );
		     break;
		    case "CON":
		    	// console.log(item.item);
		      object = (
		        <ContactItem 
		          contactInfo = {item.item}
		          onPress = {() => this.goContact(item.item)}
		          FindPageFilterItem = {isFindPageFilter}
		        />
		      );
		      break;
		  default:
		}

		return object;
	}

	goNext(item){
    	this.props.actions.checkDirectorPage(item);
	}

	showNotice(item){
	    NavigationService.navigate( 'Notice',{ data:item });
	}

	goForm(item){
	   	NavigationService.navigate( "Form", { Form:item });  // 表單獲取失敗要show 出提示訊息
	}

	goMyForm(item){
    	NavigationService.navigate( "MyForm", { Form:item });  // 表單獲取失敗要show 出提示訊息
	}

	goContact(item){
    	NavigationService.navigate( "ContactDetail", { data:item });
	}

	callDriversCell = (url) => {
		Linking.canOpenURL(url).then(supported => {
	   		if (!supported) {
		    	console.log('Can\'t handle url: ' + url);
		   	} else {
		    	return Linking.openURL(url);
		   	}
		 	}
		).catch(err => console.error('An error occurred', err));
	}
}