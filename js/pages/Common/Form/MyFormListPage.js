import React from 'react';
import { View, FlatList, RefreshControl, Easing, Platform } from 'react-native';
import { Container, Header, Icon, Left, Button, Body, Right, Title, Content, Text, connectStyle} from 'native-base';
import Drawer from 'react-native-drawer-menu';

import MyFormSelectListButton from '../../../components/MyFormSelectListButton';
import FormItem               from '../../../components/Form/FormItem';
import NoMoreItem             from '../../../components/NoMoreItem';
import FunctionPageBanner     from '../../../components/FunctionPageBanner';
import WaterMarkView          from '../../../components/WaterMarkView';
import HeaderForGeneral       from '../../../components/HeaderForGeneral';
import MainPageBackground     from '../../../components/MainPageBackground';
import * as NavigationService  from '../../../utils/NavigationService';
import * as UpdateDataUtil     from '../../../utils/UpdateDataUtil';
import ToastUnit               from '../../../utils/ToastUnit';


import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LoginAction       from '../../../redux/actions/LoginAction';
import * as MyFormAction from '../../../redux/actions/MyFormAction';

class MyFormListPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // 我立案 / 我追蹤 / 我經手
      defaultFormState: this.props.state.MyForm.FormSelectState[0],
      FormStateList   : this.props.state.MyForm.FormSelectState,

      defaultFormTime: {  // 表單時間
        key  : "M",
        label: this.props.lang.MyFormListPage.FormTimeM
      },
      FormTimeList: [
        {
          key  : "M",    
          label: this.props.lang.MyFormListPage.FormTimeM
        },
        {
          key  : "M3",
          label: this.props.lang.MyFormListPage.FormTimeM3
        },
        {
          key  : "M6",
          label: this.props.lang.MyFormListPage.FormTimeM6
        },
        {
          key  : "Y",
          label: this.props.lang.MyFormListPage.FormTimeY
        }
      ],

      defaultFormProgress: {  // 表單進度
        key  : "all",
        label: this.props.lang.MyFormListPage.FormProgressAll
      },
      FormProgressList: [
        {
          key  : "all",
          label: this.props.lang.MyFormListPage.FormProgressAll
        },
        {
          key  : "running",
          label: this.props.lang.MyFormListPage.FormProgressRunning
        },
        {
          key  : "complete",
          label: this.props.lang.MyFormListPage.FormProgressComplete
        }
      ],

      defaultMainFormType: {  // 所有主表單分類
        key  : "all",
        label: this.props.lang.MyFormListPage.FormTypeAll
      },

      defaultFormType: {  // 所有子表單內容
        key  : "all",
        label: this.props.lang.MyFormListPage.FormTypeAll
      },
      FormTypes:[
      {
        key  : "all",
        label: this.props.lang.MyFormListPage.FormTypeAll
      }
      ],
      enabledFormTypesSelect:false
    }
  }

  componentDidMount() {
    this.props.actions.myFormInitial(this.props.state.UserInfo.UserInfo);
  }
  
  componentDidUpdate(){
    // 檢查是否有錯誤訊息
    if(this.props.state.MyForm.loadMessgae){
      ToastUnit.show('error', this.props.state.MyForm.loadMessgae);
    }
  }

  render() {
    let myFormListPage = (
      <Drawer
          ref            ={(comp) => {this.drawer = comp;}}
          drawerWidth    ={this.props.style.PageSize.width*0.8}
          drawerContent  ={this.renderDrawerContent()}
          type           ={Drawer.types.Overlay}
          drawerPosition ={Drawer.positions.Right}
          easingFunc     ={Easing.ease}
        >

        <Container>
          <MainPageBackground height={null}/>
          {/*標題列*/}
          <HeaderForGeneral
            isLeftButtonIconShow  = {true}
            leftButtonIcon        = {{name:"arrow-back"}}
            leftButtonOnPress     = {() =>NavigationService.goBack()} 
            isRightButtonIconShow = {true}
            rightButtonIcon       = {{name:"funnel"}}
            rightButtonOnPress    = {()=>{this.drawer.openRightDrawer();}} 
            title                 = {this.props.state.Language.lang.HomePage.MyForm}
            isTransparent         = {false}
          />
          {/*內容資料*/}
          {
            !this.props.state.MyForm.isRefreshing ?
              <FlatList
                  keyExtractor        ={(item, index) => index.toString()}
                  data                = {this.props.state.MyForm.Forms}
                  ListHeaderComponent = {this.renderHeader}
                  renderItem          = {this.renderFormItem}
                  ListFooterComponent = {this.renderFooter}
                  refreshControl      ={
                    <RefreshControl
                      refreshing ={this.props.state.MyForm.isRefreshing}
                      onRefresh  ={this.handleOnRefresh.bind(this)}
                      colors     ={[this.props.style.titleFontColor]}
                      tintColor  ={this.props.style.titleFontColor}
                    />
                  }
              />
            :
              <NoMoreItem text={this.props.state.Language.lang.ListFooter.Loading}/>
          }
            

            
        </Container>
      </Drawer>
    );

    return (
      <WaterMarkView 
        contentPage = {myFormListPage} 
        pageId = {"MyFormListPage"}
      />
    );
  }

  renderHeader = () => {
    return(
      <FunctionPageBanner
        explain         ={this.props.state.Language.lang.MyFormListPage.FunctionInfo}
        isShowButton    ={false}
        buttonText      ={null}
        imageBackground ={require("../../../image/functionImage/myForm.jpg")}
        onPress         ={null}
      />
    );
  }

  renderFooter = () => {
    if (this.props.state.MyForm.showFooter) {
      return (<NoMoreItem text={this.props.lang.ListFooter.NoMore}/>); 
      /*
      return (
        <View style={{ height: 100, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 10}}>
            <Text>{this.props.lang.ListFooter.NoMore}</Text>
        </View>
      )
      */
    } else {
      return (
        <View style={{ height: 100, width:"100%"}} />
      )
    }
  }

  renderDrawerContent = () => {
    let containerBgColor = this.props.state.Theme.theme.variables.containerBgColor; 
    let contentStyle = this.props.state.Theme.theme.variables.contentStyle;
    let bpmFunctionEnable = false;

    for(let functiondata of this.props.state.Home.FunctionData){
      if ( functiondata.ID == "Sign" ) {
        bpmFunctionEnable = true;
        break;
      }
    }


    if (Platform.OS === "ios") {
      return(
        <Container style={{backgroundColor: containerBgColor=="rgba(0,0,0,0)" ? contentStyle: containerBgColor }}>
          {/*標題列*/}
          <HeaderForGeneral
            isLeftButtonIconShow  = {true}
            leftButtonIcon        = {{name:"close"}}
            leftButtonOnPress     = {()=>{this.drawer.closeRightDrawer();}} 
            isRightButtonIconShow = {false}
            rightButtonIcon       = {null}
            rightButtonOnPress    = {null} 
            title                 = {this.props.state.Language.lang.MyFormListPage.AdvanceSearch}
            isTransparent         = {false}
          />
          <Content>

            {
              bpmFunctionEnable ? 
                <MyFormSelectListButton
                  text={this.props.state.Language.lang.MyFormListPage.FormState}   //表單狀態
                  defaultData={this.state.defaultFormState} 
                  data={this.state.FormStateList}
                  onPress={(item, index) => {
                    for (var i in this.state.FormStateList) {
                      if (this.state.FormStateList[i].label == item) {
                        this.setState({
                          defaultFormState: this.state.FormStateList[i]
                        });
                      }
                    }
                  }}
                />
              :
                null
            }
            

            <MyFormSelectListButton
              text={this.props.state.Language.lang.MyFormListPage.FormTime}   //時間長度
              defaultData={this.state.defaultFormTime} 
              data={this.state.FormTimeList}
              onPress={(item) => {
                for (var i in this.state.FormTimeList) {
                  if (this.state.FormTimeList[i].label == item) {
                    this.setState({
                      defaultFormTime: this.state.FormTimeList[i]
                    });
                  }
                }
              }}
            />

            <MyFormSelectListButton
              text={this.props.state.Language.lang.MyFormListPage.FormProgress}   //表單進度
              defaultData={this.state.defaultFormProgress} 
              data={this.state.FormProgressList}
              onPress={(item) => {
                for (var i in this.state.FormProgressList) {
                  if (this.state.FormProgressList[i].label == item) {
                    this.setState({
                      defaultFormProgress: this.state.FormProgressList[i]
                    });
                  }
                }
              }}
            />

            {
              bpmFunctionEnable ?
                <MyFormSelectListButton
                  text={this.props.state.Language.lang.MyFormListPage.FormType}  //表單主類
                  defaultData={this.state.defaultMainFormType} 
                  data={this.props.state.MyForm.FormTypes}
                  onPress={(item, index) => {
                    index = 0;
                    for (var i in this.props.state.MyForm.FormTypes) {
                      if (this.props.state.MyForm.FormTypes[i].label == item) {
                        index=i;
                      }
                    }

                    if (index != 0) {
                      this.setState({
                        defaultMainFormType: this.props.state.MyForm.FormTypes[index],
                        defaultFormType: {  
                          key  : "all",
                          label: this.props.lang.MyFormListPage.FormTypeAll
                        },
                        FormTypes:[
                          {
                            key  : "all",
                            label: this.props.lang.MyFormListPage.FormTypeAll
                          }, 
                          ...this.props.state.MyForm.FormTypes[index].content
                        ],
                        enabledFormTypesSelect: true
                      });
                    } else {
                      this.setState({
                        defaultMainFormType: this.props.state.MyForm.FormTypes[index],
                        defaultFormType: {  
                          key  : "all",
                          label: this.props.lang.MyFormListPage.FormTypeAll
                        },
                        FormTypes:[{
                            key  : "all",
                            label: this.props.lang.MyFormListPage.FormTypeAll
                          }],
                        enabledFormTypesSelect: false
                      });
                    }
                    
                  }}
                />
              :
                null
            }

            {
              bpmFunctionEnable ?
                <MyFormSelectListButton
                  enabled     ={this.state.enabledFormTypesSelect}
                  text        ={this.props.state.Language.lang.MyFormListPage.FormSubType}   //表單子類
                  defaultData ={this.state.defaultFormType} 
                  data        ={this.state.FormTypes}
                  onPress={(item, index) => {
                    for (var i in this.state.FormTypes) {
                      if (this.state.FormTypes[i].label == item) {
                        this.setState({
                          defaultFormType: this.state.FormTypes[i]
                        });
                      }
                    }

                  }}
                  enabledFormTypesSelect = {this.state.enabledFormTypesSelect}
                />
              :
                null
            }
            

            

            <Body style={{height:this.props.style.PageSize.height*0.1}}/>
            <Button block info 
              style={{width:"70%", alignSelf: 'center'}}
              onPress={this.setSelect}
            >
              {/*搜尋*/}
              <Text>{this.props.state.Language.lang.MyFormListPage.Search}</Text>
            </Button>

          </Content>
        </Container>
      );
    } else {
      return(
        <Container style={{backgroundColor: containerBgColor=="rgba(0,0,0,0)" ? contentStyle: containerBgColor }}>
          {/*標題列*/}
          <HeaderForGeneral
            isLeftButtonIconShow  = {true}
            leftButtonIcon        = {{name:"close"}}
            leftButtonOnPress     = {()=>{this.drawer.closeRightDrawer();}} 
            isRightButtonIconShow = {false}
            rightButtonIcon       = {null}
            rightButtonOnPress    = {null} 
            title                 = {this.props.state.Language.lang.MyFormListPage.AdvanceSearch}
            isTransparent         = {false}
          />
          <Content>
            <MyFormSelectListButton
              text        ={this.props.state.Language.lang.MyFormListPage.FormState}   //表單狀態
              defaultData ={this.state.defaultFormState} 
              data        ={this.state.FormStateList}
              onPress={(item, index) => {
                this.setState({
                  defaultFormState: this.state.FormStateList[index]
                });
              }}
            />

            <MyFormSelectListButton
              text        ={this.props.state.Language.lang.MyFormListPage.FormTime}   //時間長度
              defaultData ={this.state.defaultFormTime} 
              data        ={this.state.FormTimeList}
              onPress={(item, index) => {
                this.setState({
                  defaultFormTime: this.state.FormTimeList[index]
                });
              }}
            />

            <MyFormSelectListButton
              text        ={this.props.state.Language.lang.MyFormListPage.FormProgress}   //表單進度
              defaultData ={this.state.defaultFormProgress} 
              data        ={this.state.FormProgressList}
              onPress={(item, index) => {
                this.setState({
                  defaultFormProgress: this.state.FormProgressList[index]
                });
              }}
            />

            <MyFormSelectListButton
              text        ={this.props.state.Language.lang.MyFormListPage.FormType}  //表單主類
              defaultData ={this.state.defaultMainFormType} 
              data        ={this.props.state.MyForm.FormTypes}
              onPress={(item, index) => {
                
                if (index) {
                  this.setState({
                    defaultMainFormType: this.props.state.MyForm.FormTypes[index],
                    FormTypes:[
                      {
                        key  : "all",
                        label: this.props.lang.MyFormListPage.FormTypeAll
                      }, 
                      ...this.props.state.MyForm.FormTypes[index].content
                    ],
                    enabledFormTypesSelect: true
                  });
                } else {
                  this.setState({
                    defaultMainFormType: this.props.state.MyForm.FormTypes[index],
                    FormTypes:[{
                        key  : "all",
                        label: this.props.lang.MyFormListPage.FormTypeAll
                      }],
                    enabledFormTypesSelect: false
                  });
                }
              }}
            />

            <MyFormSelectListButton
              enabled     ={this.state.enabledFormTypesSelect}
              text        ={this.props.state.Language.lang.MyFormListPage.FormSubType}   //表單子類
              defaultData ={this.state.defaultFormType} 
              data        ={this.state.FormTypes}
              onPress={(item, index) => {
                this.setState({
                  defaultFormType: this.state.FormTypes[index],
                });
              }}
            />

            <Body style={{height:this.props.style.PageSize.height*0.1}}/>
            <Button block info 
              style={{width:"70%", alignSelf: 'center'}}
              onPress={this.setSelect}
            >
              {/*搜尋*/}
              <Text>{this.props.state.Language.lang.MyFormListPage.Search}</Text>
            </Button>

          </Content>
        </Container>
      );
    }
  }

  setSelect = () => {
    let State    = this.state.defaultFormState.key;
    let Time     = this.state.defaultFormTime.key;
    let Progress = this.state.defaultFormProgress.key;
    let Protype  = this.state.defaultMainFormType.key;
    let Type     = this.state.defaultFormType.key;

    this.props.actions.loadMyFormIntoState(
      this.props.state.UserInfo.UserInfo,
      State,
      Time,
      Progress,
      Protype,
      Type,
    );
    
    this.drawer.closeRightDrawer()
  }

  renderFormItem = (item) => {
    let index = item.index;
    item = item.item;
    return(
      <FormItem 
        item = {item}
        onPress = {() => this.goNext(item)}
        myFormList={true}
        Lang_FormStatus = {this.props.state.Language.lang.FormStatus}
      />
    );
  }

  goNext(item) {
    NavigationService.navigate("MyForm", { Form:item });  // 表單獲取失敗要show 出提示訊息
  }

  handleOnRefresh(){
    /*
    this.props.actions.loadMyFormIntoState(
      this.props.state.UserInfo.UserInfo,
      this.state.defaultFormState.key,
      this.state.defaultFormTime.key,
      this.state.defaultFormProgress.key,
      this.state.defaultFormType.key,
    );
    */

    let State    = this.state.defaultFormState.key;
    let Time     = this.state.defaultFormTime.key;
    let Progress = this.state.defaultFormProgress.key;
    let Protype  = this.state.defaultMainFormType.key;
    let Type     = this.state.defaultFormType.key;

    this.props.actions.loadMyFormIntoState(
      this.props.state.UserInfo.UserInfo,
      State,
      Time,
      Progress,
      Protype,
      Type,
    );
  }
}


export let MyFormListPageStyle = connectStyle( 'Page.FormPage', {} )(MyFormListPage);
export default connect(
  (state) => ({
    state: {...state},
    lang: state.Language.lang
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      // ...LoginAction,
      ...MyFormAction
    }, dispatch)
  })
)(MyFormListPageStyle);