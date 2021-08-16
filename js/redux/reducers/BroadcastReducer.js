import * as types from "../actionTypes/BroadcastTypes";

initialState = {
    data: []
}

export default function index(state = initialState, action = {}) {
    switch (action.type) {
        case types.BROADCAST_LOADDATA:
            return {
                ...state,
                data: action.data
            }
        default:
            return state
    }
}