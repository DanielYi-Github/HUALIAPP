import React from 'react';
import { View, Alert, Platform } from 'react-native';
import { Container, Text, Spinner, connectStyle } from 'native-base';
import Pdf from 'react-native-pdf';
import ImageViewer from 'react-native-image-zoom-viewer';

import { connect } from 'react-redux';
import WaterMarkView from '../../components/WaterMarkView';
import HeaderForGeneral from '../../components/HeaderForGeneral';
import * as NavigationService from '../../utils/NavigationService';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';
import RNFetchBlob from 'rn-fetch-blob'
import Common from "../../utils/Common";
import * as FileUtil from "../../utils/FileUtil";

// 集團文件、管理文章、BPM原始表單、BPM附件資訊、公司文件
class ViewFilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url            : props.route.params.url ? props.route.params.url : 'NO-ID',         //從服務器獲取文件或url的API
      content        : props.route.params.content ? props.route.params.content : 'NO-ID', //上面API的參數
      refreshing     : true,
      file           : null,                                                              //文件或文件的url
      fileType       : props.route.params.fileType ? props.route.params.fileType : "",    //文件类型                                                              //文件類型
      pageTtile      : props.route.params.pageTtile ? props.route.params.pageTtile : false, //文件標題
      isFailedRequest: false,                                                               //file錯誤時是否再次從服務器獲取
      isDownload     : props.route.params.isDownload ? props.route.params.isDownload : false,//是否下载文件
      fileId         : props.route.params.fileId, //文件ID
      modified       : props.route.params.modified ? props.route.params.modified : "", //修改时间
    }
  }

  componentDidMount() {
    let file     = this.props.route.params.file
    let fileType = this.props.route.params.fileType
    console.log("componentDidMount", file, fileType, this.state.isDownload);


    if (file != undefined && fileType != undefined) {
      this.setState({
        refreshing: false,
        file,
        fileType,
        isFailedRequest: true
      })
    } else if (this.state.isDownload) {
      this.getAppFile()
    } else {
      this.getServerFile()
    }

  }

  render() {
    let pdf = null;
    if (this.state.refreshing == false) {
      switch (this.state.fileType) {
        case "pic":
          let images = [{
            url: 'data:image/png;base64,' + this.state.file,
            props: {}
          }]
          pdf = (
            <ImageViewer imageUrls={images} />
          );
          break;
        case "pdf":

          pdf = (
            <Pdf
              // source={{uri:"data:application/pdf;base64,"+this.state.file}}
              source={{ uri: encodeURI(this.state.file) }}
              style={{ flex: 1 }}
              onLoadComplete={(numberOfPages, filePath) => {
                // console.log(`number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page, numberOfPages) => {
                // console.log(`current page: ${page}`);
              }}
              onError={(error) => {
                console.log(error);
                //判斷是否需要再從服務器獲取一次
                if (this.state.isFailedRequest) {
                  //判断是否是下载文件
                  if (this.state.isDownload) {
                    this.reDownloadFile()
                  } else {
                    this.getServerFile()
                  }
                } else {
                  Alert.alert(
                    this.props.state.Language.lang.Common.Sorry,
                    this.props.state.Language.lang.Common.FileLoadingError,
                    [{ text: 'OK', onPress: () => NavigationService.goBack() }],
                    { cancelable: false }
                  )
                }
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
          isLeftButtonIconShow={true}
          leftButtonIcon={{ name: "arrow-back" }}
          leftButtonOnPress={() => NavigationService.goBack()}
          isRightButtonIconShow={false}
          rightButtonIcon={null}
          rightButtonOnPress={null}
          title={this.state.pageTtile ? this.state.pageTtile : this.state.content.fileName}
          isTransparent={false}
        />

        <View style={{ flex: 1 }}>
          {
            (this.state.refreshing) ?
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Spinner color={this.props.style.SpinnerColor} />
                <Text style={{ color: this.props.style.inputWithoutCardBg.inputColor }}>{this.props.state.Language.lang.Common.FileLoading}</Text>
              </View>
              :
              pdf
          }
        </View>
      </Container>
    );

    return (
      <WaterMarkView
        contentPage={viewFilePage}
        pageId={"ViewFilePage"}
      />
    );
  }

  getServerFile = () => {
    let user = this.props.state.UserInfo.UserInfo;
    UpdateDataUtil.getCreateFormDetailFormat(
      user,
      this.state.url,
      this.state.content
    ).then((data) => {
      // 驗證資料的正確性
      let isUnvalid = false;
      switch (data.type) {
        case "pic":
          isUnvalid = data.base64 == "" ? true : isUnvalid;
          break;
        case "pdf":
          isUnvalid = data.url == "" ? true : isUnvalid;
          break;
      }

      if (data == null || isUnvalid) {
        Alert.alert(
          this.props.state.Language.lang.Common.Sorry,
          data ? data.message : this.props.state.Language.lang.Common.FileLoadingError, [{
            text: 'OK',
            onPress: () => NavigationService.goBack()
          },], {
          cancelable: false
        }
        )
      } else {
        let file = data.type == "pic" ? data.base64 : data.url
        let fileType = data.type
        this.setState({
          refreshing: false,
          file,
          fileType,
          isFailedRequest: false
        });
      }
    }).catch((data) => {
      Alert.alert(
        this.props.state.Language.lang.Common.Sorry,
        data ? data.message : this.props.state.Language.lang.Common.FileLoadingError, [{
          text: 'OK',
          onPress: () => NavigationService.goBack()
        },], {
        cancelable: false
      }
      )
    });
  }

  getAppFile = () => {
    let user     = this.props.state.UserInfo.UserInfo
    let url      = this.state.url
    let content  = this.state.content
    let fileId   = this.state.fileId
    let fileType = this.state.fileType
    let modified = this.state.modified
    console.log(url, content, user, fileId, modified);
    FileUtil.getAppFilePath(url, content, user, fileId, modified).then(async(path) => {
      if (path != "") {
        switch(fileType){
          case "pic":
            path = await FileUtil.getFileBase64(path)
            break
          case "pdf":
            break
        }
        this.setState({
          file: path,
          refreshing: false,
          isFailedRequest: true
        })
      } else {
        Alert.alert(
          this.props.state.Language.lang.Common.Sorry,
          this.props.state.Language.lang.Common.FileLoadingError,
          [{ text: 'OK', onPress: () => NavigationService.goBack() }],
          { cancelable: false }
        )
      }
    })
  }

  reDownloadFile = () => {
    let user = this.props.state.UserInfo.UserInfo
    let url = this.state.url
    let content = this.state.content
    let fileId = this.state.fileId
    let fileType = this.state.fileType
    let modified = this.state.modified
    FileUtil.reDownloadFile(url, content, user, fileId, modified).then(async(path) => {
      if (path != "") {
        switch(fileType){
          case "pic":
            path = await FileUtil.getFileBase64(path)
            break
          case "pdf":
            break
        }
        this.setState({
          file: path,
          refreshing: false,
          isFailedRequest: false
        })
      } else {
        Alert.alert(
          this.props.state.Language.lang.Common.Sorry,
          this.props.state.Language.lang.Common.FileLoadingError,
          [{ text: 'OK', onPress: () => NavigationService.goBack() }],
          { cancelable: false }
        )
      }
    })
  }

}

export let ViewFilePageStyle = connectStyle('Page.FormPage', {})(ViewFilePage);

export default connect(
  (state) => ({
    state: { ...state }
  })
)(ViewFilePageStyle);



