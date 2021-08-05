import React from 'react';
import { Platform, View } from 'react-native';
import { connect } from 'react-redux';
import { Container, Content, Card, CardItem, Footer, Button, Text, Icon } from 'native-base';
import { WebView } from 'react-native-webview';
import HeaderForGeneral from '../../components/HeaderForGeneral';
import * as NavigationService from '../../utils/NavigationService';

const BaseScript =
  `
        var height = null;
        function changeHeight() {
          if (document.body.scrollHeight != height) {
            height = document.body.scrollHeight;
      
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'setHeight',
              height: height,
            }))
          }
        }
        setInterval(changeHeight, 50);
    `;

const FixTinyText = '<meta name="viewport" content="width=device-width, initial-scale=1">';
let WEB_VIEW_REF = 'webview';
class OfficialWebsitePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // RecruitDetailData: this.props.route.params.data,
      height: 0,
      canGoBack: false,//是否可以返回上一页
      canGoForward: false,//是否可以前进下一页
    };
  }

  onMessage = (event) => {
    try {
      const action = JSON.parse(event)
      if (action.type === 'setHeight' && action.height > 0 && this.state.height == 0) {
        this.setState({
          height: action.height
        })
      }
    } catch (error) { }

  }


  render() {
    return (
      <Container>
        {/*標題列*/}
        <HeaderForGeneral
          isLeftButtonIconShow={true}
          leftButtonIcon={{ name: "menu" }}
          leftButtonOnPress={() => this.props.navigation.toggleDrawer()}
          isRightButtonIconShow={false}
          rightButtonIcon={null}
          rightButtonOnPress={null}
          title={this.props.lang.Title}
        />
        {
          (Platform.OS === "ios") ?
            <WebView
              ref={WEB_VIEW_REF}
              injectedJavaScript={BaseScript}
              // source={{ html: FixTinyText+this.state.RecruitDetailData }}
              allowsBackForwardNavigationGestures={true}
              source={{ uri: 'http://www.huali-group.com/' }}
              style={{
                flex: 1,
                // width: "100%",
                // height: this.state.height,
                // backgroundColor: 'transparent'
              }}
              javaScriptEnabled // 仅限Android平台。iOS平台JavaScript是默认开启的。
              // scrollEnabled={false}
              onMessage={event => this.onMessage(event.nativeEvent.data)}
              onNavigationStateChange={this.onNavigationStateChange}
            />
            :
            <WebView
              ref={WEB_VIEW_REF}
              injectedJavaScript={BaseScript}
              // source={{ html: FixTinyText+this.state.RecruitDetailData, baseUrl:'' }}
              source={{ uri: 'http://www.huali-group.com/' }}
              style={{
                flex: 1,
                // height: this.state.height,
              }}
              javaScriptEnabled // 仅限Android平台。iOS平台JavaScript是默认开启的。
              domStorageEnabled // 适用于安卓
              // scrollEnabled={true}
              onMessage={event => this.onMessage(event.nativeEvent.data)}
              androidHardwareAccelerationDisabled={true}
              onNavigationStateChange={this.onNavigationStateChange}
            />
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

  onNavigationStateChange = (navState) => {
    this.setState({
      canGoBack: navState.canGoBack,
      canGoForward: navState.canGoForward
    })
  }
  
  goBack = () => {
    this.refs[WEB_VIEW_REF].goBack()
  }
  goForward = () => {
    this.refs[WEB_VIEW_REF].goForward()
  }
}

export default connect(
  (state) => ({
    lang: state.Language.lang.OfficialWebsitePage
  })
)(OfficialWebsitePage);