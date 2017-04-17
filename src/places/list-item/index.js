import React, { Component } from 'react';
import "./style.css";
import axios from "axios";

class PlaceItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      place: this.props.place,
      show: {
        static: true,
        edit: false,
        delete: false,
        addLink: false,
      },
      addLink: {
        title: "",
        link: "",
      },
      editPlace: {},
      // editLinks: [],
      // links: [],
    };
    this._edit = this._edit.bind(this);
    this._askDelete = this._askDelete.bind(this);
    this._confirmDelete = this._confirmDelete.bind(this);
    // this._getLinks(this.props.place.id);
    // this._addLink = this._addLink.bind(this);
    // this._submitLink = this._submitLink.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let state = this.state;
    state.place = nextProps.place;
    // this._getLinks(nextProps.place.id);
    this.setState(state);
  }

  render() {
    console.log("configrm delete?", this.props.place);
    return (
      <div className="place wrapper">
        {this._staticPage()}
      </div>
    );
  }
  _staticPage () {
    let place = this.state.place;
    return (
      <div className="place item-wrapper">
        <div className="nav">
          <p onClick={this._edit}>Edit</p>
          <p className="description">{place.description}</p>
          <p onClick={this._askDelete}>Delete</p>
        </div>
        <img src={place.img} alt=""/>
        <div className="item-header">
          <p className={place.desire > 7 ? "title high" : place.desire > 5 ? "title mid" : "title"}
          >{place.title}
          </p>
          <p className={place.desire > 7 ? "high desire" : place.desire > 5 ? "mid desire" : "desire"}
          >Desire: {place.desire}
          </p>
        </div>
        {this.state.show.edit ? this._editPage() : null}
        {this.state.show.delete ? this._deletePage() : null}
      </div>
    )
  }

