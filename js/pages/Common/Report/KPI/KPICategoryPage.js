import React from "react";
import { Modal, View , Platform , Easing, Dimensions, Alert} from "react-native";
import { Spinner, Container,  Content, Body,  Button, Text, Tabs, Tab, ScrollableTab, connectStyle} from 'native-base';
import Drawer from 'react-native-drawer-menu';
import Echarts from 'native-echarts';

import { connect } from 'react-redux';

import MyFormSelectListButton from '../../../../components/MyFormSelectListButton';
import HeaderForGeneral       from '../../../../components/HeaderForGeneral';
import MainPageBackground     from '../../../../components/MainPageBackground';
import * as SQLite            from '../../../../utils/SQLiteUtil';
import * as UpdateDataUtil    from '../../../../utils/UpdateDataUtil';
import * as LoginAction      from '../../../../redux/actions/LoginAction';
import { bindActionCreators }   from 'redux';
import * as NavigationService  from '../../../../utils/NavigationService';


class KPICategoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //初始化組件
      coObj:null,
      yearObj:null,
      monObj:null,
      defaultCo:null,
      defaultYear:null,
      defaultMon:null,
      iniComParam:false,
      //api資料
      managerKPI:null,
      productKPI:null,
      defaultWidth:Dimensions.get('window').width,
      defaultHight:Dimensions.get('window').height,
      //標籤 顯示
      proLabel1:"",
      proLabel2:"",
      manLabel1:"",
      manLabel2:"",
      isSubmitting:true,
      netError:false,
      tokenError:false
    }
  }

  async componentDidMount () {
    await this.paramInit();
    if(this.state.iniComParam){
        await this.loadReportKPI(this.state.defaultCo,this.state.defaultYear,this.state.defaultMon);
    }
  }

  loadReportKPI = async (coObj,yearObj,monthObj) => {  
    let user = this.props.state.UserInfo.UserInfo;
    this.setState({
      isSubmitting:true
    });
    await this.loadReportManKPIData(user,coObj,yearObj,monthObj);
    await this.loadReportProKPIData(user,coObj,yearObj,monthObj);
    if(this.state.tokenError){
      this.errorTip(true);
    }else if(this.state.netError){
      this.errorTip();
    }
  }

  loadReportManKPIData = async (user,coObj,yearObj,monthObj) => {      

    await UpdateDataUtil.getReportManKPIData(user,coObj.key,yearObj.key,monthObj.key).then(async (data)=>{
        if(data){
            let manTotal=0;
            // let resLabel1=coObj.label+" "+yearObj.label+monthObj.label+" ";
            let resLabel1=coObj.label+" "+yearObj.key+"/"+monthObj.key+" ";
            for(let i in data){
              let tempName="";
              data[i].label=data[i].kpi;
              manTotal=manTotal+data[i].kpi; 
              for(let j=0;j<data[i].idname.length;j++){
                if(j==0){
                  tempName=data[i].idname[j];   
                }else{
                  //解決換行問題
                  tempName=tempName+"\\nn"+data[i].idname[j];       
                }
              }
              data[i].vidname=tempName;
              // data[i].vidname=data[i].idname;
            }
            let resLabel2=this.props.state.Language.lang.KPICategoryPage.Total+" "+manTotal.toFixed(2);

            this.setState({
                managerKPI: data,
                manLabel1: resLabel1,
                manLabel2: resLabel2,
                // isSubmitting:false
            });
        }
    }).catch((e)=>{
      if(e.code==0){
        this.setState({
          tokenError:true
        });
      }else{
        this.setState({
          netError:true
        });
      }
      console.log(e);
    }); 
  }


  loadReportProKPIData = (user,coObj,yearObj,monthObj) => {  
      UpdateDataUtil.getReportProKPIData(user,coObj.key,yearObj.key,monthObj.key).then(async (data)=>{
          if(data){
            let proTotal=0;
            // let resLabel1=coObj.label+" "+yearObj.label+monthObj.label+" ";
            let resLabel1=coObj.label+" "+yearObj.key+"/"+monthObj.key+" ";
            for(let i in data){
              let tempName="";
              data[i].label=data[i].kpi;
              proTotal=proTotal+data[i].kpi;
              for(let j=0;j<data[i].idname.length;j++){
                if(j==0){
                  tempName=data[i].idname[j];   
                }else{
                  //解決換行問題
                  tempName=tempName+"\\nn"+data[i].idname[j];       
                }
              }
              data[i].vidname=tempName;
              // data[i].vidname=data[i].idname;
            }

            let resLabel2=this.props.state.Language.lang.KPICategoryPage.Total+" "+proTotal.toFixed(2);

            this.setState({
                productKPI: data,
                proLabel1: resLabel1,
                proLabel2: resLabel2,
                isSubmitting:false
            });
          }
      }).catch((e)=>{
          if(e.code==0){
            this.setState({
              tokenError:true
            });
          }else{
            this.setState({
              netError:true
            });
          }
          console.log(e);
      }); 
  }

  errorTip=(tokenError=false)=>{
        if(tokenError){
            this.props.actions.logout("token Error", true);
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
          this.setState({
            isSubmitting:false
          });
        }       
  }

  renderActivityIndicator = () => {
    if (this.state.isSubmitting) {
      return (
        <Modal
            animationType="none"
            transparent={true}
            visible={true}
            onRequestClose={() => {}}>
            <Container style={{justifyContent: 'center', alignItems: 'center', backgroundColor:'rgba(255,255,255,.7)'}}>
              <Spinner color={this.props.style.SpinnerColor}/>
            </Container>
        </Modal>
      );
    }
  }

  paramInit = async () =>{
    let coList=[];
    let yearList=[];
    let monthList=[];
    let tempMonObj=null;
    let tempYearObj=null;
    let tempCoObj=null;
    var date = new Date();
    let nowYear=date.getFullYear();   
    let nowMon=date.getMonth();
    //若當前月份為1月，則抓取往年12月資料
    if(nowMon==0){
      nowYear=nowYear-1;
      nowMon=12;
    }
    if(!this.state.iniComParam){
      let data= [];
      let defaultCo= null;
      let defaultYear= null;
      let defaultMon= null;
      //初始化執行
      await SQLite.selectData(`select * from THF_MASTERDATA where CLASS1 in ('HRCO','ReportKpiYear') and STATUS='Y' and OID in 
        (select DATA_OID from THF_PERMISSION where DATA_TYPE='masterdata') order by CLASS1,SORT;`, []).then( (result) => {        
        //如果沒有找到資料，不顯示任何資料
        for(let i in result.raw()){
            data.push(result.raw()[i]);
        }
      });
      //Param 年份-月份-公司別
      if(data.length!=0){
          data.forEach(param => {
              let tempCo=null;
              switch(param.CLASS1){
                case "HRCO":
                tempCo={
                  key:param.CLASS4+"",label:param.CONTENT,hrco:param.CLASS3
                }
                coList.push(tempCo);
                break;
                case "ReportKpiYear":
                for(let i=0;i<param.CONTENT;i++){
                  let tempYear={
                    // key:String(nowYear-i),label:nowYear-i+this.props.state.Language.lang.KPICategoryPage.Year
                    key:String(nowYear-i),label:String(nowYear-i)
                  }
                  yearList.push(tempYear);
                }
                break;                
              }
          })
          for(let i=0;i<12;i++){
            let mon=i+1+"";
            // let tempMon={key:String(mon),label:mon+this.props.state.Language.lang.KPICategoryPage.Month}
            let tempMon={key:String(mon),label:String(mon)}
            monthList.push(tempMon);
          }
      }
      //月份選單
      // defaultMon={key:String(nowMon),label:nowMon+this.props.state.Language.lang.KPICategoryPage.Month};
      defaultMon={key:String(nowMon),label:String(nowMon)};
      tempMonObj={
        data: monthList,
        defaultData:defaultMon,
        text:this.props.state.Language.lang.KPICategoryPage.Month2
      }
      //年份選單
      // defaultYear={key:String(nowYear),label:nowYear+this.props.state.Language.lang.KPICategoryPage.Year};
      defaultYear={key:String(nowYear),label:String(nowYear)};
      tempYearObj={
        data:yearList,
        defaultData:defaultYear,
        text:this.props.state.Language.lang.KPICategoryPage.Year2
      }
      //獲取默認公司別
      if(coList.length>0){
        for(let i in coList){
          if(coList[i].hrco==this.props.state.UserInfo.UserInfo.co){
              defaultCo=coList[i];
              break;
          }
        }
      }
      tempCoObj={
        data:coList,
        defaultData:defaultCo,
        text:this.props.state.Language.lang.KPICategoryPage.Company
      }
      this.setState({
        monObj:tempMonObj,
        yearObj:tempYearObj,
        coObj:tempCoObj,
        defaultCo:defaultCo,
        defaultYear:defaultYear,
        defaultMon:defaultMon,
        iniComParam:true
      });
    }
  }

  showDetailPage = (pressedProps,belong) => {
    let paramObj={
        yearObj:this.state.defaultYear,
        monthObj:this.state.defaultMon,
        coObj:this.state.defaultCo,
        user:this.props.state.UserInfo.UserInfo,
        belong:belong
    };
      NavigationService.navigate("KPIDetail",{
        masterInfo:pressedProps.datum,
        paramInfo:paramObj
      });
  }

  renderDrawerContent = () => {
    let containerBgColor = this.props.state.Theme.theme.variables.containerBgColor; 
    let contentStyle = this.props.state.Theme.theme.variables.contentStyle;
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
            {(this.state.defaultCo)?
              <MyFormSelectListButton
                text={this.props.state.Language.lang.KPICategoryPage.Company}   //公司
                defaultData={this.state.defaultCo} 
                data={this.state.coObj.data}
                onPress={(item, index) => {
                  for (var i in this.state.coObj.data) {
                    if (this.state.coObj.data[i].label == item) {
                      this.setState({
                        defaultCo: this.state.coObj.data[i]
                      });
                    }
                  }
                }}
              />
              :
              null
            }
            {(this.state.defaultYear)?
              <MyFormSelectListButton
                text={this.props.state.Language.lang.KPICategoryPage.Year2}   //年份
                defaultData={this.state.defaultYear} 
                data={this.state.yearObj.data}
                onPress={(item, index) => {
                  for (var i in this.state.yearObj.data) {
                    if (this.state.yearObj.data[i].label == item) {
                      this.setState({
                        defaultYear: this.state.yearObj.data[i]
                      });
                    }
                  }
                }}
              />
              :
              null
            }
            {(this.state.defaultMon)?
              <MyFormSelectListButton
                text={this.props.state.Language.lang.KPICategoryPage.Month2}   //月份
                defaultData={this.state.defaultMon} 
                data={this.state.monObj.data}
                onPress={(item, index) => {
                  for (var i in this.state.monObj.data) {
                    if (this.state.monObj.data[i].label == item) {
                      this.setState({
                        defaultMon: this.state.monObj.data[i]
                      });
                    }
                  }
                }}
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
            {(this.state.defaultCo)?
              <MyFormSelectListButton
                enabled={true}
                text={this.props.state.Language.lang.KPICategoryPage.Company}   //公司
                defaultData={this.state.defaultCo} 
                data={this.state.coObj.data}
                onPress={(item, index) => {
                  this.setState({
                    defaultCo: this.state.coObj.data[index],
                  });
                }}
              />
              :
              null
            }
            {(this.state.defaultYear)?
              <MyFormSelectListButton
                enabled={true}
                text={this.props.state.Language.lang.KPICategoryPage.Year2}   //年份
                defaultData={this.state.defaultYear} 
                data={this.state.yearObj.data}
                onPress={(item, index) => {
                  this.setState({
                    defaultYear: this.state.yearObj.data[index],
                  });
                }}
              />
              :
              null
            }
            {(this.state.defaultMon)?
              <MyFormSelectListButton
                enabled={true}
                text={this.props.state.Language.lang.KPICategoryPage.Month2}   //月份
                defaultData={this.state.defaultMon} 
                data={this.state.monObj.data}
                onPress={(item, index) => {
                  this.setState({
                    defaultMon: this.state.monObj.data[index],
                  });
                }}
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
    }

  }

  setSelect = () => {
    this.loadReportKPI(this.state.defaultCo,this.state.defaultYear,this.state.defaultMon);
    this.drawer.closeRightDrawer()
  }

  onChartNodePress(data, belong) {
    let paramObj = {
      yearObj: this.state.defaultYear,
      monthObj: this.state.defaultMon,
      coObj: this.state.defaultCo,
      user: this.props.state.UserInfo.UserInfo,
      belong: belong
    };
    if (data) {
      let user = this.props.state.UserInfo.UserInfo;
      if (belong == "PRO") {
        NavigationService.navigate("KPIDetail", {
          masterInfo: this.state.productKPI[data],
          paramInfo: paramObj
        });
      } else {
        NavigationService.navigate("KPIDetail", {
          masterInfo: this.state.managerKPI[data],
          paramInfo: paramObj
        });
      }
    }
  }

  render() {
    let charWidth=this.state.defaultWidth;
    let charHight=1000;
    let optionPro=null;
    if(this.state.productKPI){
      let temArray=this.state.productKPI;
      let xlabel=[];
      let xvalue=[];
      for(let i in temArray){
        xlabel.push(temArray[i].vidname);
        xvalue.push(temArray[i].kpi);
      }
      optionPro = {
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
          xAxis: [
              {
                  type: 'category',
                  // axisTick: {show: false},
                  data: xlabel,
                  axisLabel: {
                      interval:0,
                      // rotate:90,
                      // x轴字体颜色
                      textStyle: {
                          color:this.props.style.HeaderTitle.color,
                          lineHeight: 20,
                          fontSize: 20
                      },
                      margin: 10//刻度标签与轴线之间的距离。
                  },
                   //x轴字体颜色
                   axisLine: {
                       lineStyle: {
                           color: this.props.style.HeaderTitle.color,
                           width:1
                       }
                   },
              }
          ],
         height: 400,
         yAxis:[{
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
         }],
         series: [{
            // name: '生產',
            type: 'bar',
            barWidth: '50%', //每个条形的宽度比例
            data: xvalue,
            itemStyle: {
              normal: {
                color:'orange',
                label: {//bar圖顯示數值
                    show: true,
                    position: 'top',
                    textStyle: {
                        color:this.props.style.HeaderTitle.color,
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
              // show:true, //開關
              // left: '3%',     //图表距离左右上下之间的距离
              // right: '4%',
              top: '10%',
              borderColor:this.props.style.HeaderTitle.color,
              // bottom: '13%',
              // containLabel: true
          },
      };
    }
    let optionMan=null;
    if(this.state.managerKPI){
      let temArray=this.state.managerKPI;
      let xlabel=[];
      let xvalue=[];
      for(let i in temArray){
        xlabel.push(temArray[i].vidname);
        xvalue.push(temArray[i].kpi);
      }
      optionMan = {
          title: {
              text: this.state.manLabel1,      //主标题
              textStyle:{
                  color:this.props.style.HeaderTitle.color,        //颜色
                  fontStyle:'normal',     //风格
                  fontWeight:'normal',    //粗细
                  fontFamily:'Microsoft yahei',   //字体
                  fontSize:20,     //大小
                  align:'center'   //水平对齐
              },
              subtext:this.state.manLabel2,      //副标题
              subtextStyle:{          //对应样式
                  color:this.props.style.HeaderTitle.color,  
                  fontSize:20
              },
              itemGap:7,//主-副間隔
              x:'center'
          },
          xAxis: [
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
                  //x轴字体颜色
                  axisLine: {
                     lineStyle: {
                         color: this.props.style.HeaderTitle.color,
                         width:1
                      }
                  },
              }
          ],
         height: 400,
         yAxis: [{
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
         }],
         series: [{
            // name: '管理',
            type: 'bar',
            barWidth: '50%', //每个条形的宽度比例
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
              // show:true,
              // left: '3%',     //图表距离左右上下之间的距离
              // right: '4%',
              top: '10%',
              borderColor:this.props.style.HeaderTitle.color
              // bottom: '13%',
              // containLabel: true
          },
      };
    }
    return (
      <Drawer
          ref            ={(comp) => {this.drawer = comp;}}
          drawerWidth    ={charWidth*0.8}
          drawerContent  ={this.renderDrawerContent()}
          type           ={Drawer.types.Overlay}
          drawerPosition ={Drawer.positions.Right}
          easingFunc     ={Easing.ease}
      >
      <Container>
        {/*標題列*/}
        <HeaderForGeneral
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:"arrow-back"}}
          leftButtonOnPress     = {() =>NavigationService.goBack()} 
          isRightButtonIconShow = {true}
          rightButtonIcon       = {{name:"funnel"}}
          rightButtonOnPress    = {()=>{this.drawer.openRightDrawer();}} 
          title                 = {this.props.state.Language.lang.KPICategoryPage.GroupReportKPI}
          isTransparent         = {false}
        />
        <Content> 
          {
            (this.props.state.Theme.themeType == "season") ?
              <MainPageBackground/>
            :
              null
          }
          {(Platform.OS === "ios")?
            <Tabs 
              tabBarUnderlineStyle={ this.props.style.tabBarUnderlineStyle } 
              renderTabBar={()=> <ScrollableTab style={
                [this.props.style.Transparent,{backgroundColor: 'rgba(255,255,255,0)',borderWidth: 0}]
              }/>}
            >
                    <Tab  heading         ={this.props.state.Language.lang.KPICategoryPage.ProductionKPI}
                          tabStyle        ={this.props.style.tabStyle}  
                          activeTabStyle  ={this.props.style.tabStyle} 
                          textStyle       ={this.props.style.HeaderSubtitle} 
                          activeTextStyle ={this.props.style.HeaderTitle}
                    >
                        <View style={{height:15}}/>
                        {/*生產管理KPI*/}
                        {(this.state.productKPI)?
                            <Echarts option={optionPro} width={charWidth} height={charHight} onNodePress={(data) => this.onChartNodePress(data,"PRO")} />
                            :
                            null
                        }      
                    </Tab>
                    <Tab  heading         ={this.props.state.Language.lang.KPICategoryPage.ManagerKPI}
                          tabStyle        ={this.props.style.tabStyle}  
                          activeTabStyle  ={this.props.style.tabStyle} 
                          textStyle       ={this.props.style.HeaderSubtitle} 
                          activeTextStyle ={this.props.style.HeaderTitle}
                    >
                        <View style={{height:15}}/>
                        {/*行政管理KPI*/}
                        {(this.state.managerKPI)?
                            <Echarts option={optionMan} width={charWidth} height={charHight} onNodePress={(data) => this.onChartNodePress(data,"MAN")} />
                            :
                            null
                        }    
                    </Tab>
            </Tabs>
            :
            <Tabs 
                tabBarUnderlineStyle ={this.props.style.tabBarUnderlineStyle} 
                renderTabBar={()=> 
                  <ScrollableTab
                    style={{
                      backgroundColor: 'rgba(255,255,255,0)',
                      width:"95%",
                      justifyContent:"center", 
                      alignItems:"center", 
                      alignSelf:"center",
                      borderWidth:0
                    }}
                    tabsContainerStyle={{
                      borderWidth:0,
                      width:"100%",
                      backgroundColor: 'rgba(255,255,255,0)',
                    }}
                  />
                } 
            >
                <Tab  heading         ={this.props.state.Language.lang.KPICategoryPage.ProductionKPI}
                      tabStyle        ={this.props.style.tabStyle}  
                      activeTabStyle  ={this.props.style.tabStyle} 
                      textStyle       ={this.props.style.HeaderSubtitle} 
                      activeTextStyle ={this.props.style.HeaderTitle}
                >
                    <View style={{height:15}}/>
                    {/*生產管理KPI*/}
                    {(this.state.productKPI)?
                        <Echarts option={optionPro} width={charWidth} height={charHight} onNodePress={(data) => this.onChartNodePress(data,"PRO")} />
                        :
                        null
                    }      
                </Tab>
                <Tab  heading         ={this.props.state.Language.lang.KPICategoryPage.ManagerKPI}
                      tabStyle        ={this.props.style.tabStyle}  
                      activeTabStyle  ={this.props.style.tabStyle} 
                      textStyle       ={this.props.style.HeaderSubtitle} 
                      activeTextStyle ={this.props.style.HeaderTitle}
                >
                    <View style={{height:15}}/>
                    {/*行政管理KPI*/}
                    {(this.state.managerKPI)?
                        <Echarts option={optionMan} width={charWidth} height={charHight} onNodePress={(data) => this.onChartNodePress(data,"MAN")} />
                        :
                        null
                    }    
                </Tab>
            </Tabs>
          }
        </Content> 
        {this.renderActivityIndicator()}
      </Container>
    </Drawer>
    );
  }
}

export let KPICategoryPageStyle = connectStyle( 'Page.ReportPage', {} )(KPICategoryPage);

  export default connect(
  (state) => ({
    state: {...state}
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...LoginAction,
    }, dispatch)
  })
)(KPICategoryPageStyle);
