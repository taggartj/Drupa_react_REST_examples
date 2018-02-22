import React, { Component } from 'react';
import Config from '../config/Config';
class DrupalCompList extends Component {
  constructor(props){
    super(props);
    var config = new Config();
    this.baceUrl = config.getBaceUrl();
    this.state = {
      isLogged: this.props.logged,
    };
    console.log(this.state.isLogged);
  }

  render() {
    var logged = '';
    var registerAccount = <a href="/basic_auth/registration">Register Account</a>;
    var createArticle = 'create an article (login required)';
    var createArticleWithImage = 'Create Article with image (login required)';
    if (this.state.isLogged === true) {
      registerAccount = 'Register Account (need to logout)';
      createArticle = <a href="/basic_auth/create-article">Create Basic Article</a>;
      createArticleWithImage = <a href="/basic_auth/create-article-with-image">Create Article With Image</a>;
    }

    if (this.baceUrl === 'http://yourdrupalsite.com/') {
      return (
        <div>Components will Show up here when you fix your Config</div>
      );
    }
    else {
      return (
        <div>
          <div>
            <h2>Basic Auth</h2>
            <p>In these Examples We Will be using basic_auth</p>
            <ul>
              <li><a href="/basic_auth/login">login / out</a></li>
              <li>{registerAccount}</li>
              <li>{createArticle}</li>
              <li>{createArticleWithImage}</li>
              <li><a href="/views-rest-endpoint-example">Views List Article</a> (with edit article if logged in and own content) </li>
              <li>Json Api - List Articles</li>
            </ul>
            <h2>Coming soon</h2>
            Comment on article
          </div>

        </div>
      );
    }
  }
}

export default DrupalCompList;