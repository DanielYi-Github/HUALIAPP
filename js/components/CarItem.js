import React, { Component } from 'react';
import {Card, CardItem, Left, Body, Right, Icon, Text, Button, connectStyle } from 'native-base';

class CarItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let isGone;
  		if (this.props.carInfo.isDrive) {
    		isGone = (
    			<Icon name="checkmark-circle"  style={{color: '#4CAF50'}} />
        	);
		} else {
	    	isGone = (
				<Icon name="close-circle" style={{color: '#C0C0C0'}} />
	    	);
		}
		let cardItem = (
				<CardItem /*button onPress={() => alert("This is Card Body")}*/>				
				    <Body>
				    	<Body style={{flexDirection:'row',width:"100%", justifyContent:'space-between'}}>
							<Text style={{fontSize:20, color:'#328afb'}}>{this.props.carInfo.departureTime} </Text>
			      			{isGone}
				    	</Body>
				    	<Body style={{flexDirection: 'row', width:"100%", alignSelf:'flex-start', paddingTop:"2%", paddingBottom: '2%'}}>
							<Text style={{width:"40%", fontSize:18}}>{this.props.carInfo.from}</Text>
			      			<Icon name="arrow-forward" style={{color:'#C0C0C0', paddingLeft:10, paddingRight:10}} />
							<Text style={{width: "40%", fontSize:18}}>{this.props.carInfo.to}</Text>
				    	</Body>
				    	{/*如果有司機電話再出現司機號碼 無則不顯示*/}
				    	{
				    		this.props.carInfo.driversCell ? 
				    	    	<Body style={{flexDirection:'row', width:"100%", justifyContent:'space-between'}}>
				    					<Body style={{flexDirection:'row', width:"100%"}}>
				    				{/*
				    						<Icon name="car" style={{color:'#6C6C6C'}}></Icon>	
				    						*/}
				    						<Icon name="car" style={{color:this.props.style.labelColor}}></Icon>	
				    						<Text style={{paddingLeft:10, color:this.props.style.labelColor , width:"90%"}}>{this.props.carInfo.carID} {this.props.carInfo.dirver}</Text>							
				    					</Body>
				    					<Icon 
				    						name="phone-call" 
				    						name="volume-control-phone" 
				    						type="FontAwesome" 
				    						// type="Feather" 
				    						style={{color:"#47ACF2", fontSize: 24}} 
				    						onPress={this.props.callDrivers} 
				    					/>
				    	    	</Body>
				    		:
				    			null
				    	}
				    	<Body style={{flexDirection:'row', width:"100%"}}>
								<Body style={{flexDirection:'row', flex:1, paddingRight:10}}>
									<Icon name="people" style={{color:this.props.style.labelColor}}/>	
									<Text style={{paddingLeft:10, flexWrap:'wrap', color:this.props.style.labelColor}}>{this.props.carInfo.passenger}</Text>							
								</Body>
								<Body style={{flex:0, width:10}}>	
								</Body>					
								<Body style={{flex:0}}>
									<Text style={{paddingLeft:10, color:this.props.style.labelColor}}>{this.props.carInfo.passengerNumber}</Text>							
								</Body>
				    	</Body>
				    </Body>
				</CardItem>
		);


		if (this.props.FindPageFilterItem) {
			return cardItem;
		} else {
			return (
				<Card style={{alignSelf: 'center'}}>
					{cardItem}
				</Card>
			);
		}
	}

}

export default connectStyle( 'Component.CarItem', {} )(CarItem);




// 加入動畫效果
// import React, { Component } from 'react';
// import { Card } from 'native-base';
// import Styles from '../styles/Basic';
// import CarAnimated from '../animateds/CarAnimated'; //派車顯示
// import Animated from './Animateds'; //動畫模板

// export default class CarItem extends Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     return (
//       <Card style={[Styles.CardStyle,{alignSelf: 'center'}]}>
//          <CarAnimated dataInfo={this.props.carInfo}>          
//          </CarAnimated>
//       </Card>
//     );
//   }

// }