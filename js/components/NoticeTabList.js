import React, {Component} from 'react';
import { View, FlatList} from 'react-native';
import { Text, connectStyle, Label} from 'native-base';
import NoticeButton from './NoticeButton';
import * as NavigationService from '../utils/NavigationService';

class NoticeTabList extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View
				style={{ backgroundColor:this.props.style.backgroundColor }} 
				onLayout={this.onLayout}
			>
				<FlatList
					keyExtractor           ={(item, index) => index.toString()}
					data                   ={this.props.data}
					extraData              ={this.props}
					initialNumToRender     ={10}
					scrollEnabled          ={false}
					renderItem             ={this.rederNoticeItem}
					ItemSeparatorComponent ={this.renderSeparator}
					ListFooterComponent    ={this.renderFooter}
					contentContainerStyle  ={{backgroundColor:this.props.style.backgroundColor}}
				/>
			</View>
		);
	}

	onLayout = (event) => {
		let {width, height} = event.nativeEvent.layout
		this.props.getListHeight(height);
	}

	rederNoticeItem = (item) => {
		return(
			<NoticeButton 
				key   = {item.index.toString()}
				title = {item.item.TITLE} 
				time  = {item.item.TXDAT.split(" ")[0]}
			    onPress = {() => this.showNotice(item)}
			/>
		);
	}

	showNotice(item){
      	NavigationService.navigate('Notice',{
      		data:item
      	});
	}

	renderSeparator = () => {
    	return <View style={this.props.style.separator}/>;
	}

	renderFooter = () => {
		if (this.props.isRefreshing) {
			return(
				<View style={[this.props.style.ItemHeight,{justifyContent: 'center', alignItems: 'center', backgroundColor: this.props.style.backgroundColor}]}>
					<Label>{this.props.loadingDataMsg}</Label>
				</View>
			);
		}else if(this.props.page*10 == this.props.data.length){
			return(
				<View style={[this.props.style.ItemHeight,{justifyContent: 'center', alignItems: 'center', backgroundColor: this.props.style.backgroundColor}]}>
					<Label>{this.props.loadMoreDataMsg}</Label>
				</View>
			);
		}else{
			return(
				<View style={[this.props.style.ItemHeight,{justifyContent: 'center', alignItems: 'center', backgroundColor: this.props.style.backgroundColor}]}>
					<Label>{this.props.noDataMsg}</Label>
				</View>
			);
		}
	}
}

export default connectStyle( 'Component.NoticeTabList', {} )(NoticeTabList);
