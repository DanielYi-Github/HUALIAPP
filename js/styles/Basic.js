import { Dimensions, StyleSheet, Platform } from 'react-native';
import * as DeviceInfo from '../utils/DeviceInfoUtil';

const window = Dimensions.get('window');

let bannerHeight = window.width*182/455;
let bannerWidth = window.width;
let HomeHeaderHight = 56;
let ToolbarStyle = {};
let HeaderPaddingTop = 0; 			// 用來記錄ios平台針對瀏海評需要突出的高度
let IOSHomePageBanner = {flex:1};
let systemVersion = DeviceInfo.getSystemVersion().split(".")
let isiPhonexUpper = false;
systemVersion = systemVersion[0];

let fixCreateFormPageFiledItemWidth = {};
if(Platform.OS === "ios"){

	let iDevice=DeviceInfo.getModel();
	switch(iDevice){
	case "iPhone X":
	case "iPhone XS":
	case "iPhone 11 PRO":
	case "iPhone 11 Pro":
	case "iPhone 11 pro":
		ToolbarStyle={
			paddingBottom:10,
			paddingTop:0
		};
		// HeaderPaddingTop = (systemVersion == "13") ? 0 : HeaderPaddingTop;
		// HeaderPaddingTop = 20;
		bannerHeight=bannerHeight+44;
		IOSHomePageBanner = {
			flex: 1, 
			paddingTop:44
		}
		HomeHeaderHight = 64;
		isiPhonexUpper=true;
	  break;
	case "iPhone XS MAX":
	case "iPhone XS Max":
	case "iPhone XR":
	case "iPhone 11":
	case "iPhone 11 PRO MAX":
	case "iPhone 11 PRO Max":
	case "iPhone 11 Pro MAX":
	case "iPhone 11 pro MAX":
	case "iPhone 11 Pro Max":
		ToolbarStyle={
			paddingBottom:10,
			paddingTop:0
		};
		// HeaderPaddingTop = (systemVersion == "13") ? 0 : HeaderPaddingTop;
		// HeaderPaddingTop = 20;
		bannerHeight=bannerHeight+44;
		IOSHomePageBanner = {
			flex: 1, 
			paddingTop:44
		}
		HomeHeaderHight = 84;
		isiPhonexUpper=true;
	  break;
	case "iPhone 6":
	case "iPhone 6s":
	case "iPhone 7":
	case "iPhone 8":
		ToolbarStyle={
			height:56
		};
		// HeaderPaddingTop=0;
		bannerHeight=bannerHeight+20;
		IOSHomePageBanner = {
			flex: 1, 
			paddingTop:20
		}
		HomeHeaderHight = 64;

	  break;
	case "iPhone 6 Plus":
	case "iPhone 6s Plus":
	case "iPhone 7 Plus":
	case "iPhone 8 Plus":
		ToolbarStyle={
			height:56
		};
		// HeaderPaddingTop=0;
		bannerHeight=bannerHeight+20;
		IOSHomePageBanner = {
			flex: 1, 
			paddingTop:20
		}
		HomeHeaderHight = 64;

	  break;
	case "iPhone 5":
	case "iPhone 5s":
	case "iPhone SE":
		ToolbarStyle={
			height:56
		};
		// HeaderPaddingTop=0;
		bannerHeight=bannerHeight+20;
		IOSHomePageBanner = {
			flex: 1, 
			paddingTop:20
		}
		HomeHeaderHight = 64;

	  break;
	default:
	}

	fixCreateFormPageFiledItemWidth = {
		paddingTop:13,
		paddingBottom:13
	}
}


