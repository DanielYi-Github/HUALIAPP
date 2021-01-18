import React, { Component } from 'react';
import { Platform } from 'react-native';
import { Content, Icon, Button, Text} from 'native-base';
import { connect } from 'react-redux';

class DocCategoriesTypesButton extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let iconParmas = (this.props.typesInfo.type != "SPACE") ? this.props.typesInfo.icon.split(',') : [null,null,null];
		let typeName = this.props.typesInfo.content, 
		icon = iconParmas[0], 
		color = iconParmas[1], 
		backgroundColor = iconParmas[2], //功能鍵的名稱、圖片、按鈕顏色
		iconType = iconParmas[3] ? iconParmas[3] : "Ionicons";
		let isDarkMode = this.props.state.Theme.themeType == "dark" ? true: false;

			switch(icon) {
			     case "filing":
			        icon = "file-tray";
			        break;
			     case "pie":
			        icon = "pie-chart";
			        break;
			     case "list-box":
			        icon = "cellular";
			        break;
			     default:
			}

		if(icon){
			return(
				<Content  disableKBDismissScroll contentContainerStyle={{alignItems: 'center',paddingTop: 10}} > 
					<Button 
				    	rounded 
						onPress={() => { this.props.onPress() }} 
				    	style={{
							alignSelf      : 'center',
							height         : 55,
							width          : 55, 
							backgroundColor: backgroundColor, 
							alignItems     : 'center', 
							justifyContent : 'center'				
				    	}}
				    >
					  <Icon name={icon} style={{color:color}} type={iconType}/>
					</Button>
					<Text style={{color:isDarkMode ? backgroundColor:color}}>{typeName}</Text>
				</Content>
			)
		}else{
			return(
				<Content  disableKBDismissScroll contentContainerStyle={{alignItems: 'center'}} /> 
			)
		}
	}
}

export default connect(
  (state) => ({
    state: {...state}
  })
)(DocCategoriesTypesButton);