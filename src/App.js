import React, { Component } from 'react';
import './App.css';
import logo from './drupal-logo.png';
import Rlogo from './logo.svg';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import DrupalCreateAccountBasicAuth from './components/drupal/DrupalCreateAccountBasicAuth';
import DrupalLoginBasicAuth from './components/drupal/DrupalLoginBasicAuth';
import DrupalCreateBasicArticleBasicAuth from './components/drupal/DrupalCreateBasicArticleBasicAuth';
import DrupalCreateArticleWithImageBasicAuth from './components/drupal/DrupalCreateArticleWithImageBasicAuth';
import DrupalViewsRestArticleList from './components/drupal/DrupalViewsRestArticleList';
import DrupalEditArticleBasicAuth from './components/drupal/DrupalEditArticleBasicAuth';


class App extends Component {

  render() {
    var linkTohome = (<Link to="/"> Back To List </Link>);
    if (window.location.pathname === '/') {
      linkTohome = '';
    }
    //Check if local storage here.

    return (
      <BrowserRouter>
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" /> <img src={Rlogo} className="App-logo" alt="logo" />
        {linkTohome}
          <Route exact path="/" component={Home} />
          <Route  path="/basic_auth/registration" component={DrupalCreateAccountBasicAuth} />
          <Route  path="/basic_auth/login" component={DrupalLoginBasicAuth} />
          <Route  path="/basic_auth/create-article" component={DrupalCreateBasicArticleBasicAuth} />
          <Route  path="/basic_auth/create-article-with-image" component={DrupalCreateArticleWithImageBasicAuth} />
          <Route path="/views-rest-endpoint-example" component={DrupalViewsRestArticleList} />
          <Route path="/edit-article-basic-auth/:nid" component={DrupalEditArticleBasicAuth} />


        <div className="footer">
           Made By Taggartj @ <a href="https://www.xvt.com.au/">xvt.com.au</a>
        </div>
      </div>
     </BrowserRouter>
    );
  }
}
export default App;
