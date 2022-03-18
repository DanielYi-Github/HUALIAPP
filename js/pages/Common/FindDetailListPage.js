import React from 'react';
import { View, FlatList, RefreshControl, Platform, SectionList, ActivityIndicator } from 'react-native';
import {Container,Header,Content,Icon,Button,Body,Right,Title,Item,Input,Text,Card,CardItem, Left} from 'native-base';
import {tify, sify} from 'chinese-conv';
import SearchInput, { createFilter } from 'react-native-search-filter';
const KEYS_TO_FILTERS = ['NAME', 'ID'];
import * as NavigationService  from '../../utils/NavigationService';

import MainPageBackground from '../../components/MainPageBackground';
import FindPageFilterItem from '../../components/FindPageFilterItem';
import NoMoreItem         from '../../components/NoMoreItem';
import WaterMarkView      from '../../components/WaterMarkView';
import HeaderForGeneral    from '../../components/HeaderForGeneral';

import { connect }           from 'react-redux';
import { bindActionCreators }from 'redux';
import * as HomeAction    from '../../redux/actions/HomeAction';
import * as CommonAction  from '../../redux/actions/CommonAction';

class FindDetailListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChinesKeyword:false,    //用來判斷關鍵字是否為中文字
      keyword :"",              //一般搜尋
      sKeyword:"",              //簡體中文
      tKeyword:"",              //繁體中文
      items   : this.props.route.params.item,
    }
  }

  render() {
    let findDetailListPage =  (
      <Container>
        <MainPageBackground />
        <HeaderForGeneral
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:"arrow-back"}}
          leftButtonOnPress     = {() =>NavigationService.goBack()} 
          isRightButtonIconShow = {false}
          rightButtonIcon       = {null}
          rightButtonOnPress    = {null} 
          title                 = {`${this.props.state.Language.lang.Common.More} ${this.state.items.title}`}
          isTransparent         = {true}
        />
        <FlatList
          keyExtractor ={(item, index) => index.toString()}
          renderItem   = {this.renderItem}
          data         = {this.state.items.data}
          ListFooterComponent = {this.renderFooter}
        />
      </Container>
    );

    return (
      <WaterMarkView 
        contentPage = {findDetailListPage} 
        pageId = {"FindDetailListPage"}
      />
    );
  }

  renderItem = (item) => {
    return <FindPageFilterItem 
              isNetWork   = {this.props.state.Network.networkStatus}
              item = {item} 
              Lang_FormStatus = {this.props.state.Language.lang.FormStatus} 
              isFindPageFilter = {false}
              actions = {this.props.actions}
            />
  }

  renderFooter = () => {
    return <NoMoreItem text={this.props.state.Language.lang.ListFooter.NoMore}/>;
  }
}

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
)(FindDetailListPage);