import React from 'react';
import { Linking, ImageBackground, Platform, Alert, Image, View, Dimensions} from 'react-native';
import { Container, Header, Content, Icon, Button, Left, Body, Right, Title, Text, Card, Fab, connectStyle } from 'native-base';
import Contacts   from 'react-native-contacts';  //From: https://segmentfault.com/a/1190000012083998
import ActionButton from 'react-native-action-button';
import Lightbox from 'react-native-lightbox';

import * as SQLite            from '../../../utils/SQLiteUtil';
import * as UpdateDataUtil    from '../../../utils/UpdateDataUtil';
import * as NavigationService from '../../../utils/NavigationService';
import MainPageBackground     from '../../../components/MainPageBackground';
import PersonItem             from '../../../components/PersonItem';
import WaterMarkView          from '../../../components/WaterMarkView';
import HeaderForGeneral       from '../../../components/HeaderForGeneral';

import { connect } from 'react-redux';

class ContactDetailPage extends React.Component {
  constructor(props) {
    super(props);

    let item = this.props.route.params.data;
    // 判斷該筆資料的圖片是否有值與圖片型態為何
    if (item.PICTURE == "" || item.PICTURE == null || typeof item.PICTURE == "number") {
      item.PICTURE = (item.SEX == "F") ? require("../../../image/user_f.png") : require("../../../image/user_m.png");
    } else {
      // 因可能重新渲染所以需在此處稍加判斷
      if (typeof item.PICTURE == "string") {
        item.PICTURE = (item.PICTURE.indexOf("http://") < 0) ? {
          uri: `data:image/png;base64,${item.PICTURE}`
        } : {
          uri: `${item.PICTURE}`
        }
      }
    }

    this.state = {
      fabActive:false,
      PICTURE:item.PICTURE
    }
  }

  render() {
    let user  = this.props.route.params.data;
    let page  = this.props.state.Language.lang.ContactDetailPage;
    let callPhoneButton;
    
    if(user.CELLPHONE){
      callPhoneButton = (
        <ActionButton.Item 
            buttonColor='#34A34F' 
            title={page.CallPhone} 
            onPress={this.callPhone.bind(this, `tel:${user.CELLPHONE}`)}
        >
          <Icon name="call" style={{fontSize: 20,height: 22,color: 'white'}} />
        </ActionButton.Item>
      );
    }

    let renderScene = (route, navigator) => {
      return (
        <Image 
          source     ={ this.state.PICTURE } 
          style      ={{width: '100%', height:"100%"}} 
          resizeMode ={"contain"}
        />
      );
    };

    let contactDetailPage = (
      <Container>
        <MainPageBackground height={200}/>
        <HeaderForGeneral
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:"arrow-back"}}
          leftButtonOnPress     = {() =>NavigationService.goBack()} 
          isRightButtonIconShow = {false}
          rightButtonIcon       = {null}
          rightButtonOnPress    = {null} 
          title                 = {this.props.state.Language.lang.HomePage.ContactDetail}
          isTransparent         = {true}
        />

        <Content contentContainerStyle={{alignItems: 'center'}}>
          <Lightbox 
            underlayColor="rgba(0,0,0,0)" 
            renderContent={renderScene} 
            springConfig={{ overshootClamping: true }}
            >
            <ImageBackground 
              source={ this.state.PICTURE } 
              style={this.props.style.BigProfileImage} 
              imageStyle={{ 
                borderRadius: this.props.style.BigProfileImage.height/2, 
                borderColor : this.props.style.BigProfileImageBorder,
                alignSelf: 'center', 
                borderWidth: 5, 
              }}>
            </ImageBackground>
          </Lightbox>

          <Title style={{marginTop: 10, marginBottom: 5, color:this.props.style.dynamicTitleColor}}>{user.NAME}{` ${user.JOBTITLE ? user.JOBTITLE: ''}`}</Title>
          <Text style={{marginBottom: 10, color:this.props.style.dynamicTitleColor}}>{user.CO}  {user.DEPNAME}</Text>

          <Card>
            <PersonItem 
              title    ={page.ADId}
              value    ={user.EMPID}
              icon     ={"person"}
              isButton ={false}
              onPress  ={null}
            />

            <PersonItem
              title    ={page.CellPhone}
              value    ={user.CELLPHONE}
              icon     ={"phone-portrait"}
              isButton ={null}
              onPress  ={null}
            />

            <PersonItem
              title    ={page.Extension}
              value    ={user.TELPHONE}
              icon     ={"call"}
              isButton ={null}
              onPress  ={null}
            />

          {/*
            <PersonItem
              title    ={"Skype"}
              value    ={user.SKYPE}
              icon     ={"logo-skype"}
              isButton ={null}
              onPress  ={null}
            />
            */}

