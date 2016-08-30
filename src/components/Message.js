import React, { Component } from 'react';
import classNames from 'classnames';
import ProfileStore from '../stores/ProfileStore';
import ProfileImage from './ProfileImage';
import MessageText from './MessageText';
import MessageSentTime from './MessageSentTime';
import MessageDeliveryStatus from './MessageDeliveryStatus';

export default class Message extends Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    senderId: React.PropTypes.string.isRequired,
    userId: React.PropTypes.string.isRequired,
    status: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    time: React.PropTypes.number.isRequired,
    image: React.PropTypes.string,
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      senderProfile: this._getSenderProfile()
    };

    this._handleSenderProfileChanged = this._handleSenderProfileChanged.bind(this);
  }

  componentDidMount() {
    this._profileStoreListener = ProfileStore.addListener(this._handleSenderProfileChanged);
  }

  componentWillUnmount() {
    this._profileStoreListener.remove();
  }

  render() {
    const isOutgoingMessage = (this.props.senderId === this.props.userId);
    var messageClass = classNames({
      outgoing: isOutgoingMessage
    });

    var partnerInfo = this.state.senderProfile
      ? <div className="profile">
          <ProfileImage url={this.state.senderProfile.profileImageUrl} />{this.state.senderProfile.name}
        </div>
      : false;
    var deliveryStatus = isOutgoingMessage
      ? <MessageDeliveryStatus status={this.props.status} />
      : false;
    var image = this.props.image
      ? <div className="image"><img src={this.props.image} /></div>
      : false;

    return (
      <li className={messageClass}>
        <blockquote>
          {partnerInfo}
          {image}
          <MessageText text={this.props.text} messageId={this.props.id} />
          {deliveryStatus}
          <MessageSentTime time={this.props.time} />
        </blockquote>
      </li>
    );
  }

  _getSenderProfile() {
    return this.props.isGroupThread && this.props.senderId !== this.props.userId
      ? ProfileStore.get(this.props.senderId)
      : undefined;
  }

  _handleSenderProfileChanged() {
    this.setState({
      senderProfile: this._getSenderProfile()
    });
  }
};
