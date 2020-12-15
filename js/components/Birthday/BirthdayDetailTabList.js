import React, {Component} from 'react';
import { View, FlatList} from 'react-native';
import { Button, CardItem, Body, Thumbnail, Text, connectStyle, Item} from 'native-base';
import { DeviceEventEmitter } from 'react-native';
import Common from '../../utils/Common';

class BirthdayDetailTabList extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View>
				<FlatList
					keyExtractor           ={(item, index) => index.toString()}
					data                   ={this.props.data}
					extraData              ={this.state}
					initialNumToRender     ={10}
					scrollEnabled          ={false}
					renderItem             ={this.rederAdmireMsgItem}
				/>
			</View>
		);
	}

	rederAdmireMsgItem = (item) => {
		let txdat=Common.dateFormatNoYear(item.item.txdat);
		let photo =Common.switchContactPic(item.item.picture,item.item.sex);
		let cardItem = (	
			<CardItem>
				<Item inlineLabel style={{paddingBottom:10}}>
             
                     
		    	<Body style={{flexDirection: 'row',borderColor:'red'}}>	
			    	<Body style={{justifyContent:'flex-start',flex:0,paddingLeft:8,paddingRight:8,paddingTop:8,paddingBottom:8,alignSelf:'flex-start'}}>
					    <Thumbnail small source={photo}/>
					</Body>
				    <Body style={{justifyContent: 'flex-start',flexDirection: 'column',flex:1,alignSelf:'flex-start'}}>
						<Body style={{flexDirection: 'row', width:"100%" }}>
							<Text  style={{fontSize:15, fontWeight: 'bold',paddingTop:5}}>
								{item.item.name}{" "}
								<Text style={{fontWeight: 'normal'}}>
									{item.item.content}
								</Text>
							</Text>
						</Body>
						<Body style={{flexDirection: 'row', width:"100%" }}>
							<Text>{txdat}</Text>
						</Body>
		    		</Body>	
		    		{(item.item.id==this.props.userInfo.id)?
			    		<Body style={{flex:0}}>
			    			<Button transparent dark
			    				onPress={() => this.pressDel(item.item)}
			    			>
			    				<Text style={this.props.style.title}>{this.props.lang.del}</Text>
			    			</Button>
			    		</Body>
			    		:
			    		null
		    		}
				</Body>

				</Item>
			</CardItem>
		);
		return cardItem;
	}

	renderSeparator = () => {
    	return <View style={this.props.style.Separator}/>;
	}

    pressDel(item) {
		this.props.onPressDelLoading(true);
		let tempMsg=Common.removeArray(this.props.data, item);
		//觸發器-消息傳入detailPage
        DeviceEventEmitter.emit('reflashMsg', item.oid,tempMsg);
    }

}

export default connectStyle( 'Component.BirthdayComponent', {} )(BirthdayDetailTabList);
