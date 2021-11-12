import React from 'react';
import {  Alert, Modal, Platform, View, Keyboard, DeviceEventEmitter} from 'react-native';
import { Spinner, Container, Left, Content, Body, Item, Button, Icon, Text, Right, CardItem, Thumbnail, Tab, Input, connectStyle} from 'native-base';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux';
import Common                from '../../../utils/Common';
import * as UpdateDataUtil   from '../../../utils/UpdateDataUtil';
import BirthdayDetailTabList from '../../../components/Birthday/BirthdayDetailTabList';
import HeaderForGeneral      from '../../../components/HeaderForGeneral';
import * as NavigationService  from '../../../utils/NavigationService';
import * as LoggerUtil     from '../../../utils/LoggerUtil';
import ToastUnit from '../../../utils/ToastUnit';


class BirthdayDetailPage extends React.Component {
  constructor(props) {
    super(props);
    let detailInfo = this.props.route.params.detailInfo;
    // 處理圖片問題
    let photo = detailInfo.picture;


    this.state = {
      masterInfo          : this.props.route.params.masterInfo,
      detailInfo          : detailInfo,
      selectedInfo        : [],
      isCake              : false,
      isGift              : false,
      msgcontent          : "",
      msgRefresh          : [],
      isSubmitting        : false,
      keyposition         : 0,
      keyboardMarginBottom: 0,
      photo               : photo
    }
  }

  startEmit = (flag) => {
    let isCake = this.state.isCake;
    let isGift = this.state.isGift;
    if (flag == "cake") {
      isCake = !isCake;
    }
    if (flag == "gift") {
      isGift = !isGift;
    }
    // 准备值，发监听
    // const message = '监听发出通过，让one页面的值进行改变';
    // console.log("isCake", isCake);
    let obj = {
      id: this.state.selectedInfo.id,
      type: flag,
      isCake: isCake,
      isGift: isGift
    }
    DeviceEventEmitter.emit('changeResult', obj);
  };

  componentDidMount() {
    //IPUSH推送更新資訊
    //APP的監聽事件
    //收到监听-監聽祝福明細
    this.pushDetail = DeviceEventEmitter.addListener('updateDetailPage', (item) => {
      if (item.id == this.state.selectedInfo.id) {
        //不會觸發tablist的willmount所以需要將圖片先載入一併替換obj
        let data=item.msglist;

        this.setState({
          msgcount: item.msglist.length,
          msgRefresh: data,
          giftcount: item.giftcount,
          cakecount: item.cakecount,
          isCake: item.cake,
          isGift: item.gift
        });
      }

    });

    //收到监听-留言删除
    this.reflashMsg = DeviceEventEmitter.addListener('reflashMsg', (oid, tempArray) => {
      if (oid != "") {
        if (tempArray.length == 0) {
          tempArray = [];
        }
        this.setState({
          msgRefresh: tempArray,
          msgcount: this.state.msgcount - 1
        });
        UpdateDataUtil.setBirthdayMsgStatusData(this.state.masterInfo.user, oid, 'N').then((data) => {
          //觸發BirthdayAdmireItem更新留言列表
          this.setState({
            isSubmitting: false
          });
          this.startEmit("msg");
        }).catch((e) => {
          this.setState({
            isSubmitting: false
          });
        });

      }
    });



    Keyboard.addListener('keyboardDidShow', (event) => {
      // console.log('keyboard:', event)

      this.setState({
        keyposition: false ? event.duration + 80 : event.duration,
      })

    })
    Keyboard.addListener('keyboardDidHide', (event) => {
      this.setState({
        keyposition: 0
      })
    })
  }

  componentWillUnmount() {
    //移除监听
    if (this.pushDetail) {
      this.pushDetail.remove();
    }
    if (this.reflashMsg) {
      this.reflashMsg.remove();
    }
    this.setState = (state, callback) => {
      return;
    };
  }

    //改componentDidMount圖像無法加載
    UNSAFE_componentWillMount() {
    this.setState({
      selectedInfo: this.state.masterInfo.selectedInfo,
      isCake: this.state.detailInfo.isCake,
      isGift: this.state.detailInfo.isGift,
      msgcount: this.state.detailInfo.msgcount,
      giftcount: this.state.detailInfo.giftcount,
      cakecount: this.state.detailInfo.cakecount,
      msgcontent: "",
      msgRefresh: this.state.detailInfo.msgRefresh,
      isDelLoading: false
    })
  }

