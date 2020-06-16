import {SET_USER, SET_LIGHT_MODE} from "./actionTypes";

// User actions
export function setUser(user){
    return {
        type: SET_USER,
        user
    }
}

// Light mode actions
export function setLightMode(enabled){
    return {
        type: SET_LIGHT_MODE,
        enabled
    }
}