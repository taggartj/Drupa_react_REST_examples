import React, { Component } from 'react';
import cros from '../images/drupal-doc-cros-setting.png';
import Config from '../config/Config';
import DrupalCompList from './DrupalCompList';

class Home extends Component {
  constructor(props) {
    super(props);
    var config = new Config();
    this.baceUrl = config.getBaceUrl();

    var isloggedIn = false;
    // Check if has logged in.
    if (localStorage.getItem('current_user')) {
      isloggedIn = true;
    }

    this.state = {
      drupalConfig: false,
      isLoggedIn: isloggedIn,
    };
    this.showDrupalConfig = this.showDrupalConfig.bind(this);
  }

  showDrupalConfig() {
    var togg = this.state.drupalConfig;
    if (togg === true) {
      this.setState({drupalConfig: false});
    }
    else {
      this.setState({drupalConfig: true});
    }
  }
  
  render() {
    var hidden = 'hidden';
    if (this.state.drupalConfig === true ) {
      hidden = '';
    }
    if (this.state.drupalConfig === false ) {
      hidden = 'hidden';
    }

    var appConfig = 'Your Current Drupal Url ' + this.baceUrl;
    var showComps = <DrupalCompList logged={this.state.isLoggedIn} />;


    if (this.baceUrl === 'http://yourdrupalsite.com/') {
      appConfig = 'Please open "src/config/Config.js" and change the baceUrl to your drupal install.';
      showComps = '';
    }

    return (
      <div>
        <h2> Drupal React Examples</h2>
        <p> This Example react app will gide you through some of the basics in interacting
        with Drupal Rest Api with React.</p>

        <h4>About this App:</h4>
        <p> This App was made with: <a href="https://github.com/facebook/create-react-app">https://github.com/facebook/create-react-app</a>, which is a great React application boilerplate-er.</p>

        <h2>The Drupal Stuff:</h2>
        <button onClick={this.showDrupalConfig}>Show/Hide</button>
        <div id="config-drupal" className={hidden}>
        <p>This App Assumes you have a local Drupal 8 Development Environment</p>
        <p><b>Note:</b> Some components will have special drupal requirements. like the jwt example.</p>

        <h3>Base configuration from a FRESH standard drupal install profile:</h3>
        <p> As Will be interacting with the "Article" content type.</p>
        <p>Please Open the QuickStartModule Folder and move the 2 modules and place in your modules folder. <br/>
          these modules will make sure you have the required modules and permissions used in this app.</p>

        <h4>Contrib Modules to Install:</h4>
        <ul>
          <li><a href="https://www.drupal.org/project/jsonapi" target="_blank" rel="noopener noreferrer">jsonapi</a> - `composer require drupal/jsonapi`</li>
          <li><a href="https://www.drupal.org/project/restui" target="_blank" rel="noopener noreferrer">restui</a> - `composer require drupal/restui`</li>
          <li><a href="https://www.drupal.org/project/file_entity" target="_blank" rel="noopener noreferrer">file_entity</a> `composer require drupal/file_entity`  (May require a patch see below)</li>
          <li><a href="https://www.drupal.org/project/token" rel="noopener noreferrer">token</a> - `composer require drupal/token`as it is a dependincy of file_entity </li>
        </ul>

        Once Have the above modules, go to admin/modules
        <br/>
        Install First<br/>
        "React Clean" and after that , install "React Rest Quick start"
        <br/>
        <br/>
        <h4>Optional: Patch file_entity module</h4>
        Note: At the time of creating this the contrib file_entity needs a patch so you can upload files via
          rest, <a href="https://www.drupal.org/files/issues/file_entity_save_permanent.patch" rel="noopener noreferrer">Patch here</a> <br/>

          Or Since its development open up:
        modules/file_entity/src/Normalizer/FileEntityNormalizer.php
        line 48 ish
        <pre>
        remove the else 
        throw  ...
         }
      and add "$entity->status = FILE_STATUS_PERMANENT;"
        </pre>


        <h4>Drupal Development Cros Settings</h4>
        <p> We need to change these if your React app is not on the same server as drupal, note if you dont have a sites/default/services.yml copy sites/default/default-services.yml
         to sites/default/services.yml</p>
        As Per the Drupal Docks <a href="https://www.drupal.org/docs/8/core/modules/rest/3-post-for-creating-content-entities#comment-12489395" target="_blank" rel="noopener noreferrer">Here</a> Cros Settings for development should be like the following:
        <img src={cros} alt="cros"/>
        </div>

        <h2> The React Stuff:</h2>
        {appConfig}
        <br/>
        {showComps}

      </div>
    );
  }
}
export default Home;