import React from 'react';
import { FlatList} from 'react-native';
import { Container } from 'native-base';

import * as NavigationService  from '../../../utils/NavigationService';
import DocumentContentItem from '../../../components/Document/DocumentContentItem';
import HeaderForGeneral  from '../../../components/HeaderForGeneral';
import NoMoreItem from '../../../components/NoMoreItem';
import MainPageBackground     from '../../../components/MainPageBackground';
import { connect } from 'react-redux';
import * as UpdateDataUtil from '../../../utils/UpdateDataUtil';
import { bindActionCreators }   from 'redux';
import * as DocumentAction      from '../../../redux/actions/DocumentAction';

class DocumentNewsContentPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      DocContentData :this.props.state.Document.GroupFileNewsData,
      isLoading   :false,
      showFooter  :false,
      isFooterRefreshing: false,
      isEnd             :this.props.state.Document.GroupFileNewsData.length<10?true:false
    }
  }


  render() {

    return (
      <Container>
        <MainPageBackground height={null}/>
        {/*標題列*/}
        <HeaderForGeneral
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:"arrow-back"}}
          leftButtonOnPress     = {this.cancelSelect.bind(this)} 
          isRightButtonIconShow = {false}
          rightButtonIcon       = {null}
          rightButtonOnPress    = {null} 
          title                 = {this.props.state.Language.lang.DocumentCategoriesPage.NewsFiles}
          isTransparent         = {false}
        />
          <FlatList
            keyExtractor          ={(item, index) => index.toString()}
            data                  = {this.state.DocContentData}
            extraData             = {this.state}
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
        UpdateDataUtil.getGroupFileNewsData(user, this.props.state.Language.langStatus, {page:page, condition:null}).then((dataT)=>{
            let tempData = [ ...this.state.DocContentData,...dataT];
            this.setState({
              DocContentData: tempData,
              isFooterRefreshing:false,
              isEnd:false,
              isLoading:false
            });
            this.props.actions.loadGroupFilesNewsState(tempData);
        })
      }
    }
  }



  renderDocContentItem = (item) => {
    let data=item;
    if (data.item.icon == null ) return null;
    return(
      <DocumentContentItem 
        selectedInfo = {data.item}
        inconInfo    = {data.item.icon} 
        lang         = {this.props.state.Language.lang}
        onPress      = {() => this.showDocDetail(data)}
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
      ...DocumentAction,
    }, dispatch)
  })
)(DocumentNewsContentPage);