import React from 'react';
import { Alert, Image, StyleSheet ,View} from 'react-native';
import { Container, Header, Content, Button, Text, Spinner, Left, Icon, Body, Right, Item, Input, connectStyle} from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LinearGradient      from 'react-native-linear-gradient';
import ActionSheet         from 'react-native-actionsheet';

import * as LoginAction       from '../../redux/actions/LoginAction';
import * as SQLite            from '../../utils/SQLiteUtil';
import * as UpdateDataUtil    from '../../utils/UpdateDataUtil';
import ToastUnit              from '../../utils/ToastUnit';
import TimerButton            from '../../components/TimerButton';

const styles = StyleSheet.create({
  dropdownTitle: {
    fontSize: 18,
  }
});

class SmsCheckPage extends React.Component {
  constructor(props) {
    super(props);

    let params = this.props.route.params;
    this.state = {
      empid       :params.empid,      
      areaList    :this.props.Login.areaData, // 簡訊地區碼的選單資料
      areaSelected:{paramcode:"",show:""}, // 選定的簡訊地區碼
      idCard      :params?.idCard,    // 身份證號碼
      tel         :params?.tel,       // 手機號碼
      verifyCode  :'',                // 驗證碼
    }
  }

  componentDidMount(){
    // 取得地區的選單資料
    this.props.actions.loadByAreaData(
      this.state.empid,
      this.props.Language.langStatus
    );
  }

  componentDidUpdate(prevProps) {
    // 簡訊地區給定預設值
    if (this.props.Login.areaData.length != 0 && this.state.areaSelected.paramcode == "") {
      this.setState({
        areaSelected:this.props.Login.areaData[0]
      });
    }
  }

  showActionSheet = () =>{
    this.ActionSheet.show();
  }

  renderActionSheet = () => {
    let countrys = [];
    this.props.Login.areaData.forEach((item, index, array) => {
      countrys.push(item.show);
    });

    let BUTTONS = [...countrys, this.props.Language.lang.Common.Cancel]; // 取消
    let CANCEL_INDEX = countrys.length;

    return (
      <ActionSheet
        ref               ={o => this.ActionSheet = o}
        title             ={this.props.Language.lang.SmsCheckPage.Area}
        options           ={BUTTONS}
        cancelButtonIndex ={CANCEL_INDEX}
        onPress           ={(buttonIndex) => { 
          if (buttonIndex != CANCEL_INDEX) {
            this.setState({
             areaSelected: this.state.areaList[buttonIndex] 
           });
          }
        }}
      />
    );
  }

  render() {
    let context = this.props.Language.lang.LoginPage; //LoginPage的文字內容
    return (
      <Container>
        <LinearGradient start={{x: 1, y: 0}} end={{x: 0, y: 1}} colors={['#A7DBFF', '#1976D2']} style={{flex:1}}>
          <Header transparent>
            <Left>
              <Button transparent 
                style={{
                  height         : 55,
                  width          : 55, 
                  alignItems     : 'center', 
                  justifyContent : 'center' 
                }}
                onPress={() => this.props.navigation.goBack() }
              >
                <Icon name="arrow-back" style={{color:"#FFF"}}/>
              </Button>
            </Left>
            <Body/>
            <Right/>
          </Header>

          <Content contentContainerStyle={{alignItems:"center"}}>

            <Body style={{alignItems:"flex-start", width:"80%",flex:0, marginTop:20, paddingBottom:20}}>
              <Text style={{fontSize:44, color:"#FFF", fontWeight:"bold"}}>{this.props.Language.lang.SmsCheckPage.IdentityAuth}</Text>
            </Body>

            <Body style={{alignItems:"flex-start", width:"80%", flex:0, justifyContent:"center"}}>
              <Item style={{height:this.props.style.PageSize.height*.035}}/>

              {/*簡訊地區的下拉選單*/}
              <Item style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
                  <Button 
                    transparent
                    iconRight
                    alignSelf ='flex-end'
                    onPress   ={() => this.ActionSheet.show()}
                  >
                     <Text style={[styles.dropdownTitle,{color:'#FFF'}]}>{this.state.areaSelected.show}</Text>
                     <Icon name='caret-down-outline' style={{color:"#FFF"}}/>
                  </Button>
                  <Icon name='globe' style={{color:"#FFF"}} type='Entypo' />
              </Item>
              

              <Item style={{height:this.props.style.PageSize.height*.035}}/>

              {/*身份證號碼*/}
              <Item>
                <Input 
                  placeholder={this.props.Language.lang.SmsCheckPage.InputIdCard}
                  style={{color:"#FFF"}} 
                  selectionColor={"#FFF"}
                  placeholderTextColor={"#FFF"}
                  value={this.state.idCard}
                  onChangeText  = {(text)=>{ this.setState({ idCard:text }); }}
                />
                <Icon name='v-card' style={{color:"#FFF"}} type='Entypo' />
              </Item>
              

              <Item style={{height:this.props.style.PageSize.height*.035}}/>

              {/*手機號碼*/}
              <Item>
                  <Input 
                    placeholder          ={this.props.Language.lang.SmsCheckPage.InputTel}
                    style                ={{color:"#FFF"}} 
                    selectionColor       ={"#FFF"} 
                    placeholderTextColor ={"#FFF"}
                    keyboardType         ='numeric'
                    value                ={this.state.tel}
                    onChangeText         ={(text) => {
                      let newText = text.replace(/[^\d]+/, '');
                      this.setState({ tel:text });
                    }}
                  />
                  <Icon name='phone'  style={{color:"#FFF"}} type='Entypo'/>
              </Item>
              

              <Item style={{height:this.props.style.PageSize.height*.035}}/>

              {/*驗證碼*/}
              <Item>
                <Input 
                  placeholder          ={this.props.Language.lang.SmsCheckPage.InputVerification}
                  style                ={{color:"#FFF"}} 
                  selectionColor       ={"#FFF"}
                  placeholderTextColor ={"#FFF"}
                  maxLength            ={6}
                  keyboardType         ="numeric"
                  onChangeText         = {(text)=>{ this.setState({ verifyCode:text }); }}
                />
                <Right style={{marginBottom:10,flex:0}}>
                    <TimerButton 
                      enable     ={true}
                      timerCount ={60}
                      timerTitle ={this.props.Language.lang.SmsCheckPage.getVerificationCode}
                      getAgain   ={this.props.Language.lang.SmsCheckPage.getCodeAgain}
                      onClick    ={(_shouldStartCount) => {
                        this.checkData(_shouldStartCount) ? this.checkIdentityAndTel(_shouldStartCount) : null;
                     }}/>
                </Right>
              </Item>
              
            </Body>

            {/*下一步*/}
            <Body style={{width:"80%", flex:0, justifyContent:"center"}}>
              <Item style={{height:this.props.style.PageSize.height*.08}}/>
              <Button bordered light 
                style={{width:"100%", alignItems:"center", justifyContent:"center"}}
                onPress = {()=>{
                    this.checkData() ? this.nextStep() : null;
                }}
              >
                {
                  (this.props.Login.masking) ?
                    <Spinner color='white'/>
                  :
                    <Text>{this.props.Language.lang.SmsCheckPage.Next}</Text>
                }
              </Button>
            </Body>
            

          </Content>

          { this.props.Login.areaData.length == 0 ? null : this.renderActionSheet() }

        </LinearGradient>
      </Container>
    );
  }  

