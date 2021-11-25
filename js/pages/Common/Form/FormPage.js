import React from 'react';
import { Alert, ActivityIndicator, Modal, View, Platform, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, TextInput, InputAccessoryView, Dimensions } from 'react-native';
import * as ReactNative from 'react-native';
import { Container, Header, Icon, Left, Button, Body, Right, Title, Content, Text, Card, CardItem, Item, Label, Input, Spinner, connectStyle } from 'native-base';
import ActionButton from 'react-native-action-button';
import ModalWrapper from "react-native-modal";
import ActionSheet  from 'react-native-actionsheet';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as NavigationService from '../../../utils/NavigationService';
import ToastUnit              from '../../../utils/ToastUnit';
import MainPageBackground     from '../../../components/MainPageBackground';
import FormContent            from '../../../components/Form/FormContent';
import FormRecords            from '../../../components/Form/FormRecords';
import WaterMarkView          from '../../../components/WaterMarkView';
import HeaderForGeneral       from '../../../components/HeaderForGeneral';
import CustomModal            from '../../../components/CustomModal';
import * as FormAction        from '../../../redux/actions/FormAction';
// import FormDrawSignImage from '../../components/FormDrawSignImage';

/*
  1.讓使用者可以進行直接同意或手牽功能
  2.簽名功能成功之後直接顯示謙和意見
  3.千額意見不同意簽名板不見
  4.再次進行手牽跳出簽名板
*/

/*
  processid 表單種類的id
  id        該表單位於哪一個關卡的id
  rootid    該表單的簽核紀錄id -- 所有表單的唯一值
  tskid     該表單的子簽核紀錄的id
*/
/*
  id 頭三個字 表示要回傳的按鈕種類
  IAP
    同意
    駁回
      是否顯示駁回選項->back        
      有選項可以選->listBack
  PRO
    同意
      有選項可以選->listSignbtn 
    駁回
      是否顯示駁回選項->back        
      有選項可以選->listBack
  SGN
    同意
    駁回
      是否顯示駁回選項->back
*/

class FormPage extends React.Component {
  constructor(props) {
    super(props);
    let Form = this.props.route.params.Form;
    this.state = {
      Form        :Form,
      content     :null,
      records     :[],
      signBtns    :null,
      signBtnsType:Form.id.substr(0,3),
      signState   :true,
      signInfo    :null,
      signOpinion :"",
      showFormSignActionSheet:false,
      showFormSignTextInput  :false,
      showFormDrawSignImage  :false,
      handsign        :null,      // 是否需要手寫板簽名
      showsign        :null,      // 是否需要顯示核決層級
      signresult      :null,      // 是否需要顯示回簽
      isAllowAdd      :null,      // 是否顯示加會簽
      allowAddValue   :null,      // 加會簽的值
      signImage       :null,      // 圖片base64
      fabActive       :false,     // 顯示簽核的元件
      // showSignModal:false      // 顯示簽核案件的背景圖
      bpmImage        : false,    // 顯示表單的完整圖片
      isLevelEditable : false,     // 判斷這關卡能不能編輯
      keyboardShow:false,
      keyboardHeight:0
    }
  }

  componentDidMount() {
    let Form = this.state.Form;
    this.props.actions.loadFormContentIntoState( 
      this.props.state.UserInfo.UserInfo, 
      Form.processid,
      Form.id,
      Form.rootid,
      this.props.state.Language.langStatus,
      Form.tskid
    );

    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',(event)=>this.keyboardDidShow(event) );
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide',(event)=>this.keyboardDidHide(event) );
  }

  componentWillUnmount() {
    this.props.actions.setInitialState();

    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }


  keyboardDidShow = (event) => {
    this.setState({
      keyboardShow:true,
      keyboardHeight:event.endCoordinates.height
    })
  }

