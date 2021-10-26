import React from 'react';
import { Card, CardItem, Left, Body, Right, Icon, Text, Button} from 'native-base';
import Common from '../../utils/Common';

export default class ManageDocItem extends React.PureComponent  {
	constructor(props) {
		super(props);
	}

	render() {
		let iconParmas =  this.props.inconInfo.split(',');
		let icon = iconParmas[0];
		let color = iconParmas[1]; 
		let backgroundColor = iconParmas[2]; //功能鍵的名稱、圖片、按鈕顏色
		let iconType = iconParmas[3] ? iconParmas[3] : "Ionicons";
		let selectedInfo=this.props.selectedInfo.item;
		return(
			<Card style={{alignSelf: 'center'}}>
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
						  <Icon name={icon} style={{color:color}} type={iconType}/>
					</Button>
				    <Body style={{paddingLeft:10}}>
						<Text >{selectedInfo.DETAIL}</Text>
				    	<Body style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
							<Left>
								<Text note>{Common.dateFormatNoTime(selectedInfo.DMODIFIED)}</Text>
							</Left>
							<Right>
								<Text style={{paddingRight:10}} note>{this.props.lang.Clicks}{selectedInfo.VISITCOUNT}</Text>	
							</Right>				      					  
				    	</Body>
				    </Body>
				    <Right style={{flex:0}}>
					    <Icon name="arrow-forward" />
				    </Right>
				</CardItem>
			</Card>
		)
	}
}
