import React, { Component } from 'react'
import '../assets/css/title.css'
import {remote} from 'electron'

export default class Title extends Component {
    onMinimize = () => {
        remote.getCurrentWindow().minimize()
    }
    onClose = () => {
        remote.app.quit()
        window.localStorage.clear();
    }
  render() {
    return (
    <div>
        <div className="title-bar">
            <div className="app-name-container">
                <p>Определение логарифмического декремента</p>
            </div>
            <div className="window-controls-container">
                <button id="minimize-button" className="minimize-button" onClick={this.onMinimize}/>
                <button id="close-button" className="close-button" onClick={this.onClose}/>
            </div>
        </div>
    </div>
    )
  }
}
