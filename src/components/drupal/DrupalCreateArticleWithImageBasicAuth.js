import React, { Component } from 'react';
import Config from '../../config/Config';


class DrupalCreateArticleWithImageBasicAuth extends Component {
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
      file: [],
      file_message: '',
      file_string:'',
      uploadedFile:[],
      fid:0,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.postNewArticle = this.postNewArticle.bind(this);
    this.showForm = this.showForm.bind(this);
    /* file stuff*/
    this.onChangeFile = this.onChangeFile.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    this.uploadDrupalImage = this.uploadDrupalImage.bind(this);
  }

  onChangeFile(e) {

    // Remove this if want to use an upload button.
    this.fileUpload(e);
  }

  fileUpload(event) {
    var file = event.target.files[0];
    this.setState({file:file});
    event.preventDefault();
    var message = '';
    if (file.length === 0) {
      message = 'Please select an image';
    }
    else {
      // Check types.
      var type = file.type;
      var types = ['image/png', 'image/jpeg'];
      if (types.indexOf(type) === -1) {
        message = 'Sorry only jpeg and png are allowed';
      }
      else {
        // bace 64 time.
        var reader = new FileReader();
        reader.onloadend = function() {
          message = 'Please click upload';
          this.setState({file_string: reader.result});
          this.setState({doArticlePost: false});
          var stringImage = reader.result;
          if (stringImage) {
            var striped = stringImage.split("base64,");
            if (striped[1]) {
              this.uploadDrupalImage(striped[1]);
            }
          }
        }.bind(this);
        reader.readAsDataURL(file);
      }
    }
    this.setState({file_message: message});
  }

  uploadDrupalImage(bace64) {
    // Could only get hal_json to work.
    var dataToPost = '{"_links": {"type": {"href": ' + JSON.stringify(this.baceUrl + 'rest/type/file/image') + '}},"filename": [{"value": "' + this.state.file.name + '"}],"data":[{"value": "' + bace64 + '"}]}';
    var url = this.baceUrl + 'entity/file?_format=hal_json';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/hal+json',
        'X-CSRF-Token': this.state.csrf_token,
        'Authorization': this.state.basicAuth,
      },
      body: dataToPost
    }).then(response => response.json()).then(data => {
      if (data) {
        this.setState({uploadedFile: data});
        if (data.fid) {
          //console.log(data.fid[0].value);
          this.setState({fid: data.fid[0].value});
        }
      }
    }).catch(err => console.error(err.toString()));
    return false;
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
    if (this.state.fid !== 0) {
      dataToPost = '{"title": [{"value": ' + title + '}], "body": [{"value": ' + body + ', "format" : "full_html"}], "type": [{"target_id": "article"}], "field_image": [{"target_id": ' + this.state.fid + '}]}';
    }

    console.log(dataToPost);

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
    var header = <h2>Create Article With image</h2>;
    var file = <p>File: src/components/drupal/DrupalCreateArticleWithImageBasicAuth.js</p>;
    var fileData = this.state.file_message;
    var fileString = this.state.file_string;
    if (fileString.length !== 0) {
      fileString = <img src={this.state.file_string}/>
    }

    
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
                File:
              </label>
              <div>{fileData} {fileString}</div>
              <input name="file" type="file" onChange={this.fileUpload} />
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
          <p>Config drupal <a href="https://www.drupal.org/project/drupal/issues/2682341#comment-11965256">explained here</a> but should be done for you.
            <br/>
            <br/> At the time of creating this you still need to patch the file_entity module</p>
             <p>https://www.drupal.org/files/issues/file_entity_save_permanent.patch</p>
          <h3>Drupal admin:</h3>
          <p>Another Gotcha is you need to goto your {this.baceUrl}admin/structure/types/manage/article/display and change
            the image field <b>Format</b> to renderd entity set Rendered as Thumbnail ect <br/> or you wont see the image when you view the node but when you edit the node the image it will be attached</p>
          <p> If still not showing up in drupal go to admin/structure/file-types/manage/image/edit/display/thumbnail and change the format to original image not thumnail.. lol good old drupal !</p>

          <button onClick={this.showForm}>Create Article with image</button>
        </div>
      );
    }
  }
}

export default DrupalCreateArticleWithImageBasicAuth;