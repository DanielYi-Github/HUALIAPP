import React from 'react';
import { View } from 'react-native';
import { Container, Content} from 'native-base';
import HeaderForGeneral  from '../../../components/HeaderForGeneral';
import { WebView } from 'react-native-webview';
import  * as  NavigationService            from '../../../utils/NavigationService';
import { connect } from 'react-redux';
import * as UpdateDataUtil from '../../../utils/UpdateDataUtil';


class ItineraryCardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webViewHeight: 0,
      url:""
    }
  }

  componentDidMount() {
       this.loadUrl();
  }

  loadUrl = () =>{
    let user = this.props.state.UserInfo.UserInfo;
    UpdateDataUtil.getItineraryCardUrl(user).then(async (data)=>{
        this.setState({
            url: data
        });
    }).catch((e)=>{
        console.log("getItineraryCardUrl獲取異常",e);
    }); 

  }

  onWebViewMessage = (event) => {
    this.setState({ webViewHeight: Number(event.nativeEvent.data) });
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
          title                 = {this.props.state.Language.lang.ItineraryCardPage.ItineraryCardTitle}
          isTransparent         = {false}
        />
        <Content> 
          <View style={{ padding:5  ,flex: 1 }}>
            <View style={{ height: this.state.webViewHeight }}>
              <WebView
                originWhitelist={['*']}
                // source={{ uri: 'https://xc.caict.ac.cn' }}
                source={{ uri: this.state.url }}
                injectedJavaScript='window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight)'
                onMessage={this.onWebViewMessage}
              />
            </View>
          </View>
        </Content> 
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
)(ItineraryCardPage);