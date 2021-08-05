import React, { Component } from 'react';
import { Container, Header, Left, Content, Right, Item, Label, Input, Body, Card, CardItem, Title, Text, Button, Icon, connectStyle } from 'native-base';
import { View, FlatList } from 'react-native';
import Modal from "react-native-modal";
import * as NavigationService from '../../utils/NavigationService';
import WaterMarkView     from '../WaterMarkView';
import FormContentGridLabel from './FormContentGridLabel'

class FormContentGrid extends Component {
	constructor(props) {
		super(props);

		//針對資料進行處理
		let data = this.props.data;
		data.listComponent = (data.listComponent == null) ? [] : data.listComponent;
		let fieldCount = data.listComponent.length; //欄位比數

		//確認有沒有值
		let ItemCount = 0;
		let itemsArray = [];
		if (fieldCount != 0) {
			data.listComponent[0].defaultvalue = (data.listComponent[0].defaultvalue == null) ? [] : data.listComponent[0].defaultvalue;
			ItemCount = data.listComponent[0].defaultvalue.length; //資料筆數
		}

		for (let i = 0; i < ItemCount; i++) {
			let items = [];
			for (let j = 0; j < fieldCount; j++) {
				items.push({
					label: data.listComponent[j].component.name,
					value: data.listComponent[j].defaultvalue[i],
					columntype: data.listComponent[j].columntype,
					paramList: data.listComponent[j].paramList
				});
			}
			itemsArray.push(items);
		}

		this.state = {
			labelname: data.component.name,
			data: itemsArray,
			reRender: false, // 蒐集完下面的全部資料之後，設定為true時即為開始重新顯示
			itemViewWidth: 0, // 紀錄可顯示區域的總寬度
			eachItemArrayLength: fieldCount, // 記錄每一組的比數有多少，通常是固定不變的
			modalVisible: false,
			modalListVisible: false,
			itemIndex: 0,
		};
	}

	render() {
			// 確認是否可編輯
			let editable = this.props.editable;
			if (editable == null) {
				if (typeof this.props.data.isedit != "undefined") {
					editable = (this.props.data.isedit == "Y") ? true : false;
				} else {
					editable = false;
				}
			}

			let required = (this.props.data.required == "Y") ? "*" : "  ";

			if (this.state.data.length == 0) {
				let value = this.props.lang.Common.None;

				return (
					<Content 
						scrollEnabled = {false}
						contentContainerStyle={{width:this.props.style.PageSize.width*0.86, borderWidth:0}}
					>
			  		  <Item fixedLabel style={this.props.style.CreateFormPageFiledItemWidth}>
			   			<Label style={{flex: 0, color:"#FE1717"}}>{required}</Label>
			  		  	<Label style={{flex: 0}}>{this.state.labelname}</Label>
			  		    <Input 
  				    		scrollEnabled = {false}
			  		    	multiline 
			  		    	value={value} 
			  		    	editable={editable} 
			  		    	style={{textAlign: 'right'}}
			  		    />
			  		  </Item>
					</Content>
				);
			} else {
				return (
					<Content 
						scrollEnabled = {false}
						contentContainerStyle={{width:this.props.style.PageSize.width*0.86, alignItems: 'flex-start'}}
					>
		              	<Item fixedLabel style={{borderBottomWidth: 0, paddingTop: 15, paddingBottom: 15}}>
		  	 			  	<Label style={{flex: 0, color:"#FE1717"}}>{required}</Label>
		  	                <Label>{this.state.labelname}</Label>
					  	</Item>
					    <View style={[this.props.style.CardStyle,{
							borderColor : '#DDD', 
							borderWidth : 1, 
							width       : '98%', 
							paddingLeft : "3%", 
							paddingRight: "3%",
							alignSelf   : 'flex-start', 
							borderRadius: 10
					    }]}>
					    	<FlatList
		  	  	  			  listKey={(item, index) => 'D' + index.toString()}
					    	  keyExtractor  = {(item, index) => index.toString()}
					    	  renderItem    = {this.renderGridList}
					    	  data          = {this.state.data.slice(0, 3)}
					    	  ItemSeparatorComponent = {this.renderItemSeparatorComponent}
						  	  ListFooterComponent = {this.renderFooter}    //尾巴
					    	/>
					    </View>
					   {/*顯示單一Table欄位*/}
					   {/*this.state.modalVisible ? this.showModalWrapper() : null*/}
					   {this.showModalWrapper()}

					   {/*顯示多個Table欄位*/}
					   {/*this.state.modalListVisible ? this.showModalListWrapper() : null*/}
					   {this.showModalListWrapper()}
					</Content>
				);
			}
	}

	renderGridList = (item) => {
		let data = this.renderGridItem(item.item);

		// 如果每一項裡面的資料多餘4比 開啟彈框	
		if (item.item.length > 4 ) {
			return (
					<CardItem button key={item.index}  style={{flexDirection: 'column', alignItems: 'flex-start'}}
						onPress={()=>{
							this.setModalVisible(!this.state.modalVisible, item.index);
						}}
					>
						{data}
					</CardItem>
			);
		} else {
			return (
					<CardItem key={item.index} style={{flexDirection: 'column'}}>
						{data}
					</CardItem>
			);
		}	
	}

