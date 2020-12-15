import React, { Component, useRef } from 'react';
import { Container, Header, Icon, Left, Button, Body, Right, Title, Content, Text, connectStyle} from 'native-base';
import { View, Platform, Alert } from 'react-native';
import SignatureCapture from 'react-native-signature-capture';

import HeaderForGeneral  from '../../../components/HeaderForGeneral';
import * as NavigationService from '../../../utils/NavigationService';

import { connect } from 'react-redux';

class FormDrawSignPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        // 假設簽名的區域為 328長*170高
        let singImageWidth =  this.props.style.PageSize.width;
        let singImageHeight = (singImageWidth*170)/328; 
        return (
            <Container>
              {/*標題列*/}
              <HeaderForGeneral
                isLeftButtonIconShow  = {true}
                leftButtonIcon        = {{name:"arrow-back"}}
                leftButtonOnPress     = {() =>NavigationService.goBack()} 
                isRightButtonIconShow = {false}
                rightButtonIcon       = {null}
                rightButtonOnPress    = {null} 
                title                 = {this.props.Language.Signature}
                isTransparent         = {false}
              />
              <Content contentContainerStyle={{flex: 1, justifyContent:'space-between'}} scrollEnabled={false}>

                <Body style={{justifyContent:'center'}}>
                    {/*請在空白處簽名*/}
                    <Title style={{marginTop:20, marginBottom: 20}}>{this.props.Language.SignArea}</Title>
                    
                    <SignatureCapture
                      style={{height:singImageHeight, width :singImageWidth}}
                      ref="sign"
                      onSaveEvent={this._onSaveEvent}
                      saveImageFileInExtStorage={false}
                      showNativeButtons={false}
                      showTitleLabel={false}
                      showBorder={false}
                    />
                </Body>


                <Body style={{flexDirection: 'row', width:this.props.style.PageSize.width, flex: 0, justifyContent:'space-around', marginBottom: 10, marginTop:20}}>
                    <Button warning 
                        onPress={() => {
                            this.refs["sign"].resetImage();
                        }}
                        style={{width:"45%", height:this.props.style.PageSize.height*0.1, justifyContent:'center'}}
                    >
                        <Title style={{alignSelf: 'center'}}>{this.props.Language.Clean}</Title>
                    </Button>
                    <Button success 
                        onPress={() => this.refs["sign"].saveImage()}
                        style={{width:"45%", height:this.props.style.PageSize.height*0.1, justifyContent:'center'}}
                    >
                        <Title style={{alignSelf: 'center'}}>{this.props.Language.Comfirm}</Title>
                    </Button>
                </Body>
              </Content>
            </Container>
        );
    }

    _onSaveEvent = (result) => {
        //result.encoded - for the base64 encoded png
        //result.pathName - for the file path name
        NavigationService.navigate("Form", {
          signImage  :result.encoded,
        });
    }

    _onDragEvent = () => {
        this.setState({ isSigned:true });
    }

	cencelPublish = () => {
        NavigationService.goBack();
	}
}

export let FormDrawSignPageStyle = connectStyle( 'Page.FormPage', {} )(FormDrawSignPage);
export default connect(
  (state) => ({
    Language:state.Language.lang.FormDrawSign
  })
)(FormDrawSignPageStyle);