import React from "react"

import './Device.css'
import { ReactComponent as ColorBulb } from '../../svg/ColorBulb.svg'
import { ReactComponent as WhiteBulb } from '../../svg/WhiteBulb.svg'
import { ReactComponent as LightStrip } from '../../svg/LightStrip.svg'
import { ReactComponent as CeilingLight } from '../../svg/CeilingLight.svg'
import { ReactComponent as BedsideLamp } from '../../svg/BedsideLamp.svg'

function Device(props) {

  const icons = {
    color: <ColorBulb />,
    bslamp: <BedsideLamp />,
    ceiling: <CeilingLight />,
    lightstrip: <LightStrip />,
    white: <WhiteBulb />
  }

  return(
    <div className="device" name={props.name} id={props.did} onClick={props.selectDevice}>
       <div className="device__icon">{icons[props.model]}</div>
       <div className="device__name">{props.name}</div>
       <div className="device__address">@{props.location.split(':')[0]}</div>
    </div>
  )
}
Device.defaultProps ={
  name: '[unnamed]',
  location: '???',
  model: 'white',
  did: '???'
}

export default Device