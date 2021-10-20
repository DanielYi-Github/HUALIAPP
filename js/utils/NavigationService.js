import * as React from 'react';

export const navigationRef = React.createRef();
import { StackActions } from '@react-navigation/native';

export function navigate(routeName, params) {
  navigationRef.current?.navigate(routeName, params);
}

export function push(routeName, params){
	navigationRef.current.dispatch(StackActions.push(routeName, params));
}

export function goBack(){
  navigationRef.current.goBack();
}

export function goBackToTop(){
	navigationRef.current.dispatch(StackActions.popToTop());
}

export function removeListener(){
	navigationRef.current.removeListener('beforeRemove');
}