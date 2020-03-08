  /*global chrome*/

import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css'

const Color = require('color')

function App() {  
  const [appStatus, setAppStatus] = useState(false)
  const [status, setStatus] = useState('')
  const [reqID, setReqID] = useState(0)
  const [devices, setDevices] = useState([])

  useEffect(() => {
    console.log('didmount')
    getFromChromeStorage('appStatus', setAppStatus)
    getFromChromeStorage('yee-status', setStatus)

    chrome.runtime.onMessageExternal.addListener((msg) => {
      switch(msg.type){
        case 'info':
          setStatus(msg.message.toString())        
          setChromeStorage('yee-status', msg.message.toString())
          break
        case 'add-device':
          setDevices(prev => [...prev, msg])
          break
        default:
          console.log(msg)
      }      
    })
  }, [])


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

  const sendToApp = (message) => {
    chrome.runtime.sendMessage('edeljkklbneelndkdlobokhegapaaeie', message)
  }
  const sendRequest = (method, params = []) => {
    sendToApp({type: 'ext-request', message: JSON.stringify({"id":reqID,"method":method,"params":params})})
    setReqID(prev => prev + 1)
  }


  const toggleLight = () =>{
    sendRequest('toggle')
  }
  const setColor = (color) => {    
    let [h, s] = Color(color).hsv().array()
    console.log(h, s)
    sendRequest('set_hsv', [h, s, 'smooth', 500])
  }
  const handleColorPicker = (e) => {
    setColor(e.target.value)
  }

  const startApp = () => {
    sendToApp({type: 'yee-start', message: 'Start the companion app'})     
    setAppStatus(true)        
    setChromeStorage('appStatus', true)
  }
  const stopApp = () => {
    sendToApp({type: 'yee-stop', message: 'Stop the companion app'})    
    setAppStatus(false)         
    setChromeStorage('appStatus', false)
  }

  const handleDeviceChoice = (e) => {
    sendToApp({type: 'yee-connect', message: e.target.id})
  }

  return (
    <div className="app">
      {status}
      <button onClick={startApp}>Start App</button>
      <button onClick={stopApp}>Stop App</button>

      <button onClick={toggleLight}>Toggle</button>
      <ul onClick={handleDeviceChoice}>{devices.map((device, index) => <li id={device.did} key={index}>{device.did}</li>)}</ul>
      <input onChange={handleColorPicker} type="color"></input>
    </div>
  )

}
 

 

  

  
    
   


export default App;
