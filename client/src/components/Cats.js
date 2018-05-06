import React, { Component } from "react";

class Cats extends Component {
  constructor() {
    super();

    this.state = {
      message: ""
    };
  }

  componentDidMount() {
    fetch("/api/cats").then((res) => {
      return res.text();
    }).then((data) => {
      this.setState({
        message: data
      });
    });
  }

  render() {
    return (
      <div>
        <h1>Cats</h1>
        <p>{this.state.message}</p>
      </div>
    );
  }
}

export default Cats;