  render() {
    let birthdayInfo = this.state.selectedInfo;
    let user = this.state.masterInfo.user;
    let inbusdat = Common.dateFormatInbusdat(birthdayInfo.inbusdat);

    let seletedPhoto = (birthdayInfo.sex == "M") ? require("../../../image/user_m.png") : require("../../../image/user_f.png");
    if (this.state.photo) {
      seletedPhoto = this.state.photo;
    }

    let footerView = null;
    if (Platform.OS === "ios") {
      footerView = (
              <KeyboardAwareScrollView
                scrollEnabled= {false}
                enableAutomaticScroll={false}
                onKeyboardWillShow={(frames: Object) => {
                    let keyboardMarginBottom = frames.startCoordinates.screenY - frames.endCoordinates.screenY;
                    this.setState({
                      keyboardMarginBottom:keyboardMarginBottom
                    });
                  }}
                onKeyboardWillHide={(frames: Object) => {
                    this.setState({
                      keyboardMarginBottom:0
                    });
                  }}
              >
                  <Body style={{flexDirection:"row", borderWidth:0,paddingBottom:20,paddingTop:10}}>
                    <Left style={{alignItems:'center',flex:0,paddingLeft:5}}>
                        <Thumbnail small source={user.picture} />
                    </Left>
                    <Body style={{paddingLeft:5}}>
                      <Item regular style={{paddingTop:5,alignItems:'center',height:40}}>
                          <Input  
                              placeholder='Write a comment...'
                              placeholderTextColor  = {this.props.style.inputWithoutCardBg.inputColorPlaceholder}
                              onChangeText ={(text) => { 
                                    this.setState({ 
                                        msgcontent:text
                                    }); 
                              }}
                              value     = {this.state.msgcontent}
                              ref       ="focusInput"
                              autoFocus ={true}
                              style     = {{color:this.props.style.inputWithoutCardBg.inputColor}}
                          />
                      </Item>
                    </Body>
                    <Right style={{flex:0,paddingLeft:5}}>
                        <Button style={{height:40}} rounded light onPress={() => this.pressPost()}>
                            <Text >Post</Text>
                        </Button>
                    </Right>    
                  </Body>
              </KeyboardAwareScrollView>
      );
    }else {
      footerView = (
          <Body style={{flexDirection:"row", borderWidth:0,paddingBottom:20,paddingTop:10}}>
              <Left style={{alignItems:'center',flex:0,paddingLeft:5}}>
                  <Thumbnail small source={user.picture} />
              </Left>
              <Body style={{paddingLeft:5}}>
                <Item regular style={{paddingTop:5,alignItems:'center',height:40}}>
                    <Input  
                        placeholder='Write a comment...'
                        placeholderTextColor  = {this.props.style.inputWithoutCardBg.inputColorPlaceholder}
                        onChangeText ={(text) => { 
                              this.setState({ 
                                  msgcontent:text
                              }); 
                        }}
                        value     = {this.state.msgcontent}
                        ref       ="focusInput"
                        autoFocus ={true}
                        style     = {{color:this.props.style.inputWithoutCardBg.inputColor}}
                    />
                </Item>
              </Body>
              <Right style={{flex:0,paddingLeft:5}}>
                  <Button style={{height:40}} rounded light onPress={() => this.pressPost()}>
                      <Text >Post</Text>
                  </Button>
              </Right>    
          </Body>
      );
    }

    return (
      <Container>
        {/*標題列*/}
        <HeaderForGeneral
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:"arrow-back"}}
          leftButtonOnPress     = {this.cancelSelect.bind(this)} 
          isRightButtonIconShow = {false}
          rightButtonIcon       = {null}
          rightButtonOnPress    = {null} 
          title                 = {this.props.state.Language.lang.BirthdayDetailPage.BirthdayAdmire}
          isTransparent         = {false}
        />
        <View style={{flex:1,paddingTop:5}}>
        <Content> 
          <View style={{backgroundColor:this.props.style.flastBgColor}}>
              <CardItem header style={{paddingBottom: 0}}>
                  <Body style={{justifyContent: 'flex-start',flexDirection: 'column'}}>
                      <Body style={{flexDirection: 'row', height:300, width:"100%"}}> 
                          <Body style={{width: '100%', height:"100%"}}>
                            <Thumbnail
                                square 
                                style={{ width: '100%', height:"100%"}} 
                                resizeMode = {"contain"}
                                source={seletedPhoto} 
                            />
                          </Body>
                      </Body> 
                      <Body style={{flexDirection: 'row', width:"100%"}}> 
                        <Body style={{justifyContent:'flex-start',flex:0,paddingLeft:8,paddingRight:8,paddingTop:8,paddingBottom:8}}>
                            <Thumbnail style={{height:40 ,width:40}} source={require("../../../image/birthday/party-hat.png")}/>
                        </Body>
                        <Body style={{justifyContent:'space-between',flexDirection: 'row'}}>
                            <Body style={{flex:1}}>
                                <Body  style={{flexDirection: 'row',width:140}}>
                                    <Text  style={{fontSize:15}}>
                                        {birthdayInfo.name} 
                                    </Text>
                                    <Body style={{paddingLeft:8}}>
                                        <Text note style={{}}>
                                          {birthdayInfo.depname}
                                        </Text>                       
                                    </Body>
                                </Body>
                                <Body style={{justifyContent:'flex-start'}}>
                                    <Text note style={{width:140}}>
                                      {this.props.state.Language.lang.BirthdayDetailPage.msg1}{inbusdat}{this.props.state.Language.lang.BirthdayDetailPage.msg2}
                                    </Text>  
                                </Body>
                            </Body>
                            <Body  style={{flexDirection: 'row'}}>
                                <Body  style={{flexDirection: 'row',justifyContent:'flex-end'}}>
                                    <Button transparent style={{width:'30%'}} onPress={() => this.pressCake(this.state.isCake)}>
                                      {(this.state.isCake) ?
                                        <Icon name="cake" type="MaterialCommunityIcons" style={{color:'#FF0000',width:'60%'}} />
                                        :
                                        <Icon name="cake" type="MaterialCommunityIcons" style={{color:'#C5C1AA',width:'60%'}}/>
                                      }
                                    </Button>
                                    <Text>{this.state.cakecount}</Text>
                                    <Button transparent style={{width:'30%'}} onPress={() => this.pressGift(this.state.isGift)}>
                                        {(this.state.isGift) ?
                                        <Icon name="gift" type="AntDesign" style={{color:'#FF0000',width:'60%'}} />
                                        :
                                        <Icon name="gift" type="AntDesign" style={{color:'#C5C1AA',width:'60%'}}/>
                                      }
                                    </Button>   
                                    <Text>{this.state.giftcount}</Text>  
                                    <Button transparent style={{width:'30%'}} 
                                    onPress={()=>{
                                       this.refs["focusInput"].wrappedInstance.focus();
                                    }}>
                                      <Icon name="create" style={{color:'#C5C1AA',width:'60%'}}/>
                                    </Button> 
                                </Body>
                            </Body>
                        </Body>
                      </Body>

