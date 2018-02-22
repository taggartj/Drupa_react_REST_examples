import React, { Component } from 'react';
import Config from '../../config/Config';
import { Link } from 'react-router-dom';
class DrupalLoginBasicAuth extends Component {
  constructor(props) {
    super(props);
    var config = new Config();
    this.baceUrl = config.getBaceUrl();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.drupalLogin = this.drupalLogin.bind(this);
    this.killLocalUserStorage = this.killLocalUserStorage.bind(this);
    var currentUser = [];
    this.isLoggedinMessage = '';
    if (localStorage.getItem('current_user')) {
      currentUser = JSON.parse(localStorage.getItem('current_user'));
      // Check the stored user details.
      // console.log(currentUser);
      this.isLoggedinMessage = 'Ha ha ha you refreshed the page but still "logged in"';
    }
    this.state = {
      username: '',
      password: '',
      show: false,
      current_user: currentUser,
      message: '',
    };
    //console.log(this);
  }
  // Methods for form
  /* Better function for larger forms */
  handleChange(event) {
    var name = event.target.name;
    var value =  event.target.value;
    this.setState({[name]: value});
  }

  // submit the form.
  handleSubmit(event) {
    event.preventDefault();
    this.setState({message: ''});
    // basic validation lol.
    if (this.state.username && this.state.password) {
      this.drupalLogin();
    }
    else {
      this.setState({message: 'Please Enter Username and password'});
    }
  }

  // Drupal Login
  drupalLogin() {
    var url = this.baceUrl + 'user/login?_format=json';
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.username,
        pass: this.state.password,
      })
    }).then(response => {
      var data = response.json();
      return data.then(function(result) {
        return [result, response.status];
      });
    })
    .then(data => {
      console.log(data);
      var status = data[1];
      data = data[0]; // json data here.
      // Handle all the things.
      switch (status) {
        case 200:
          var basic = this.formatBasicAuth(this.state.username, this.state.password);
          data['basicAuth'] = basic;
          this.setState({ current_user: data});
          // Set local storage so can refresh the page ect.
          localStorage.setItem('current_user', JSON.stringify(data));
          break;
        case 400:
          if (data.message) {
            this.setState({message: data.message, password: ''});
          }
          break;
        default:
          break;
      }
        
    }).catch(err => console.error(url, err.toString()));
  }

  // If using Basic Auth.
  formatBasicAuth(userName, password) {
    var basicAuthCredential = userName + ":" + password;
    var bace64 =  btoa(basicAuthCredential);
    return 'Basic ' + bace64;
  }

  // Kills the local user storage so react thinks you are logged out.
  killLocalUserStorage() {
    this.setState({ current_user: []});
    localStorage.setItem('current_user', []);
  }

  render() {

    var user = this.state.current_user;
    if (user.length !== 0 && user.current_user) {
      var name = user.current_user.name;

      return (
        <div>
          <p>Welcome {name} Seems like this worked you are now logged in.</p>
          <p>Go ahead refresh the page ...</p>
          {this.isLoggedinMessage}
          <p><button onClick={this.killLocalUserStorage}>Logout of react</button></p>
          <Link to="/"> Continue With Testing more components </Link>);
        </div>
      );
    }
    else {
      return (
        <div>
          <h2>Login:</h2>
          <p>File: src/components/drupal/DrupalLoginBasicAuth.js</p>
          <p> This assumes you are using basic auth. Look at your console if this does not work you probably did not set up the cros settings.</p>
          {this.state.message }
          <form onSubmit={this.handleSubmit}>
            <label>
              Username:
            </label>
            <br/>
            <input type="text" name="username" value={this.state.username} onChange={this.handleChange}/>
            <br/>

            <label>
              Password:
            </label>
            <br/>
            <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
            <br/>
            <input type="submit" value="Submit"/>
          </form>
        </div>
      );

    }
  }
}

export default DrupalLoginBasicAuth;