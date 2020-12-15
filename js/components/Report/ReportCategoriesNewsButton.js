import React,{PureComponent } from 'react';
import { Icon, Text, Card, CardItem, Left, Right, Body, Button} from 'native-base';
// import Styles from '../../styles/Basic';
import Common from '../../utils/Common';

export default class ReportCategoriesNewsButton extends PureComponent{
	constructor(props) {
	  super(props);
	}

	render(){
		let data=this.props.data;
		let cardItem=null;
		let iconParmas = (data.type != "SPACE") ? data.icon.split(',') : [null,null,null];
		let icon = iconParmas[0];
		let color = iconParmas[1]; 
		let backgroundColor = iconParmas[2]; //功能鍵的名稱、圖片、按鈕顏色
		let iconType = iconParmas[3] ? iconParmas[3] : "Ionicons";
		cardItem = (
			<CardItem button onPress={this.props.onPress}>
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
					<Text >{data.pageName}</Text>
			    	<Body style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
						<Left>
							<Text note>{data.txdat}</Text>
						</Left>			      					  
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