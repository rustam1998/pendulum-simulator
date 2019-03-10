import React, { Component } from 'react'

let T = 10
let V = 0;
let angle = Math.PI*20/100;
//Decrement
//const D = (Math.log(11) - Math.log(T)) / 2
const D = 1
const t = T / 500;
    //mass
const m = 5.5
    //сопротивление
const r = (2*m*D) / T
    //коэф. затухания
const b = r/(2*m)

export default class pendMain extends Component {

  componentDidMount(){
   
    webkitRequestAnimationFrame(this.PendulumSim) 
  }

   PendulumSim = () => {
    const canvas = this.refs.canvas
    const context = this.refs.canvas.getContext("2d");
  
    context.fillStyle = "rgba(255,255,255,0.51)";
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
     let acceleration =  -Math.sin(angle) - b * V;
      V += acceleration * t;
      angle += V * t;
      webkitRequestAnimationFrame(this.PendulumSim) 
  }
  
  render() {
    return (
      <div>
        I am a main page
        <canvas id="canvas" width="700" height="420" ref="canvas"></canvas>
        
      </div>
    )
  }
}
