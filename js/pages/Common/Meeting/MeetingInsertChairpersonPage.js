import React from 'react';
import { View, FlatList, RefreshControl, VirtualizedList, Platform, Alert, Keyboard } from 'react-native';
import { Container, Header, Left, Content, Body, Right, Item, Input, Button, Icon, Title, Text, Card, CardItem, Label, connectStyle } from 'native-base';
import { tify, sify} from 'chinese-conv'; 
import { connect }   from 'react-redux';
import { bindActionCreators } from 'redux';
import * as RNLocalize from "react-native-localize";


import * as UpdateDataUtil    from '../../../utils/UpdateDataUtil';
import * as NavigationService from '../../../utils/NavigationService';
import ToastUnit              from '../../../utils/ToastUnit';
import HeaderForSearch        from '../../../components/HeaderForSearch';
import * as MeetingAction     from '../../../redux/actions/MeetingAction';


class MeetingInsertChairpersonPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sendValueBack     :this.props.route.params.onPress,       // 將直傳回上一個物件,
      startdate         :this.props.route.params.startdate,
      enddate           :this.props.route.params.enddate,
      isShowSearch      :false,
      isSearch          :false,
      isChinesKeyword   :false,       //用來判斷關鍵字是否為中文字
      keyword           :"",          //一般搜尋
      sKeyword          :"",          //簡體中文
      tKeyword          :"",          //繁體中文
      searchedData      :[],          //關鍵字搜尋出來的資料
      data              :[],
      isFooterRefreshing:false,
      isEnd             :false,        //紀錄搜尋結果是否已經沒有更多資料
      oid               :this.props.route.params.oid
    };
  }

  componentDidMount(){
    this.loadMoreData();
  }

  render() {
    // 紀錄是否是關鍵字搜尋結果的資料
    let contentList = this.state.isSearch ? this.state.searchedData : this.state.data;
    return (
      <Container>
        {/*標題列*/}
        <HeaderForSearch
          /*搜尋框的部分*/
          isShowSearch = {this.state.isShowSearch}
          placeholder  = {this.props.state.Language.lang.ContactPage.SearchKeyword}
          onChangeText ={(text) => { 
            let sText = sify(text);   //簡體中文
            let tText = tify(text);   //繁體中文

            if (tText === sText) {    // 不是中文字
              this.setState({ 
                keyword:text,
                isChinesKeyword:false,
                isEnd:false
              }); 
            } else {                  // 是中文字
              this.setState({ 
                sKeyword:sText,
                tKeyword:tText,
                isChinesKeyword:true,
                isEnd:false
              }); 
            }
          }}
          closeSearchButtomOnPress={() =>{
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
          }}
          searchButtomOnPress={()=>{
            Keyboard.dismiss();
            // 搜尋的值不能為空白
            let key = this.state.isChinesKeyword ? this.state.sKeyword.length : this.state.keyword.length;
            if ( key!==0 ) {
              this.setState({
                isSearch     :true,
                searchedData :[],          
                searchedCount:0,
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
          rightButtonOnPress    = {()=>{ this.setState({ isShowSearch:true }); }} 
          title                 = {this.props.lang.MeetingPage.chairpersonChoose}
          titleOnPress          = {()=>{ this.setState({ isShowSearch:true }) }}
        />
        <FlatList
          keyExtractor          ={(item, index) => index.toString()}
          data                  = {contentList}
          extraData             = {this.state.isFooterRefreshing}
          renderItem            = {this.renderTapItem}
          ListFooterComponent   = {this.renderFooter}
          onEndReachedThreshold = {0.3}
          onEndReached          = {this.state.isEnd ? null :this.loadMoreData}
        />
      </Container>
    );
  }

  loadMoreData = (isSearching, searchedData = null) => {
    isSearching = (typeof isSearching == "object") ? false : isSearching;
    let isSearch = isSearching ? isSearching : this.state.isSearch;
    searchedData = (searchedData == null) ? this.state.searchedData : searchedData;
    
    let user = this.props.state.UserInfo.UserInfo;
    let action = "org/hr/meeting/getMBManagers";

    this.setState({ isFooterRefreshing: true });
    if (!this.state.isFooterRefreshing) {
      // 是不是關鍵字搜尋
      if (isSearch) {
        let count = (searchedData.length == 0) ? searchedData.length : searchedData.length+20
        let searchList = [];

        if (this.state.isChinesKeyword) {
          let sKeyword = this.removeSpace(this.state.sKeyword); 
          let tKeyword = this.removeSpace(this.state.tKeyword); 
          searchList = [
            UpdateDataUtil.getCreateFormDetailFormat(user, action, {count:count, condition:sKeyword}),
            UpdateDataUtil.getCreateFormDetailFormat(user, action, {count:count, condition:tKeyword})
          ];
        } else {
          let keyword = this.removeSpace(this.state.keyword); 
          let lowKeyword = keyword.toLowerCase(); 
          searchList = [
            UpdateDataUtil.getCreateFormDetailFormat(user, action, {count:count, condition:keyword}),
            UpdateDataUtil.getCreateFormDetailFormat(user, action, {count:count, condition:lowKeyword}),
          ];
        }

        Promise.all(searchList).then((result) => {
          let temparray = this.state.isChinesKeyword ? [...result[0], ...result[1]]: [...result[0], ...result[1]] ;
          let isEnd = this.dealIsDataEnd(searchedData, temparray);
          this.setState({
           searchedData: isEnd? searchedData: this.dedup([...searchedData, ...temparray]),
           isFooterRefreshing:false,
           isEnd:isEnd
          })
        }).catch((err) => {
          console.log(err);
          // ToastUnit.show('error', this.props.lang.MeetingPage.searchError);
          this.setState({ 
            isShowSearch   :false,
            isSearch       :false,
            isChinesKeyword:false, 
            keyword        :"",    
            sKeyword       :"",    
            tKeyword       :"",
            searchedData   :[],
            isEnd:false,
            isFooterRefreshing:false
          });
          let message = this.props.lang.MeetingPage.searchError;
          setTimeout(function(){ 
            ToastUnit.show('error', message);
          }, 300);
          console.log(err);
        })
      } else {
        //查詢使用
        let actionObject = { 
          condition:"" 
        }; 
        // actionObject.count = this.state.data.length;

        UpdateDataUtil.getCreateFormDetailFormat(user, action, actionObject).then((result)=>{
          let isEnd = this.dealIsDataEnd(this.state.data, result);
          this.setState({
            data              :isEnd ? this.state.data: this.state.data.concat(result) ,
            isFooterRefreshing:false,
            isEnd             :isEnd
          });
        }).catch((err) => {
          this.setState({ 
            isShowSearch   :false,
            isSearch       :false,
            isChinesKeyword:false, 
            keyword        :"",    
            sKeyword       :"",    
            tKeyword       :"",
            searchedData   :[],
            searchedCount  :0,
            isEnd          :false,
            isFooterRefreshing:false
          });

          let message = this.props.lang.MeetingPage.searchError;
          setTimeout(function(){ 
            ToastUnit.show('error', message);
          }, 300);
          console.log(err);
        });
      }
    }
  }

  dealIsDataEnd = (stateData, resultData) => {
    let isEnd = false;
    if (
      resultData.length == 0 ||
      ( stateData.length != 0 && stateData[stateData.length-1].id == resultData[resultData.length-1].id )
    ) {
      isEnd = true;
    } else {
      isEnd = false;
    }

    return isEnd;
  }

  renderTapItem = (item) => {
    return (
      <Item 
        fixedLabel 
        style   ={{paddingLeft: 15, backgroundColor: this.props.style.InputFieldBackground}} 
        onPress ={ async ()=>{
          // 顯示有沒有空
          let enableMeeting = await this.checkHaveMeetingTime(item.item.id, this.state.startdate, this.state.enddate);

          if (enableMeeting) {
            this.state.sendValueBack(item.item);
            NavigationService.goBack();
          } else {
            Alert.alert(
              this.props.lang.MeetingPage.alertMessage_duplicate, //"有重複"
              `${this.props.lang.MeetingPage.alertMessage_period} ${item.item.name} ${this.props.lang.MeetingPage.alertMessage_meetingAlready}`,
              [
                { text: "OK", onPress: () => console.log("OK Pressed") }
              ],
              { cancelable: false }
            );
          }
        }} 
      >
        <Label>{item.item.name}</Label><Text note>{item.item.depname}</Text>
        <Icon 
          name='calendar-outline'
          onPress={()=>{
            // 顯示多少時間
            NavigationService.navigate("MeetingTimeForPerson", {
                person: item.item,
              });
          }}
          style={{borderWidth: 0, padding: 10, paddingRight: 20}}
        />
      </Item>
    );
  }

  renderFooter = () => {
    let footer = null
    if(this.state.isFooterRefreshing){
      footer = (
        <Item style={{padding: 15, justifyContent: 'center', backgroundColor: this.props.style.InputFieldBackground}}>
          <Label>{this.props.state.Language.lang.ListFooter.Loading}</Label>
        </Item>
      );
    }else{
      footer = (
        <Item style={{padding: 15, justifyContent: 'center', backgroundColor: this.props.style.InputFieldBackground}}>
            <Label>{this.props.state.Language.lang.ListFooter.NoMore}</Label>
        </Item>
      )
    }

    return footer;
  }

  dedup(arr) {
    var hashTable = {};

    return arr.filter(function (el) {
      var key = JSON.stringify(el);
      var match = Boolean(hashTable[key]);

      return (match ? false : hashTable[key] = true);
    });
  }

  checkHaveMeetingTime = async (id, startTime, endTime) => {
    let user = this.props.state.UserInfo.UserInfo;
    let meetingParams = {
      startdate: startTime,
      enddate  : endTime,
      attendees: [ {id:id} ],
      timezone : RNLocalize.getTimeZone(),
      oid : this.state.oid
    }
    let enableMeeting = await UpdateDataUtil.searchMeeting(user, meetingParams).then((result)=>{
      if (result.length == 0) {
        return true;
      } else {
        return false;
      }
    }).catch((errorResult)=>{
      console.log("errorResult",errorResult.message);
      return false;
    });

    return enableMeeting;
  }

  removeSpace(string){
    string = string.replace(/\r\n/g,"");
    string = string.replace(/\n/g,"");
    string = string.replace(/\s/g,"");
    return string;
  }
}

export let MeetingInsertChairpersonPageStyle = connectStyle( 'Page.FormPage', {} )(MeetingInsertChairpersonPage);

export default connect(
  (state) => ({
    state: { ...state },
    lang: { ...state.Language.lang }
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...MeetingAction
    }, dispatch)
  })
)(MeetingInsertChairpersonPageStyle);