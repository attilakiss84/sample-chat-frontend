import Immutable from 'immutable';
import { MapStore } from 'flux/utils';
import Dispatcher from '../dispatchers/ChatDispatcher';
import { Screens, ActionTypes } from '../constants';

class ApplicationStore extends MapStore {
  getInitialState() {
    return Immutable.fromJS({
      userId: undefined,
      screen: Screens.THREAD_LIST,
      selectedThread: undefined,
    });
  }

  reduce(state, action) {
    switch (action.type) {
      case ActionTypes.SET_USER:
        return state.set('userId', action.userId);
      case ActionTypes.CHANGE_SCREEN:
        return state.withMutations((mutableState) => {
          mutableState
            .set('screen', action.screen)
            .set('selectedThread', action.selectedThread);
        });
      default:
        return state;
    }
  }

  getSettings() {
    return this.getState().toObject();
  }
}

const instance = new ApplicationStore(Dispatcher);
export default instance;
