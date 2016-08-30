jest.dontMock('flux/utils');
jest.dontMock('immutable');
jest.dontMock('object-assign');
jest.dontMock('../src/stores/MessageStore');
jest.dontMock('../src/constants');

describe('MessageStore', () => {
  var Constants = require('../src/constants');
  var Immutable = require('immutable');
  var ApplicationStore = require('../src/stores/ApplicationStore');
  var ChatDispatcher;
  var MessageStore;
  var messageStoreCallback;

  const TEST_USER_RECEIVER = 'user-1';
  const TEST_USER_SENDER = 'user-2';

  beforeEach(() => {
    ChatDispatcher = require('../src/dispatchers/ChatDispatcher').default;
    MessageStore = require('../src/stores/MessageStore').default;
    messageStoreCallback = ChatDispatcher.register.mock.calls[0][0];
    ApplicationStore.setUserId(TEST_USER_RECEIVER);
  });

  it('should have default value', () => {
    expect(MessageStore.getState().toObject()).toEqual({});
  });

  describe('when message is being set', () => {
    const TEST_MESSAGE_ID = 'message-1';
    const TEST_THREAD_ID = 'thread-1';
    const TEST_STATUS_INITIAL = Constants.MessageStatus.SENT;
    const TEST_STATUS_UPDATED = Constants.MessageStatus.SEEN;
    var TEST_MESSAGE;

    beforeEach(() => {
      TEST_MESSAGE = {
        id: TEST_MESSAGE_ID,
        threadId: TEST_THREAD_ID,
        text: 'text',
        image: undefined,
        time: 2,
        senderId: TEST_USER_SENDER,
        status: TEST_STATUS_INITIAL
      };

      messageStoreCallback({
        type: Constants.ActionTypes.ADD_MESSAGE,
        message: TEST_MESSAGE
      });
    });

    it('should store messages by thread- and message-ids', () => {
      expect(MessageStore.getState().getIn([TEST_THREAD_ID, TEST_MESSAGE_ID])).toEqual(TEST_MESSAGE);
    });

    it('getMessage() function should return the message', () => {
      expect(MessageStore.getMessage(TEST_THREAD_ID, TEST_MESSAGE_ID)).toEqual(TEST_MESSAGE);
    });

    describe('and message status gets updated to "SEEN"', () => {
      beforeEach(() => {
        messageStoreCallback({
          type: Constants.ActionTypes.UPDATE_MESSAGE_STATUS,
          threadId: TEST_THREAD_ID,
          messageId: TEST_MESSAGE_ID,
          status: TEST_STATUS_UPDATED
        });

        TEST_MESSAGE.status = TEST_STATUS_UPDATED;
      });

      it('should update message status', () => {
        expect(MessageStore.getState().getIn([TEST_THREAD_ID, TEST_MESSAGE_ID]).status).toEqual(TEST_STATUS_UPDATED);
      });

      it('getUnreadMessages() should return empty list', () => {
        expect(MessageStore.getUnreadMessages(TEST_THREAD_ID).toArray()).toEqual([]);
      });

      describe('and an unseen message gets added', () => {
        var TEST_MESSAGE_2;

        beforeEach(() => {
          TEST_MESSAGE_2 = Object.assign({}, TEST_MESSAGE, {
            id: TEST_MESSAGE.id + '-copy',
            time: TEST_MESSAGE.time - 1,
            status: Constants.MessageStatus.DELIVERED
          });

          messageStoreCallback({
            type: Constants.ActionTypes.ADD_MESSAGE,
            message: TEST_MESSAGE_2
          });
        });

        it('getUnreadMessages() should return the new unseen message', () => {
          expect(MessageStore.getUnreadMessages(TEST_THREAD_ID).toArray()).toEqual([TEST_MESSAGE_2]);
        });

        it('getThread() function should return the messages in arrival order', () => {
          expect(MessageStore.getThread(TEST_THREAD_ID).toArray()).toEqual([TEST_MESSAGE_2, TEST_MESSAGE]);
        });

        it('getLastMessage() function should return the later arrived message', () => {
          expect(MessageStore.getLastMessage(TEST_THREAD_ID)).toEqual(TEST_MESSAGE);
        });
      });
    });
  });
});
