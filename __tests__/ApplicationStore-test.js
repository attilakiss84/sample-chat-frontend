jest.dontMock('flux/utils');
jest.dontMock('immutable');
jest.dontMock('object-assign');
jest.dontMock('../src/stores/ApplicationStore');
jest.dontMock('../src/constants');

describe('ApplicationStore', () => {
  var Constants = require('../src/constants.js');
  var ChatDispatcher;
  var ApplicationStore;
  var callback;

  beforeEach(() => {
    ChatDispatcher = require('../src/dispatchers/ChatDispatcher').default;
    ApplicationStore = require('../src/stores/ApplicationStore').default;
    callback = ChatDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', () => {
    expect(ChatDispatcher.register.mock.calls.length).toBe(1);
  });

  it('initializes with the appropriate default values', () => {
    expect(ApplicationStore.getSettings()).toEqual({
      userId: undefined,
      screen: Constants.Screens.THREAD_LIST,
      selectedThread: undefined
    });
  });

  it('changes screen', () => {
    const TEST_THREAD_ID = 'th1';

    callback({
      type: Constants.ActionTypes.CHANGE_SCREEN,
      screen: Constants.Screens.THREAD,
      selectedThread: TEST_THREAD_ID
    });

    expect(ApplicationStore.getSettings()).toEqual({
      userId: undefined,
      screen: Constants.Screens.THREAD,
      selectedThread: TEST_THREAD_ID
    });
  });

  it('sets current user', () => {
    const TEST_USER = 'testuser';

    callback({
      type: Constants.ActionTypes.SET_USER,
      userId: TEST_USER
    });

    expect(ApplicationStore.getSettings()).toEqual({
      userId: TEST_USER,
      screen: Constants.Screens.THREAD_LIST,
      selectedThread: undefined
    });
  });
});
