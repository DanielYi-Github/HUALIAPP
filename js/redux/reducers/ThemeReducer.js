'use strict';
import * as types from '../actionTypes/ThemeTypes';
import getTheme   from '../../theme/components';
import platform   from '../../theme/variables/platform';
import dark       from '../../theme/variables/dark';
// import season     from '../../theme/variables/lunarNewYear'; 
// import season     from '../../theme/variables/moonFestival'; 
// import season     from '../../theme/variables/moonFestival2021'; 
// import season     from '../../theme/variables/christmas'; 
import season     from '../../theme/variables/christmas2021'; 

import { clearThemeCache } from 'native-base-shoutem-theme';

let initialTheme = getTheme(platform);
let initialThemeObiect = {
  ...initialTheme,
};

const initialState = {
  themeType: types.platform,
  theme    : initialThemeObiect,
  isThemeDone: true,
  serverSeasonTheme:false
}

export default function theme(state = initialState, action) {
  let baseTheme, themeObiect;
  switch (action.type) {
    case types.platform:
      clearThemeCache();
      baseTheme = getTheme(platform);
      themeObiect = { ...baseTheme };
      return {
        ...state,
        themeType: types.platform,
        theme: themeObiect,
        isThemeDone: action.initial ? true: false,
        serverSeasonTheme: typeof action.serverSeasonTheme == "undefined" ? state.serverSeasonTheme : action.serverSeasonTheme
      }
      break;
    case types.dark:
      clearThemeCache();
      baseTheme = getTheme(dark);
      themeObiect = { ...baseTheme };
      return {
        ...state,
        themeType: types.dark,
        theme: themeObiect,
        isThemeDone: action.initial ? true: false,
        serverSeasonTheme: typeof action.serverSeasonTheme == "undefined" ? state.serverSeasonTheme : action.serverSeasonTheme
      }
      break;
    case types.season:
      clearThemeCache();
      baseTheme = getTheme(season);
      themeObiect = { ...baseTheme };
      return {
        ...state,
        themeType: types.season,
        theme: themeObiect,
        isThemeDone: action.initial ? true: false,
        serverSeasonTheme: typeof action.serverSeasonTheme == "undefined" ? state.serverSeasonTheme : action.serverSeasonTheme
      }
      break;
    case types.themeChangeDone:
      return {
        ...state,
        isThemeDone: true
      }
      break;
    default:
      return state;
  }
}