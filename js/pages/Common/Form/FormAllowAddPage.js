import React from 'react';
import { View, FlatList, RefreshControl, VirtualizedList, Platform, Alert, Keyboard, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Content, Body, Right, Item, Input, Button, Icon, Title, Text, Card, CardItem, Label, Toast, connectStyle} from 'native-base';
import { tify, sify} from 'chinese-conv'; 
import { connect }   from 'react-redux';
import TagInput      from 'react-native-tags-input';
import FormInputContent       from '../../../components/Form/FormInputContent';
import HeaderForGeneral       from '../../../components/HeaderForGeneral';
import * as UpdateDataUtil    from '../../../utils/UpdateDataUtil';
import * as NavigationService from '../../../utils/NavigationService';
import FormUnit               from '../../../utils/FormUnit';


class FormAllowAddPage extends React.Component {
  constructor(props) {
    super(props);

    // 處理加會簽的選項
    let paramList = [], defaultvalue = null;;
    let allowAdd = this.props.route.params.data;
    if(allowAdd.allowAddAnnounce){
      paramList.push({
        paramcode: "AddParallelAnnounce",
        paramname: this.props.state.Language.lang.FormSign.AddParallelAnnounce, //分會
      });
      paramList.push({
        paramcode: "AddSequentialAnnounce",
        paramname: this.props.state.Language.lang.FormSign.AddSequentialAnnounce, //串會
      });
      defaultvalue = "AddParallelAnnounce";
    }
    if(allowAdd.allowAddSign){
      paramList.push({
        paramcode: "AddSequentialSign",
        paramname: this.props.state.Language.lang.FormSign.AddSequentialSign, //串簽
      });
      defaultvalue = defaultvalue ? defaultvalue : "AddSequentialSign";
    }

    this.state = {
      sendValueBack     :this.props.route.params.onPress,       // 將直傳回上一個物件,
      allowAddText   :{
        columntype: "txt",
        component: {
          name: this.props.state.Language.lang.FormSign.AddSignTitle, //加會簽主旨
          id: ""
        },
        defaultvalue: "",
        isedit: "Y",
        paramList: null
      },
      allowAddcbo   :{
        columntype: "cbo",
        component: {
          name: this.props.state.Language.lang.FormSign.AddSignType, // 加會簽種類
          id: "cboApporveLevel"
        },
        defaultvalue: defaultvalue,
        isedit: "Y",
        paramList: paramList
      },
      allowAddchkwithaction: null
    };
  }

  componentDidMount() {
    let formContextChkwithaction = { 
      action            : "action/createpro/getBPMMember",
      actionColumn      : [],
      actionValue       : null,
      columnaction      : null,
      columnactionColumn: [],
      columntype        : "chkwithaction",
      component: {
        name: this.props.state.Language.lang.FormSign.AddSignPerson, // 選擇對象
        id: ""
      },
      defaultvalue : [],
      isedit       : "Y",
      listComponent: null,
      paramList    : null,
      required     : "F",
    };

    // 取得該欄位的動作
    FormUnit.getActionValue(this.props.state.UserInfo.UserInfo, formContextChkwithaction).then((result)=>{
      formContextChkwithaction.actionValue = result;
      this.setState({
        allowAddchkwithaction:formContextChkwithaction
      });
    }); 
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
          title                 = {this.props.state.Language.lang.FormSign.AddSign}
          isTransparent         = {false}
        />

        <View style={{backgroundColor: this.props.style.InputFieldBackground, marginTop: 20, alignItems: 'center'}}>
          <FormInputContent 
            data     ={this.state.allowAddText} 
            onPress  ={this.updateAllowAddContent}
            editable ={true}
            lang     ={this.props.state.Language.lang}
            user     ={this.props.state.UserInfo.UserInfo}
          />
        </View>

        <View style={{backgroundColor: this.props.style.InputFieldBackground, marginTop: 20, alignItems: 'center'}}>
          <FormInputContent 
            data     ={this.state.allowAddcbo} 
            onPress  ={this.updateAllowAddContent}
            editable ={true}
            lang     ={this.props.state.Language.lang}
            user     ={this.props.state.UserInfo.UserInfo}
          />
        </View>

        {
          (this.state.allowAddchkwithaction) ? 
          <View style={{backgroundColor: "rgba(0,0,0,0)", marginTop: 20, alignItems: 'center', flex:1}}>
            <FormInputContent 
              data     ={this.state.allowAddchkwithaction} 
              onPress  ={this.updateAllowAddContent}
              editable ={true}
              lang     ={this.props.state.Language.lang}
              user     ={this.props.state.UserInfo.UserInfo}
            />
          </View>
          :
          null  
        }

        <View style={{flex: 0.35}}>
          <Button 
            onPress = {this.comfirm} 
            style   = {{
              backgroundColor: '#20b11d', 
              marginTop      : 50,
              width          : '95%',
              borderRadius   : 5,
              justifyContent : 'center',
              alignSelf      : "center",
            }}>
              <Text>
                {this.props.state.Language.lang.FormSign.Comfirm}
              </Text>
          </Button>
        </View>

      </Container>
    );
  }

  updateAllowAddContent = (value, item) => {
    item.defaultvalue = value;
    this.setState({
      allowAddContent:item
    });
  }

  comfirm = () => {
    let confirm = true;
    if(this.state.allowAddText.defaultvalue.replace(/[\r\n]/g,"").replace(/^[\s　]+|[\s　]+$/g, "").length == 0){
      confirm = false;
      alert(this.props.state.Language.lang.FormSign.PleaseAddSignTitle); // 請填寫加會簽主旨  //內容不能為空
    }
    this.state.allowAddText.isedit = "N";
    if(this.state.allowAddcbo.defaultvalue == null){
      confirm = false;
      alert(this.props.state.Language.lang.FormSign.PleaseAddSignType); // 請選擇加會簽種類  //內容不能為空
    }
    this.state.allowAddcbo.isedit = "N";

    if(this.state.allowAddchkwithaction.defaultvalue.length == 0){
      confirm = false;
      alert(this.props.state.Language.lang.FormSign.PleaseAddSignPerson); // 請選擇加會簽對象  //內容不能為空
    }
    this.state.allowAddchkwithaction.isedit = "N";

    if(confirm){
      this.state.sendValueBack(
        this.state.allowAddText,
        this.state.allowAddcbo,
        this.state.allowAddchkwithaction
      );
      NavigationService.goBack()
    }
  }

}

export let FormAllowAddPageStyle = connectStyle( 'Page.FormPage', {} )(FormAllowAddPage);

export default connect(
  (state) => ({
    state: {...state}
  })
)(FormAllowAddPageStyle);