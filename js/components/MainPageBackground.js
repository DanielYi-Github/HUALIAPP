import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  ImageBackground
} from 'react-native';
import { Container, connectStyle} from 'native-base';
import Flake from './Animation/Flake';
const { width, height } = Dimensions.get('window');


class MainPageBackground extends React.Component {
   constructor(props) {
     super(props);
   }

  render() {
    let heightObject = {};
    if (this.props.height) {
      heightObject.height = this.props.height;
    } else {
      if (typeof this.props.height !== "undefined") {
        heightObject.height = 0;
      }
    }

    // 確定是不是全屏顯示
    let content = null;
    if (this.props.style.MainPageBackground.height == height) {
      heightObject.height = height;
      content = (
        <ImageBackground
          style={{ flex: 1, resizeMode: "cover" }}
          source={this.props.style.MainPageBackground.source}
        >
          {/*
            [...Array(10)].map((_, index) => 
              <Flake
                x={Math.random() * width}               // x-coordinate
                y={Math.random() * height}              // y-coordinate
                radius={Math.random() * 4 + 1}          // radius
                density={Math.random() * 10}   // density
                key={index}
              />
            )
          */}
        </ImageBackground>
      );
    }

    return (
      <Container style={[this.props.style.MainPageBackground,heightObject]} >
        {content}
      </Container>
    );

  }
}

export default connectStyle( 'Component.MainPageBackground', {} )(MainPageBackground);
