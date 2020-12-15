import React, {Component} from 'react';
import { View, FlatList} from 'react-native';
import { Text, Button , Label} from 'native-base';
import Style from '../../styles/Basic';
import ReportCategoriesNewsButton from './ReportCategoriesNewsButton';
import NavigationService from '../../utils/NavigationService';

export default class ReportCategoriesNewsTabList extends Component {
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
					renderItem             ={this.rederReportItem}
					ItemSeparatorComponent ={this.renderSeparator}
					ListFooterComponent    ={this.renderFooter}
				/>
			</View>
		);
	}

	rederReportItem = (item) => {
		let data=item.item;
		return(
			<ReportCategoriesNewsButton 
				data = {data}
				lang = {this.props.lang}
			    onPress = {() => this.showReportDetailPage(data.page)}
			/>
		);
	}

	renderSeparator(){
    	return <View style={Style.Separator}/>;
	}

	showReportNewsPage(){
  	    NavigationService.navigate("ReportNewsContent");
	}

	showReportDetailPage(page){
  	    NavigationService.navigate(page);
	}

	renderFooter = () => {
		if (this.props.isRefreshing) {
			return(
				<View style={[Style.ItemHeight,{justifyContent: 'center', alignItems: 'center'}]}>
					<Label>{this.props.lang.ListFooter.Loading}</Label>
				</View>
			);
		}else if(this.props.page*10 == this.props.data.length){
			return(
				<View style={[Style.ItemHeight,{justifyContent: 'center', alignItems: 'center'}]}>
					<Label>{this.props.lang.ListFooter.LoadMore}</Label>
				</View>
			);
		}else{
			return(
				<View style={[Style.ItemHeight,{justifyContent: 'center', alignItems: 'center'}]}>
		            <Button full bordered light 
		            onPress= {() => this.showReportNewsPage()}
		            >
              			<Label>{this.props.lang.ListFooter.LoadMore}</Label>
            		</Button>		
				</View>
			);
		}
	}



}