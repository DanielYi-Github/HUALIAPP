import React from 'react';
import { Spinner, Container,  Left, Content,  Right, Item, Input, Button,  Text, ListItem, List,  Switch, connectStyle } from 'native-base';
import { Alert, Modal, View }     from 'react-native';
import { connect }               from 'react-redux';
import FormContentTextWithAction from '../../components/Form/FormContentTextWithAction';
import FormContentCbo            from '../../components/Form/FormContentCbo';
import FormContentDateTime       from '../../components/Form/FormContentDateTime';

import HeaderForGeneral          from '../../components/HeaderForGeneral';
import * as NavigationService    from '../../utils/NavigationService';
import * as DeputyAction         from '../../redux/actions/DeputyAction';
import { bindActionCreators }    from 'redux';
import FormInputContent          from '../../components/Form/FormInputContent';


class DeputyPage extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentWillMount() {
    await this.props.actions.iniDeputyData();
  }

  // 将资料转成JS对象
  deepClone(src) {
    return JSON.parse(JSON.stringify(src));
  }

  render() {
    //過濾關鍵字所查詢的資料
    let lang = this.props.state.Language.lang.DeputyPage;
    let Deputy=this.props.state.Deputy;
    console.log(Deputy);
    return (
      <Container>
        {/*標題列*/}
        <HeaderForGeneral
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:"arrow-back"}}
          leftButtonOnPress     = {() =>NavigationService.goBack()} 
          isRightButtonIconShow = {false}
          rightButtonIcon       = {null}
          rightButtonOnPress    = {null} 
          title                 = {lang.BpmDeputySetting}
          isTransparent         = {false}
        />

        {/*内容*/}
        {
          <Content>
              {/* 代理状态 */}
              <Item  
                last 
                style={[
                  // Styles.HeaderBackground,
                  // this.props.style.fixCreateFormPageFiledItemWidth,
                  { marginTop: 15,
                    marginBottom: 15, 
                    paddingLeft: 15, 
                    paddingRight: 15, 
                    backgroundColor: this.props.style.inputBackgroundColor
                  }
                ]} 
              >
                  <Left>
                    <Text style = {{fontSize: 18}}>{lang.Status}</Text>
                  </Left>
                  <Right>
                      <Input 
                        scrollEnabled = {false}
                        multiline 
                        value = {Deputy.msgState} 
                        editable = {false} 
                        style = {{textAlign: 'left'}}
                      />
                  </Right>
              </Item>
              
              {/* 代理方式 */}
              <View style={{width:"100%", alignItems:"center", justifyContent:"center", backgroundColor:this.props.style.inputBackgroundColor}}>
              {
                (Deputy.deputyWay)?
                  <FormContentCbo 
                    data     ={Deputy.deputyWay} 
                    editable ={null} 
                    onPress  ={this.onPressDeputyWay}
                    lang     ={this.props.state.Language.lang}
                  />
                :
                  null
              }
              </View>
              {
                (Deputy.deputyRule) ?
                  // 依规则代理
                  <ListItem last /*style={[Styles.HeaderBackground]}*/>
                  {
                    (Deputy.deputyRuleComParam) ?
                      <FormInputContent 
                        data     ={Deputy.deputyRules} 
                        onPress  ={this.onPressDeputyRules}
                        editable ={!Deputy.deputyState}
                        lang     ={this.props.state.Language.lang}
                        user     ={this.props.state.UserInfo.UserInfo}
                        mixParam = {Deputy.mixParam}
                      />
                    :
                      null
                  }
                  </ListItem>
                : 
                  // 单一代理
                  <View style={{width:"100%", alignItems:"center", justifyContent:"center", backgroundColor:this.props.style.inputBackgroundColor}}>
                  { 
                    (Deputy.deputyActionValue) ?
                      <FormContentTextWithAction 
                        data     ={Deputy.deputyName} 
                        editable ={null} 
                        onPress  ={this.onPressDeputyMember}
                        lang ={this.props.state.Language.lang}
                      />
                    :
                      null
                  }
                  </View>
              }

              {/* 多规则代理目前暂不支持多条件组合 */}
              {
                (Deputy.deputyRuleComParam)?
                  <Text style={{color:this.props.style.inputWithoutCardBg.inputColor}}>{lang.RulesNotSupport}</Text>
                :
                  null
              }

              {/* 特定时间代理 */}
              <ListItem last style={[/*Styles.HeaderBackground,*/{marginTop:15}]}>
                <Left>
                  <Text style={{fontSize: 18}}>
                    {lang.RuningSpecialTime}
                  </Text>
                </Left>
                <Right>
                  <Switch 
                    value    ={Deputy.executeDuration} 
                    disabled ={Deputy.deputyState}                
                    onChange ={this.props.actions.switchExecuteDuration}
                  />
                </Right>
              </ListItem>
              {
                (Deputy.executeDuration) ?
                  <List>
                    {/* 起时 */}
                    <View style={{width:"100%", alignItems:"center", justifyContent:"center", backgroundColor:this.props.style.inputBackgroundColor}}>
                    {
                      (Deputy.startExecuteTime) ?
                        <FormContentDateTime 
                          data     ={Deputy.startExecuteTime} 
                          editable ={null} 
                          onPress  ={this.onPressStartExecuteTime}
                          lang ={this.props.state.Language.lang}
                        />
                      :
                        null
                    }
                    </View>
                    {/* 讫时 */}
                    <View style={{width:"100%", alignItems:"center", justifyContent:"center", backgroundColor:this.props.style.inputBackgroundColor}}>
                    {
                      (Deputy.endExecuteTime)?
                        <FormContentDateTime 
                          data     ={Deputy.endExecuteTime} 
                          editable ={null} 
                          onPress  ={this.onPressEndExecuteTime}
                          lang ={this.props.state.Language.lang}
                        />
                      :
                        null
                    }
                    </View>
                  </List>
                :
                  null
              }

              {/* 代理人完成通知 */}
              <ListItem last style={[/*Styles.HeaderBackground,*/{marginTop:15,height:50}]}>
                <Left>
                  <Text style={{fontSize: 18}}>{lang.DeputySuccesMsg}</Text>
                </Left>
                <Right>
                  <Switch 
                    value    ={Deputy.informMailMode} 
                    disabled ={Deputy.deputyState}
                    onChange ={this.props.actions.switchInformMailMode}
                  />
                </Right>
              </ListItem>
              {
                // 通知对象
                (Deputy.informMailMode) ?              
                  <View style={{width:"100%", alignItems:"center", justifyContent:"center", backgroundColor:this.props.style.inputBackgroundColor}}>
                  { 
                    (Deputy.informName.actionValue)?
                      <FormContentTextWithAction 
                        data     ={Deputy.informName} 
                        editable ={null} 
                        onPress  ={this.onPressMsgMember}
                        lang ={this.props.state.Language.lang}
                      />
                    :
                      null
                  }
                  </View>
                :
                  null
              }

              {/* 登录时不要提示代理人的状况 */}
              <ListItem last style={[/*Styles.HeaderBackground,*/{marginTop:15,marginBottom:15,height:50}]}>
                <Left style={{flex:1}}>
                    <Text style={{fontSize: 18}}>{lang.LoginNotShowDeputyMemStatus}</Text>
                </Left>
                <Right>
                  <Switch 
                    value    ={Deputy.disableMsgPrompt} 
                    disabled ={Deputy.deputyState}
                    onChange ={this.props.actions.switchDisableMsgPrompt}
                  />
                </Right>
              </ListItem>

              {/* 启用/停止按钮 */}
              {
                (Deputy.deputyState) ?
                  <Button 
                    block 
                    danger
                    style={{width:"70%", alignSelf: 'center',marginBottom:15}} 
                    onPress = {this.onPressSubmit} >
                      <Text>{lang.STOP}</Text>
                  </Button>
                :
                  <Button 
                    block 
                    info 
                    style={{width:"70%", alignSelf: 'center',marginBottom:15}} 
                    onPress = {this.onPressSubmit} >
                      <Text>{lang.START}</Text>
                  </Button>
              }
          </Content>
        }

        {/* 资料加载中图层 */}
        { this.renderActivityIndicator() }
      </Container>
    );
  }

  // 启动/停止按钮action
  onPressSubmit = () => {
      let lang = this.props.state.Language.lang.DeputyPage;
      let content;
      let user = this.props.state.UserInfo.UserInfo;

      //處理畫面與api傳值不一致問題
      let deputyData = this.props.state.Deputy;
      console.log('deputyData', deputyData);
      let changeStateFlag = true;
      if (deputyData.deputyRule) {
        // console.log("多規則");
        let defaultvalue = deputyData.deputyRules.defaultvalue;
        //多規則代理不可為空
        if (defaultvalue.length == 0) {
          Alert.alert(
            lang.RulesNotNull,
            null, [{
              text: 'Cancel',
              style: 'cancel'
            }, {
              text: 'OK',
            }, ], {
              cancelable: false
            }
          )
          changeStateFlag = false;
        } else {
          let tempRules = this.deepClone(deputyData.deputyRules.defaultvalue);
          let arrayRules = [];
          //克服組件回傳key不為value問題
          for (let i in tempRules) {

              //條件一 key&value
              // let cond1key = tempRules[i][0].defaultvalue;
              let cond1key = tempRules[i][1].defaultvalue;
              let cond1value = this.getParamValue(cond1key);
              if(!cond1value){
                cond1key = tempRules[i][0].defaultvalue;
                cond1value = tempRules[i][1].defaultvalue;
              }
              //關係 key&value
              // let relationkey = tempRules[i][2].defaultvalue;
              let relationkey = tempRules[i][3].defaultvalue;
              let relationvalue = this.getParamValue(relationkey);
              if(!relationvalue){
                relationkey = tempRules[i][2].defaultvalue;
                relationvalue = tempRules[i][3].defaultvalue;
              }
              //條件二 key&value
              // let cond2key = tempRules[i][4].defaultvalue;
              let cond2key = tempRules[i][5].defaultvalue;
              let cond2value = tempRules[i][5].defaultvalue;

              let deputyid = tempRules[i][6].defaultvalue;
              //insert格式拼接
              let rule = cond1key + " " + relationkey + " " + "\"" + cond2key + "\"";
              let synopsis = cond1value + " " + relationvalue + " " + "\"" + cond2value + "\"";
              let obj = {
                deputyid: deputyid,
                rule: rule,
                synopsis: synopsis
              }
              arrayRules.push(obj);
          // console.log("content",obj);
          }
          content = {
            "deputyState": (!deputyData.deputyState).toString(),
            "byDeputyRule": (deputyData.deputyRule).toString(),
            "deputyID": deputyData.deputyID.defaultvalue,
            "deputyRules": arrayRules,
            "executeDuration": deputyData.executeDuration.toString(),
            "startExecuteTime": deputyData.startExecuteTime.defaultvalue,
            "endExecuteTime": deputyData.endExecuteTime.defaultvalue,
            "mailMode": deputyData.informMailMode.toString(),
            "informID": deputyData.informID.defaultvalue,
            "disableMsg": deputyData.disableMsgPrompt.toString()
          }
        }
      } else {
        if (user.id == deputyData.deputyID.defaultvalue) {
          //代理人不能為自己
          Alert.alert(
            lang.DeputyMemNotMeMsg,
            null, [{
              text: 'Cancel',
              style: 'cancel'
            }, {
              text: 'OK',
            }, ], {
              cancelable: false
            }
          )
          changeStateFlag = false;
        } else if (deputyData.deputyID.defaultvalue == "" || deputyData.deputyID.defaultvalue == null) {
          //代理人不可為空
          Alert.alert(
            lang.DeputyMemNotNull,
            null, [{
              text: 'Cancel',
              style: 'cancel'
            }, {
              text: 'OK',
            }, ], {
              cancelable: false
            }
          )
          changeStateFlag = false;
        } else {
          // console.log("單一規則");
          content = {
            "deputyState": (!deputyData.deputyState).toString(),
            "byDeputyRule": (deputyData.deputyRule).toString(),
            "deputyID": deputyData.deputyID.defaultvalue,
            "executeDuration": deputyData.executeDuration.toString(),
            "startExecuteTime": deputyData.startExecuteTime.defaultvalue,
            "endExecuteTime": deputyData.endExecuteTime.defaultvalue,
            "mailMode": deputyData.informMailMode.toString(),
            "informID": deputyData.informID.defaultvalue,
            "disableMsg": deputyData.disableMsgPrompt.toString()
          }
          // console.log("content",content);
        }
      }

      //通知對象不可為空
      if (deputyData.informMailMode && changeStateFlag) {
        if (deputyData.informID.defaultvalue == "" || deputyData.informID.defaultvalue == null) {
          Alert.alert(
            lang.InfoMemNotNull,
            null, [{
              text: 'Cancel',
              style: 'cancel'
            }, {
              text: 'OK',
            }, ], {
              cancelable: false
            }
          )
          changeStateFlag = false;
        }
      }

      if (changeStateFlag) {
          //判斷定時時間問題
          let msg = this.getFinalTip(lang, deputyData);
          this.props.actions.setBPMDeputy(content, msg);
      }
  }

  // 取得时间设定提示信息
  getFinalTip(lang, deputyData){
      let tampStart = new Date(deputyData.startExecuteTime.defaultvalue).getTime();
      let tampEnd = new Date(deputyData.endExecuteTime.defaultvalue).getTime();
      let tampNow = (new Date()).getTime();
      console.log('tampStart', tampStart);

      //判斷定時時間問題
      let timerFlag = false;
      if (tampStart <= tampNow && tampEnd > tampNow) { // 开始时间小于等于现在且结束时间大于现在
        timerFlag = true;
      }
      let msg = lang.SaveNotVTime;
      {/*代理模式已啟動*/}
      // console.log("代理模式已啟動",deputyData.deputyState);
      {/*啟動註記false+沒有設定定時*/}
      // console.log("啟動註記false+沒有設定定時",(!deputyData.deputyState && !deputyData.executeDuration));
      {/*啟動註記false+設定了定時+時間邏輯正確*/}
      // console.log("啟動註記false+設定了定時+時間邏輯正確",(!deputyData.deputyState && deputyData.executeDuration && timerFlag));
      let flag=(
        deputyData.deputyState || 
        (!deputyData.deputyState && !deputyData.executeDuration) || 
        (!deputyData.deputyState && deputyData.executeDuration && timerFlag)
      );
      if(flag){
          if (!deputyData.deputyState) {
            //"代理模式已啟動，如需編輯請先停用";
            msg = lang.Running; 
          } else {
            //"代理模式已停用";
            msg = lang.NoRunning; 
          }
      } else if (tampStart > tampNow) {
          //"已保存，未達特定時間";
          msg = lang.SaveNotRunning; 
      } else if (tampStart == tampNow) {
          //"結束時間需大於起始時間";
          msg = lang.StartTimeNotMoreEnd; 
      }
      return msg;
  }

  getParamValue(key) {
    let value = null;
    let mixParam = this.props.state.Deputy.mixParam;
    for (let i in mixParam) {
      if (mixParam[i].key == key) {
        value = mixParam[i].value;
        break;
      }
    }
    return value;
  }

  // 起始时间action
  onPressStartExecuteTime = (value, item) => {
    let valueAble = this.checkTimeValue("s", value);
    if (valueAble) {
      this.props.actions.onPressStartExecuteTime(value);
    } else {
      let msg = this.props.state.Language.lang.DeputyPage.StartTimeNotMoreEnd;
      //"起始時間需大於結束時間",
      Alert.alert(
        msg,
        null, [{
          text: 'OK'
        }], {
          cancelable: false
        }
      )
    }
  }

  // 结束时间action
  onPressEndExecuteTime = (value, item) => {
    let valueAble = this.checkTimeValue("e", value);
    if (valueAble) {
      this.props.actions.onPressEndExecuteTime(value);
    } else {
      //"結束時間需大於起始時間",
      let msg = this.props.state.Language.lang.DeputyPage.EndTimeNeedMoreStart;
      Alert.alert(
        msg,
        null, [{
          text: 'OK',
        }], {
          cancelable: false
        }
      )
    }
  }

  // 检核时间
  checkTimeValue = (index, value) => {
    if (index == "s") {
      if (this.props.state.Deputy.endExecuteTime == null) {
        return value;
      } else {
        let endTime = new Date(this.props.state.Deputy.endExecuteTime.defaultvalue).getTime();
        let tempValue = new Date(value).getTime();
        return (tempValue < endTime) ? value : false;
      }
    } else {
      if (this.props.state.Deputy.startExecuteTime == null) {
        return value;
      } else {
        let startTime = new Date(this.props.state.Deputy.startExecuteTime.defaultvalue).getTime();
        let tempValue = new Date(value).getTime();
        return (tempValue > startTime) ? value : false;
      }
    }
  }

  // 代理方式action
  onPressDeputyWay = (value) => {
    this.props.actions.updateDeputyWay(value);
  }

  // 依规则代理action
  onPressDeputyRules = (value) => {
    this.props.actions.updateDeputyRules(value);
  }

  // 单一代理action
  onPressDeputyMember = (value, item) => {
    let deputid = this.deepClone(this.props.state.Deputy.deputyID);
    deputid.defaultvalue = value.COLUMN1;
    let deputname = this.deepClone(this.props.state.Deputy.deputyName);
    deputname.defaultvalue = value.COLUMN2;

    this.props.actions.updateDeputyMember(deputid,deputname);
  }

  // 通知对象action
  onPressMsgMember = (value, item) => {
    let informid = this.deepClone(this.props.state.Deputy.informID);
    informid.defaultvalue = value.COLUMN1;
    let informname = this.deepClone(this.props.state.Deputy.informName);
    informname.defaultvalue = value.COLUMN2;
    
    this.props.actions.updateMsgMember(informid,informname);
  }

  // 资料加载图层
  renderActivityIndicator = () => {
    if (this.props.state.Deputy.isLoading) {
      return (
        <Modal
          animationType="none"
          transparent={true}
          visible={true}
          onRequestClose={() => {
          }}
        >
          <Container style={{justifyContent: 'center', alignItems: 'center', backgroundColor:'rgba(255,255,255,.7)'}}>
            <Spinner color="#3691ec"/>
          </Container>
        </Modal>
      );
    }
  }
}

export let DeputyPageStyle = connectStyle( 'Page.DeputyPage', {} )(DeputyPage);

export default connect(
  (state) => ({
    state: { 
      ...state
    }
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...DeputyAction,
    }, dispatch)
  })
)(DeputyPageStyle);

// {
//   addTodo : text => dispatch(addTodo('text'));
//   removeTodo : id => dispatch(removeTodo('id'));
// }
