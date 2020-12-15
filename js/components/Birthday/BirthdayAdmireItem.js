import React, { Component } from 'react';
import {DeviceEventEmitter} from 'react-native';
import {View, CardItem, Left, Body, Icon, Text, Button, Thumbnail , Tab, connectStyle} from 'native-base';
import * as NavigationService  from '../../utils/NavigationService';
import Common                from '../../utils/Common';
import * as UpdateDataUtil   from '../../utils/UpdateDataUtil';
import BirthdayAdmireTabList from './BirthdayAdmireTabList';

class BirthdayAdmireItem extends Component{
	constructor(props) {
		super(props);
	    this.state = {
	      isCake:this.props.selectedInfo.cake,
	      isGift:this.props.selectedInfo.gift,
	      msgcount:this.props.selectedInfo.msglist.length,
	      giftcount:this.props.selectedInfo.giftcount,
	      cakecount:this.props.selectedInfo.cakecount,
		  msgRefresh:this.props.selectedInfo.msglist,
	      picture:null 
    	}
	}

	componentDidMount(){
		let photo =Common.switchContactPic(this.props.selectedInfo.picture,this.props.selectedInfo.sex);
		this.setState({
			picture:photo
		});
	}
  	//改componentDidMount不會觸發顯示
	UNSAFE_componentWillMount() {
		// this.loadPicture();
		//收到监听-監聽祝福明細
		this.listener = DeviceEventEmitter.addListener('changeResult', (obj) => {
		  //收到监听后想做的事情
		  if(this.props.selectedInfo.id==obj.id){
		  	//蛋糕觸發
		  	if(obj.type=="cake"){
		  		// console.log(obj);
		  		let cakecount=this.state.cakecount;
		  		if(obj.isCake){
		  			cakecount=cakecount+1;
		  		}else{
		  			cakecount=cakecount-1;
		  		}
		          this.setState({
		              isCake: obj.isCake,
		              cakecount: cakecount
		          });
		  	}
		  	//禮物觸發
		  	if(obj.type=="gift"){
		  		let giftcount=this.state.giftcount;
		  		if(obj.isGift){
		  			giftcount=giftcount+1;
		  		}else{
		  			giftcount=giftcount-1;
		  		}
		          this.setState({
		              isGift: obj.isGift,
		              giftcount: giftcount
		          });
		  	}
		  	//留言觸發
		  	if(obj.type=="msg"){
			    var myDate = new Date();
			    var nowYear=myDate.getFullYear().toString();
			    let company=this.props.selectedInfo.coid;
			    UpdateDataUtil.getBirthdayData(this.props.user,nowYear,company,obj.id).then(async (data)=>{
			    	if(data){
			          this.setState({
			              msgcount: data.msglist.length,
			              msgRefresh: data.msglist
			          });
			    	}
			        // return data;
			    }).catch((e)=>{
			        console.log(e);
			    }); 
		  	}
		  }
		})
	}

	showDetailPage() {
	    NavigationService.navigate("BirthdayDetail", {
	      masterInfo:this.props,
	      detailInfo:this.state
	    });
	}

	componentWillUpdate(nextProps){
		let cakecount=this.state.cakecount;
		let giftcount=this.state.giftcount;
		let isCake=this.state.isCake;
		let isGift=this.state.isGift;
		let flag=0;
	  	if(nextProps.isPush){
		  	if(nextProps.selectedInfo.msglist.length!=this.state.msgRefresh.length){
		  		flag++; 
			}
		  	if(nextProps.selectedInfo.cakecount!=this.state.cakecount){
		  		flag++; 
		  		cakecount=nextProps.selectedInfo.cakecount;
			}
	  		if(nextProps.selectedInfo.giftcount!=this.state.giftcount){
		  		flag++; 
		  		giftcount=nextProps.selectedInfo.giftcount;
			}
	  		if(nextProps.selectedInfo.cake!=this.state.isCake){
		  		flag++; 
		  		isCake=nextProps.selectedInfo.cake;
			}
	  		if(nextProps.selectedInfo.gift!=this.state.isGift){
		  		flag++; 
		  		isGift=nextProps.selectedInfo.gift;
			}
			if(flag>0){
			    this.setState({
			        msgRefresh:nextProps.selectedInfo.msglist,
			        msgcount:nextProps.selectedInfo.msglist.length,
			        cakecount:cakecount,
			        giftcount:giftcount,
			        isCake:isCake,
			        isGift:isGift
			    });
				nextProps.onPushUpdate(false);
				DeviceEventEmitter.emit('updateDetailPage', nextProps.selectedInfo); 
			}
		}
	}

