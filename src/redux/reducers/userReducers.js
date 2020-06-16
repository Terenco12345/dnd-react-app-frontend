import { SET_USER } from "../actions/actionTypes";

const initialState = {
    currentUser: null
}

export default function user(state = initialState, action) {
    switch (action.type) {
        case SET_USER: // Set current user of user
            return { ...state, currentUser: action.user };
        default:
            return state;
    }
}