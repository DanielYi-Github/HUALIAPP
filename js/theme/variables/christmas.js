// @flow
/**
* 顏色定義
  background                :"#27336B" 
  header                    :"#378D0E"
  card                      :"#FFFFFF" 
  cardIcon                  :"#4BA928"
  cardBorderColor           :"#ccc" 
  border                    :"#e6e6e6" 
  separator                 :"#e6e6e6" 
  explainTitle              :"#47ACF2"
  title                     :"#000000"
  subTitle                  :"#8e8e93"
  text                      :"#000000"
  label                     :"#575757"
  bottomNavigationBackground:"#000000"
  activeIconColor           :'#47ACF2',
  inactiveIconColor         :'#A1A1A1',
  bannerBackground          :"#47ACF2",
  Badge                     :"#ED1727"
*/

import color from "color";
import { Platform, Dimensions, PixelRatio } from "react-native";
// import Basic from '../../styles/Basic';
const window        = Dimensions.get('window');
const bannerHeight  = window.width*182/455;
const bannerWidth   = window.width;
const deviceHeight  = Dimensions.get("window").height;
const deviceWidth   = Dimensions.get("window").width;
const platform      = Platform.OS;
const platformStyle = undefined;
const isIphoneX =
platform === "ios" && (
  deviceHeight === 812 || 
  deviceWidth === 812 || 
  deviceHeight === 896 || 
  deviceWidth === 896 ||
  deviceHeight === 844 || 
  deviceWidth === 844 ||
  deviceHeight === 926 || 
  deviceWidth === 926 
);

