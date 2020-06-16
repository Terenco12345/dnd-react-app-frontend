import { SET_LIGHT_MODE } from "../actions/actionTypes";

const initialState = {
    lightMode: false
}

export default function lightMode(state = initialState, action) {
    switch (action.type) {
        case SET_LIGHT_MODE: // Set enabled state of light mode
            return { ...state, enabled: action.enabled };
        default:
            return state;
    }
}