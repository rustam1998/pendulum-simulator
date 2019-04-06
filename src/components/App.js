import React, { Component } from 'react'
import Select from 'react-select'


import Title from './Title'
import '../assets/css/App.css'

const customStyles = {
  control: (base, state) => ({
    ...base,
    background: "rgba(255, 255, 255, 0.89)",
    // match with the menu
    borderRadius: state.isFocused ? "3px" : 3,
    // Overwrittes the different states of border
    borderColor: 'transparent',
    // Removes weird border around container
    boxShadow: state.isFocused ? null : null,
    minHeight: '25px', 
    height: '25px',
    fontSize: '16px',
    marginBottom: '20px',
    marginTop: '10px',
    marginLeft: '16px',
    color: '#000'
  }),
  menu: base => ({
    ...base,
    // override border radius to match the box
    borderRadius: 0,
    background: "rgba(0, 0, 0, 0.95)",
    color: 'white',
    // kill the gap
    marginTop: 0
  }),
  menuList: (base, state) => ({
    ...base,
    // kill the white space on first and last option
    padding: 0
  })
};

const optionsGas = [
  { value: 'air', label: 'Воздух' },
  { value: 'CO2', label: 'Углекислый газ' },
  { value: 'water', label: 'Вода' },
  { value: 'kerosin', label: 'Керосин' },

];
const optionsRo = [
  { value: 'aluminium', label: 'Алюминий' },
  { value: 'steel', label: 'Сталь' },
  { value: 'cuprum', label: 'Медь' },
  { value: 'plumbum', label: 'Cвинец' },

];

let t = 0
let fi = Math.PI/2
let id;
let x = 0.5;

const fromLocalStorage = (string) => {
  return parseFloat(window.localStorage.getItem(string))
}

class pendMain extends Component {
  state ={
      isRunning: false,
      value: 0,
      environment: {
        value: window.localStorage.getItem('environmentValue') === '' ? '' :  window.localStorage.getItem('environmentValue'), 
        label: window.localStorage.getItem('environmentLabel') === '' ? '' :  window.localStorage.getItem('environmentLabel')
      },
      roStChange: {
        value: window.localStorage.getItem('roStValue') === '' ? '' :  window.localStorage.getItem('roStValue'), 
        label: window.localStorage.getItem('roStLabel') === '' ? '' :  window.localStorage.getItem('roStLabel')
      },
      roSphChange: {
        value: window.localStorage.getItem('roSphValue') === '' ? '' :  window.localStorage.getItem('roSphValue'), 
        label: window.localStorage.getItem('roSphLabel') === '' ? '' :  window.localStorage.getItem('roSphLabel')
      },
      lapTimes: [],
      timeElapsed: 0,
      lst: isNaN(fromLocalStorage('lst')) ? 0.5 : fromLocalStorage('lst') ,
      showBtns: true,
      l1: isNaN(fromLocalStorage('l1')) ? 0.01 : fromLocalStorage('l1'),
      roSt: isNaN(fromLocalStorage('roSt')) ? 0 : fromLocalStorage('roSt'),
      roSph: isNaN(fromLocalStorage('roSph')) ? 0 : fromLocalStorage('roSph'),
      diametr: isNaN(fromLocalStorage('diametr')) ? 0.01 : fromLocalStorage('diametr'),
      R: isNaN(fromLocalStorage('R')) ? 0.01 : fromLocalStorage('R'),
      nu: isNaN(fromLocalStorage('nu')) ? 0 : fromLocalStorage('nu'),
      S: isNaN(fromLocalStorage('S')) ? 0.005 : fromLocalStorage('S'),
      roEnv: isNaN(fromLocalStorage('roEnv')) ? 0 : fromLocalStorage('roEnv'),
      beta: 0,
      w: 0,
      class: '',
      disableInputs: false
    }
  
