import React from 'react';
import { FlatList, Alert } from 'react-native';
import { Container } from 'native-base';

import * as NavigationService  from '../../../utils/NavigationService';
import DocumentContentItem from '../../../components/Document/DocumentContentItem';
import NoMoreItem from '../../../components/NoMoreItem';
import HeaderForGeneral  from '../../../components/HeaderForGeneral';
import { connect } from 'react-redux';
import * as UpdateDataUtil from '../../../utils/UpdateDataUtil';
import * as LoginAction      from '../../../redux/actions/LoginAction';
import { bindActionCreators }   from 'redux';

class DocumentContentPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typeList: this.props.route.params.typeList,
      DocContentData :[],
      isLoading   :true,
      showFooter  :false,
      loadMoreData:false,
      isFooterRefreshing:false,
      isEnd             :false
    }
  }

  componentDidMount() {
    this.loadDocContentData(); 
  }

  loadDocContentData = () => {
    let user = this.props.state.UserInfo.UserInfo;
    let page=1;
    UpdateDataUtil.getGroupFileContentData(user,this.state.typeList.tid,{page:page, condition:null}).then((dataT)=>{
      let isEnd = false;
      if(dataT.length==0){
        isEnd = true;
      }
        this.setState({
          DocContentData: dataT,
          isLoading: false,
          showFooter: true,
          isEnd :isEnd
        });
    }).catch((e)=>{
        this.setState({
          DocContentData: [],
          isLoading: false,
          showFooter: true,
          isEnd : true
        });
        if(e.code==0){
          this.props.actions.logout(e.message, true);
        }else{
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
          title                 = {this.state.typeList.content}
          isTransparent         = {false}
        />
        {/*千萬不能加Content,無限循環*/}
            <FlatList
              keyExtractor          ={(item, index) => index.toString()}
              data                  = {this.state.DocContentData}
              extraData             = {this.state.isFooterRefreshing}
              renderItem            = {this.renderDocContentItem}
              ListFooterComponent   = {this.renderFooter}
              onEndReachedThreshold = {0.3}
              onEndReached          = {this.state.isEnd ? null :this.loadMoreData}
            />
      </Container>
    );
  }


  loadMoreData = () => {
    this.setState({ 
      isFooterRefreshing: true,
      isLoading:true
    });

    let user = this.props.state.UserInfo.UserInfo;

    if (!this.state.isFooterRefreshing) {
      if(this.state.DocContentData.length%10!=0){
          this.setState({
            isFooterRefreshing:false,
            isEnd:true,
            isLoading:false
          });
      }else{
        let page=Math.ceil(this.state.DocContentData.length/10)+1;
        UpdateDataUtil.getGroupFileContentData(user,this.state.typeList.tid,{page:page, condition:null}).then((dataT)=>{
            let tempData = [ ...this.state.DocContentData,...dataT];
            this.setState({
              DocContentData: tempData,
              isFooterRefreshing:false,
              isEnd:false,
              isLoading:false
            });
        })
      }
    }
  }


  renderDocContentItem = (item) => {
    let inconInfo=this.state.typeList.icon;
    if (inconInfo == null ) return null;
    return(
      <DocumentContentItem 
        selectedInfo = {item.item}
        inconInfo = {inconInfo} 
        lang ={this.props.state.Language.lang}
        onPress     = {() => this.showDocDetail(item)}
      />
    );      
  }

  async showDocDetail (item) {
    NavigationService.navigate("DocumentDetail", {
      data: item,
    });
    
  }

  cancelSelect(){
    NavigationService.goBack();
  }


  renderFooter = () => {
    if (this.state.isEnd) {
        return (<NoMoreItem text={this.props.state.Language.lang.ListFooter.NoMore}/>);       
    } else {
        return <NoMoreItem text={this.props.state.Language.lang.ListFooter.Loading}/>;
    }
  }
}

export default connect(
  (state) => ({
    state: {...state}
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...LoginAction,
    }, dispatch)
  })
)(DocumentContentPage);