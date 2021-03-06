import React from 'react';
import { Image, View, DeviceEventEmitter, Platform} from 'react-native';
import { Container, Spinner, connectStyle, Text } from 'native-base';
import SplashScreen            from 'react-native-splash-screen';
import { ProgressView }          from "@react-native-community/progress-view";
import { addDownLoadListener } from 'rn-app-upgrade';
import { connect, useSelector} from 'react-redux';
import { bindActionCreators }  from 'redux';
import * as AppInitAction      from '../redux/actions/AppInitAction';
import * as ThemeAction        from '../redux/actions/ThemeAction';
import * as LanguageAction     from '../redux/actions/LanguageAction';
import * as CommonAction       from '../redux/actions/CommonAction';
import * as NetworkAction      from '../redux/actions/NetworkAction';
import * as LoginAction        from '../redux/actions/LoginAction';
import * as UserInfoAction     from '../redux/actions/UserInfoAction';
import * as BiometricAction    from '../redux/actions/BiometricAction';
import * as HomeAction         from '../redux/actions/HomeAction';
import * as MessageAction      from '../redux/actions/MessageAction';
import * as MeetingAction      from '../redux/actions/MeetingAction';
import MessageRouter           from '../utils/MessageRouter';
import MainPageBackground      from '../components/MainPageBackground';

class SplashPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showUpdateProgress: false,
      downloadProgress: 0,
      upgradeMessage: null,
    }
  }

  componentDidMount(){
    //是否允許APP進行初始化程序
    if (this.props.state.Login.enableAppInitialFunction) {
      this.props.actions.appInit( this.props.actions );                 // APP初始化程序
      MessageRouter.initial();                                          // 處理訊息分流的類別
      MessageRouter.addListeners(this.props.state, this.props.actions); // 處理訊息分流的類別
      MessageRouter.addMessageListener(this.props.actions);             // 啟動訊息觸發的監聽器
      SplashScreen.hide();
    }
  }

  componentDidUpdate(prevProps, prevState){
    //是否允許APP進行初始化程序
    if (this.props.state.Login.enableAppInitialFunction) {
      if (!prevProps.isFocused && this.props.isFocused) {
        this.props.actions.appInit(this.props.actions); //APP初始化程序
      }
    }
  }

  render() {
    return (
      <Container style={{ alignItems: 'center',  justifyContent: 'center' }}>
        <MainPageBackground height={0}/>
        <Image style={{ width:250, height:250 }} source ={require("../image/login/icon-noback.png")} />
          {
            this.props.state.AppInit.showUpdateProgress ?
              <View style={{width:"80%", zIndex:1, position: 'absolute', bottom: "15%"}}>
                <ProgressView
                  progressTintColor="orange"
                  trackTintColor="blue"
                  progress={this.props.state.AppInit.downloadProgress}
                />
                <Text style = {{marginTop: 5}} >{this.props.state.AppInit.upgradeMessage}</Text>            
              </View>
            :
              <Spinner 
                size  ="large" 
                style ={{position: 'absolute', zIndex:1, bottom: "15%"}}
              />
          }
      </Container>
    );
  }
}

let SplashPageStyle = connectStyle( 'Page.HomePage', {} )(SplashPage);
export default connect(
  (state) => ({
    state: { ...state }
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...AppInitAction,
      ...ThemeAction,
      ...LanguageAction,
      ...CommonAction,
      ...NetworkAction,
      ...LoginAction,
      ...UserInfoAction,
      ...BiometricAction,
      ...HomeAction,
      ...MessageAction,
      ...MeetingAction
    }, dispatch)
  })
)(SplashPageStyle);