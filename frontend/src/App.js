import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Auth from './containers/auth/auth';
import Landing from './containers/landing/landing';
import './App.css';

class App extends React.Component {

  render(){
    return (
        <div>
          <Switch>
            <Route path="/auth" component={Auth} />
            <Route exact path="/" component={Landing} />
          </Switch>
        </div>
      )
  }
}

export default App;
