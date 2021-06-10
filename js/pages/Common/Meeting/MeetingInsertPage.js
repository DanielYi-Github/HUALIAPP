import React from 'react';
import { View, Keyboard, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Item, Icon, Input, Text, Label, Button, ListItem, connectStyle} from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TagInput          from 'react-native-tags-input';
import SearchInput, { createFilter } from 'react-native-search-filter'; 
const KEYS_TO_FILTERS = ['EMPID', 'DEPNAME', 'NAME', 'MAIL', 'SKYPE', 'CELLPHONE','TELPHONE','JOBTITLE'];

import * as NavigationService from '../../../utils/NavigationService';
import HeaderForGeneral   from '../../../components/HeaderForGeneral';
import FormInputContent   from '../../../components/Form/FormInputContent';

class MeetingInsertPage extends React.PureComponent  {
	constructor(props) {
	    super(props);
	    this.state = {
        isChinesKeyword:false,       //用來判斷關鍵字是否為中文字
        keyword        :"",          //一般搜尋
        sKeyword       :"",          //簡體中文
        tKeyword       :"",          //繁體中文
        ContactData    :[],
        isShowSearch   :false,
        isLoading      :false,
        showFooter     :false,
        tags: {
                tag: '',
                tagsArray: ["123","345"]
              },
      }
	}

	render() {
    let meetingTitle = {
      columntype: "txt",
      columnsubtype: null,
      component: {name: "會議主題", id: "tfwApplyDate"},
      listComponent: null,
      required: "N",
      defaultvalue: "",
      actionColumn: [],
      action: null,
      columnactionColumn: [],
      columnaction: null,
      isedit: "N",
      paramList: null,
      rulesList: null,
    };

    let meetingExplain = {
      columntype: "tar",
      columnsubtype: null,
      component: {name: "說明", id: "tfwApplyDate"},
      listComponent: null,
      required: "N",
      defaultvalue: "2021/02/22",
      actionColumn: [],
      action: null,
      columnactionColumn: [],
      columnaction: null,
      isedit: "N",
      paramList: null,
      rulesList: null,
    };

    let meetingTimeStart = {
      columntype: "txt",
      columnsubtype: null,
      component: {name: "申請日期", id: "tfwApplyDate"},
      listComponent: null,
      required: "N",
      defaultvalue: "2021/02/22",
      actionColumn: [],
      action: null,
      columnactionColumn: [],
      columnaction: null,
      isedit: "N",
      paramList: null,
      rulesList: null,
    };

    let meetingTimeEnd = {
      columntype: "txt",
      columnsubtype: null,
      component: {name: "申請日期", id: "tfwApplyDate"},
      listComponent: null,
      required: "N",
      defaultvalue: "2021/02/22",
      actionColumn: [],
      action: null,
      columnactionColumn: [],
      columnaction: null,
      isedit: "N",
      paramList: null,
      rulesList: null,
    };

    return (
      <Container>
        <HeaderForGeneral
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:"arrow-back"}}
          leftButtonOnPress     = {() =>NavigationService.goBack()} 
          isRightButtonIconShow = {false}
          rightButtonIcon       = {null}
          rightButtonOnPress    = {null} 
          title                 = {"新增會議"}
          isTransparent         = {false}
        />
        <Content>
          {/*會議主題*/}
          <Item style={{
            backgroundColor: '#fff',
            marginTop: 20,
            borderWidth: 0,
            paddingLeft: 10,
          }}>
              <Label>會議主題</Label>
              <Input 
                  scrollEnabled={false}
                  textAlign="right"
              />
          </Item>

          <Item style={{
            backgroundColor: '#fff',
            borderWidth: 0,
            paddingLeft: 10,
          }}>
              <Label>說明</Label>
              <Input 
                multiline 
                scrollEnabled={false}
                textAlign="right"
              />
          </Item>

