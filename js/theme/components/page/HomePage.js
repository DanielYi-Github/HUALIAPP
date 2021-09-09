// @flow
import variable from "../../variables/platform";

export default (variables /*: * */ = variable) => {
  const homePageTheme = {
  	container:{
  		flex:1,
  		backgroundColor: typeof variables.MainPageBackground.source =="undefined" ? variables.containerBgColor: "rgba(0,0,0,0)"
  	},
  	contentContainer:{
  		flexGrow: 1,
  	},
	backgroundColor    :variables.containerBgColor,
	HomePageBanner     :variables.HomePageBanner,
	HomePageBannerTitle:variables.HomePageBannerTitle,
	HomePageBannerView:{
		flex: 1, 
		alignItems: 'center', 
		justifyContent: 'center',
	},
	HomePageBannerLogoView:{
		marginTop      : 14,
		height         : variables.HomePageBanner.height/2,
		width          : variables.PageSize.width/1.5,
		alignItems     : 'center',
		justifyContent : 'center',
		alignSelf: 'center' , 
		backgroundColor: 'rgba(255, 255, 255, 0)',
		borderWidth    : 5,
		borderColor    : variables.bannerLogoViewFontColor
	},
	ExplainText        :variables.ExplainText,
	tabBarUnderlineStyle:{
		backgroundColor:variables.titleFontColor
	},
	tabStyle:{
		backgroundColor:variables.cardDefaultBg	
	},
	activeTabStyle:{
		backgroundColor:variables.cardDefaultBg	
	},
	title              :{
		color: variables.cardDefaultTextColor
	},
	subtitle      :{
		color: variables.subtitleColor
	},
    textColor:variables.textColor,
    noticePageTextColor:variables.noticePageTextColor,
  	dynamicTitleColor: variables.dynamicTitleColor, 
  	cardBackground:variables.cardDefaultBg,
  	InitialPageCompanyLogo:variables.InitialPageBanner,
  	InitialPageServiceImage:variables.InitialPageCompanyLogo,
	MainPageBackground  :variables.MainPageBackground,
  	ItemHeight:{
  		height:variables.PageSize.height/10
  	},
  	PageSize:variables.PageSize,
  	HomePageBannerBackgroundColor:variables.HomePageBannerBackgroundColor,
  	color : variables.HeaderForGeneral.color,
  	bannerLogoViewFontColor:variables.bannerLogoViewFontColor
  };

  return homePageTheme;
};
