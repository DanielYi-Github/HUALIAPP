import React from 'react';
import { Image, View, Text, Dimensions} from 'react-native';
import { Container, Header, Icon, Left, Button, Body, Right, Title, Content} from 'native-base';
import ImageViewer            from 'react-native-image-zoom-viewer';
import { WatermarkView }      from 'react-native-watermark-component';
import WaterMarkView          from '../../../components/WaterMarkView';
import HeaderForGeneral       from '../../../components/HeaderForGeneral';
import * as NavigationService from '../../../utils/NavigationService';

export default class FormOrigionalForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bpmImage: 'data:image/png;base64,'+this.props.navigation.getParam('bpmImage', null),
    }
  }

  render() {
    // Simplest usage.
    const images = [{
        url: this.state.bpmImage,
        props: {
            // headers: ...
        }
    }]

    let formOrigionalForm = (
          <Container>
            <HeaderForGeneral
              isLeftButtonIconShow  = {true}
              leftButtonIcon        = {{name:"close"}}
              leftButtonOnPress     = {() =>NavigationService.goBack()} 
              isRightButtonIconShow = {false}
              rightButtonIcon       = {null}
              rightButtonOnPress    = {null} 
              title                 = {""}
              isTransparent         = {true}
            />
            <ImageViewer imageUrls={images} />
          </Container>
    );

    return (
      <WaterMarkView 
        contentPage = {formOrigionalForm} 
        pageId = {"FormOrigionalForm"}
      />
    );
  }
}