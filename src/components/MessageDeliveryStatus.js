import React, { Component } from 'react';
import classNames from 'classnames';
import { MessageStatus } from '../constants';

function getStatusSymbol(status) {
  switch (status) {
    case MessageStatus.SENT:
      return '✓';
    case MessageStatus.DELIVERED:
    case MessageStatus.SEEN:
      return '✓✓';
    default:
      return '';
  }
}

export default class MessageDeliveryStatus extends Component {
  static propTypes = {
    status: React.PropTypes.string.isRequired
  }

  render() {
    return (
      <div className={classNames(['delivery-status', this.props.status])}>
        {getStatusSymbol(this.props.status)}
      </div>
    );
  }
};
