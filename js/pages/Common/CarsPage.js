import React from 'react';

import { View, FlatList, RefreshControl, Linking, Platform, Modal} from 'react-native';
import { Container, Header, Icon, Left, Button, Body, Right, Title, Content, Text, DatePicker, connectStyle} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import ActionSheet from 'react-native-actionsheet';
import DateFormat from  'dateformat';	//	https://www.npmjs.com/package/dateformat
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as LoginAction from '../../redux/actions/LoginAction';

import FunctionPageBanner from '../../components/FunctionPageBanner';
import CarItem            from '../../components/CarItem';
import CustomDatePicker   from '../../components/CustomDatePicker';
import NoMoreItem 		  from '../../components/NoMoreItem';
import WaterMarkView 	  from '../../components/WaterMarkView';
import MainPageBackground from '../../components/MainPageBackground';
import * as NavigationService  from '../../utils/NavigationService';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';
import ToastUnit from '../../utils/ToastUnit';


class CarsPage extends React.Component {
	constructor(props) {
		super(props);

		let Companies_Car = this.props.state.Common.Companies_Car;
		
		if (Companies_Car.companyList.length != 0) {
		  Companies_Car.defaultCO = typeof Companies_Car.defaultCO == 'undefined' ? { label:'none', value:false } : Companies_Car.defaultCO;
		  Companies_Car.defaultCO = Companies_Car.defaultCO.value ? Companies_Car.defaultCO : Companies_Car.companyList[0];
		}else{
			Companies_Car.defaultCO = { label:'none', value:false }
		}

		this.state = {
			selectedCompany : Companies_Car.defaultCO,
			CarsData        : [],
			today           : DateFormat(new Date(), "yyyy-mm-dd"),
			today_select    : DateFormat(new Date(), "yyyy-mm-dd"),
			isLoading       : false,
			showFooter      : false,
			isShowDatePicker: false
		}	
	}

    componentDidMount() { 
		this.loadCarsData(this.state.selectedCompany);
	}

	loadCarsData = async (defaultCO) => {
		this.setState({
			isLoading : true,
			CarsData : [],
			showFooter: false,
			today:this.state.today_select
		});
		let user    = this.props.state.UserInfo.UserInfo;
		let date    = this.state.today_select;
		let cardata = [];

		if (typeof defaultCO.value != "undefined") {
			//送去給後台進行資料篩選
			UpdateDataUtil.getCarData( user, defaultCO.value, date).then((data)=>{
				if(data!=null){
					for(let i = 0;i<data.length;i++){
						let content = {
							departureTime  :data[i].starttime ? data[i].starttime : " ",
							isDrive        :data[i].status=="1"?true:false,
							carID          :data[i].carplate,
							dirver         :data[i].drivername,
							driversCell    :data[i].cellphone ? this.dealCellnumber(data[i].cellphone) : null,
	                        from 		   :data[i].outset,
							to             :data[i].destination,
							passenger      :`${data[i].pg}/${data[i].pb}`,
							passengerNumber:`${data[i].pgcount}/${data[i].pbcount}`
						}
						cardata.push(content);
					}
				}
				this.setState({
					isLoading : false,
					CarsData : cardata,
					showFooter: true
				});
			}).catch( data =>{
				if(data.code=="0"){
					//token無效，需要登出
					this.props.actions.logout(this.props.state.Language.lang.Common.TokenTimeout);
					ToastUnit.show('error', this.props.state.Language.lang.Common.TokenTimeout);
					
				}else{
					this.setState({
						isLoading : false,
						CarsData : cardata,
						showFooter: true
					});
				}
			})
		} else {

		}

		
	}