  //Рисую маятник до начала движения || Drawing pendulum before rotating
   componentDidMount(){
    if (this.state.environment.value === 'water') {
      this.setState({class: 'waterDiv' })
    }
    else if(this.state.environment.value === 'kerosin') {
      this.setState({class: 'kerosinDiv' })
    }
    else{
      this.setState({class: '' })
    }
     this.drawCanvas()
   }
   componentDidUpdate(previos){
     if (previos.roSphChange !== this.state.roSphChange) {
      this.drawCanvas()
     }
   }
  //Обновить страницу || reload page  
  reloadPage = () => {
    window.location.reload();
    window.localStorage.setItem('lst', this.state.lst.toString());
    window.localStorage.setItem('l1', this.state.l1.toString());
    window.localStorage.setItem('roSt', this.state.roSt.toString());
    window.localStorage.setItem('roSph', this.state.roSph.toString());
    window.localStorage.setItem('diametr', this.state.diametr.toString());
    window.localStorage.setItem('R', this.state.R.toString());
    window.localStorage.setItem('nu', this.state.nu.toString());
    window.localStorage.setItem('S', this.state.S.toString());
    window.localStorage.setItem('roEnv', this.state.roEnv.toString());
    window.localStorage.setItem('environmentValue', this.state.environment.value);
    window.localStorage.setItem('environmentLabel', this.state.environment.label);
    window.localStorage.setItem('roStValue', this.state.roStChange.value);
    window.localStorage.setItem('roStLabel', this.state.roStChange.label);
    window.localStorage.setItem('roSphValue', this.state.roSphChange.value);
    window.localStorage.setItem('roSphLabel', this.state.roSphChange.label);
  }
  
  //начало и остановка анимации и таймера || Stopping timer and animation
  toggle = () => {
       // начало отсчета таймера || starting timer
    this.setState({disableInputs: true})
    this.setState({isRunning: !this.state.isRunning}, () => {
        this.state.isRunning ? this.startTimer() : clearInterval(this.timer),
        this.state.isRunning ? requestAnimationFrame(this.PendulumSim) : cancelAnimationFrame(id)
    }) 
    let lst = parseFloat(this.state.lst)
    let diametr = parseFloat(this.state.diametr)
    let R = parseFloat(this.state.R)
    let l1 = parseFloat(this.state.l1)

    let x1 = (lst/2) 
    let s1 = (lst * diametr)
    let x1s1 = (x1 *  s1)
    
    let x2 = (lst/4 + l1)
    let s2 =(Math.PI*Math.pow(R,2))
    let x2s2 = ( x2 * s2)
    
    let massCenter = ( x1s1 + x2s2 ) / ((Math.PI*Math.pow(R,2))+(lst * diametr))
    let l2 = massCenter - (lst/4) 
    
    let massSph = (4/3) * Math.PI * Math.pow(R, 3) * this.state.roSph
    let massSt = Math.PI * Math.pow((diametr / 2),2) * lst * this.state.roSt 
    let m = massSph + massSt
    let Ist = (7/48) * massSt * Math.pow(lst , 2)
    let Isph = massSph * Math.pow(l1 , 2)
    let I = Ist + Isph
    let T = (2 * Math.PI) * Math.sqrt(I/(m * 9.8*l2)) 

    let D = Math.sqrt((this.state.nu * Math.pow(10, -6))*Math.PI*this.state.roEnv*T) * (this.state.S/m) +0.002
   
    this.setState({beta: D/T })
    this.setState({w: (2*Math.PI) / T - 2.9})
  } 

