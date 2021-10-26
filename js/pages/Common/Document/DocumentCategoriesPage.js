import React from 'react';
import { Container, Content, Body, Title, Text, Card, CardItem, Tab, Spinner, connectStyle } from 'native-base';
import { View, FlatList, Keyboard } from 'react-native';
import * as NavigationService from '../../../utils/NavigationService';
import FunctionPageBanner from '../../../components/FunctionPageBanner';
import { connect } from 'react-redux';
import DocCategoriesNewsTabList from '../../../components/Document/DocCategoriesNewsTabList';
import DocCategoriesTypesButton from '../../../components/Document/DocCategoriesTypesButton';
import * as DocumentAction from '../../../redux/actions/DocumentAction';
import { bindActionCreators } from 'redux';
import NoMoreItem from '../../../components/NoMoreItem';

const KEYS_TO_FILTERS = ['detail'];
import DocumentContentItem from '../../../components/Document/DocumentContentItem';
import HeaderForSearch from '../../../components/HeaderForSearch';
import ExplainCardItem from '../../../components/ExplainCardItem';
import MainPageBackground from '../../../components/MainPageBackground';
import * as UpdateDataUtil from '../../../utils/UpdateDataUtil';
import Common from "../../../utils/Common";


class DocumentCategoriesPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isSEqualsT: false, //判断简繁体是否相同
      keyword: "", //一般搜尋
      sKeyword: "", //簡體中文
      tKeyword: "", //繁體中文

      isShowSearch: false,
      isSearch: false,
      isSearchLoading: false,
      isEnd: false, //紀錄搜尋結果是否已經沒有更多資料
      searchedData: [], //關鍵字搜尋出來的資料
    }
  }

  componentDidMount() {
    this.props.actions.loadDocInitState();
  }

  render() {
    let Document = this.props.state.Document;   //需要進行分類的資料 
    //過濾關鍵字所查詢的資料
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
          title={this.props.state.Language.lang.DocumentCategoriesPage.GroupFiles}
          titleOnPress={() => { this.setState({ isShowSearch: true }) }}
        />
        {/*内容*/}
        {
          (!this.state.isShowSearch) ?
            <Content>
              {/*功能大圖*/}
              <FunctionPageBanner
                explain={this.props.state.Language.lang.DocumentCategoriesPage.Introduction}
                imageBackground={require("../../../image/functionImage/documents.png")}
              />
              {/*最新文件列表*/}
              {
                <Card>
                  <ExplainCardItem
                    itemStyle={{ paddingBottom: 0 }}
                    iconName={'document'}
                    text={this.props.state.Language.lang.DocumentCategoriesPage.NewsFiles}
                  />
                  <CardItem style={{ paddingTop: 0, paddingBottom: 0 }}>
                    <Body style={{
                      flexDirection: 'row',
                      height: (this.state.isTabDroping) ? null : this.state.tabsViewbHeight
                    }}
                      onLayout={this.onLayoutTabsView}
                    >
                      <Tab>
                        <DocCategoriesNewsTabList
                          data={Document.GroupFileNewsData}
                          isRefreshing={this.props.state.Document.isRefreshing}
                          lang={this.props.state.Language.lang}
                          page={Document.NoticePage}
                          onPress={this.showNewestFileDocDetail}
                        />
                      </Tab>
                    </Body>
                  </CardItem>
                </Card>
              }

              {/*文件分類別表*/}
              <Card>
                <ExplainCardItem
                  itemStyle={{ paddingBottom: 0 }}
                  iconName={'folder-open'}
                  text={this.props.state.Language.lang.DocumentCategoriesPage.FilesClassify}
                />
                <CardItem>
                  <Body style={{ flexDirection: 'row', alignItems: "center" }}>
                    {
                      (this.props.state.Document.GroupFileTypesData.length != 0) ?
                        <FlatList
                          keyExtractor={(item, index) => index.toString()}
                          numColumns={4}
                          renderItem={this.renderDocCategoriesTypesButton}
                          data={this.props.state.Document.GroupFileTypesData} //產生首頁中間圓圈"表單簽核"的資料
                        />
                        :
                        <Spinner style={{ flex: 1 }} color={this.props.style.SpinnerColor} />
                    }
                  </Body>
                </CardItem>
              </Card>
            </Content>
            :
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              data={this.state.searchedData}
              renderItem={this.renderDocContentItem}
              ListHeaderComponent={this.renderHeader}
              ListFooterComponent={this.renderFooter}
              onEndReachedThreshold={0.3}
              onEndReached={() => this.loadMoreData(false)}
            />
        }
      </Container>
    );
  }

  renderHeader = () => {
    return (
      <View>
        <FunctionPageBanner
          explain={this.props.state.Language.lang.DocumentCategoriesPage.Introduction}
          imageBackground={require("../../../image/functionImage/documents.png")}
          onPress={() => this.ActionSheet.show()}
        />
        {/*搜尋結果*/}
        <Title style={{ paddingTop: 20 }}>{this.props.state.Language.lang.FindPage.SearchResult}</Title>
        <View style={{ width: "50%", height: 3, backgroundColor: "#757575", alignSelf: 'center', marginBottom: 10 }} />
      </View>
    );
  }

  onChangeSearchText = (text) => {
    let result = Common.getSearchKeyword(text)
    let isSEqualsT = result.isSEqualsT
    let keyword, sKeyword, tKeyword = ""
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
        isSearch: true
      });
      this.loadMoreData(true)
    }
  }

  closeSearchButtomOnPress = () => {
    this.setState({
      isShowSearch: false,
      isSearch: false,
      isSearchLoading: false,
      isSEqualsT: false,
      keyword: "",
      sKeyword: "",
      tKeyword: "",
      searchedData: [],
      isEnd: false
    });
  }

  loadMoreData = (isReload) => {
    let isEnd = this.state.isEnd
    if (!isEnd || isReload) {
      this.setState({ isSearchLoading: true })//正在加载
      //重新加载时笔数归0
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
      DocumentAction.queryGroupFileData(pageNum, 10, null, arrCondition).then(result => {
        let data = result.raw()
        let dataLength = data.length
        let tempData
        //判断是否重新加载
        if (isReload) {
          tempData = data
        } else {//非重新查询将资料添加到原来资料的后面
          tempData = [...this.state.searchedData, ...data]
        }
        if (dataLength == 0 || dataLength % 10 != 0) {
          this.setState({
            searchedData: tempData,
            isSearchLoading: false,
            isEnd: true
          })
        } else {
          this.setState({
            searchedData: tempData,
            isSearchLoading: false,
            isEnd: false,
          })
        }
      })
    }
  }

  renderDocContentItem = (item) => {
    let inconInfo = item.item.ICON;
    if (inconInfo == null) return null;
    return (
      <DocumentContentItem
        selectedInfo={item.item}
        inconInfo={inconInfo}
        lang={this.props.state.Language.lang}
        onPress={() => this.showSearchDocDetail(item)}
      />
    );
  }

  //搜寻跳详细画面
  showSearchDocDetail(item) {
    this.increaseSearchVisitCount(item.index, item.item.DID)
    NavigationService.navigate("DocumentDetail", {
      data: item,
    });
  }
  //搜寻跳详细画面访问数增加
  increaseSearchVisitCount = (index, did) => {
    let data = this.state.searchedData
    data[index].VISITCOUNT++
    this.setState({ searchedData: data })
    DocumentAction.increaseDBVisitCount(did)
  }
  //最新文件跳详细画面
  showNewestFileDocDetail = (item) => {
    this.props.actions.increaseNewestFileVisitCount(item.index, item.item.DID)
    NavigationService.navigate("DocumentDetail", { data: item, })
  }

  renderFooter = () => {
    if (this.state.isEnd || !this.state.isSearchLoading) {
      return (<NoMoreItem text={this.props.state.Language.lang.ListFooter.NoMore} />);
    } else {
      if (Platform.OS === "ios") {
        return <Text style={{ alignSelf: 'center' }}>{this.props.state.Language.lang.ListFooter.Searching}</Text>;
      } else {
        return <NoMoreItem text={this.props.state.Language.lang.ListFooter.Loading} />
      }
    }
  }

  //底部文件分類圓圈功能按鍵的地方
  renderDocCategoriesTypesButton = (item) => {
    return (
      <DocCategoriesTypesButton
        typesInfo={item.item}
        onPress={() => this.showDocCategoriesTypesButtonPage(item.item)}
        language={this.props.state.Language.lang.FindPage}
      />
    );
  }

  showDocCategoriesTypesButtonPage(item) {
    NavigationService.navigate("DocumentContent", {
      typeList: item,
    });
  }

}

export let DocumentCategoriesPageStyle = connectStyle('Page.DocumentPage', {})(DocumentCategoriesPage);

export default connect(
  (state) => ({
    state: { ...state }
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...DocumentAction,
    }, dispatch)
  })
)(DocumentCategoriesPageStyle);
