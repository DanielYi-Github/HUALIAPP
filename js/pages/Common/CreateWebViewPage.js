import React from 'react';
import { Container} from 'native-base';
import HeaderForGeneral  from '../../components/HeaderForGeneral';
import { WebView } from 'react-native-webview';
import  * as  NavigationService            from '../../utils/NavigationService';
import { connect } from 'react-redux';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';


class CreateWebViewPage extends React.Component {
  constructor(props) {
    super(props);
    console.log("sssss",this.props.route.params);
    this.state = {
      url:null
    }
    console.log("111");

  }

  componentDidMount() {
    console.log("2222");

       this.loadUrl();
       console.log("5555");
    }

  loadUrl = () =>{
    let user = this.props.state.UserInfo.UserInfo;
    console.log("3333");

    let urlParam=this.props.route.params.WebViewID.replace("WebView", "Url");
       console.log("4444");
       console.log("????",urlParam);
    // let content= "InTimeDataUrl";
    UpdateDataUtil.getWebViewUrlFromParam(user,urlParam).then(async (data)=>{
        this.setState({
            url: data
        });
    }).catch((e)=>{
        console.log("getItineraryCardUrl獲取異常",e);
    }); 
  }

  render() {
       console.log("6666");
       console.log("我来自CreateWebViewPage",this.state.url);
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
          title                 = {this.props.state.Language.lang.InTimeDataPage.InTimeDataTitle}
          isTransparent         = {false}
        />
        {(this.state.url)?
            <WebView
                originWhitelist={['*']}
                // source={{ uri: 'https://voice.baidu.com/act/newpneumonia/newpneumonia/?from=osari_aladin_banner' }}
                source={{ uri: this.state.url }}
                injectedJavaScript='window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight)'
            />
            :
            null
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