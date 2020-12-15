import React from 'react';
import { Alert, View, VirtualizedList } from 'react-native';
import { Container, Content } from 'native-base';

import DocumentDetailItem from '../../../components/Document/DocumentDetailItem';
import NoMoreItem from '../../../components/NoMoreItem';
import HeaderForGeneral  from '../../../components/HeaderForGeneral';
import { connect } from 'react-redux';

import * as NavigationService  from '../../../utils/NavigationService';
import * as UpdateDataUtil from '../../../utils/UpdateDataUtil';


class DocumentDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detailData: this.props.route.params.data,
      detailList :[],
      detailTile :"",
      isLoading   :false,
      showFooter  :false
    }
  }

  componentDidMount() {
    this.loadDocContentData(); 
  }

  loadDocContentData = () => {
    let user = this.props.state.UserInfo.UserInfo;
    UpdateDataUtil.getGroupFileDetailData(user,this.state.detailData.item.tid,this.state.detailData.item.did).then((dataD)=>{
       
        if(dataD!=null){
          if(dataD.code=="0"){
            //token無效，需要登出
            setTimeout(() => {
              Alert.alert(
                this.props.state.Language.lang.CreateFormPage.Fail,
                this.props.state.Language.lang.Common.TokenTimeout, [{
                  text: 'OK',
                  onPress: () => {
                    NavigationService.goBack();
                  }
                }], {
                  cancelable: false
                }
              )
            }, 200);
          }else{
              this.setState({
                detailList: dataD,
                detailTile :this.state.detailData.item.detail,
                isLoading: false,
                showFooter: true
              });
          }
        }else{
            this.setState({
              detailList: [],
              isLoading: false,
              showFooter: true
            });
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
    }).catch((e)=>{
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
          title                 = {this.state.detailTile}
          isTransparent         = {false}
        />
        <Content> 
          <View>
            <VirtualizedList
              keyExtractor        ={(item, index) => index.toString()}
              getItemCount        ={(data) => data.length}
              getItem             ={(data, index) => { return { key: index, item:data[index] }; }}
              data                ={this.state.detailList}
              renderItem          ={this.renderDocContentItem}
              ListFooterComponent ={this.renderFooter}    //尾巴
            />
          </View>
        </Content> 
      </Container>
    );
  }

  renderDocContentItem = (item) => {
    return(
      <DocumentDetailItem 
        selectedInfo = {item.item} 
        onPress     = {() => this.showDocDetail(item.item.item)}
      />
    );      
  }

  async showDocDetail (item) {
      let content = {
        oid:item.oid,
        // type:item.doctype,
        type:"pdf",
        fileName:item.docname
      };
      NavigationService.navigate("ViewFile", {
        content: content,
        url:'app/eip/getGroupFileBase64Data'
      });

  }

  cancelSelect(){
    this.props.navigation.goBack();
  }


  renderFooter = () => {
    if (this.state.showFooter) {
      return (
          <NoMoreItem text={this.props.state.Language.lang.ListFooter.NoMore}/> 
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

export default connect(//需修改
  (state) => ({
    state: {...state}
  })
)(DocumentDetailPage);