  drawCanvas = () => {
    const canvas = this.refs.canvas
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(255,255,255,0.99)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.beginPath();
    context.fillStyle = "rgb(39, 39, 39)";
    context.rect(282, 110, 80, 12);
    context.fill();
    
    if (this.state.roStChange.value === 'aluminium') {
      context.fillStyle = "rgb(184, 184, 184)";
    } 
    else if(this.state.roStChange.value === 'steel') {
     context.fillStyle = "rgb(112,112,112)";
    }
    else if(this.state.roStChange.value === 'cuprum') {
      context.fillStyle = "#8d5322";
     }
     else if(this.state.roStChange.value === 'plumbum') {
      context.fillStyle = "#2e2e2e";
     }
     else{
      context.fillStyle = "#000000";
     }
    
    context.globalCompositeOperation = "source-over";
    context.save();
  
      context.translate(320, 110)
      context.rotate(x);

      context.beginPath();
      context.rect(0, -35, 4, 43);
      context.fill();
      context.stroke();

      context.beginPath();
      context.rect(0, 0, 4, 380);
      context.fill();
      context.stroke();

      context.beginPath();
      context.fillStyle = "grey";
      context.moveTo(2,15);
      context.lineTo(-16,-5);
      context.lineTo(18,-5);
      context.closePath();
      context.fill();

      context.beginPath();
      if (this.state.roSphChange.value === 'aluminium') {
        context.fillStyle = "rgb(184, 184, 184)";
      } 
      else if(this.state.roSphChange.value === 'steel') {
       context.fillStyle = "rgb(112,112,112)";
      }
      else if(this.state.roSphChange.value === 'cuprum') {
        context.fillStyle = "#8d5322";
       }
       else if(this.state.roSphChange.value === 'plumbum') {
        context.fillStyle = "#2e2e2e";
       }
       else{
        context.fillStyle = "#000000";
       }
      context.arc(2, 250, 30, 0, Math.PI*2, false);
      context.fill();
      context.stroke();
    
      context.beginPath();
      context.moveTo(2,450);
      context.lineTo(-0.5,380);
      context.lineTo(4,380);
      context.closePath();
      context.stroke();
    context.restore();
  
    t += 0.01
    x = 0.5 * Math.pow(Math.E, (-this.state.beta * t)) * Math.sin(this.state.w* t + fi)
  }
  
  //отрисовка движущегося маятника || drawing a moving pendulum
  PendulumSim = () => {
      this.drawCanvas()
      id = requestAnimationFrame(this.PendulumSim)
  }
  
  lstChange = (e) => {
    this.setState({lst: e.target.value})
  }

  diametrChange = (e) => {
    this.setState({diametr: e.target.value })
  }
  onRoStChange = (roStChange) => {
    this.setState({roStChange})

    if (roStChange.value === 'aluminium') {
      this.setState({roSt: 2700 })
    }
    if (roStChange.value === 'steel') {
      this.setState({roSt: 7900 })
    }
    if (roStChange.value === 'cuprum') {
      this.setState({roSt: 8960 })
    }
    if (roStChange.value === 'plumbum') {
      this.setState({roSt: 11340 })
    }
  }
  radiusChange = (e) => {
    this.setState({R: e.target.value })
  }
  l1Change = (e) => {
    this.setState({l1: e.target.value })
  }
  onRoSphChange = (roSphChange) => {
    this.setState({roSphChange})
    if (roSphChange.value === 'aluminium') {
      this.setState({roSph: 2700 })
    }
    if (roSphChange.value === 'steel') {
      this.setState({roSph: 7900 })
    }
    if (roSphChange.value === 'cuprum') {
      this.setState({roSph: 8960 })
    }
    if (roSphChange.value === 'plumbum') {
      this.setState({roSph: 11340 })
    }
  }
  nuChange = (e) => {
    this.setState({nu: e.target.value })
  }
  Schange = (e) => {
    this.setState({S: e.target.value })
  }
  roEnvChange = (e) => {
    this.setState({roEnv: e.target.value })
  }

