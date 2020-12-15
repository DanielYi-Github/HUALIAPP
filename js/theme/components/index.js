// @flow

import _ from "lodash";
import bodyTheme from "./Body";
import leftTheme from "./Left";
import rightTheme from "./Right";
import headerTheme from "./Header";
import switchTheme from "./Switch";
import thumbnailTheme from "./Thumbnail";
import containerTheme from "./Container";
import contentTheme from "./Content";
import buttonTheme from "./Button";
import titleTheme from "./Title";
import subtitleTheme from "./Subtitle";
import inputGroupTheme from "./InputGroup";
import badgeTheme from "./Badge";
import checkBoxTheme from "./CheckBox";
import cardTheme from "./Card";
import radioTheme from "./Radio";
import h3Theme from "./H3";
import h2Theme from "./H2";
import h1Theme from "./H1";
import footerTheme from "./Footer";
import footerTabTheme from "./FooterTab";
import fabTheme from "./Fab";
import itemTheme from "./Item";
import labelTheme from "./Label";
import textAreaTheme from "./Textarea";
import textTheme from "./Text";
import toastTheme from "./Toast";
import tabTheme from "./Tab";
import tabBarTheme from "./TabBar";
import tabContainerTheme from "./TabContainer";
import viewTheme from "./View";
import tabHeadingTheme from "./TabHeading";
import iconTheme from "./Icon";
import inputTheme from "./Input";
import swipeRowTheme from "./SwipeRow";
import segmentTheme from "./Segment";
import spinnerTheme from "./Spinner";
import cardItemTheme from "./CardItem";
import listItemTheme from "./ListItem";
import formTheme from "./Form";
import separatorTheme from "./Separator";
import pickerTheme from "./Picker";
import headerForGeneralTheme from "./component/HeaderForGeneral";
import bottomNavigationTheme from "./component/CustomBottomNavigation";
import noticeTabListTheme from "./component/NoticeTabList";
import mainPageBackgroundTheme from "./component/MainPageBackground";
import carItemTheme from "./component/CarItem";
import formItemTheme from "./component/FormItem";
import formContentTheme from "./component/FormContent";
import customModalTheme from "./component/CustomModal";
import explainCardItemTheme from "./component/ExplainCardItem";
import inputWithoutCardBackgroundTheme from "./component/InputWithoutCardBackground";
import authenticationViewTheme from "./component/AuthenticationView";
import waterMarkViewTheme from "./component/WaterMarkView";
import homePageTheme from "./page/HomePage";
import findPageTheme from "./page/FindPage";
import messagePageTheme from "./page/MessagePage";
import minePageTheme from "./page/MinePage";
import contactDetailPageTheme from "./page/ContactDetailPage";
import deputyPageTheme from "./page/DeputyPage";
import carsPageTheme from "./page/CarsPage";
import formPageTheme from "./page/FormPage";
import publishPageTheme from "./page/PublishPage";
import documentPageTheme from "./page/DocumentPage";
import birthdayPageTheme from "./page/BirthdayPage";
import reportPageTheme from "./page/ReportPage";
import homeRootPageTheme from "./page/HomeRootPage";
import loginPageTheme from "./page/LoginPage";
import DocComponentTheme from "./component/DocComponent";
import BirthdayComponentTheme from "./component/BirthdayComponent";
import variable from "./../variables/platform";

