import React, { Component } from 'react';
import { Container, Content, Header, Left, Right, Item, Label, Body, Title, Button, Icon, Text, connectStyle } from 'native-base';
import { View, ScrollView, StyleSheet }from 'react-native';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import * as NavigationService    from '../../utils/NavigationService';
import HeaderForGeneral  from '../HeaderForGeneral';


class FormContentGridDataTablePage extends Component {
	constructor(props) {
		super(props);
		let tableHead = [];
		for(let i in props.route.params.data.listComponent){
			if(props.route.params.data.listComponent[i].columntype != "hidetxt"){
				tableHead.push(props.route.params.data.listComponent[i].component.name);
			}
		}
		this.state = {
			data     : this.props.route.params.data,
			lang     : this.props.route.params.lang,
			user     : this.props.route.params.user,
			tableHead: tableHead,
			widthArr : [70, 70, 80, 100, 100, 100, 100, 100, 100]
		};
	}

	render() {
		const state = this.state;
		const tableData = [];

		for(let i in state.data.defaultvalue){
			const rowData = [];
			for(let j in state.data.defaultvalue[i]){
				if (state.data.defaultvalue[i][j].columntype != "hidetxt") {
					rowData.push(state.data.defaultvalue[i][j].defaultvalue);
				}
			}
			tableData.push(rowData);
		}

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
				  title                 = {this.state.data.component.name}
				  isTransparent         = {false}
				/>
				<Content horizontal={true}>
					<View>
						<Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
						  <Row 
								data      ={state.tableHead} 
								widthArr  ={state.widthArr} 
								style     ={styles.header} 
								textStyle ={styles.text}
						  />
						</Table>

						<Content>
							<Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
							  {
							    tableData.map((rowData, index) => (
							      <Row
									key       ={index}
									data      ={rowData}
									widthArr  ={state.widthArr}
									style     ={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}
									textStyle ={styles.text}
							      />
							    ))
							  }
							</Table>
						</Content>
		      		</View>
				</Content>
			</Container>
		)
	}
}

const styles = StyleSheet.create({
	  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
	  header: { height: 50, backgroundColor: '#537791'},
	  text: { textAlign: 'center', fontWeight: '100' },
	  dataWrapper: { marginTop: -1 },
	  row: { height: 40, backgroundColor: '#E7E6E1' }
	});

export default connectStyle( 'Component.FormContent', {} )(FormContentGridDataTablePage);
