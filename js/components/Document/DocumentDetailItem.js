import React from 'react';
import { Icon, Card, CardItem, Body, Right, Text, Left, Button} from 'native-base';
import { Image } from 'react-native';
import Common from '../../utils/Common';

export default class DocumentDetailItem extends React.PureComponent  {
	constructor(props) {
		super(props);
	}

	render() {
    	let detailInfo=this.props.selectedInfo.item;
	    let iconInfo ="id-badge,#7CB342,#DCEDC8,FontAwesome5"
		let iconParmas = iconInfo.split(',');
		// let icon = iconParmas[0];
		// let color = iconParmas[1]; 
		let backgroundColor = iconParmas[2]; //功能鍵的名稱、圖片、按鈕顏色
		// let iconType = iconParmas[3] ? iconParmas[3] : "Ionicons";

		let iamgeSource=require("../../image/document/pdf.png")
		switch(detailInfo.DOCTYPE){
			case "pdf":
				iamgeSource=require("../../image/document/pdf.png");
				break;
		 	case "doc":
		 		iamgeSource=require("../../image/document/word.png");
		 		break;
		 	case "xls":
		 	case "xlsx":
		 		iamgeSource=require("../../image/document/excel.png");
		 		break;
		 	case "ppt":
	 			iamgeSource=require("../../image/document/powerpoint.png");	
		 		break;
		}
		//unit k->MB
		let docSize=detailInfo.DOCSIZE/1024/1024;
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
	                    <Image 
		                    resizeMode ='contain' 
		                    style      ={{height:55, width:55}} 
		                    source     ={iamgeSource} 
                  		/>
					</Button>
				    <Body style={{paddingLeft:10}}>
						<Text >{detailInfo.DOCNAME}</Text>
				    	<Body style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
							<Left>
								<Text note>{Common.dateFormatNoTime(detailInfo.DMODIFIED)}</Text>
							</Left>
							<Right>
								<Text style={{paddingRight:10}} note>{docSize.toFixed(2)} MB</Text>	
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