import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import SignUpSignIn from "./SignUpSignIn";
import TopNavbar from "./TopNavbar";
import Secret from "./Secret";
import Cats from "./components/Cats";
import Dogs from "./components/Dogs";
import Bunnies from "./components/Bunnies";

class App extends Component {
  constructor() {
    super();
    this.state = {
      signUpSignInError: "",
      authenticated: localStorage.getItem("token") || false
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  handleSignUp(credentials) {
    const { username, password, confirmPassword } = credentials;
    if (!username.trim() || !password.trim() ) {
      this.setState({
        signUpSignInError: "Must Provide All Fields"
      });
    } else if (confirmPassword !== password) {
      this.setState({
        signUpSignInError: "The Passwords Do Not Match"
      }); 
      } else {
        
      fetch("/users", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(credentials)
      }).then((res) => {
        return res.json();
      }).then((data) => {
        const { token } = data;
        localStorage.setItem("token", token);
        this.setState({
          signUpSignInError: "",
          authenticated: token
        });
      });
    }
  }




  handleSignIn(credentials) {
    const { username, password } = credentials;
    if (!username.trim() || !password.trim()) {
      this.setState({
        signUpSignInError: "Must Provide All Fields"
      });
    } else {
      fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      }).then((res) => {
        if (res.status === 401) {
          return this.setState({
            signUpSignInError: "Invalid login"
          });
        }
        return res.json();
      })
      .then((data) => {
        const { token } = data;
        localStorage.setItem("token", token);
        this.setState({
          signUpSignInError: "",
          authenticated: token
        });
      });
    }
  }

  handleSignOut() {
    localStorage.removeItem("token");
    this.setState({
      authenticated: false
    });
  }

  renderSignUpSignIn() {
    return (
      <SignUpSignIn 
        error={this.state.signUpSignInError} 
        onSignUp={this.handleSignUp} 
        onSignIn={this.handleSignIn}
      />
    );
  }

  renderApp() {
    return (
      <div>
        <Switch>
          <Route exact path="/" render={() => <h1>I am protected!</h1>} />
          <Route exact path="/secret" component={Secret} />
          <Route exact path="/dogs" component={Dogs} />
          <Route exact path="/cats" component={Cats} />
          <Route exact path="/bunnies" component={Bunnies} />
          <Route render={() => <h1>NOT FOUND!</h1>} />
        </Switch>
      </div>
    );
  }

  render() {
    let whatToShow = "";
    if (this.state.authenticated) {
      whatToShow = this.renderApp();
    } else {
      whatToShow = this.renderSignUpSignIn();
    }
       
    return (
      <BrowserRouter>
        <div className="App">
          <TopNavbar 
            showNavItems={this.state.authenticated} 
            onSignOut={this.handleSignOut} />
          {whatToShow}
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

