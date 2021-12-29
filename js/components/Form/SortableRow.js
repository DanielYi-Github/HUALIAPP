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
import { Content, Item, Label, Input, Form, Icon, Button, Text, Body, Card, CardItem, Title, Left, Right, connectStyle } from 'native-base';
import CheckBox from '@react-native-community/checkbox';

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
        easing  : Easing.bounce,
        toValue : Number(nextProps.active),
      }).start();
    }
  }

  render() {
    const {data, active, index} = this.props;
    let activeBackgroundColor = active ? "rgba(0,0,0,.3)": this.props.style.InputFieldBackground ; 
    return (
      <Animated.View style={[ styles.row, this._style, { backgroundColor:activeBackgroundColor  } ]}>
        <Item button style={{width: '100%', borderBottomWidth: 0}} 
          onPress={()=>{
            this.props.onCheckBoxTap(index, data);
          }}
          onLongPress={this.props.onLongPress}
        >
          <Left style={{flexDirection: 'row', flex: 0}}>
            <CheckBox
                value={data.checked}
                onValueChange={(newValue) => {
                  if (Platform.OS == "android") this.props.onCheckBoxTap(index, data);
                }}
                boxType      = {"square"}
                onCheckColor = {"#E25241"}
                onTintColor  = {"#E25241"}
                tintColors   = {{true: "#E25241", false: '#aaaaaa'}}
                animationDuration = {0.01}
                disabled     ={ Platform.OS == "android" ? false : true }

              />
          </Left>
          <Body style={{justifyContent: 'space-between', paddingLeft: 10, flexDirection: 'row'}}>
            <Label>{`${index+1}.`}{this.props.name}</Label><Text note>{this.props.departmentName}</Text>
          </Body>
          <Right style={{flex: 0}}>
            <Icon name={"reorder-two"}/>
          </Right>
        </Item>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 15,
  }
});

export default connectStyle( 'Component.FormContent', styles )(SortableRow);
