import React, { Component } from 'react';
import Config from '../../config/Config';
class DrupalCreateBasicArticleBasicAuth extends Component {
  constructor(props, context) {
    super(props, context);
    var config = new Config();
    this.baceUrl = config.getBaceUrl();
    // Set up the user;
    var currentUser = [];
    var cftoken = '';
    var basicAuth = '';
    if (localStorage.getItem('current_user')) {
      currentUser = JSON.parse(localStorage.getItem('current_user'));
      basicAuth = currentUser.basicAuth;
      cftoken = currentUser.csrf_token;
      currentUser = currentUser.current_user;
    }
    // LOL check if there is a user.
    if (currentUser.length === 0) {
      this.leave();
    }

    this.state = {
      user: currentUser,
      csrf_token: cftoken,
      basicAuth: basicAuth,
      body: '',
      title: '',
      post: true,
      message: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.postNewArticle = this.postNewArticle.bind(this);
    this.showForm = this.showForm.bind(this);
  }

  /* Better function for larger forms */
  handleChange(event) {
    var name = event.target.name;
    var value =  event.target.value;
    this.setState({[name]: value});
  }

  handleSubmit(event) {
    event.preventDefault();
    var message = this.validateSubmit();
    if (message) {
      alert(message);
    }
    else {
      return this.postNewArticle();
    }

  }

  validateSubmit() {
    var message = '';
    if (this.state.title.length === 0) {
      message = 'Please Enter a title';
    }
    return message;
  }

  postNewArticle() {
    // Make sure strings are is "safe".
    var body = JSON.stringify(this.state.body);
    var title = JSON.stringify(this.state.title);

    var dataToPost = '{"title": [{"value": ' + title + '}], "body": [{"value": ' + body + ', "format" : "full_html"}], "type": [{"target_id": "article"}]}';
    var url = this.baceUrl + 'entity/node?_format=json';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': this.state.csrf_token,
        'Authorization': this.state.basicAuth,
      },
      body: dataToPost
    }).then(response => {
      var data = response.json();
      return data.then(function(result) {
        return [result, response.status];
      });
    }).then(data => {
      var status = data[1];
      data = data[0]; // json data here.
      switch (status) {
        case 201:
          var nodeUrl = this.baceUrl + 'node/' + data.nid[0].value;
          this.setState({ message: 'Article Posted go see it on your drupal site ' + nodeUrl});
          break;
        case 401:
          this.setState({ message: data.message});
          break;
        default:
          this.setState({ message: 'Some thing went wrong check your console.'});
          console.log(data);
          console.log('Status ' + status);
          break;
      }
      // Hide this stuff.
      setTimeout(function() {
        this.setState({post: true, title: '', body: ''});
      }.bind(this), 4000);

    }).catch(err => console.error(err.toString()));
  }

  showForm() {
    this.setState({post: false, message: ''});
  }

  leave() {
    alert('Busted You need to be logged in.');
    // Redirect out of here.
  }

  render() {
    var header = <h2>Create Basic Article</h2>;
    var file = <p>File: src/components/drupal/DrupalCreateBasicArticleBasicAuth.js</p>;

    if (this.state.post === false) {
      return (
        <div>
          {header} {file}
          <div>
            {this.state.message }
            <form onSubmit={this.handleSubmit}>
              <label>
                Title:
              </label>
              <br/>
              <input type="text" name="title" value={this.state.title} onChange={this.handleChange}/>
              <br/>
              <label>
               Body
              </label>
              <br/>
              <textarea name="body" value={this.state.body} onChange={this.handleChange} rows="5" cols="50"/>
              <p> Note You can enter html</p>
              <br/>
              <input type="submit" value="Submit"/>
            </form>
          </div>
        </div>
      );
    }
    else {
      return (
        <div>
          {header} {file}
          <button onClick={this.showForm}>Create Article</button>
        </div>
      );
    }
  }
}

export default DrupalCreateBasicArticleBasicAuth;