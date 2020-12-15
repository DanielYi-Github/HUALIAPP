import React from 'react';
import { Alert , FlatList, DeviceEventEmitter} from 'react-native';
import { CardItem,Container ,Content, Body, Text} from 'native-base';
import FunctionPageBanner from '../../components/FunctionPageBanner';
import BirthdayAdmireItem from '../../components/Birthday/BirthdayAdmireItem';
import ActionSheet   from 'react-native-actionsheet';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as SQLite         from '../../utils/SQLiteUtil';
import * as NavigationService  from '../../utils/NavigationService';
import * as LoginAction      from '../../../js/redux/actions/LoginAction';


class BirthdayWeekFlatList extends React.Component {
	constructor(props) {
		super(props);
	    let Companies_Hr = this.props.state.Common.Companies_Hr;
	    if (Companies_Hr.companyValueList.length != 0) {
	      Companies_Hr.defaultValue = Companies_Hr.defaultValue ? Companies_Hr.defaultValue : Companies_Hr.companyValueList[0];
	    }
	 	this.state = {
			data                :[],
			Companies_HrData    :this.props.state.Common.Companies_Hr,
			selectedCompanyValue:Companies_Hr.defaultValue,
			selectedCompanyKey:this.props.state.UserInfo.UserInfo.co,
			isWeekRefreshing    :true,
			isPushRefreshing    :false,
			isPush              :false,
			msgMax:null
    	}
	}

	//改componentDidMount會失去監聽
  	UNSAFE_componentWillMount() {
    	this.loadBirthdayWeekData(this.props.state.UserInfo.UserInfo,this.props.state.UserInfo.UserInfo.co);
    	this.loadMsgMax();
		//IPUSH推送更新資訊
		//APP的監聽事件
		this.deEmitter = DeviceEventEmitter.addListener('loadBirthdayDataState',(data)=>{
			if(!this.state.isPushRefreshing){
				let user = this.props.state.UserInfo.UserInfo;
				this.loadBirthdayWeekPushData(user,user.co);  
			}
		});
	}

  	loadBirthdayWeekData = (user,company) => {      
	    this.setState({
	      data : [],
	      isWeekRefreshing: true,
	      isPush:false
	    });
	    var myDate = new Date();
	    var nowYear=myDate.getFullYear().toString();
	    UpdateDataUtil.getBirthdayWeekData(user,company,nowYear).then(async (data)=>{
	    	let temp =[];
			if(data.content.length>0){
				for(let i in data.content){
					data.content[i].msgMax=null;
				}
				temp=data.content;
			}
	        this.setState({
	            data: temp,
	            isWeekRefreshing: false
	        });
	    }).catch((e)=>{
	        console.log("getBirthdayWeekData异常",e);
	        this.setState({
	            data: [],
	            isWeekRefreshing: false
	        });
	        if(e.code==0){
	          this.props.actions.logout(e.message, true);
	        }else{
	         	//token無效，需要登出
	            setTimeout(() => {
	              Alert.alert(
	                this.props.state.Language.lang.CreateFormPage.Fail,
	                this.props.state.Language.lang.Common.NoInternetAlert, [{
	                  text: 'OK',
	                  onPress: () => {
	                    NavigationService.goBack();
	                  }
	                }], {
	                  cancelable: false
	                }
	              )
	            }, 200);     	
	        }
	    }); 
  	}

  	loadBirthdayWeekPushData = (user,company) => {      
	    this.setState({
	      isPushRefreshing: true
	    });

	    var myDate = new Date();
	    var nowYear=myDate.getFullYear().toString();
	    UpdateDataUtil.getBirthdayWeekData(user,company,nowYear).then((data)=>{
	        this.setState({
	            data: data,
	            isPushRefreshing: false,
    	      	isPush:true
	        });
	    }).catch((e)=>{
	        console.log("getBirthdayWeekData异常",e);
	    }); 
  	}

	pressChangeCoUpdate = (index) => {
	    this.setState({
	      selectedCompanyKey : this.state.Companies_HrData.companyKeyList[index]
	    });
	   this.loadBirthdayWeekData(this.props.state.UserInfo.UserInfo,this.state.Companies_HrData.companyKeyList[index]);
  	}

