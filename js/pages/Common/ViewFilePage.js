import React from 'react';
import { View, Alert, Platform } from 'react-native';
import { Container, Text, Spinner, connectStyle } from 'native-base';
import Pdf         from 'react-native-pdf';
import ImageViewer from 'react-native-image-zoom-viewer';

import { connect } from 'react-redux';
import WaterMarkView          from '../../components/WaterMarkView';
import HeaderForGeneral       from '../../components/HeaderForGeneral';
import * as NavigationService from '../../utils/NavigationService';
import * as UpdateDataUtil    from '../../utils/UpdateDataUtil';
import RNFetchBlob from 'rn-fetch-blob'

// 集團文件、管理文章、BPM原始表單、BPM附件資訊
class ViewFilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        url       :props.route.params.url?props.route.params.url:'NO-ID',
        content   :props.route.params.content?props.route.params.content:'NO-ID',
        refreshing:true,
        file      :null,
        fileType  : "",
    }
  }

  componentDidMount() {
    let user = this.props.state.UserInfo.UserInfo;
    UpdateDataUtil.getCreateFormDetailFormat(
      user,
      this.state.url,
      this.state.content
    ).then((data) => {
      if (data == null || data.url == undefined) {
        Alert.alert(
          this.props.state.Language.lang.Common.Sorry,
          data ? data.message : this.props.state.Language.lang.Common.FileLoadingError, [{
            text: 'OK',
            onPress: () => NavigationService.goBack()
          }, ], {
            cancelable: false
          }
        )
      } else {    
        this.setState({
          refreshing: false,
          file: data.url,
          fileType: data.type
        });
      }
    }).catch((data) => {
      Alert.alert(
        this.props.state.Language.lang.Common.Sorry,
        data ? data.message : this.props.state.Language.lang.Common.FileLoadingError, [{
          text: 'OK',
          onPress: () => NavigationService.goBack()
        }, ], {
          cancelable: false
        }
      )
    });
  }

  render() {
        let pdf = null;
        if(this.state.refreshing == false){
          switch(this.state.fileType) {
            case "pic":
              let images = [{
                  url: 'data:image/png;base64,'+this.state.file,
                  props: {
                      // headers: ...
                  }
              }]
              pdf = (
                <ImageViewer imageUrls={images} />
              );
              break;
            case "pdf":
            
              pdf = (
                <Pdf
                    // source={{uri:"data:application/pdf;base64,"+this.state.file}}
                    source={{uri:encodeURI("http://"+this.state.file)}}
                    style={{flex:1}}
                    onLoadComplete={(numberOfPages,filePath)=>{
                        // console.log(`number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages)=>{
                        // console.log(`current page: ${page}`);
                    }}
                    onError={(error)=>{
                        console.log(error);
                        Alert.alert(
                          this.props.state.Language.lang.Common.Sorry,
                          this.props.state.Language.lang.Common.FileLoadingError,
                          [ {text: 'OK', onPress: () => NavigationService.goBack()} ],
                          { cancelable: false }
                        )
                    }}
                />
              );
              break;
          }
        }


        let viewFilePage = (
            <Container>
              {/*標題列*/}
              <HeaderForGeneral
                isLeftButtonIconShow  = {true}
                leftButtonIcon        = {{name:"arrow-back"}}
                leftButtonOnPress     = {() =>NavigationService.goBack()} 
                isRightButtonIconShow = {false}
                rightButtonIcon       = {null}
                rightButtonOnPress    = {null} 
                title                 = {this.state.content.fileName}
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



                    