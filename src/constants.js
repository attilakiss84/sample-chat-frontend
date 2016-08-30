const Constants = {
  Screens: {
    THREAD_LIST: 'threadlist',
    THREAD: 'thread'
  },
  ActionTypes: {
    SET_USER: 'Application/SetUser',
    CHANGE_SCREEN: 'Application/ChangeScreen',
    ADD_MESSAGE: 'Chat/AddMessage',
    UPDATE_MESSAGE_STATUS: 'Chat/UpdateMessageStatus',
    ADD_OR_UPDATE_PROFILE: 'Profile/AddOrUpdate',
    CREATE_THREAD: 'thread/Create'
  },
  MessageStatus: {
    SENT: 'sent',
    DELIVERED: 'delivered',
    SEEN: 'seen'
  },
  Profiles: {
    DEFAULT_PROFILE_IMAGE_URL: '/static/profile_black.png'
  }
};

export default Constants;
exports.Screens = Constants.Screens;
exports.ActionTypes = Constants.ActionTypes;
exports.MessageStatus = Constants.MessageStatus;
exports.Profiles = Constants.Profiles;
