  /*global chrome*/
import React, { useState, useEffect } from 'react'
import './App.css'

import WelcomePage from './views/welcome-page/WelcomePage'
import DevicesPage from './views/devices-page/DevicesPage'
import ControlPage from './views/control-page/ControlPage'


const debounce = require('lodash.debounce')
const Color = require('color')

const companionAppID = 'faihiebhnlbimhchcbopcpbkgagheblm'

function App() {  
  const [appStatus, setAppStatus] = useState('WelcomePage')
  const [devices, setDevices] = useState([])
  const [selectedDevice, setSelectedDevice] = useState({did: '', name: ''})
  const [reqID, setReqID] = useState(0)

  
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
  
  const syncSetAppStatus = (status) => {
    setChromeStorage('appStatus', status)
    setAppStatus(status)
  }
  const syncSetDevices = (device, override = false) => {
    setDevices(prev => {
      let devices = override ? device : [...prev, device]
      setChromeStorage('devices', devices)
      return devices
    })
  }
  const syncSetSelectedDevice = (did, name) => {
    setSelectedDevice({did, name})
    setChromeStorage('selectedDevice', {did, name})
  }
  

  const sendToApp = (message) => {
    chrome.runtime.sendMessage(companionAppID, message)
  }
  const sendRequest = (method, params = []) => {
    sendToApp({type: 'ext-request', message: JSON.stringify({"id":reqID,"method":method,"params":params})})
    setReqID(prev => prev + 1)
  }
  

  useEffect(() => { //On mount
    console.log('didmount')
    
    getFromChromeStorage('appStatus', setAppStatus)
    getFromChromeStorage('devices', setDevices)
    getFromChromeStorage('selectedDevice', setSelectedDevice)

    chrome.runtime.onMessageExternal.addListener((msg) => {
      switch(msg.type){
        case 'info':
          console.log((msg.message.toString()))
          break
        case 'add-device':
          syncSetDevices(msg)
          break
        default:
          console.log(msg)
      }      
    })
    
   
  }, [])

  const handleScan = () => {
    syncSetDevices([], true)
    sendToApp({type: 'yee-start', message: 'Start the companion app'})    
    syncSetAppStatus('DevicesPage')
  }
  const selectDevice = (e) => {
    if (e.currentTarget.id !== selectDevice.did){
      sendToApp({type: 'yee-connect', message: e.currentTarget.id})      
      syncSetSelectedDevice(e.currentTarget.id, e.currentTarget.name)
    }
    syncSetAppStatus('ControlPage')    
  }

 

  const handleControl = (type, params = []) => {
    switch(type){
      case 'on':
        sendRequest('set_power', ['on', 'smooth', 500])
        break
      case 'off':
        sendRequest('set_power', ['off', 'smooth', 500])
        break
      case 'color':
        sendRequest('set_hsv', [...params, 'smooth', 500])
        break
      case 'temperature':
        sendRequest('set_ct_abx', [params, 'smooth', 500])
        break
      case 'brightness':
        sendRequest('set_bright', [params, 'smooth', 500])
        break
    }
  }
  
  const debouncedControl = debounce(handleControl, 700)

  
  
  const backToDevices = () => {
    syncSetAppStatus('DevicesPage')
  }

  const pages = {
    'WelcomePage': <WelcomePage handleScan={handleScan} />,
    'DevicesPage': <DevicesPage devices={devices} selectDevice={selectDevice}  />,
    'ControlPage': <ControlPage deviceName={selectedDevice.name} handleControl={debouncedControl} goBack={backToDevices} />
  }

  return (
    <div className="app">
      {pages[appStatus]}
    </div>
  )

}
  


export default App;
