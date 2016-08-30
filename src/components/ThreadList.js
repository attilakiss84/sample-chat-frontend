import React, { Component } from 'react';
import ThreadListItem from './ThreadListItem';

export default class ThreadList extends Component {
  static propTypes = {
    threads: React.PropTypes.object.isRequired, // Immutable list
    userId: React.PropTypes.string.isRequired
  }

  render() {
    let threads = this.props.threads.map((thread) => {
      return <ThreadListItem key={thread.id} userId={this.props.userId} {...thread } />;
    });

    return (
      <ul>{threads}</ul>
    );
  }
}
