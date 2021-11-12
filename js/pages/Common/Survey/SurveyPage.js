import React, { Component } from 'react';
import { View, Platform, Alert, Modal, Dimensions } from 'react-native';
import { Container, Header, Content, Icon, Button, Body, Right, Title, Item, Input, Text, Card, CardItem, Tabs, Tab, TabHeading, ScrollableTab, Left, Spinner, connectStyle, Label } from 'native-base';
import StepIndicator from 'react-native-step-indicator';
import Carousel from 'react-native-snap-carousel';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'

import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';

import * as NavigationService     from '../../../utils/NavigationService';
import ToastUnit             from '../../../utils/ToastUnit';
import MainPageBackground    from '../../../components/MainPageBackground';
import HeaderForGeneral      from '../../../components/HeaderForGeneral';
import FormInputContent      from '../../../components/Form/FormInputContent';
import CustomModal           from '../../../components/CustomModal';
import * as SurveyAction from '../../../redux/actions/SurveyAction';
// import * as CreateFormAction from '../../../redux/actions/CreateFormAction';
// import * as MyFormAction     from '../../../redux/actions/MyFormAction';

const customStyles = {
  // 圈圈寬度
  // currentStepStrokeWidth: 3,
  stepStrokeWidth: 3,
  
  labelColor: '#FFF',          // 其他圈圈下面的文字顏色
  currentStepLabelColor: '#FFF',  // 目標圈圈下面的文字顏色          

  //圈圈的外部圈圈顏色
  stepStrokeFinishedColor: '#66FF99',
  stepStrokeCurrentColor: '#66FF99',
  stepStrokeUnFinishedColor: '#aaa',

  //線條顏色
  separatorFinishedColor: '#66FF99',
  separatorUnFinishedColor: '#aaa',
  // separatorStrokeWidth: 2,           //線條寬度

  //圈圈裡面的文字背景顏色
  stepIndicatorFinishedColor: '#66FF99',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorUnFinishedColor: '#fff',

  //圈圈裡面的文字顏色
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelCurrentColor: '#000', 
  stepIndicatorLabelUnFinishedColor: '#aaa',
}

class SurveyPage extends React.Component {
  constructor(props) {
    super(props);

    //設定表單標題名稱
    let SurveyFormName, SurveyOID = this.props.route.params.SurveyOID;
    let functions = this.props.state.Home.FunctionData;
    for(let i in functions){
      SurveyFormName = (functions[i].ID == "Survey") ? functions[i].NAME : "";
      if (functions[i].ID == SurveyOID) {
          SurveyFormName = functions[i].NAME
          break;
      }
    }
    this.state = {
      SurveyOID         : SurveyOID,
      SurveyFormName       : SurveyFormName,
      currentPosition: 0
    };

    this.carousel = null;
    this.renderContent = this.renderContent.bind(this);
  }
  
  componentDidMount(){
    this.props.actions.getSurveyFormat(this.state.SurveyOID);  // 撈取表單填寫格式
  }
  
  shouldComponentUpdate(nextProps, nextState){
    // 避免重複跳頁
    if (this.state.currentPosition != nextState.currentPosition) {
      return true;
    }

    if (nextProps.state.Survey.ruleCheckMessage) {
      Alert.alert(
        this.props.state.Language.lang.SurveyPage.WrongData, //資料錯誤
        nextProps.state.Survey.ruleCheckMessage,
        [{
          text: this.props.state.Language.lang.SurveyPage.GotIt,  // 我知道了
          onPress: () => {}
        }],
        { cancelable: false }
      )
    }

    let checkRequired = nextProps.state.Survey.checkRequired;
    if(checkRequired != null){
      if (checkRequired) {
        /*
        let gotoPageIndex = nextProps.state.Survey.gotoPageIndex;
        if (gotoPageIndex != null) {
          this._carousel.snapToItem(gotoPageIndex);
        } else {
          this._carousel.snapToNext();
        }
        */
        // 送值
        this.props.actions.submitSurveyValue();
      } else {
        ToastUnit.show('error', this.props.state.Language.lang.SurveyPage.RequiredFieldAlert);
      }
    }
    
    if (nextProps.state.Survey.submitResult != null) {
      let Survey = nextProps.state.Survey;
      
      setTimeout(()=>{
        Alert.alert(
          Survey.submitResult ? this.props.state.Language.lang.SurveyPage.Sucess : this.props.state.Language.lang.SurveyPage.Fail,
          Survey.refreshInfo,
          [{
            text: 'OK', 
            onPress: () => {
              if (Survey.submitResult) {
                this.closeCreateForm();
                // this.props.actions.myFormInitial(this.props.state.UserInfo.UserInfo);   // 我的表單重新撈取
              }else{
                // this.props.actions.defaultSubmitResult();
              }
            }
          }],
          { cancelable: false }
        )
      },200);
      
    }

    if(nextProps.state.Survey.renderResult == false){
      setTimeout(()=>{
        Alert.alert(
          this.props.state.Language.lang.SurveyPage.Fail,
          this.props.state.Language.lang.SurveyPage.renderingPageError,
          [{
            text: 'OK', 
            onPress: () => {
              this.closeCreateForm();
            }
          }],
          { cancelable: false }
        )
      },200);
    }
    
    return true
  }
  
