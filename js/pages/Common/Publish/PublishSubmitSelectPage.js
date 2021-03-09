import React from 'react';
import { Modal, Image, StyleSheet, Platform } from 'react-native';
import { Icon, Button, Container, Header, Left, Body, Title, Right, Spinner, Text, connectStyle } from 'native-base';
import ActionSheet from 'react-native-actionsheet';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as PublishAction from '../../../redux/actions/PublishAction';

import HeaderForGeneral             from '../../../components/HeaderForGeneral';
import * as SQLite                  from '../../../utils/SQLiteUtil';



class PublishSubmitSelectPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			publishItemList: this.props.route.params.data,
			companyList:[],
			factoryListHeader: [{
				key: 0,
				label: this.props.lang.All,		//請選擇廠區
				section: true,
			}],
			factoryList:[],
			defaultCompany:{},
			defaultFactory:{},
			disableFactorySelected:true
		}
	}

	componentDidMount(){
		this.loadCompanyList();
	}

	loadCompanyList = async () => {
		// select * from THF_MASTERDATA where CLASS1='HRCO'
		// select * from THF_MASTERDATA where CLASS1='HRPZID' and CLASS3='公司代號'
		let data = this.state.companyList, company = {};
		let { co, plantID } = this.props.state.UserInfo.UserInfo;
		let defaultCO = null;

		let appOid, functionData = this.props.state.Home.FunctionData;
		for(let i in functionData){
			if (functionData[i].ID == "Publish") {
				appOid = functionData[i].OID
				break;
			}
		}

		await SQLite.selectData(`
			select * 
			from THF_MASTERDATA 
			where CLASS1='HRCO' and STATUS='Y' and OID in (
			   	select DATA_OID 
			   	from THF_PERMISSION 
			   	where DATA_TYPE='masterdata' and FUNC_OID='${appOid}'
			) 
			order by sort`, 
			[]
			).then((result) => {
			result.raw().forEach((item, index, array)=>{
				let company = {
				  key  : item.CLASS3,
				  label: item.CONTENT
				}
		   	 	data.push(company);

	   	 	    if ( !defaultCO && item.CLASS3 == co ) {
	   	 			defaultCO = { key: item.CLASS3, label: item.CONTENT }
	   	 	    }
			});

			this.setState({
		   		companyList: data,
			    defaultCompany : defaultCO ? defaultCO : { key: 0, label : this.props.lang.SelectCompany }	//請選擇公司
			});
			this.loadFactoryList(defaultCO);
		});
	}

	loadFactoryList = async ( com = null) => {
		if (com==null || com.key==0) {
			this.setState({
				factoryList:this.state.factoryListHeader,
				defaultFactory : {
				  key: 0,
				  label : this.props.lang.SelectCompanyFirst //請先選擇公司
				}
			});
		} else {
			let data = [], company = {};
			await SQLite.selectData(`select * from THF_MASTERDATA where CLASS1='HRPZID' and CLASS3='${com.key}'`, []).then((result) => {
				result.raw().forEach((item, index, array)=>{
					company = { key  : item.CLASS4, label: item.CONTENT }
					data.push(company);
				})

				this.setState({
				    disableFactorySelected: false,
				    factoryList: [...this.state.factoryListHeader, ...data],
				    defaultFactory: {
				        key: 0,
				        label: this.props.lang.All //請選擇廠區
				    }
				});
			});
		}
	}

	render() {
		return (
			<Container>
          	{/*標題列*/}
          	<HeaderForGeneral
          	  isLeftButtonIconShow  = {true}
          	  leftButtonIcon        = {{name:"arrow-back"}}
          	  leftButtonOnPress     = {this.cancelPublish.bind(this)} 
          	  isRightButtonIconShow = {false}
          	  rightButtonIcon       = {null}
          	  rightButtonOnPress    = {null} 
          	  title                 = {this.props.lang.SelectUnit}
          	  isTransparent         = {false}
          	/>
				<Body style={{width: '90%'}}>
					<Text style={{
						width:'100%',
						marginTop: 20,
						marginBottom: 5,
						color:this.props.style.dynamicTitleColor
					}}>
						{this.props.lang.Company}{/*選擇公司*/}
					</Text>
	    			<Button iconRight alignSelf='flex-end'
	    			  style={{backgroundColor: this.props.style.cardDefaultBg, borderRadius: 10, paddingLeft: 20}}
	    			  onPress={() => this.CompanyActionSheet.show()}
	    			 >
		    			<Body style={styles.dropdownView}>
						  	<Text style={styles.dropdownTitle}>{this.state.defaultCompany.label}</Text>
					 		<Image 
								style  ={styles.dropdownImage} 
								source ={require('../../../image/publish/dropdownarrow.png')} 
						  	/>
						</Body> 		
	    			</Button>
					<Text style={{
						width:'100%',
						marginTop: 20,
						marginBottom: 5,
						color:this.props.style.dynamicTitleColor
					}}>
						{this.props.lang.Factory}{/*選擇廠區*/}
					</Text>
	    			<Button iconRight alignSelf='flex-end'
						style   ={{backgroundColor: this.props.style.cardDefaultBg, borderRadius: 10, paddingLeft: 20}}
						onPress ={() => this.FactoryActionSheet.show()}
    			 	>
		    			<Body style={styles.dropdownView}>
							<Text style={styles.dropdownTitle}>{this.state.defaultFactory.label}</Text>
							<Image 
								style  ={styles.dropdownImage} 
								source ={require('../../../image/publish/dropdownarrow.png')} 
							/>
						</Body> 		
	    			</Button>
					<Button 
					  onPress = {this.submit.bind(this)} 
					  style   = {styles.startButton}
					  >
					  	{
					  		(this.props.state.Publish.isSubmitting) ?
					  		<Spinner color={this.props.style.SpinnerColor}/>
					  		:
					  		<Text style={styles.startText}>{this.props.lang.Send}{/*發送*/}</Text>
					  	}

					    
					</Button>
				</Body>
        		{this.renderCompanyActionSheet()}
        		{this.renderFactoryActionSheet()}
			</Container>
		);
	}

	renderCompanyActionSheet = () => {
		let coArray = [];
		this.state.companyList.forEach((item, index, array) => {
		  coArray.push(item.label);
		});

		let BUTTONS = [...coArray, this.props.state.Language.lang.Common.Cancel]; // 取消
		let CANCEL_INDEX = coArray.length;

		return (
		  <ActionSheet
			ref     ={o => this.CompanyActionSheet = o}
			title   ={this.props.state.Language.lang.ContactPage.SelestCompany}
			options ={BUTTONS}
		    cancelButtonIndex={CANCEL_INDEX}
		    onPress ={(buttonIndex) => { 
		      if (buttonIndex != CANCEL_INDEX) {
	 	        this.setState({ defaultCompany: this.state.companyList[buttonIndex] });
	 	 		this.loadFactoryList(this.state.companyList[buttonIndex]);
		      }
		    }}
		  />
		);
	}

	renderFactoryActionSheet = () => {
		let faArray = [];
		this.state.factoryList.forEach((item, index, array) => {
		  faArray.push(item.label);
		});

		let BUTTONS = [...faArray, this.props.state.Language.lang.Common.Cancel]; // 取消
		let CANCEL_INDEX = faArray.length;

		return (
		  <ActionSheet
			ref     ={o => this.FactoryActionSheet = o}
			title   ={this.props.lang.SelectFactory}
			options ={BUTTONS}
		    cancelButtonIndex={CANCEL_INDEX}
		    onPress ={(buttonIndex) => { 
		      if (buttonIndex != CANCEL_INDEX) {
	        	this.setState({ defaultFactory: this.state.factoryList[buttonIndex] });
		      }
		    }}
		  />
		);
	}

	submit = () => {
		let com = this.state.defaultCompany.key;
		let fac = this.state.defaultFactory.key;
		
		if (com == 0) {
			alert(this.props.lang.SelectCompanyFirst); 	//請選擇公司發佈訊息
		}else{
			this.props.actions.submitPublish(this.props.state.UserInfo.UserInfo ,this.state.publishItemList , com, fac);
		}
	}

	cancelPublish(){
		this.props.navigation.goBack();
	}
}

