import React, { Component } from 'react';
import { YellowBox, LogBox } from 'react-native'; // 處理黃色警告視窗問題
import { Provider } from 'react-redux';
import Router from './Router';
import store from './redux/ConfigureStore';
// import Toast from 'react-native-toast-message';
import Toast from './components/CustomToast';
import ToastUnit from './utils/ToastUnit';
import {
  GestureHandlerRootView,
  RectButton,
} from 'react-native-gesture-handler';

LogBox.ignoreLogs([
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
  'RCTBridge ',
  'Non-serializable values were found in the navigation state. Check:'
]);
  
export default class Root extends React.Component {
  render() {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <Router/>
        <Toast 
          ref={(ref) => Toast.setRef(ref)} 
          config={ToastUnit.toastConfig} 
        />
      </Provider>
      </GestureHandlerRootView>
    );
  }
}