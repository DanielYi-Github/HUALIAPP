// import React, {Component} from 'react';
// import { Text, View, FlatList} from 'react-native';
// import { Button , CardItem  , Body} from 'native-base';
// import Styles from '../../styles/Basic';

// export default class BirthdayCategoriesTabList extends Component {
// 	constructor(props) {
// 		super(props);
// 	}

// 	render() {
// 		return (
// 			<View>
// 				<FlatList
// 					keyExtractor           ={(item, index) => index.toString()}
// 					data                   ={this.props.data.slice(0, 2)}
// 					initialNumToRender     ={10}
// 					scrollEnabled          ={false}
// 					renderItem             ={this.rederAdmireMsgItem}
// 					ItemSeparatorComponent ={this.renderSeparator}
// 					ListFooterComponent    ={this.renderFooter}
// 				/>
// 			</View>
// 		);
// 	}

// 	rederAdmireMsgItem = (item) => {
// 		let cardItem = (		
// 			<CardItem style={Styles.CardItemStyle}>
// 		    	<Body style={{flexDirection: 'row', width:"100%" }}>	
// 				    <Body style={{justifyContent: 'flex-start',flexDirection: 'row',flex:1,alignSelf:'flex-start'}}>
// 						<Body style={{flexDirection: 'row', width:"100%"}}>
// 							<Text  style={{fontSize:15, color:'#0F0F0F',fontWeight: 'bold'}}>
// 								{item.item.name} :
// 								<Text style={{fontWeight: 'normal', color:'#0F0F0F'}}>
// 									{item.item.content}
// 								</Text>
// 							</Text>

// 						</Body>
// 		    		</Body>	
// 				</Body>
// 			</CardItem>

// 		);
// 		return cardItem;
// 	}

// 	renderSeparator(){
//     	return <View style={Styles.Separator}/>;
// 	}

// 	renderFooter = () => {
// 		if(this.props.data.length>3){
// 			return(
// 				<View style={[Styles.ItemHeight,{justifyContent: 'center', alignItems: 'center'}]}>
// 		            <Button full bordered light 
// 		            onPress= {() => this.showDocNewsDetail()}
// 		            >
// 	          			<Text style={Styles.Text}>更多祝福</Text>
// 	        		</Button>		
// 				</View>
// 			);
// 		}else{
// 			return(
// 				<View>
// 				</View>
// 			);
// 		}
// 	}

// }