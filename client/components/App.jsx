import React, { Component } from "react";
import MainContainer from '../containers/MainContainer.jsx'


class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="container">
          <MainContainer />
        </div>
      </div>
    );
  }
}

export default App;