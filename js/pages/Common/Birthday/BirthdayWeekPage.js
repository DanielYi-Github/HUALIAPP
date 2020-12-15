import React from 'react';
import {View} from 'react-native';
import { Container, Header, Left, Body , Tab, Tabs, ScrollableTab, Button, Icon, Right, connectStyle} from 'native-base';
import Carousel from 'react-native-snap-carousel';
import * as NavigationService  from '../../../utils/NavigationService';
import BirthdayWeekFlatList from '../../../components/Birthday/BirthdayWeekFlatList';
import BirthdayMineTabs     from '../../../components/Birthday/BirthdayMineTabs';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as BirthdayAction        from '../../../redux/actions/BirthdayAction';

class BirthdayWeekPage extends React.Component {
  constructor(props) {
    super(props);
console.log("BirthdayWeekPage",props);
    this.state = {
      activeSlide:0
    }
  }

  _renderItem  = ({item, index}) => {
      if(index=="1"){
          return <BirthdayMineTabs />　
      }else {
          return <BirthdayWeekFlatList　/> 
      }
  }

  render() {
    let data = [{
      title: this.props.state.Language.lang.BirthdayWeekPage.BirthdayMemList,
    }, {
      title: this.props.state.Language.lang.BirthdayWeekPage.MineAdmire,
    }];
    return (
      <Container>             
        <Header style={this.props.style.HeaderBackground,{borderColor:'red'}} searchBar rounded>
           <Left style={{flex:0}}>
              <Button transparent onPress={() =>NavigationService.goBack()}>
                  <Icon name='arrow-back' style={{color:this.props.style.iconColor}}/>
              </Button>
            </Left>
            <Body>
              <Tabs  
                transparent 
                page                 ={this.state.activeSlide}
                onChangeTab          ={this.onChangeTab}
                tabBarUnderlineStyle ={this.props.style.tabBarUnderlineStyle} 
                renderTabBar         ={()=> 
                  <ScrollableTab
                    style={{
                      backgroundColor: 'rgba(255,255,255,0)',
                      width:"95%",
                      justifyContent:"center", 
                      alignItems:"center", 
                      alignSelf:"center",
                      borderWidth:0,
                    }}
                    tabsContainerStyle={{
                      borderWidth:0,
                      width:"100%",
                      backgroundColor: 'rgba(255,255,255,0)',
                    }}
                  />
                } 
              >
                <Tab 
                  heading         ={this.props.state.Language.lang.BirthdayWeekPage.BirthdayMemList}
                  tabStyle        ={this.props.style.tabStyle}  
                  activeTabStyle  ={this.props.style.tabStyle} 
                  textStyle       ={this.props.style.HeaderSubtitle} 
                  activeTextStyle ={this.props.style.HeaderTitle}
                >
                </Tab>
                <Tab 
                  heading         ={this.props.state.Language.lang.BirthdayWeekPage.MineAdmire}
                  tabStyle        ={this.props.style.tabStyle}  
                  activeTabStyle  ={this.props.style.tabStyle} 
                  textStyle       ={this.props.style.HeaderSubtitle} 
                  activeTextStyle ={this.props.style.HeaderTitle}
                >
                </Tab>
              </Tabs>   
            </Body>
            <Right style={{flex:0}}/>
        </Header>
        <Body style={{flexDirection: 'row-reverse'}}>
            <View>
                <Carousel
                    ref          ={(c) => { this._carousel = c; }}
                    data         ={data}
                    renderItem   ={this._renderItem}
                    sliderWidth  ={400}
                    itemWidth    ={400}
                    onSnapToItem ={this.onChangeCarousel}
                />
            </View>
        </Body>
      </Container>
    );
  }

  onChangeTab = (e) => {
    if(this._carousel){
        if(e.i=="0"){
          this._carousel.snapToPrev();
        }else{
          this._carousel.snapToNext();
        }
    }else{
        // console.log("_carousel為null");
    }
  }

  onChangeCarousel = (e) => {
    this.setState({
      activeSlide: e
    });
  }
}

export let BirthdayWeekPageStyle = connectStyle( 'Page.BirthdayPage', {} )(BirthdayWeekPage);
export default connect(
  (state) => ({
    state: {...state}
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...BirthdayAction,
    }, dispatch)
  })
)(BirthdayWeekPageStyle);


