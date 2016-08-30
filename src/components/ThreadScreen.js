import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ApplicationActionCreator from '../action_creators/ApplicationActionCreator';
import MessageStore from '../stores/MessageStore';
import ThreadStore from '../stores/ThreadStore';
import ProfileStore from '../stores/ProfileStore';
import Message from './Message';
import MessageComposer from './MessageComposer';
import ProfileImage from './ProfileImage';
import { MessageStatus } from '../constants';
import ConnectionHelper from '../helpers/ConnectionHelper';

export default class App extends Component {
  static propTypes = {
    threadId: React.PropTypes.string.isRequired,
    userId: React.PropTypes.string.isRequired
  }

  constructor(props, context) {
    super(props, context);

    var thread = ThreadStore.getThread(this.props.threadId);
    this._partnerId = !thread.isGroup
      ? thread.participants.find(participant => participant !== this.props.userId)
      : undefined;

    this.state = {
      messages: MessageStore.getThread(this.props.threadId),
      thread: thread,
      partnerProfile: this._partnerId ? ProfileStore.get(this._partnerId) : undefined
    };

    this._handleMessageChanged = this._handleMessageChanged.bind(this);
    this._handleThreadChanged = this._handleThreadChanged.bind(this);
    this._handleBackToThreadListClick = this._handleBackToThreadListClick.bind(this);
    this._scrollToBottom = this._scrollToBottom.bind(this);
    this._handleScroll = this._handleScroll.bind(this);
  }

  componentDidMount() {
    this.MessageStoreListener = MessageStore.addListener(this._handleMessageChanged);
    this.ThreadStoreListener = ThreadStore.addListener(this._handleThreadChanged);

    this._scrollToBottom();

    this.state.messages.filter(message => message.senderId !== this.props.userId && message.status === MessageStatus.DELIVERED).forEach((message) => {
      ConnectionHelper.setMessageStatus(this.props.threadId, message.id, MessageStatus.SEEN);
    });
  }

  componentDidUpdate() {
    // This is needed when the arriving message fits into the screen
    this._markVisibleMessagedSeen();
  }

  componentWillUnmount() {
    this.MessageStoreListener.remove();
    this.ThreadStoreListener.remove();
  }

  render() {
    this._messageNodes = {};

    var messages = this.state.messages.map((message, i) => {
      return <Message key={message.id} ref={ref => this._messageNodes[message.id] = ref}
        userId={this.props.userId}
        isGroupThread={this.state.thread.isGroup}
        {...message}></Message>;
    });
    var unreadNotificationText = this.state.thread.unread + ' new message';
    if (unreadNotificationText > 1) {
      unreadNotificationText += 's';
    }
    var unreadNotification = this.state.thread.unread
      ? <div className="unread-notification">{unreadNotificationText}</div>
      : false;

    return (
      <article className="thread-screen" onScroll={this._handleScroll}>
        <header>
          <i className="icon icon-back" onClick={this._handleBackToThreadListClick}></i>
          <ProfileImage url={this.state.thread.isGroup ? this.state.thread.profileImageUrl : this.state.partnerProfile.profileImageUrl} />
          <h1>{this.state.thread.isGroup ? this.state.thread.name : this.state.partnerProfile.name}</h1>
        </header>
        {unreadNotification}
        <ul ref={ref => this._messageList = ref}>{messages}</ul>
        <footer>
          <MessageComposer threadId={this.props.threadId} onMessageSent={this._scrollToBottom} />
        </footer>
      </article>
    );
  }

  _scrollToBottom() {
    this._messageList.scrollTop = this._messageList.scrollHeight;
  }

  // http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
  _markVisibleMessagedSeen() {
    var lowestVisiblePoint = this._messageList.getBoundingClientRect().bottom;

    this.state.messages.forEach((message) => {
      if (message.senderId === this.props.userId || message.status !== MessageStatus.DELIVERED) {
        return;
      }

      var messageNode = ReactDOM.findDOMNode(this._messageNodes[message.id]);
      const messagePos = messageNode.getBoundingClientRect();

      if (messagePos.bottom <= lowestVisiblePoint) {
        ConnectionHelper.setMessageStatus(this.props.threadId, message.id, MessageStatus.SEEN);
      }
    });
  }

  _handleMessageChanged() {
    this.setState({
      messages: MessageStore.getThread(this.props.threadId)
    });
  }

  _handleThreadChanged() {
    this.setState({
      thread: ThreadStore.getThread(this.props.threadId)
    });
  }

  _handleProfileChanged() {
    if (this._partnerId) {
      this.setState({
        partnerProfile: ProfileStore.get(this._partnerId)
      });
    }
  }

  _handleBackToThreadListClick() {
    ApplicationActionCreator.goToThreadList();
  }

  _handleScroll(e) {
    this._markVisibleMessagedSeen();
  }
};
