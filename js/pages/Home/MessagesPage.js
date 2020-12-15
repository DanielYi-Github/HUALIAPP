import React from 'react';
import { View, Image, FlatList, Dimensions, DeviceEventEmitter, Platform} from 'react-native';
import {Container,Header,Icon,Button,Body,Right,Title,Text,Tabs,Tab,ScrollableTab,Left,connectStyle} from 'native-base';

import * as NavigationService  from '../../utils/NavigationService';
import MainPageBackground from '../../components/MainPageBackground';
import MessageItem        from '../../components/MessageItem';
import NoMoreItem         from '../../components/NoMoreItem';
import WaterMarkView      from '../../components/WaterMarkView';

// import ModalDropdown from 'react-native-modal-dropdown';            //source from https://github.com/sohobloo/react-native-modal-dropdown
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as MessageAction  from '../../redux/actions/MessageAction';
import * as CommonAction   from '../../redux/actions/CommonAction';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';

class MessagePage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let user = this.props.state.UserInfo.UserInfo;

    if(this.props.state.Network.networkStatus){   //如果有網路，先做一次更新到Server
      UpdateDataUtil.setReads(user);
    }
  }

  render() {
    let message = (
      <FlatList
        keyExtractor ={(item, index) => index.toString()}
        data         ={this.props.state.Message.Message}
        extraData    ={this.props.state.Message}
        renderItem   ={this.renderItem}
        ListEmptyComponent={this.renderEmpty}
      />
    );

    let unMessage = (
      <FlatList
        keyExtractor ={(item, index) => index.toString()}
        data         ={this.props.state.Message.UnMessage}
        renderItem   ={this.renderItem}
        ListEmptyComponent={this.renderEmpty}
      />
    );

    return (
      <Container>
        <MainPageBackground />
        {
          (Platform.OS === "ios") ?
            <Header transparent noShadow style={{height:null}}>
              <Left>
                <Title style={{fontSize: 40, color: this.props.style.HeaderTitleColor}}>{this.props.state.Language.lang.MainPage.Message}</Title>
              </Left>
              <Right>
                {/*
                <ModalDropdown  
                  ref ={(e) => this._ModalDropdown = e}
                  options       = {[{label:this.props.state.Language.lang.MessagePage.All,value:"AllRead"}]}
                  style         = {{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                  dropdownStyle = {this.props.style.dropdownStyle}
                  onSelect      = {this.dropdownOnSelect.bind(this)}
                  adjustFrame   = {this.dropdownAdjustFrame.bind(this)}
                  renderRow     = {(option,index,isSelected) => {
                    return(
                      <View style={{height: 55, justifyContent: 'center', alignItems: 'flex-start',}}>
                        <Text style={{fontSize: 18, marginLeft: 10}}>
                          {option.label}
                        </Text>
                      </View>
                    )
                  }}
                >
                  <Button transparent onPress={()=>{
                    this._ModalDropdown.show();
                  }}>
                     <Icon name={Platform.OS == "ios" ? "ellipsis-horizontal-sharp" : "more"} style={{color:this.props.style.HeaderTitleColor}}/>
                  </Button>
                </ModalDropdown>
                */}
              </Right>
            </Header>
          :
            <Header noShadow style={this.props.style.Transparent}>
              <Body style={{marginLeft: 10}}>
                <Title style={{fontSize: 40, color: this.props.style.HeaderTitleColor }}>{this.props.state.Language.lang.MainPage.Message}</Title>
              </Body>
              <Right>
                {/*
                <ModalDropdown  
                  ref ={(e) => this._ModalDropdown = e}
                  options       = {[{label:this.props.state.Language.lang.MessagePage.All,value:"AllRead"}]}
                  style         = {{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                  dropdownStyle = {this.props.style.dropdownStyle}
                  onSelect      = {this.dropdownOnSelect.bind(this)}
                  adjustFrame   = {this.dropdownAdjustFrame.bind(this)}
                  renderRow     = {(option,index,isSelected) => {
                    return(
                      <View style={{height: 55, justifyContent: 'center', alignItems: 'flex-start',}}>
                        <Text style={{fontSize: 18, marginLeft: 10}}>
                          {option.label}
                        </Text>
                      </View>
                    )
                  }}
                >
                  <Button transparent onPress={()=>{
                    this._ModalDropdown.show();
                  }}>
                     <Icon name={Platform.OS == "ios" ? "ellipsis-horizontal-sharp" : "more"} />
                  </Button>
                </ModalDropdown>
                */}
              </Right>
            </Header>
        }

        <Tabs 
          tabBarUnderlineStyle={this.props.style.TabBarUnderlineColor} 
          renderTabBar={()=> <ScrollableTab style={[this.props.style.Transparent,{borderWidth: 0}]}/>}
        >
          <Tab heading         ={this.props.state.Language.lang.MessagePage.AllRead} 
               style           ={this.props.style.Transparent}
               tabStyle        ={this.props.style.Transparent}
               activeTabStyle  ={this.props.style.Transparent}
               textStyle       ={this.props.style.subtitle}
               activeTextStyle ={this.props.style.title}
          >
                <View style={{height:15}}/>
                <WaterMarkView 
                  contentPage = {message} 
                  pageId = {"MessagePage"}
                />
          </Tab>
          <Tab heading         ={this.props.state.Language.lang.MessagePage.UnRead} 
               style           ={this.props.style.Transparent}
               tabStyle        ={this.props.style.Transparent}
               activeTabStyle  ={this.props.style.Transparent}
               textStyle       ={this.props.style.subtitle}
               activeTextStyle ={this.props.style.title}
          >
                <View style={{height:15}}/>
                <WaterMarkView 
                  contentPage = {unMessage} 
                  pageId = {"MessagePage"}
                />
          </Tab>
        </Tabs>
      </Container>
    );
  }

  renderItem = (item) => {
    return(
      <MessageItem 
        index={item.index} 
        data={item.item} 
        onPress={() => this.goNext(item.item)}
      />
    );
  }

  renderEmpty = () => {
      return <NoMoreItem text={this.props.state.Language.lang.ListFooter.NoMore}/>;
  }

  goNext = (item) => {
    this.props.actions.checkDirectorPage(item);
  }

  
  dropdownOnSelect(index, value) {
    this.props.actions.updateMessageStateAllRead(this.props.state.UserInfo.UserInfo,this.props.state.Message.Message);
  }

  dropdownAdjustFrame(style) {
    return {
      top: 32,
      height: 58,
      width: 100,
      right: 5,
    }
  }
}

export let MessagePageStyle = connectStyle( 'Page.MessagePage', {} )(MessagePage);

export default connect(
  (state) => ({
    state: {...state}
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...MessageAction,
      ...CommonAction
    }, dispatch)
  })
)(MessagePageStyle);
