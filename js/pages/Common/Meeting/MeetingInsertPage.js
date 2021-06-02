import React from 'react';
import { View, Keyboard } from 'react-native';
import { Container, Header, Item, Icon, Input, Text, Label, connectStyle} from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SearchInput, { createFilter } from 'react-native-search-filter'; 
const KEYS_TO_FILTERS = ['EMPID', 'DEPNAME', 'NAME', 'MAIL', 'SKYPE', 'CELLPHONE','TELPHONE','JOBTITLE'];

import * as NavigationService from '../../../utils/NavigationService';
import HeaderForSearch        from '../../../components/HeaderForSearch';


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
        showFooter     :false
      }
	}

	render() {
    console.log(this.props);
    return (
      <Container>
        <HeaderForSearch
          /*搜尋框的部分*/
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
          /*標題框的部分*/
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:'arrow-back'}}
          leftButtonOnPress     = {() =>NavigationService.goBack()} 
          isRightButtonIconShow = {true}
          rightButtonIcon       = {{name:'search'}}
          rightButtonOnPress    = {()=>{ this.setState({ isShowSearch:true }); }} 
          // title                 = {this.props.Language.lang.HomePage.Contacts}
          title                 = {"新增會議"}
          titleOnPress          = {()=>{ this.setState({ isShowSearch:true }) }}
        />
      </Container>
    );
	}
}

let MeetingInsertPageStyle = connectStyle( 'Page.MeetingInsertPage', {} )(MeetingInsertPage);
export default connect(
  (state) => ({...state})
)(MeetingInsertPageStyle);