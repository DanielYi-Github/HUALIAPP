import React from "react";
import {
  Modal,
  View,
  Platform,
  // DateTimePicker,
  // DatePickerAndroid
} from "react-native";
import { Text, DatePicker, Button, Icon, connectStyle } from "native-base";
import DateTimePicker from '@react-native-community/datetimepicker';


class CustomDatePicker extends DatePicker {

  formatChosenDate(date) {
    if (this.props.formatChosenDate) {
      return this.props.formatChosenDate(date);
    }
    return [
      // date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    ].join('/');
  }

  render() {
    return (
      <View>
        <View style={{flexDirection: 'row', alignItems: 'center' }}>
          {/*
          <Button transparent onPress={ !this.state.disabled ? this.showDatePicker.bind(this) : undefined } >
          </Button>
          */}
			<Icon name="calendar" style={{color:this.props.style.iconColor}} onPress={ !this.state.disabled ? this.showDatePicker.bind(this) : undefined }/> 
			<Text style={{paddingLeft: 5, color:this.props.style.iconColor}} onPress={ !this.state.disabled ? this.showDatePicker.bind(this) : undefined }>
			  {this.state.chosenDate
			    ? this.formatChosenDate(this.state.chosenDate)
			    : this.props.placeHolderText
			      ? this.props.placeHolderText
			      : "Select Date"}
			</Text>

          <View>
            <Modal
              animationType={this.props.animationType}
              transparent={this.props.modalTransparent} //from api
              visible={this.state.modalVisible}
              onRequestClose={() => { }}
            >
              <DateTimePicker
                date={
                  this.state.chosenDate
                    ? this.state.chosenDate
                    : this.state.defaultDate
                }
                onDateChange={this.setDate.bind(this)}
                minimumDate={this.props.minimumDate}
                maximumDate={this.props.maximumDate}
                mode="date"
                locale={this.props.locale}
                timeZoneOffsetInMinutes={this.props.timeZoneOffsetInMinutes}
              />
            </Modal>
          </View>
        </View>
      </View>
    );
  }
}

export default connectStyle( 'Page.CarsPage', {} )(CustomDatePicker);

