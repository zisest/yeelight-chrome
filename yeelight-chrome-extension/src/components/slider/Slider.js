import React, { useState } from "react"
import './Slider.css'



const Color = require('color')

function Slider(props) {
  
  const hueToHex = (hue) => {
    return Color.hsv([hue, 100, 100]).hex()
  }
  
  let minValue, maxValue, gradient, value
  switch(props.type){
    case 'hue':
      value = props.currentColor[0]
      minValue = 0
      maxValue = 359
      gradient = {background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'}
      break
    case 'saturation':
      value = props.currentColor[1]
      minValue = 0
      maxValue = 100
      gradient = {background: `linear-gradient(to right, #FFFFFF 0%, ${hueToHex(props.currentColor[0])} 100%)`}
      break
    case 'temperature':
      value = props.currentTemp
      minValue = 1700
      maxValue = 6500
      gradient = {background: 'linear-gradient(to right, #F6D780 7.75%, #FAE6AF 28.81%, #FBF9EC 49.87%, #E8F9FA 70.87%, #D9F5FB 92.01%)'}
      break
    case 'brightness':
      value = props.currentBrightness
      minValue = 1
      maxValue = 100
      break
    
  }



  return(    
    <input type="range" style={gradient} name={props.type} min={minValue} max={maxValue} value={value}
      onChange={props.handleSlider} disabled={props.disabled}
      className={"slider" + (props.inactive ? " slider_inactive" : "") + (" slider_" + props.type)} />
  )
}

Slider.defaultProps = {
    type: 'hue'
}

export default Slider