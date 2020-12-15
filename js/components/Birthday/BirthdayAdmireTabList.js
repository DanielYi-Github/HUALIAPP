import React, {Component} from 'react';
import { View, FlatList} from 'react-native';
import { Body, Text} from 'native-base';

export default class BirthdayAdmireTabList extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View>			
				<FlatList
					keyExtractor           ={(item, index) => index.toString()}
					data                   ={this.props.data.slice(0, 2)}
					initialNumToRender     ={10}
					scrollEnabled          ={false}
					renderItem             ={this.rederAdmireMsgItem}
				/>		
			</View>
		);
	}

	rederAdmireMsgItem = (item) => {
		let cardItem = (		
				<Body style={{flexDirection: 'row', width:"100%" }}>	
				    <Body style={{justifyContent: 'flex-start',flexDirection: 'row',flex:1,alignSelf:'flex-start'}}>
						<Body style={{flexDirection: 'row', width:"100%"}}>
							<Text  style={{fontSize:15, /*color:'red', */fontWeight: 'bold'}}>
								{item.item.name}{" "}
								<Text style={{fontWeight: 'normal'}}>
									{item.item.content}
								</Text>
							</Text>
						</Body>
		    		</Body>	
				</Body>
		);
		return cardItem;
	}
}