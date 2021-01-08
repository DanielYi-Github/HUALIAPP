import React from 'react';
import { Platform } from 'react-native';
import { Container, Header, Content, Icon, Button, Left, Body, Right, Title, Text, Card, CardItem } from 'native-base';
import * as NavigationService from '../../utils/NavigationService';
import WaterMarkView 	  from '../../components/WaterMarkView';
import HeaderForGeneral   from '../../components/HeaderForGeneral';
import MainPageBackground from '../../components/MainPageBackground';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as MessageAction from '../../redux/actions/MessageAction';

class MessageDetailPage extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = { 
	    item: this.props.route.params.data,
	  }
	}

	render() {
		let messageDetailPage = (
				<Container>
        			<MainPageBackground height={null}/>
					<HeaderForGeneral
					  isLeftButtonIconShow  = {true}
					  leftButtonIcon        = {{name:"arrow-back"}}
					  leftButtonOnPress     = {() =>NavigationService.goBack()} 
					  isRightButtonIconShow = {false}
					  rightButtonIcon       = {null}
					  rightButtonOnPress    = {null} 
					  title                 = {this.props.state.Language.lang.MainPage.Message}
					  isTransparent         = {false}
					/>

			        <Content>
			        	<Card style={{alignSelf: 'center'}}>
			        		<CardItem style={{flexDirection: 'column'}}>		
			        			<Body style={{paddingTop: 5, paddingBottom: 10}}>		
			        		    	<Title>{this.state.item.TITLE}</Title>
			        			</Body>
			        			<Body>
			        		    	<Text note>{this.state.item.CRTDAT}</Text>
			        			</Body>
			        			<Left style={{alignSelf: 'flex-start'}}>		
			        				{/*
			        				<Icon name="time" style={{color:Styles.Text.color}}/>
			        				*/}
			        			</Left>		
			        		</CardItem>
			        	</Card>	   
			        	<Card style={{alignSelf: 'center'}}>
			        		<CardItem style={{
			        			// minHeight:Styles.PageSize.height*0.5, 
			        			minHeight:350, 
			        			alignItems:'flex-start'
			        		}}>				
								<Text>{this.state.item.CONTENT}</Text>
			        		</CardItem>
			        	</Card>	  

			        </Content>
			    </Container>    
		);

		return(
			<WaterMarkView 
			  contentPage = {messageDetailPage } 
			  pageId = {"MessageDetailPage"}
			/>
		);
	}
}

export default connect(
  (state) => ({
    state: {...state}
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...MessageAction
    }, dispatch)
  })
)(MessageDetailPage);