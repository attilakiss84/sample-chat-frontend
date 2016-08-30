import React, { Component } from 'react';
import ThreadList from './ThreadList';
import ThreadStore from '../stores/ThreadStore';
import ProfileStore from '../stores/ProfileStore';
import classNames from 'classnames';

export default class ThreadListScreen extends Component {
  static propTypes = {
    userId: React.PropTypes.string.isRequired
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      threads: this._getThreads(),
      filter: ''
    };

    this._handleFilterChanged = this._handleFilterChanged.bind(this);
    this._handleClearFilterClick = this._handleClearFilterClick.bind(this);
    this._handleThreadListChanged = this._handleThreadListChanged.bind(this);
    this._handleProfileChanged = this._handleProfileChanged.bind(this);
  }

  componentDidMount() {
    this._threadStoreListener = ThreadStore.addListener(this._handleThreadListChanged);
    this._profileStoreListener = ProfileStore.addListener(this._handleProfileChanged);
  }

  componentWillUnmount() {
    this._threadStoreListener.remove();
    this._profileStoreListener.remove();
  }

  render() {
    const filter = this.state.filter.toLowerCase();
    var threads = filter ? this.state.threads.filter((thread) => {
      const threadName = thread.isGroup ? thread.name : thread.profile.name;
      return threadName.toLowerCase().indexOf(filter) >= 0;
    }) : this.state.threads;
    var removeIconClassNames = classNames('icon', 'icon-remove', {
      hidden: !this.state.filter
    });

    return (
      <article className="thread-list-screen">
        <header>
          <h1>Unity3D</h1>
          <div className="search">
            <span className="icon icon-search"></span>
            <input placeholder="Search..." value={this.state.filter} onChange={this._handleFilterChanged} />
            <span className={removeIconClassNames} onClick={this._handleClearFilterClick}></span>
          </div>
        </header>
        <ThreadList userId={this.props.userId} threads={threads} />
      </article>
    );
  }

  _setProfileForThread(thread) {
    const partnerId = !thread.isGroup ? thread.participants.find(participant => participant !== this.props.userId) : undefined;

    return Object.assign({}, thread, {
      profile: partnerId ? ProfileStore.get(partnerId) : undefined
    });
  }

  _getThreads() {
    return ThreadStore.getState().map(thread => this._setProfileForThread(thread));
  }

  _handleFilterChanged(event) {
    this.setState({
      filter: event.target.value
    });
  }

  _handleClearFilterClick() {
    this.setState({
      filter: ''
    });
  }

  _handleThreadListChanged() {
    this.setState({
      threads: this._getThreads()
    });
  }

  _handleProfileChanged() {
    this.setState({
      threads: this.state.threads.map(thread => this._setProfileForThread(thread))
    });
  }
}
