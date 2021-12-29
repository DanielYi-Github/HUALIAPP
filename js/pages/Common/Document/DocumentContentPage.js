import React from 'react';
import { FlatList, Alert } from 'react-native';
import { Container } from 'native-base';

import * as NavigationService from '../../../utils/NavigationService';
import DocumentContentItem from '../../../components/Document/DocumentContentItem';
import NoMoreItem from '../../../components/NoMoreItem';
import HeaderForGeneral from '../../../components/HeaderForGeneral';
import MainPageBackground from '../../../components/MainPageBackground';
import { connect } from 'react-redux';
import * as DocumentAction from '../../../redux/actions/DocumentAction';
import * as LoginAction from '../../../redux/actions/LoginAction';
import { bindActionCreators } from 'redux';

class DocumentContentPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typeList: this.props.route.params.typeList,
      DocContentData: [],
      isEnd: false
    }
  }

  componentDidMount() {
    this.loadMoreData();
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
          title={this.state.typeList.content}
          isTransparent={false}
        />
        {/*千萬不能加Content,無限循環*/}
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={this.state.DocContentData}
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
      let page = this.state.DocContentData.length;
      let tid = this.state.typeList.tid
      DocumentAction.queryGroupFileData(page, 10, tid).then(result => {
        let data = result.raw()
        let dataLength = data.length
        let tempData = [...this.state.DocContentData, ...data]
        if (dataLength == 0 || dataLength % 10 != 0) {
          this.setState({
            DocContentData: tempData,
            isEnd: true,
          })
        } else {
          this.setState({
            DocContentData: tempData
          });
        }
      })
    }
  }


  renderDocContentItem = (item) => {
    let inconInfo = this.state.typeList.icon;
    if (inconInfo == null) return null;
    return (
      <DocumentContentItem
        selectedInfo={item.item}
        inconInfo={inconInfo}
        lang={this.props.state.Language.lang}
        onPress={() => this.showDocDetail(item)}
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
    let data = this.state.DocContentData
    data[index].VISITCOUNT++
    this.setState({ DocContentData: data })
    DocumentAction.increaseDBVisitCount(did)
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
      ...LoginAction,
    }, dispatch)
  })
)(DocumentContentPage);