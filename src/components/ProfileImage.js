import React, { Component } from 'react';
import { Profiles } from '../constants';

export default class ProfileImage extends Component {
  static propTypes = {
    url: React.PropTypes.string
  }

  static defaultProps = {
    url: Profiles.DEFAULT_PROFILE_IMAGE_URL
  }

  render() {
    return (
      <div className="profile-image">
        <img src={this.props.url} />
      </div>
    );
  }
}
