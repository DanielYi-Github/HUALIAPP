import * as React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {ListItem, Container, Content, Header, Left, Body, Title, Right, CardItem, Icon, Footer, FooterTab, Button, Label, Text, connectStyle } from 'native-base';

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import HeaderForGeneral from './HeaderForGeneral'

class CustomDrawerContent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <Container>
          <HeaderForGeneral
            isLeftButtonIconShow  = {false}
            leftButtonIcon        = {null}
            leftButtonOnPress     = {null} 
            isRightButtonIconShow = {false}
            rightButtonIcon       = {null}
            rightButtonOnPress    = {null} 
            title                 = {this.props.lang.SideBar.GroupInfo}
          />
          <View style={{flex: 1}}>
          <DrawerItemList {...this.props} />
          </View>
          <Footer style={{justifyContent: 'flex-end'}}>
            <FooterTab>
              <Body>
                <Label style={{fontSize:10}}>Zhijie Footwear Technical Service Co., Ltd</Label>
                <Label style={{fontSize:10}}>Copyright ©2019 All rights reserved</Label>
              </Body>
            </FooterTab>
          </Footer>
        </Container>
    );
  }
}

export default connectStyle( 'Component.InputWithoutCardBackground', {} )(CustomDrawerContent);