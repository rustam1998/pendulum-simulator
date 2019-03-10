import '../assets/css/App.css'
import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Landing from './Landing'
import pendMain from './pendMain';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Link to='/'>Landing</Link>
          <Link to='/main'>Main</Link>
          <Route exact path='/' component={Landing}/>
          <Route exact path='/main' component={pendMain}/>
        </div>
      </Router>
    )
  }
}

export default App