	renderGridItem = (item, showAll = false) => {
		let data = [];

		if (showAll) {
			for (var i in item) {
				data.push(<FormContentGridLabel key={i} data={item[i]} />)
			}
		} else { 
			for (var i in item) {
				data.push(<FormContentGridLabel key={i} data={item[i]} />)

				if (i == 3) break; 
			}

			if(item.length > 4){
				data.push(
					<View key={item.length} style={{flexDirection: 'row'}}>
						<Text>{this.props.lang.Common.More}</Text>
					</View>
				);
			}
		}

		return data;
	}

	renderFooter = () => {
		if ( this.state.data.length > 3 ) {
			return (
				<View>
					<View style={[this.props.style.Separator, {width: '90%', alignSelf: 'center'}]}/>
					<CardItem button						
						style={{flexDirection: 'row', alignItems: 'flex-start'}}
						onPress = {()=>{ this.setModalListVisible(!this.state.modalListVisible); }}
					>
						<Text>{this.props.lang.Common.ViewMore}</Text>
					</CardItem>
				</View>
			);
		} else {
			return null;
		}
	}

	setModalVisible(visible, itemIndex) {
	    this.setState({ 
			modalVisible: visible,
			itemIndex   : itemIndex
	    });
	}

	setModalListVisible(visible) {
	    this.setState({ 
			modalListVisible: visible,
	    });
	}
		
	showModalWrapper = () => {
	  let items = this.state.data[this.state.itemIndex];
	  let component = ( 
	  	  <Container style={{backgroundColor:"rga(0,0,0,1)", flex:1}}>
  	  		<View style={this.props.style.fixFormContentGridModalListWrapperCloseButton}>
  	  		  <Button transparent onPress={() =>{this.setState({ modalVisible:false }); }}>
  	  		    <Icon name="close" style={{color:"#FFF"}}/>
  	  		  </Button>
  	  		</View>
  	  	  	<FlatList
  	  	  		listKey={(item, index) => 'D' + index.toString()}
  	  			keyExtractor = {(item, index) => index.toString()}
  	  			renderItem   = {this.renderCardGridList}
  	  			data         = {[items]}
				ListFooterComponent = {this.renderModaltWrapperFooter}    //尾巴
  	  	  	/>
	  	  </Container>
	  );

	  return(
	  	<Modal 
	  		isVisible={this.state.modalVisible}
	  		onBackdropPress = {(e)=>{ this.setState({modalVisible:false}) }}
	  	>
	  		<WaterMarkView
	  		  contentPage = {component} 
	  		  pageId = {"FormPage"}
	  		/>
	  	</Modal>
	  )
	}

	showModalListWrapper = () => {
		let component = (
			<Container style={{backgroundColor:"rga(0,0,0,0)", flex:1}}>
				<View style={this.props.style.fixFormContentGridModalListWrapperCloseButton}>
				  <Button transparent onPress={() =>{this.setState({ modalListVisible:false }); }}>
				    <Icon name="close" style={{color:"#FFF"}}/>
				  </Button>
				</View>
				<FlatList
					listKey={(item, index) => 'D' + index.toString()}			  		
					keyExtractor        = {(item, index) => index.toString()}
					renderItem          = {this.renderCardGridList}
					data                = {this.state.data}
					ListFooterComponent = {this.renderModalListWrapperFooter}    //尾巴
				/>
			</Container>
		);
		return(
			<Modal 
				isVisible={this.state.modalListVisible}
				onBackdropPress = {(e)=>{ this.setState({modalListVisible:false}) }}
			>
				<WaterMarkView
				  contentPage = {component} 
				  pageId = {"FormPage"}
				/>
			</Modal>
		)
	}

	renderCardGridList = (item) => {
		let data = this.renderGridItem_bigger(item.item, true); // 第一個參數item本身, 第二個參數是否顯示全部欄位
		return (
			<Card style={[this.props.style.CardStyle,{width: '90%'}]}>
				<CardItem key={item.index} style={[this.props.style.CardItemStyle,{flexDirection: 'column'}]}>
					{data}
				</CardItem>
			</Card>
		)
	}

	renderGridItem_bigger = (item) => {
		let data = [];
		for (var i in item) {
			data.push(<FormContentGridLabel key={i} data={item[i]} style={{padding:5}} />)
		}
		return data;
	}

	renderModaltWrapperFooter = () => {
		return (
			<Card style={[this.props.style.CardStyle,{width: '90%'}]}>
				<CardItem 
					button
					style={[this.props.style.CardItemStyle,{flexDirection: 'column'}]}
					onPress={() =>{this.setState({ 
						modalVisible:false,
						modalListVisible:false,
						 }); }}
				>
					<Text>{this.props.lang.Common.Close}</Text>
				</CardItem>
			</Card>
		)
	}

	renderModalListWrapperFooter = () => {
		return (
			<Card style={[this.props.style.CardStyle,{width: '90%', marginBottom: 40}]}>
				<CardItem 
					button
					style={[this.props.style.CardItemStyle,{flexDirection: 'column'}]}
					onPress={() =>{this.setState({ 
						modalVisible:false,
						modalListVisible:false,
						 }); }}
				>
					<Text>{this.props.lang.Common.Close}</Text>
				</CardItem>
			</Card>
		)
	}

	renderItemSeparatorComponent = () => {
		return <View style={[this.props.style.Separator, {width: '90%', alignSelf: 'center'}]}/>
	}
}

export default connectStyle( 'Component.FormContent', {} )(FormContentGrid);
