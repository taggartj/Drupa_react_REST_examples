import React, { Component } from 'react';
import Config from '../../config/Config';
class DrupalCreateAccountBasicAuth extends Component {
  constructor() {
    super();
    var config = new Config();
    this.baceUrl = config.getBaceUrl();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.drupalCreateAccount = this.drupalCreateAccount.bind(this);
    this.state = {
      created: false,
      username: '',
      password: '',
      email: '',
      message: '',
    }
  }

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
    if (this.state.username && this.state.password && this.state.email) {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)) {
        this.setState({message: ''});
        this.drupalCreateAccount();
      }
      else {
        this.setState({message: 'Email Not valid.'});
      }
    }
    else {
      this.setState({message: 'Please Enter all details'});
    }
  }

  drupalCreateAccount() {
    var dataToPost = '{"name": {"value": "' + this.state.username + '"}, "mail": {"value": "' + this.state.email + '"}, "pass": {"value": "'+ this.state.password +'"}}';
    var url = this.baceUrl + 'user/register?_format=json';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
      if (status === 200) {
        //wee good
        this.setState({'created': true});
      }
      else {
        if (status === 422) {
          this.setState({'message': data.message});
        }
        else {
          this.setState({'message': 'Error please check console and fix stuff'});
          console.log(data);
          console.log(status);
        }
      }


    }).catch(err => console.error(err.toString()));
  }


  render() {
    var header = <h2>Create new account</h2>;
    var file = 'src/components/drupal/DrupalCreateAccountBasicAuth.js';
    var created = this.state.created;
    if (created === false) {
      return (
        <div>
          {header} {file}<br/>
          {this.state.message}
          <form onSubmit={this.handleSubmit}>
            <label>
            Username:
          </label>
            <br/>
            <input type="text" name="username" value={this.state.username} onChange={this.handleChange}/>
            <br/>

            <label>
              Email:
            </label>
            <br/>
            <input type="text" name="email" value={this.state.email} onChange={this.handleChange}/>
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
    else {
      return (
        <div>
          {header} {file}<br/>
          Great You are all ready to go ! <a href="/basic_auth/login">please login</a>:
        </div>
      );
    }

  }

}

export default DrupalCreateAccountBasicAuth;