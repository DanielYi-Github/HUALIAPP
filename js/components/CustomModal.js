import React, { Component } from 'react';
import { Modal } from "react-native";
import { connectStyle, Text, Spinner, Container } from "native-base";

class CustomModal extends Component {
  constructor(props) {}

  render() {
    let text = this.props.text ? this.props.text : "";
    return (
      <Modal
        animationType="fade"
        // animationType="none"
        transparent={true}
        visible={true}
        onRequestClose={() => {}}>
        <Container style={{
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor:this.props.style.SpinnerbackgroundColor
        }}>
          <Spinner color={this.props.style.SpinnerColor}/>
          <Text>{text}</Text>
        </Container>
      </Modal>

    );
  }
}

export default connectStyle( 'Component.CustomModal', {} )(CustomModal);
