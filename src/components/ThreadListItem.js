import React, { Component } from 'react';
import classNames from 'classnames';
import ApplicationActionCreator from '../action_creators/ApplicationActionCreator';
import MessageStore from '../stores/MessageStore';
import ProfileImage from './ProfileImage';
import MessageSentTime from './MessageSentTime';
import MessageText from './MessageText';
import MessageDeliveryStatus from './MessageDeliveryStatus';

export default class ThreadListItem extends Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    userId: React.PropTypes.string.isRequired,
    isGroup: React.PropTypes.bool.isRequired,
    unread: React.PropTypes.number,
    name: React.PropTypes.string,
    profileImageUrl: React.PropTypes.string,
    lastMessageId: React.PropTypes.string,
    profile: React.PropTypes.object
  }

  static defaultProps = {
    unread: 0
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      lastMessage: this._getLastMessage()
    };

    this._handleThreadClick = this._handleThreadClick.bind(this);
    this._updateLastMessage = this._updateLastMessage.bind(this);
  }

  componentDidMount() {
    this._messageStoreListener = MessageStore.addListener(this._updateLastMessage);
  }

  componentWillUnmount() {
    this._messageStoreListener.remove();
  }

  componentWillReceiveProps(newProps) {
    if (this.props.lastMessageId !== newProps.lastMessageId) {
      this.setState({
        lastMessage: MessageStore.getMessage(this.props.id, newProps.lastMessageId)
      });
    }
  }

  render() {
    var statusBlockClass = classNames('status', {
      unread: this.props.unread
    });
    var unread = this.props.unread ? <div>{this.props.unread}</div> : false;
    var messageTime = false;
    var deliveryStatus = false;
    var messageText = false;

    if (this.state.lastMessage) {
      messageTime = <MessageSentTime time={this.state.lastMessage.time} />;
      if (this.state.lastMessage.senderId === this.props.userId) {
        deliveryStatus = <MessageDeliveryStatus status={this.state.lastMessage.status} />
      }
      messageText = this.state.lastMessage.image
        ? <p><i className="icon icon-camera"></i> Image</p>
        : <MessageText text={this.state.lastMessage.text} messageId={this.state.lastMessage.id} lineBreak={false} />;
    }

    return (
      <li onClick={this._handleThreadClick}>
        <ProfileImage url={this.props.isGroup ? this.props.profileImageUrl : this.props.profile.profileImageUrl} />
        <div className="info">
          <div className="thread-name">{this.props.isGroup ? this.props.name : this.props.profile.name}</div>
          <div className="message-text">
            {messageText}
          </div>
        </div>
        <div className={statusBlockClass}>
          {messageTime}
          {unread}
          {deliveryStatus}
        </div>
      </li>
    );
  }

  _getLastMessage() {
    return this.props.lastMessageId ? MessageStore.getMessage(this.props.id, this.props.lastMessageId) : undefined;
  }

  _handleThreadClick() {
    ApplicationActionCreator.goToThread(this.props.id);
  }

  _updateLastMessage() {
    this.setState({
      lastMessage: this._getLastMessage()
    });
  }
}
