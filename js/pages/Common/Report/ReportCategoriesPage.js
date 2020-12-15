import React from 'react';
import { Container, Header, Left, Content, Body, Right, Item, Input, Button, Icon, Title, Text, Card, CardItem , Tab, Spinner, connectStyle} from 'native-base';
import { tify, sify} from 'chinese-conv'; 
import ActionSheet from 'react-native-actionsheet';
import {View,FlatList, VirtualizedList} from 'react-native';
import NavigationService from '../../../utils/NavigationService';
import FunctionPageBanner from '../../../components/FunctionPageBanner';
import { connect } from 'react-redux';
import ReportCategoriesNewsTabList          from '../../../components/Report/ReportCategoriesNewsTabList';
import ReportCategoriesTypesButton         from '../../../components/Report/ReportCategoriesTypesButton';
import * as ReportAction        from '../../../actions/ReportAction';
import { bindActionCreators } from 'redux';
import NoMoreItem from '../../../components/NoMoreItem';
import { createFilter } from 'react-native-search-filter';
import * as SQLite         from '../../../utils/SQLiteUtil';
import ReportContentItem from '../../../components/Report/ReportContentItem';
const KEYS_TO_FILTERS = ['pageName'];
import HeaderForSearch     from '../../../components/HeaderForSearch';
import ExplainCardItem     from '../../../components/ExplainCardItem';


