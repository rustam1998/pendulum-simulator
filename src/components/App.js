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
      class: '',
      showBtns: true
  }
  
  //Рисую маятник до начала движения || Drawing pendulum before rotating
  componentDidMount(){
    if(this.state.environment !== 'air' || 'water'){
      const context = this.refs.canvas.getContext("2d");
      
      context.fillStyle = "grey";
      context.beginPath();
      context.rect(320, 100, 4, 275);
      context.fill();
      context.stroke();
 
      context.beginPath();
      context.arc(322, 340, 20, 0, Math.PI*2, false);
      context.fill();
      context.stroke();
    
      context.beginPath();
      context.moveTo(322,410);
      context.lineTo(319.5,375);
      context.lineTo(324.3,375);
      context.closePath();
      context.stroke();
    }
  }
 
  //Обновить страницу || reload page  
  reloadPage = () => {
    window.location.reload();
  }

  //обработчик кнопки "в воздухе" || 'on air' button's handler
  air = () =>{

    this.setState({environment: 'air'})
    // Изменяю сопротивление среды || changing resistance of the environment
    this.setState({b: 0.004765508990216238})
    // начало отсчета таймера || starting timer
    this.setState({isRunning: !this.state.isRunning})
    this.setState({isRunning: !this.state.isRunning}, () => {
      this.state.isRunning ? this.startTimer() : ''
    });
    this.setState({showBtns: false})
    //Начало анимации|| Animation's starting
    webkitRequestAnimationFrame(this.PendulumSim)
  }

  //обработчик кнопки "в воде" || 'in water' button's handler
  water = () =>{
    this.setState({environment: 'water'})
    // Изменяю сопротивление среды || changing resistance of the environment
    this.setState({b: 0.02})
    //добавляю воду || adding water
    this.setState({class: 'waterDiv'})
    // начало отсчета таймера || starting timer
    this.setState({isRunning: !this.state.isRunning}, () => {
      this.state.isRunning ? this.startTimer() : ''
    });
    this.setState({showBtns: false})
    //Начало анимации|| Animation's starting
    webkitRequestAnimationFrame(this.PendulumSim)
  }

  //остановка анимации и таймера || Stopping timer and animation
  toggle = () => {
    clearInterval(this.timer)
    this.state.isRunning ? cancelAnimationFrame(id) : ''
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
 
  //отрисовка движущегося маятника || drawing a moving pendulum
  PendulumSim = () => {
    const canvas = this.refs.canvas
    const context = canvas.getContext("2d");
    //удаление предыдущего кадра|| removing previos frame
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "rgba(255,255,255,0.91)";
    context.fillRect(0, 0, canvas.width, canvas.height);
 
    context.fillStyle = "grey";
    //Наложение фигур друг на друга|| Overlay figures on each other
    context.globalCompositeOperation = "source-over";
 
    context.save();
      context.translate(320, 100)
      //изменение угла вращения || changing rotatiion angle
      context.rotate(angle);

      //Рисую фигуры || Drawing figures
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
      //Рассчет ускорения маятника || calculate acceleration of the pendulum
     let acceleration =  -Math.sin(angle) - this.state.b * V;
      //Рассчет скорости вращения || calculate velocity of the pendulum
      V += acceleration * t;
      //Рассчет угла вращения || calculate rotation angle of the pendulum
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
        {
          this.state.showBtns ?
          <div>
          <button onClick={this.air}>В воздухе</button>
            <button onClick={this.water}>В воде</button>
          </div> 
          : 
          <button onClick={this.reloadPage}>Обнулить</button>
        }
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
              Stop
            </button>
       </div>
    )
  }
}