export default StyleSheet.create({
	//背景透明
	Transparent:{
		backgroundColor: 'rgba(255,255,255,0)',
	},
	//冷色系背景
	ColdBackground:{
		backgroundColor:"#F5F6FA"
	},
	//白色背景
	WhiteBackground:{
		backgroundColor:"#FFF"
	},
	//說明標題顏色
	ExplainText:{
		color:"#47ACF2"
	},
	//Tab重點字體顏色
	Title:{
		color:"#000", 
	},
	//Tab一般字體顏色
	Text:{
		color:"#808080"
	},
	LoginPageHeaderPaddingTop:{
		marginTop:0,
	},
	//Header圖標語文字顏色
	HeaderText:{
		color:"#000",
	},
	//Header圖標語文字顏色
	FormHeaderText:{
		color:"#FFF",
	},
	// 每一個Item
	ItemHeight:{
		height:window.height/10
	},
	//分隔線
	Separator:{
		height: 1, 
		backgroundColor: '#e6e6e6'
	},
	//箭頭icon
	ArrowIcon:{
		fontSize: 18, 
		color:"#BDBDBD"
	},
	//Card設定
	CardStyle:{
		width:window.width*0.95,
		alignSelf: 'center',
	},
	CardItemStyle:{
		borderRadius: 10,
	},
	//消息頁簽導航欄顏色
	TabBarUnderlineColor:{
		backgroundColor:"#EEFF41",
	},
	PageSize:{
		height:window.height,
		width:window.width
	},
	//image 657 303 455 182
	HomePageBanner:{
		height: bannerHeight,
		width : bannerWidth,
	},
	//ios 64/89 android 56
	HomePageBannerTitle:{
		height: HomeHeaderHight
	},
	HomePageBannerView:{
		flex: 1, 
		alignItems: 'center', 
		justifyContent: 'center',
	},
	HomePageBannerForeground:{
		height        : bannerHeight,
		// flex          : 1,
		alignItems    : 'center',
		justifyContent: 'center'
	},
	HomePageBannerLogoView:{
		marginTop      : 14,
		height         : bannerHeight/2,
		width          : window.width/1.5,
		alignItems     : 'center',
		justifyContent : 'center',
		backgroundColor: 'rgba(255, 255, 255, 0)',
		borderWidth    : 5,
		borderColor    : '#FFF'
	},
	HomePageBannerBackground:{
		flex: 1,
	},
	HomePageContainer:{
		backgroundColor:"#F5F6FA"
	},
	MainPageBackground:{
		height: 150,
		width : "100%",
		backgroundColor:"#47ACF2",
		position: 'absolute'
	},
	MainPageContainer:{
		backgroundColor: 'rgba(255,255,255,0)',
		height: window.height,
		width : window.width,
		// flex: 1
	},
	BigProfileImage:{
		height: window.height/3.5,
		width : window.height/3.5,
	},
	//去掉cardItem 的 padding
	RemovePadding:{
		paddingTop: 0,
		// paddingBottom: 0
	},
	MyFormListFilterModalSelect:{
		borderBottomWidth: 1, 
		borderBottomColor: '#D9D5DC', 
		width: '90%', 
		alignItems: 'flex-start', 
		justifyContent: 'flex-start',
		marginTop: 15
	},
	ToolbarStyle:ToolbarStyle,
	//Header的高度
	HeaderHeight:Platform.OS === "ios" ? null: HomeHeaderHight,
	IOSHomePageBanner:IOSHomePageBanner,
	InitialPageBanner:{
		height:window.width*182/455
	},
	InitialPageCompanyLogo:{
		height:window.width*111/200
	},
	InitialPageServiceImage:{
		height:window.width*1080/1920
	},
	CreateFormPageFiledItemWidth:{
		width:window.width*0.86, 
		borderWidth:0,
	},
	fixCreateFormPageFiledItemWidth,
	// 458 386
	LoginPageIcon:{
		height:386*(window.width/3)/458,
		width:window.width/3
	},
	Button:{
		width: '95%',
		borderRadius: 5,
		justifyContent: 'center',
		alignSelf:"center",
	},
	isiPhonexUpper:isiPhonexUpper
});