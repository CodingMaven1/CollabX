import React from 'react';
import {connect} from "react-redux";
import * as actions from './redux/auth/authActions';
import {Switch, Route} from 'react-router-dom';
import Auth from './containers/auth/auth';
import Landing from './containers/landing/landing';
import './App.css';

class App extends React.Component {

  componentDidMount(){
    let {fetchUser} = this.props;
    fetchUser()
  }

  render(){
    let {auth} = this.props;
    console.log(auth)
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

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, actions)(App);
