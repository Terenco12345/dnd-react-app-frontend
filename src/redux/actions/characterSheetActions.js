import axios from 'axios';

export const RETREIVE_CHARACTER_SHEETS_FOR_CURRENT_USER_PENDING = "RETREIVE_CHARACTER_SHEETS_FOR_CURRENT_USER_PENDING";
export const RETREIVE_CHARACTER_SHEETS_FOR_CURRENT_USER_SUCCESS = "RETREIVE_CHARACTER_SHEETS_FOR_CURRENT_USER_SUCCESS";
export const RETREIVE_CHARACTER_SHEETS_FOR_CURRENT_USER_ERROR = "RETREIVE_CHARACTER_SHEETS_FOR_CURRENT_USER_ERROR";

export const DELETE_CHARACTER_SHEET_FOR_CURRENT_USER_PENDING = "DELETE_CHARACTER_SHEETS_FOR_CURRENT_USER_PENDING";
export const DELETE_CHARACTER_SHEET_FOR_CURRENT_USER_SUCCESS = "DELETE_CHARACTER_SHEETS_FOR_CURRENT_USER_SUCCESS";
export const DELETE_CHARACTER_SHEET_FOR_CURRENT_USER_ERROR = "DELETE_CHARACTER_SHEETS_FOR_CURRENT_USER_ERROR";

export const CREATE_CHARACTER_SHEET_FOR_CURRENT_USER_PENDING = "CREATE_CHARACTER_SHEET_FOR_CURRENT_USER_PENDING";
export const CREATE_CHARACTER_SHEET_FOR_CURRENT_USER_SUCCESS = "CREATE_CHARACTER_SHEET_FOR_CURRENT_USER_SUCCESS";
export const CREATE_CHARACTER_SHEET_FOR_CURRENT_USER_ERROR = "CREATE_CHARACTER_SHEET_FOR_CURRENT_USER_ERROR";

export const UPDATE_CHARACTER_SHEET_FOR_CURRENT_USER_PENDING = "UPDATE_CHARACTER_SHEET_FOR_CURRENT_USER_PENDING";
export const UPDATE_CHARACTER_SHEET_FOR_CURRENT_USER_SUCCESS = "UPDATE_CHARACTER_SHEET_FOR_CURRENT_USER_SUCCESS";
export const UPDATE_CHARACTER_SHEET_FOR_CURRENT_USER_ERROR = "UPDATE_CHARACTER_SHEET_FOR_CURRENT_USER_ERROR";

// Redux thunks
// Thunks for retrieveCharacterSheetsForCurrentUser
const retrieveCharacterSheetsForCurrentUserActionCreator = {
    pending: () => {
        return {
            type: RETREIVE_CHARACTER_SHEETS_FOR_CURRENT_USER_PENDING
        }
    },
    success: (sheets) => {
        return {
            type: RETREIVE_CHARACTER_SHEETS_FOR_CURRENT_USER_SUCCESS,
            sheets
        }
    },
    error: () => {
        return {
            type: RETREIVE_CHARACTER_SHEETS_FOR_CURRENT_USER_ERROR
        }
    }
}

// Thunks for deleting character sheet
const deleteCharacterSheetForCurrentUserActionCreator = {
    pending: () => {
        return {
            type: DELETE_CHARACTER_SHEET_FOR_CURRENT_USER_PENDING
        }
    },
    success: (sheets) => {
        return {
            type: DELETE_CHARACTER_SHEET_FOR_CURRENT_USER_SUCCESS,
            sheets
        }
    },
    error: () => {
        return {
            type: DELETE_CHARACTER_SHEET_FOR_CURRENT_USER_ERROR
        }
    }
}

// Thunks for creating character sheet
const createCharacterSheetForCurrentUserActionCreator = {
    pending: () => {
        return {
            type: CREATE_CHARACTER_SHEET_FOR_CURRENT_USER_PENDING
        }
    },
    success: (sheets) => {
        return {
            type: CREATE_CHARACTER_SHEET_FOR_CURRENT_USER_SUCCESS,
            sheets
        }
    },
    error: () => {
        return {
            type: CREATE_CHARACTER_SHEET_FOR_CURRENT_USER_ERROR
        }
    }
}

// Thunks for deleting character sheet
const updateCharacterSheetForCurrentUserActionCreator = {
    pending: () => {
        return {
            type: UPDATE_CHARACTER_SHEET_FOR_CURRENT_USER_PENDING
        }
    },
    success: (sheets) => {
        return {
            type: UPDATE_CHARACTER_SHEET_FOR_CURRENT_USER_SUCCESS,
            sheets
        }
    },
    error: () => {
        return {
            type: UPDATE_CHARACTER_SHEET_FOR_CURRENT_USER_ERROR
        }
    }
}

