import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import Title from './Title'
import '../assets/css/App.css'
let V = 0;
let angle = Math.PI*15/100;
let id;

export default class pendMain extends Component {
  state ={
      isRunning: false,
      lapTimes: [],
      timeElapsed: 0,
      environment: 'air',
      b: 0.005,
      showBtns: true,
      T: 10,
      n: 5,
      r: 0,
      D: 0.002,
      mass: 1
    }
  
  //Рисую маятник до начала движения || Drawing pendulum before rotating
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
 
  //Обновить страницу || reload page  
  reloadPage = () => {
    window.location.reload();
  }

  //остановка анимации и таймера || Stopping timer and animation
  toggle = () => {
       // начало отсчета таймера || starting timer
    this.setState({isRunning: !this.state.isRunning}, () => {
        this.state.isRunning ? this.startTimer() : clearInterval(this.timer),
        this.state.isRunning ? webkitRequestAnimationFrame(this.PendulumSim) : cancelAnimationFrame(id)
    }) 
    
    let D = (Math.log(11) - Math.log(this.state.T )) / this.state.n
    this.setState({b: (2* this.state.mass * D) / this.state.T})
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
  onChangeMass = (e) => {
    this.setState({mass: e.target.value })
  }
 
  onChangeTime = (e) => {
    this.setState({T: e.target.value })
  }

  onChangeN = (e) => {
    this.setState({n: e.target.value })
  }

  //отрисовка движущегося маятника || drawing a moving pendulum
  PendulumSim = () => {
    
    const t = this.state.T / 380;
    
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
      context.rect(-20, 14, 46, 5);
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
    const {isRunning, timeElapsed, environment} = this.state;
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
            
              <div className='sidebarBtns'>
                <div className='airSim' >
                  <img src={require('../assets/wind.png')} className='wind' alt=""/>
                  <Link to='/air'  className='airbtn'>Симуляция в воздухе</Link>
                </div>
                <div className='airSim lowOpacity'>
                  <img src={require('../assets/drop.png')} className='drop' alt=""/>
                  <Link  to='/water' className=' airbtn lowOpacity'>Симуляция в воде</Link>
                </div>
                    <div className='sidebarInputs'>
                      <label htmlFor="mass">Изменить массу грузика:</label>
                      <input name='mass' type="number" onChange={this.onChangeMass}  max={50} disabled={this.state.isRunning !== false}/>
                      <label htmlFor="mass">Изменить время:</label>
                      <input name='time' type="number" onChange={this.onChangeTime} min={5.5} max={15} step={ 0.5} disabled={this.state.isRunning !== false}/>
                      <label htmlFor="mass">Изменить кол-во полных колебаний:</label>
                      <input name='n' type="number" onChange={this.onChangeN} disabled={this.state.isRunning !== false}/>
                    </div>
                  </div>
          </div>
          <div className="main">
            <h1>{isRunning ? 'Чтобы остановить симуляцию нажмите на кнопку паузы' : "Симуляция проходит в воздухе. Нажмите на кнопку старта"}</h1>
            <p className='second'>{isRunning ? 'Чтобы выбрать другую среду, нажмите на соответсвующую кнопку в меню' : 'Вы можете изменить параметры симуляции'}</p>
            
            <div className='triangle'></div>
            <canvas id="canvas" width="700" height="420" ref="canvas"></canvas>
            <div className={this.state.class}></div>
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
                <span>{min < 10 ? '0' + min : min}:</span>
                <span>{sec < 10 ? '0' + sec : sec}.</span>
                <span>{msec}</span>
              </div>
            </div>
           
            
              <div className='reloadAndStartDiv'>
               <button onClick={this.reloadPage} className='reload'><img src={require('../assets/reload.png')}/></button>
               {isRunning ? 
                  <button onClick={this.toggle} className='startBtn'>
                    | |
                  </button>
                  :
                  <button onClick={this.toggle} className='startBtn'>
                    <img src={require('../assets/play-button.png')}/>
                  </button>
               }
               
               </div>
          </div>
        </div>
      </div>
    )
  }
}