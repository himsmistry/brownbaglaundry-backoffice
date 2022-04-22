import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './scss/style.scss';
import jquery from 'jquery';
window.$ = window.jQuery = jquery;
const Login = React.lazy(() => import('./views/login/login'))
const Forgot = React.lazy(() => import('./views/forgot-password/forgot-password'))
const Reset = React.lazy(() => import('./views/reset/reset'))

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'));

class App extends Component {

  render() {
    return (
      <HashRouter>
          <React.Suspense fallback={loading}>
          <Switch>
            <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
            <Route exact path="/forgot" name="Forgot Page" render={props => <Forgot {...props}/>} />
            <Route exact path="/reset" name="Reset Page" render={props => <Reset {...props}/>} />
            <Route path="/" name="Home" render={props => <TheLayout {...props}/>} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}

export default App;
