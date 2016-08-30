import ChatDispatcher from '../dispatchers/ChatDispatcher';
import { ActionTypes, MessageStatus } from '../constants';
import md5 from 'md5';

function generateMessageId(threadId, senderId, text, time) {
  return md5(threadId + text + senderId + time).substring(0, 8);
}

module.exports = {
  addSampleMessage: (sampleMessage) => {
    ChatDispatcher.dispatch({
      type: ActionTypes.ADD_MESSAGE,
      message: sampleMessage
    });
  },

  sendMessage: (threadId, senderId, text, image) => {
    var currentTime = new Date().getTime();
    var message = {
      id: generateMessageId(threadId, senderId, text, currentTime),
      threadId: threadId,
      senderId: senderId,
      image: image,
      text: text,
      time: currentTime,
      status: MessageStatus.SENT
    };

    ChatDispatcher.dispatch({
      type: ActionTypes.ADD_MESSAGE,
      message: message
    });

    return message.id;
  },

  setMessageStatus: (threadId, messageId, status) => {
    ChatDispatcher.dispatch({
      type: ActionTypes.UPDATE_MESSAGE_STATUS,
      threadId: threadId,
      messageId: messageId,
      status: status
    });
  }
};