export default {
  platformStyle,
  platform,

  // Card
  cardDefaultBg: "#FFFFFF",
  cardBorderColor: "#ccc",
  cardBorderRadius: 10,
  cardItemPadding: platform === "ios" ? 10 : 12,
  cardDefaultTextColor: "#000", // card背景底下的文字顏色

  //Container
  // containerBgColor: "#F5F6FA",
  containerBgColor: "rgba(0,0,0,0)",

  // Footer
  footerHeight: 55,
  footerDefaultBg: platform === "ios" ? "#FFF" : "#FFF",
  footerPaddingBottom: 0,

  // Header
  toolbarBtnColor: platform === "ios" ? "#007aff" : "#fff",
  toolbarDefaultBg: "#4BA928",  // 會變
  toolbarHeight: platform === "ios" ? 64 : 56,
  toolbarSearchIconSize: platform === "ios" ? 20 : 23,
  toolbarInputColor: "#fff",  // 會變
  searchBarHeight: platform === "ios" ? 30 : 40,
  searchBarInputHeight: platform === "ios" ? 30 : 50,
  toolbarBtnTextColor: platform === "ios" ? "#007aff" : "#fff",
  toolbarDefaultBorder: platform === "ios" ? "#a7a6ab" : "#3F51B5",
  iosStatusbar: platform === "ios" ? "light-content" : "light-content",
  iosSearchBarBackgroundColor:"#FFF", // ios Findpage上方輸入框背景顏色
  get statusBarColor() {
    return color(this.toolbarDefaultBg)
      .darken(0.2)
      .hex();
  },
  get darkenHeader() {
    return color(this.tabBgColor)
      .darken(0.03)
      .hex();
  },

  // InputGroup
  inputFontSize: 17,
  inputBorderColor: "#D9D5DC",
  inputSuccessBorderColor: "#2b8339",
  inputErrorBorderColor: "#ed2f2f",
  inputHeightBase: 50,
  get inputColor() {
    return this.textColor;
  },
  get inputColorPlaceholder() { 
    return "#575757"; // 輸入框裡面的 Label 顏色
  },

  // Input Without card background
  inputWithoutCardBackground:{
    inputColor:"#000",
    inputColorPlaceholder:"#575757"
  },

  // List
  listBg: "rgba(0,0,0,0)",     // 會變
  listBorderColor: "#c9c9c9",
  listDividerBg: "#f4f4f4",
  listBtnUnderlayColor: "#DDD",
  listItemPadding: platform === "ios" ? 10 : 12,
  listNoteColor: "#808080",
  listNoteSize: 13,

  // Spinner
  defaultSpinnerColor: "#3691ec", // 初始畫面轉圈圈的顏色
  inverseSpinnerColor: "#1A191B",

  // Text
  textColor: "#000",  // 變
  inverseTextColor: "#fff", // 唯一不變的顏色 部分主見的按鈕顏色或文字內容
  noteFontSize: 14,
  get defaultTextColor() {
    return this.textColor;
  },

  // Title
  titleFontfamily : platform === "ios" ? "System" : "Roboto_medium",
  titleFontSize   : platform === "ios" ? 17 : 19,
  subTitleFontSize: platform === "ios" ? 11 : 14,
  subtitleColor   : "#8e8e93",  // 變
  titleFontColor  : "#000",  // 變
  //遇到特別背景時需要顯示的字體顏色 例如 發現畫面的搜尋結果 個人資訊的稱號 通訊錄內容的稱號
  dynamicTitleColor: "#FFF", 


  // Other
  borderRadiusBase: platform === "ios" ? 5 : 2,
  borderWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
  contentPadding: 10,
  dropdownLinkColor: "#414142", // 輸入框裡面的icon顏色
  inputLineHeight: 24,
  deviceWidth,
  deviceHeight,
  isIphoneX,
  inputGroupRoundedBorderRadius: 30,

  //手機畫面的大小
  PageSize:{
    height:deviceHeight,
    width:deviceWidth
  },
  //HeaderForGeneral
  HeaderForGeneral:{
    color:"#FFF",
  },
  //HeaderForTransparent
  HeaderForTransparent:{
    color:"#FFF",
  },
  //IconColor
  IconColor:"#000",
  //LabelColor
  LabelColor:"#575757",
  //CustomBottomNavigation
  CustomBottomNavigation:{
    iconIsImage          :true,
    icon_Home_active     :require("./chrismaxNewYear/Home-1.png"),
    icon_Home_inactive   :require("./chrismaxNewYear/Home.png"),
    icon_Find_active     :require("./chrismaxNewYear/Find-1.png"),
    icon_Find_inactive   :require("./chrismaxNewYear/Find.png"),
    icon_Message_active  :require("./chrismaxNewYear/Message-1.png"),
    icon_Message_inactive:require("./chrismaxNewYear/Message.png"),
    icon_Mine_active     :require("./chrismaxNewYear/Mine-1.png"),
    icon_Mine_inactive   :require("./chrismaxNewYear/Mine.png"),

    activeIconColor   :'#FFFFFF',
    inactiveIconColor :'rgba(255, 255, 255, .7)',
    activeLabelColor  :"#FFFFFF",
    inactiveLabelColor:"rgba(255, 255, 255, .7)",
    barColor          :"#F73525",
    pressColor        : 'rgba(253, 186, 28, 1)',
    barColor_Home     : "#F73525",
    pressColor_Home   : "#F73525",

    barColor_Find     : "#7375A8",
    pressColor_Find   : "#7375A8",
    
    barColor_Message  : "#4BA928",
    pressColor_Message: "#4BA928",
    
    barColor_Mine     : "rgba(253, 186, 28, 1)",
    pressColor_Mine   : "rgba(253, 186, 28, 1)",
    // ToolbarStyle      :Basic.ToolbarStyle
  },
  // 458 38
  LoginPageIcon:{
    height:386*(window.width/3)/458,
    width:window.width/3
  },
  //image 657 303 455 182
  HomePageBanner:{
    height: bannerHeight,
    width : bannerWidth,
  },
  //HomePageBannerTitle
  HomePageBannerTitle:56,
  HomePageBannerBackgroundColor:"#4BA928",

  ExplainText:{
    color:"#F73525"
  },
  ExplainIcon:{
    iconIsImage:true,
    icon1      :require("./chrismaxNewYear/1.png"),
    icon2      :require("./chrismaxNewYear/2.png"),
    icon3      :require("./chrismaxNewYear/3.png"),
    icon4      :require("./chrismaxNewYear/4.png"),
    icon5      :require("./chrismaxNewYear/5.png"),
    icon6      :require("./chrismaxNewYear/6.png"),
    icon7      :require("./chrismaxNewYear/7.png"),
    icon8      :require("./chrismaxNewYear/8.png"),
    icon9      :require("./chrismaxNewYear/10.png"),
    icon9      :require("./chrismaxNewYear/11.png"),
    icon9      :require("./chrismaxNewYear/12.png"),
    icon9      :require("./chrismaxNewYear/13.png"),
  },
  separator:{
    height: 1, 
    backgroundColor: '#e6e6e6'
  },
  //透明背景
  Transparent:{
    backgroundColor: 'rgba(255,255,255,0)',
  },
  //  MainPageBackground
  MainPageBackground:{
    // height: platform === "ios"? 150: 125,
    height: deviceHeight,
    width : "100%",
    backgroundColor:"#DB4743", 
    position: 'absolute',
    source: require("./chrismaxNewYear/christmas.jpg")
  },
  SearchBarBg:"#FFF",
  // 消息畫面右上角的下拉選單
  dropdownStyle:{
    backgroundColor: "#ffffff",
    borderWidth    : 1,
    borderRadius   : 5,
    shadowColor    : '#000000',
    shadowOffset: {
      width : 10,
      height: 10
    },
    shadowRadius : 5,
    shadowOpacity: 0.8
  },
  // 消息畫面的Tab顏色
  TabIsActiveColor:{
    active:"#FFF",
    inactive:"#F5F6FA"
  },
  // 消息切換訊息的底線顏色
  TabBarUnderlineColor:{
    backgroundColor:"#EEFF41",
  },
  // 生日祝福的Tab顏色
  TabIsActiveColorForBirthday:{
    active:"#FFF",
    inactive:"#F5F6FA"
  },
  // 每一個Item
  ItemHeight:{
    height:deviceHeight/10
  },
  BigProfileImage:{
    height: deviceHeight/3.5,
    width : deviceHeight/3.5,
  },
  // 上傳大頭照的編輯按鈕
  EditBigProfileImage:{
    height         : 55, 
    width          : 55, 
    backgroundColor: "#FDBA1C", 
    alignSelf      : 'flex-end', 
    alignItems     : 'center', 
    justifyContent : 'center',
  },
  // 大頭照邊框顏色
  BigProfileImageBorder:'#FFF',
  // 修復ios欄位顯示問題
  fixCreateFormPageFiledItemWidth:platform === "ios"?{
    paddingTop:13,
    paddingBottom:13
  }:{},
  CreateFormPageFiledItemWidth:{
    width:window.width*0.86, 
    borderWidth:0,
  },

  // 轉圈圈的顏色
  SpinnerColor:"#47ACF2",
  SpinnerbackgroundColor:'rgba(255,255,255,.7)',

  // 一條橫槓的顏色 ex:發現畫面搜尋結果下面那一條
  DashBackgroundColor:"#757575",

  // 基本上不太會動的移到最後面
  //Accordion
  headerStyle: "#edebed",
  iconStyle: "#000",
  contentStyle: "#f5f4f5",
  expandedIconStyle: "#000",
  accordionBorderColor: "#d3d3d3",

  // Android
  androidRipple: true,
  androidRippleColor: "rgba(256, 256, 256, 0.3)",
  androidRippleColorDark: "rgba(0, 0, 0, 0.15)",
  btnUppercaseAndroidText: true,

  // Badge
  badgeBg: "#ED1727",
  badgeColor: "#fff",
  badgePadding: platform === "ios" ? 3 : 0,

  // Button
  btnFontFamily: platform === "ios" ? "System" : "Roboto_medium",
  btnDisabledBg: "#b5b5b5",
  buttonPadding: 6,
  get btnPrimaryBg() {
    return this.brandPrimary;
  },
  get btnPrimaryColor() {
    return this.inverseTextColor;
  },
  get btnInfoBg() {
    return this.brandInfo;
  },
  get btnInfoColor() {
    return this.inverseTextColor;
  },
  get btnSuccessBg() {
    return this.brandSuccess;
  },
  get btnSuccessColor() {
    return this.inverseTextColor;
  },
  get btnDangerBg() {
    return this.brandDanger;
  },
  get btnDangerColor() {
    return this.inverseTextColor;
  },
  get btnWarningBg() {
    return this.brandWarning;
  },
  get btnWarningColor() {
    return this.inverseTextColor;
  },
  get btnTextSize() {
    return platform === "ios" ? this.fontSizeBase * 1.1 : this.fontSizeBase - 1;
  },
  get btnTextSizeLarge() {
    return this.fontSizeBase * 1.5;
  },
  get btnTextSizeSmall() {
    return this.fontSizeBase * 0.8;
  },
  get borderRadiusLarge() {
    return this.fontSizeBase * 3.8;
  },
  get iconSizeLarge() {
    return this.iconFontSize * 1.5;
  },
  get iconSizeSmall() {
    return this.iconFontSize * 0.6;
  },

  // CheckBox
  CheckboxRadius: platform === "ios" ? 13 : 0,
  CheckboxBorderWidth: platform === "ios" ? 1 : 2,
  CheckboxPaddingLeft: platform === "ios" ? 4 : 2,
  CheckboxPaddingBottom: platform === "ios" ? 0 : 5,
  CheckboxIconSize: platform === "ios" ? 21 : 16,
  CheckboxIconMarginTop: platform === "ios" ? undefined : 1,
  CheckboxFontSize: platform === "ios" ? 23 / 0.9 : 17,
  checkboxBgColor: "#039BE5",
  checkboxSize: 20,
  checkboxTickColor: "#fff",

  // Color
  brandPrimary: platform === "ios" ? "#007aff" : "#3F51B5",
  brandInfo: "#62B1F6",
  brandSuccess: "#5cb85c",
  brandDanger: "#d9534f",
  brandWarning: "#f0ad4e",
  brandDark: "#000",
  brandLight: "#f4f4f4",

  //Date Picker
  datePickerTextColor: "#000",
  datePickerBg: "transparent",

  // Font
  DefaultFontSize: 16,
  fontFamily: platform === "ios" ? "System" : "Roboto",
  fontSizeBase: 15,
  get fontSizeH1() {
    return this.fontSizeBase * 1.8;
  },
  get fontSizeH2() {
    return this.fontSizeBase * 1.6;
  },
  get fontSizeH3() {
    return this.fontSizeBase * 1.4;
  },

  // FooterTab
  tabBarTextColor: platform === "ios" ? "#6b6b6b" : "#b3c7f9",
  tabBarTextSize: platform === "ios" ? 14 : 11,
  activeTab: platform === "ios" ? "#007aff" : "#fff",
  sTabBarActiveTextColor: "#007aff",
  tabBarActiveTextColor: platform === "ios" ? "#007aff" : "#fff",
  tabActiveBgColor: platform === "ios" ? "#cde1f9" : "#3F51B5",

  // Icon
  iconFamily: "Ionicons",
  iconFontSize: platform === "ios" ? 30 : 28,
  iconHeaderSize: platform === "ios" ? 33 : 24,

  // Line Height
  btnLineHeight: 19,
  lineHeightH1: 32,
  lineHeightH2: 27,
  lineHeightH3: 22,
  lineHeight: platform === "ios" ? 20 : 24,
  listItemSelected: platform === "ios" ? "#007aff" : "#3F51B5",

  // Progress Bar
  defaultProgressColor: "#E4202D",
  inverseProgressColor: "#1A191B",

  // Radio Button
  radioBtnSize: platform === "ios" ? 25 : 23,
  radioSelectedColorAndroid: "#3F51B5",
  radioBtnLineHeight: platform === "ios" ? 29 : 24,
  get radioColor() {
    return this.brandPrimary;
  },

  // Segment
  segmentBackgroundColor: platform === "ios" ? "#F8F8F8" : "#3F51B5",
  segmentActiveBackgroundColor: platform === "ios" ? "#007aff" : "#fff",
  segmentTextColor: platform === "ios" ? "#007aff" : "#fff",
  segmentActiveTextColor: platform === "ios" ? "#fff" : "#3F51B5",
  segmentBorderColor: platform === "ios" ? "#007aff" : "#fff",
  segmentBorderColorMain: platform === "ios" ? "#a7a6ab" : "#3F51B5",

  // Tab
  tabDefaultBg: platform === "ios" ? "#F8F8F8" : "#3F51B5",
  topTabBarTextColor: platform === "ios" ? "#6b6b6b" : "#b3c7f9",
  topTabBarActiveTextColor: platform === "ios" ? "#007aff" : "#fff",
  topTabBarBorderColor: platform === "ios" ? "#a7a6ab" : "#fff",
  topTabBarActiveBorderColor: platform === "ios" ? "#007aff" : "#fff",

  // Tabs
  tabBgColor: "#F8F8F8",
  tabFontSize: 15,

  //iPhoneX SafeArea
  Inset: {
    portrait: {
      topInset: 24,
      leftInset: 0,
      rightInset: 0,
      bottomInset: 34
    },
    landscape: {
      topInset: 0,
      leftInset: 44,
      rightInset: 44,
      bottomInset: 21
    }
  },

  watermarkTextStyle :{
    fontSize:15,
    color:"rgba(0,0,0,.15)"
  },
  
  InitialPageBanner:{
    height:window.width*2148/3631
  },
  InitialPageCompanyLogo:{
    height:window.width*111/200
  },
  InitialPageServiceImage:{
    height:window.width*1080/1920
  },
};
