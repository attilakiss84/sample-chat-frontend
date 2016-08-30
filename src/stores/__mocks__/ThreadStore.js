import { List } from 'immutable';

var threads = new List();

const ThreadStore = {
  addListener: () => {

  },

  getState: () => {
    return threads;
  },

  setState: (newThreads) => {
    threads = new List(newThreads);
  }
};

export default ThreadStore;