class ReportCategoriesPage extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      isChinesKeyword: false, //用來判斷關鍵字是否為中文字
      keyword: "", //一般搜尋
      sKeyword: "", //簡體中文
      tKeyword: "", //繁體中文

      isShowSearch: false
    }
  }

  async componentDidMount() {
    let user = this.props.state.UserInfo.UserInfo;
    this.props.actions.loadReportInitState(user);
  }

  render() {
    let Report = this.props.state.Report;   //需要進行分類的資料 
    let filteredData=[];
    let numColumns =4;
    if(this.state.keyword!=""||this.state.sKeyword!=""||this.state.tKeyword!=""){
      //未填寫搜索資料不做賦值
      if (this.state.isChinesKeyword) {
        filteredData = this.props.state.Report.ReportNewsData.filter(createFilter(this.state.tKeyword, KEYS_TO_FILTERS));
        let data     = this.props.state.Report.ReportNewsData.filter(createFilter(this.state.sKeyword, KEYS_TO_FILTERS));
        for(var i in data){
          filteredData.push(data[i]);
        }
      } else {
        filteredData = this.props.state.Report.ReportNewsData.filter(createFilter(this.state.keyword, KEYS_TO_FILTERS));
      }
    }
    if(this.props.state.Report.ReportTypesData.length>4){
        numColumns=4*Math.ceil(this.props.state.Report.ReportTypesData.length/4);
    }
    //過濾關鍵字所查詢的資料
    return (
      <Container>
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
                isShowSearch: false,
                isChinesKeyword: false,
                keyword: "",
                sKeyword: "",
                tKeyword: "",
              });
            }
          }
          searchButtomOnPress = {null}
          searchButtomText={null}
          /*標題框的部分*/
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:'arrow-back'}}
          leftButtonOnPress     = {() =>NavigationService.goBack()} 
          isRightButtonIconShow = {true}
          rightButtonIcon       = {{name:'search'}}
          rightButtonOnPress    = {()=>{this.setState({ isShowSearch:true });}} 
          title                 = {this.props.state.Language.lang.ReportCategoriesPage.ReportCenter}
          titleOnPress          = {()=>{ this.setState({ isShowSearch:true }) }}
        />
      {/*内容*/}
      {
        (!this.state.isShowSearch) ?
          <Content> 
            {/*功能大圖*/}
            <FunctionPageBanner
              explain         ={this.props.state.Language.lang.ReportCategoriesPage.Introduction}
              imageBackground ={require("../../../image/functionImage/report.jpg")}
              onPress         ={() => this.ActionSheet.show()}
            />
            {/*最新報表列表*/}
            {
            <Card>
              <ExplainCardItem
                itemStyle = {{paddingBottom: 0}}
                iconName = {'document'}
                text = {this.props.state.Language.lang.ReportCategoriesPage.NewsReports}
              />
              <CardItem style={{
                paddingTop: 0,
                paddingBottom: 0
              }}
              >
                <Body style={{ 
                   flexDirection: 'row', 
                   height:(this.state.isTabDroping) ? null:this.state.tabsViewbHeight
                  }} 
                  onLayout={this.onLayoutTabsView}
                >
                 <Tab>
                    <ReportCategoriesNewsTabList 
                      data          ={Report.ReportNewsData} 
                      isRefreshing  ={this.props.state.Report.isRefreshing}
                      lang  ={this.props.state.Language.lang}
                      page          ={1}
                    />
                 </Tab> 
               </Body>
             </CardItem>                     
            </Card>
            }
            {/*報表分類別表*/}    
            <Card>
              <ExplainCardItem
                itemStyle = {{paddingBottom: 0}}
                iconName = {'folder-open'}
                text = {this.props.state.Language.lang.ReportCategoriesPage.ReportClassify}
              />
              <CardItem>
                <Body style={{flexDirection: 'column',alignItems: "center"}}>
                    <Body style={{flexDirection: 'row',alignItems: "center"}}>
                    {(this.props.state.Report.isRefreshing)?
                        <Spinner style={{flex:1}} color={this.props.style.SpinnerColor}/>
                        :
                      null
                    }
                    </Body>
                    <Body style={{flexDirection: 'row',alignItems: "center"}}>
                    {
                    (this.props.state.Report.ReportTypesData.length!=0&&!this.props.state.Report.isRefreshing)?
                     <FlatList
                       keyExtractor={(item, index) => index.toString()}
                       numColumns    = {numColumns} 
                       renderItem    = {this.renderReportCategoriesTypesButton}
                       data          = {this.props.state.Report.ReportTypesData.slice(0, numColumns)} //產生首頁中間圓圈"表單簽核"的資料
                     />
                      :
                      null
                    }
                    </Body>
                </Body>
              </CardItem>
            </Card>
          </Content>
          :
          <Content>
        {/*功能大圖*/}
            <FunctionPageBanner
              explain         ={this.props.state.Language.lang.ReportCategoriesPage.Introduction}
              imageBackground ={require("../../../image/functionImage/report.jpg")}
              onPress         ={() => this.ActionSheet.show()}
            />
            {/*搜尋結果*/}
            <Title style={{paddingTop: 20}}>{this.props.state.Language.lang.FindPage.SearchResult}</Title>
            <View style={{width:"50%", height:3, backgroundColor:"#757575", alignSelf: 'center', marginBottom: 10 }} />
            <View>
              <VirtualizedList
                keyExtractor        ={(item, index) => index.toString()}
                getItemCount        ={(data) => data.length}
                getItem             ={(data, index) => { return { key: index, item:data[index] }; }}
                data                ={filteredData}
                renderItem          ={this.renderReportContentItem}
                ListFooterComponent ={this.renderFooter}    //尾巴
              />
            </View>
          </Content>
        }
      </Container>
    );
  }

  renderReportContentItem = (item) => {
    let reportInfo=item.item.item;
    return(
      <ReportContentItem 
        selectedInfo = {reportInfo}
        inconInfo = {reportInfo.icon} 
        lang = {this.props.state.Language.lang}
        onPress     = {() => this.showReportDetail(reportInfo.page)}
      />
    );      
  }
  

  showReportDetail (page) {
    NavigationService.navigate(page);
  }

  //底部文件分類圓圈功能按鍵的地方
  renderReportCategoriesTypesButton = (item) => {
    return (
      <ReportCategoriesTypesButton 
        typesInfo = {item.item}
        onPress      = {() => this.showReportCategoriesTypesButtonPage(item.item)}
        language     = {this.props.state.Language.lang.FindPage}
      />
    );
  }

  showReportCategoriesTypesButtonPage(item) {
    NavigationService.navigate("ReportContent", {
      typeList: item,
    });
  }

  renderFooter = () => {
    if (this.props.state.Common.loading) {
      if (Platform.OS === "ios") {
        return <Text style={{alignSelf: 'center'}}>{this.props.state.Language.lang.ListFooter.Searching}</Text>;
      } else {
        return <View style={{height:200,width:"100%", paddingTop:20}}>
                  <ActivityIndicator size="large" color="#47ACF2" />
               </View>;
      }
    }else{
      return <NoMoreItem text={this.props.state.Language.lang.ListFooter.NoMore}/>;
    }
  }

}

export let ReportCategoriesPageStyle = connectStyle( 'Page.ReportPage', {} )(ReportCategoriesPage);


export default connect(
  (state) => ({
    state: {...state}
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...ReportAction,
    }, dispatch)
  })
)(ReportCategoriesPageStyle);
