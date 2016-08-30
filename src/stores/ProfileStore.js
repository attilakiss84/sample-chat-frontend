import { MapStore } from 'flux/utils';
import ChatDispatcher from '../dispatchers/ChatDispatcher';
import { ActionTypes } from '../constants';

class ProfileStore extends MapStore {
  reduce(state, action) {
    switch (action.type) {
      case ActionTypes.ADD_OR_UPDATE_PROFILE:
        return state.set(action.profile.id, Object.assign(state.get(action.profile.id, {}), action.profile));
      default:
        return state;
    }
  }

  get(id) {
    return this.getState().get(id);
  }
}

const instance = new ProfileStore(ChatDispatcher);
export default instance;
