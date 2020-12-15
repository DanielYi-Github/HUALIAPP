import React, {Component} from 'react';
import { View, FlatList} from 'react-native';
import { CardItem,  Body, Thumbnail, Text, connectStyle,Item} from 'native-base';
import Common            from '../../utils/Common';
// import NoMoreItem         from '../../components/NoMoreItem';

class BirthdayMineTabList extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View  onLayout={this.onLayout}>
				<FlatList
					keyExtractor           ={(item, index) => index.toString()}
					data                   ={this.props.data}
					extraData              ={this.props}
					initialNumToRender     ={this.props.data.length}
					scrollEnabled          ={false}
					renderItem             ={this.rederDocumentItem}
					ItemSeparatorComponent ={this.renderSeparator}
					ListFooterComponent    ={this.renderFooter}
				/>
			</View>
		);
	}

	onLayout = (event) => {
		let { height } = event.nativeEvent.layout
		this.props.getListHeight(height);
	}

	rederDocumentItem = (item) => {
		let content="";
		if(this.props.type=="cake"){
			content=this.props.langData.BirthdayMineTabList.msg1;
		}else if(this.props.type=="gift"){
			content=this.props.langData.BirthdayMineTabList.msg2;
		}else{
			content=item.item.content;
		}
		let photo =Common.switchContactPic(item.item.picture,item.item.sex);

		//不為當年生日的祝福則顯示年月日
		var time = new Date(item.item.txdat);
		var y1 = time.getFullYear();
		var ntime = new Date();
		var y2 = ntime.getFullYear();
		let txdat=Common.dateFormatNoYear(item.item.txdat);
		if(y1!=y2){
			txdat=Common.dateFormatNoTime(item.item.txdat);
		}

		return(
			<CardItem>
		    
			    	<Body style={{justifyContent:'flex-start',flex:0,paddingLeft:8,paddingRight:8,paddingTop:8,paddingBottom:8,alignSelf:'flex-start'}}>
					    <Thumbnail  small
		    				source={photo}
					    />
					</Body>
				    <Body style={{justifyContent: 'flex-start',flexDirection: 'column',flex:1,alignSelf:'flex-start'}}>
						<Body style={{flexDirection: 'row', width:"100%"}}>
							<Text  style={{fontSize:15, fontWeight: 'bold',paddingTop:5}}>
								{item.item.name}{" "}
								<Text style={{fontWeight: 'normal'}}>
									{content}
								</Text>
							</Text>
						</Body>
						<Body style={{flexDirection: 'row', width:"100%" }}>
							<Text>{txdat}</Text>
						</Body>
		    		</Body>	
				
			</CardItem>
		);
	}


	renderSeparator = () => {
    	return <Item inlineLabel/>;
	}
	
	renderFooter = () => {
		if (this.props.isRefreshing) {
			return(
				<CardItem>
					<Body style={{flex:1, alignItems: 'center'}}>
						<Text>{this.props.langData.ListFooter.Loading}</Text>
					</Body>
				</CardItem>
				// <NoMoreItem text={this.props.langData.ListFooter.Loading}/>
			);
		}else if(this.props.page*10 == this.props.data.length){
			return(
				<CardItem>
					<Body style={{flex:1, alignItems: 'center'}}>
						<Text>{this.props.langData.ListFooter.LoadMore}</Text>
					</Body>
				</CardItem>
				// <NoMoreItem text={this.props.langData.ListFooter.LoadMore}/>
			);
		}else{
			return(
				<CardItem>
					<Body style={{flex:1, alignItems: 'center'}}>
						<Text>{this.props.langData.ListFooter.NoMore}</Text>
					</Body>
				</CardItem>

				// <NoMoreItem text={this.props.langData.ListFooter.NoMore}/>
			);
		}
	}
}

export default connectStyle( 'Component.BirthdayComponent', {} )(BirthdayMineTabList);