	dealCellnumber = (cell) => {
		var m = cell.search(/）/);
		var n = cell.search( /\(/ );
		var l = cell.search( /\// );
		if (m != -1)
		{
			cell = cell.substring(m+1);
		}
		else if( n != -1)
		{ 
			cell = cell.substring(0, n)
		}
		else if( l != -1)
		{ 
			cell = cell.substring(0, l)
		}
		return cell;
	}

	render() {
		let carsPage = (
			<Container>
	        	<MainPageBackground height={null}/>
			{/*標題列*/}
				<Header style={this.props.style.HeaderBackground} searchBar rounded>
		    	     <Left>				
		    	       	<Button transparent onPress={() =>NavigationService.goBack()}>
		    	       	 	<Icon name='arrow-back' style={{color:this.props.style.iconColor}}/>
		    	       	</Button>
		    	     </Left>
		    	       <Body>
		    	       	<Title style={{color:this.props.style.iconColor}}>{this.props.state.Language.lang.HomePage.Cars}</Title>
		    	     </Body>
		    	     <Right>
						{/*日期選擇的下拉式選單*/}
						{
          					(Platform.OS === "ios") ?
          						<Button 
          							iconLeft 
          							transparent 
									style   ={{flex:0}} 
									onPress ={()=>{this.setState({isShowDatePicker:true}); }}
          						>
          							<Icon name="calendar" style={{color:this.props.style.iconColor}}/>
          							<Text style={{paddingLeft: 5, color:this.props.style.iconColor}}>
          								{DateFormat(this.state.today, "mm/dd")}
          							</Text>
          						</Button>
          					:
          						<CustomDatePicker
									defaultDate      ={new Date(this.state.today)}
									minimumDate      ={new Date()}
									modalTransparent ={false}
									animationType    ={"fade"}
									mode             ={"date"}
									locale           ={this.props.state.Language.langStatus}
          						    onDateChange={(date)=>{
										this.setState({ today_select:DateFormat(date, "yyyy-mm-dd") });
										this.searchCars();
          						    }}
          						/>
						}
					 </Right>
				</Header>

				<FlatList
		          keyExtractor={(item, index) => index.toString()}
				  data = {this.state.CarsData}
	              ListHeaderComponent={this.renderHeader}
				  renderItem = {this.renderCarItem}
				  ListFooterComponent   ={this.renderFooter}    //尾巴
				/>

     			{/*for ios*/}
     			<Modal
     			    animationType="fade"
     			    transparent={true}
     			    visible={this.state.isShowDatePicker}
     			    onRequestClose={() => { /*alert("Modal has been closed.");*/ }}
     			>
     			    <View style={{flex:1,backgroundColor:"rgba(0,0,0,.4)", flexDirection:"column", justifyContent:"flex-end"}}>
     			    	<View style={{backgroundColor:"white"}}>
     			            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
     			            	<Button 
     			            		transparent 
     			            		style={{flex:0}} 
     			            		onPress={()=>{ 
     			            			this.setState({
     			            				isShowDatePicker:false,
     			            				today_select:this.state.today
     			            			}); 
     			            		}}
     			            	>
     			            		<Text style={{color: "black"}}>
     			            			{this.props.state.Language.lang.Common.Cancel}
     			            		</Text>
     			            	</Button>
     			            	<Button 
     			            		transparent 
     			            		style={{flex:0}} 
     			            		onPress={()=>{ this.searchCars(); }}
     			            	>
     			            		<Text style={{color: "black"}}>
     			            			{this.props.state.Language.lang.FormSign.Comfirm}
     			            		</Text>
     			            	</Button>
     			            </View>
     			            <View>
     			        		<DateTimePicker
									value            ={new Date(this.state.today_select)}
									minimumDate      ={new Date()}
									modalTransparent ={false}
									animationType    ={"fade"}
									mode             ={"date"}
									onChange     	 ={this._handleDatePicked}
									locale           = {this.props.state.Language.langStatus}
									display = {"spinner"}
     			    			/>
     			            </View>
     			    	</View>
     			    </View>
     			</Modal>

          		{this.renderActionSheet()}
			</Container>
		);

		return (
		  <WaterMarkView 
			contentPage = {carsPage} 
			pageId      = {"CarsPage"}
		  />
		);
	}

	renderActionSheet = () => {	
		let BUTTONS = [];
		for (let i in this.props.state.Common.Companies_Car.companyList) {
			BUTTONS.push(this.props.state.Common.Companies_Car.companyList[i].label);
		}

		BUTTONS.push(this.props.state.Language.lang.Common.Cancel);
		let CANCEL_INDEX = this.props.state.Common.Companies_Car.companyList.length;
		return (
		  <ActionSheet
			ref               ={o => this.ActionSheet = o}
			title             ={this.props.state.Language.lang.ContactPage.SelestCompany}
			options           ={BUTTONS}
			cancelButtonIndex ={CANCEL_INDEX}
			onPress           ={(buttonIndex) => { 
		      if (buttonIndex != CANCEL_INDEX) {
		        this.setState({ selectedCompany: this.props.state.Common.Companies_Car.companyList[buttonIndex] });
		        this.loadCarsData(this.props.state.Common.Companies_Car.companyList[buttonIndex]); 
		      }
		    }}  
		  />
		);
		
	}

	_handleDatePicked = (event,date) => {
		this.setState({ today_select:DateFormat(date, "yyyy-mm-dd") });
	}

	searchCars = () => {
		this.setState({ isShowDatePicker:false});
		this.loadCarsData(this.state.selectedCompany);
	}	

	handleOnRefresh(){
		this.loadCarsData(this.state.selectedCompany);
	}

	renderHeader = () => {
		return(
			<FunctionPageBanner
				explain         ={this.props.state.Language.lang.CarsPage.FunctionInfo} //查派每日派車資訊，個人派車狀況，移動查詢更加方便。
				isShowButton    ={(this.props.state.Common.Companies_Car.companyList.length >= 1 ) ? true : false}
				buttonText      ={this.state.selectedCompany.label}
				imageBackground ={require("../../image/functionImage/car.jpg")}
        		onPress         ={() => this.ActionSheet.show()}
			/>
		);
	}

  	renderCarItem = (item) => {
	    return(
	      <CarItem 
	        carInfo = {item.item} 
	        callDrivers = {this.callDriversCell.bind(this,`tel:${item.item.driversCell}`)}
	        // onPress     = {() => this.showContactDetail(item)}
	      />
	    );      
  	}

  	callDriversCell = (url) => {
  		Linking.canOpenURL(url).then(supported => {
  	   		if (!supported) {
  		    	console.log('Can\'t handle url: ' + url);
  		   	} else {
  		    	return Linking.openURL(url);
  		   	}
  		 	}
  		).catch(err => console.error('An error occurred', err));
  	}

  	renderFooter = () => {
  		if (this.state.showFooter) {
  			return (<NoMoreItem text={this.props.state.Language.lang.ListFooter.NoMore}/>);   			
  		} else {
  			if (this.state.isLoading) {
  				return <NoMoreItem text={this.props.state.Language.lang.ListFooter.Loading}/>;
  			} else {
  				return null;
  			}
  		}
  	}
}

export let CarsPageStyle = connectStyle( 'Page.CarsPage', {} )(CarsPage);

export default connect(
	(state) => ({
		state: { ...state }
	}),
	(dispatch) => ({
	  actions: bindActionCreators({
	    ...LoginAction
	  }, dispatch)
	})
)(CarsPageStyle);