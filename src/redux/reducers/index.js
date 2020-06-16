import { combineReducers } from 'redux';

import lightMode from './lightModeReducers';
import user from './userReducers';

export default combineReducers({
    user, lightMode
});