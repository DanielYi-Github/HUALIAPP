import React, { Component } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Image,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import { Content, Item, Label, Input, Form, Icon, Button, Text, Body, Card, CardItem, Title, CheckBox, Left, Right, connectStyle } from 'native-base';

class SortableRow extends Component {

  constructor(props) {
    super(props);

    this._active = new Animated.Value(0);

    this._style = {
      ...Platform.select({
        ios: {
          transform: [{
            scale: this._active.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.1],
            }),
          }],
          shadowRadius: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 10],
          }),
        },

        android: {
          transform: [{
            scale: this._active.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.07],
            }),
          }],
          elevation: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 6],
          }),
        },
      })
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.active !== nextProps.active) {
      Animated.timing(this._active, {
        duration: 300,
        easing: Easing.bounce,
        toValue: Number(nextProps.active),
      }).start();
    }
  }

  render() {
   const {data, active, index} = this.props;
    let activeBackgroundColor = active ? "rgba(0,0,0,.3)": this.props.style.InputFieldBackground ; 
    return (
      <Animated.View style={[ styles.row, this._style, { backgroundColor:activeBackgroundColor  } ]}>
        <Body style={{flexDirection: 'row', paddingLeft: 20, paddingRight: 20}}>
          <Left style={{flexDirection: 'row', flex: 0}}>
            <CheckBox 
              checked={data.checked} 
              color={data.checked ? "#EA4C88" : "#aaa" } 
              onPress={(e)=>{ 
                this.props.onCheckBoxTap(index, data); 
              }} 
            />
          </Left>
          <Body style={{justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: 20}}>
            <Label>{`${index+1}.`}{data.COLUMN2}</Label>
          </Body>
          <Right>
            <Icon name={Platform.OS=="ios" ? "reorder-two": "reorder"}/>
          </Right>
        </Body>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  }
});

export default connectStyle( 'Component.FormContent', styles )(SortableRow);
