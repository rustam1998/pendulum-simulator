import React, { Component } from 'react'
import '../assets/css/title.css'
import {remote} from 'electron'

export default class Title extends Component {
    onMinimize = () => {
        remote.getCurrentWindow().minimize()
    }
    onMinMax = () => {
        const currentWindow = remote.getCurrentWindow()
        if(currentWindow.isMaximized()) {
            currentWindow.unmaximize()
        } else {
            currentWindow.maximize()
        }
    }
    onClose = () => {
        remote.app.quit()
    }
  render() {
    return (
    <div>
        <div className="title-bar">
            <div className="app-name-container">
                <p>Pendulum Simulator</p>
            </div>
            <div className="window-controls-container">
                <button id="minimize-button" className="minimize-button" onClick={this.onMinimize}/>
                <button id="min-max-button" className="min-max-button" onClick={this.onMinMax}/>
                <button id="close-button" className="close-button" onClick={this.onClose}/>
            </div>
        </div>
    </div>
    )
  }
}
