import React from 'react';
import { View, Alert, Dimensions, Platform } from 'react-native';
import { Container, Header, Left, Content, Body, Right, Item, Input, Button, Icon, Title, Text, Form, Label, Spinner, Toast, connectStyle } from 'native-base';
import Pdf         from 'react-native-pdf';
import ImageViewer from 'react-native-image-zoom-viewer';
import { connect } from 'react-redux';

import WaterMarkView          from '../../components/WaterMarkView';
import HeaderForGeneral       from '../../components/HeaderForGeneral';
import * as NavigationService from '../../utils/NavigationService';
import * as UpdateDataUtil    from '../../utils/UpdateDataUtil';

class ViewFilePage extends React.Component {
  constructor(props) {
    super(props);
        this.state = {
            refreshing:true,
            file:null,
            fileType  : ""
        }
  }

  componentDidMount() {
      let user = this.props.state.UserInfo.UserInfo;
      UpdateDataUtil.getOperationSOP(user).then((data)=>{
        this.setState({
          file:encodeURI(data.url),
          refreshing:false
        });
      }).catch((e)=>{
        Alert.alert(
          this.props.state.Language.lang.Common.Sorry,
          this.props.state.Language.lang.Common.FileLoadingError,
          [ {text: 'OK', onPress: () => NavigationService.goBack()} ],
          { cancelable: false }
        )
      });
  }

  render() {
        let pdf=(
          <Pdf
            source={{uri:this.state.file, cache:true}}
            style={{flex:1}}
            onLoadComplete={(numberOfPages,filePath)=>{
                this.setState({ refreshing: false });
                // console.log(`number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page,numberOfPages)=>{
                // console.log(`current page: ${page}`);
            }}
            onError={(error)=>{
                Alert.alert(
                  this.props.state.Language.lang.Common.Sorry,
                  this.props.state.Language.lang.Common.FileLoadingError,
                  [ {text: 'OK', onPress: () => NavigationService.goBack()} ],
                  { cancelable: false }
                )
            }}
          />
        );

        let viewFilePage = (
            <Container>
              {/*標題列*/}
              <HeaderForGeneral
                isLeftButtonIconShow  = {true}
                leftButtonIcon        = {{name:"arrow-back"}}
                leftButtonOnPress     = {()=>NavigationService.goBack()} 
                isRightButtonIconShow = {false}
                rightButtonIcon       = {null}
                rightButtonOnPress    = {null} 
                title                 = {this.props.state.Language.lang.MinePage.operationManual}
                isTransparent         = {false}
              />

                <View style={{flex:1}}>
                {
                  (this.state.refreshing ) ?
                      <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
                          <Spinner color={this.props.style.SpinnerColor}/>
                          <Text style={{color:this.props.style.inputWithoutCardBg.inputColor}}>{this.props.state.Language.lang.Common.FileLoading}</Text>
                      </View>
                  :
                    pdf
                }
                </View>
            </Container>
        );

        return (
          <WaterMarkView 
            contentPage = {viewFilePage} 
            pageId = {"ViewFilePage"}
          />
        );
  }
}

export let ViewFilePageStyle = connectStyle( 'Page.FormPage', {} )(ViewFilePage);

export default connect(
    (state) => ({
        state: { ...state }
    })
)(ViewFilePageStyle);