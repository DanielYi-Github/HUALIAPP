import React, { Component } from 'react';
import { Container, Content, Header, Left, Right, Item, Label, Body, Title, Button, Icon, Text, connectStyle } from 'native-base';
import { View, ScrollView }from 'react-native';
// import { DataTable } from 'react-native-paper';
import * as NavigationService    from '../../utils/NavigationService';
import HeaderForGeneral  from '../HeaderForGeneral';
import { Col, Row, Grid } from 'react-native-easy-grid';


class FormContentGridDataTablePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data              : this.props.route.params.data,
			lang              : this.props.route.params.lang,
			user              : this.props.route.params.user,
		};
	}

	render() {
		console.log(this.state.data, this.state.lang, this.state.user);
		return(
			<Container>
				{/*標題列*/}
				<HeaderForGeneral
				  isLeftButtonIconShow  = {true}
				  leftButtonIcon        = {{name:"arrow-back"}}
				  leftButtonOnPress     = {NavigationService.goBack} 
				  isRightButtonIconShow = {false}
				  rightButtonIcon       = {null}
				  rightButtonOnPress    = {null} 
				  title                 = {"datatable"}
				  isTransparent         = {false}
				/>
				<ScrollView horizontal={true}>
					<View>
					<Grid>
						<Row>
				          <Col style={{ backgroundColor: '#635DB7' }}><Text>123123</Text></Col>
				          <Col style={{ backgroundColor: '#00CE9F' }}><Text>345345</Text></Col>
						</Row>
			        </Grid>

					<ScrollView >
						<Grid>
							<Row>
					          <Col style={{ backgroundColor: '#635DB7' }}><Text>ff</Text></Col>
					          <Col style={{ backgroundColor: '#00CE9F' }}><Text>kkk</Text></Col>
							</Row>
							<Row>
					          <Col style={{ backgroundColor: '#635D00', height: 500 }}><Text>skjdhclkajsdhcjkhasdkcjjasdcl</Text></Col>
					          <Col style={{ backgroundColor: '#00009A', height: 500 }}></Col>
							</Row>
							<Row>
					          <Col style={{ backgroundColor: '#6300B3', height: 500 }}><Text>asjdhckjashd</Text></Col>
					          <Col style={{ backgroundColor: '#11CE92', height: 500 }}><Text>rrr</Text></Col>
							</Row>
							<Row>
					          <Col style={{ backgroundColor: '#635D11', height: 500 }}></Col>
					          <Col style={{ backgroundColor: '#00CE22', height: 500 }}><Text>123</Text></Col>
							</Row>
							<Row>
					          <Col style={{ backgroundColor: '#6300B7', height: 500 }}></Col>
					          <Col style={{ backgroundColor: '#00009F', height: 500 }}></Col>
							</Row>
							<Row>
					          <Col style={{ backgroundColor: '#6322B7', height: 500 }}></Col>
					          <Col style={{ backgroundColor: '#A0009F', height: 500 }}></Col>
							</Row>
				        </Grid>
			        </ScrollView>
			        </View>
		        </ScrollView>
				

			</Container>
		);
	}
}

export default connectStyle( 'Component.FormContent', {} )(FormContentGridDataTablePage);