/**
 * Dispatch to retrieve all character sheet for the current user.
 */
export function retrieveCharacterSheetsForCurrentUser() {
    return dispatch => {
        dispatch(retrieveCharacterSheetsForCurrentUserActionCreator.pending())
        axios({
            method: 'get',
            url: process.env.REACT_APP_SERVER_IP + '/character-sheet/current-user/all',
            withCredentials: true
        }).then((res) => {
            if (res.error) {
                throw (res.error);
            }
            dispatch(retrieveCharacterSheetsForCurrentUserActionCreator.success(res.data));
        }).catch((err) => {
            if (err) {
                dispatch(retrieveCharacterSheetsForCurrentUserActionCreator.error(err));
            }
        });
    }
}

/**
 * Dispatch to delete a character sheet for a current user. Upon deletion, the store is refreshed with new sheet data.
 * @param sheetId 
 */
export function deleteCharacterSheetForCurrentUser(sheetId) {
    return dispatch => {
        dispatch(deleteCharacterSheetForCurrentUserActionCreator.pending())
        axios({
            method: 'delete',
            withCredentials: true,
            url: process.env.REACT_APP_SERVER_IP + '/character-sheet/current-user/' + sheetId,
        }).then((res) => {
            if (res.error) {
                throw (res.error);
            }
            // Retrieve an updated list of the character sheets for this user
            axios({
                method: 'get',
                url: process.env.REACT_APP_SERVER_IP + '/character-sheet/current-user/all',
                withCredentials: true
            }).then((res) => {
                if (res.error) {
                    throw (res.error);
                }
                dispatch(deleteCharacterSheetForCurrentUserActionCreator.success(res.data));
            }).catch((err) => {
                if (err) {
                    dispatch(deleteCharacterSheetForCurrentUserActionCreator.error(err));
                }
            });
        }).catch((err) => {
            if (err) {
                dispatch(deleteCharacterSheetForCurrentUserActionCreator.error(err));
            }
        });
    }
}

/**
 * Dispatch to create a character sheet for a current user. Upon creation, the store is refreshed with new sheet data.
 * @param sheet 
 */
export function createCharacterSheetForCurrentUser(sheet) {
    return dispatch => {
        dispatch(createCharacterSheetForCurrentUserActionCreator.pending())
        axios({
            method: 'post',
            withCredentials: true,
            url: process.env.REACT_APP_SERVER_IP + '/character-sheet/current-user/new',
            headers: { 'content-type': 'application/json' },
            data: sheet
        }).then((res) => {
            if (res.error) {
                throw (res.error);
            }
            // Retrieve an updated list of the character sheets for this user
            axios({
                method: 'get',
                url: process.env.REACT_APP_SERVER_IP + '/character-sheet/current-user/all',
                withCredentials: true
            }).then((res) => {
                if (res.error) {
                    throw (res.error);
                }
                dispatch(createCharacterSheetForCurrentUserActionCreator.success(res.data));
            }).catch((err) => {
                if (err) {
                    dispatch(createCharacterSheetForCurrentUserActionCreator.error(err));
                }
            });
        }).catch((err) => {
            if (err) {
                dispatch(createCharacterSheetForCurrentUserActionCreator.error(err));
            }
        });
    }
}

/**
 * Dispatch to update a character sheet for a current user. Upon update, the store is refreshed with new sheet data.
 * @param sheetId 
 * @param sheet
 */
export function updateCharacterSheetForCurrentUser(sheetId, sheet) {
    return dispatch => {
        dispatch(updateCharacterSheetForCurrentUserActionCreator.pending())
        axios({
            method: 'post',
            withCredentials: true,
            url: process.env.REACT_APP_SERVER_IP + '/character-sheet/current-user/' + sheetId,
            headers: { 'content-type': 'application/json' },
            data: sheet
        }).then((res) => {
            if (res.error) {
                throw (res.error);
            }
            // Retrieve an updated list of the character sheets for this user
            axios({
                method: 'get',
                url: process.env.REACT_APP_SERVER_IP + '/character-sheet/current-user/all',
                withCredentials: true
            }).then((res) => {
                if (res.error) {
                    throw (res.error);
                }
                dispatch(updateCharacterSheetForCurrentUserActionCreator.success(res.data));
            }).catch((err) => {
                if (err) {
                    dispatch(updateCharacterSheetForCurrentUserActionCreator.error(err));
                }
            });
        }).catch((err) => {
            if (err) {
                dispatch(updateCharacterSheetForCurrentUserActionCreator.error(err));
            }
        });
    }
}