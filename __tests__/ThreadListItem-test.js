jest.disableAutomock();
jest.mock('../src/stores/MessageStore');
jest.mock('../src/action_creators/ApplicationActionCreator');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

describe('ThreadListItem', () => {
  var instance;
  var MessageStore;
  var ApplicationActionCreator;
  var ThreadListItem;

  beforeEach(() => {
    ApplicationActionCreator = require('../src/action_creators/ApplicationActionCreator');
    MessageStore = require('../src/stores/MessageStore').default;
    ThreadListItem = require('../src/components/ThreadListItem').default;
  });

  it('should display group name if it is a group chat', () => {
    const props = {
      id: 'thread-1',
      userId: 'user-1',
      isGroup: true,
      name: 'group-name',
      profileImageUrl: 'test-url',
    };

    instance = TestUtils.renderIntoDocument(
      <ThreadListItem {...props} />
    );

    expect(TestUtils.scryRenderedDOMComponentsWithTag(instance, 'div').filter(component =>
      component.textContent === props.name && component._reactInternalComponent._renderedChildren === null
    ).length).toEqual(1);
  });

  it('should display partner\'s profile name when thread is not a group thread', () => {
    const props = {
      id: 'thread-1',
      userId: 'user-1',
      isGroup: false,
      profile: {
        name: 'user-2'
      }
    };

    instance = TestUtils.renderIntoDocument(
      <ThreadListItem {...props} />
    );

    expect(TestUtils.scryRenderedDOMComponentsWithTag(instance, 'div').filter(component =>
      component.textContent === props.profile.name && component._reactInternalComponent._renderedChildren === null
    ).length).toEqual(1);
  });

  it('should redirect to Thread Screen when gets clicked', () => {
    const props = {
      id: 'thread-1',
      userId: 'user-1',
      isGroup: true,
      name: 'group-name',
      profileImageUrl: 'test-url',
    };

    instance = TestUtils.renderIntoDocument(
      <ThreadListItem {...props} />
    );

    TestUtils.Simulate.click(TestUtils.findRenderedDOMComponentWithTag(instance, 'li'));
    expect(ApplicationActionCreator.goToThread.mock.calls.length).toEqual(1);
    expect(ApplicationActionCreator.goToThread.mock.calls[0][0]).toEqual(props.id);
  });
});