            <PersonItem
              title    ={page.Mail}
              value    ={user.MAIL}
              icon     ={"mail"}
              isButton ={null}
              onPress  ={null}
            />
          </Card>
        </Content>
        <ActionButton  buttonColor="#5067FF" >
          {/*撥號按鍵*/}
          {callPhoneButton}
          
          {/*添加聯絡人按鍵*/}
          <ActionButton.Item 
            buttonColor='#DD5144' 
            title={page.AddContact} 
            onPress={this.addContactor.bind(this, user)}
          >
            <Icon name="person-add" style={{fontSize: 20,height: 22,color: 'white'}} />
          </ActionButton.Item>

          {/*資料錯誤回報按鍵*/}
          {/*
          <ActionButton.Item 
            buttonColor='#757575' 
            title={page.wrongInfo} 
            onPress={this.wrongInfoAlert.bind(this, user)}
          >
            <Icon name="warning" style={{fontSize: 20,height: 22,color: 'white'}} />
          </ActionButton.Item>
          */}
        </ActionButton>

      </Container>
    );

    return (
      <WaterMarkView 
        contentPage = {contactDetailPage} 
        pageId = {"ContactDetailPage"}
      />
    );

  }

  addContactor = (contactor) =>{
    var newPerson = {
      emailAddresses: [{
        label: "work",
        email: (contactor.MAIL !== null)? contactor.MAIL : "",
      }],
      phoneNumbers: [{
        label: "mobile",
        number: (contactor.CELLPHONE !== null)? contactor.CELLPHONE : "",
      }],
      familyName : (contactor.NAME !== null)? contactor.NAME : "",
      displayName: (contactor.NAME !== null)? contactor.NAME : "",   // for Android
      // givenName  : (contactor.NAME !== null)? contactor.NAME : "",
      // familyName: 'Jung',
      // givenName: 'Carl',
    };
    /*    
    var newPerson = {
      recordID: '6b2237ee0df85980',
      backTitle: '',
      company: '',
      emailAddresses: [{
        label: 'work',
        email: 'carl-jung@example.com',
      }],
      familyName: 'Jung',
      givenName: 'Carl',
      middleName: '',
      jobTitle: '',
      phoneNumbers: [{
        label: 'mobile',
        number: '(555) 555-5555',
      }],
      hasThumbnail: true,
      thumbnailPath: 'content://com.android.contacts/display_photo/3',
      postalAddresses: [{
        label: 'home',
        formattedAddress: '',
        street: '123 Fake Street',
        pobox: '',
        neighborhood: '',
        city: 'Sample City',
        region: 'CA',
        state: 'CA',
        postCode: '90210',
        country: 'USA',
      }],
      prefix: 'MR',
      suffix: '',
      department: '',
      birthday: {'year': 1988, 'month': 0, 'day': 1 },
      imAddresses: [
        { username: '0123456789', service: 'ICQ'},
        { username: 'johndoe123', service: 'Facebook'}
      ]
    };
    */
    Contacts.openContactForm(newPerson).then(contact => {
      // contact has been saved
    }).catch((e)=>{
      console.log("e", e);
    })
    
  }

  callPhone = (url) => {
    Linking.canOpenURL(url).then(supported => {
       if (!supported) {
        console.log('Can\'t handle url: ' + url);
       } else {
        return Linking.openURL(url);
       }
     }).catch(err => console.error('An error occurred', err));
  }

  wrongInfoAlert = () => {
    let page = this.props.state.Language.lang.ContactDetailPage;
    
    Alert.alert(
      page.wrongInfoAlertTitle,
      page.wrongInfoAlertContent,
      [
        { text: page.Cancel, onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: page.ContactMyProfile, onPress: () => this.goMyProfile() },
        { text: page.ContactCarAdministrator, onPress: () => this.goCarAdministrator() },
      ],
      { cancelable: false }
    )
  }

  /*新增郵件 暫時沒用到*/
  /*
  addEmail(){  }
  */

  goMyProfile = () => {
    NavigationService.navigate("MineDetail");
  }

  goCarAdministrator = () =>{
    let user = this.props.state.UserInfo.UserInfo;
    let company = this.props.route.params.data.CO;
    let page = this.props.state.Language.lang.ContactDetailPage;

    UpdateDataUtil.getCarAdministrator(user, company).then((data)=>{
      SQLite.selectData(`select * from THF_CONTACT where status='Y' and NAME=? and CO=?`, [data.name, data.company]).then((result) => {
        if (result.length==0) {
          Alert.alert(
            page.NoAdministratorTitle,
            page.NoAdministratorText,
            [
              { text: page.Comfirm, onPress: () =>{} },
            ],
            { cancelable: false }
          )
        }else{
          this.props.navigation.push("ContactDetail", {
            data: result.item(0)
          })
        }
      });
    });
  }

}

export let ContactDetailPageStyle = connectStyle( 'Page.ContactDetailPage', {} )(ContactDetailPage);

export default connect(
  (state) => ({
    state: {...state}
  })
)(ContactDetailPageStyle);