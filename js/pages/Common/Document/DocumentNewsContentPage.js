import React from 'react';
import { FlatList } from 'react-native';
import { Container } from 'native-base';

import * as NavigationService from '../../../utils/NavigationService';
import DocumentContentItem from '../../../components/Document/DocumentContentItem';
import HeaderForGeneral from '../../../components/HeaderForGeneral';
import NoMoreItem from '../../../components/NoMoreItem';
import MainPageBackground from '../../../components/MainPageBackground';
import { connect } from 'react-redux';
import * as UpdateDataUtil from '../../../utils/UpdateDataUtil';
import { bindActionCreators } from 'redux';
import * as DocumentAction from '../../../redux/actions/DocumentAction';

class DocumentNewsContentPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      DocContentData: this.props.state.Document.GroupFileNewsData,
      isEnd: false,
    }
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
          title={this.props.state.Language.lang.DocumentCategoriesPage.NewsFiles}
          isTransparent={false}
        />
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={this.state.DocContentData}
          extraData={this.state}
          renderItem={this.renderDocContentItem}
          ListFooterComponent={this.renderFooter}
          onEndReachedThreshold={0.3}
          onEndReached={this.loadMoreData}
        />
      </Container>
    );
  }

  loadMoreData = () => {
    let isEnd = this.state.isEnd
    if (!isEnd) {
      let page = this.state.DocContentData.length
      DocumentAction.queryGroupFileData(page, 10).then(result => {
        let data = result.raw()
        let dataLength = data.length
        let tempData = [...this.state.DocContentData, ...data];
        if (dataLength == 0 || dataLength % 10 != 0) {
          this.setState({
            DocContentData: tempData,
            isEnd: true,
          });
        } else {
          this.setState({
            DocContentData: tempData,
          });
        }
      })
    }
  }

  renderDocContentItem = (item) => {
    let data = item;
    if (data.item.ICON == null) return null;
    return (
      <DocumentContentItem
        selectedInfo={data.item}
        inconInfo={data.item.ICON}
        lang={this.props.state.Language.lang}
        onPress={() => this.showDocDetail(data)}
      />
    );
  }

  showDocDetail(item) {
    this.increaseVisitCount(item.index, item.item.DID)
    NavigationService.navigate("DocumentDetail", {
      data: item,
    });

  }

  increaseVisitCount = (index, did) => {
    let length = this.props.state.Document.GroupFileNewsData.length
    if (index < length) {
      this.props.actions.increaseNewestFileVisitCount(index, did)
    } else {
      let data = this.state.DocContentData
      data[index].VISITCOUNT++
      this.setState({ DocContentData: data })
      DocumentAction.increaseDBVisitCount(did)
    }

  }

  cancelSelect() {
    NavigationService.goBack();
  }

  renderFooter = () => {
    if (this.state.isEnd) {
      return (<NoMoreItem text={this.props.state.Language.lang.ListFooter.NoMore} />);
    } else {
      return <NoMoreItem text={this.props.state.Language.lang.ListFooter.Loading} />;
    }
  }
}

export default connect(
  (state) => ({
    state: { ...state }
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...DocumentAction,
    }, dispatch)
  })
)(DocumentNewsContentPage);