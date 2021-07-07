import React, { Component } from 'react';
import { View, Keyboard, SafeAreaView, SectionList, StyleSheet } from 'react-native';

import {Card, CardItem, Body, Icon, Text, Label, Title } from 'native-base';
import DateFormat             from  'dateformat';

export default class MeetingTimeSuggestItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let time1 = new Date();
		let time2 = new Date( DateFormat( time1, "yyyy-mm-dd HH:MM:ss").replace(' ', 'T') );
    	let isChangeTime = time1.getHours() == time2.getHours() ? false: true;

		let startdateSplit = this.props.data.startdate.split(" ");
		let enddateSplit = this.props.data.enddate.split(" ");
		let titleMessage = this.props.lang.crossDayMeeting; //"跨日會議";
		let isCrossDate = false;
		if (startdateSplit[0] == enddateSplit[0]) {
			titleMessage = startdateSplit[0];
			isCrossDate = true;
		}

		let startdate = new Date( this.props.data.startdate.replace(' ', 'T') );
		let enddate = new Date( this.props.data.enddate.replace(' ', 'T') );

		startdate = isChangeTime ? startdate.getTime()-28800000: startdate.getTime();
		enddate   = isChangeTime ? enddate.getTime()-28800000: enddate.getTime();
		
		return (
			<Card>
			  <CardItem button style={{borderWidth: 3, borderColor: '#03A9F4'}} onPress={this.props.onPress}>
			    <Body style={{width:"95%", alignContent: 'flex-start'}}>
			    	{
			    		isCrossDate ?
			    			<Text style={{fontWeight: 'bold'}}>
			    				{`${DateFormat( startdate, "mm/dd")}`}
			    			</Text>
			    		:
			    			<Text style={{fontWeight: 'bold'}}>
			    				{`${this.props.lang.crossDayMeeting} ${DateFormat( startdate, "mm/dd")} - ${DateFormat( enddate, "mm/dd")}`}
			    			</Text>
			    	}
			    	<Body style={{width: '100%', flexDirection: 'row', alignContent: 'space-between', marginTop: 3, marginBottom: 3}} >
			    		<Text style={{fontWeight: 'bold', fontSize: 22}}>
			    			{`${DateFormat( startdate, "HH:MM")}`}
			    		</Text>

			    		<View style ={{borderWidth: 3, borderColor: '#757575', width: 20, marginLeft: 20, marginRight: 20, borderRadius: 5}}/>

			    		<Text style={{fontWeight: 'bold', fontSize: 22}}>
			    			{`${DateFormat( enddate, "HH:MM")}`}
			    		</Text>
			    	</Body>
			    	<Body style={{width: '100%'}}>
			    		<Text style={{alignSelf: 'flex-start', fontWeight: 'bold', paddingRight: 10}}>
			    		  {/*"此段時間各位都有空"*/}
			    		  {this.props.lang.avalableTime}
			    		</Text>
			    	</Body>
			    </Body>

			    <Body style={{flex:null, justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: '#757575' }}>
			      <Title style={{paddingLeft: 10, color:"#03A9F4", fontWeight: 'bold'}}>
			        {/*前往新增*/}
			    	{this.props.lang.gotoInsert}
			      </Title>
			    </Body>

			  </CardItem>
			</Card>
		);
		
	}

}
