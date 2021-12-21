import React from 'react';
import { Spinner, Container,  Left, Content,  Right, Item, Input, Button,  Text, ListItem, List,  Switch, connectStyle, Label } from 'native-base';
import { Alert, Modal, View }    from 'react-native';
import { connect }               from 'react-redux';
import { bindActionCreators }    from 'redux';
import FormInputContent          from '../../components/Form/FormInputContent';
import FormContentTextWithAction from '../../components/Form/FormContentTextWithAction';
import FormContentCbo            from '../../components/Form/FormContentCbo';
import FormContentDateTime       from '../../components/Form/FormContentDateTime';
import HeaderForGeneral          from '../../components/HeaderForGeneral';
import * as NavigationService    from '../../utils/NavigationService';
import * as DeputyAction         from '../../redux/actions/DeputyAction';
import * as HomeAction           from '../../redux/actions/HomeAction';
import * as UpdateDataUtil       from '../../utils/UpdateDataUtil';

class DeputyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      AppID: null
    }
  }

  componentWillMount() {
    // 捞取代理人功能AppID
    let user = this.props.state.UserInfo.UserInfo;
    UpdateDataUtil.getDeputyAppID(user).then(async (data) => {
      if(data.length > 0) {
        this.setState({
          AppID: data[0].paramcode
        });
      }
    });
    // 初始化捞取代理人资料存到redux
    this.props.actions.iniDeputyData();
  }

  // 将资料转成JS对象
  deepClone(src) {
    return JSON.parse(JSON.stringify(src));
  }

  render() {
    //過濾關鍵字所查詢的資料
    let lang = this.props.state.Language.lang.DeputyPage;
    let Deputy = this.props.state.Deputy;
    let ggg = this.deepClone(Deputy);
    // console.log('Deputy.deputyRules',Deputy.deputyRules);
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
              <Item  style={{ 
                  marginBottom: 20, 
                  padding: 15, 
                  backgroundColor: this.props.style.inputBackgroundColor
                }} 
              >
                  <Left>
                    {/*
                    <Input 
                        paddingVertical = {0}
                        scrollEnabled = {false}
                        multiline 
                        value = {lang.Status} 
                        editable = {false} 
                        style = {{textAlign: 'left', borderWidth: 1}}
                      />
                    */}
                    <Label>{lang.Status}</Label>
                  </Left>
                  <Right>
                      <Text style={{fontSize: 18}}>{Deputy.msgState}</Text>
                  </Right>
              </Item>
              
              {/* 代理方式 */}
              <View style={{
                width:"100%", 
                alignItems:"center", 
                justifyContent:"center", 
                backgroundColor:this.props.style.inputBackgroundColor
              }}>
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
                  <View style={{
                    marginTop: 20,
                    backgroundColor:this.props.style.inputBackgroundColor,
                  }}>
                    <Item>
                    {
                      (Deputy.deputyRuleComParam && !this.props.state.Deputy.isLoading) ?
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
                    </Item>
                  </View>
                : 
                  // 单一代理
                  <View style={{
                    width:"100%", 
                    alignItems:"center", 
                    justifyContent:"center", 
                    backgroundColor:this.props.style.inputBackgroundColor
                  }}>
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
                  <View style={{width:"100%", alignItems:"flex-start", backgroundColor:this.props.style.inputBackgroundColor, paddingLeft: 15, paddingTop: 5, paddingBottom: 5}}>
                    <Label>{lang.RulesNotSupport}</Label>
                  </View>
                :
                  null
              }

              {/* 特定时间代理 */}
              <Item style={{
                marginTop:20, 
                backgroundColor:this.props.style.inputBackgroundColor,
                padding: 15, 
                width: '100%'
              }}>
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
              </Item>
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
              <Item style={{
                marginTop:20,
                padding: 15,
                backgroundColor:this.props.style.inputBackgroundColor,
                width: '100%'
              }}>
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
              </Item>

              {/* 通知对象 */}
              <View style={{
                alignItems:"center", 
                backgroundColor:this.props.style.inputBackgroundColor,
                width: '100%'
              }}>
              {
                (Deputy.informMailMode && Deputy.informName.actionValue) ?              
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

              {/* 登录时不要提示代理人的状况 */}
              <Item style={{
                marginTop:20,
                marginBottom:20,
                padding: 15,
                backgroundColor:this.props.style.inputBackgroundColor,
              }}>
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
              </Item>

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
      let user = this.props.state.UserInfo.UserInfo;
      let content;

      //處理畫面與api傳值不一致問題
      let deputyData = this.props.state.Deputy;
      console.log('deputyData', deputyData);
      let changeStateFlag = true;     // 资料检核没问题注记
      if (deputyData.deputyRule) {
      // 多規則代理
        let RulesList = deputyData.deputyRules.defaultvalue;
        if (RulesList.length == 0) {
          // 多規則代理不可為空
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
          let arrayRules = [];
          for (let i in RulesList) {
            let ItemList = RulesList[i];
            // 代理人工号
            let RuleDeputyID = null;
            for (let j in ItemList) {
              if (ItemList[j].component.id == "txtRuleDeputyID") {
                RuleDeputyID = ItemList[j].defaultvalue;
              }
            }
            // 条件代号
            let CondID = null;
            for (let k in ItemList) {
              if (ItemList[k].component.id == "txtCondID") {
                CondID = ItemList[k].defaultvalue;
              }
            }
            // 条件
            let Cond = null;
            for (let l in ItemList) {
              if (ItemList[l].component.id == "txtCond") {
                Cond = ItemList[l].defaultvalue;
              }
            }

            // 组合成每一笔对象
            let obj = {
              deputyid: RuleDeputyID,
              rule: CondID,
              synopsis: Cond
            };
            arrayRules.push(obj);
          }
          content = {
            "deputyState": (!deputyData.deputyState).toString(),            // 代理启动状态
            "byDeputyRule": (deputyData.deputyRule).toString(),             // 是否多规则代理
            "deputyID": deputyData.deputyID.defaultvalue,                   // 代理人工号
            "deputyRules": arrayRules,                                      // 多规则代理列表
            "executeDuration": deputyData.executeDuration.toString(),       // 是否启动特定时间代理
            "startExecuteTime": deputyData.startExecuteTime.defaultvalue,   // 代理起时
            "endExecuteTime": deputyData.endExecuteTime.defaultvalue,       // 代理讫时
            "mailMode": deputyData.informMailMode.toString(),               // 是否代理人完成通知
            "informID": deputyData.informID.defaultvalue,                   // 通知对象工号
            "disableMsg": deputyData.disableMsgPrompt.toString()            // 是否登录时不要提示代理人的状况
          }
          console.log('content',this.deepClone(content));
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
            "deputyState": (!deputyData.deputyState).toString(),            // 代理启动状态
            "byDeputyRule": (deputyData.deputyRule).toString(),             // 是否多规则代理
            "deputyID": deputyData.deputyID.defaultvalue,                   // 代理人工号
            "executeDuration": deputyData.executeDuration.toString(),       // 是否启动特定时间代理
            "startExecuteTime": deputyData.startExecuteTime.defaultvalue,   // 代理起时
            "endExecuteTime": deputyData.endExecuteTime.defaultvalue,       // 代理讫时
            "mailMode": deputyData.informMailMode.toString(),               // 是否代理人完成通知
            "informID": deputyData.informID.defaultvalue,                   // 通知对象工号
            "disableMsg": deputyData.disableMsgPrompt.toString()            // 是否登录时不要提示代理人的状况
          }
          console.log("content1",this.deepClone(content));
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
          // 判斷定時時間問題
          let msg = this.getFinalTip(lang, deputyData);
          this.props.actions.setBPMDeputy(content, msg);

          // 记录点击次数
          let appID = this.state.AppID;
          let userID = user.id;
          HomeAction.SetAppVisitLog(appID, userID);
      }
  }

  // 取得时间设定提示信息
  getFinalTip(lang, deputyData){
      let tampStart = new Date(deputyData.startExecuteTime.defaultvalue).getTime();
      let tampEnd = new Date(deputyData.endExecuteTime.defaultvalue).getTime();
      let tampNow = (new Date()).getTime();

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
      //"起始時間需小於結束時間",
      let msg = this.props.state.Language.lang.DeputyPage.StartTimeNotMoreEnd;
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