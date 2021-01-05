import React from 'react';
import { Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Container, Header, Content, Icon, Button, Left, Body, Right, Title, Text, Card, CardItem, connectStyle } from 'native-base';
import * as NavigationService from '../../utils/NavigationService';
import WaterMarkView from '../../components/WaterMarkView';
import HeaderForGeneral from '../../components/HeaderForGeneral';


import { connect } from 'react-redux';

const BaseScript =
    `
        var height = null;
        function changeHeight() {
          if (document.body.scrollHeight != height) {
            height = document.body.scrollHeight;
			
			window.ReactNativeWebView.postMessage(JSON.stringify({
			  type: 'setHeight',
			  height: height,
			}))
          }
        }
        setInterval(changeHeight, 50);
    `;

const FixTinyText = '<meta name="viewport" content="width=device-width, initial-scale=1">';
let CopyPastDisable = "";


class NoticePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			item  :this.props.route.params.data.item,
			height: 0
		};
		// 補齊字體顏色設定
		CopyPastDisable = `<style>* { -webkit-user-select: none; color:${this.props.style.textColor}; }</style>`;
	}

	onMessage = (event) => {
		console.log(event);
	   try {
	     const action = JSON.parse(event)
	     if (action.type === 'setHeight' && action.height > 0 && this.state.height==0) {
	       this.setState({ height: action.height })
	     }
	   } catch (error) {
	   }
	 }

	render() {
		let str = FixTinyText+CopyPastDisable+this.state.item.CONTENT;
		let noticePage = (
			<Container>
				<HeaderForGeneral
				  isLeftButtonIconShow  = {true}
				  leftButtonIcon        = {{name:"arrow-back"}}
				  leftButtonOnPress     = {() =>NavigationService.goBack()} 
				  isRightButtonIconShow = {false}
				  rightButtonIcon       = {null}
				  rightButtonOnPress    = {null} 
				  title                 = {this.props.state.Language.lang.HomePage.Announcement}
				/>

				<Card style={{alignSelf: 'center'}}>
					<CardItem style={{flexDirection: 'column'}}>		
						<Body style={{paddingTop: 5, paddingBottom: 10}}>		
					    	<Title 
					    		style={{fontSize:18, textAlign: 'left'}}
					    		ellipsizeMode={"tail"}
					    		numberOfLines={5}
					    	>
					    		{this.state.item.TITLE}
					    	</Title>
						</Body>
						<Body style={{alignSelf: 'flex-start', flexDirection:'row', alignItems: 'center'}}>		
							<Icon name="person" />
					    	<Text style={{marginLeft: 5}}>{this.state.item.EMP}</Text>
						</Body>
						<Body style={{alignSelf: 'flex-start', flexDirection:'row', alignItems: 'center'}}>		
							<Icon name="time" />
					    	<Text style={{marginLeft: 5}}>{this.state.item.NOTICEDATE}</Text>
						</Body>
					</CardItem>
				</Card>

				<Card style={{alignSelf: 'center'}}>
					<CardItem>
        		{
					(Platform.OS === "ios") ?
						<WebView
						  injectedJavaScript={BaseScript}
						  source={{ html: 
						  		FixTinyText+
						  		CopyPastDisable+
						  		this.state.item.CONTENT}}
						  style={{
						    width: "100%",
						    height: this.state.height,
						    backgroundColor: 'transparent'
						  }}
					      onMessage={event => this.onMessage(event.nativeEvent.data) }
						/>	
					:

						<WebView
						  injectedJavaScript={BaseScript}
						  source={{ html: 
						  	FixTinyText+
						  	CopyPastDisable+
						  	this.state.item.CONTENT, baseUrl:'' }}
						  style={{
						    flex:0,
						    height: this.state.height,
						    backgroundColor: 'transparent'
						  }}
					      // javaScriptEnabled // 仅限Android平台。iOS平台JavaScript是默认开启的。
					      // scrollEnabled={false}
					      onMessage={event => this.onMessage(event.nativeEvent.data) }
						/>
        		}
        			</CardItem>
        		</Card>

        	{/*
		        <Content>
		        	{
		        		(this.state.height!=0) ?
		        			<Card style={{alignSelf: 'center'}}>
		        				<CardItem style={{flexDirection: 'column'}}>		
		        					<Body style={{paddingTop: 5, paddingBottom: 10}}>		
		        				    	<Title 
		        				    		style={{fontSize:18, textAlign: 'left'}}
		        				    		ellipsizeMode={"tail"}
		        				    		numberOfLines={5}
		        				    	>
		        				    		{this.state.item.TITLE}
		        				    	</Title>
		        					</Body>
		        					<Body style={{alignSelf: 'flex-start', flexDirection:'row', alignItems: 'center'}}>		
		        						<Icon name="person" />
		        				    	<Text style={{marginLeft: 5}}>{this.state.item.EMP}</Text>
		        					</Body>
		        					<Body style={{alignSelf: 'flex-start', flexDirection:'row', alignItems: 'center'}}>		
		        						<Icon name="time" />
		        				    	<Text style={{marginLeft: 5}}>{this.state.item.NOTICEDATE}</Text>
		        					</Body>
		        				</CardItem>
		        			</Card>
		        		:
		        			null
		        	}

		        		
									
		        	<Card style={{alignSelf: 'center'}}>
		        		<CardItem>
		        		{
							(Platform.OS === "ios") ?
								<WebView
								  injectedJavaScript={BaseScript}
								  source={{ html: 
								  		FixTinyText+
								  		CopyPastDisable+
								  		this.state.item.CONTENT}}
								  style={{
								    width: "100%",
								    height: this.state.height,
								    backgroundColor: 'transparent'
								  }}
							      onMessage={event => this.onMessage(event.nativeEvent.data) }
								/>	
							:

								<WebView
								  injectedJavaScript={BaseScript}
								  source={{ html: 
								  	FixTinyText+
								  	CopyPastDisable+
								  	this.state.item.CONTENT, baseUrl:'' }}
								  style={{
								    flex:0,
								    height: this.state.height,
								    backgroundColor: 'transparent'
								  }}
							      // javaScriptEnabled // 仅限Android平台。iOS平台JavaScript是默认开启的。
							      // scrollEnabled={false}
							      onMessage={event => this.onMessage(event.nativeEvent.data) }
								/>
		        		}
		        		
		        		</CardItem>
		        	</Card>
		        </Content>
		        */}
			</Container>
		);

		return (
		  <WaterMarkView 
		    contentPage = {noticePage} 
		    pageId = {"NoticePage"}
            height = { (this.state.height > this.props.style.PageSize.height) ? this.state.height : null}
		  />
		);
	}
}

export let NoticePageStyle = connectStyle( 'Page.HomePage', {} )(NoticePage);
export default connect(
  (state) => ({
    state: {...state}
  })
)(NoticePageStyle);