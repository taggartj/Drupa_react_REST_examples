import React, { Component } from 'react';
import Config from '../../config/Config';
import DrupalCommentOnArticleBasicAuth from './DrupalCommentOnArticleBasicAuth';
class DrupalViewsRestArticleList extends Component {
  constructor() {
    super();
    var config = new Config();
    this.baceUrl = config.getBaceUrl();
    // for editing.
    var userid = 0;
    if (localStorage.getItem('current_user')) {
      var currentUser = JSON.parse(localStorage.getItem('current_user'));
     userid = currentUser.current_user.uid;
    }
    this.state = {
      data: [],
      uid: userid,
    };
    this.canEdit = this.canEdit.bind(this);
    this.getViewsArticles = this.getViewsArticles.bind(this);
    this.canComment = this.canComment.bind(this);
  }

  getViewsArticles() {
    var url = this.baceUrl + 'api/view-rest-image-articles?_format=json';
    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.setState({data: data});
        console.log(data);
      })
      .catch(err => console.error(this.props.url, err.toString()))
  }

  canEdit(uid, nid) {
    if (uid === this.state.uid || this.state.uid === 1) {
      var edit = '/edit-article-basic-auth/' + nid;
      return <a href={edit}>Edit</a>;
    }
    else {
     return '';
    }
  }

  canComment(nid) {
    if (this.state.uid !== 0) {
      return <DrupalCommentOnArticleBasicAuth nid={nid} />
    }
    else {
      return '';
    }
  }

  render() {
    var bace = this.baceUrl.substring(0, this.baceUrl.length - 1);
    var info = 'On install of module it created a view at: admin/structure/views/view/rest_image_articles';

    if (this.state.data.length !== 0) {
      return (
        <div id="views-rest-articles">
          <h2>Articles with images</h2>
          <p>{info}</p>
          <p> Your user id {this.state.uid}</p>
        {this.state.data.map(article =>
          <div className="views_articles" key={article.nid}>
            <h4>{article.title}</h4>
            <div><img src={bace + article.field_image} alt="rest image"/><br/>{article.body}<br/>
              {this.canEdit(article.uid, article.nid)} {this.canComment(article.nid)}
            </div>

          </div>
        )}
      </div>);
    }
    else {
      this.getViewsArticles();
      return (<div>
        <h2>Articles with images</h2>
        <p>{info}</p>
        
        Loading ... make sure you have Articles with images.
      </div>);
    }
  }
}

export default DrupalViewsRestArticleList;