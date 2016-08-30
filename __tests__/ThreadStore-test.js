jest.dontMock('../src/stores/ThreadStore');
jest.dontMock('flux/utils');
jest.dontMock('immutable');
jest.dontMock('object-assign');
jest.dontMock('../src/constants');

var currentTime = 0;

class MockDate {
  constructor() {
    this._time = currentTime;
  }

  getTime() {
    return this._time;
  }
}

describe('ThreadStore', () => {
  var HashHelper;
  var Constants = require('../src/constants');
  var Immutable = require('immutable');
  var ThreadStore;
  var MessageStore;
  var ChatDispatcher;
  var callback;

  var originalDate;

  const DEFAULT_HASH = 'hash-1';

  beforeAll(() => {
    originalDate = window.Date;
    window.Date = MockDate;
  });

  afterAll(() => {
    window.Date = originalDate;
  });

  beforeEach(() => {
    ChatDispatcher = require('../src/dispatchers/ChatDispatcher').default;
    ThreadStore = require('../src/stores/ThreadStore').default;
    MessageStore = require('../src/stores/MessageStore').default;
    callback = ChatDispatcher.register.mock.calls[0][0];
    HashHelper = require('../src/helpers/HashHelper').default;
    HashHelper.setHash(DEFAULT_HASH);
  });

  it('sets default value', () => {
    expect(ThreadStore.getState().toArray()).toEqual([]);
  });

  describe('when the first thread gets added', () => {
    const THREAD_CREATED_AT = 1;
    const TEST_THREAD = {
      id: DEFAULT_HASH,
      isGroup: false,
      participants: ['user1', 'user2'],
      name: undefined,
      profileImageUrl: undefined,
      unread: 0,
      lastMessageId: undefined,
      lastMessageAt: undefined,
      createdAt: THREAD_CREATED_AT
    };

    beforeEach(() => {
      currentTime = THREAD_CREATED_AT;
      callback({
        type: Constants.ActionTypes.CREATE_THREAD,
        participants: TEST_THREAD.participants,
        isGroup: TEST_THREAD.isGroup,
        name: TEST_THREAD.name,
        profileImageUrl: TEST_THREAD.profileImageUrl
      });
    });

    it('should add the thread as the first item in the list', () => {
      expect(ThreadStore.getState().first()).toEqual(TEST_THREAD);
    });

    it('getThread should return the thread', () => {
      expect(ThreadStore.getThread(DEFAULT_HASH)).toEqual(TEST_THREAD);
    });

    describe('and new message gets added to the thread', () => {
      const LAST_MESSAGE_ID = 'message-1';
      const LAST_MESSAGE_SENT_AT = 2;
      const LAST_MESSAGE = {
        id: LAST_MESSAGE_ID,
        time: LAST_MESSAGE_SENT_AT
      };
      const UNREAD_MESSAGES = [1, 2, 3];

      beforeEach(() => {
        MessageStore.setLastMessage(LAST_MESSAGE);
        MessageStore.setUnreadMessages(UNREAD_MESSAGES);

        callback({
          type: Constants.ActionTypes.ADD_MESSAGE,
          message: {
            threadId: DEFAULT_HASH
          }
        });
      });

      it('should update thread information properly', () => {
        var result = Object.assign({}, TEST_THREAD, {
          unread: UNREAD_MESSAGES.length,
          lastMessageId: LAST_MESSAGE_ID,
          lastMessageAt: LAST_MESSAGE_SENT_AT
        });

        expect(ThreadStore.getThread(DEFAULT_HASH)).toEqual(result);
      });
    });

    describe('and another thread gets added', () => {
      const HASH_2 = 'hash-2';
      const THREAD_CREATED_AT_2 = 3;
      const TEST_THREAD_2 = Object.assign({}, TEST_THREAD, {
        id: HASH_2,
        createdAt: THREAD_CREATED_AT_2
      });

      beforeEach(() => {
        currentTime = THREAD_CREATED_AT_2;
        HashHelper.setHash(HASH_2);

        callback({
          type: Constants.ActionTypes.CREATE_THREAD,
          participants: TEST_THREAD.participants,
          isGroup: TEST_THREAD.isGroup,
          name: TEST_THREAD.name,
          profileImageUrl: TEST_THREAD.profileImageUrl
        });
      });

      it('should be added as the first thread in the list', () => {
        expect(ThreadStore.getState().toArray()).toEqual([TEST_THREAD_2, TEST_THREAD]);
      });

      describe('and first thread receives another message', () => {
        const LAST_MESSAGE_ID_2 = 'message-2';
        const LAST_MESSAGE_SENT_AT_2 = THREAD_CREATED_AT_2 + 1;
        const LAST_MESSAGE_2 = {
          id: LAST_MESSAGE_ID_2,
          time: LAST_MESSAGE_SENT_AT_2
        };
        const UNREAD_MESSAGES = [1];

        beforeEach(() => {
          MessageStore.setLastMessage(LAST_MESSAGE_2);
          MessageStore.setUnreadMessages(UNREAD_MESSAGES);

          callback({
            type: Constants.ActionTypes.ADD_MESSAGE,
            message: {
              threadId: DEFAULT_HASH
            }
          });
        });

        it('the first thread should appear in the list first', () => {
          expect(ThreadStore.getState().toArray()).toEqual([
            Object.assign({}, TEST_THREAD, {
              unread: UNREAD_MESSAGES.length,
              lastMessageId: LAST_MESSAGE_ID_2,
              lastMessageAt: LAST_MESSAGE_SENT_AT_2
            }),
            TEST_THREAD_2
          ]);
        });
      });
    });
  });
});