// LINKS comonent
  // <div className="links-wrapper">
  //   <ul className="links-list">
  //     {this._renderLinks()}
  //   </ul>
  //   <div className="link-form-wrapper">
  //     <p onClick={this._addLink}>Add Link</p>
  //     {this.state.show.addLink ? this._addLinkForm() : null}
  //   </div>
  // </div>

  _editPage() {
    let place = this.state.editPlace;
    return (
      <form className="edit-form" onSubmit={this._saveEdit.bind(this)}>
        <div className="input-row">
          <label>Title:</label>
          <input
            id="title"
            name="title"
            placeholder="title"
            type="text"
            value={place.title}
            onChange={this._handleEditChange.bind(this, "title")}
            required={true}
          />
        </div>
        <div className="input-row">
          <label>Img:</label>
          <input
            id="img"
            name="img"
            placeholder="img"
            type="text"
            value={place.img}
            onChange={this._handleEditChange.bind(this, "img")}
            required={true}
          />
        </div>
        <div className="input-row">
          <label>Description:</label>
        <input
          id="description"
          name="description"
          placeholder="description"
          type="text"
          value={place.description}
          onChange={this._handleEditChange.bind(this, "description")}
          required={true}
        />
        </div>
        <div className="input-row">
          <label>Desire:</label>
        <input
          id="desire"
          name="desire"
          placeholder="desire"
          type="number"
          step="1"
          min="0"
          max="10"
          value={place.desire}
          onChange={this._handleEditChange.bind(this, "desire")}
          required={true}
        />
        </div>
        <input type="submit" value="Save Changes"/>
      </form>
    )
  }
  _handleEditChange(key, e) {
    let value = e.target.value;
    let state = this.state;
    state.editPlace[key] = value;
    this.setState(state);
  }
  _edit() {
    let state = this.state;
    state.show.edit = !state.show.edit;
    state.show.delete = false;
    state.editPlace = Object.assign({}, this.props.place);
    this.setState(state);
  }

  _saveEdit(e) {
    e.preventDefault();
    axios.post(`http://localhost:9000/api/place/${this.state.editPlace.id}`, this.state.editPlace).then((res) => {
      let state = this.state;
      state.place = res.data;
      state.editPlace = res.data;
      this.state.show.edit = false;
      this.setState(state);
    })
  }

  _deletePage() {
    return (
      <div className="delete-page">
        <p>Are you sure you would like to delete this place?</p>
        <div className="buttons">
          <p className="confirm" onClick={this._confirmDelete}>Yes</p>
          <p className="deny" onClick={this._askDelete}>No</p>
        </div>
      </div>
    )
  }
  _askDelete() {
    let state = this.state;
    state.show.delete = !state.show.delete;
    state.show.edit = false;
    state.editPlace = this.props.place;
    this.setState(state);
  }
  _confirmDelete() {
    console.log("configrm delete?", this.props.place);
    axios.delete(`http://localhost:9000/api/place/${this.props.place.id}`).then((res) => {
      this.props.navigate("home");
    });
  }

  // _getLinks(id) {
  //   axios.get(`http://localhost:9000/api/place/${id}/links`).then((res) => {
  //     let state = this.state;
  //     state.links = res.data;
  //     state.editLinks = res.data.map((data) => {
  //       data.showEdit = false;
  //       return data;
  //     });
  //     this.setState(state);
  //   });
  // }
  // _renderLinks() {
  //   return this.state.links.map((link, i) => {
  //     return (
  //       <div key={i} className="link">
  //         <div className="top">
  //           <a target="blank" href={link.link}>{link.title}</a>
  //           <p className="edit-link" onClick={this._toggleEditLinkForm.bind(this, i)}>E</p>
  //           <p
  //             className="delete-link"
  //             onClick={this._toggleEditLinkForm.bind(this, i)}
  //           >D
  //           </p>
  //         </div>
  //         {this._editLinkForm(link, i)}
  //       </div>
  //     )
  //   })
  // }
  // _toggleEditLinkForm(i) {
  //   let state = this.state;
  //   state.editLinks[i].showEdit = !state.editLinks[i].showEdit;
  //   this.setState(state);
  // }
  // _editLinkForm(link, i) {
  //   return (
  //     <div className={this.state.editLinks[i].showEdit ? "addLink form" : "hidden"}>
  //       <div className="input-row">
  //         <label>Title:</label>
  //         <input
  //           type="text"
  //           id="title"
  //           name="title"
  //           placeholder="Title:"
  //           value={link.title}
  //           onChange={this._editAddLink.bind(this, "title", i)}
  //         />
  //       </div>
  //       <div className="input-row">
  //         <label>Link:</label>
  //         <input
  //           type="text"
  //           id="link"
  //           name="link"
  //           placeholder="Link:"
  //           value={link.link}
  //           onChange={this._editAddLink.bind(this, "link", i)}
  //         />
  //       </div>
  //     </div>
  //   )
  // }
  // _addLink() {
  //   let state = this.state;
  //   state.show.addLink = !state.show.addLink;
  //   this.setState(state);
  // }
  // _addLinkForm() {
  //   return (
  //     <form className="addLink-form-wrapper">
  //       <input
  //         id="title"
  //         name="title"
  //         placeholder="Title"
  //         value={this.state.addLink.title}
  //         onChange={this._handleLinkChange.bind(this, "title")}
  //         required={true}
  //       />
  //       <input
  //         id="link"
  //         name="link"
  //         placeholder="Link"
  //         value={this.state.addLink.link}
  //         onChange={this._handleLinkChange.bind(this, "link")}
  //         required={true}
  //       />
  //       <p className="submit" onClick={this._submitLink.bind(this)}>Add Link</p>
  //     </form>
  //   )
  // }
  // _handleLinkChange(key, e) {
  //   let state = this.state;
  //   state.addLink[key] = e.target.value;
  //   this.setState(state);
  // }
  // _submitLink(e) {
  //   e.preventDefault();
  //   axios.post(`http://localhost:9000/api/place/${this.props.place.id}/links`, this.state.addLink).then((res) => {
  //     let state = this.state;
  //     state.links = res.data;
  //     this.setState(state);
  //   });
  // }
  // _editAddLink(key, i, e) {
  //   let state = this.state;
  //   state.editLinks[i][key] = e.target.value;
  //   this.setState(state);
  // }
}

export default PlaceItem;
