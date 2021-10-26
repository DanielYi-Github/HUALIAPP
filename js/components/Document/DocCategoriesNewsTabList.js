import React, {Component} from 'react';
import { View, FlatList} from 'react-native';
import { Button , Label, connectStyle } from 'native-base';
import DocCategoriesNewsButton from './DocCategoriesNewsButton';
import * as NavigationService  from '../../utils/NavigationService';

class DocCategoriesNewsTabList extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View>
				<FlatList
					keyExtractor           ={(item, index) => index.toString()}
					data                   ={this.props.data.slice(0, 3)}
					extraData              ={this.props}
					initialNumToRender     ={10}
					scrollEnabled          ={false}
					renderItem             ={this.rederDocumentItem}
					ItemSeparatorComponent ={this.renderSeparator}
					ListFooterComponent    ={this.renderFooter}
				/>
			</View>
		);
	}

	rederDocumentItem = (item) => {
		return(
			<DocCategoriesNewsButton 
				title = {item.item.DETAIL} 
				time  = {item.item.DMODIFIED}
				hits  = {item.item.VISITCOUNT}
				item = {item.item}
				lang = {this.props.lang}
			    onPress = {() => this.props.onPress(item)}
			/>
		);
	}

	renderSeparator=()=>{
    	return <View style={[this.props.style.Separator]}/>;
	}

	showDocNewsDetail(){
  	    NavigationService.navigate("DocumentNewsContent");
	}

	renderFooter = () => {
		if (this.props.isRefreshing) {
			return(
				<View style={[this.props.style.ItemHeight,{justifyContent: 'center', alignItems: 'center'}]}>
					<Label>{this.props.lang.ListFooter.Loading}</Label>
				</View>
			);
		}else if(this.props.page*10 == this.props.data.length){
			return(
				<View style={[this.props.style.ItemHeight,{justifyContent: 'center', alignItems: 'center'}]}>
					<Label>{this.props.lang.ListFooter.LoadMore}</Label>
				</View>
			);
		}else{
			return(
				<View style={[this.props.style.ItemHeight,{justifyContent: 'center', alignItems: 'center'}]}>
		            <Button full bordered light 
		            onPress= {() => this.showDocNewsDetail()}
		            >
              			<Label>{this.props.lang.ListFooter.LoadMore}</Label>
            		</Button>		
				</View>
			);
		}
	}
}

export default connectStyle( 'Component.DocComponent', {} )(DocCategoriesNewsTabList);