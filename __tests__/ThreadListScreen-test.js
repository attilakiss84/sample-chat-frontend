jest.disableAutomock();
jest.mock('../src/components/ThreadListItem');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import ThreadListScreen from '../src/components/ThreadListScreen';
import ThreadList from '../src/components/ThreadList';
import { List } from 'immutable';

const TEST_USER_ID = 'user-1';

describe('ThreadListScreen', () => {
  var instance;

  beforeEach(() => {
    instance = TestUtils.renderIntoDocument(
      <ThreadListScreen userId={TEST_USER_ID} />
    );
  });

  describe('when multiple threads are set', () => {
    const THREAD_1 = {
      id: 'thread-1',
      isGroup: true,
      participants: ['user-1', 'user-2'],
      name: 'thread-1',
      lastMessageId: undefined,
      lastMessageAt: undefined,
      createdAt: 2
    };
    const THREAD_2 = Object.assign({}, THREAD_1, {
      id: 'thread-2',
      name: 'thread-2',
      createdAt: 1
    });

    beforeEach(() => {
      instance.setState({
        threads: new List([THREAD_1, THREAD_2])
      });
    });

    it('should display all threads', () => {
      expect(TestUtils.scryRenderedDOMComponentsWithTag(instance, 'li').length).toEqual(2);
    });

    describe('When filter is applied', () => {
      beforeEach(() => {
        instance.setState({
          filter: '2'
        });
      });

      it('should display only the appropriate items', () => {
        expect(TestUtils.scryRenderedDOMComponentsWithTag(instance, 'li').length).toEqual(1);
      });
    });
  });
});
