import React from 'react';
import { ActivityIndicator, Modal, View, Platform } from 'react-native';
import { Container, Header, Icon, Left, Button, Body, Right, Title, Content, Text, Card, CardItem, Spinner, connectStyle } from 'native-base';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as NavigationService  from '../../../utils/NavigationService';
import MainPageBackground from '../../../components/MainPageBackground';
import FormContent        from '../../../components/Form/FormContent';
import FormRecords        from '../../../components/Form/FormRecords';
import WaterMarkView      from '../../../components/WaterMarkView';
import HeaderForGeneral   from '../../../components/HeaderForGeneral';

import * as MyFormAction  from '../../../redux/actions/MyFormAction';

class MyFormPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Form: this.props.route.params.Form,
    }
  }
  
  componentDidMount() {
    let Form = this.state.Form;
    this.props.actions.loadMyFormContentIntoState( 
      this.props.state.UserInfo.UserInfo, 
      Form.processid,
      Form.id,
      Form.rootid,
      this.props.state.Language.langStatus,
      Form.tskid
    );
  }

  render() {
    let myFormPage = (
      <Container>
      <MainPageBackground />
      {/*標題列*/}
      <HeaderForGeneral
        isLeftButtonIconShow  = {true}
        leftButtonIcon        = {{name:"arrow-back"}}
        leftButtonOnPress     = {() =>NavigationService.goBack()} 
        isRightButtonIconShow = {false}
        rightButtonIcon       = {null}
        rightButtonOnPress    = {null} 
        title                 = {this.state.Form.processname}
        isTransparent         = {true}
      />
      <Content>
        {/*表單主旨*/}
        {this.renderFormkeyword()}
        
        {/*是否顯示loading 畫面*/}
        {
          (this.props.state.MyForm.isRefreshing) ? 
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
              </Container>
            </Modal>
            
          :
            null
        }

        {/*表單內容*/}
        {(this.props.state.MyForm.FormContent && this.props.state.MyForm.FormContent.length) ? this.renderFormContent() : null}
        
        {/*顯示查看表單的完整圖片按鍵*/}
        {(this.props.state.MyForm.bpmImage) ? this.renderFormDetailImage() : null }
        
        {/*簽核紀錄*/}
        {(this.props.state.MyForm.FormRecords.length) ? this.renderFormRecords() : null}
        
      </Content>
      </Container>
    );

    return (
      <WaterMarkView 
        contentPage = {myFormPage} 
        pageId = {"MyFormPage"}
      />
    );
  }
  
  renderFormkeyword = () => {
    return (
      <Card style={{alignSelf: 'center'}}>
        <CardItem header>
          <Text>{this.props.state.Language.lang.FormDetial.Keyword}</Text>
        </CardItem>
        <CardItem style={{paddingTop: 0}}>
          <Text>{this.state.Form.keyword}</Text>
        </CardItem>
      </Card>
    );
  }

  renderFormContent = () => {
    let app = [];
    let formContent = this.props.state.MyForm.FormContent;
    for (var index in formContent) {
      //針對簽名檔為空的進行處理
      let isShowSgnContent = false;
      if(formContent[index].content[0].columntype == "sgn"){
        let defaultvalue = formContent[index].content[0].defaultvalue;
        isShowSgnContent = ( defaultvalue=="" || defaultvalue==null ) ? true : isShowSgnContent        
      }

      if (isShowSgnContent) {
      }else{
        app.push(
            <FormContent 
              key    ={index} 
              data   ={formContent[index]} 
              isOpen ={ (formContent[index].columntype=="applyap") ? false : 0 }
              lang   ={this.props.state.Language.lang}
              user   ={this.props.state.UserInfo.UserInfo}
            />
        );  
      } 
    }
    return ( app );
  }

  renderFormDetailImage = () =>{
    return (
      <Card style={{alignSelf: 'center'}}>
        <CardItem header button
          style={{
            justifyContent  : 'space-between', 
            borderRadius    : 10,
            backgroundColor : "#1976D2",
          }}
          onPress={()=>{
            NavigationService.navigate("FormOrigionalForm", {
              bpmImage: this.props.state.MyForm.bpmImage,
            });
          }}
        >
          <Text style={this.props.style.inverseTextColor}>{this.props.state.Language.lang.FormSign.ReviewBPMImage}</Text>
            <Right style={{flex:0, alignSelf: 'flex-end'}}>
                  <Icon name="arrow-forward" style={this.props.style.inverseTextColor} /> 
            </Right>
        </CardItem>
      </Card>
    )
  }
  
  renderFormRecords = () => {
    return (
      <FormRecords 
          data            = {this.props.state.MyForm.FormRecords} 
          active          = {false} 
          lang            = {this.props.state.Language.lang.FormDetial} 
          Lang_FormStatus = {this.props.state.Language.lang.FormStatus}
        />
    )
  }

  showOrigionalForm = () => {
    NavigationService.navigate("MyFormOrigionalForm", {
      Form:this.state.Form
    });
  }
  
}

export let MyFormPageStyle = connectStyle( 'Page.FormPage', {} )(MyFormPage);

export default connect(
  (state) => ({
    state: {...state}
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...MyFormAction
    }, dispatch)
  })
)(MyFormPageStyle);