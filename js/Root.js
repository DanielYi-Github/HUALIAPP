import React, { Component } from 'react';
import { YellowBox } from 'react-native'; // 處理黃色警告視窗問題
import { Provider } from 'react-redux';
import Router from './Router';
import store from './redux/ConfigureStore';
import Toast from 'react-native-toast-message';

YellowBox.ignoreWarnings([
	'Warning: ...', 
	'Module RCTImageLoader',
	'Remote debugger',
	'VirtualizedLists ',
  'Warning: Failed prop type',
  'Remote debugger ',
  'Require cycle: ',
  'Warning: ',
  'Module RNRSAKeychain ',
  'Module RNRSA ',
  'Animated: ',
  'Animated.event ',
  'RCTBridge '
]);
  
export default class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router/>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </Provider>
    );
  }
}