	render() {

		let inbusdat=Common.dateFormatInbusdat(this.props.selectedInfo.inbusdat);
		let birthdayMessage = this.props.lang.BirthdayDetailPage.msg1+inbusdat+this.props.lang.BirthdayDetailPage.msg2;

		return(
			<View style={{paddingBottom:5}}>
				<View style={{backgroundColor:this.props.style.flastBgColor}}>
					<CardItem  header style={{paddingBottom: 0}}>
						<Body style={{justifyContent: 'flex-start',flexDirection: 'column'}}>
							<Body style={{flexDirection: 'row', height:300, width:"100%"}}>	
								<Body style={{width: '100%', height:"100%"}}>
									<Thumbnail
										style={{ width: '100%', height:"100%"}} 
										resizeMode = {"contain"}
										square 
										source={ this.state.picture } 
									/>
								</Body>
							</Body>
							
							<Body style={{flexDirection: 'row', width:"100%"}}>	
								<Body style={{justifyContent:'flex-start',flex:0,paddingLeft:8,paddingRight:8,paddingTop:8,paddingBottom:8}}>
									<Thumbnail 
										style={{height:40 ,width:40}}
										source={require("../../image/birthday/party-hat.png")}  
									/>
								</Body>
								<Body style={{justifyContent:'space-between',flexDirection: 'row'}}>
									<Body style={{flex:1}}>
										<Body  style={{flexDirection: 'row',width:140}}>
											<Body style={{flexDirection: 'row'}}>
												<Text  style={{fontSize:15}}>
													{this.props.selectedInfo.name} 
												</Text>
											</Body>
											<Body style={{paddingLeft:8}}>
												<Text note>
													{this.props.selectedInfo.depname}
												</Text>	 								    	
											</Body>
										</Body>
										<Body style={{justifyContent:'flex-start'}}>
											<Text note style={{width:140}}>
												{birthdayMessage}
											</Text>	 
										</Body>
									</Body>
									<Body  style={{flexDirection: 'row'}}>
										<Body  style={{flexDirection: 'row',justifyContent:'flex-end'}}>
											<Button transparent style={{width:'30%'}} onPress={() => this.pressCake(this.state.isCake)}>
												{(this.state.isCake) ?
													<Icon name="cake" type="MaterialCommunityIcons" style={{color:'#FF0000',width:'60%'}} />
													:
													<Icon name="cake" type="MaterialCommunityIcons" style={{color:'#C5C1AA',width:'60%'}}/>
												}
											</Button>
											<Text>{this.state.cakecount}</Text>
											<Button transparent style={{width:'30%'}} onPress={() => this.pressGift(this.state.isGift)}>
												{(this.state.isGift) ?
													<Icon name="gift" type="AntDesign" style={{color:'#FF0000',width:'60%'}} />
													:
													<Icon name="gift" type="AntDesign" style={{color:'#C5C1AA',width:'60%'}}/>
												}
											</Button>
											<Text>{this.state.giftcount}</Text>			
											<Button transparent style={{width:'30%'}} onPress= {() => this.showDetailPage()}>
												<Icon name="create" style={{color:'#C5C1AA',width:'60%'}}/>
											</Button>	
										</Body>
									</Body>
								</Body>
							</Body>
						</Body>
					</CardItem>	
					<CardItem 
						style={{
							paddingTop: 0,
							paddingBottom: 0, //解決破圖問題
							// paddingLeft: 0,
							// paddingRight: 0, 
							// backgroundColor: '#FFF'
						}}
					>
						
						<Body style={{ flexDirection: 'row',paddingTop:5}} onLayout={this.onLayoutTabsView}>
							<Tab>
								<BirthdayAdmireTabList data={this.state.msgRefresh} />
							</Tab> 
						</Body>
					</CardItem> 
					<CardItem 
						style={{
							paddingTop: 0,
							paddingBottom: 0, //解決破圖問題
							// paddingLeft: 0,
							// paddingRight: 0, 
							// backgroundColor: '#FFF'
						}}
					> 
						<Body style={{justifyContent: 'flex-start',flexDirection: 'column'}}>
								<Body style={{flexDirection:'row', justifyContent:'space-between'}}>
									<Body>
									<Button transparent 
										style={{height:40}}
										onPress= {() => this.showDetailPage()}
									>
										<Left>
											<Text note >{this.props.lang.BirthdayDetailPage.msg6} {this.state.msgcount} {this.props.lang.BirthdayDetailPage.msg3}</Text>
										</Left>
									</Button>	
									</Body>	
								</Body>
						</Body>
					</CardItem>  
				</View>	  		
			</View>
		)
	}

	pressCake = (flag) => {//未使用redux
		var myDate = new Date();
		var nowYear=myDate.getFullYear().toString();
		UpdateDataUtil.setBirthdayAdmireData(this.props.user,nowYear,this.props.selectedInfo.id,"CAKE").then((data)=>{
			if(flag){
				let cakecount=this.state.cakecount-1;
				if(cakecount<0){
				  cakecount=0;
				}
		    	this.setState({
		    	isCake: false,
		    	cakecount:cakecount
			});
			}else{
		    	this.setState({
		    	isCake: true,
		    	cakecount:this.state.cakecount+1
			});
			}
			
		}).catch((e)=>{
		}); 
	}

	pressGift(flag) {
		var myDate = new Date();
		var nowYear=myDate.getFullYear().toString();
		UpdateDataUtil.setBirthdayAdmireData(this.props.user,nowYear,this.props.selectedInfo.id,"GIFT").then((data)=>{
			if(flag){
		    	this.setState({
		    	isGift: false,
		    	giftcount:this.state.giftcount-1
			});
			}else{
		    	this.setState({
		    	isGift: true,
		    	giftcount:this.state.giftcount+1
			});
			}
		}).catch((e)=>{
		}); 
	}

	componentWillUnmount(){
		//移除监听
	    if(this.deEmitter){
	      this.deEmitter.remove();
	    }
	    if (this.listener) {
	      this.listener.remove();
	    }
		this.setState = (state, callback) => {
	      return;
	    };
	}
}

export default connectStyle( 'Component.BirthdayComponent', {} )(BirthdayAdmireItem);