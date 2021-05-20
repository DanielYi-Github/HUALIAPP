import React from 'react';
import { Platform} from 'react-native';
import { Container, Header, Left, Content, Body, Right, Item, Input, Button, Icon, Title, Text, Form, Label, Spinner, connectStyle } from 'native-base';
import * as NavigationService from '../../utils/NavigationService';
import ToastUnit              from '../../utils/ToastUnit';
import HeaderForGeneral    from '../../components/HeaderForGeneral';
import MainPageBackground        from '../../components/MainPageBackground';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as SubmitAction from '../../redux/actions/SubmitAction';

class AdvicesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      context:'',
      contact:'',
    }
  }

  componentDidUpdate(prevProps, prevState){
    if (prevProps.Submit.isSubmitting != this.props.Submit.isSubmitting && !this.props.Submit.isSubmitting) {
      if (this.props.Submit.isSuccess) {
        NavigationService.goBack();
        ToastUnit.show('success', this.props.Language.Response);
      } else {
        ToastUnit.show('error', this.props.Language.Fail);
      }
    }
  }

  render() {
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
          title                 = {this.props.PageTitle}
          isTransparent         = {false}
        />
        <Content contentContainerStyle={{paddingTop: 35, paddingLeft:"5%", paddingRight:"5%"}}>
            <Form>
              <Body style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
                <Icon type="MaterialIcons" name="feedback" style={{color:this.props.style.inputWithoutCardBg.inputColor}}/>
                <Label style={{marginLeft: 5, color:this.props.style.inputWithoutCardBg.inputColor}}>{this.props.Language.Advices}</Label>
              </Body>
              <Item style= {{marginLeft: 0}}>
                <Input 
                  placeholder  = {this.props.Language.AdvicesMessage}
                  onChangeText = {(text)=>{ this.setState({ context:text }); }}
                  placeholderTextColor  = {this.props.style.inputWithoutCardBg.inputColorPlaceholder}
                  multiline    = {true}
                  style={{color:this.props.style.inputWithoutCardBg.inputColor}}
                />
              </Item>

              <Body style={{flexDirection: 'row', alignSelf: 'flex-start', paddingTop: 20}}>
                <Icon type="MaterialIcons" name="contact-mail" style={{color:this.props.style.inputWithoutCardBg.inputColor}}/>
                <Label style={{marginLeft: 5, color:this.props.style.inputWithoutCardBg.inputColor}}>{this.props.Language.ContactInfo}</Label>
              </Body>
              <Item style= {{marginLeft: 0}}>
                <Input 
                  placeholder  = {this.props.Language.ContactInfoMsg}
                  placeholderTextColor  = {this.props.style.inputWithoutCardBg.inputColorPlaceholder}
                  onChangeText = {(text)=>{ this.setState({ contact:text }); }}
                  style={{color:this.props.style.inputWithoutCardBg.inputColor}}
                />
              </Item>
            </Form>

            <Button block info 
              style={{width:"70%", alignSelf: 'center', marginTop:35}} 
              onPress = {this.confirm.bind(this)} >
              {
                (this.props.Submit.isSubmitting) ?
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
    if (!this.state.context || this.isNull(this.state.context) ) {
      ToastUnit.show('error', this.props.Language.AlertAdvicesMessage);
    } 
    else if(!this.state.contact || this.isNull(this.state.contact) ) {
      ToastUnit.show('error', this.props.Language.AlertContactInfoMsg);
    }
    else{
      this.props.actions.submitAdvices(this.props.UserInfo.UserInfo, this.state.context, this.state.contact);
    }
  }

  isNull( str ){
    if ( str == "" ) return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
  }
}

export let AdvicesPageStyle = connectStyle( 'Component.InputWithoutCardBackground', {} )(AdvicesPage);

export default connect(
  (state) => ({
    Submit  : state.Submit,
    UserInfo: state.UserInfo,
    Language: state.Language.lang.AdvicesPage,
    PageTitle: state.Language.lang.MinePage.advices
  }),
  (dispatch) => ({
    actions: bindActionCreators(SubmitAction, dispatch)
  })
)(AdvicesPageStyle);
