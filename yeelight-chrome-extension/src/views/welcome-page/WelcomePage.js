import React from "react"

import './WelcomePage.css'

function WelcomePage(props) {


  return(
    <div className="welcome-page">
      <div className="welcome-page__message">
        Click to scan the network for compatible devices
      </div>
      <button className="welcome-page__scan-button" onClick={props.handleScan}>Scan</button>
      <div className="welcome-page__tip">
        <span>tip:</span> make sure to turn on device’s <a href="https://www.yeelight.com/faqs/lan_control">LAN control</a> option
      </div>
    </div>
  )
}

export default WelcomePage