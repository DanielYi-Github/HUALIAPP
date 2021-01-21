import React from 'react';
import { Container} from 'native-base';
import HeaderForGeneral  from '../../../components/HeaderForGeneral';
import { WebView } from 'react-native-webview';
import  * as  NavigationService            from '../../../utils/NavigationService';
import { connect } from 'react-redux';
import * as UpdateDataUtil from '../../../utils/UpdateDataUtil';


class SurroundingInfoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url:""
    }
  }

  componentDidMount() {
       this.loadUrl();
  }

  loadUrl = () =>{
    let user = this.props.state.UserInfo.UserInfo;
    let content= "SurroundingInfo";
    UpdateDataUtil.getWebViewUrlFromParam(user,content).then(async (data)=>{
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
          title                 = {this.props.state.Language.lang.SurroundingInfoPage.SurroundingInfoTitle}
          isTransparent         = {false}
        />
        <WebView
          originWhitelist={['*']}
          // source={{ uri: 'https://ugc.map.baidu.com/cube/ncp/homepage?from=dasouyiqing' }}
          source={{ uri: this.state.url }}
          injectedJavaScript='window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight)'
        />
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
)(SurroundingInfoPage);