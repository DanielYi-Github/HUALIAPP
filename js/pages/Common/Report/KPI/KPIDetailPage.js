import React from "react";
import {  Spinner, Container, Content, connectStyle} from 'native-base';
import { connect } from 'react-redux';

import { Modal, View , Platform , Dimensions, Alert} from "react-native";
import * as UpdateDataUtil from '../../../../utils/UpdateDataUtil';

import HeaderForGeneral       from '../../../../components/HeaderForGeneral';
import MainPageBackground     from '../../../../components/MainPageBackground';

import Echarts from 'native-echarts';
import * as LoginAction      from '../../../../redux/actions/LoginAction';
import { bindActionCreators }   from 'redux';
import * as NavigationService  from '../../../../utils/NavigationService';

class KPIDetailPage extends React.Component {

  constructor(props) {
    super(props);

    let masterInfo = this.props.route.params.masterInfo;
    let paramInfo = this.props.route.params.paramInfo;
    this.state={
      data:[],
      proLabel1:"",
      proLabel2:"",
      masterInfo:masterInfo,
      paramInfo:paramInfo,
      defaultWidth:Dimensions.get('window').width,
      defaultHight:Dimensions.get('window').height,
      isSubmitting: true
    }
  }

  componentWillMount () {
    this.loadReportManKPIData(this.state.masterInfo,this.state.paramInfo);
  }

  loadReportManKPIData = (masterInfo,paramInfo) => { 
    this.setState({
      isSubmitting:true
    });     
    let proTotal=0;
    let yearObj=paramInfo.yearObj;
    let monthObj=paramInfo.monthObj;
    let belong=paramInfo.belong;
    let resLabel1=paramInfo.coObj.label+" "+yearObj.label+"/"+monthObj.label;

    UpdateDataUtil.getReportKPIDetailData(paramInfo.user,masterInfo.co,yearObj.key,monthObj.key,masterInfo.kpi_id,belong).then(async (data)=>{
        for(let i in data){
          let tempName="";
          data[i].label=data[i].kpi;
          proTotal=proTotal+data[i].kpi;

          for(let j=0;j<data[i].seq_name.length;j++){
            // tempName=tempName+"\\nn"+data[i].seq_name[j];
            if(j==0){
              tempName=data[i].seq_name[j];   
            }else{
              //解決換行問題
              tempName=tempName+"\\nn"+data[i].seq_name[j];       
            }
          }
          data[i].vseq_name=tempName;
          // data[i].vseq_name=data[i].seq_name;
        }
        let resLabel2=masterInfo.idname+this.props.state.Language.lang.KPICategoryPage.Total+" "+proTotal.toFixed(2);
        this.setState({
          data:data,
          proLabel1: resLabel1,
          proLabel2: resLabel2,
          isSubmitting:false
        });
    }).catch((e)=>{
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
        console.log(e);
    }); 
  }

  cancelSelect(){
    this.props.navigation.goBack();
  }

  renderActivityIndicator = () => {
    if (this.state.isSubmitting) {
      return (
        <Modal
            animationType="none"
            transparent={true}
            visible={true}
            onRequestClose={() => {
            }}>
            <Container style={{justifyContent: 'center', alignItems: 'center', backgroundColor:'rgba(255,255,255,.7)'}}>
                <Spinner color={this.props.style.SpinnerColor}/>
            </Container>
          </Modal>
      );
    }
  }

  render() {
    let charWidth=this.state.defaultWidth;
    let charHight=1000;

    let option=null;
    if(this.state.data){
      let temArray=this.state.data;
      let xlabel=[];
      let xvalue=[];
      for(let i in temArray){
        xlabel.push(temArray[i].vseq_name);
        xvalue.push(temArray[i].kpi);
      }
         option = {
              title: {
                  text: this.state.proLabel1,      //主标题
                  textStyle:{
                      color:this.props.style.HeaderTitle.color,        //颜色
                      fontStyle:'normal',     //风格
                      fontWeight:'normal',    //粗细
                      fontFamily:'Microsoft yahei',   //字体
                      fontSize:20,     //大小
                      align:'center'   //水平对齐
                  },
                  subtext:this.state.proLabel2,      //副标题
                  subtextStyle:{          //对应样式
                      color:this.props.style.HeaderTitle.color,
                      fontSize:20
                  },
                  itemGap:7,//主-副間隔
                  x:'center'
              },
              xAxis: 
                  {
                      type: 'category',
                      // axisTick: {show: false},
                      data: xlabel,
                      axisLabel: {
                          interval:0,
                          // rotate:90,
                          // x轴字体颜色
                          textStyle: {
                              color: this.props.style.HeaderTitle.color,
                              lineHeight: 20,
                              fontSize: 20
                          },
                      margin: 10//刻度标签与轴线之间的距离。
                      },
                      //y轴字体颜色
                      axisLine: {
                           lineStyle: {
                               color: this.props.style.HeaderTitle.color,
                               width:1
                           }
                      },
                  }
              ,
             height: 400,
             yAxis: {
                axisLabel: {
                    textStyle: {
                        color: this.props.style.HeaderTitle.color,
                        lineHeight: 20,
                        fontSize: 20
                    }
                },
                //y轴字体颜色
                axisLine: {
                     lineStyle: {
                         color: this.props.style.HeaderTitle.color,
                         width:1
                     }
                },
             },
             series: [{
                // name: '生產',
                type: 'bar',
                barWidth: 20, //每个条形的宽度比例
                data: xvalue,
                itemStyle: {
                  normal: {
                    color:'orange',
                    label: {//bar圖顯示數值
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: this.props.style.HeaderTitle.color,
                            fontSize: 20
                        },
                        formatter:function(params){
                            if(params.value==0){
                                return '';
                            }else{
                                return params.value;
                            }
                        }
                    }
                  }
                }
             }],
              grid: {
                  // left: '3%',     //图表距离左右上下之间的距离
                  // right: '4%',
                  top: '10%',
                  bottom: '13%',
                  // containLabel: true
              },

          };
    }



    if (Platform.OS === "ios") {
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
              title                 = {this.state.masterInfo.idname}
              isTransparent         = {false}
            />
          <Content> 
            {
              (this.props.state.Theme.themeType == "season") ?
                <MainPageBackground/>
              :
                null
            }

             <View style={[{height:15}]}  />
                {(this.state.data)?
                    <Echarts option={option} width={charWidth} height={charHight} />
                    :
                    null
                }
            </Content> 
            {this.renderActivityIndicator()}
          </Container>
          );
    } else {
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
              title                 = {this.state.masterInfo.idname}
              isTransparent         = {false}
            />
            <Content> 
              {
                (this.props.state.Theme.themeType == "season") ?
                  <MainPageBackground/>
                :
                  null
              }

             <View style={[{height:15}]}  />
                {(this.state.data)?
                    <Echarts option={option} width={charWidth} height={charHight} />
                    :
                    null
                }
            </Content> 
            {this.renderActivityIndicator()}
          </Container>
          );
    }
  }
}

export let KPIDetailPageStyle = connectStyle( 'Page.ReportPage', {} )(KPIDetailPage);

  export default connect(
  (state) => ({
    state: {...state}
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...LoginAction,
    }, dispatch)
  })
)(KPIDetailPageStyle);