export default (variables /*: * */ = variable) => {
  const theme = {
    variables,
    "NativeBase.Left": {
      ...leftTheme(variables)
    },
    "NativeBase.Right": {
      ...rightTheme(variables)
    },
    "NativeBase.Body": {
      ...bodyTheme(variables)
    },

    "NativeBase.Header": {
      ...headerTheme(variables)
    },

    "NativeBase.Button": {
      ...buttonTheme(variables)
    },

    "NativeBase.Title": {
      ...titleTheme(variables)
    },
    "NativeBase.Subtitle": {
      ...subtitleTheme(variables)
    },

    "NativeBase.InputGroup": {
      ...inputGroupTheme(variables)
    },

    "NativeBase.Input": {
      ...inputTheme(variables)
    },

    "NativeBase.Badge": {
      ...badgeTheme(variables)
    },

    "NativeBase.CheckBox": {
      ...checkBoxTheme(variables)
    },

    "NativeBase.Radio": {
      ...radioTheme(variables)
    },

    "NativeBase.Card": {
      ...cardTheme(variables)
    },

    "NativeBase.CardItem": {
      ...cardItemTheme(variables)
    },

    "NativeBase.Toast": {
      ...toastTheme(variables)
    },

    "NativeBase.H1": {
      ...h1Theme(variables)
    },
    "NativeBase.H2": {
      ...h2Theme(variables)
    },
    "NativeBase.H3": {
      ...h3Theme(variables)
    },
    "NativeBase.Form": {
      ...formTheme(variables)
    },

    "NativeBase.Container": {
      ...containerTheme(variables)
    },
    "NativeBase.Content": {
      ...contentTheme(variables)
    },

    "NativeBase.Footer": {
      ...footerTheme(variables)
    },

    "NativeBase.Tabs": {
      flex: 1
    },

    "NativeBase.FooterTab": {
      ...footerTabTheme(variables)
    },

    "NativeBase.ListItem": {
      ...listItemTheme(variables)
    },

    "NativeBase.ListItem1": {
      ...listItemTheme(variables)
    },

    "NativeBase.Icon": {
      ...iconTheme(variables)
    },
    "NativeBase.IconNB": {
      ...iconTheme(variables)
    },
    "NativeBase.Text": {
      ...textTheme(variables)
    },
    "NativeBase.Spinner": {
      ...spinnerTheme(variables)
    },

    "NativeBase.Fab": {
      ...fabTheme(variables)
    },

    "NativeBase.Item": {
      ...itemTheme(variables)
    },

    "NativeBase.Label": {
      ...labelTheme(variables)
    },

    "NativeBase.Textarea": {
      ...textAreaTheme(variables)
    },

    "NativeBase.PickerNB": {
      ...pickerTheme(variables),
      "NativeBase.Button": {
        "NativeBase.Text": {}
      }
    },

    "NativeBase.Tab": {
      ...tabTheme(variables)
    },

    "NativeBase.Segment": {
      ...segmentTheme(variables)
    },

    "NativeBase.TabBar": {
      ...tabBarTheme(variables)
    },
    "NativeBase.ViewNB": {
      ...viewTheme(variables)
    },
    "NativeBase.TabHeading": {
      ...tabHeadingTheme(variables)
    },
    "NativeBase.TabContainer": {
      ...tabContainerTheme(variables)
    },
    "NativeBase.Switch": {
      ...switchTheme(variables)
    },
    "NativeBase.Separator": {
      ...separatorTheme(variables)
    },
    "NativeBase.SwipeRow": {
      ...swipeRowTheme(variables)
    },
    "NativeBase.Thumbnail": {
      ...thumbnailTheme(variables)
    },
    "Component.HeaderForGeneral": {
      ...headerForGeneralTheme(variables)
    },
    "Component.BottomNavigation":{
      ...bottomNavigationTheme(variables)
    },
    "Component.NoticeTabList":{
      ...noticeTabListTheme(variables)
    },
    "Component.MainPageBackground":{
      ...mainPageBackgroundTheme(variables)
    },
    "Component.CarItem":{
      ...carItemTheme(variables)
    },
    "Component.FormItem":{
      ...formItemTheme(variables)
    },
    "Component.FormContent":{
      ...formContentTheme(variables)
    },
    'Component.CustomModal':{
      ...customModalTheme(variables)
    },
    'Component.ExplainCardItem':{
      ...explainCardItemTheme(variables)
    },
    'Component.InputWithoutCardBackground':{
      ...inputWithoutCardBackgroundTheme(variables)
    },
    'Component.AuthenticationView':{
      ...authenticationViewTheme(variables)
    },
    'Component.WaterMarkView':{
      ...waterMarkViewTheme(variables)
    },
    "Component.DocComponent":{
      ...DocComponentTheme(variables)
    },
    "Component.BirthdayComponent":{
      ...BirthdayComponentTheme(variables)
    },
    "Page.HomePage":{
      ...homePageTheme(variables)
    },
    "Page.FindPage":{
      ...findPageTheme(variables)
    },
    "Page.MessagePage":{
      ...messagePageTheme(variables)
    },
    "Page.MinePage":{
      ...minePageTheme(variables)
    },
    "Page.ContactDetailPage":{
      ...contactDetailPageTheme(variables)
    },
    "Page.DeputyPage":{
      ...deputyPageTheme(variables)
    },
    "Page.CarsPage":{
      ...carsPageTheme(variables)
    },
    "Page.FormPage":{
      ...formPageTheme(variables)
    },
    "Page.PublishPage":{
      ...publishPageTheme(variables)
    },
    "Page.DocumentPage":{
      ...documentPageTheme(variables)
    },
    "Page.BirthdayPage":{
      ...birthdayPageTheme(variables)
    },
    "Page.ReportPage":{
      ...reportPageTheme(variables)
    },
    "Page.HomeRootPage":{
      ...homeRootPageTheme(variables)
    },
    "Page.LoginPage":{
      ...loginPageTheme(variables)
    }
  };

  const cssifyTheme = (grandparent, parent, parentKey) => {
    _.forEach(parent, (style, styleName) => {
      if (
        styleName.indexOf(".") === 0 &&
        parentKey &&
        parentKey.indexOf(".") === 0
      ) {
        if (grandparent) {
          if (!grandparent[styleName]) {
            grandparent[styleName] = {};
          } else {
            grandparent[styleName][parentKey] = style;
          }
        }
      }
      if (style && typeof style === "object" && styleName !== "fontVariant" && styleName !== "transform") {
        cssifyTheme(parent, style, styleName);
      }
    });
  };

  cssifyTheme(null, theme, null);

  return theme;
};
