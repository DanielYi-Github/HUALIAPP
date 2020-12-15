import * as types from '../actionTypes/SubmitTypes';

const initialState = {
  isSubmitting: false,
  isSuccess: true,
  changingInfo: ''
};

export default function submit(state = initialState, action = {}) {
  switch (action.type) {
    case types.SUBMITTING:
      return {
        ...state,
        isSubmitting: true,
        isSuccess: false
      };
    case types.SUBMITTED:
      return {
        ...state,
        isSubmitting: false,
        isSuccess: true
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