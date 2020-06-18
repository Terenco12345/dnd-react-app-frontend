import {
    RETREIVE_CHARACTER_SHEETS_FOR_CURRENT_USER_PENDING,
    RETREIVE_CHARACTER_SHEETS_FOR_CURRENT_USER_SUCCESS,
    RETREIVE_CHARACTER_SHEETS_FOR_CURRENT_USER_ERROR,
    DELETE_CHARACTER_SHEET_FOR_CURRENT_USER_PENDING,
    DELETE_CHARACTER_SHEET_FOR_CURRENT_USER_SUCCESS,
    DELETE_CHARACTER_SHEET_FOR_CURRENT_USER_ERROR,
    CREATE_CHARACTER_SHEET_FOR_CURRENT_USER_PENDING,
    CREATE_CHARACTER_SHEET_FOR_CURRENT_USER_SUCCESS,
    CREATE_CHARACTER_SHEET_FOR_CURRENT_USER_ERROR,
    UPDATE_CHARACTER_SHEET_FOR_CURRENT_USER_PENDING,
    UPDATE_CHARACTER_SHEET_FOR_CURRENT_USER_SUCCESS,
    UPDATE_CHARACTER_SHEET_FOR_CURRENT_USER_ERROR
} from '../actions/characterSheetActions';

const initialState = {
    retrievePending: false,
    deletePending: false,
    createPending: false,
    updatePending: false,

    sheets: [],
    
    retrieveError: null,
    deleteError: null,
    createPending: null,
    updatePending: null
}

const resetErrors = {
    retrieveError: null,
    deleteError: null,
    createPending: null,
    updatePending: null
}

export default function sheet(state = initialState, action) {
    switch (action.type) {
        // Retrieve sheets for current user
        case RETREIVE_CHARACTER_SHEETS_FOR_CURRENT_USER_PENDING:
            return { ...state, retrievePending: true, ...resetErrors };
        case RETREIVE_CHARACTER_SHEETS_FOR_CURRENT_USER_SUCCESS:
            return { ...state, retrievePending: false, sheets: action.sheets, ...resetErrors };
        case RETREIVE_CHARACTER_SHEETS_FOR_CURRENT_USER_ERROR:
            return { ...state, retrievePending: false, retrieveError: action.error };

        // Delete single sheet for current user
        case DELETE_CHARACTER_SHEET_FOR_CURRENT_USER_PENDING:
            return { ...state, deletePending: true, ...resetErrors };
        case DELETE_CHARACTER_SHEET_FOR_CURRENT_USER_SUCCESS:
            return { ...state, deletePending: false, sheets: action.sheets, ...resetErrors };
        case DELETE_CHARACTER_SHEET_FOR_CURRENT_USER_ERROR:
            return { ...state, deletePending: false, deleteError: action.error };

        // Create single sheet for current user
        case CREATE_CHARACTER_SHEET_FOR_CURRENT_USER_PENDING:
            return { ...state, createPending: true, ...resetErrors };
        case CREATE_CHARACTER_SHEET_FOR_CURRENT_USER_SUCCESS:
            return { ...state, createPending: false, sheets: action.sheets, ...resetErrors };
        case CREATE_CHARACTER_SHEET_FOR_CURRENT_USER_ERROR:
            return { ...state, createPending: false, createError: action.error };

        // Update single sheet for current user
        case UPDATE_CHARACTER_SHEET_FOR_CURRENT_USER_PENDING:
            return { ...state, updatePending: true, ...resetErrors };
        case UPDATE_CHARACTER_SHEET_FOR_CURRENT_USER_SUCCESS:
            return { ...state, updatePending: false, sheets: action.sheets, ...resetErrors };
        case UPDATE_CHARACTER_SHEET_FOR_CURRENT_USER_ERROR:
            return { ...state, updatePending: false, updateError: action.error };
        default:
            return state;
    }
}