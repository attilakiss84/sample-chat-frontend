import Immutable, { List, Map } from 'immutable';
import { ReduceStore } from 'flux/utils';
import ChatDispatcher from '../dispatchers/ChatDispatcher';
import { ActionTypes, MessageStatus } from '../constants';
import ApplicationStore from '../stores/ApplicationStore';
import MessageStore from '../stores/MessageStore';
import ProfileStore from '../stores/ProfileStore';
import HashHelper from '../helpers/HashHelper';

function sortThreadByLastMessageSent(thread) {
  var lastActivityAt = thread.lastMessageAt || thread.createdAt;

  return 0 - lastActivityAt;
}

class ThreadStore extends ReduceStore {
  getInitialState() {
    return new List();
  }

  reduce(state, action) {
    let currentUserId = ApplicationStore.getSettings().userId;

    switch (action.type) {
      case ActionTypes.CREATE_THREAD:
        ChatDispatcher.waitFor([ProfileStore.getDispatchToken()]);

        let threadId = HashHelper.generateThreadId(action.participants, currentUserId);

        if (state.has(threadId)) {
          return state;
        }

        let isGroupThread = action.isGroup || action.participants.length > 2;

        // console.log('generated thread id: ', action.participants, action.name, isGroupThread, threadId);
        return state.unshift({
          id: threadId,
          isGroup: isGroupThread,
          participants: action.participants,
          name: isGroupThread ? action.name : undefined,
          profileImageUrl: isGroupThread ? action.profileImageUrl : undefined,
          unread: 0,
          lastMessageId: undefined,
          lastMessageAt: undefined,
          createdAt: new Date().getTime()
        });
      case ActionTypes.ADD_MESSAGE:
        ChatDispatcher.waitFor([MessageStore.getDispatchToken(), ProfileStore.getDispatchToken()]);

        let i = state.findIndex(function (thread) {
          return thread.id === action.message.threadId;
        });

        if (i === -1) {
          return state;
        }

        let unreadMessages = MessageStore.getUnreadMessages(action.message.threadId);
        // It is tempting to use the current added message, however if we consider infinite scrolling as a later
        // feature, this isn't guaranteed to be the last one
        let lastMessage = MessageStore.getLastMessage(action.message.threadId);

        state = state.updateIn([i], (thread) => {
          return Object.assign(thread, {
            unread: unreadMessages.size,
            lastMessageId: lastMessage.id,
            lastMessageAt: lastMessage.time
          });
        });

        return state.sortBy(sortThreadByLastMessageSent);
      case ActionTypes.UPDATE_MESSAGE_STATUS:
        if (action.status === MessageStatus.SEEN) {
          ChatDispatcher.waitFor([MessageStore.getDispatchToken()]);

          let unreadMessages = MessageStore.getUnreadMessages(action.threadId);
          return state.update(
            state.findKey(thread => action.threadId === thread.id),
            (thread) => {
              thread.unread = unreadMessages.size;
              return thread;
            }
          ).sortBy(sortThreadByLastMessageSent);
        }
        return state;
      default:
        return state;
    }
  }

  getThread(threadId) {
    return this.getState().find(thread => threadId === thread.id);
  }
}

const instance = new ThreadStore(ChatDispatcher);
export default instance;
