import React,{PureComponent } from 'react';
import { Icon, Text, CardItem, Left, Right, Body, Button} from 'native-base';
import { Platform } from 'react-native';
import Common from '../../utils/Common';

export default class DocCategoriesNewsButton extends PureComponent{
	constructor(props) {
	  super(props);
	}

	render(){
		let data=this.props.item;
		let cardItem=null;
		let iconParmas = (data.type != "SPACE" && data.type != null) ? data.icon.split(',') : [null,null,null];
		let icon = iconParmas[0];
		let color = iconParmas[1]; 
		let backgroundColor = iconParmas[2]; //功能鍵的名稱、圖片、按鈕顏色
		let iconType = iconParmas[3] ? iconParmas[3] : "Ionicons";

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

		cardItem = (
		
			<CardItem style={{ borderRadius: 10}} button onPress={this.props.onPress}>
				<Button 	
				rounded		    	 
						onPress={() => {}} 
				    	style={{
							height         : 55,
							width          : 55, 
							backgroundColor: backgroundColor				
				    	}}
				    >
					  <Icon name={icon} style={{color:color,paddingLeft:3}} type={iconType}/>
				</Button>
			    <Body style={{paddingLeft:10}}>
					<Text >{this.props.title}</Text>
			    	<Body style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
						<Left>
							<Text note>{Common.dateFormatNoTime(this.props.time)}</Text>
						</Left>
						<Right>
							<Text style={{paddingRight:10}} note>{this.props.lang.DocumentCategoriesPage.Clicks} {this.props.hits}</Text>	
						</Right>				      					  
			    	</Body>
			    </Body>
			    <Right style={{flex:0}}>
				    <Icon name="arrow-forward" />
			    </Right>
			</CardItem>

		);
		return cardItem;
	}
}