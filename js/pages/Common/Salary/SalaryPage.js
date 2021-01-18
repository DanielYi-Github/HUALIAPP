import React, { Component } from 'react';
import { View, Easing, Modal, Alert, Platform} from 'react-native';
import { Container, Content, Tabs, Tab, Spinner, connectStyle, Card, CardItem, Text, Title, Body, Button, ScrollableTab} from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Drawer from 'react-native-drawer-menu';

import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import * as SalaryAction      from '../../../redux/actions/SalaryAction';
import * as CommonAction      from '../../../redux/actions/CommonAction';

import * as NavigationService  from '../../../utils/NavigationService';
import MainPageBackground from '../../../components/MainPageBackground';
import HeaderForGeneral   from '../../../components/HeaderForGeneral';
import WaterMarkView      from '../../../components/WaterMarkView';
import FormInputContent   from '../../../components/Form/FormInputContent';
import SelectListButton   from '../../../components/MyFormSelectListButton';
import NoMoreItem         from '../../../components/NoMoreItem';

class SalaryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultYear:{
        key:"",
        label:""
      },
      defaultMonth:{
        key:"",
        label:""
      },
      selectMonth:[],
      isSalarySelectDaysLoadDone:false
    };
  }

  componentDidMount(){
    this.props.actions.getMisPsalyms();
    Platform.OS == 'android' ? this.props.actions.enableScreenShot(true): null;   
  }
  
  static getDerivedStateFromProps(nextProps, prevState){
    if (!prevState.isSalarySelectDaysLoadDone && nextProps.state.Salary.salarySelectDays.length != 0) {
      let year = nextProps.state.Salary.salarySelectDays[nextProps.state.Salary.salarySelectDays.length-1];
      let month = year.value[year.value.length-1];

      return {
        defaultYear: {
          key  :year.key,
          label:year.label
        },
        defaultMonth: {
          key:month.key,
          label:month.label
        },
        selectMonth:year.value,
        isSalarySelectDaysLoadDone:true
      };
    }
    return null;
  }

  componentDidUpdate(){
    if (
      this.props.state.Salary.isRefreshing == false && 
      this.props.state.Salary.isSuccess == false
    ) {
      setTimeout(()=>{
        Alert.alert(
          this.props.state.Language.lang.Common.Sorry,
          this.props.state.Salary.message,
          [
            { text: this.props.state.Language.lang.Common.Close, onPress: () => {
                NavigationService.goBack(); 
            }}
          ],
          { cancelable: false }
        );
      },200);
    }
  }
  
  render() {
    let isRefreshing = this.props.state.Salary.isRefreshing;
    let BASDAT   = isRefreshing ? null :this.renderContent(this.props.state.Salary.salaryData.BASDAT); 
    let ATNDDAT  = isRefreshing ? null :this.renderContent(this.props.state.Salary.salaryData.ATNDDAT); 
    let MSGETTOT = isRefreshing ? null :this.renderContent(this.props.state.Salary.salaryData.MSGETTOT); 
    let MSDDSTOT = isRefreshing ? null :this.renderContent(this.props.state.Salary.salaryData.MSDDSTOT); 

    let salaryPage = (
      <Drawer
        ref            ={(comp) => {this.drawer = comp;}}
        drawerWidth    ={this.props.style.PageSize.width*0.8}
        drawerContent  ={this.renderDrawerContent()}
        type           ={Drawer.types.Overlay}
        drawerPosition ={Drawer.positions.Right}
        easingFunc     ={Easing.ease}
      >
        <Container>
          <MainPageBackground height={200} />
          <HeaderForGeneral
            isLeftButtonIconShow  = {true}
            leftButtonIcon        = {{name:"arrow-back"}}
            leftButtonOnPress     = {() =>{
              this.props.actions.authenticateDisapprove();
              setTimeout(()=>{
                NavigationService.goBack(); 
              },200);
            }} 
            isRightButtonIconShow = {true}
            rightButtonIcon       = {{name:"funnel"}}
            rightButtonOnPress    = {()=>{this.drawer.openRightDrawer();}} 
            title                 = {this.props.state.Language.lang.SalaryPage.Salary}
            isTransparent         = {true}
          />

          <Tabs 
            // tabBarUnderlineStyle={this.props.style.TabBarUnderlineColor}
            tabBarUnderlineStyle={{ backgroundColor: '#FFF' }}
            // tabBarUnderlineStyle={{ backgroundColor: 'rgba(255,255,255,0)' }}
            // style={{backgroundColor: 'rgba(255,255,255,0)'}}
            renderTabBar={()=> <ScrollableTab style={{backgroundColor: 'rgba(255,255,255,0)', borderBottomColor: 'rgba(255,255,255,0)'}}/>}
          >
            <Tab 
              heading         ={this.props.state.Language.lang.SalaryPage.Basic} 
              textStyle       ={this.props.style.subtitle}
              activeTextStyle ={this.props.style.title}
              tabStyle        ={this.props.style.tabStyle}  
              activeTabStyle  ={this.props.style.tabStyle}
            >
              {BASDAT}
            </Tab>
            <Tab 
              heading         ={this.props.state.Language.lang.SalaryPage.Attendance} 
              textStyle       ={this.props.style.subtitle}
              activeTextStyle ={this.props.style.title}
              tabStyle        ={this.props.style.tabStyle}  
              activeTabStyle  ={this.props.style.tabStyle}
            >
              {ATNDDAT}
            </Tab>
            <Tab 
              heading         ={this.props.state.Language.lang.SalaryPage.Payable} 
              textStyle       ={this.props.style.subtitle}
              activeTextStyle ={this.props.style.title}
              tabStyle        ={this.props.style.tabStyle}  
              activeTabStyle  ={this.props.style.tabStyle}
            >
              {MSGETTOT}
            </Tab>
            <Tab 
              heading         ={this.props.state.Language.lang.SalaryPage.Deduction} 
              textStyle       ={this.props.style.subtitle}
              activeTextStyle ={this.props.style.title}
              tabStyle        ={this.props.style.tabStyle}  
              activeTabStyle  ={this.props.style.tabStyle}
            >
              {MSDDSTOT}
            </Tab>
          </Tabs>

          {/*是否顯示loading 畫面*/}
          {
            (this.props.state.Salary.isRefreshing) ? 
              <Modal
                animationType="fade"
                transparent={true}
                visible={true}
                onRequestClose={() => {}}>
                <Container style={{
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  backgroundColor:this.props.style.SpinnerbackgroundColor
                }}>
                  <Spinner color={this.props.style.SpinnerColor}/>
                  <Text style={{color:this.props.style.inputWithoutCardBg.inputColor}}>
                    {this.props.state.CreateForm.refreshInfo}
                  </Text>
                </Container>
              </Modal>
            :
              null
          }
        </Container>
      </Drawer>
    );

    return (
      <WaterMarkView 
        contentPage = {salaryPage} 
        pageId = {"SalaryPage"}
      />
    );
  }

  renderDrawerContent = () => {
    let containerBgColor = this.props.state.Theme.theme.variables.containerBgColor; 
    let contentStyle = this.props.state.Theme.theme.variables.contentStyle;
    return(
      <Container style={{backgroundColor: containerBgColor=="rgba(0,0,0,0)" ? contentStyle: containerBgColor }}>
        {/*標題列*/}
        <HeaderForGeneral
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:"close"}}
          leftButtonOnPress     = {()=>{this.drawer.closeRightDrawer();}} 
          isRightButtonIconShow = {false}
          rightButtonIcon       = {null}
          rightButtonOnPress    = {null} 
          title                 = {this.props.state.Language.lang.SalaryPage.AdvanceSearch}
          isTransparent         = {false}
        />
        <Content>
          <SelectListButton
            text={this.props.state.Language.lang.SalaryPage.SelectYear}
            defaultData={this.state.defaultYear} 
            data={this.props.state.Salary.salarySelectDays}
            onPress={(item, index) => {
              let years = this.props.state.Salary.salarySelectDays;
              for (var i in years) {
                if (years[i].key == item) {
                  this.setState({
                    defaultYear: {
                      key  : years[i].key,
                      label: years[i].key
                    },
                    defaultMonth: {
                      key  : years[i].value[0].key,
                      label: years[i].value[0].label
                    },
                    selectMonth:years[i].value
                  });
                }
              }
            }}
          />
          <SelectListButton
            text={this.props.state.Language.lang.SalaryPage.SelectMonth}
            defaultData={this.state.defaultMonth} 
            data={this.state.selectMonth}
            onPress={(item) => {
              for (var i in this.state.selectMonth) {
                if (this.state.selectMonth[i].key == item) {
                  this.setState({
                    defaultMonth:{ key:item, label:item}
                  });
                }
              }
            }}
          />

          <Body style={{height:this.props.style.PageSize.height*0.1}}/>
          <Button block info 
            style={{width:"70%", alignSelf: 'center'}}
            onPress={()=>{
              this.props.actions.getMisSalary(this.state.defaultYear.key + this.state.defaultMonth.key); 
              this.drawer.closeRightDrawer();
            }}
          >
            {/*搜尋*/}
            <Text>{this.props.state.Language.lang.MyFormListPage.Search}</Text>
          </Button>

        </Content>
      </Container>
    );
  }

  renderContent = (items) => {
    items = (typeof items == "undefined") ? [] : items;
    let app = [];
    for (let index in items) {
      let editable = (items[index].isedit == "Y") ? true: false; 
      app.push(
        <FormInputContent 
          key      ={index} 
          data     ={items[index]} 
          onPress  ={()=>{}}
          editable ={editable}
          lang     ={this.props.state.Language.lang}
          user     ={this.props.state.UserInfo.UserInfo}
        />
      );
    }

    let context = null;
    if (items.length == 0) {
      context = <NoMoreItem text={this.props.state.Language.lang.Common.NoDate}/>;
    } else {
      context = (
        <Card>
          <CardItem style={{flexDirection: 'column'}}>          
            {app}
          </CardItem>
        </Card>
      ) 
    }

    let content = (
      <View style={{flex:1, paddingTop: 15}}>
        <Content>
          { context }
          <View style={{ 
              justifyContent: 'flex-start', 
              alignItems: 'flex-start',  
              alignSelf: 'center', 
              width:'90%', 
              paddingTop:20, 
              paddingBottom:20
          }}>
            <View style={{flexDirection: 'row', alignItems: 'flex-start',paddingBottom: 5}}>
              <Title style={{color:"red"}}>{this.props.state.Language.lang.Common.Alert}:</Title>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
              <Text>1.</Text>
              <Text>{this.props.state.Language.lang.SalaryPage.Alert1}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
              <Text>2.</Text>
              <Text>{this.props.state.Language.lang.SalaryPage.Alert2}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
              <Text>3.</Text>
              <Text>{this.props.state.Language.lang.SalaryPage.Alert3}</Text>
            </View>
          </View>
        </Content>
      </View>
    );
    return content;
  }

  renderRefreshingContent = () => {
    return (
      <View style={{flex:1, paddingTop: 15}}>
        <NoMoreItem text={this.props.state.Language.lang.ListFooter.Loading}/>
      </View>
    );
  }

  componentWillUnmount(){
    this.props.actions.authenticateDisapprove();
    Platform.OS == 'android' ? this.props.actions.enableScreenShot(false): null;
  }
}

export let SalaryPageStyle = connectStyle( 'Page.FormPage', {} )(SalaryPage);

export default connect(
  (state) => ({
    state: {...state}
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...SalaryAction,
      ...CommonAction
    }, dispatch)
  })
)(SalaryPageStyle);