import React, { Component } from 'react';
import Config from '../../config/Config';
class DrupalCommentOnArticleBasicAuth extends Component {
  constructor(props) {
    super(props);
    var config = new Config();
    this.baceUrl = config.getBaceUrl();
    var currentUser = [];
    var cftoken = '';
    var basicAuth = '';
    if (localStorage.getItem('current_user')) {
      currentUser = JSON.parse(localStorage.getItem('current_user'));
      basicAuth = currentUser.basicAuth;
      cftoken = currentUser.csrf_token;
      currentUser = currentUser.current_user;
    }

    this.state = {
      show: false,
      comment: '',
      comments: [],
      title: '',
      message: '',
      nid: this.props.nid,
      user: currentUser,
      csrf_token: cftoken,
      basicAuth: basicAuth,
    };
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getPreviousComments = this.getPreviousComments.bind(this);
    this.postComment = this.postComment.bind(this);
    this.getPreviousComments(this.props.nid);
  }

  show() {
    if (this.csrf_token !== '') {
      this.setState({show:true});
    }
    else {
      //@todo fix this.
      alert('Sorry You must be logged in to comment');
    }
  }
  hide() {
    this.setState({show:false});
  }
  /* Better function for larger forms */
  handleChange(event) {
    var name = event.target.name;
    var value =  event.target.value;
    this.setState({[name]: value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.postComment();
  }

  getPreviousComments() {
    var url = this.baceUrl + 'api/view-rest-comments-per-node/' + this.state.nid;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.setState({comments:data});
        console.log(data);
      })
      .catch(err => console.error(url, err.toString()))
    // @TODO get comments.

  }

  postComment() {
    if (this.state.comment && this.state.title) {
      var body = JSON.stringify(this.state.comment);
      var title = JSON.stringify(this.state.title);
      var dataToPost = '{"entity_id":[{"target_id":' + this.state.nid + '}],"entity_type":[{"value":"node"}],"comment_type":[{"target_id":"comment"}],"field_name":[{"value":"comment"}],"subject":[{"value":' + title + '}],"comment_body":[{"value":' + body +'}]}';
      var url = this.baceUrl + 'entity/comment?_format=json';
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
        console.log(data);
        console.log(status);
        if (status === 201) {
          // @todo all i have time for today.
          this.setState({message: "Comment Posted"});
        }
        else {
          this.setState({message: "Check your logs and fix stuff"});
        }
      }).catch(err => console.error(err.toString()));

      // Hide this stuff.
      setTimeout(function() {
        this.setState({show: false, title: '', comment: ''});
      }.bind(this), 3000);

    }
    else {
      this.setState({message: 'Both fields are required'});
    }

  }

  render() {
    //@todo make call to get other comments.
    console.log(this.state.comment);
    if (this.state.show === false) {
      return (
        <div>
          {this.state.comments.map( comment =>
            <div className="comments">
              <b>{comment.subject}</b>
              <p>{comment.body}</p>
              <hr/>
            </div>
          )}
          <a href="#" onClick={this.show}>Comment</a>
        </div>
      );
    }
    else {
      return (
        <div>
          <h2>Add Comment</h2>
          {this.state.message}
          <form onSubmit={this.handleSubmit}>
            <label>
              Subject:
            </label>
            <br/>
            <input type="text" name="title" value={this.state.title} onChange={this.handleChange}/><br/>
            <textarea name="comment" value={this.state.comment} onChange={this.handleChange} rows="5" cols="50"/>
            <input type="submit" value="Post Comment"/>
          </form>
          <a href="#" onClick={this.hide}>Cancel</a>
        </div>
      );
    }
  }

}

export default DrupalCommentOnArticleBasicAuth;
