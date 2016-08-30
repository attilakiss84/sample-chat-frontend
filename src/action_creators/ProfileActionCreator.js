import ChatDispatcher from '../dispatchers/ChatDispatcher';
import { ActionTypes } from '../constants';

module.exports = {
  addOrUpdateProfile: (profile) => {
    ChatDispatcher.dispatch({
      type: ActionTypes.ADD_OR_UPDATE_PROFILE,
      profile: profile
    });
  }
};
