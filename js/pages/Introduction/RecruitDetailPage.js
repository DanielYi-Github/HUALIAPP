import React from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import { Container, Content, Card, CardItem } from 'native-base';
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

class RecruitDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      RecruitDetailData: this.props.route.params.data,
      height: 0
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
    } catch (error) {}

  }


  render() {
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
          title                 = {this.props.lang.RecruitInfo}
        />
        <Content>                  
          <Card>
            <CardItem>
            {
              (Platform.OS === "ios") ?
                <WebView
                  injectedJavaScript={BaseScript}
                  source={{ html: FixTinyText+this.state.RecruitDetailData }}
                  style={{
                    width: "100%",
                    height: this.state.height,
                    backgroundColor: 'transparent'
                  }}
                    javaScriptEnabled // 仅限Android平台。iOS平台JavaScript是默认开启的。
                    scrollEnabled={false}
                    onMessage={event => this.onMessage(event.nativeEvent.data) }
                />  
              :
                <WebView
                  injectedJavaScript={BaseScript}
                  source={{ html: FixTinyText+this.state.RecruitDetailData, baseUrl:'' }}
                  style={{
                    flex:0,
                    height: this.state.height,
                  }}
                  javaScriptEnabled // 仅限Android平台。iOS平台JavaScript是默认开启的。
                  domStorageEnabled // 适用于安卓
                  scrollEnabled={true}
                  onMessage={event => this.onMessage(event.nativeEvent.data) }
                  androidHardwareAccelerationDisabled = {true}
                />
            }
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}

export default connect(
  (state) => ({
    lang: state.Language.lang.RecruitDetailPage
  })
)(RecruitDetailPage);