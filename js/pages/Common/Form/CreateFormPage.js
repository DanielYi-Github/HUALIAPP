import React, { Component } from 'react';
import { View, Platform, Alert, Modal, Dimensions } from 'react-native';
import { Container, Header, Content, Icon, Button, Body, Right, Title, Item, Input, Text, Card, CardItem, Tabs, Tab, TabHeading, ScrollableTab, Left, Spinner, connectStyle } from 'native-base';
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
import * as CreateFormAction from '../../../redux/actions/CreateFormAction';
import * as MyFormAction     from '../../../redux/actions/MyFormAction';

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

class CreateFormPage extends React.Component {
  constructor(props) {
    super(props);

    //設定表單標題名稱
    let FormName, FormID = this.props.route.params.FormID;
    let functions = this.props.state.Home.FunctionData;
    for(let i in functions){
      FormName = (functions[i].ID == FormID) ? functions[i].NAME : "";
      if (functions[i].ID == FormID) {
          FormName = functions[i].NAME
          break;
      }
    }

    this.state = {
      FormID         : FormID,
      FormName       : FormName,
      currentPosition: 0
    };

    this.carousel = null;
    this.renderContent = this.renderContent.bind(this);
  }
  
  componentDidMount(){
    this.props.actions.getFormFormat(this.state.FormID);  // 撈取表單填寫格式
  }

  shouldComponentUpdate(nextProps, nextState){
    // 避免重複跳頁
    if (this.state.currentPosition != nextState.currentPosition) {
      return true;
    }

    if (nextProps.state.CreateForm.ruleCheckMessage) {
      Alert.alert(
        this.props.state.Language.lang.CreateFormPage.WrongData, //資料錯誤
        nextProps.state.CreateForm.ruleCheckMessage,
        [{
          text: this.props.state.Language.lang.CreateFormPage.GotIt,  // 我知道了
          onPress: () => {}
        }],
        { cancelable: false }
      )
    }

    let checkRequired = nextProps.state.CreateForm.checkRequired;
    if(checkRequired != null){
      if (checkRequired) {
        let gotoPageIndex = nextProps.state.CreateForm.gotoPageIndex;
        if (gotoPageIndex != null) {
          this._carousel.snapToItem(gotoPageIndex);
        } else {
          this._carousel.snapToNext();
        }
      } else {
        ToastUnit.show('error', this.props.state.Language.lang.CreateFormPage.RequiredFieldAlert);
      }
    }

    if (nextProps.state.CreateForm.submitResult != null) {
      let CreateForm = nextProps.state.CreateForm;

      setTimeout(()=>{
        Alert.alert(
          CreateForm.submitResult ? this.props.state.Language.lang.CreateFormPage.Sucess : this.props.state.Language.lang.CreateFormPage.Fail,
          CreateForm.refreshInfo,
          [{
            text: 'OK', 
            onPress: () => {
              if (CreateForm.submitResult) {
                this.closeCreateForm();
                this.props.actions.myFormInitial(this.props.state.UserInfo.UserInfo);   // 我的表單重新撈取
              }else{
                this.props.actions.defaultSubmitResult();
              }
            }
          }],
          { cancelable: false }
        )
      },200);
    }

    if(nextProps.state.CreateForm.renderResult == false){
      setTimeout(()=>{
        Alert.alert(
          this.props.state.Language.lang.CreateFormPage.Fail,
          this.props.state.Language.lang.CreateFormPage.renderingPageError,
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
    // console.log(this.props.state.CreateForm.formFormat);
    // this.props.state.CreateForm.formFormat = survey;
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
          title                 = {this.state.FormName}
          isTransparent         = {true}
        />
        <StepIndicator
           customStyles    ={customStyles}
           labels          ={this.props.state.CreateForm.stepsTitle}
           stepCount       ={this.props.state.CreateForm.stepsTitle.length}
           currentPosition ={this.state.currentPosition}
           onPress         ={this.changePosition}
        />
        <Carousel
          ref            = {(c) => { this._carousel = c; }}
          data           = {this.props.state.CreateForm.formFormat}
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
          (this.props.state.CreateForm.refreshing) ? 
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
                <Text style={{color:this.props.style.inputWithoutCardBg.inputColor}}>{this.props.state.CreateForm.refreshInfo}</Text>
              </Container>
            </Modal>
          :
            null
        }

      </Container>
    );
  }

  renderContent = (item) => {
    let lastContent = this.props.state.CreateForm.formFormat.length;  
    let app = [];
    for (var index in item.item.content) {
      if (item.item.content[index].show) {
        let editable = (item.item.content[index].isedit == "Y") ? true: false; 
        app.push(
          <FormInputContent 
            key      ={index} 
            data     ={item.item.content[index]} 
            onPress  ={this.updateFormData}
            editable ={(item.index == lastContent-1) ? false : editable}
            lang     ={this.props.state.Language.lang}
            user     ={this.props.state.UserInfo.UserInfo}
          />
        );
      }
    }
    
    // 第一頁
    let buttonPrev = null, buttonNext = null; 
    if (item.index != 0) {
      buttonPrev = (
        <Button 
          onPress = {() => { this._carousel.snapToPrev(); }} 
          style = {[this.props.style.Button,{backgroundColor: '#47ACF2', marginBottom: 15}]}
        >
            <Text>{this.props.state.Language.lang.CreateFormPage.PrevPage}</Text>
        </Button>
      );
    } 
    
    // 最後一頁
    if ((item.index+1) == this.props.state.CreateForm.stepsTitle.length) {
      buttonNext = (
          <Button 
            // onPress = {() => this._carousel.snapToNext()} 
            onPress = {() => { this.props.actions.submitFormValue() }}
            style = {[this.props.style.Button,{backgroundColor: '#20b11d'}]}
          >
              <Text>{this.props.state.Language.lang.CreateFormPage.Apply}</Text>
          </Button>
      )
    } else {
      buttonNext = (
        <Button 
          // onPress = {() => { this._carousel.snapToNext(); }} 
          onPress = {() => this.props.actions.checkRequiredFormValue(this.state.currentPosition)}
          style = {[this.props.style.Button,{backgroundColor: '#EA4C88'}]}
        >
            <Text>{this.props.state.Language.lang.CreateFormPage.NextPage}</Text>
        </Button>
      )
    }

    let page = (
      <KeyboardAwareScrollView>
        <Card>
          <CardItem style={{flexDirection: 'column'}}>          
            {app}
          </CardItem>
        </Card>
        <View style={{width: '100%', paddingTop:20, paddingBottom:40}}>          
          {buttonPrev}
          {buttonNext}
        </View>
      </KeyboardAwareScrollView>

    );

    return page;
  }

  updateFormData = ( value, item ) => {
    this.props.actions.updateFormDefaultValue(value, item, this.state.currentPosition);
  }

  changePosition = (position) => {
    this.props.actions.checkRequiredFormValue(this.state.currentPosition, position);
  }

  closeCreateForm = () => {
    NavigationService.goBack();
    this.props.actions.closeCreateForm();
  }

  componentWillUnmount(){
    this.props.actions.closeCreateForm();
  }
}

export let CreateFormPageStyle = connectStyle( 'Page.FormPage', {} )(CreateFormPage);

export default connect(
  (state) => ({
    state: {...state}
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...CreateFormAction,
      ...MyFormAction
    }, dispatch)
  })
)(CreateFormPageStyle);