jest.dontMock('flux/utils');
jest.dontMock('../src/stores/ProfileStore');
jest.dontMock('../src/constants');

describe('ProfileStore', () => {
  var Constants = require('../src/constants.js');
  var ChatDispatcher;
  var ProfileStore;
  var callback;

  beforeEach(() => {
    ChatDispatcher = require('../src/dispatchers/ChatDispatcher').default;
    ProfileStore = require('../src/stores/ProfileStore').default;
    callback = ChatDispatcher.register.mock.calls[0][0];
  });

  it('sets default value', () => {
    expect(ProfileStore.getState().toObject()).toEqual({});
  });

  describe('stores profile', () => {
    var TEST_ID = 'test-id';
    var TEST_PROFILE = {
      id: TEST_ID,
      name: 'test-name',
      profileImageUrl: undefined
    };

    beforeEach(() => {
      callback({
        type: Constants.ActionTypes.ADD_OR_UPDATE_PROFILE,
        profile: TEST_PROFILE
      });
    });

    it('by profile id', () => {
      var result = {};
      result[TEST_ID] = TEST_PROFILE;

      expect(ProfileStore.getState().toObject()).toEqual(result);
    });

    it('retrieves it', () => {
      expect(ProfileStore.get(TEST_ID)).toEqual(TEST_PROFILE);
    });
  });
});
