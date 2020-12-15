import React from 'react';
import { Alert ,View , DeviceEventEmitter } from 'react-native';
import { Button, Text, Spinner, Icon, Body, Item, Input, Tab, Tabs, ScrollableTab , Label} from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class LoginTabsItem extends React.PureComponent  {
	constructor(props) {
	    super(props);
	    this.state = {
	    }
	}

  //tab鍵切換需重置欄位值
  onChangeTab = (e) => {
    let tempTab;
    if(this._carousel){
        if(e.i=="0"){
          tempTab=0;
          this._tabs.snapToPrev();
        }else{
          tempTab=1;
          this._tabs.snapToNext();
        }
        this.setState({
            activeSlide:tempTab
        });
    }else{
        // console.log("_carousel為null");
    }
    this.props.actions.clearTab1Data();
  }

	render() {
    let context = this.props.Language.lang.LoginPage; //LoginPage的文字內容
    
		let tab=(
			<View>
            <Tabs  
              transparent         
              ref={(c) => { this._tabs = c; return;}}
              initialPage={this.state.activeSlide} 
              onChangeTab          ={this.onChangeTab.bind(this)}
              tabBarUnderlineStyle ={{backgroundColor:"#FFFFFF"}} 
              renderTabBar={()=> <ScrollableTab style={[{backgroundColor:"rgba(0,0,0,0)",borderWidth: 0}]}/>}
            >
                <Tab 
                  heading         ={context.AdLoginButton}
                  tabStyle        ={{backgroundColor:"rgba(0,0,0,0)"}}  
                  activeTabStyle  ={{backgroundColor:"rgba(0,0,0,0)"}} 
                  activeTextStyle       ={{color:"#FFFFFF"}} 
                  textStyle={{color:"#FFFFFF"}}
                >
                  {/*
                  <LoginItemForWay
                    navigation={this.props}  
                    way="AD"
                    fromChange={this.props.fromChange}
                  />
                  */}
                </Tab>

                <Tab 
                  heading        ={context.EmpidLoginButton}
                  tabStyle       ={{backgroundColor:"rgba(0,0,0,0)"}}  
                  activeTabStyle ={{backgroundColor:"rgba(0,0,0,0)"}} 
                  activeTextStyle       ={{color:"#FFFFFF"}} 
                  textStyle={{color:"#FFFFFF"}}
                >
                  {/*
                  <LoginItemForWay
                    navigation={this.props}  
                    way="EMPID"
                    fromChange={this.props.fromChange}
                  />
                  */}
                </Tab>
            </Tabs>
    	</View>
		);

    return tab;
	}
}

export default connect(
  (state) => ({...state})
)(LoginTabsItem);