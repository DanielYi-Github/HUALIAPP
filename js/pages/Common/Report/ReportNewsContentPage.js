import React from 'react';
import { View, VirtualizedList, Platform } from 'react-native';
import { Container, Header, Left, Content, Body, Item, Button, Icon, Title, Text, Right } from 'native-base';

import NavigationService from '../../../utils/NavigationService';
import ReportContentItem from '../../../components/Report/ReportContentItem';
import NoMoreItem from '../../../components/NoMoreItem';
import { connect } from 'react-redux';
import * as SQLite         from '../../../utils/SQLiteUtil';
import HeaderForGeneral  from '../../../components/HeaderForGeneral';
import ReportUtil         from '../../../utils/ReportUtil';

class ReportNewsContentPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ReportNewsContentData :[],
      isLoading   :false,
      showFooter  :false
    }
  }


  async componentDidMount() {
    await this.loadReportNewsContentData(); 
  }

  loadReportNewsContentData = async () =>{
      let dataT= [];
      var sql =ReportUtil.ReportContentSql(null,this.props.state.Language.langStatus);
      //初始化執行        
      await SQLite.selectData(sql, []).then((result) => {         
        //如果沒有找到資料，不顯示任何資料
        for(let i in result.raw()){
            let temp={
              page:result.raw()[i].page,
              pageName:result.raw()[i].content,
              inconInfo:result.raw()[i].icon,
              reportType:result.raw()[i].type,
              txdat:result.raw()[i].txdat
            }  
            dataT.push(temp);
        }
        this.setState({
          ReportNewsContentData:dataT,
          isLoading:false,
          showFooter  :true
        });
      }).catch((e)=>{
        this.setState({
          ReportNewsContentData:[],
          isLoading:false,
          showFooter  :true
        });
      });
  }


  render() {
    return (
      <Container>
        {/*標題列*/}
        <HeaderForGeneral
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:"arrow-back"}}
          leftButtonOnPress     = {this.cancelSelect.bind(this)} 
          isRightButtonIconShow = {false}
          rightButtonIcon       = {null}
          rightButtonOnPress    = {null} 
          title                 = {this.props.state.Language.lang.ReportCategoriesPage.NewsReports}
          isTransparent         = {false}
        />
        <VirtualizedList
          keyExtractor        ={(item, index) => index.toString()}
          getItemCount        ={(data) => data.length}
          getItem             ={(data, index) => { return { key: index, item:data[index] }; }}
          data                ={this.state.ReportNewsContentData}
          renderItem          ={this.renderReportContentItem}
          ListFooterComponent ={this.renderFooter} 
        />
      </Container>
    );
  }

  renderReportContentItem = (item) => {
    let reportInfo=item.item.item;
    return(
      <ReportContentItem 
        selectedInfo = {reportInfo}
        inconInfo = {reportInfo.inconInfo} 
        lang = {this.props.state.Language.lang}
        onPress     = {() => this.showReportDetail(reportInfo.page)}
      />
    );      
  }


  showReportDetail (page) {
    NavigationService.navigate(page);
  }

  cancelSelect(){
    this.props.navigation.goBack();
  }

  renderFooter = () => {
      return (
        <View style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
          <NoMoreItem text={this.props.state.Language.lang.ListFooter.NoMore}/> 
        </View>
      )
  }
}

export default connect(
  (state) => ({
    state: {...state}
  })
)(ReportNewsContentPage);