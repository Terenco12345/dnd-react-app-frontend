import axios from 'axios';

// Action types
export const FETCH_CURRENT_USER_PENDING = 'FETCH_CURRENT_USER_PENDING';
export const FETCH_CURRENT_USER_SUCCESS = 'FETCH_CURRENT_USER_SUCCESS';
export const FETCH_CURRENT_USER_ERROR = 'FETCH_CURRENT_USER_ERROR';

export const LOGIN_USER_PENDING = 'LOGIN_USER_PENDING';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_ERROR = 'LOGIN_USER_ERROR';

export const REGISTER_USER_PENDING = 'REGISTER_USER_PENDING';
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
export const REGISTER_USER_ERROR = 'REGISTER_USER_ERROR';

export const LOGOUT_CURRENT_USER_PENDING = 'LOGOUT_CURRENT_USER_PENDING';
export const LOGOUT_CURRENT_USER_SUCCESS = 'LOGOUT_CURRENT_USER_SUCCESS';
export const LOGOUT_CURRENT_USER_ERROR = 'LOGOUT_CURRENT_USER_ERROR';

export const UPDATE_CURRENT_USER_PENDING = 'UPDATE_CURRENT_USER_PENDING';
export const UPDATE_CURRENT_USER_SUCCESS = 'UPDATE_CURRENT_USER_SUCCESS';
export const UPDATE_CURRENT_USER_ERROR = 'UPDATE_CURRENT_USER_ERROR';

// Action creators
// Thunks for fetchCurrentUser
const fetchCurrentUserActionCreator = {
    pending: () => {
        return {
            type: FETCH_CURRENT_USER_PENDING,
        }
    },
    success: (user) => {
        return {
            type: FETCH_CURRENT_USER_SUCCESS,
            user: user
        }
    },
    error: (error) => {
        return {
            type: FETCH_CURRENT_USER_ERROR,
            error: error
        }
    }
}

// Thunks for loginCurrentUser
const loginUserActionCreator = {
    pending: () => {
        return {
            type: LOGIN_USER_PENDING,
        }
    },
    success: (user) => {
        return {
            type: LOGIN_USER_SUCCESS,
            user: user
        }
    },
    error: (error) => {
        return {
            type: LOGIN_USER_ERROR,
            error: error
        }
    }
}

// Thunks for loginCurrentUser
const registerUserActionCreator = {
    pending: () => {
        return {
            type: REGISTER_USER_PENDING,
        }
    },
    success: (user) => {
        return {
            type: REGISTER_USER_SUCCESS,
            user: user
        }
    },
    error: (error) => {
        return {
            type: REGISTER_USER_ERROR,
            error: error
        }
    }
}

// Thunks for logOutCurrentUser
const logoutCurrentUserActionCreator = {
    pending: () => {
        return {
            type: LOGOUT_CURRENT_USER_PENDING,
        }
    },
    success: () => {
        return {
            type: LOGOUT_CURRENT_USER_SUCCESS,
        }
    },
    error: (error) => {
        return {
            type: LOGOUT_CURRENT_USER_ERROR,
            error: error
        }
    }
}

// Thunks for updateCurrentUser
const updateCurrentUserActionCreator = {
    pending: () => {
        return {
            type: UPDATE_CURRENT_USER_PENDING,
        }
    },
    success: (user) => {
        return {
            type: UPDATE_CURRENT_USER_SUCCESS,
            user: user
        }
    },
    error: (error) => {
        return {
            type: UPDATE_CURRENT_USER_ERROR,
            error: error
        }
    }
}

/**
 * This action will attempt to retrieve a currently logged in user, based on the credentials present in the cookies.
 */
export function fetchCurrentUser() {
    return dispatch => {
        dispatch(fetchCurrentUserActionCreator.pending());
        axios({
            method: 'get',
            withCredentials: true,
            url: process.env.REACT_APP_SERVER_IP + '/user/current-user'
        }).then((res) => {
            if (res.error) {
                throw (res.error);
            }
            dispatch(fetchCurrentUserActionCreator.success(res.data.user));
        }).catch((err) => {
            if (err) {
                dispatch(fetchCurrentUserActionCreator.error(err));
            }
        });
    }
}

/**
 * This action will attempt to log out the currently logged in user.
 */
export function loginUser(email, password) {
    return dispatch => {
        dispatch(loginUserActionCreator.pending());
        // Should send a login request to the server.
        axios({
            method: 'post',
            withCredentials: true,
            url: process.env.REACT_APP_SERVER_IP + '/user/login',
            data: {
                email: email,
                password: password,
            }
        }).then((res) => {
            if (res.error) {
                throw (res.error);
            }
            dispatch(loginUserActionCreator.success(res.data.user));
        }).catch((err) => {
            if (err) {
                dispatch(loginUserActionCreator.error(err));
            }
        });
    }
}

/**
 * This action will attempt to log out the currently logged in user.
 */
export function logoutCurrentUser() {
    return dispatch => {
        dispatch(logoutCurrentUserActionCreator.pending());
        axios({
            method: 'post',
            withCredentials: true,
            url: process.env.REACT_APP_SERVER_IP + '/user/logout'
        }).then((res) => {
            if (res.error) {
                throw (res.error);
            }
            dispatch(logoutCurrentUserActionCreator.success());
        }).catch((err) => {
            if (err) {
                dispatch(logoutCurrentUserActionCreator.error(err));
            }
        });
    }
}

/**
 * This action will try to register a new user.
 */
export function registerUser(displayName, email, password) {
    return dispatch => {
        dispatch(registerUserActionCreator.pending());
        axios({
            method: 'post',
            url: process.env.REACT_APP_SERVER_IP + '/user/register',
            data: {
                displayName: displayName,
                email: email,
                password: password,
            }
        }).then((res) => {
            if (res.error) {
                throw (res.error);
            }
            dispatch(registerUserActionCreator.success(res.data.user));
        }).catch((err) => {
            if (err) {
                dispatch(registerUserActionCreator.error(err));
            }
        });
    }
}

/**
 * This action will try to update the current user that is authenticated.
 */
export function updateCurrentUser(update){
    return dispatch => {
        dispatch(updateCurrentUserActionCreator.pending());
        axios({
            method: 'post',
            withCredentials: true,
            url: process.env.REACT_APP_SERVER_IP + '/user/current-user',
            data: update
        }).then((res) => {
            if (res.error) {
                throw (res.error);
            }
            dispatch(updateCurrentUserActionCreator.success(res.data.user));
        }).catch((err) => {
            if (err) {
                dispatch(updateCurrentUserActionCreator.error(err));
            }
        });
    }
}