const styles = StyleSheet.create({
	text: {
		fontSize: 18,
		color: "#000",
		fontWeight: 'bold',
		marginTop: 20,
		marginBottom: 5,
	},
	startButton: {
	  height: 40,
	  width: '100%',
	  backgroundColor: '#20b11d',
	  borderRadius: 5,
	  justifyContent: 'center',
	  alignItems: 'center',
	  marginTop: 30
	},
	startText: {
	  color: '#f8f8f8',
	  fontSize: 20,
	},
	dropdownView: {
	  height: '100%',
	  width: '100%',
	  justifyContent: 'space-between', 
	  alignItems: 'center',
	  flexDirection: 'row',
	},
	dropdownTitle: {
	  fontSize: 18,
	  // color: '#7b8d93'
	},
	dropdownImage: {
	  height: 12,
	  width: 12,
	  marginRight: 15
	}
});

export let PublishSubmitSelectPageStyle = connectStyle( 'Page.PublishPage', styles )(PublishSubmitSelectPage);

export default connect(
	(state) => ({
		state: { ...state },
		lang: state.Language.lang.PublishSubmitSelectPage
	}),
	(dispatch) => ({
		actions: bindActionCreators({
			...PublishAction,
		}, dispatch)
	})
)(PublishSubmitSelectPageStyle);



/*
{
   "token":"uglyT2MZX3ml+zxEAUSmhCYG+jEutidOgpLYVnNAaE=",
   "userId":"8wSNK2qN6Si0pnHHmpfrpA==",
   "content":{
          "msg":{
             "type":"birthday",
             "title":"生日快樂",
             "content":"生日快樂",
             "crtemp":"A10433"
          },
          "listLang": [{
            "lang": "zh-CN",
            "title": "生日快樂",
            "content": "生快"
          }, {
            "lang": "en",
            "title": "生日快樂",
            "content": "happy birthday"
          }],
          "listReceiver":[
           {"type":"C","userid":"CB"},		//C 是公司
           {"type":"P","userid":"C31"}		//P 是廠區
          ]
   }
}
*/
