import React, { Component } from 'react';
import ResizingTextArea from './ResizingTextArea';
import classNames from 'classnames';
import ConnectionHelper from '../helpers/ConnectionHelper';

// Taken from http://code.hootsuite.com/html5/
const imageUploadSupported = (() => {
  if (navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
    return false;
  }
  if (!window.File || !window.FileReader || !window.FormData) {
    return false;
  }
  var elem = document.createElement('input');
  elem.type = 'file';
  return !elem.disabled;
})();

export default class MessageComposer extends Component {
  static propTypes = {
    threadId: React.PropTypes.string.isRequired,
    onMessageSent: React.PropTypes.func
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      image: '',
      text: ''
    };

    this._handleUploadImageClick = this._handleUploadImageClick.bind(this);
    this._handleImageChanged = this._handleImageChanged.bind(this);
    this._handleRemovePreviewClick = this._handleRemovePreviewClick.bind(this);
    this._handleTextChanged = this._handleTextChanged.bind(this);
    this._handleSendMessageClick = this._handleSendMessageClick.bind(this);
  }

  render() {
    var imageUploader = false;
    var imageUploadIcon  = false;
    var preview = false;

    if (imageUploadSupported && !this.state.image) {
      imageUploader = <input ref={(ref) => this._imageUploader = ref} className="hidden" type="file" accept="image/*" onChange={this._handleImageChanged} />;
      imageUploadIcon = <i className={classNames('icon', 'icon-camera', {hidden: this.state.text})} onClick={this._handleUploadImageClick}></i>;
    }

    if (this.state.image) {
      preview = <div className="overlay">
                  <i className="icon icon-back" onClick={this._handleRemovePreviewClick}></i>
                  <img src={this.state.image} />
                </div>;
    }

    var editorClassNames = classNames('message-composer', {
      preview: this.state.image
    });

    return (
      <div className={editorClassNames}>
        <div>
          {preview}
          <ResizingTextArea text={this.state.text} onTextChanged={this._handleTextChanged} />
          {imageUploader} {imageUploadIcon}
        </div>
        <div>
          <div>
            <i className="icon icon-microphone" onClick={this._handleSendMessageClick}></i>
          </div>
        </div>
      </div>
    );
  }

  _handleUploadImageClick(e) {
    this._imageUploader.click();
  }

  _handleImageChanged(e) {
    var file = e.target.files[0];

    if (!file || !/^image\/\w+$/.test(file.type)) {
      return;
    }

    var reader = new FileReader();
    reader.onloadend = () => {
      this.setState({
        image: reader.result
      });
    }
    reader.onerror = () => {
      this._imageUploader.value = '';
      // Emptying the value won't trigger the change event
      this.forceUpdate();
    }

    reader.readAsDataURL(file);
  }

  _handleRemovePreviewClick(e) {
    this.setState({
      image: ''
    });
  }

  _handleTextChanged(text) {
    this.setState({
      text: text
    });
  }

  _handleSendMessageClick(e) {
    if (!this.state.text && !this.state.image) {
      return;
    }

    var onMessageSent = this.props.onMessageSent;

    ConnectionHelper.sendMessage(this.props.threadId, this.state.text, this.state.image)
    .then(() => {
      this.setState({
        image: '',
        text: ''
      });

      if (typeof onMessageSent === 'function') {
        onMessageSent();
      }
    });
  }
}
