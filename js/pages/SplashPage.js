import React from 'react';
import { Image, View, DeviceEventEmitter, Platform} from 'react-native';
import { Container, Spinner, connectStyle, Text } from 'native-base';
import SplashScreen           from 'react-native-splash-screen';
import * as Progress from 'react-native-progress';
import { addDownLoadListener } from 'rn-app-upgrade';

import { connect, useSelector}from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AppInitAction     from '../redux/actions/AppInitAction';
import * as ThemeAction       from '../redux/actions/ThemeAction';
import * as LanguageAction    from '../redux/actions/LanguageAction';
import * as CommonAction      from '../redux/actions/CommonAction';
import * as NetworkAction     from '../redux/actions/NetworkAction';
import * as LoginAction       from '../redux/actions/LoginAction';
import * as UserInfoAction    from '../redux/actions/UserInfoAction';
import * as BiometricAction   from '../redux/actions/BiometricAction';


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
      this.props.actions.appInit(this.props.actions, this.downloadProgressCallback); //APP初始化程序
      this.addDownLoadFileListener();         // 新增檔案下載監聽器
      SplashScreen.hide();
    } else {
      
    }
  }

  // 版本更新的下載進度條設定
  addDownLoadFileListener = () => {
    DeviceEventEmitter.addListener('LOAD_PROGRESS', (msg) => {
      this.setState({
        showUpdateProgress: true,
        downloadProgress: msg / 100,
        upgradeMessage: `Downloading... ${msg}%`
      });
      if (msg == 100) this.props.actions.userSkipDigUpdate(this.props.actions);  // 避免下載APK後不更新，直接進入啟動畫面
    });
  }

  // 熱更新的下載進度條設定
  downloadProgressCallback = (event) => {
    let percent = Math.round((event.receivedBytes / event.totalBytes) * 100);
    this.setState({
      showUpdateProgress: true,
      downloadProgress: event.receivedBytes / event.totalBytes,
      upgradeMessage: `Progressing... ${percent}%`,
    });
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
        <Image style={{ width:250, height:250 }} source ={require("../image/login/icon-noback.png")} />
          {
            this.state.showUpdateProgress ?
              <View style={{width:"80%", zIndex:1, position: 'absolute', bottom: "15%"}}>
                <Progress.Bar
                  style         = {{ width: "100%" }}
                  progress      = { this.state.downloadProgress }
                  indeterminate = { false }
                />
                <Text style = {{marginTop: 5}} >{this.state.upgradeMessage}</Text>            
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
      ...BiometricAction
    }, dispatch)
  })
)(SplashPageStyle);