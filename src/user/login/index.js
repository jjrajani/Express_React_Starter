import React, { Component } from 'react';
import './style.css';
import axios from "axios";

class UserLogin extends Component {

  constructor(props) {
    super(props);
    this.state = {username: "", password: ""};
    this._getUsers();
  }

  render() {
    return (
      <form className="login" onSubmit={this._onSubmit.bind(this)}>
        <input
          id="username"
          name="username"
          placeholder="Username"
          type="text"
          value={this.state.username}
          onChange={this._handleChange.bind(this, "username")}
        />
        <input
          id="password"
          name="password"
          placeholder="Password"
          type="password"
          value={this.state.password}
          onChange={this._handleChange.bind(this, "password")}
        />
        <input type="submit" value="Login"/>
      </form>
    );
  }

  _getUsers () {
    axios.get("http://localhost:9000/api/users").then((res) => {
      console.log("res", res);
    });
  }

  _handleChange(key, e) {
    let state = this.state;
    state[key] = e.target.value;
    this.setState(state);
  }

  _onSubmit(e) {
    e.preventDefault();
    console.log(this.state.user);
    axios.post("http://localhost:9000/api/user", this.state.user).then((res) => {
      console.log("res", res);
    });
  }
}

export default UserLogin;
