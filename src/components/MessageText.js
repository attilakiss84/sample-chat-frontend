import React, { Component } from 'react';
import classNames from 'classnames';
import TextParser from '../helpers/TextParser';
import Emoji from './Emoji.js';

export default class MessageText extends Component {
  static propTypes = {
    text: React.PropTypes.string.isRequired,
    messageId: React.PropTypes.string.isRequired,
    lineBreak: React.PropTypes.bool,
    emoji: React.PropTypes.bool,
    url: React.PropTypes.bool
  }

  static defaultProps = {
    lineBreak: true,
    emoji: true,
    url: true
  }

  render() {
    var textParser = new TextParser(this.props.lineBreak, this.props.emoji, this.props.url);
    var textFragments = textParser.parse(this.props.text);

    textFragments = textFragments.map((fragment, i) => {
      const fragmentId = this.props.messageId + '-frag-' + i;

      switch (fragment.type) {
        case 'emoji':
          return <Emoji key={fragmentId} emoji={fragment.text} />;
        case 'newline':
          return <br key={fragmentId} />;
        case 'url':
          // This will always be an external url pointing to untrusted content.
          // Noopener is needed for security reasons
          // referrer and nofollow to keep the site brand clean and secure
          return <a key={fragmentId} target="_blank" rel="noopener noreferrer nofollow" href={fragment.text}>{fragment.text}</a>;
        case 'text':
        default:
          return <span key={fragmentId}>{fragment.text}</span>;
      }
    });

    return (
      <p>{textFragments}</p>
    );
  }
};