  render() {
    return (
      <Container>
        <MainPageBackground height={200} />
        <HeaderForGeneral
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:"close"}}
          leftButtonOnPress     = {this.closeCreateForm} 
          isRightButtonIconShow = {false}
          rightButtonIcon       = {null}
          rightButtonOnPress    = {null} 
          title                 = {this.props.state.Survey.surveyTitle}
          isTransparent         = {true}
        />
        
          {/*
          <StepIndicator
             customStyles    ={customStyles}
             labels          ={this.props.state.Survey.stepsTitle}
             stepCount       ={this.props.state.Survey.stepsTitle.length}
             currentPosition ={this.state.currentPosition}
             onPress         ={this.changePosition}
          />
          */}
         


          <Carousel
            ref            = {(c) => { this._carousel = c; }}
            data           = {this.props.state.Survey.surveyFormat}
            renderItem     = {this.renderContent}
            sliderWidth    = {this.props.style.PageSize.width}
            itemWidth      = {this.props.style.PageSize.width}
            loop           = {false}
            autoplay       = {false}
            onSnapToItem   = {(slideIndex)=>{ this.setState({ currentPosition:slideIndex });}}
            enableMomentum = {true}
            scrollEnabled  = {false}
          />
          
          {/*是否顯示loading 畫面*/}
          {
            (this.props.state.Survey.refreshing) ? 
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
                  <Text style={{color:this.props.style.inputWithoutCardBg.inputColor}}>{this.props.state.Survey.refreshInfo}</Text>
                </Container>
              </Modal>
            :
              null
          }
      </Container>
    );
  }

  renderContent = (item) => {
    let lastContent = this.props.state.Survey.surveyFormat.length;  
    let app = [];
    for (var index in item.item.content) {
      if (item.item.content[index].show) {
        let editable = (item.item.content[index].isedit == "Y") ? true: false; 
        app.push(
          <FormInputContent 
            key      ={index} 
            data     ={item.item.content[index]} 
            onPress  ={this.updateFormData}
            editable ={editable}
            lang     ={this.props.state.Language.lang}
            user     ={this.props.state.UserInfo.UserInfo}
          />
        );
      }
    }

    let page = (
        <KeyboardAwareScrollView>
          <Card>
            <CardItem style={{flexDirection: 'column'}}>  
              <Title style={{
                color        :this.props.state.Theme.theme.variables.ExplainText.color, 
                paddingTop   : 5, 
                paddingBottom: 15
              }}>{this.props.state.Language.lang.SurveyPage.SurveyExplain}</Title>        
              <Label style={{alignSelf: 'flex-start'}}>{this.props.state.Survey.surveyExplain}</Label>
            </CardItem>
          </Card>

          <Card>
            <CardItem style={{flexDirection: 'column'}}>     
              <Title style={{color:this.props.state.Theme.theme.variables.ExplainText.color, paddingTop: 5, paddingBottom: 5}}>
                {this.props.state.Language.lang.SurveyPage.SurveyWrite}
              </Title>        
              {app}
            </CardItem>
          </Card>

          <View style={{width: '100%', paddingTop:20, paddingBottom:100}}>          
            <Button 
              onPress = {() => this.props.actions.checkRequiredFormValue(this.state.currentPosition)}
              style = {[this.props.style.Button,{backgroundColor: '#20b11d'}]}
            >
                <Text>{this.props.state.Language.lang.SurveyPage.Apply}</Text>
            </Button>
          </View>
        </KeyboardAwareScrollView>

    );

    return page;
  }
  
  updateFormData = ( value, item ) => {
    this.props.actions.updateFormDefaultValue(value, item, this.state.currentPosition);
  }

  changePosition = (position) => {
    // this.props.actions.checkRequiredFormValue(this.state.currentPosition, position);
  }

  closeCreateForm = () => {
    NavigationService.goBack();
    this.props.actions.closeSurveyForm();
  }
  
  componentWillUnmount(){
    this.props.actions.closeSurveyForm();
  }
}

export let SurveyPageStyle = connectStyle( 'Page.FormPage', {} )(SurveyPage);

export default connect(
  (state) => ({
    state: {...state}
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...SurveyAction,
      // ...MyFormAction
    }, dispatch)
  })
)(SurveyPageStyle);