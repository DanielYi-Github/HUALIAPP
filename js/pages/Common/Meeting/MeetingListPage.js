import React from 'react';
import { View, Keyboard, SafeAreaView, SectionList, StyleSheet } from 'react-native';
import { Container, Header, Body, Left, Right, Button, Item, Icon, Input, Title, Text, Label, Segment, connectStyle} from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SearchInput, { createFilter } from 'react-native-search-filter'; 
const KEYS_TO_FILTERS = ['EMPID', 'DEPNAME', 'NAME', 'MAIL', 'SKYPE', 'CELLPHONE','TELPHONE','JOBTITLE'];

import * as NavigationService from '../../../utils/NavigationService';
import HeaderForSearch        from '../../../components/HeaderForSearch';

const DATA = [
  {
    title: "Main dishes",
    data: ["Pizza", "Burger", "Risotto"]
  },
  {
    title: "Sides",
    data: ["French Fries", "Onion Rings", "Fried Shrimps"]
  },
  {
    title: "Drinks",
    data: ["Water", "Coke", "Beer"]
  },
  {
    title: "Desserts",
    data: ["Cheese Cake", "Ice Cream"]
  }
];

class MeetingListPage extends React.PureComponent  {
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
        SegmentButton  :"all"
      }
	}

	render() {
    return (
      <Container>
        <HeaderForSearch
          isShowSearch = {this.state.isShowSearch}
          placeholder  = {this.props.Language.lang.ContactPage.SearchKeyword}
          onChangeText ={(text) => { 
              let sText = sify(text);   //簡體中文
              let tText = tify(text);   //繁體中文
              if (tText === sText) {    // 不是中文字
                this.setState({ 
                  keyword:text,
                  isChinesKeyword:false
                }); 
              } else {                  // 是中文字
                this.setState({ 
                  sKeyword:sText,
                  tKeyword:tText,
                  isChinesKeyword:true
                }); 
              }
          }}
          closeSearchButtomOnPress={() =>{
            this.setState({ 
              isShowSearch   :false,
              isChinesKeyword:false, 
              keyword        :"",    
              sKeyword       :"",    
              tKeyword       :"",
            })
          }}
          searchButtomOnPress={Keyboard.dismiss}
          searchButtomText={this.props.Language.lang.Common.Search}
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:'arrow-back'}}
          leftButtonOnPress     = {() =>NavigationService.goBack()} 
          isRightButtonIconShow = {true}
          rightButtonIcon       = {{name:'search'}}
          rightButtonOnPress    = {()=>{ this.setState({ isShowSearch:true }); }} 
          // title                 = {this.props.Language.lang.HomePage.Contacts}
          title                 = {"會議查詢"}
          titleOnPress          = {()=>{ this.setState({ isShowSearch:true }) }}
        />
        <Segment style={{backgroundColor: rgba(0,0,0,0)}}>
          <Button 
            first 
            style={{width:"32%", justifyContent: 'center' }} 
            active={this.state.SegmentButton == "all"}
            onPress={()=>{
              this.setState({SegmentButton:"all"});
            }}
          >
            <Text>全部</Text>
          </Button>
          <Button 
            style={{width:"30%", justifyContent: 'center'}} 
            active={this.state.SegmentButton == "create"}
            onPress={()=>{
              this.setState({SegmentButton:"create"});
            }}
          >
            <Text>我發起</Text>
          </Button>
          <Button 
            last 
            style={{width:"32%", justifyContent: 'center'}} 
            active={this.state.SegmentButton == "invited"}
            onPress={()=>{
              this.setState({SegmentButton:"invited"});
            }}
          >
            <Text>被邀請</Text>
          </Button>
        </Segment>
        <SafeAreaView>
          <SectionList
            sections            ={DATA}
            keyExtractor        ={(item, index) => item + index}
            renderItem          ={this.renderItem}
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
        </SafeAreaView>
      </Container>
    );
	}

  renderItem = (item) => {
    item = item.item;
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{item}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8
  },
  header: {
    fontSize: 32,
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 24
  }
});

let MeetingListPageStyle = connectStyle( 'Page.MeetingPage', {} )(MeetingListPage);
export default connect(
  (state) => ({...state})
)(MeetingListPageStyle);

