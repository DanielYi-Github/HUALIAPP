import React from 'react';
import { Alert, View, FlatList } from 'react-native';
import { Container, Content } from 'native-base';

import DocumentDetailItem from '../../../components/Document/DocumentDetailItem';
import NoMoreItem from '../../../components/NoMoreItem';
import HeaderForGeneral from '../../../components/HeaderForGeneral';
import MainPageBackground from '../../../components/MainPageBackground';
import { connect } from 'react-redux';

import * as NavigationService from '../../../utils/NavigationService';
import * as DocumentAction from '../../../redux/actions/DocumentAction';


class DocumentDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detailData: this.props.route.params.data,
      detailList: [],
      detailTile: "",
      isEnd: false,
    }
  }

  componentDidMount() {
    this.loadDocContentData();
  }

  loadDocContentData = () => {
    let did = this.state.detailData.item.DID
    DocumentAction.queryGroupFileDetailData(did).then(result => {
      let data = result.raw()
      this.setState({
        detailList: data,
        detailTile: this.state.detailData.item.DETAIL,
        isEnd: true,
      });
    })
  }

  render() {
    return (
      <Container>
        <MainPageBackground height={null} />
        {/*標題列*/}
        <HeaderForGeneral
          isLeftButtonIconShow={true}
          leftButtonIcon={{ name: "arrow-back" }}
          leftButtonOnPress={this.cancelSelect.bind(this)}
          isRightButtonIconShow={false}
          rightButtonIcon={null}
          rightButtonOnPress={null}
          title={this.state.detailTile}
          isTransparent={false}
        />
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={this.state.detailList}
          renderItem={this.renderDocContentItem}
          ListFooterComponent={this.renderFooter}
        />
      </Container>
    );
  }

  renderDocContentItem = (item) => {
    return (
      <DocumentDetailItem
        selectedInfo={item}
        onPress={() => this.showDocDetail(item.item)}
      />
    );
  }

  async showDocDetail(item) {
    NavigationService.navigate("ViewFile", {
      content: item.OID,
      url: 'app/eip/downloadGroupFile',
      fileType: "pdf",
      pageTtile: item.DOCNAME,
      isDownload: true,
      fileId: item.OID,
      modified: item.DMODIFIED,
    });

  }

  cancelSelect() {
    this.props.navigation.goBack();
  }

  renderFooter = () => {
    if (this.state.isEnd) {
      return <NoMoreItem text={this.props.state.Language.lang.ListFooter.NoMore} />
    } else {
      return <NoMoreItem text={this.props.state.Language.lang.ListFooter.Loading} />
    }
  }
}

export default connect(//需修改
  (state) => ({
    state: { ...state }
  })
)(DocumentDetailPage);