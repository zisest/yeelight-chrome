import React from "react"

import './DevicesPage.css'
import Device from '../../components/device/Device'
import { ReactComponent as Refresh } from '../../svg/Refresh.svg'

function DevicesPage(props) {
  console.log(props)

  return(
    <div className="devices-page">
        <div className="devices-page__header">
          <div className="devices-page__title">Compatible devices</div>
          <div className="devices-page__refresh"><Refresh /></div>
        </div>
        <div className="devices-page__devices-block">
          {props.devices.map((d, i) => <Device {...d} selectDevice={props.selectDevice} key={i} />)}          
        </div>
    </div>
  )
}

export default DevicesPage