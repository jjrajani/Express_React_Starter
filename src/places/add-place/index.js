import React, { Component } from 'react';
import './style.css';
import axios from "axios";

class AddPlace extends Component {

  constructor(props) {
    super(props);
    this.state = {
      place: {
        title: "",
        img: "",
        description: "",
        desire: 0,
      }
    };
  }

  render() {
    return (
      <form className="add-place" onSubmit={this._addPlace.bind(this)}>
        <input
          id="title"
          name="title"
          placeholder="title"
          type="text"
          value={this.state.place.title}
          onChange={this._handleChange.bind(this, "title")}
          required={true}
        />
        <input
          id="img"
          name="img"
          placeholder="img"
          type="text"
          value={this.state.place.img}
          onChange={this._handleChange.bind(this, "img")}
          required={true}
        />
        <input
          id="description"
          name="description"
          placeholder="description"
          type="text"
          value={this.state.place.description}
          onChange={this._handleChange.bind(this, "description")}
          required={true}
        />
        <input
          id="desire"
          name="desire"
          placeholder="desire"
          type="number"
          step="1"
          min="0"
          max="10"
          value={this.state.place.desire}
          onChange={this._handleChange.bind(this, "desire")}
          required={true}
        />
        <input type="submit" value="Add Place"/>
      </form>
    );
  }

  _handleChange(key, e) {
    let state = this.state;
    state.place[key] = e.target.value;
    this.setState(state);
  }

  _addPlace(e) {
    e.preventDefault();
    axios.post("http://localhost:9000/api/places", this.state.place).then((res) => {
      this.props.navigate("home");
    });
  }
}

export default AddPlace;
