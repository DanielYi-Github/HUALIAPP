import React from 'react';
import { View, Image, ActivityIndicator, Platform, NativeModules, Alert} from 'react-native';
import { Container, Header, Left, Content, Body, Right, Button, Icon, Title, Text, Card, CardItem, connectStyle } from 'native-base';
import DateFormat from  'dateformat'; //  https://www.npmjs.com/package/dateformat
import { connect } from 'react-redux'; 
import HeaderForGeneral       from '../../components/HeaderForGeneral';
import MainPageBackground     from '../../components/MainPageBackground';
import * as NavigationService from '../../utils/NavigationService';
import * as DeviceInfo        from '../../utils/DeviceInfoUtil';
import * as SQLite            from '../../utils/SQLiteUtil';
import * as UpdateDataUtil    from '../../utils/UpdateDataUtil';
import ToastUnit              from '../../utils/ToastUnit';


class AboutPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      version            : DeviceInfo.getVersion(), //目前的版本,
      checking           : false,
    };
  }

  //大版本檢查更新
  checkBigUpdate = async () => {
    this.setState({ checking:true });

    let {lang} = this.props.state.Language;

    //查詢最新版本
    let sql = "select * from THF_VERSION where TYPE='D' and PLATFORM='A' and ISLATEST='Y'";
    if(Platform.OS === "android"){
      sql = "select * from THF_VERSION where TYPE='D' and PLATFORM='A' and ISLATEST='Y'";
    }else if(Platform.OS === "ios"){
      sql = "select * from THF_VERSION where TYPE='D' and PLATFORM='I' and ISLATEST='Y'";
    }
    
    try{
      await UpdateDataUtil.updateVersion();

      SQLite.selectData(sql,[]).then((data)=>{
        if(data.length>0){
          let nVersion = data.item(0).NO;
          let url      = data.item(0).URL;
          let isMust   = data.item(0).ISMUST;

          if(this.state.version<nVersion){
            this.setState({ checking:false });
            //表示要進行更新
            if (isMust=='Y') {
              Alert.alert(
                lang.InitialPage.FindNewPatch,        //檢查到有新的版本
                lang.InitialPage.FindNewPatchInfo,    //重大版本更新，請下載安裝!
                [
                  {text: lang.InitialPage.Update, onPress: () => {   //更新
                    this.doBigUpdate(url); 
                  }},
                ],
                { cancelable: false }
              )
            } else {
              Alert.alert(
                lang.InitialPage.FindNewPatch,
                lang.InitialPage.FindNewPatchIsInstallInfo,    //是否進行下載安裝!
                [
                  {text: lang.InitialPage.IgnoreUpdate, onPress: () => {console.log(null);}}, //稍後再說
                  {text: lang.InitialPage.Update, onPress: () => {               //更新
                    this.doBigUpdate(url);
                  }},
                ],
                { cancelable: false }
              )
            }
          }else{
            ToastUnit.show(null, lang.AboutPage.NowNewPatch);
            this.setState({ checking:false });
          }
        }else{
          ToastUnit.show(null, lang.AboutPage.NowNewPatch);
          this.setState({ checking:false });
        }
      }).catch((errpr)=>{
        console.log("查詢TH_VERSION失敗");
        console.log(errpr);
        this.setState({ checking:false });
      });

    }catch(e){
      ToastUnit.show(null, lang.AboutPage.CheckFail);
      this.setState({ checking:false });
      return;
    }
  }

  //大版本更新 android 下載 ios 導向 app store
  doBigUpdate(url){
    if(Platform.OS === "android"){
      //如果url是空的
      if(url=="") return null;
      //下載安裝檔
      NativeModules.upgrade.upgrade(url);
      
    }else if(Platform.OS === "ios"){
      //開啟APP store  AppId = 上架的APPID
      // NativeModules.upgrade.openAPPStore('AppId');
      NativeModules.upgrade.openAPPStore(url);
    }
  }

  render() {
    let {lang} = this.props.state.Language;

    return(
      <Container>
        <MainPageBackground height={null}/>
        <HeaderForGeneral
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:"arrow-back"}}
          leftButtonOnPress     = {() =>NavigationService.goBack()} 
          isRightButtonIconShow = {false}
          rightButtonIcon       = {null}
          rightButtonOnPress    = {null} 
          title                 = {this.props.state.Language.lang.MinePage.about}
          isTransparent         = {false}
        />
        <Content contentContainerStyle={{paddingTop: '7%', flex: 1}}>
          <Body style={{flex:1, justifyContent: 'space-around' }}>
            <Body style={{flex:0}}>
              <Title style={this.props.style.ExplainText}>V{this.state.version}</Title>
              <Title style={this.props.style.ExplainText}>{lang.AboutPage.Recommend}</Title>
              <Image source={require('../../image/QRcode.png')} style={{height: 200,width: 200}} />
            </Body>

            <Body style={{flex:0}}>
              <Card>
                <CardItem button onPress={()=>{ 
                  // NavigationService.navigate("Operation"); 
                  NavigationService.navigate("ViewFile",{
                    url: "data/getSOP",
                    content:{},
                    pageTtile:lang.MinePage.operationManual
                  }); 
                }}>
                  <Left>
                    <Text>{lang.MinePage.operationManual}</Text>
                  </Left>
                  <Right style={{flex: 0}}>
                    <Icon name="arrow-forward"/>
                  </Right>
                </CardItem>
              </Card>  

              { this.props.state.Common.enable_APP_SurveySOP ? 
                  <Card>
                    <CardItem button onPress={()=>{ 
                      NavigationService.navigate("ViewFile",{
                        url: "data/getSurveySOP",
                        content:{},
                        pageTtile:lang.MinePage.operationManualCovid19
                      }); 
                    }}>
                      <Left>
                        <Text>{lang.MinePage.operationManualCovid19}</Text>
                      </Left>
                      <Right style={{flex: 0}}>
                        <Icon name="arrow-forward"/>
                      </Right>
                    </CardItem>
                  </Card> 
                :
                  null
              }
               
            </Body>

              {/*
                <Card>

                  <CardItem button onPress={this.checkBigUpdate}>
                    <Left style={{justifyContent: 'center'}}>
                      <Icon name="update" type="MaterialIcons"/>
                    </Left>
                    <Body style={{flex: 6, flexDirection: 'row'}}>
                        {
                          (this.state.checking)?
                            <ActivityIndicator size="large" color="#3691ec"/>
                          :
                            <Title>{lang.AboutPage.UpdateCheck}</Title>
                        }
                    </Body>
                    <Right style={{flex: 0}}>
                      <Icon name="arrow-forward"/>
                    </Right>
                  </CardItem>
                {/*
                  <CardItem button style={Styles.Transparent} 
                    // onPress={this.checkBigUpdate}
                    >
                    <Left style={{justifyContent: 'center'}}>
                      <Icon name="help-circle" style={{color: '#485970'}}/>
                    </Left>
                    <Body style={{flex: 6, flexDirection: 'row'}}>
                        <Title style={{color: '#485970'}}>{lang.AboutPage.Instruction}</Title>
                    </Body>
                    <Right style={{flex: 0}}>
                      <Icon name="arrow-forward"/>
                    </Right>
                  </CardItem>
                </Card>
               */}
            <Title style={this.props.style.ExplainText}>@{DateFormat(new Date(), "yyyy")} Huali-group.com</Title>
          </Body>
        </Content>
      </Container>
    )
  }
}
export let MinePageStyle = connectStyle( 'Page.MinePage', {} )(AboutPage);

export default connect(
  (state) => ({
    state: {...state}
  })
)(MinePageStyle);