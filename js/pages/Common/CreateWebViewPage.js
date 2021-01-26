import React from 'react';
import { Container } from 'native-base';
import { Alert} from 'react-native';
import HeaderForGeneral  from '../../components/HeaderForGeneral';
import { WebView } from 'react-native-webview';
import  * as  NavigationService            from '../../utils/NavigationService';
import { connect } from 'react-redux';

class CreateWebViewPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
   
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
          title                 = {this.props.route.params.urlData?this.props.route.params.urlData.paramname:""}
          isTransparent         = {false}
        />
        {(this.props.route.params.urlData!=null)?
          <WebView
              // onLoadStart={() => {
              //     console.log("当WebView刚开始加载时调用的函数")
              // }}
              // onNavigationStateChange={(e) => console.log(e)}//当导航状态发生变化的时候调用。
              // startInLoadingState={true}
              // renderLoading={() => (
              //   <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
              //       <Spinner color={this.props.style.SpinnerColor}/>
              //       <Text style={{color:this.props.style.inputWithoutCardBg.inputColor}}>{this.props.state.Language.lang.Common.FileLoading}</Text>
              //   </View>
              // )}//loading效果
              // allowsInlineMediaPlayback={true}
              javaScriptEnabled={true}//是否执行js代码
              injectedJavaScript='window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight)'//插入的js代码，必须是字符串，
              // source={{uri: 'file:///android_asset/detail.html'}}        //本地的html代码需要放在安卓目录的静态文件下
              source={{ uri: this.props.route.params.urlData.descname }}
              style={{marginTop: 1}} //样式
              // onMessage={(event) => {
              //     console.log("html页面传过来的参数", event.nativeEvent.data)
              // }}
              // ref={webView => this.webView = webView}
          />
            :
          Alert.alert(
            this.props.state.Language.lang.Common.Sorry,
            this.props.state.Language.lang.Common.WebViewUrlError, [{
              text: 'OK',
              onPress: () => NavigationService.goBack()
            }], {
              cancelable: false
            }
          )
        }
       
      </Container>  
    );
  }

  cancelSelect(){
      NavigationService.goBack();
  }
}

export default connect(
  (state) => ({
    state: {...state}
  })
)(CreateWebViewPage);
