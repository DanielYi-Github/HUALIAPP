import React from 'react';
import { Platform} from 'react-native';
import { Container, Header, Left, Content, Body, Right, Item, Input, Button, Icon, Title, Text, Form, Label, Spinner, connectStyle } from 'native-base';
import HeaderForGeneral  from '../../components/HeaderForGeneral';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';
import ToastUnit from '../../utils/ToastUnit';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as SubmitAction from '../../redux/actions/SubmitAction';

class ContactUsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name:'',
      phone:'',
      mail:'',
      context:'',
      isSubmitting:false
    }
  }

  render() {
    return(
      <Container>
        <HeaderForGeneral
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:"menu"}}
          leftButtonOnPress     = {() =>this.props.navigation.toggleDrawer()} 
          isRightButtonIconShow = {false}
          rightButtonIcon       = {null}
          rightButtonOnPress    = {null} 
          title                 = {this.props.Language.ContactUs}
        />
        <Content contentContainerStyle={{paddingTop: 20, paddingLeft:"5%", paddingRight:"5%"}}>
            <Form>
              <Body style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
                <Icon name="person" style={{color:this.props.style.inputWithoutCardBg.inputColor}}/>
                <Label style={{marginLeft: 5, color:this.props.style.inputWithoutCardBg.inputColor}}>{this.props.Language.YourName}</Label>
              </Body>
              <Item style= {{marginLeft: 0}}>
                <Input 
                  placeholder           = {this.props.Language.Name}
                  placeholderTextColor  = {this.props.style.inputWithoutCardBg.inputColorPlaceholder}
                  onChangeText          = {(text)=>{ this.setState({ name:text }); }}
                  style                 = {{color:this.props.style.inputWithoutCardBg.inputColor}}
                  value={this.state.name}
                />
              </Item>
              <Body style={{flexDirection: 'row', alignSelf: 'flex-start', paddingTop: 20}}>
                <Icon name="at" style={{color:this.props.style.inputWithoutCardBg.inputColor}}/>
                <Label style={{marginLeft: 5, color:this.props.style.inputWithoutCardBg.inputColor}}>{this.props.Language.ContactWay}</Label>
              </Body>
              <Item style= {{marginLeft: 0}}>
                <Input 
                  placeholder           = {this.props.Language.Mail}
                  placeholderTextColor  = {this.props.style.inputWithoutCardBg.inputColorPlaceholder}
                  textContentType       = {"emailAddress"}
                  onChangeText          = {(text)=>{ this.setState({ mail:text }); }}
                  style                 = {{color:this.props.style.inputWithoutCardBg.inputColor}}
                  value={this.state.mail}
                />
              </Item>
              <Item style= {{marginLeft: 0}}>
                <Input 
                  placeholder           = {this.props.Language.TelIsNull}
                  placeholderTextColor  = {this.props.style.inputWithoutCardBg.inputColorPlaceholder}
                  textContentType       = {"telephoneNumber"}
                  onChangeText          = {(text)=>{ this.setState({ phone:text }); }}
                  style                 = {{color:this.props.style.inputWithoutCardBg.inputColor}}
                  value={this.state.phone}
                />
              </Item>

              <Body style={{flexDirection: 'row', alignSelf: 'flex-start', paddingTop: 20}}>
                <Icon name="create" style={{color:this.props.style.inputWithoutCardBg.inputColor}}/>
                <Label style={{marginLeft: 5, color:this.props.style.inputWithoutCardBg.inputColor}}>{this.props.Language.Content}</Label>
              </Body>
              <Item style= {{marginLeft: 0}}>
                <Input 
                  style= {{textAlignVertical: 'top' }} 
                  placeholder  = {this.props.Language.WriteQuestion}
                  placeholderTextColor  = {this.props.style.inputWithoutCardBg.inputColorPlaceholder}
                  onChangeText = {(text)=>{ this.setState({ context:text }); }}
                  multiline    = {true}
                  style        = {{color:this.props.style.inputWithoutCardBg.inputColor}}
                  value={this.state.context}
                />
              </Item>
            </Form>
            <Button block info
              style={{
                width:"100%", 
                marginTop:35,
              }} 
              disabled = {this.state.isSubmitting}
              onPress = {this.confirm.bind(this)} >
              {
                (this.state.isSubmitting) ?
                  <Spinner color='white'/>
                :
                  <Text>{this.props.Language.Submit}</Text>
              }
            </Button>
        </Content>
      </Container>
    );
  }

  confirm = () => {
    //值不能為空
    if (!this.state.name || this.state.name.replace(/[\r\n]/g,"").replace(/^[\s　]+|[\s　]+$/g, "").length == 0) {
      ToastUnit.show('error', this.props.Language.WrongNameMsg);
    }else if(!this.state.mail || this.state.mail.replace(/[\r\n]/g,"").replace(/^[\s　]+|[\s　]+$/g, "").length == 0){
      ToastUnit.show('error', this.props.Language.WrongMailMsg);
    }else if(!this.state.context || this.state.context.replace(/[\r\n]/g,"").replace(/^[\s　]+|[\s　]+$/g, "").length == 0){
      ToastUnit.show('error', this.props.Language.NoEmpty);
    }else{
      this.setState({
        isSubmitting:true
      });
      UpdateDataUtil.setFeedBackByPublic(
        this.state.name, 
        this.state.context,
        `${this.state.mail},${this.state.phone}`
      ).then((result)=>{
        ToastUnit.show('info', this.props.Language.sucessMsg1);
        this.setState({
          name   :'',
          phone  :'',
          mail   :'',
          context:'',
          isSubmitting:false
        });
      }).catch((e)=>{
        ToastUnit.show('error', this.props.Language.ErrorMsg);
        this.setState({
          isSubmitting:false
        });
      })
    }
  }
}

export let ContactUsPageStyle = connectStyle( 'Component.InputWithoutCardBackground', {} )(ContactUsPage);

export default connect(
  (state) => ({
    Submit  : state.Submit,
    UserInfo: state.UserInfo,
    Language: state.Language.lang.ContactUsPage,
    PageTitle: state.Language.lang.MinePage.advices
  }),
  (dispatch) => ({
    actions: bindActionCreators(SubmitAction, dispatch)
  })
)(ContactUsPageStyle);
