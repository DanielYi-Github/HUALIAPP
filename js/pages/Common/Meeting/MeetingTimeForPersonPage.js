import React from 'react';
import { View, Keyboard, SafeAreaView, SectionList } from 'react-native';
import { Container, Header, Body, Left, Right, Button, Item, Icon, Input, Title, Text, Label, Segment, connectStyle} from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SearchInput, { createFilter } from 'react-native-search-filter'; 
const KEYS_TO_FILTERS = ['EMPID', 'DEPNAME', 'NAME', 'MAIL', 'SKYPE', 'CELLPHONE','TELPHONE','JOBTITLE'];

import * as NavigationService from '../../../utils/NavigationService';
import HeaderForGeneral   from '../../../components/HeaderForGeneral';
import MeetingItemForPerson            from '../../../components/MeetingItemForPerson';
import NoMoreItem            from '../../../components/NoMoreItem';
import * as MeetingAction        from '../../../redux/actions/MeetingAction';

class MeetingTimeForPersonPage extends React.PureComponent  {
	constructor(props) {
	    super(props);
	    this.state = {
        person         : props.route.params.person,
        meetingDateTime: props.route.params.meetingDateTime ? props.route.params.meetingDateTime: []
      }
	}

  componentDidMount(){
    if( typeof this.props.route.params.person != "undefined" ) this.props.actions.getPersonDateTime(this.state.person.id);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.state.Meeting.person_meetingDateTime.length !== 0) {
        this.setState({
          meetingDateTime: nextProps.state.Meeting.person_meetingDateTime
        });
    }
  }

	render() {
    let meetingDateTime = this.formatPersonDateTime(this.state.meetingDateTime);

    return (
      <Container>
      <HeaderForGeneral
        isLeftButtonIconShow  = {true}
        leftButtonIcon        = {{name:"arrow-back"}}
        leftButtonOnPress     = {() =>NavigationService.goBack()} 
        isRightButtonIconShow = {false}
        rightButtonIcon       = {null}
        rightButtonOnPress    = {null} 
        // title                 = {`${this.state.person.name}的會議時程`}
        title                 = {`會議時程`}
        isTransparent         = {false}
      />
        <SectionList
          sections            ={meetingDateTime}
          keyExtractor        ={(item, index) => item + index}
          renderItem          ={this.renderItem}
          ListEmptyComponent  ={this.renderEmptyComponent}
          renderSectionHeader ={({ section: { title } }) => (
            <Label 
              style={{
                backgroundColor: this.props.style.containerBgColor,
                paddingLeft: '3%'
              }}
            >
              {title}
            </Label >
          )}
        />
      </Container>
    );
	}

  renderItem = (item) => {
    let items = item.item;
    return (
      <MeetingItemForPerson 
        name={item.section.meetings[item.index].name}
        item={items}
        data={item.section.meetings[item.index]}
      />
    );
  }

  renderEmptyComponent = () => {
    return (
      <NoMoreItem
        text={"暫時無會議"}
      />
    )
  }

  formatPersonDateTime(meetings){
    let dateArray = [];
    for(let dateMeeting of meetings){
      
      if (dateArray.length == 0) {
        dateArray.push({
          title:dateMeeting.date,
          data:[dateMeeting.date],
          meetings:[dateMeeting]
        })
      } else {
        if (dateMeeting.date == dateArray[dateArray.length-1].title) {
          dateArray[dateArray.length-1].data.push(dateMeeting.date);
          dateArray[dateArray.length-1].meetings.push(dateMeeting);
        } else {
          dateArray.push({
            title:dateMeeting.date,
            data:[dateMeeting.date],
            meetings:[dateMeeting]
          })
        }
      }
    }
    return dateArray;
  }
}

let MeetingTimeForPersonPageStyle = connectStyle( 'Page.MeetingPage', {} )(MeetingTimeForPersonPage);
export default connect(
  (state) => ({
    state: { ...state }
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...MeetingAction
    }, dispatch)
  })
)(MeetingTimeForPersonPageStyle);

