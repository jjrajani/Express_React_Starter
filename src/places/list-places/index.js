import React, { Component } from 'react';
import "./style.css";

class PlacesList extends Component {

  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <div className="places list-wrapper">
        <ul className="places list">
          {this._listUsers()}
        </ul>
      </div>
    );
  }

  _listUsers () {
    return this.props.places.map((place, i) => {
      return (
        <li
          key={i}
          className="place list-item"
          onClick={this._navigate.bind(this, place)}
        >
          <p className="description">{place.description}</p>
          <img src={place.img} alt=""/>
          <div className="item-header">
            <p className={place.desire > 7 ? "title high" : place.desire > 5 ? "title mid" : "title"}
              >{place.title}
            </p>
            <p className={place.desire > 7 ? "high desire" : place.desire > 5 ? "mid desire" : "desire"}
              >Desire: {place.desire}
            </p>
          </div>
        </li>
      )
    })
  }

  _navigate(place, e) {
    this.props.navigate(place);
  }


}

export default PlacesList;
