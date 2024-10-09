import React, { Component } from "react";
import _ from "lodash";

export default class SearchForm extends Component {
  
  inputRef = React.createRef(); 

  state = {
    title: "",
  };

  debounceAddTitle = _.debounce((title) => {
    this.props.addTitle(title);
  }, 800);


  onTitleChange = (e) => {
    this.setState({ title: e.target.value }, () => {
        this.debounceAddTitle(this.state.title);
    });
  };

  resetTitle = () => {
    this.setState({ title: "" }, () => {
      if (this.inputRef.current) {
        this.inputRef.current.focus(); // Set focus to input
      }
    });
  };

  render() {

    return (
      <form className="search-form" onSubmit={(e) => {
        e.preventDefault(); 
        this.resetTitle(); 
      }}>
        <input
          ref={this.inputRef} 
          className="search-form__input"
          placeholder="Type to search..."
          onChange={this.onTitleChange}
          value={this.state.title}
          required
          autoFocus
        />
      </form>
    );
  }
}
