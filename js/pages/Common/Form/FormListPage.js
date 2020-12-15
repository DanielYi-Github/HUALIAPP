import React from 'react';
import { View, FlatList, RefreshControl, Platform } from 'react-native';
import { Container, Header, Icon, Left, Button, Body, Right, Title, Content, Text} from 'native-base';
import ActionSheet from 'react-native-actionsheet';
import SearchInput, { createFilter } from 'react-native-search-filter'; 
const KEYS_TO_FILTERS = ['processid'];

import * as NavigationService from '../../../utils/NavigationService';
import FormItem          from '../../../components/Form/FormItem';
import NoMoreItem        from '../../../components/NoMoreItem';
import WaterMarkView     from '../../../components/WaterMarkView';
import HeaderForGeneral  from '../../../components/HeaderForGeneral';
import * as FormAction   from '../../../redux/actions/FormAction';



import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


class FormListPage extends React.Component {
  constructor(props) {
    super(props);
    let item = this.props.route.params.item;
    this.state = {
      header           : item.label,
      formType         : item.key,
      FormSelectList   : [{ key: "all", label: this.props.state.Language.lang.MyFormListPage.FormTypeAll }, ...item.content ],
      DefaultFormSelect: { key: 'all', label: this.props.state.Language.lang.MyFormListPage.FormTypeAll },
      refreshing       : this.props.state.Form.isLoadDone ? false : true,
      isSelectedCompany: this.props.route.params.isSelectedCompany
    }
  }

  /*
  componentWillReceiveProps(nextProps) {
    if (nextProps.state.Form.FormSigns.length != 0) {
      this.setState({
        refreshing:false,
      });
    }
  }
  */

  getWhichFormData = () => {
    let forms = this.props.state.Form.FormSigns;
    /* 是否群千
    for (let i in forms) {
      if (forms[i].isGroupSign != "true") { forms[i].isGroupSign = "false" }
    }
    */
    
    if (this.state.formType == "NotGroupSign") {
      forms = forms.filter(createFilter("false", "isGroupSign"));
    } else {
      forms = forms.filter(createFilter("true", "isGroupSign"));
      let data = [];
      for (let i in forms) {
        if( forms[i].formtype == this.state.formType) data.push(forms[i]); 
      }
      forms = data;
    }
    return forms;
  }

  // 公司清單的篩選
  filterCompany = (forms) => {
    let KEYS_TO_FILTERS = ['creatorCO'];
    return forms.filter(createFilter(this.state.isSelectedCompany.CLASS3, KEYS_TO_FILTERS));
  }

  render() {
    let FormData = this.getWhichFormData();   // 資料來源
    FormData = this.state.isSelectedCompany ? this.filterCompany(FormData) : FormData;  // 公司清單篩選

    let filteredData;
    if (this.props.state.Form.isLoadDone) {
      filteredData = (this.state.DefaultFormSelect.key=="all") 
              ? FormData : FormData.filter(createFilter(this.state.DefaultFormSelect.key, KEYS_TO_FILTERS));
    } else {
      filteredData = [];
    }

    /*
    // 過濾資料
    let filteredData = (this.state.DefaultFormSelect.key=="all") 
        ? FormData : FormData.filter(createFilter(this.state.DefaultFormSelect.key, KEYS_TO_FILTERS));
    */
    let formListPage = (
        <Container>
        {/*標題列*/}
        <HeaderForGeneral
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:"arrow-back"}}
          leftButtonOnPress     = {() =>NavigationService.goBack()} 
          isRightButtonIconShow = {true}
          rightButtonIcon       = {{name:"funnel"}}
          rightButtonOnPress    = {() => this.ActionSheet.show()} 
          title                 = {this.state.header}
          isTransparent         = {false}
        />

        <FlatList
          keyExtractor        ={(item, index) => index.toString()}
          data                = {filteredData}
          extraData          ={filteredData}
          renderItem          = {this.renderFormItem}
          ListFooterComponent = {this.renderFooter}
          refreshControl      ={
            <RefreshControl
              // refreshing = {this.state.refreshing}
              refreshing = {false}
              // refreshing = {!this.props.state.Form.isLoadDone}
              colors     = {['#3691ec']}
              title      = "Loading..."
              progressBackgroundColor = "#fff"
              onRefresh  ={this.handleOnRefresh.bind(this)}

            />
          }
        />
          
        {this.renderActionSheet()}
      </Container>
    );

    return <WaterMarkView contentPage={formListPage} pageId={"FormListPage"} />;
  }

  renderFormItem = (item) => {
    item = item.item;
    return(
      <FormItem 
        item = {item}
        onPress = {() => this.goNext(item)}
        Lang_FormStatus = {this.props.state.Language.lang.FormStatus}
      />
    );
  }

  renderFooter = () => {
    if (this.props.state.Form.isLoadDone) {
      return <NoMoreItem text={this.props.state.Language.lang.ListFooter.NoMore}/>
    } else {
      return <NoMoreItem text={this.props.state.Language.lang.ListFooter.Loading}/>
    }
  }

  goNext(item) {
    NavigationService.navigate("Form", { Form : item });
  }

  renderActionSheet = () => {
    let types = [];
    this.state.FormSelectList.forEach((item, index, array) => { types.push(item.label); });
    let BUTTONS = [...types, this.props.state.Language.lang.Common.Cancel];
    let CANCEL_INDEX = types.length;

    return (
      <ActionSheet
        ref     ={o => this.ActionSheet = o}
        title   ={this.props.state.Language.lang.FormListPage.Select}
        options ={BUTTONS}
        cancelButtonIndex ={CANCEL_INDEX}
        onPress           ={(buttonIndex) => { 
          if (buttonIndex != CANCEL_INDEX) {
            this.setState({ DefaultFormSelect: this.state.FormSelectList[buttonIndex] });
          }
        }}  
      />
    );
  }

  handleOnRefresh(){
    let user = this.props.state.UserInfo.UserInfo;
    let langStatus = this.props.state.Language.langStatus;
    this.props.actions.loadFormTypeIntoState(user, langStatus); //取得表單簽核資料
    /*
    this.setState({ 
      isShowSearch:false,
      isShowSearchResult:false,
    });
    */
  }
}

export default connect(
  (state) => ({
    state: { ...state }
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...FormAction
    }, dispatch)
  })
)(FormListPage);