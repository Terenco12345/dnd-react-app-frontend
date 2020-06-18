import { combineReducers } from 'redux';

import lightMode from './lightModeReducers';
import user from './userReducers';
import sheet from './characterSheetReducers';

export default combineReducers({
    user, lightMode, sheet
});