  //驗證國家-身份證號-電話號碼
  checkData = (_shouldStartCount) =>{
    if (this.props.Network.networkStatus) {
        if(this.state.areaSelected.show==""){
              if(_shouldStartCount){
                  _shouldStartCount(false);
              }
              ToastUnit.show('error', this.props.Language.lang.SmsCheckPage.AreaNotNull, true);
             
            return false;
        }else if(this.state.tel==""||this.state.idCard==""){
            if(_shouldStartCount){
                _shouldStartCount(false);
            }

            ToastUnit.show('error', this.props.Language.lang.SmsCheckPage.TelIdcardNotNull, true);
            
            return false;
        }else{
            return true;
        }
    }else{
        Alert.alert( 
          this.props.Language.lang.Common.Error ,             //錯誤
          this.props.Language.lang.Common.NoInternetAlert,    //無法連線，請確定網路連線狀況        
        );
    }
  }

  checkIdentityAndTel = (_shouldStartCount) =>{
    let obj={
      "empid"         :this.state.empid,
      "nationCode"    :this.state.areaSelected.paramcode,
      "phoneNumber"   :this.state.tel,
      "identityNumber":this.state.idCard
    }
    UpdateDataUtil.getVerifyIdentityAndtel(this.state.empid,obj,this.props.Language.langStatus).then( async (data) => {
         if(data.content.phoneCorrect){
            this.sendVerificationCode(_shouldStartCount);
         }else{
            Alert.alert(
                this.props.Language.lang.Common.Alert,                    //溫馨提示
                this.props.Language.lang.SmsCheckPage.TelNotSameIniHrTel, //檢測到與HR預設電話號碼不一致，是否繼續獲取驗證碼
                [
                  { //獲取
                    text: this.props.Language.lang.SmsCheckPage.Obtain, 
                    onPress: () => {this.sendVerificationCode(_shouldStartCount)}
                  },
                  { //取消
                    text: this.props.Language.lang.Common.Cancel, 
                    onPress: () => {_shouldStartCount(false)}, 
                    style:'cancel'
                  },
                ],
                { cancelable: false }
            );
         }
    }).catch((e)=>{
        _shouldStartCount(false);
        ToastUnit.show('error', e.message, true);
       
    })  
  }

  //獲取簡訊驗證碼
  sendVerificationCode = (_shouldStartCount) =>{
    let obj={
      "empid"         :this.state.empid,
      "nationCode"    :this.state.areaSelected.paramcode,
      "phoneNumber"   :this.state.tel,
      "identityNumber":this.state.idCard
    }
      UpdateDataUtil.getVerificationCode(
        this.state.empid,
        obj,
        this.props.Language.langStatus
      ).then( async (data) => {
          if(data.message==="ok"){
             _shouldStartCount(true);
          }else{
             _shouldStartCount(false);
            ToastUnit.show('error', data.message, true);
          }
      }).catch((e)=>{
         _shouldStartCount(false);
         ToastUnit.show('error', e.message, true);
      })  
  }

  //下一步，驗證簡訊驗證碼與基本資料
  nextStep = () =>{
    
    let obj={
      "empid":this.state.empid,
      "nationCode":this.state.areaSelected.paramcode,
      "phoneNumber":this.state.tel,
      "identityNumber":this.state.idCard,
      "code":this.state.verifyCode
    }
    UpdateDataUtil.getVerificationData(
      this.state.empid,
      obj,
      this.props.Language.langStatus
    ).then( async (data) => {
      this.props.navigation.navigate('InitialPassword',{empid:this.state.empid,tempData:obj})
    }).catch((e)=>{
        console.log(e);
        ToastUnit.show('error', e.message, true);
    })  
  }
}

let SmsCheckPageStyle = connectStyle( 'Page.LoginPage', {} )(SmsCheckPage);
export default connect(
  (state) => ({...state}),
  (dispatch) => ({
    actions: bindActionCreators(LoginAction, dispatch)
  })
)(SmsCheckPageStyle);

