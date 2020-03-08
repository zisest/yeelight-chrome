  /*global chrome*/

import React from 'react';
import logo from './logo.svg';
import './App.css';

const Lookup = require("node-yeelight-wifi").Lookup;
const Yeelight = require("node-yeelight-wifi").Yeelight;



class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      color: [],
      brightness: 0
    }
  }

  componentDidMount(){
    if (chrome !== undefined) chrome.runtime.onMessageExternal.addListener((msg) => this.setState({brightness: msg}))
  }
  toggleLight = () =>{
    if (chrome !== undefined) chrome.runtime.sendMessage('acmcocggapnjfcapnecefampdljfhjgc', 
      {type: 'ext-request', message: JSON.stringify({"id":1,"method":"toggle","params":[]})})
  }

  render(){
    return (
      <div className="app">
      {this.state.brightness.toString()}
        <button onClick={this.toggleLight}>Toggle</button>
      </div>
    )
  }  
}

export default App;