                      <Body style={{paddingBottom:10}}>
                          <Body style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <Left>
                                <Text>{this.state.msgcount} {this.props.state.Language.lang.BirthdayDetailPage.msg3}</Text>   
                            </Left>
                          </Body>
                      </Body>
                  </Body>
              </CardItem> 
              <View style={this.props.style.Separator}/>
              <CardItem 
                style = {
                  {
                    paddingTop: 0,
                    paddingBottom: 0, //解決破圖問題
                    paddingLeft: 0,
                    paddingRight: 0,
                    // backgroundColor: '#FFF'
                  }
                }
              >   
                  <Tab>                     
                    <BirthdayDetailTabList 
                        data   ={this.state.msgRefresh} 
                        userInfo ={this.state.masterInfo.user}
                        onPressDelLoading ={this.delLoading}
                        lang ={this.props.state.Language.lang.BirthdayDetailPage}
                    />                     
                </Tab>  
             </CardItem>            
        </View>
        </Content> 
        </View>

        <View style={{
          flexDirection:"row",
          borderWidth:0,
          paddingTop:0,
          borderTopWidth:0.3,
          marginBottom:this.state.keyboardMarginBottom}}
        >
          {footerView}
        </View>   
        {this.renderActivityIndicator()}
      </Container>
    );
  }

  cancelSelect() {
    this.props.navigation.goBack();
  }
  pressCake(flag) {
    var myDate = new Date();
    var nowYear = myDate.getFullYear().toString();
    UpdateDataUtil.setBirthdayAdmireData(this.state.masterInfo.user, nowYear, this.state.selectedInfo.id, "CAKE").then((data) => {
      if (flag) {
        this.setState({
          isCake: false,
          cakecount: this.state.cakecount - 1
        });
      } else {
        this.setState({
          isCake: true,
          cakecount: this.state.cakecount + 1
        });
      }
    }).catch((e) => {});
    this.startEmit("cake");
  }

  pressGift(flag) {
    var myDate = new Date();
    var nowYear = myDate.getFullYear().toString();
    UpdateDataUtil.setBirthdayAdmireData(this.state.masterInfo.user, nowYear, this.state.selectedInfo.id, "GIFT").then((data) => {
      if (flag) {
        this.setState({
          isGift: false,
          giftcount: this.state.giftcount - 1
        });
      } else {
        this.setState({
          isGift: true,
          giftcount: this.state.giftcount + 1
        });
      }
    }).catch((e) => {});
    this.startEmit("gift");
  }

  pressPost() {
    if (this.state.msgcontent != "") {
      var myDate = new Date();
      var nowYear = myDate.getFullYear().toString();
      let user = this.state.masterInfo.user;
      let tid = this.state.selectedInfo.id;
      let msgMax = this.state.masterInfo.msgMax ? this.state.masterInfo.msgMax : 0;
      this.setState({
        isSubmitting: true
      });
      UpdateDataUtil.getBirthdayMsgTotalData(user, nowYear, user.id, tid, "Y").then((data) => {
          if(data.content.length < msgMax) {
              // let user = this.state.masterInfo.user;
              // var myDate = new Date();
              // var nowYear = myDate.getFullYear().toString();
              let obj = {
                oid: "temp",
                content: this.state.msgcontent,
                id: user.id,
                name: user.name,
                picture: user.picture,
                sex: user.sex,
                tid: this.state.selectedInfo.id,
                year: nowYear,
                txdat: myDate
              }
              let array1 = this.state.msgRefresh;
              let tempMsg = [obj, ...array1];

              UpdateDataUtil.setBirthdayMsgData(this.state.masterInfo.user, nowYear, this.state.selectedInfo.id, this.state.msgcontent).then((data) => {
                // this.refreshMsg();
                this.setState({
                  msgcontent: '',
                  msgcount: this.state.msgcount + 1,
                  msgRefresh: tempMsg,
                  isSubmitting: false
                });
                this.startEmit("msg");
              }).catch((e) => {
                LoggerUtil.addErrorLog("setBirthdayMsgData post", "APP Page in BirthdayDetailPage", "WARN", e);
              });
          } else {
            // console.log("留言失敗，已留言超過3條",msgMax);
            ToastUnit.show('error', this.props.state.Language.lang.BirthdayDetailPage.msg4 + msgMax + this.props.state.Language.lang.BirthdayDetailPage.msg5);
            this.setState({
              isSubmitting: false
            });
          }
      }).catch((e) => {
          LoggerUtil.addErrorLog("getBirthdayMsgTotalData post", "APP Page in BirthdayDetailPage", "WARN", e);
          //code不為200
          setTimeout(() => {
            Alert.alert(
              this.props.state.Language.lang.CreateFormPage.Fail,
              e.message, [{
                text: 'OK',
                onPress: () => {
                  NavigationService.goBack();
                }
              }], {
                cancelable: false
              }
            )
          }, 200);
          this.setState({
            isSubmitting: false
          });
          // console.log("失敗獲取列表" + e);
      });
    }
  }

  delLoading = (flag) => {
    this.setState({
      isSubmitting: flag
    });
  }

  refreshMsg = () => {
    let user = this.state.masterInfo.user;
    let coid = this.state.selectedInfo.coid;
    let tid = this.state.selectedInfo.id;
    var myDate = new Date();
    var nowYear = myDate.getFullYear().toString();
    this.setState({
      isSubmitting: true
    });
    UpdateDataUtil.getBirthdayData(user, nowYear, coid, tid).then((data) => {
      if (data) {
        this.setState({
          msgRefresh: data.msglist,
          isSubmitting: false
        });
      } else {
        this.setState({
          msgRefresh: [],
          isSubmitting: false
        });
      }
    }).catch((e) => {
      this.setState({
        msgRefresh: [],
        isSubmitting: false
      });
    });
  }

  renderActivityIndicator = () => {
    if (this.state.isSubmitting) {
      return (
        <Modal
          animationType="none"
          transparent={true}
          visible={true}
          onRequestClose={() => {}}
        >
          <Container style={{
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor:this.props.style.SpinnerbackgroundColor
          }}>
            <Spinner color={this.props.style.SpinnerColor}/>
          </Container>
        </Modal>
      );
    }
  }

}

export let BirthdayDetailPageStyle = connectStyle( 'Page.BirthdayPage', {} )(BirthdayDetailPage);
export default connect(
  (state) => ({
    state: { ...state
    },
  })
)(BirthdayDetailPageStyle);