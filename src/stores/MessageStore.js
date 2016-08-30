import { Map, OrderedMap } from 'immutable';
import { MapStore } from 'flux/utils';
import Dispatcher from '../dispatchers/ChatDispatcher';
import { ActionTypes, MessageStatus } from '../constants';
import ApplicationStore from './ApplicationStore';

function sortMessagesBySendingTime(a, b) {
  if (a.time <= b.time) {
    return -1;
  } else {
    return 1;
  }
}

class MessageStore extends MapStore {
  reduce(state, action) {
    switch (action.type) {
      case ActionTypes.ADD_MESSAGE:
        return state.setIn([action.message.threadId, action.message.id], action.message);
      case ActionTypes.UPDATE_MESSAGE_STATUS:
        return state.updateIn([action.threadId, action.messageId], (message) => {
          return Object.assign({}, message, {status: action.status});
        });
      default:
        return state;
    }
  }

  getThread(threadId) {
    return this.getState().get(threadId, []).sort(sortMessagesBySendingTime);
  }

  getMessage(threadId, messageId) {
    return this.getState().getIn([threadId, messageId]);
  }

  getUnreadMessages(threadId) {
    var currentUserId = ApplicationStore.getSettings().userId;

    return this.getState().get(threadId).filter(function (message) {
      return message.status !== MessageStatus.SEEN && message.senderId !== currentUserId;
    }).sort(sortMessagesBySendingTime);
  }

  getLastMessage(threadId) {
    var messages = this.getState().get(threadId).sort(sortMessagesBySendingTime);

    return messages.size ? messages.last() : {};
  }
}

const instance = new MessageStore(Dispatcher);
export default instance;
