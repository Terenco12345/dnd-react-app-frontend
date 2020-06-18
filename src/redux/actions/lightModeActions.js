// Light mode action types
export const SET_LIGHT_MODE = 'SET_LIGHT_MODE';

// Light mode actions
export function setLightMode(enabled){
    return {
        type: SET_LIGHT_MODE,
        enabled
    }
}