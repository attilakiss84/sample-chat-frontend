import React, { Component } from 'react';
import ApplicationStore from '../stores/ApplicationStore';
import ThreadListScreen from './ThreadListScreen';
import ThreadScreen from './ThreadScreen';
import { Screens } from '../constants';
import ConnectionHelper from '../helpers/ConnectionHelper';

export default class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = ApplicationStore.getSettings();

    this._handleSettingsChanged = this._handleSettingsChanged.bind(this);
  }

  componentDidMount() {
    this.applicationStoreListener = ApplicationStore.addListener(this._handleSettingsChanged);

    ConnectionHelper.connect();
  }

  componentWillUnmount() {
    ConnectionHelper.disconnect();
    this.applicationStoreListener.remove();
  }

  render() {
    switch (this.state.screen) {
      case Screens.THREAD:
        return <ThreadScreen threadId={this.state.selectedThread} userId={this.state.userId} />;
      case Screens.THREAD_LIST:
      default:
        return <ThreadListScreen userId={this.state.userId} />;
    }
  }

  _handleSettingsChanged() {
    this.setState(ApplicationStore.getSettings());
  }
}
