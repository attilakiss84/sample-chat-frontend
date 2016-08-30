import React, { Component } from 'react';
import classNames from 'classnames';

export default class Emoji extends Component {
  static propTypes = {
    emoji: React.PropTypes.string.isRequired
  }

  render() {
    return (
      <i className={classNames(['em', 'em-' + this.props.emoji])}></i>
    );
  }
}
