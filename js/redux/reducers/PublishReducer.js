import * as types from '../actionTypes/PublishTypes';

const initialState = {
  languageList: [{
    key: 'zh-TW',
    label: '繁體中文',
    isSelected: false
  }, {
    key: 'zh-CN',
    label: '简体中文',
    isSelected: false
  }, {
    key: 'en',
    label: 'English',
    isSelected: false
  }, {
    key: 'vi',
    label: 'Tiếng Việt',
    isSelected: false
  }, {
    key: 'es',
    label: 'Español',
    isSelected: false
  }],
  publishItemList: [],
  editIndex: null,
  editData: null,
  isSubmitting: false,
  isSuccess: false,
};

export default function publish(state = initialState, action = {}) {
  switch (action.type) {
    case types.SAVE:
      if (state.editIndex) {
        state.editIndex = parseInt(state.editIndex);
        state.publishItemList[state.editIndex] = action.publishItem;
      } else {
        state.publishItemList.push(action.publishItem);
      }

      state.languageList.forEach((item) => {
        if (item.key == action.publishItem.languageKey) {
          item.isSelected = true;
        }
      });

      return {
        ...state,
        languageList: state.languageList,
        publishItemList: state.publishItemList,
        editIndex: null,
        editData: null,
      };

    case types.EDITING:
      state.languageList.forEach((item) => {
        if (item.key == action.data.data.languageKey) {
          item.isSelected = false;
        }
      });
      return {
        ...state,
        editIndex: action.data.index,
        editData: action.data.data
      };

    case types.EDITED:
      state.languageList.forEach((item) => {
        if (item.key == state.editData.languageKey) {
          item.isSelected = true;
        }
      });
      return {
        ...state,
        languageList: state.languageList,
        editIndex: null,
        editData: null,
      };

    case types.DELETE:
      state.publishItemList.splice(action.data.index, 1);
      state.languageList.forEach((item) => {
        if (item.key == action.data.languageKey) {
          item.isSelected = false;
        }
      });
      return {
        ...state,
        languageList: state.languageList,
        publishItemList: state.publishItemList
      };

    case types.CANCEL:
      state.languageList.forEach((item) => {
        if (item.isSelected == true) {
          item.isSelected = false;
        }
      });
      return {
        ...state,
        languageList: state.languageList,
        publishItemList: [],
        editIndex: null,
        editData: null,
        isSuccess: false,
        isSubmitting:false
      };

    case types.SUBMITTING:
      return {
        ...state,
        isSubmitting   : true,
      };

    case types.SUBMITTED:
      state.languageList.forEach((item) => {
        if (item.isSelected == true) {
          item.isSelected = false;
        }
      });
      return {
        ...state,
        languageList   : state.languageList,
        publishItemList: [],
        editIndex      : null,
        editData       : null,
        isSubmitting   : false,
        isSuccess      : true,
      };
    case types.SUBMIT_FAIL:
      return {
        ...state,
        isSubmitting: false,
        isSuccess: false
      };

    default:
      return state;
  }
}