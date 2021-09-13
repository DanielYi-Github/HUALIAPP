import React from 'react';
import { Alert, ImageBackground, Platform, Image} from 'react-native';
import { Container, Header, Content, Icon, Button, Left, Body, Right, Title, Text, Card, H3, connectStyle } from 'native-base';
import ImagePicker from 'react-native-image-picker';  // https://github.com/react-community/react-native-image-picker
import Lightbox    from 'react-native-lightbox';

// import ImgToBase64 from 'react-native-image-base64';  // https://www.npmjs.com/package/react-native-image-base64 //查詢手寫板是否需要移除
import PersonItem          from '../../components/PersonItem';
import MainPageBackground  from '../../components/MainPageBackground';
import HeaderForGeneral    from '../../components/HeaderForGeneral';
import * as SQLite         from '../../utils/SQLiteUtil';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';
import * as NavigationService   from '../../utils/NavigationService';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as UserInfoAction    from '../../redux/actions/UserInfoAction';

class MineDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showNoUserDataAlert: false,
      CarAdministrator: null
    }
  }

  componentDidMount(){
    //先去找通訊錄裡面有沒有你這個人 然後再決定顯示是否要跳出提醒視窗
    let user = this.props.state.UserInfo.UserInfo;
    SQLite.selectData(`select * from THF_CONTACT where status='Y' and EMPID=? `, [user.id]).then((result) => {
      // 是否有資料
      let isUser = result.length ? true : false;
      if (!isUser) {
        this.setState({
          showNoUserDataAlert:!isUser,
          // CarAdministrator: 
        });
          /*
        UpdateDataUtil.getCarAdministrator(user, this.props.state.Common.Companies_Contact.defaultCO).then((data)=>{
          // 是否顯示通訊錄資訊
          this.setState({
            showNoUserDataAlert:!isUser,
            CarAdministrator:data
          });
        }).catch((e)=>{
          this.setState({
            showNoUserDataAlert:!isUser,
            CarAdministrator: e
          });
        });
          */
      }
    });
  }

  render() {
    let user = this.props.state.UserInfo.UserInfo;
    let page = this.props.state.Language.lang.MineDetailPage;

    let renderScene = (route, navigator) => {
      return (
        <Image 
          source     ={user.picture} 
          style      ={{width: '100%', height:"100%"}} 
          resizeMode ={"contain"}
        />
      );
    };
    return(
      <Container>
        <MainPageBackground height={200}/>
        <HeaderForGeneral
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:"arrow-back"}}
          leftButtonOnPress     = {() =>NavigationService.goBack()} 
          isRightButtonIconShow = {false}
          rightButtonIcon       = {null}
          rightButtonOnPress    = {null} 
          title                 = {this.props.state.Language.lang.MineDetailPage.Title}
          isTransparent         = {true}
        />

        <Content contentContainerStyle={{alignItems: 'center'}}>
          <Lightbox 
            underlayColor="rgba(0,0,0,0)" 
            renderContent={renderScene} 
            springConfig={{ overshootClamping: true }}
            >
            <ImageBackground 
              source={user.picture} 
              style={[
                this.props.style.BigProfileImage,
                {
                  alignItems: 'flex-end', 
                  justifyContent: 'flex-end'
                }
              ]} 
              imageStyle={{ 
                borderRadius: this.props.style.BigProfileImage.height/2, 
                borderColor : this.props.style.BigProfileImageBorder,
                alignSelf   : 'center', 
                borderWidth : 5, 
              }}>
              <Button 
                rounded 
                onPress = {()=>{
                  Alert.alert(
                    page.Warning,
                    page.WarningContext,
                    [ {text: 'OK', onPress: () => this.goEditImage()}],
                    { cancelable: false }
                  )
                }}
                style={this.props.style.EditBigProfileImage}>
                  <Icon name="camera"/>
              </Button>
            </ImageBackground>
          </Lightbox>
        {/*

          */}
          <H3 style={{marginTop: 10, marginBottom: 5, color:this.props.style.dynamicTitleColor}}>{user.name}</H3>
          <Text style={{marginBottom: 10, color:this.props.style.dynamicTitleColor}}>{user.plantName}  {user.depName}</Text>

          <Card>
            <PersonItem 
              title    ={page.ADId}
              value    ={user.id}
              icon     ={"person"}
              isButton ={false}
              onPress  ={null}
            />

            {/*
            <PersonItem
              title    ={page.CellPhone}
              value    ={user.cellphone}
              icon     ={"phone-portrait"}
              isButton ={true}
              onPress  ={this.goEdit.bind( this,'cellphone', page.CellPhone, user.cellphone, "phone-pad" )}
            />
            */}

            <PersonItem
              title    ={page.Extension}
              value    ={user.telphone}
              icon     ={"call"}
              isButton ={true}
              onPress  ={this.goEdit.bind( this,'telphone', page.Extension, user.telphone, "phone-pad" )}
            />

            {/*
            <PersonItem
              title    ={"Skype"}
              value    ={user.skype}
              icon     ={"logo-skype"}
              isButton ={true}
              onPress  ={this.goEdit.bind( this,'skype', "Skype", user.skype, "default" )}
            />
            */}

            <PersonItem
              title    ={page.Mail}
              value    ={user.email}
              icon     ={"mail"}
              isButton ={true}
              onPress  ={this.goEdit.bind( this,'email', page.Mail, user.email, "email-address" )}
            />

          </Card>

          {
            this.state.showNoUserDataAlert ?
              <Body style={{width:"90%", marginTop: "5%", marginBottom: "7%"}}>
                <Text style={{fontWeight: 'bold', color:"#FF5252"}}>
                  {page.NoUserDataAlertTitle}
                </Text>
                  <Text style={{marginTop: 5, color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}}>
                    {page.NoUserDataAlertContent}

                    {/*
                    <Text style={{color:"#47ACF2", fontWeight: 'bold'}} onPress={this.goCarAdministrator}>
                      {" "+page.NoUserDataContactCarAdministrator}
                    </Text>
                    */}
                  </Text>

              </Body>
            :
              null
          }
        </Content>
      </Container>
    );
  }

  goEdit(id,title,context,editType){
    NavigationService.navigate( "MineDetailEdit", {
      id: id,
      title:title,
      context:context,
      editType:editType
    });
  }

  goEditImage = () => {
    var options = {
      title: this.props.state.Language.lang.MineDetailPage.ImageSelect,
      takePhotoButtonTitle: this.props.state.Language.lang.MineDetailPage.TakePhoto,
      chooseFromLibraryButtonTitle: this.props.state.Language.lang.MineDetailPage.FromLibrary,
      cancelButtonTitle: this.props.state.Language.lang.MineDetailPage.Cancel,
      maxHeight: 960,
      maxWidth: 1280,
      quality:0.4,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        // 上傳圖片
        // this.props.actions.updateUserdata(this.props.state.UserInfo.UserInfo, "picture", response.data);
        this.props.actions.updateUserImage(this.props.state.UserInfo.UserInfo, "picture", response.data);
      }
    });
  }

  goCarAdministrator = () => {
    SQLite.selectData(`select * from THF_CONTACT where status='Y' and NAME=? and CO=?`, [this.state.CarAdministrator.name, this.state.CarAdministrator.company]).then((result) => {
      if (result.length == 0) {
        let page = this.props.state.Language.lang.ContactDetailPage;
        Alert.alert(
          page.NoAdministratorTitle,
          page.NoAdministratorText,
          [
            { text: page.Comfirm, onPress: () =>{} },
          ],
          { cancelable: false }
        )
      } else {
        NavigationService.navigate("ContactDetail", {
          data: result.item(0),
        });
      }
    });
  }
}

export let ContactDetailPageStyle = connectStyle( 'Page.ContactDetailPage', {} )(MineDetailPage);

export default connect(
  (state) => ({
    state: { ...state }
  }),
  (dispatch) => ({
    actions: bindActionCreators(UserInfoAction, dispatch)
  })
)(ContactDetailPageStyle);