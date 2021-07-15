import React from 'react';
import { Container, Footer, Button, Icon } from 'native-base';
import { Alert, View} from 'react-native';
import HeaderForGeneral  from '../../components/HeaderForGeneral';
import { WebView } from 'react-native-webview';
import  * as  NavigationService from '../../utils/NavigationService';
import { connect } from 'react-redux';
import * as SQLiteUtil from "../../utils/SQLiteUtil";

let WEB_VIEW_REF = 'webview';
class CreateWebViewPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',//标题
      url: this.props.route.params.data.WEBURL,//webview url
      canGoBack: false,//是否可以返回上一页
      canGoForward: false,//是否可以前进下一页
    }
  }

  componentDidMount(){
    let title = this.props.route.params.data.WEBTITLE
    let lang = this.props.state.Language.langStatus
    let langID = this.props.route.params.data.WEBTITLE //有多语系时为title语系ID
    let sql = ` select ifnull(b.LANGCONTENT,a.LANGCONTENT) as LANGCONTENT from THF_LANGUAGE a
              join THF_LANGUAGE b on a.LANGID = b.LANGID and b.LANGTYPE = '${lang}' and b.STATUS = 'Y'
              where a.LANGID = '${langID}' and a.LANGTYPE = 'zh-CN' and a.STATUS = 'Y' `
    SQLiteUtil.selectData(sql,[]).then(result => {
      let raw = result.raw()
      if (raw.length > 0) {
        title = raw[0].LANGCONTENT
      }else{
        title = title == null ? "" : title
      }
      this.setState({
        title
      })
    })
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
          // title                 = {this.props.route.params.urlData?this.props.route.params.urlData.paramname:""}
          title = {this.state.title}
          isTransparent         = {false}
        />
        {
          (this.state.url != null)?
          <WebView
              ref={WEB_VIEW_REF}
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
              originWhitelist={['*']}
              // javaScriptEnabled={true}//是否执行js代码
              injectedJavaScript='window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight)'//插入的js代码，必须是字符串，
              // source={{uri: 'file:///android_asset/detail.html'}}        //本地的html代码需要放在安卓目录的静态文件下
              // source={{ uri: this.props.route.params.urlData.descname }}
              source = {{uri:this.state.url}}
              style={{marginTop: 1}} //样式
              // onMessage={(event) => {
              //     console.log("html页面传过来的参数", event.nativeEvent.data)
              // }}
              // ref={webView => this.webView = webView}
              javaScriptEnabled
              onNavigationStateChange={this.onNavigationStateChange}
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

       <Footer>
          {
            <Button
              disabled={!this.state.canGoBack}
              transparent
              onPress={() => { this.goBack() }}
            >
              <Icon name='chevron-back-outline' />
            </Button>
          }
          <View style={{ width: "30%" }}></View>
          {
            <Button
              disabled={!this.state.canGoForward}
              transparent
              onPress={() => { this.goForward() }}
            >
              <Icon name='chevron-forward-outline' />
            </Button>
          }
        </Footer>
      </Container>  
    );
  }

  cancelSelect(){
      NavigationService.goBack();
  }

  onNavigationStateChange = (navState) => {
    this.setState({
      canGoBack: navState.canGoBack,
      canGoForward: navState.canGoForward
    })
  }

  goBack = () => {
    console.log('refs:',this.refs[WEB_VIEW_REF]);
    this.refs[WEB_VIEW_REF].goBack()
  }

  goForward = () => {
    this.refs[WEB_VIEW_REF].goForward()
  }
}

export default connect(
  (state) => ({
    state: {...state}
  })
)(CreateWebViewPage);