  envGasChange = (environment) => {
    this.setState({environment});
    if (environment.value === 'air') {
        this.setState({nu: 1.87  })
        this.setState({roEnv: 1.2 })
        this.setState({class: '' })
    }
    if (environment.value === 'CO2') {
      this.setState({nu: 0.85 })
      this.setState({roEnv: 1.9768 })
      this.setState({class: '' })
    }
    if (environment.value === 'water') {
      this.setState({nu: 1000 })
      this.setState({roEnv: 997.3 })
      this.setState({class: 'waterDiv' })
    }
    if (environment.value === 'kerosin') {
      this.setState({nu: 1490 })
      this.setState({roEnv: 820 })
      this.setState({class: 'kerosinDiv' })
    }
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


  render() {
    const {isRunning,timeElapsed, environment} = this.state;
    const seconds = timeElapsed / 1000;
    let min = Math.floor(seconds / 60).toString()
    let sec =  Math.floor(seconds % 60).toString()
    let msec = (seconds % 1).toFixed(2).substring(2)
   
    return (
      <div>
        <Title/>
        <div className='flex'>
          <div className="sidebar">
            <div className="bg-img"></div>
              <div className='sidebarBtns'>
                    <div className='sidebarInputs'>
                    
                      <label className='labels'><strong>Стержень:</strong> </label>
                      <label htmlFor="mass">Длина стержня, lст(м):</label>
                      <label>{this.state.lst}</label>
                      <input 
                        type="range" 
                        onChange={this.lstChange}
                        min="0.5" 
                        max="2"
                        step='0.15'
                        value={this.state.lst}
                        disabled={this.state.disableInputs !== false}
                      />
                      <label htmlFor="mass">Диаметр стержня, d(м):</label>
                      <label>{this.state.diametr}</label>
                      <input 
                        id="typeinp" 
                        type="range" 
                        min="0.01" 
                        max="0.06"
                        onChange={this.diametrChange}
                        step='0.005'
                        value={this.state.diametr}
                        disabled={this.state.disableInputs !== false}
                      />
                      <label htmlFor="mass">Материал стержня:</label>
                      <Select
                      isDisabled={this.state.disableInputs !== false}
                      styles={customStyles}
                      value={this.state.roStChange} 
                      onChange={this.onRoStChange}
                      options={optionsRo}
                      className="select"
                      placeholder=''
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                        ...theme.colors,
                          primary25: '#00779F',
                          primary: 'black',
                        },
                      })}
                      />
                      
                      <label className='labels'><strong> Груз:</strong></label>
                      <label htmlFor="mass">Радиус груза, R(м):</label>
                      <label>{this.state.R}</label>
                      <input 
                        id="typeinp" 
                        type="range" 
                        min={this.state.diametr} 
                        max="0.15"
                        onChange={this.radiusChange}
                        step='0.005'
                        value={this.state.R}
                        disabled={this.state.disableInputs !== false}
                      />
                      <label htmlFor="mass">Расстояние от точки подвеса, l1(м):</label>
                      <label>{this.state.l1}</label>
                      <input 
                        id="typeinp" 
                        type="range" 
                        min={this.state.R} 
                        max={((3/4)*this.state.lst) - this.state.R}
                        onChange={this.l1Change}
                        step='0.005'
                        value={this.state.l1}
                        disabled={this.state.disableInputs !== false}
                      />
                      <label htmlFor="mass">Mатериал груза:</label>
                      <Select
                      isDisabled={this.state.disableInputs !== false}
                      styles={customStyles}
                      value={this.state.roSphChange} 
                      onChange={this.onRoSphChange}
                      options={optionsRo}
                      className="select"
                      placeholder=''
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                        ...theme.colors,
                          primary25: '#00779F',
                          primary: 'black',
                        },
                      })}
                      />
                      
                      <label className='labels'><strong> Среда:</strong></label>
                      <Select
                      isDisabled={this.state.disableInputs !== false}
                      styles={customStyles}
                      value={ environment} 
                      onChange={this.envGasChange}
                      options={optionsGas}
                      className="select"
                      placeholder=''
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                        ...theme.colors,
                          primary25: '#00779F',
                          primary: 'black',
                        },
                      })}
                      />
                      <label htmlFor="mass">Изменить площадь лопатки, S(м^2):</label>
                      <label>{this.state.S}</label>
                      <input 
                        id="typeinp" 
                        type="range" 
                        min='0.005'
                        max='0.05'
                        onChange={this.Schange}
                        step='0.005'
                        value={this.state.S}
                        disabled={this.state.disableInputs !== false}
                      />
                     
                    </div>
                  </div>
          </div>
          <div className="main">
            <div className='triangle'></div>
            <canvas id="canvas" width="700" height="550" ref="canvas"></canvas>
            <div className={this.state.class}></div>
            <div className='borders'></div>
            <img src={require('../assets/cm.png')} className='cm' alt=""/>
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
export default pendMain