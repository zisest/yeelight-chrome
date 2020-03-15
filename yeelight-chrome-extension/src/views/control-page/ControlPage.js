  /*global chrome*/
import React, { useState, useEffect } from "react"
import './ControlPage.css'
import { ReactComponent as GoBack } from '../../svg/GoBack.svg'
import Slider from '../../components/slider/Slider'
const Color = require('color')

function ControlPage(props) {
  const [isLightOn, setIsLightOn] = useState(false)
  const [mode, setMode] = useState('color')
  const [color, setColor] = useState([33, 100])
  const [temperature, setTemperature] = useState(1700)
  const [brightness, setBrightness] = useState(80)


  
  const setChromeStorage = (key, value) => {
    chrome.storage.sync.set({[key]: value}, () => 
      console.log(`[CHROME STORAGE]: '${key}' is set to '${value}'`))
  }
  const getFromChromeStorage = (key, stateSetter) => {
    chrome.storage.sync.get([key], function(result) {
      stateSetter(prev => (result[key] || prev))
      console.log(`[CHROME STORAGE]: received '${result[key]}'`)
    })
  }
  
 

  const handleLightSwitch = () => {
    setIsLightOn(prev => {
      props.handleControl(!prev ? 'on' : 'off')
      setChromeStorage('isLightOn', !prev)
      return !prev
    })
    
  }

  const HStoHex = (HS) => {
    return Color.hsv([...HS, 100]).hex()
  }
  const hexToHS = (hex) => {
    return Color(hex).hsv().array().slice(0, 2)
  }

 

  const parseGradient = (gradient) => {    
    let res = gradient.split('#').slice(1).map(el => {
      let color = {r: parseInt(el.slice(0, 2), 16), g: parseInt(el.slice(2, 4), 16), b: parseInt(el.slice(4, 6), 16)}
      let pct = parseFloat(el.slice(7).split('%')[0]) / 100
      return {pct, color}
    })
    return res
  }  
  const getColorFromGradient = (gradient, min, max, value) => {  
    let stopPoints = parseGradient(gradient)
    let pct = (value - min) / (max - min)
    let i = 1
    for (; i < stopPoints.length - 1; i++) {
      if (pct < stopPoints[i].pct) {
        break
      }
    }
    let lower = stopPoints[i - 1]
    let upper = stopPoints[i]
    let range = upper.pct - lower.pct
    let rangePct = (pct - lower.pct) / range
    let pctLower = 1 - rangePct
    let pctUpper = rangePct
    let color = {
      r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
      g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
      b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    }
    return Color(color).hsv().array().slice(0, 2)
  }
  
  
  const setHue = (hue) => {
    setColor(prev => {
      setChromeStorage('color', [hue, prev[1]])
      setChromeStorage('mode', 'color')
      props.handleControl('color', [hue, prev[1]])
      return [hue, prev[1]]
    })
    setMode('color')
  }
  const setSat = (sat) => {
    setColor(prev => {
      setChromeStorage('color', [prev[0], sat])
      setChromeStorage('mode', 'color')
      props.handleControl('color', [prev[0], sat])
      return [prev[0], sat]
    })
    setMode('color')
  }
  const setTemp = (temp) => {
    let gradientColor = getColorFromGradient('linear-gradient(to right, #F6D780 7.75%, #FAE6AF 28.81%, #FBF9EC 49.87%, #E8F9FA 70.87%, #D9F5FB 92.01%)', 
    1700, 6500, temp)
    setTemperature(temp)   
    setColor(gradientColor)
    setMode('white')
    setChromeStorage('color', gradientColor)
    setChromeStorage('mode', 'white')
    setChromeStorage('temperature', temp)
    props.handleControl('temperature', temp)
  }
  const setBright = (br) => {
    setBrightness(br)    
    setChromeStorage('brightness', br)
    props.handleControl('brightness', br)
  }



  const handleSlider = (e) => {
    let type = e.target.name
    let value = parseInt(e.target.value)
    switch(type){
      case 'hue':
        setHue(value)
        break
      case 'saturation':
        setSat(value)
        break
      case 'temperature':
        setTemp(value)
        break
      case 'brightness':
       setBright(value)
        break
    }
  }



  useEffect(() => { //On mount
    console.log('didmount')
    
    getFromChromeStorage('isLightOn', setIsLightOn)
    getFromChromeStorage('mode', setMode)
    getFromChromeStorage('color', setColor)
    getFromChromeStorage('temperature', setTemperature)
    getFromChromeStorage('brightness', setBrightness)

    
   
  }, [])

 

  return(
    <div className="control-page">
      <div className="control-page__header">
        <div className="control-page__go-back" onClick={props.goBack}><GoBack /></div>
        <div className="control-page__device-name">{props.deviceName}</div>
        <div className={"control-page__switch" + (isLightOn ? " control-page__switch_on" : "")} onClick={handleLightSwitch}>
           <div className="control-page__switch-knob"></div>
        </div>
      </div>
      <div className="control-page__current-color" style={isLightOn ? {backgroundColor: HStoHex(color)} : {}}>
        {isLightOn ? ((mode === 'color') ? HStoHex(color) : temperature + 'K') : 'THE LIGHT IS OFF'}
      </div>
      <div className="control-page__controls-block">
        <div className="control-page__sliders-cell">
          <div className="control-page__color-mode">
            Color mode:
            <Slider disabled={!isLightOn} inactive={mode !== 'color'} handleSlider={handleSlider} currentColor={color} type='hue' />
            <Slider disabled={!isLightOn} inactive={mode !== 'color'} handleSlider={handleSlider} currentColor={color} type='saturation' />
          </div>
          <div className="control-page__white-mode">
            White mode:
            <Slider disabled={!isLightOn} inactive={mode !== 'white'} handleSlider={handleSlider} currentTemp={temperature} type='temperature' />
          </div>          
        </div>
        <div className="control-page__brightness-cell">
          <Slider disabled={!isLightOn} handleSlider={handleSlider} currentBrightness={brightness} type='brightness' />
        </div>
      </div>
    </div>
  )
}

export default ControlPage