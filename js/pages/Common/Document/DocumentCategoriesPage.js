import React from 'react';
import { Container, Content, Body, Title, Text, Card, CardItem , Tab, Spinner, connectStyle} from 'native-base';
import { tify, sify} from 'chinese-conv'; 
import {View,FlatList, Keyboard} from 'react-native';
import * as NavigationService  from '../../../utils/NavigationService';
import FunctionPageBanner from '../../../components/FunctionPageBanner';
import { connect }        from 'react-redux';
import DocCategoriesNewsTabList from '../../../components/Document/DocCategoriesNewsTabList';
import DocCategoriesTypesButton from '../../../components/Document/DocCategoriesTypesButton';
import * as DocumentAction      from '../../../redux/actions/DocumentAction';
import { bindActionCreators }   from 'redux';
import NoMoreItem               from '../../../components/NoMoreItem';

const KEYS_TO_FILTERS = ['detail'];
import DocumentContentItem from '../../../components/Document/DocumentContentItem';
import HeaderForSearch     from '../../../components/HeaderForSearch';
import ExplainCardItem     from '../../../components/ExplainCardItem';
import MainPageBackground     from '../../../components/MainPageBackground';
import * as UpdateDataUtil from '../../../utils/UpdateDataUtil';


class DocumentCategoriesPage extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      isChinesKeyword: false, //用來判斷關鍵字是否為中文字
      keyword: "", //一般搜尋
      sKeyword: "", //簡體中文
      tKeyword: "", //繁體中文

      isShowSearch: false,
      showFooter: false,
      isSearch          :false,
      isEnd             :false,       //紀錄搜尋結果是否已經沒有更多資料
      searchedData      :[],          //關鍵字搜尋出來的資料
      isFooterRefreshing:false,
      isLoading:false

    }
  }

  componentDidMount() {
    let user = this.props.state.UserInfo.UserInfo;
    this.props.actions.loadDocInitState(user);
    this.setState({
      showFooter: true
    });
  }

  render() {
    let Document = this.props.state.Document;   //需要進行分類的資料 
    //過濾關鍵字所查詢的資料
    return (
      <Container>
        <MainPageBackground height={null}/>
        {/*標題列*/}
        <HeaderForSearch
          /*搜尋框的部分*/
          isShowSearch = {this.state.isShowSearch}
          placeholder  = {this.props.state.Language.lang.ContactPage.SearchKeyword}
          onChangeText = {
            (text) => {
              let sText = sify(text); //簡體中文
              let tText = tify(text); //繁體中文

              if (tText === sText) { // 不是中文字
                this.setState({
                  keyword: text,
                  isChinesKeyword: false,
                  isEnd:false,
                  // searchedData :[],
                });
              } else { // 是中文字
                this.setState({
                  sKeyword: sText,
                  tKeyword: tText,
                  isChinesKeyword: true,
                  isEnd:false,
                  // searchedData :[],
                });
              }
            }
          }
          closeSearchButtomOnPress = {
            () => {
              this.setState({
                isShowSearch   :false,
                isSearch       :false,
                isChinesKeyword:false, 
                keyword        :"",    
                sKeyword       :"",    
                tKeyword       :"",
                searchedData   :[],
                isEnd:false
              });
            }
          }
          searchButtomOnPress = {()=>{
              Keyboard.dismiss();
              // 搜尋的值不能為空白
              let key = this.state.isChinesKeyword ? this.state.sKeyword.length : this.state.keyword.length;
              if ( key!==0 ) {
                this.setState({
                  isSearch     :true
                });
                this.loadMoreData(true,[])
              }
          }}
          onSubmitEditing = {()=>{
              Keyboard.dismiss();
              // 搜尋的值不能為空白
              let key = this.state.isChinesKeyword ? this.state.sKeyword.length : this.state.keyword.length;
              if ( key!==0 ) {
                this.setState({
                  isSearch     :true
                });
                this.loadMoreData(true,[])
              }
          }}
          searchButtomText={this.props.state.Language.lang.Common.Search}
          /*標題框的部分*/
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:'arrow-back'}}
          leftButtonOnPress     = {() =>NavigationService.goBack()} 
          isRightButtonIconShow = {true}
          rightButtonIcon       = {{name:'search'}}
          rightButtonOnPress    = {()=>{this.setState({ isShowSearch:true });}} 
          title                 = {this.props.state.Language.lang.DocumentCategoriesPage.GroupFiles}
          titleOnPress          = {()=>{ this.setState({ isShowSearch:true }) }}
        />
      {/*内容*/}
      {
        (!this.state.isShowSearch) ?
          <Content> 
            {/*功能大圖*/}
            <FunctionPageBanner
              explain         ={this.props.state.Language.lang.DocumentCategoriesPage.Introduction}
              imageBackground ={require("../../../image/functionImage/documents.png")}
            />
            {/*最新文件列表*/}
            {
            <Card>
              <ExplainCardItem
                itemStyle = {{paddingBottom: 0}}
                iconName = {'document'}
                text = {this.props.state.Language.lang.DocumentCategoriesPage.NewsFiles}
              />
              <CardItem style={{ paddingTop: 0, paddingBottom: 0 }}>
                <Body style={{ 
                   flexDirection: 'row', 
                   height:(this.state.isTabDroping) ? null:this.state.tabsViewbHeight
                  }} 
                  onLayout={this.onLayoutTabsView}
                >
                 <Tab>
                    <DocCategoriesNewsTabList 
                      data         ={Document.GroupFileNewsData} 
                      isRefreshing ={this.props.state.Document.isRefreshing}
                      lang         ={this.props.state.Language.lang}
                      page         ={Document.NoticePage}
                    />
                 </Tab> 
               </Body>
             </CardItem>                     
            </Card>
            }

            {/*文件分類別表*/}    
            <Card>
              <ExplainCardItem
                itemStyle = {{paddingBottom: 0}}
                iconName = {'folder-open'}
                text = {this.props.state.Language.lang.DocumentCategoriesPage.FilesClassify}
              />
              <CardItem>
                 <Body style={{flexDirection: 'row',alignItems: "center"}}>
                 {
                  (this.props.state.Document.GroupFileTypesData.length!=0)?
                   <FlatList
                     keyExtractor={(item, index) => index.toString()}
                     numColumns    = {4} 
                     renderItem    = {this.renderDocCategoriesTypesButton}
                     data          = {this.props.state.Document.GroupFileTypesData} //產生首頁中間圓圈"表單簽核"的資料
                   />
                    :
                    <Spinner style={{flex:1}} color={this.props.style.SpinnerColor}/>
                  }
                 </Body>
              </CardItem>
            </Card>
          </Content>
          :
            <FlatList
              keyExtractor          ={(item, index) => index.toString()}
              data                  = {this.state.searchedData}
              extraData             = {this.state.isFooterRefreshing}
              renderItem            = {this.renderDocContentItem}
              ListHeaderComponent ={this.renderHeader}
              ListFooterComponent   = {this.renderFooter}
              onEndReachedThreshold = {0.3}
              onEndReached          = {this.state.isEnd ? null :this.loadMoreData}
            /> 
        }
      </Container>
    );
  }

  renderHeader = () => {
    return(
      <View>
        <FunctionPageBanner
          explain         ={this.props.state.Language.lang.DocumentCategoriesPage.Introduction}
          imageBackground ={require("../../../image/functionImage/documents.png")}
          onPress         ={() => this.ActionSheet.show()}
        />
        {/*搜尋結果*/}
        <Title style={{paddingTop: 20}}>{this.props.state.Language.lang.FindPage.SearchResult}</Title>
        <View style={{width:"50%", height:3, backgroundColor:"#757575", alignSelf: 'center', marginBottom: 10 }} />
      </View>
    );
  }


 loadMoreData = (isSearching = false, searchedData  = null) => {
    this.setState({ 
      isFooterRefreshing: true,
      isLoading:true
    });
    isSearching = (typeof isSearching == "object") ? false : isSearching;

    searchedData  = (searchedData  == null) ? this.state.searchedData  : searchedData ;
    let user = this.props.state.UserInfo.UserInfo;
    let lang = this.props.state.Language.lang;

    if (!this.state.isFooterRefreshing) {
        // 是不是關鍵字搜尋
        if(searchedData.length%10!=0){
            this.setState({
              isFooterRefreshing:false,
              isEnd:true,
              isLoading:false
            });
        }else{
          if (isSearching||this.state.isSearch) {
            let page=Math.ceil(searchedData.length/10)+1;
            let searchList = [];
            if (this.state.isChinesKeyword) {
              searchList = [
                UpdateDataUtil.getGroupFileNewsData(user, lang.langStatus, {page:page, condition:this.state.sKeyword}),
                UpdateDataUtil.getGroupFileNewsData(user, lang.langStatus, {page:page, condition:this.state.tKeyword})
              ];
            } else {
              searchList.push(
                UpdateDataUtil.getGroupFileNewsData(user , lang.langStatus, {page:page, condition:this.state.keyword})
              );
            }

            Promise.all(searchList).then((result) => {
              if (this.state.isChinesKeyword) {
                searchedData = searchedData.concat(result[0]);
                searchedData = searchedData.concat(result[1]);
                this.setState({
                  searchedData:this.dedup(searchedData),
                  isFooterRefreshing:false,
                  isEnd:(result[0].length == 0 && result[1].length == 0) ? true: false,
                  isLoading:false
                })
              } else {
                this.setState({
                  searchedData:searchedData.concat(result[0]),
                  isFooterRefreshing:false,
                  isEnd:result[0].length == 0 ? true: false,
                  isLoading:false
                })
              }
            }).catch((err) => {
              console.log(err);
            })
          } 
        }
    }
  }

 renderDocContentItem = (item) => {
    let inconInfo=item.item.icon;
    if (inconInfo == null ) return null;
    return(
      <DocumentContentItem 
        selectedInfo = {item.item}
        inconInfo = {inconInfo} 
        lang ={this.props.state.Language.lang}
        onPress     = {() => this.showDocDetail(item)}
      />
    );      
  }

  async showDocDetail (item) {
    NavigationService.navigate("DocumentDetail", {
      data: item,
    });
  }

  //底部文件分類圓圈功能按鍵的地方
  renderDocCategoriesTypesButton = (item) => {
    return (
      <DocCategoriesTypesButton 
        typesInfo = {item.item}
        onPress      = {() => this.showDocCategoriesTypesButtonPage(item.item)}
        language     = {this.props.state.Language.lang.FindPage}
      />
    );
  }

  showDocCategoriesTypesButtonPage(item) {
    NavigationService.navigate("DocumentContent", {
      typeList: item,
    });
  }

  renderFooter = () => {

    if (!this.state.isLoading) {
      return (<NoMoreItem text={this.props.state.Language.lang.ListFooter.NoMore}/>);
    } else {
      if (Platform.OS === "ios") {
        return <Text style={{alignSelf: 'center'}}>{this.props.state.Language.lang.ListFooter.Searching}</Text>;
      } else {
           return <NoMoreItem text={this.props.state.Language.lang.ListFooter.Loading}/>
      }
    }
  }

}

export let DocumentCategoriesPageStyle = connectStyle( 'Page.DocumentPage', {} )(DocumentCategoriesPage);

export default connect(
  (state) => ({
    state: {...state}
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...DocumentAction,
    }, dispatch)
  })
)(DocumentCategoriesPageStyle);
