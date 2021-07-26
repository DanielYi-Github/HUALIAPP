import React from 'react';
import {ScrollView, View, FlatList, RefreshControl, Platform, SectionList, ActivityIndicator,Keyboard } from 'react-native';
import {Container,Header,Content,Icon,Button,Body,Right,Title,Item,Input,Text,Card,CardItem,Left, connectStyle} from 'native-base';
import {tify, sify} from 'chinese-conv';
import SearchInput, { createFilter } from 'react-native-search-filter';
const KEYS_TO_FILTERS = ['NAME', 'ID'];
import * as NavigationService from '../../utils/NavigationService';

import MainPageBackground from '../../components/MainPageBackground';
import FunctionButton     from '../../components/FunctionButton';
import FindPageFilterItem from '../../components/FindPageFilterItem';
import NoMoreItem         from '../../components/NoMoreItem';
import WaterMarkView      from '../../components/WaterMarkView';
import ExplainCardItem    from '../../components/ExplainCardItem';

import { connect }           from 'react-redux';
import { bindActionCreators }from 'redux';
import * as HomeAction       from '../../redux/actions/HomeAction';
import * as CommonAction     from '../../redux/actions/CommonAction';

class FindPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChinesKeyword       :false,    //用來判斷關鍵字是否為中文字
      keyword               :"",       //一般搜尋
      sKeyword              :"",       //簡體中文
      tKeyword              :"",       //繁體中文
      searchResultHeight    :0,
      isShowSearchButton_ios:true
    }
  }

  render() {
    /***進行功能鍵查詢的篩選動作***/
      let filteredData = [];
      if (this.state.isChinesKeyword) {
        filteredData = this.props.state.Home.FunctionData.filter(createFilter(this.state.tKeyword, KEYS_TO_FILTERS));
        let data     = this.props.state.Home.FunctionData.filter(createFilter(this.state.sKeyword, KEYS_TO_FILTERS));
        for(var i in data){
          filteredData.push(data[i]);
        }
      } else {
        filteredData = this.props.state.Home.FunctionData.filter(createFilter(this.state.keyword, KEYS_TO_FILTERS));
      }
    /***篩選動作結束***/

    // /***進行功能鍵布局的排版動作***/
      let ExplainCardItemView = [];
      for(var typeI in this.props.state.Home.FunctionType){
        let tempItemList = [];
        for(var j in filteredData){
            if(filteredData[j].MODULE_OID==this.props.state.Home.FunctionType[typeI].oid){
              tempItemList.push(filteredData[j]);
            }
        }
        /***進行功能鍵布局的排版動作***/
        let cardItems = [];
        let cardItemList = [];
        let cardItemView = [];
        
        for(var i in tempItemList){
          cardItems.push(tempItemList[i]);
          if( (parseInt(i)+1) % 4 == 0 ){
            cardItemList.push(cardItems);
            cardItems = [];
          }
        }
        
        if (cardItems.length != 0) {
          for (var i = cardItems.length ; i < 4; i++) {
            cardItems.push({ID:"SPACE"});
          }
          cardItemList.push(cardItems);
          cardItems = [];  
        }

        for(var k in cardItemList){
          cardItemView.push(
            <CardItem style={{paddingTop: 0}} key={k}>
             <ScrollView >
                <FlatList
                  keyExtractor={(item, index) => index.toString()}
                  numColumns    = {4} 
                  renderItem    = {this.renderFunctionButton}
                  data          = {cardItemList[k]}
                />
             </ScrollView>
            </CardItem>
          )
        }
        if (cardItemList.length!=0) {    
             ExplainCardItemView.push(
              <Card key={typeI}>
                <ExplainCardItem
                  iconName = {'apps'}
                  text = {this.props.state.Home.FunctionType[typeI].NAME}
                />
                {cardItemView}
              </Card>
            ) 
        }

      }

    /***排版動作結束***/

    /***進行搜尋結果資料剃除動作***/
      let searchResultCard = [];
      for (let [i, card] of this.props.state.Common.keywordSearchResult.entries() ) {
        searchResultCard.push(
          <Card key={i}>
            {this.setSearchResultTitle(card)}

            <FlatList
              keyExtractor ={(item, index) => index.toString()}
              renderItem   = {this.renderItem}
              data         = {card.data.slice(0, 3)}
              ItemSeparatorComponent = {this.renderSeparator}
            />
            {
              (card.data.slice(0, 3).length >= 3) ?
                <CardItem header button onPress={this.goSearchDetail.bind(this, card)}
                  style={{
                    flexDirection : 'row', 
                    justifyContent: 'space-between', 
                    borderTopWidth: 1, 
                    borderTopColor: '#e6e6e6'}}>
                  <Text note>{this.props.state.Language.lang.Common.ViewMore} {card.title}</Text>
                  <Right style={{flex:0}}>
                    <Icon name="arrow-forward" />
                  </Right>
                </CardItem>
              : 
                null
            }
          </Card>
        );
      }
    /***資料剃除動作結束***/

    return (
      <Container>
        <MainPageBackground />
        {
          (Platform.OS === "ios") ?
            <View>
              <Header noShadow transparent style={{height:null}}>
                <Left>
                  <Title style={{ fontSize: 40, color: this.props.style.HeaderTitleColor}}>
                    {this.props.state.Language.lang.MainPage.Find}
                  </Title>
                </Left>
              </Header>
              <Header noShadow transparent searchBar rounded style={{height:null}} >
                <Item style={{
                  width:'100%', 
                  flex:0, 
                  borderRadius: 10, 
                  marginTop:10, 
                  marginBottom:10, 
                  backgroundColor:this.props.style.iosSearchBarBackgroundColor
                }}>
                       <Icon name="search"/>
                       <Input 
                          placeholder     ={this.props.state.Language.lang.ContactPage.SearchKeyword}
                          keyboardType    = "web-search" 
                          returnKeyType   = "search"
                          clearButtonMode = "while-editing" 
                          value           = {this.state.keyword}
                          onChangeText ={(text) => { 
                            let sText = sify(text);   //簡體中文
                            let tText = tify(text);   //繁體中文
                            if (tText === sText) {    // 不是中文字
                              this.setState({ 
                                keyword:text,
                                isChinesKeyword:false,
                                isShowSearchButton_ios: true
                              }); 
                            } else {                  // 是中文字
                              this.setState({ 
                                keyword:text,
                                sKeyword:sText,
                                tKeyword:tText,
                                isChinesKeyword:true,
                                isShowSearchButton_ios: true
                              }); 
                            } 
                          }}
                          onSubmitEditing = {this.onSubmitEditing}
                        />
                        {
                          (this.state.isShowSearchButton_ios) ?
                            <Title style={[this.props.style.ExplainText,{paddingRight:15, paddingLeft:10}]} onPress={this.onSubmitEditing}>
                              {this.props.state.Language.lang.Common.Search}
                            </Title>
                          :
                            <Text style={{paddingRight:15, paddingLeft:10 }} 
                              onPress={()=>{
                                this.setState({
                                  keyword:"",
                                  sKeyword:"",
                                  tKeyword:"",
                                  isChinesKeyword:false,
                                  isShowSearchButton_ios: true
                                });
                              }}
                            >
                              {this.props.state.Language.lang.Common.Close}
                            </Text>                      
                        }
                </Item>
              </Header>
            </View>
          :
            <View>
                <Header noShadow style={this.props.style.Transparent}>
                  <Body style={{marginLeft: 10}}>
                    <Title style={{ fontSize: 40, color: this.props.style.HeaderTitleColor }}>
                      {this.props.state.Language.lang.MainPage.Find}
                    </Title>
                  </Body>
                  <Right/>
                </Header>
                <Header noShadow style={this.props.style.Transparent} searchBar rounded>
                  <Item style={{borderRadius: 10}}>
                     <Icon name="search" />
                     <Input 
                        placeholder={this.props.state.Language.lang.ContactPage.SearchKeyword}
                        keyboardType    = "web-search" 
                        returnKeyType   = "search"
                        clearButtonMode = "while-editing" 
                        value           = {this.state.keyword}
                        onChangeText ={(text) => { 
                          let sText = sify(text);   //簡體中文
                          let tText = tify(text);   //繁體中文
                          if (tText === sText) {    // 不是中文字
                            this.setState({ 
                              keyword:text,
                              isChinesKeyword:false
                            }); 
                          } else {                  // 是中文字
                            this.setState({ 
                              keyword:text,
                              sKeyword:sText,
                              tKeyword:tText,
                              isChinesKeyword:true
                            });
                          } 
                        }}
                        onSubmitEditing = {this.onSubmitEditing}
                      />
                      {
                        (this.state.keyword != "") ?
                           <Icon name="close" onPress={()=>{
                            this.setState({
                              keyword:"",
                              sKeyword:"",
                              tKeyword:"",
                              isChinesKeyword:false,
                            });
                          }}/>
                        :
                          null
                      }
                      <Title style={[this.props.style.ExplainText, {paddingRight:15, paddingLeft:10}]} onPress={this.onSubmitEditing}>
                          {this.props.state.Language.lang.Common.Search}
                      </Title>
                  </Item>
                </Header>
            </View>
        }
        <Content>
          {ExplainCardItemView}
          {/*搜尋結果*/}
          <Title style={{paddingTop: 20, color:this.props.style.dynamicTitleColor}}>{this.props.state.Language.lang.FindPage.SearchResult}</Title>
          <View 
            style={{
              width:"50%", 
              height:3, 
              backgroundColor:this.props.style.dashBackgroundColor, 
              alignSelf: 'center', 
              marginBottom: 10 
            }} 
          />
          <WaterMarkView 
            contentPage = {
              <View onLayout={this.onLayout}>
                {searchResultCard}
              </View>
            } 
            pageId = {"FindPageResultList"}
            height = {this.state.searchResultHeight}
          />

          {this.renderFooter()}
        </Content>
      </Container>
    );
  }

  renderSeparator = () => {
    return <View style={{ height: 1, backgroundColor: '#e6e6e6', width: '90%', alignSelf: 'center' }}/>;
  }

  renderFooter = () => {
    if (this.props.state.Common.loading) {
      if (Platform.OS === "ios") {
        return <Text style={[{alignSelf: 'center'}]}>{this.props.state.Language.lang.ListFooter.Searching}</Text>;
      } else {
        return <View style={{height:200,width:"100%", paddingTop:20}}>
                  <ActivityIndicator size="large" color="#47ACF2" />
               </View>;
      }
    }else{
      return <NoMoreItem text={this.props.state.Language.lang.ListFooter.NoMore}/>;
    }
  }

  renderFunctionButton = (item) => {
    return (
      <FunctionButton 
        functionInfo = {item.item}
        onPress      = {() => this.showFunctionPage(item)}
        language     = {this.props.state.Language.lang.FindPage}
      />
    );
  }

  showFunctionPage(item) {
    let app = item.item;
    let userID = this.props.state.UserInfo.UserInfo.id;
    this.props.actions.navigateFunctionPage(app, userID);
  }

  onSubmitEditing = () => {
    //判斷搜尋框內有無值
    if(this.state.keyword.replace(/^[\s　]+|[\s　]+$/g, "").length != 0){
      this.props.actions.findPageKeywordSearch( this.state.isChinesKeyword, this.state.keyword, this.state.tKeyword, this.state.sKeyword);
      this.setState({
        isShowSearchButton_ios: false
      });
      Keyboard.dismiss();      
    }
  }

  renderItem = (item) => {
    return <FindPageFilterItem 
              item = {item} 
              Lang_FormStatus = {this.props.state.Language.lang.FormStatus}
              isFindPageFilter = {true} 
              actions = {this.props.actions}
           />
  }

  setSearchResultTitle = (card) => {
    let iconName;
    switch(card.type) {
      case "CAR":
        iconName = "car";
        break;
      case "MSG":
        iconName = Platform.OS == "ios" ? "chatbox":"chatboxes";
        break;
      case "NOT":
        iconName = "briefcase";
        break;
       case "SIG":
        iconName = "create";
        break;
       case "MYF":
        iconName = Platform.OS == "ios" ? "newspaper":"paper";
        break;
       case "CON":
        iconName = "call";
        break;
      default:
        iconName = "search";
    }

    return (
      <CardItem header style={{
        borderBottomWidth: 1, 
        borderBottomColor: '#e6e6e6'
      }}>
        <Icon style={this.props.style.ExplainText} name={iconName}/>
        <Text style={this.props.style.ExplainText}>{card.title}</Text>
      </CardItem>
    );
  }

  goSearchDetail = (item) => {
    NavigationService.navigate('FindDetailList', {
      item:item
    })
  }

  onLayout = (event) => {
    let {width, height} = event.nativeEvent.layout
    this.setState({
      searchResultHeight:height
    });
  }
}

export let FindPageStyle = connectStyle( 'Page.FindPage', {} )(FindPage);

export default connect(
  (state) => ({
    state: {...state}
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...HomeAction,
      ...CommonAction
    }, dispatch)
  })
)(FindPageStyle);
