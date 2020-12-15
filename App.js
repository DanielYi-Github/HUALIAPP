
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component, useCallback, memo} from 'react';
import {
  ScrollView,
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  NativeModules,
  ToastAndroid
} from 'react-native';
import SplashScreen           from 'react-native-splash-screen';
import { Root, Container, Content, Text, Icon, connectStyle, Title, Card, CardItem, Body, Button, Toast} from 'native-base';




export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'constant',
      asyncdeviceinfo: {},
    };
    SplashScreen.hide();

  }

  render() {
    return (
      <Root>
        <View style={styles.container}>
          <Button onPress={()=>{
            ToastAndroid.showWithGravityAndOffset(
      "shot the fuck out.",
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      25,
      50
    );
          }}>
            <Text>Toast</Text>
          </Button>
          <Text>
            12345
          </Text>
        </View>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'left',
    color: '#333333',
    margin: 5,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopColor: '#333333',
    borderTopWidth: 1,
  },
  tab: {
    height: 50,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    color: '#333333',
  },
  boldText: {
    fontWeight: '700',
  },
});