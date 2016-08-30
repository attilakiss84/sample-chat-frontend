import ChatDispatcher from '../dispatchers/ChatDispatcher';
import { ActionTypes, Screens } from '../constants';

module.exports = {
  setUser: (userId) => {
    ChatDispatcher.dispatch({
      type: ActionTypes.SET_USER,
      userId: userId
    });
  },
  goToThread: (threadId) => {
    ChatDispatcher.dispatch({
      type: ActionTypes.CHANGE_SCREEN,
      screen: Screens.THREAD,
      selectedThread: threadId
    });
  },
  goToThreadList: () =>  {
    ChatDispatcher.dispatch({
      type: ActionTypes.CHANGE_SCREEN,
      screen: Screens.THREAD_LIST,
      selectedThread: undefined
    });
  }
};
