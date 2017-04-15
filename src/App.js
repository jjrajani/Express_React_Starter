import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import UserLogin from "./user/login";

class App extends Component {

  constructor(props) {
    super(props);
    console.log("App");
  }


  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <UserLogin />
      </div>
    );
  }
}

export default App;
