import React, { Component } from 'react'
import Title from './Title'
import '../assets/css/App.css'

let T = 10
let V = 0;
let angle = Math.PI*10.5/100;
//Decrement
const D = (Math.log(11) - Math.log(6)) / 5
const t = T / 350;
    //mass
 const m = 5.5
//     //сопротивление
 const r = (2*m*D) / 6
//     //коэф. затухания
 const b = r/(2*m)
console.log(b)

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
     
      context.fillStyle = "rgb(44, 45, 45)";
      context.beginPath();
      context.rect(320, 80, 4, 270);
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
    this.setState({b: 0.03})
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

    context.fillStyle = "rgba(255,255,255,0.99)";
    context.fillRect(0, 0, canvas.width, canvas.height);
 
    context.fillStyle = "rgb(44, 45, 45)";
    //Наложение фигур друг на друга|| Overlay figures on each other
    context.globalCompositeOperation = "source-over";
 
    context.save();
      context.translate(320, 75)
      //изменение угла вращения || changing rotatiion angle
      context.rotate(angle);

      //Рисую фигуры || Drawing figures

      context.beginPath();
      context.rect(0, 0, 4, 275);
      context.fill();
      context.stroke();

      context.beginPath();
      context.arc(2, 240, 23, 0, Math.PI*2, false);
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
        <Title/>
        <div className='flex'>
          <div className="sidebar">
            <div className="bg-img"></div>
            {
              this.state.showBtns ?
              <div className='sidebarBtns'>
                <div className='airSim'>
                  <img src={require('../assets/wind.png')} className='wind' alt=""/>
                  <p onClick={this.air} className='airbtn'>Симуляция в воздухе</p>
                </div>
                <div className="airSim">
                  <img src={require('../assets/drop.png')} className='drop' alt=""/>
                  <p onClick={this.water} className='airbtn'>Симуляция в воде</p>
                </div>
              </div> 
              : 
              <div className="airSim">
                <img src={require('../assets/reload.png')} className='reloadIcon' alt=""/>
                <p onClick={this.reloadPage} className='airbtn reloadbtn'>Обнулить</p>
              </div>
            }
          </div>
          <div className="main">
            <h1>{isRunning ? 'Чтобы остановить симуляцию нажмите на "Обнулить"' : "Добро пожаловать в симулятор затухающего маятника"}</h1>
            <p className='second'>{isRunning ? '' : 'Пожалуйста, выберите нужную среду для симуляции в навигации'}</p>
            <canvas id="canvas" width="700" height="420" ref="canvas"></canvas>
            <div className={this.state.class}></div>
            <img src={require('../assets/cm.png')} className='cm' alt=""/>
            <div className="timer">
              <div className='timerSpan'>
                <span>{min < 10 ? '0' + min : min}:</span>
                <span>{sec < 10 ? '0' + sec : sec}.</span>
                <span>{msec}</span>
              </div>
            </div>
            {this.state.isRunning ?
              <button onClick={this.toggle} className='startBtn'>
                | |
              </button>
            : '' 
            }
          </div>
        </div>
      </div>
    )
  }
}
