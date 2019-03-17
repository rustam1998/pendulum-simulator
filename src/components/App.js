import React, { Component } from 'react'
import { Link, HashRouter, Route } from 'react-router-dom'
import Water from './Water'
import Air from './Air'
import Landing from './Landing'
import Title from './Title'
import '../assets/css/App.css'


export default class pendMain extends Component {

 
  render() {
  
    return (
        <div>
           <HashRouter>
              <div>
                <Route exact path='/' component={Landing}/>
                <Route path='/water' component={Water}/>
                <Route path='/air' component={Air}/>
              </div>
           </HashRouter>
        </div>
    )
  }
}