  keyboardDidHide = (event) => {
    this.setState({
      keyboardShow:false,
      keyboardHeight:0
    })
  }


  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.state.Form.FormContent) {
      this.setState({
        content   :nextProps.state.Form.FormContent,
        records   :nextProps.state.Form.FormRecords,
        signBtns  :nextProps.state.Form.FormSignBtns,
        handsign  :(nextProps.state.Form.handsign == "Y") ? true : false, //是否顯示手寫簽核
        // handsign  :true, //是否顯示手寫簽核
        showsign  :nextProps.state.Form.showsign,    
        isAllowAdd:{
          allowAddSign    :nextProps.state.Form.allowAddSign,           // 是否加簽
          allowAddAnnounce:nextProps.state.Form.allowAddAnnounce,       // 是否加會
        },
        signresult:nextProps.state.Form.signresult,
        bpmImage  :nextProps.state.Form.bpmImage,
        isLevelEditable : nextProps.state.Form.isLevelEditable  
      });
    }
    if (nextProps.state.Form.submitResult && nextProps.state.Form.isSignDone) {
       let SignSuccess = this.state.signState ? this.props.Language.SignApproveSuccess : this.props.Language.SignRejectSuccess ;
       let SignFailure = this.state.signState ? this.props.Language.SignApproveFailure : this.props.Language.SignRejectFailure ;
       let SignAlready = this.state.signState ? this.props.Language.SignApproveAlready : this.props.Language.SignRejectAlready ;
        if (nextProps.state.Form.submitResult.success) {
          // 表單動作成功
          ToastUnit.show('success', SignSuccess);

          this.setState({showFormSignTextInput:false});
          NavigationService.goBack();
          //簽核成功之後，接下來要處理state資料問題
        } else {
          let failMessage = ( nextProps.state.Form.submitResult.errorList[0] == "TaskHasCompleted" ) ? SignAlready : nextProps.state.Form.submitResult.errorList[0];

          Alert.alert(
            SignFailure,   // 表單動作失敗
            failMessage,
            [
              {
                text: this.props.Language.Close,   // 關閉 
                style: 'cancel',
                onPress: () => {
                  this.setState({
                    showFormSignTextInput:false,
                    showFormDrawSignImage:false
                  });
                }, 
              }
            ],
          )
        }
    }

    //圖檔需有值但要不相等
    if(nextProps.route.params.signImage && this.state.signImage !== nextProps.route.params.signImage) {
      this.setState({
        signImage:nextProps.route.params.signImage
      });
      this.onPressConfirm();
    }

    //顯示錯誤提示
      /*
    if(nextProps.state.Form.loadMessgae != null){
      setTimeout(()=>{
        Alert.alert(
          this.props.lang.CreateFormPage.WrongData,
          nextProps.state.Form.loadMessgae, [{
            text: this.props.lang.CreateFormPage.GotIt,
            onPress: () => {}
          }], {
            cancelable: false
          }
        )
      },200);   
    }
      */
  }

  render() {
    console.log(this.props.style);
    console.log(this.props.state);

    let formPage = (
      <Container>
        <MainPageBackground height={250}/>
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
        <KeyboardAwareScrollView
          extraScrollHeight = {200}
        >


          {/*表單主旨*/}
          {this.renderFormkeyword()}

          {/*表單內容*/}
          {(this.state.content && this.state.content.length) ? this.renderFormContent() : null}

          {/*顯示查看表單的完整圖片按鍵*/}
          {(this.state.bpmImage) ? this.renderFormDetailImage() : null}

          {/*顯示加會簽內容*/}
          {(this.state.allowAddValue) ? this.renderFormAllowAdd() : null}

          {/*簽核紀錄*/}
          {(this.state.records.length) ? this.renderFormRecords() : null}

          {/*手寫板簽核內容 - 簽核完直接送出，暫不顯示*/}
          {/* this.state.showFormDrawSignImage ? this.renderFormDrawSignImage() : null */}

          {/*顯示 非批簽 型表單資訊*/}
          { (this.state.Form.isGroupSign == "false") ? this.renderUnableSign() : null}

          {/*顯示 下方空白區域*/}
          {(this.state.Form.isGroupSign == "true") ? <Body style={{width:"100%", height:100}}/> : null }
        </KeyboardAwareScrollView>


        {/*簽核按鈕*/}
        {/*this.state.signBtns ? this.renderSignBtns() : null*/}
        {/*判斷是否為 批簽表單 如果是顯示簽核按鍵 如果不是 不顯示簽核按鍵*/}
        { (this.state.Form.isGroupSign == "true" && this.state.signBtns != null) ? this.renderSignBtns() : null}

        {/*顯示簽核選項*/}
        { this.state.signBtns != null ? this.renderActionSheet() : null}

        {/*顯示謙核意見欄位*/}
        {/* this.state.showFormSignTextInput ? this.showFormSignTextInput() : null*/}
        { this.showFormSignTextInput() }

        {/*是否顯示loading 畫面*/}
        {
          (this.props.state.Form.isRefreshing) ? 
            <Modal animationType="fade" transparent={true} visible={true} >
              <Container style={{justifyContent: 'center', alignItems: 'center', backgroundColor:this.props.style.SpinnerbackgroundColor}}>
                <Spinner color={this.props.style.SpinnerColor}/>
              </Container>
            </Modal>
          :
            null
        }


        {/* 顯示鍵盤的完成按鈕 */}
        {
          this.state.keyboardShow && Platform.OS == "ios" ?  
            <View style={{
              width          : Dimensions.get('window').width,
              height         : 48,
              flexDirection  : 'row',
              justifyContent : 'flex-end',
              alignItems     : 'center',
              backgroundColor: 'rgba(209, 211, 215, 1)',
              position       : "absolute",
              bottom         : this.state.keyboardHeight,
              borderTopWidth : 0.25,
              borderColor    : this.props.style.inputWithoutCardBg.inputColorPlaceholder
            }}>
              <ReactNative.Button
                onPress={() => {
                  this.setState({ keyboardShow:false });
                  Keyboard.dismiss();
                }}
                title={this.props.state.Language.lang.CreateFormPage.Done}
              />
            </View>
          :
            null
        }
        
      </Container>
    );

    return (
      <WaterMarkView 
        contentPage = {formPage} 
        pageId = {"FormPage"}
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
    for (var index in this.state.content) {
      //針對簽名檔為空的進行處理
      let isShowSgnContent = false;
      if(this.state.content[index].content[0].columntype == "sgn"){
        let defaultvalue = this.state.content[index].content[0].defaultvalue;
        isShowSgnContent = ( defaultvalue=="" || defaultvalue==null ) ? true : isShowSgnContent        
      }

      if (isShowSgnContent) {
      }else{
        app.push(
            <FormContent 
              key         ={index} 
              data        ={this.state.content[index]} 
              isOpen      ={(this.state.content[index].columntype=="applyap") ? false : 0 } 
              lang        ={this.props.lang }
              user        ={this.props.state.UserInfo.UserInfo}
              onPress     ={this.updateFormData.bind(this, index)} //預留修改後回傳值的接口
              formActions ={this.props.actions} //有關於Formpage的redux actions
              formContent ={this.state.content}
            />
        );  
      } 
      
    }
    return ( app );
  }

  updateFormData = (index, value, item ) => {
    this.props.actions.updateFormDefaultValue(value, item, index);
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
              bpmImage: this.state.bpmImage,
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

  renderFormAllowAdd = () => {
    let labelname = this.state.allowAddValue.asTypeFormat.defaultvalue;
    for(let item of this.state.allowAddValue.asTypeFormat.paramList){
      labelname = (labelname == item.paramcode) ? item.paramname : labelname
    }

    let content = [];
    content.push(this.state.allowAddValue.asTitleFormat);
    content.push(this.state.allowAddValue.asTypeFormat);
    content.push(this.state.allowAddValue.asMembersFormat);
    
    let FormAllowAdd = {
      columntype: "ap",
      content:content,
      labelname:labelname+this.props.Language.Content
    }
    console.log(FormAllowAdd);
    return (
      <FormContent 
        key    ={0} 
        data   ={FormAllowAdd} 
        isOpen ={0} 
        lang   ={this.props.lang }
        user   ={this.props.state.UserInfo.UserInfo}
        headerBackgroundColor = {{
         backgroundColorExpanded:"#FF9800",
         backgroundColorUnexpand:"#F57C00" 
        }}
        // onPress={} //預留修改後回傳值的接口
      />
    );
  }

  renderFormRecords = () => {
    return (
      <FormRecords 
        data            ={this.state.records} 
        active          ={false} 
        lang            ={this.props.state.Language.lang.FormDetial} 
        Lang_FormStatus = {this.props.state.Language.lang.FormStatus}
      />
    )
  }

  /*
  renderFormDrawSignImage = () => {
    let path   = this.props.route.params.signImage ? this.props.route.params.signImage : null;
    let height = this.props.route.params.imageHeight ? this.props.route.params.imageHeight : null;
    let width  = this.props.route.params.imageWidth ? this.props.route.params.imageWidth : null;

    if (path) {
      return (
        <FormDrawSignImage 
          path   ={path} 
          data   ={this.props.Language.ManagerHandSign} //主管簽名
          height ={height}
        />
      );
    } else {
      return null;
    }
  }
  */

  renderSignBtns = () => {
    let agreeBtn, rejectBtn, signBtns, allowAddBtns;

    switch (this.state.signBtnsType) {
      case "IAP":
        agreeBtn = this.props.Language.Agree;
        break;
      case "SGN":
        agreeBtn = this.props.Language.Agree;
        break;
      case "PRO":
        agreeBtn = this.props.Language.Approve;
        break;
      default:
        break;
    }

    // 是否顯示加會簽按鈕
    let isAllowAdd = this.state.isAllowAdd;
    if (isAllowAdd != null) {
      if (isAllowAdd.allowAddSign || isAllowAdd.allowAddAnnounce) {
        allowAddBtns = (
          <ActionButton.Item 
              buttonColor ='#FF9800'
              title       ={this.props.Language.AddSign} 
              onPress     ={this.onPressAllowAdd.bind(this)}
            >
              <Icon name="git-branch" style={{fontSize: 20,height: 22,color: 'white'}} />
            </ActionButton.Item>
        );
      }
    }

    // 是否顯示退回按鍵
    let listBack = (this.state.signBtns.listBack != null) ? this.state.signBtns.listBack : [];
    if (listBack.length != 0) {
      rejectBtn = (
        <ActionButton.Item 
            buttonColor='#f36c60' 
            title={this.props.Language.Reject} 
            onPress={this.onPressReject.bind(this)}
          >
            <Icon name="page-delete" style={{fontSize: 20,height: 22,color: 'white'}} type="Foundation"/>
          </ActionButton.Item>
      );
    }

    // 是否顯示手寫簽核
    if (this.state.handsign) {
      signBtns = (
        <ActionButton.Item 
            buttonColor='#FFCC00' 
            title={this.props.Language.HandSign} 
            onPress={this.onPressConfirmSign.bind(this)}
          >
            <Icon name="md-create" style={{fontSize: 20,height: 22,color: 'white'}} />
          </ActionButton.Item>
      );
    }

    return (
      <ActionButton  buttonColor="rgba(231,76,60,1)" >
          {/*顯示加會簽按鈕*/}
          {allowAddBtns}

          {/*退回按鍵-暫時取消返回鍵*/}
          {rejectBtn}

          {/*簽名按鍵*/}
          {signBtns}
          
          {/*同意按鍵*/}
          <ActionButton.Item 
            buttonColor ='#20b11d' 
            title       ={agreeBtn} 
            onPress     ={this.onPressConfirm.bind(this)}
          >
            <Icon name={"checkmark-sharp"} style={{fontSize: 20,height: 22,color: 'white'}} />
          </ActionButton.Item>
        </ActionButton>
    )
  }

  // 檢查是否所有必填資料已經填寫
  checkRequiredFormConfirm = () => {
    for(let content of this.state.content){
      for(let item of content.content){
        if (item.isedit == "Y" && item.required == "Y") {
            if (item.defaultvalue == null) return false;
            if (item.defaultvalue == "" ||  item.defaultvalue.length == 0 ) return false;

            if(item.columntype == "txt" || item.columntype == "tar"){
              let tempValue = item.defaultvalue;
              tempValue = tempValue.replace(/\r\n/g,"");
              tempValue = tempValue.replace(/\n/g,"");
              tempValue = tempValue.replace(/\s/g,"");
              if (tempValue.length ==0) return false;
            }
        }
      }
    }
    return true
  }

  onPressConfirmSign = async () => {
    // 先檢查有沒有必填資料，才能進行簽核動作
    let checked = await this.checkRequiredFormConfirm();
    if (checked) {
      NavigationService.navigate("FormDrawSign");
      this.setState({
        showFormDrawSignImage:true,
      });
    } else {
      this.props.actions.checkRequiredFormValue(this.state.content);    
    }
  }

  /*
    1.判斷簽核內容是否只有一個或null
      1.一個或null->直跳出提示框再次確認
      2.多個->跳出多選框選擇->直跳出提示框再次確認
    2.將簽核資料送出
  */
  onPressConfirm = async () => {
    // 先檢查有沒有必填資料，才能進行簽核動作
    let checked = await this.checkRequiredFormConfirm();
    if (checked) {
        let listSignbtn = this.state.signBtns.listSignbtn;
        if (listSignbtn == null || listSignbtn.length == 1) {
          let signInfo = {
            doubleConfirmText:listSignbtn ? listSignbtn[0].label : this.props.Language.Agree,
            confirmText      :listSignbtn ? listSignbtn[0].label : this.props.Language.Agree,
            formSignState    :true,
            formSignOption   :listSignbtn,
            handsign         :this.state.signImage,
          };

          this.setState({
            signInfo : signInfo,
            showFormSignTextInput : true
          });
        } else {
          this.setState({
            signState :true,
            showFormSignActionSheet:true
          });

          setTimeout(()=>{
            this.ActionSheet.show()
          },200);
        }
    } else {
      this.props.actions.checkRequiredFormValue(this.state.content);
    }
  }

  /*
    1.判斷簽核內容是否只有一個或null
      1.一個或null->直跳出提示框再次確認
      2.多個->跳出多選框選擇->直跳出提示框再次確認
    2.將簽核資料送出
  */
  onPressReject = () => {
    let listBack = this.state.signBtns.listBack;
    if (listBack == null || listBack.length == 1) {
      let signInfo = {
        doubleConfirmText:listBack ? listBack[0].label : null,
        confirmText      :this.props.Language.Reject,
        formSignState    :false,
        formSignOption   :listBack
      };

      this.setState({
        signInfo : signInfo,
        showFormSignTextInput : true
      });
    } else {
      this.setState({
        signState:false,
        showFormSignActionSheet:true
      });
      setTimeout(()=>{
        this.ActionSheet.show()
      },200);
    }
  }

  /*跳轉加會簽畫面*/
  onPressAllowAdd = () => {
    NavigationService.navigate("FormAllowAdd", {
      data   : this.state.isAllowAdd,
      onPress: this.setAllowAddValue
    });
  }

  setAllowAddValue = (allowAddText, allowAddcbo, allowAddchkwithaction) => {
    this.setState({
      allowAddValue:{
        asTitleFormat  :allowAddText, 
        asTypeFormat   :allowAddcbo, 
        asMembersFormat:allowAddchkwithaction
      }
    });
  }

  /*顯示簽核選項*/
  renderActionSheet = () => {
    let signActionSheet = [];
    let listSignbtn = this.state.signState ? this.state.signBtns.listSignbtn : this.state.signBtns.listBack;

    for(var i in listSignbtn) signActionSheet.push(listSignbtn[i].label);

    let BUTTONS = [...signActionSheet, this.props.state.Language.lang.Common.Cancel];
    let CANCEL_INDEX = signActionSheet.length;
    
    return (
      <ActionSheet
        ref={o => this.ActionSheet = o}
        title={this.state.signState ? this.props.Language.SelectSignAction : this.props.Language.SelectRejectAction}
        options={BUTTONS}
        cancelButtonIndex={CANCEL_INDEX}
        onPress={(buttonIndex) => { 
          if (buttonIndex != CANCEL_INDEX) {
            this.setState({
              showFormSignTextInput : true,
              signInfo : {
                doubleConfirmText:listSignbtn[buttonIndex].label,
                confirmText      :this.state.signState ? listSignbtn[buttonIndex].label : this.props.Language.Reject,
                formSignState    :this.state.signState,
                formSignOption   :[listSignbtn[buttonIndex]],
                handsign         :this.state.signImage,
              }
            });

          }
        }}  
      />
    );
  }

  showFormSignTextInput = () => {
    return (
      <ModalWrapper 
        isVisible={this.state.showFormSignTextInput}
        onBackdropPress = {(e)=>{ this.setState({showFormSignTextInput:false}) }}
      >
        <KeyboardAvoidingView style={{ flex: 1, alignItems:"center", justifyContent:'center' }}>
        <Card style={{
          width: '100%', 
          paddingTop:20, 
          paddingBottom:15, 
        }}>
          <CardItem>
            <Item floatingLabel>
              <Label>{this.props.Language.TypingApprovalComment}</Label>
              <Input 
                multiline = {true}
                autoFocus 
                onChangeText = {(text)=>{ this.setState({ signOpinion:text }); }}
                maxLength = {500}
              />
            </Item>
          </CardItem>
          {
            (!this.props.state.Form.isRefreshing || Platform.OS == "android") ?
              <CardItem style={{flexDirection: 'row', justifyContent:'space-around'}}>
                <Button warning 
                    onPress={() => {
                      this.setState({
                        showFormSignTextInput:false,
                        showFormDrawSignImage:false,
                      })
                    }} 
                    style={{width:"45%", justifyContent:'center'}}
                >
                    <Text>{this.props.Language.Cancel}</Text>
                </Button>
                <Button success 
                    onPress={this.alertFormSignInfo}
                    style={{width:"45%", justifyContent:'center'}}
                >
                    <Text>{this.props.Language.Comfirm}</Text>
                </Button>
              </CardItem>
            :
              <CardItem style={{flexDirection: 'row', justifyContent:'center'}}>
                <Button success style={{width:"90%", alignSelf: 'center', justifyContent:'center'}}>
                  <Spinner color='white'/>
                </Button>
              </CardItem>
          }
        </Card>
        </KeyboardAvoidingView>
      </ModalWrapper>

    )
  }

  alertFormSignInfo = () => {
    //檢查簽核資訊是否為空
    if ( this.state.signInfo.formSignState || this.state.signOpinion.replace(/[\r\n]/g,"").replace(/^[\s　]+|[\s　]+$/g, "").length !== 0 ) {
      let signInfo = this.state.signInfo;
      signInfo.signOpinion = this.state.signOpinion;

      this.submitSignForm(signInfo);

      /*
      //跳出輸入訊息視窗
      Alert.alert(
        this.props.Language.Sign,  //表單簽核
        signInfo.formSignState ? 
          `${this.props.Language.SignText1} ${signInfo.doubleConfirmText} ${this.props.Language.SignText2}` 
        :   
          `${this.props.Language.SignText3} ${signInfo.doubleConfirmText}`,
        [
          {
            text: this.props.Language.Cancel, 
            style: 'cancel',
            onPress: console.log('Cancel Pressed'),
          },
          {
            text: signInfo.confirmText, 
            onPress: this.submitSignForm.bind(this, signInfo)
          },
        ],
      )
      */
    } else {
      Alert.alert(
        this.props.Language.Sign,
        this.props.Language.RejectText,
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ],
        { cancelable: false }
      );
    }   
  }

  submitSignForm = (signInfo) => {
    this.props.actions.submitSignForm(
      this.props.state.UserInfo.UserInfo,
      this.state.Form,
      signInfo,
      this.state.allowAddValue,
      this.state.isLevelEditable
    );
  }

  showOrigionalForm = () => {
    this.props.navigation.navigate("FormOrigionalForm", {
      Form: this.state.Form
    });
  }

  /*顯示 非批簽 表單簽核資訊*/
  renderUnableSign = () => {
    return (
      <Body style={{width:"90%", marginTop: "5%", marginBottom: "20%", alignItems: 'flex-start'}}>
        <Text style={{fontWeight: 'bold', color:"#FF5252"}}>
          {this.props.Language.UnableSignInfo}
        </Text>
        <Text style={{marginTop:5, color:"#757575"}}>
          {this.props.Language.UnableSignInfoExplain}
        </Text>
      </Body>
    );
  }
}

export let FormPageStyle = connectStyle( 'Page.FormPage', {} )(FormPage);

export default connect(
  (state) => ({
    state   : {...state},
    Language:state.Language.lang.FormSign,
    lang    :state.Language.lang
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...FormAction
    }, dispatch)
  })
)(FormPageStyle);