import React, { Component } from 'react';
import Config from '../../config/Config';
class name extends Component {
  constructor() {
    super();
    var config = new Config();
    this.baceUrl = config.getBaceUrl();
  }

  render() {
    return (
      'hello'
    );
  }

}

export default name;