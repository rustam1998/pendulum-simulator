import React, { Component } from 'react'
import {Link} from 'react-router-dom'

import Title from './Title'
import '../assets/css/App.css'


export default class pendMain extends Component {
  
  componentDidMount(){
      const context = this.refs.canvas.getContext("2d");
     
      context.fillStyle = "rgb(44, 45, 45)";
      context.beginPath();
      context.rect(320, 74, 4, 277);
      context.fill();
      context.stroke();

      context.beginPath();
      context.rect(300, 90, 46, 5);
      context.fill();
      context.stroke();

      context.beginPath();
      context.arc(322, 300, 22, 0, Math.PI*2, false);
      context.fill();
      context.stroke();
      
      context.beginPath();
      context.moveTo(322,385);
      context.lineTo(319.5,350);
      context.lineTo(324.3,350);
      context.closePath();
      context.stroke();
    
  }
  
  render() {
  
    return (
      
        <div>
          <Title/>
          <div className='flex'>
            <div className="sidebar">
              <div className="bg-img"></div>
              
                <div className='sidebarBtns'>
                  <div className='airSim' >
                    <img src={require('../assets/wind.png')} className='wind' alt=""/>
                    <Link to='/air' className='airbtn'>Симуляция в воздухе</Link>
                  </div>
                  <div className='airSim'>
                    <img src={require('../assets/drop.png')} className='drop' alt=""/>
                    <Link to='/water' className='airbtn'>Симуляция в воде</Link>
                  </div>
                    </div>
            </div>
            <div className="main">
              <h1> Добро пожаловать в симулятор затухающего маятника</h1>
              <p className='second'> Пожалуйста, выберите нужную среду для симуляции в навигации</p>
              
              <div className='triangle'></div>
              <canvas id="canvas" width="700" height="420" ref="canvas"></canvas>
              <img src={require('../assets/cm.png')} className='cm' alt=""/>
              <div className='numbersDiv'>
                <p className='p1'>6</p>
                <p className='p2'>5</p>
                <p className='p3'>4</p>
                <p className='p4'>3</p>
                <p className='p5'>2</p>
                <p className='p6'>1</p>
                <p className='p7'>0</p>
                <p className='p6'>1</p>
                <p className='p5'>2</p>
                <p className='p4'>3</p>
                <p className='p3'>4</p>
                <p className='p12'>5</p>
                <p className='p13'>6</p>
              </div>
              <div className="timer">
                <div className='timerSpan'>
                  <span>00:</span>
                  <span>00.</span>
                  <span>00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
  }
}