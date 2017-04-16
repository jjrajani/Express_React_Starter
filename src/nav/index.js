import React, { Component } from 'react';
import "./style.css";

class Nav extends Component {

  constructor(props) {
    super(props);
    this._navigate = this.props.navigate;
    this.state = {page: this.props.page};
  }


  render() {
    return (
      <div className="nav">
        <ul className="links">
          {this._renderLinks()}
        </ul>
      </div>
    );
  }

  _renderLinks() {
    return this.props.pages.map((page, i) => {
      return page !== "item"
      ? (
        <li
          key={i}
          className={this.props.page === page ? "active link" : "link"}
          onClick={this._navigate}
        >{page}
        </li>
      )
      : null;
    });
  }

}

export default Nav;