	render() {
		return (
			<Container>
				<Content>
					 <FlatList
						keyExtractor={(item, index) => index.toString()}
						data = {this.state.data}
						extraData = {this.state}
						ListHeaderComponent={this.renderHeader}
						renderItem = {this.renderBirthAdmireItem}
						ListFooterComponent   ={this.renderFooter}    //尾巴
	                /> 
					
				</Content>
				{this.renderActionSheet()}
			</Container>
		);
	}

	renderBirthAdmireItem = (item) => {
		let data=item.item;

		return(
			<BirthdayAdmireItem 
				selectedInfo = {data}
				user         = {this.props.state.UserInfo.UserInfo} 
				isPush       = {this.state.isPush}
				onPushUpdate = {this.pushUpdate}
				lang         = {this.props.state.Language.lang}
				msgMax       = {this.state.msgMax}
		  	/>
		);      
	}

	pushUpdate = (flag) => {
	    this.setState({
	      isPush:false
	    });
	}

	renderHeader = () => {
	  return(
	        <FunctionPageBanner
				explain         ={this.props.state.Language.lang.BirthdayWeekPage.Introduction}
				imageBackground ={require("../../image/functionImage/birthday.jpg")}
				isShowButton    ={(this.state.Companies_HrData.companyValueList.length >= 1 ) ? true : false }
				buttonText      ={this.state.selectedCompanyValue}
				onPress         ={() => this.ActionSheet.show()}
	        />
	  );
	}



	
  	renderActionSheet = () => {
		let BUTTONS = [...this.state.Companies_HrData.companyValueList, this.props.state.Language.lang.Common.Cancel];
		let CANCEL_INDEX = this.state.Companies_HrData.companyValueList.length;
		return (
		  <ActionSheet
		    ref={o => this.ActionSheet = o}
		    title={this.props.state.Language.lang.ContactPage.SelestCompany}
		    options={BUTTONS}
		    cancelButtonIndex={CANCEL_INDEX}
		    onPress={(buttonIndex) => { 
		      if (buttonIndex != CANCEL_INDEX) {
		        this.setState({ selectedCompanyValue: BUTTONS[buttonIndex] });
		        this.pressChangeCoUpdate(buttonIndex);
		      }
		    }}  
		  />
		);
	  }
	  


	renderFooter = () => {

		if (this.state.isWeekRefreshing) {
			return (
			<CardItem>
				<Body style={{flex:1, alignItems: 'center'}}>
					<Text>{this.props.state.Language.lang.ListFooter.Loading}</Text>
				</Body>
			</CardItem>
					// <NoMoreItem text={this.props.state.Language.lang.ListFooter.Loading}/>
			);
		}else if(this.props.page*10 == this.state.data.length){	
			return (
			<CardItem>
				<Body style={{flex:1, alignItems: 'center'}}>
					<Text>{this.props.state.Language.lang.ListFooter.NoMore}</Text>
				</Body>
			</CardItem>
					// <NoMoreItem text={this.props.state.Language.lang.ListFooter.NoMore}/>
			);
		}else{
			return (
			<CardItem>
				<Body style={{flex:1, alignItems: 'center'}}>
					<Text>{this.props.state.Language.lang.ListFooter.NoMore}</Text>
				</Body>
			</CardItem>
					// <NoMoreItem text={this.props.state.Language.lang.ListFooter.NoMore}/>
			);
		}
	}

	componentWillUnmount(){
		//移除监听
		if(this.deEmitter){
		  this.deEmitter.remove();
		}
		this.setState = (state, callback) => {
		  return;
		};
	}

	loadMsgMax = () => {
		SQLite.selectData(`select CONTENT from thf_masterdata where class1='BirthdayMsgCount' and status='Y' ;`, []).then((result) => {      
			//如果沒有找到資料，不顯示任何資料
			let temp=[];
			for(let i in result.raw()){
			    temp.push(result.raw()[i]);
			}
			if(temp.length>0){
				if(temp[0].CONTENT){
				    this.setState({
			    		msgMax:temp[0].CONTENT
			    	});
				}
			}
		}); 
	}
}

export default connect(
  (state) => ({
    state: {...state}
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...LoginAction,
    }, dispatch)
  })
)(BirthdayWeekFlatList);
