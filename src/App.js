import React, { Component } from 'react';
import './App.css';
import AddPlace from "./places/add-place";
import PlacesList from "./places/list-places";
import PlaceItem from "./places/list-item";
import Nav from "./nav";
import axios from "axios";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {page: "home", places: [], place: {}};
    this.pages = ["home", "add", "item"];
    this.navigate = this.navigate.bind(this);
    this.navigateToItem = this.navigateToItem.bind(this);
    this._getPlaces();
  }


  render() {
    return (
      <div className="main-content-wrapper">
        <div className="header">
          <h2>{`humdrum's List of Places`}</h2>
        </div>
        <Nav page={this.state.page} pages={this.pages} navigate={this.navigate}/>
        <div className="main-content">
          <div className={this.state.page === "add" ? "" : "hidden"}>
            <AddPlace navigate={this.navigate}/>
          </div>
          <div className={this.state.page === "home" ? "" : "hidden"}>
            <PlacesList navigate={this.navigateToItem} places={this.state.places}/>
          </div>
          <div className={this.state.page === "item" ? "" : "hidden"}>
            <PlaceItem navigate={this.navigate} place={this.state.place}/>
          </div>
        </div>
      </div>
    );
  }

  navigate(e) {
    let page = e.target
    ? e.target.innerHTML
    : e;
    let state = this.state;
    state.page = page;
    this._getPlaces();
    this.setState(state);
  }

  navigateToItem(place) {
    let state = this.state;
    state.page = "item";
    state.place = place;
    this.setState(state);
  }

  _getPlaces () {
    axios.get("http://localhost:9000/api/places").then((res) => {
      let state = this.state;
      state.places = res.data;
      this.setState(state);
    });
  }

}

export default App;
