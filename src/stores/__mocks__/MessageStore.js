var lastMessage;
var unreadMessages;

const MessageStoreMock = {
  addListener: () => {

  },

  getDispatchToken: () => {
    return;
  },

  getLastMessage: () => {
    return lastMessage;
  },

  getUnreadMessages: () => {
    return {
      size: unreadMessages.length
    };
  },

  setLastMessage: (message) => {
    lastMessage = message;
  },

  setUnreadMessages: (messages) => {
    unreadMessages = messages;
  }
};

export default MessageStoreMock;