          {/*時間*/}
           <Item style={{
            backgroundColor: '#fff',
            marginTop: 30,
            borderWidth: 0,
            flexDirection: 'row' 
          }}>
            <TouchableOpacity style={{flex:1, flexDirection: 'column', paddingTop: 10, paddingBottom: 10, paddingLeft: 5, paddingRight: 10}}>
              <Text>{"10月13號 週四"}</Text>
              <Text>{"10:00"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flex:1, flexDirection: 'column', paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10}}>
              <Text>{"5月13號 週四"}</Text>
              <Text>{"10:00"}</Text>
            </TouchableOpacity>
          </Item>

          {/*會議人員*/}
          <Item 
            style={{
              backgroundColor: '#fff',
              marginTop: 30,
              borderWidth: 0,
              height: this.props.style.inputHeightBase,
              paddingLeft: 10,
              paddingRight: 5
            }}
            onPress = {()=>{
              console.log("567890");
            }}
          >
            <Icon name='person-outline' />
            <Label style={{flex:1}}>會議主席</Label>
            <Text style={{}}>會議主席</Text>
            <Icon name='arrow-forward' />
          </Item>

          <Item style={{
            backgroundColor: '#fff',
            borderWidth: 10,
            height: this.state.tags.tagsArray.length == 0 ? this.props.style.inputHeightBase: null,
            paddingLeft: 10,
            paddingRight: 5,
            flexDirection: 'column',
            alignContent: 'flex-start',
            justifyContent: 'flex-start',
            paddingTop: 10

          }}>
            <View style={{
              flexDirection: 'row', 
              justifyContent: 'flex-start', 
              alignContent: 'flex-start', 
              width: '100%',
              borderWidth: 0
            }}>
              <Icon name='people-outline' />
              <Label style={{alignSelf: 'center', flex:1}}>{"邀請參與人"}</Label>
              <Icon 
                name    ="add-circle" 
                type    ="MaterialIcons" 
                style   ={{fontSize:30, color: '#20b11d'}}
                onPress ={()=>{
                  NavigationService.navigate("MeetingInsertWithTags",{});
                }}
              />
            </View>
            
            <TagInput
              updateState={this.updateTagState}
              disabled={false}
              autoFocus={false}
              tags={this.state.tags}
              containerStyle={{paddingLeft: 0, paddingRight: 0 }}
              inputContainerStyle={{ height: 0 }}
              tagsViewStyle={{ marginTop: 0 }}
              tagStyle={{backgroundColor:"#DDDDDD", borderWidth:0}}
              tagTextStyle={{color:"#666"}}
            />
          </Item>


          {/*參與方式*/}
          <Item 
            style={{
              backgroundColor: '#fff',
              borderWidth: 0,
              height: this.props.style.inputHeightBase,
              paddingLeft: 10,
              paddingRight: 5,
              marginTop: 30,
            }}
            onPress = {()=>{
              console.log("567890");
            }}
          >
            <Icon name='meeting-room' type="MaterialIcons"/>
            <Label style={{flex:1}}>參會方式</Label>
            <Icon name='arrow-forward' />
          </Item>
          <Item 
            style={{
              backgroundColor: '#fff',
              borderWidth: 0,
              height: this.props.style.inputHeightBase,
              paddingLeft: 10,
              paddingRight: 5
            }}
            onPress = {()=>{
              console.log("567890");
            }}
          >
            <Label>會議室-號碼</Label>
            <Input 
                scrollEnabled={false}
                textAlign="right"
            />
          </Item>
          <Item 
            style={{
              backgroundColor: '#fff',
              borderWidth: 0,
              height: this.props.style.inputHeightBase,
              paddingLeft: 10,
              paddingRight: 5
            }}
            onPress = {()=>{
              console.log("567890");
            }}
          >
            <Label>會議室-密碼</Label>
            <Input 
                scrollEnabled={false}
                textAlign="right"
            />
          </Item>
          
          {/*會議前提醒*/}
          <Item 
            style={{
              backgroundColor: '#fff',
              borderWidth: 0,
              height: this.props.style.inputHeightBase,
              paddingLeft: 10,
              paddingRight: 5,
              marginTop: 30,
            }}
            onPress = {()=>{
              console.log("567890");
            }}
          >
            <Icon name='clock-alert-outline' type="MaterialCommunityIcons" />
            <Label style={{flex:1}}>會議前提醒</Label>
            <Text>15分鐘</Text>
            <Icon name='arrow-forward' />
          </Item>

          <Button style={{
            alignSelf: 'center',
            marginTop: 40,
            marginBottom: 40,
            width: '50%',
            justifyContent: 'center'  
          }}>
            <Text>確定</Text>
          </Button>
        </Content>
      </Container>
    );
	}

  updateTagState = (state) => {
    this.setState({
      tags: state
    })
  };

  updateFormData = () => {
  }
}

let MeetingInsertPageStyle = connectStyle( 'Page.MeetingPage', {} )(MeetingInsertPage);
export default connect(
  (state) => ({...state})
)(MeetingInsertPageStyle);

/*
{
  columntype: "txt",
  columnsubtype: null,
  component: {name: "申請日期", id: "tfwApplyDate"},
  listComponent: null,
  required: "N",
  defaultvalue: "2021/02/22",
  actionColumn: [],
  action: null,
  columnactionColumn: [],
  columnaction: null,
  isedit: "N",
  paramList: null,
  rulesList: null,
}
*/
