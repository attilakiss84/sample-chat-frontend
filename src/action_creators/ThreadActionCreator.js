import ChatDispatcher from '../dispatchers/ChatDispatcher';
import { ActionTypes } from '../constants';

module.exports = {
  createThread: (participants, isGroup, name, profileImageUrl) => {
    ChatDispatcher.dispatch({
      type: ActionTypes.CREATE_THREAD,
      participants: participants,
      isGroup: isGroup,
      name: name,
      profileImageUrl: profileImageUrl
    });
  }
};
