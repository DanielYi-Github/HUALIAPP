import React from 'react';
import { Keyboard, Platform, Alert } from 'react-native';
import { Container, Header, Left, Content, Body, Right, Item, Input, Button, Icon, Title, Text, Form, Label, Spinner, connectStyle } from 'native-base';
import * as NavigationService from '../../utils/NavigationService';
import HeaderForGeneral  from '../../components/HeaderForGeneral';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as UserInfoAction from '../../redux/actions/UserInfoAction';
import * as LoginAction    from '../../redux/actions/LoginAction';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';
import ToastUnit           from '../../utils/ToastUnit';

class MineDetailEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id      :this.props.route.params.id,
      title   :this.props.route.params.title,
      context :this.props.route.params.context,
      editType:this.props.route.params.editType,
    }
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.state.UserInfo.isRefreshing != this.props.state.UserInfo.isRefreshing) {
      if (!this.props.state.UserInfo.isRefreshing) {
        if (this.props.state.UserInfo.isSuccess) {
          NavigationService.goBack();
          ToastUnit.show('success', this.props.state.Language.lang.MineDetailEditPage.EditSuccess);
        } else {
          ToastUnit.show('error', this.props.state.Language.lang.MineDetailEditPage.EditFail);
        }
      }
    }
  }

  render() {
    return(
      <Container>
        <HeaderForGeneral
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:"arrow-back"}}
          leftButtonOnPress     = {() =>NavigationService.goBack()} 
          isRightButtonIconShow = {false}
          rightButtonIcon       = {null}
          rightButtonOnPress    = {null} 
          title                 = {this.props.state.Language.lang.MineDetailPage.Title}
          isTransparent         = {false}
        />

        <Content>
          <Form style={{marginTop: 1, marginRight: 20}}>
            <Item floatingLabel>
              <Label style={{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}}>{this.state.title}</Label>
              <Input 
                ref           = {(input) => { this.input = input }}
                autoFocus     = {true}
                value         = {this.state.context}
                keyboardType  = {this.state.editType}
                onChangeText  = {(text)=>{ this.setState({ context:text }); }}
                returnKeyType = "done"
                style         = {{color:this.props.style.inputWithoutCardBg.inputColor}}
              />
            </Item>
          </Form>

          <Button block info 
            style={{width:"70%", alignSelf: 'center', marginTop:20}} 
            onPress = {this.confirm.bind(this)} >
            {
              (this.props.state.UserInfo.isRefreshing) ?
                <Spinner color='white'/>
              :
                <Text>{this.props.state.Language.lang.MineDetailEditPage.Save}</Text>
            }
          </Button>
        </Content>
      </Container>
    );
  }

  async confirm(){
    //值不能為空
    if (!this.state.context) {
      Alert.alert(
        this.props.state.Language.lang.MineDetailEditPage.Alert,
        this.props.state.Language.lang.MineDetailEditPage.Message,
         [
           {text: 'OK', onPress: () => console.log('Cancel Pressed')},
         ],
       );
    } else {
      Keyboard.dismiss();
      let id      = this.state.id;
      let context = this.state.context;
      let user    = this.props.state.UserInfo.UserInfo;
      this.props.actions.updateUserdata(user, id, context);
    }
  }
}

export let MineDetailEditPageStyle = connectStyle( 'Component.InputWithoutCardBackground', {} )(MineDetailEditPage);

export default connect(
  (state) => ({
    state: {...state}
  }),
  (dispatch) => ({
    actions: bindActionCreators({...UserInfoAction,...LoginAction}, dispatch)
  })
)(MineDetailEditPageStyle);
