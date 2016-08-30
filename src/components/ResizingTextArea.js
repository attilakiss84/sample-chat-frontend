import React, { Component } from 'react';

export default class ResizingTextArea extends Component {
  static propTypes = {
    text: React.PropTypes.string.isRequired,
    onTextChanged: React.PropTypes.func.isRequired,
    maxLines: React.PropTypes.number
  }

  static defaultProps = {
    maxLines: 3
  }

  constructor(props, context) {
    super(props, context);

    this._handleChange = this._handleChange.bind(this);
    this._handleDelayedChange = this._handleDelayedChange.bind(this);
  }

  componentDidMount() {
    this._lineHeight = parseFloat(getComputedStyle(this._textarea).fontSize);
    this._resize();
  }

  componentDidUpdate() {
    this._resize();
  }

  render() {
    return (
      <textarea
        rows="1"
        className="resizing-text-area"
        ref={(ref) => this._textarea = ref}
        value={this.props.text}
        onChange={this._handleChange}
        onKeyDown={this._handleDelayedChange}
        onCut={this._handleDelayedChange}
        onPaste={this._handleDelayedChange}
        onDrop={this._handleDelayedChange}></textarea>
    );
  }

  _handleChange(e) {
    this.props.onTextChanged(this._textarea.value);
    this._resize();
  }

  _handleDelayedChange(e) {
    window.setTimeout(this._handleChange, 0);
  }

  _resize() {
    this._textarea.style.height = 'auto';
    this._textarea.style.height = Math.min(this._textarea.scrollHeight, this.props.maxLines * this._lineHeight) + 'px';
  }
};
