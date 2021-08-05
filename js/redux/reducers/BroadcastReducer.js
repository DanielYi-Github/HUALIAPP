import * as types from "../actionTypes/BroadcastTypes";

initialState = {
    data: [],
    isBirthday :false
}

export default function index(state = initialState, action = {}) {
    switch (action.type) {
        case types.BROADCAST_LOADDATA:
            return {
                ...state,
                data: action.data
            }
        case types.SET_ISBIRTHDAY:
            return {
                ...state,
                isBirthday: action.isBirthday
            }
        default:
            return state
    }
}