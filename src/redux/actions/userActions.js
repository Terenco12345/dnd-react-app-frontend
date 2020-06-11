import {SET_USER} from "./actionTypes";

export function setUser(user){
    return {
        type: SET_USER,
        user
    }
}