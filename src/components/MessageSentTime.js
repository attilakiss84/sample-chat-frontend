import React, { Component } from 'react';

export default class Message extends Component {
  static propTypes = {
    time: React.PropTypes.number.isRequired
  }

  render() {
    var currentTime = new Date();
    var time = new Date(this.props.time);
    var timeString = '';

    if (currentTime.getFullYear() === time.getFullYear() &&
      currentTime.getMonth() === time.getMonth() &&
      currentTime.getDate() === time.getDate()
    ) {
      let minutes = time.getMinutes();
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      timeString = time.getHours() + ':' + minutes;
    } else {
      let month = time.getMonth() + 1;
      if (month < 10) {
        month = '0' + month;
      }
      timeString = time.getFullYear() + '.' + month + '.' + time.getDate();
    }

    return (
      <div className="sent-time">{timeString}</div>
    );
  }
};
