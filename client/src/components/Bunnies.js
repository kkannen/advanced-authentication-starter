import React, { Component } from "react";

class Bunnies extends Component {
  constructor() {
    super();

    this.state = {
      message: ""
    };
  }

  componentDidMount() {
    fetch("/api/bunnies").then((res) => {
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
        <h1>Bunnies</h1>
        <p>{this.state.message}</p>
      </div>
    );
  }
}

export default Bunnies;