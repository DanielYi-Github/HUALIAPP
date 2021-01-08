import React from 'react';
import { Container } from 'native-base';
import { tify, sify} from 'chinese-conv'; 
import { FlatList, Alert, Keyboard} from 'react-native';
import * as NavigationService  from '../../../utils/NavigationService';
import FunctionPageBanner from '../../../components/FunctionPageBanner';
import { connect } from 'react-redux';
import NoMoreItem from '../../../components/NoMoreItem';
import { createFilter } from 'react-native-search-filter';
import ManageDocItem from '../../../components/ManageDocument/ManageDocItem';
import MainPageBackground     from '../../../components/MainPageBackground';
import * as UpdateDataUtil from '../../../utils/UpdateDataUtil';
import HeaderForSearch     from '../../../components/HeaderForSearch';
import * as LoginAction      from '../../../redux/actions/LoginAction';
import { bindActionCreators }   from 'redux';

const KEYS_TO_FILTERS = ['detail'];

class ManageDocumentPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isChinesKeyword:false,       //用來判斷關鍵字是否為中文字
      keyword        :"",          //一般搜尋
      sKeyword       :"",          //簡體中文
      tKeyword       :"",          //繁體中文

      articleData:[],
      icon:"",
      isShowSearch:false,
      showFooter: false,
      isLoading: false,
      isSearch          :false,
      isEnd             :false,       //紀錄搜尋結果是否已經沒有更多資料
      searchedData      :[],          //關鍵字搜尋出來的資料
      isFooterRefreshing:false
    }
  }

  componentDidMount() {
    let user = this.props.state.UserInfo.UserInfo;
    let  inconInfo = this.props.state.Home.FunctionData.filter(createFilter("ManageDocuments", "ID"));
    let icon=inconInfo.map(v => {return v.ICON}).join();
    
    this.loadMangeDocContentData(user);    
    this.setState({
        icon:icon
    });
  }

  loadMangeDocContentData = (user) => {      

    this.setState({
      isLoading : true,
      articleData : [],
      showFooter: false
    });
    let index=0;
    UpdateDataUtil.getManArticleContentData(user,{index:index, condition:null}).then(async (data)=>{
        this.setState({
            isLoading : false,
            articleData: data,
            showFooter: true
        });
    }).catch((e)=>{
        this.setState({
            isLoading : false,
            articleData: [],
            showFooter: true
        });
        if(e.code==0){
          this.props.actions.logout(e.message, true);
        }else{
          //無法連線，請確定網路連線狀況
          setTimeout(() => {
            Alert.alert(
              this.props.state.Language.lang.CreateFormPage.Fail,
              this.props.state.Language.lang.Common.NoInternetAlert, [{
                text: 'OK',
                onPress: () => {
                  NavigationService.goBack();
                }
              }], {
                cancelable: false
              }
            )
          }, 200);
        }
    }); 
  }

  render() {
    // 紀錄是否是關鍵字搜尋結果的資料
    let contentList = this.state.isSearch ? this.state.searchedData : this.state.articleData;

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
                  isChinesKeyword: false
                });
              } else { // 是中文字
                this.setState({
                  sKeyword: sText,
                  tKeyword: tText,
                  isChinesKeyword: true
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
                  isSearch     :true,
                  searchedData :[], 
                  isEnd        :false           
                });
                this.loadMoreData(true,[])
              }
            } 
          }
          onSubmitEditing = {()=>{
              Keyboard.dismiss();
              // 搜尋的值不能為空白
              let key = this.state.isChinesKeyword ? this.state.sKeyword.length : this.state.keyword.length;
              if ( key!==0 ) {
                this.setState({
                  isSearch     :true,
                  searchedData :[], 
                  isEnd        :false           
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
          title                 = {this.props.state.Language.lang.ManageDocumentPage.ManageDocument}
          titleOnPress          = {()=>{ this.setState({ isShowSearch:true }) }}
        />
          {/*千萬不能加Content,無限循環*/}
          {/*最新文件列表*/}
              <FlatList
                keyExtractor          ={(item, index) => index.toString()}
                data                  = {contentList}
                extraData             = {this.state.isFooterRefreshing}
                renderItem            = {this.renderDocContentItem}
                ListHeaderComponent ={this.renderHeader}
                ListFooterComponent   = {this.renderFooter}
                onEndReachedThreshold = {0.3}
                onEndReached          = {this.state.isEnd ? null :this.loadMoreData}
              />
      </Container>
    );
  }


  renderHeader = () => {
    return(
      <FunctionPageBanner
        explain         ={this.props.state.Language.lang.ManageDocumentPage.Introduction}
        imageBackground ={require("../../../image/functionImage/management.jpg")}
      />
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

    if (!this.state.isFooterRefreshing) {
      // 是不是關鍵字搜尋
      if (isSearching||this.state.isSearch) {
        let count = (searchedData.length == 0) ? searchedData.length : searchedData.length+10
        let searchList = [];
        if (this.state.isChinesKeyword) {
          searchList = [
            UpdateDataUtil.getManArticleContentData(user ,{index:count, condition:this.state.sKeyword}),
            UpdateDataUtil.getManArticleContentData(user ,{index:count, condition:this.state.tKeyword})
          ];
        } else {
          searchList.push(
            UpdateDataUtil.getManArticleContentData(user ,{index:count, condition:this.state.keyword})
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
      } else {
          let index=this.state.articleData.length+1;
          UpdateDataUtil.getManArticleContentData(user,{index:index, condition:null}).then(async (data)=>{

                let articleData = [ ...this.state.articleData,...data];
                this.setState({
                  articleData:articleData,
                  isFooterRefreshing:false,
                  isEnd:data.length == 0 ? true: false,
                  isLoading:false
                })
          }); 
      }
    }
  }

  renderDocContentItem = (item) => {
    return(
      <ManageDocItem 
        selectedInfo = {item}
        inconInfo = {this.state.icon} 
        lang ={this.props.state.Language.lang.ManageDocumentPage}
        onPress     = {() => this.showDocDetail(item.item)}
      />
    );      
  }

  showDocDetail(item) {
    let user = this.props.state.UserInfo.UserInfo;
    let did = item.did;
    let detail = item.detail;
    let content = {
      did: did,
      type: "pdf",
      fileName: detail,
      loginID:user.loginID
    };
    
    NavigationService.navigate("ViewFile", {
      content: content,
      url: 'app/eip/getArticleBase64Data'
    });
    this.addTemp(did);
  }

  addTemp =(did)=>{
    let tempData=this.deepClone(this.state.articleData);
    for(let i in tempData){
        if(tempData[i].did==did){
          tempData[i].hits=+tempData[i].hits+1;
          break;
        }
    }
    this.setState({
      articleData:tempData
    })
  }

  deepClone(src) {
    return JSON.parse(JSON.stringify(src));
  }

  dedup(arr) {
    var hashTable = {};

    return arr.filter(function (el) {
      var key = JSON.stringify(el);
      var match = Boolean(hashTable[key]);

      return (match ? false : hashTable[key] = true);
    });
  }

  renderFooter = () => {
    if (this.state.isEnd) {
      return (<NoMoreItem text={this.props.state.Language.lang.ListFooter.NoMore}/>);
    } else {
        return <NoMoreItem text={this.props.state.Language.lang.ListFooter.Loading}/>;
    }
  }

}

export default connect(
  (state) => ({
    state: {...state}
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...LoginAction,
    }, dispatch)
  })
)(ManageDocumentPage);
