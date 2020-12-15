import React from 'react';
import { Text, Container, Header, Left, Button, Icon, Body, Title, Right, Content, connectStyle} from 'native-base';
import { connect } from 'react-redux';
import FunctionPageBanner from '../../../components/FunctionPageBanner';
import HeaderForGeneral   from '../../../components/HeaderForGeneral';
import * as NavigationService  from '../../../utils/NavigationService';	

class PublishPage extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<Container>
			{/*標題列*/}
			<HeaderForGeneral
			  isLeftButtonIconShow  = {true}
			  leftButtonIcon        = {{name:"arrow-back"}}
			  leftButtonOnPress     = {() =>NavigationService.goBack()} 
			  isRightButtonIconShow = {false}
			  rightButtonIcon       = {null}
			  rightButtonOnPress    = {null} 
			  title                 = {this.props.lang.SendInformation}
			  isTransparent         = {false}
			/>
		        <Content>
					<FunctionPageBanner
						explain         ={this.props.lang.FunctionInfo}	//可將訊息發送給全體同仁、特定部門或人員，重要訊息及時通知
						isShowButton    ={false}
						buttonText      ={true}
						imageBackground ={require("../../../image/functionImage/Publish.jpg")}
						onPress         ={this.showActionSheet}
					/>
				<Body style={[{width: "100%", alignItems: 'flex-start', paddingLeft:25,paddingTop:15,paddingBottom:15}]}>
					<Title style={{color:this.props.style.inputWithoutCardBg.inputColor}}>
						{this.props.lang.ImportantDesc}
					</Title>
				</Body>
				<Body>
					<Text style={{color:this.props.style.inputWithoutCardBg.inputColor}}>{this.props.lang.Description}</Text>
				</Body>
				<Button 
				  onPress = {this.launchPublish.bind(this)} 
				  style   = {[this.props.style.Button,{backgroundColor: '#ff6633'}]}>
				    <Text>
				    	{this.props.lang.StartButton}
				    </Text>
				</Button>
     			</Content>
			</Container>
		);
	}

	launchPublish() {
		this.props.navigation.navigate("PublishSubmit");
	}
}

export let PublishPageStyle = connectStyle( 'Component.InputWithoutCardBackground', {} )(PublishPage);

export default connect(
	(state) => ({
		lang: state.Language.lang.PublishPage
	})
)(PublishPageStyle);

