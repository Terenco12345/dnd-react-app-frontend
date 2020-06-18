import {
    LOGIN_USER_PENDING,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_ERROR,

    REGISTER_USER_PENDING,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_ERROR,

    LOGOUT_CURRENT_USER_PENDING,
    LOGOUT_CURRENT_USER_SUCCESS,
    LOGOUT_CURRENT_USER_ERROR,

    FETCH_CURRENT_USER_PENDING,
    FETCH_CURRENT_USER_SUCCESS,
    FETCH_CURRENT_USER_ERROR,

    UPDATE_CURRENT_USER_PENDING,
    UPDATE_CURRENT_USER_SUCCESS,
    UPDATE_CURRENT_USER_ERROR
} from '../actions/userActions';

const initialState = {
    fetchPending: false,
    logoutPending: false,
    loginPending: false,
    registerPending: false,
    updatePending: false,

    currentUser: null,

    fetchError: null,
    logoutError: null,
    loginError: null,
    registerError: null,
    updateError: null
}

const resetErrors = {
    fetchError: null,
    logoutError: null,
    loginError: null,
    registerError: null,
    updateError: null
}

export default function user(state = initialState, action) {
    switch (action.type) {
        // Fetch user
        case FETCH_CURRENT_USER_PENDING:
            return { ...state, fetchPending: true };
        case FETCH_CURRENT_USER_SUCCESS:
            return { ...state, fetchPending: false, currentUser: action.user, ...resetErrors };
        case FETCH_CURRENT_USER_ERROR:
            return { ...state, fetchPending: false, error: action.error };

        // Logout user
        case LOGOUT_CURRENT_USER_PENDING:
            return { ...state, logoutPending: true };
        case LOGOUT_CURRENT_USER_SUCCESS:
            return { ...state, logoutPending: false, currentUser: null, ...resetErrors };
        case LOGOUT_CURRENT_USER_ERROR:
            return { ...state, logoutPending: false, currentUser: null, logoutError: action.error };

        // Login user
        case LOGIN_USER_PENDING:
            return { ...state, loginPending: true };
        case LOGIN_USER_SUCCESS:
            return { ...state, loginPending: false, currentUser: action.user, ...resetErrors };
        case LOGIN_USER_ERROR:
            return { ...state, loginPending: false, currentUser: null, loginError: action.error };

        // Register user
        case REGISTER_USER_PENDING:
            return { ...state, registerPending: true };
        case REGISTER_USER_SUCCESS:
            return { ...state, registerPending: false, currentUser: action.user, ...resetErrors };
        case REGISTER_USER_ERROR:
            return { ...state, registerPending: false, currentUser: null, registerError: action.error };

        // Update user
        case UPDATE_CURRENT_USER_PENDING:
            return { ...state, updatePending: true };
        case UPDATE_CURRENT_USER_SUCCESS:
            return { ...state, updatePending: false, currentUser: action.user, ...resetErrors };
        case UPDATE_CURRENT_USER_ERROR:
            return { ...state, updatePending: false, currentUser: null, updateError: action.error };
        default:
            return state;
    }
}