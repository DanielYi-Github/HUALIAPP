import React from 'react';
import { View, VirtualizedList, Platform } from 'react-native';
import { Container, Header, Left, Content, Body, Item, Button, Icon, Title, Text, Right } from 'native-base';
import { connect } from 'react-redux';
import RecruitItem         from '../../components/RecruitItem';
import NoMoreItem          from '../../components/NoMoreItem';
import HeaderForGeneral    from '../../components/HeaderForGeneral';
import * as NavigationService   from '../../utils/NavigationService';
import * as SQLite         from '../../utils/SQLiteUtil';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';


class RecruitPage extends React.Component {//帶目錄確定後ContactPage->需改成RecruitPage
  constructor(props) {
    super(props);

    this.state = {
      RecruitData :[],
      isLoading   :false,
      showFooter  :false
    }
  }

  componentDidMount() {
    this.loadRecruitData(); 
  }

  loadRecruitData = async () => {
    let data = await UpdateDataUtil.getRecruitmentList().then((result)=>{
      return result;
    }).catch((e)=>{
      return [];
    });
    
    this.setState({
      RecruitData: data,
      isLoading: false,
      showFooter: true
    });
  }

  render() {
    return (
      <Container>
        {/*標題列*/}
        <HeaderForGeneral
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:"menu"}}
          leftButtonOnPress     = {() =>this.props.navigation.toggleDrawer()} 
          isRightButtonIconShow = {false}
          rightButtonIcon       = {null}
          rightButtonOnPress    = {null} 
          title                 = {this.props.lang.RecruitInfo}
        />
        <View>
          <VirtualizedList
            keyExtractor        ={(item, index) => index.toString()}
            getItemCount        ={(data) => data.length}
            getItem             ={(data, index) => { return { key: index, item:data[index] }; }}
            data                ={this.state.RecruitData}
            renderItem          ={this.renderRecruitItem}
            ListFooterComponent ={this.renderFooter}    //尾巴
          />
        </View>
      </Container>
    );
  }

  renderRecruitItem = (item) => {
    return(
      <RecruitItem 
        recruitInfo = {item.item.item} 
        onPress     = {() => this.showRecruitDetail(item.item.item)}
      />
    );      
  }

  async showRecruitDetail (item) {
    item = await UpdateDataUtil.getRecruitment(item.oid).then((result)=>{
      let data = result.content;
      return data;
    }).catch((e)=>{
      return [];
    });

    NavigationService.navigate("RecruitDetail", {
      data: item,
    });
  }

  renderFooter = () => {
    let lang = this.props.state.Language.lang.ContactPage;//需修改
    if (this.state.showFooter) {
      return (
        <View style={{ justifyContent: 'flex-start', alignItems: 'center', height: 350 }}>
          <NoMoreItem text={this.props.state.Language.lang.ListFooter.NoMore}/> 
        </View>
      )
    } else {
      if (this.state.isLoading) {
        return <NoMoreItem text={this.props.state.Language.lang.ListFooter.Loading}/>;
      } else {
        return null;
      }
    }
  }
}

export default connect(
  (state) => ({
    state: {...state},
    lang: state.Language.lang.RecruitDetailPage
  })
)(RecruitPage);