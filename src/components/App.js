import React, { Component } from 'react'
import '../assets/css/App.css'

let T = 10
let V = 0;
let angle = Math.PI*13/100;
//Decrement
const D = (Math.log(11) - Math.log(T)) / 2
const t = T / 350;
    //mass
// const m = 5.5
//     //сопротивление
// const r = (2*m*D) / T
//     //коэф. затухания
// const b = r/(2*m)
//console.log(b)
let id;

export default class pendMain extends Component {
  state ={
      isRunning: false,
      lapTimes: [],
      timeElapsed: 0,
      environment: '',
      b: 0,
      class: ''
  }
    // componentDidMount(){
  //   webkitRequestAnimationFrame(this.PendulumSim)
  // }
 
  air = () =>{
    this.setState({environment: 'air'})
    this.setState({b: 0.004765508990216238})
    webkitRequestAnimationFrame(this.PendulumSim)
  }
  
  water = () =>{
    this.setState({environment: 'water'})
    this.setState({b: 0.02})
    webkitRequestAnimationFrame(this.PendulumSim)
    this.setState({class: 'waterDiv'})
  }

  toggle = () => {
    this.setState({isRunning: !this.state.isRunning}, () => {
      this.state.isRunning ? this.startTimer() : clearInterval(this.timer)
    });
     
    this.state.isRunning ? cancelAnimationFrame(id) :''
  }

  startTimer = () => {
    this.startTime = Date.now();
    this.timer = setInterval(this.update, 10);
  }
  update = () =>{
    const delta = Date.now() - this.startTime;
    this.setState({timeElapsed: this.state.timeElapsed + delta});
    this.startTime = Date.now();
  }
 
  PendulumSim = () => {
    const canvas = this.refs.canvas
    const context = this.refs.canvas.getContext("2d");
  
    context.fillStyle = "rgba(255,255,255,0.91)";
    context.fillRect(0, 0, canvas.width, canvas.height);
 
    context.fillStyle = "grey";
    context.globalCompositeOperation = "source-over";
 
    context.save();
      context.translate(320, 100)
      context.rotate(angle);
 
      context.beginPath();
      context.rect(0, 0, 4, 275);
      context.fill();
      context.stroke();
 
      context.beginPath();
      context.arc(2, 240, 20, 0, Math.PI*2, false);
      context.fill();
      context.stroke();
    
      context.beginPath();
      context.moveTo(2,310);
      context.lineTo(-0.5,275);
      context.lineTo(4,275);
      context.closePath();
      context.stroke();
    context.restore();
     let acceleration =  -Math.sin(angle) - this.state.b * V;
      V += acceleration * t;
      angle += V * t;
      id = webkitRequestAnimationFrame(this.PendulumSim) 
  }
  
  render() {
    const {isRunning, timeElapsed} = this.state;
         
    const seconds = timeElapsed / 1000;
    let min = Math.floor(seconds / 60).toString()
    let sec =  Math.floor(seconds % 60).toString()
    let msec =  (seconds % 1).toFixed(2).substring(2)
    
    return (
      <div>
        <button onClick={this.air}>В воздухе</button>
        <button onClick={this.water}>В воде</button>
        <canvas id="canvas" width="700" height="420" ref="canvas"></canvas>
        <div className={this.state.class}></div>
        <div className="chevron">
          <p>|</p>
          <p>|</p>
          <p>|</p>
          <p>|</p>
          <p>|</p>
          <p>|</p>
          <p>0</p>
          <p>|</p>
          <p>|</p>
          <p>|</p>
          <p>|</p>
          <p>|</p>
          <p>|</p>
        </div>
        <div className="timer">
            <span>{min}:</span>
            <span>{sec}.</span>
            <span>{msec}</span>
            </div>
            <button onClick={this.toggle} className='startBtn'>
              {isRunning ? 'Stop' : 'Start'}
            </button>
       </div>
    )
  }
}
