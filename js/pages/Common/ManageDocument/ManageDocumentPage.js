import React from 'react';
import { Container } from 'native-base';
import { FlatList, Alert, Keyboard } from 'react-native';
import * as NavigationService from '../../../utils/NavigationService';
import FunctionPageBanner from '../../../components/FunctionPageBanner';
import { connect } from 'react-redux';
import NoMoreItem from '../../../components/NoMoreItem';
import { createFilter } from 'react-native-search-filter';
import ManageDocItem from '../../../components/ManageDocument/ManageDocItem';
import MainPageBackground from '../../../components/MainPageBackground';
import * as UpdateDataUtil from '../../../utils/UpdateDataUtil';
import HeaderForSearch from '../../../components/HeaderForSearch';
import * as LoginAction from '../../../redux/actions/LoginAction';
import { bindActionCreators } from 'redux';
import * as DocumentAction from "../../../redux/actions/DocumentAction";
import Common from "../../../utils/Common";

const KEYS_TO_FILTERS = ['detail'];

class ManageDocumentPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSEqualsT: false,       //用來判斷關鍵字是否為中文字
      keyword: "",          //一般搜尋
      sKeyword: "",          //簡體中文
      tKeyword: "",          //繁體中文

      articleData: [],
      icon: "",
      isShowSearch: false,
      isSearch: false,
      isEnd: false,       //紀錄搜尋結果是否已經沒有更多資料
      searchedData: [],          //關鍵字搜尋出來的資料
    }
  }

  componentDidMount() {
    let user = this.props.state.UserInfo.UserInfo;
    let inconInfo = this.props.state.Home.FunctionData.filter(createFilter("ManageDocuments", "ID"));
    let icon = inconInfo.map(v => { return v.ICON }).join();
    this.loadMoreData();
    this.setState({
      icon: icon
    });
  }

  render() {
    // 紀錄是否是關鍵字搜尋結果的資料
    let contentList = this.state.isSearch ? this.state.searchedData : this.state.articleData;

    return (
      <Container>
        <MainPageBackground height={null} />
        {/*標題列*/}
        <HeaderForSearch
          /*搜尋框的部分*/
          isShowSearch={this.state.isShowSearch}
          placeholder={this.props.state.Language.lang.ContactPage.SearchKeyword}
          onChangeText={(text) => this.onChangeSearchText(text)}
          closeSearchButtomOnPress={this.closeSearchButtomOnPress}
          searchButtomOnPress={this.searchButtomOnPress}
          onSubmitEditing={this.searchButtomOnPress}
          searchButtomText={this.props.state.Language.lang.Common.Search}
          /*標題框的部分*/
          isLeftButtonIconShow={true}
          leftButtonIcon={{ name: 'arrow-back' }}
          leftButtonOnPress={() => NavigationService.goBack()}
          isRightButtonIconShow={true}
          rightButtonIcon={{ name: 'search' }}
          rightButtonOnPress={() => { this.setState({ isShowSearch: true }); }}
          title={this.props.state.Language.lang.ManageDocumentPage.ManageDocument}
          titleOnPress={() => { this.setState({ isShowSearch: true }) }}
        />
        {/*千萬不能加Content,無限循環*/}
        {/*最新文件列表*/}
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={contentList}
          renderItem={this.renderDocContentItem}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
          onEndReachedThreshold={0.3}
          onEndReached={() => this.loadMoreData()}
        />
      </Container>
    );
  }


  renderHeader = () => {
    return (
      <FunctionPageBanner
        explain={this.props.state.Language.lang.ManageDocumentPage.Introduction}
        imageBackground={require("../../../image/functionImage/management.jpg")}
      />
    );
  }

  loadMoreData = (isReload = false) => {
    let isEnd = this.state.isEnd
    if (!isEnd || isReload) {
      let isSearch = this.state.isSearch
      if (isSearch || isReload) {//setState异步未能及时获取isSearch修改后的状态，增加isReload作为判断
        let pageNum = isReload ? 0 : this.state.searchedData.length
        let isSEqualsT = this.state.isSEqualsT
        let arrCondition = []
        if (isSEqualsT) {
          let keyword = this.state.keyword
          arrCondition.push(keyword)
        } else {
          let sKeyword = this.state.sKeyword
          let tKeyword = this.state.tKeyword
          arrCondition.push(sKeyword)
          arrCondition.push(tKeyword)
        }
        DocumentAction.queryManageDocumentData(pageNum, 10, arrCondition).then(result => {
          let data = result.raw()
          let dataLength = data.length
          let tempData
          if (isReload) {
            tempData = data
          } else {
            tempData = [...this.state.searchedData, ...data]
          }
          if (dataLength == 0 || dataLength % 10 != 0) {
            this.setState({
              searchedData: tempData,
              isEnd: true
            })
          } else {
            this.setState({
              searchedData: tempData,
              isEnd: false
            })
          }
        })
      } else {
        let pageNum = this.state.articleData.length
        DocumentAction.queryManageDocumentData(pageNum, 10).then(result => {
          let data = result.raw()
          let dataLength = data.length
          let tempData = [...this.state.articleData, ...data]
          if (dataLength == 0 || dataLength % 10 != 0) {
            this.setState({
              articleData: tempData,
              isEnd: true
            })
          } else {
            this.setState({
              articleData: tempData,
              isEnd: false
            })
          }
        })
      }
    }
  }

  renderDocContentItem = (item) => {
    return (
      <ManageDocItem
        selectedInfo={item}
        inconInfo={this.state.icon}
        lang={this.props.state.Language.lang.ManageDocumentPage}
        onPress={() => this.showDocDetail(item)}
      />
    );
  }

  showDocDetail = (item) => {
    let oid = item.item.OID
    let did = item.item.DID;
    let detail = item.item.DETAIL;
    let modified = item.item.DMODIFIED
    this.increaseVisitCount(item.index, did)
    NavigationService.navigate("ViewFile", {
      content: oid,
      url: 'app/eip/downloadArticleFile',
      fileType: "pdf",
      pageTtile: detail,
      isDownload: true,
      fileId: oid,
      modified,
    });
  }

  increaseVisitCount = (index, did) => {
    let data = this.state.isSearch ? this.state.searchedData : this.state.articleData
    data[index].VISITCOUNT++
    this.setState({ DocContentData: data })
    DocumentAction.increaseDBVisitCount(did)
  }

  renderFooter = () => {
    if (this.state.isEnd) {
      return (<NoMoreItem text={this.props.state.Language.lang.ListFooter.NoMore} />);
    } else {
      return <NoMoreItem text={this.props.state.Language.lang.ListFooter.Loading} />;
    }
  }

  onChangeSearchText = (text) => {
    let result = Common.getSearchKeyword(text)
    let isSEqualsT = result.isSEqualsT
    let keyword = ""
    let sKeyword = ""
    let tKeyword = ""
    if (isSEqualsT) {//简繁体相同
      keyword = result.keyword
    } else {
      sKeyword = result.sKeyword
      tKeyword = result.tKeyword
    }
    this.setState({
      isSEqualsT,
      keyword,
      sKeyword,
      tKeyword
    })
  }

  searchButtomOnPress = () => {
    Keyboard.dismiss();
    // 搜尋的值不能為空白
    let key = this.state.isSEqualsT ? this.state.keyword.length : this.state.sKeyword.length;
    if (key !== 0) {
      this.setState({
        isSearch: true,
        searchedData: [],
        isEnd: false
      });
      this.loadMoreData(true)
    }
  }

  closeSearchButtomOnPress = () => {
    this.setState({
      isShowSearch: false,
      isSearch: false,
      isSEqualsT: false,
      keyword: "",
      sKeyword: "",
      tKeyword: "",
      searchedData: [],
      isEnd: false
    });
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
)(ManageDocumentPage);
