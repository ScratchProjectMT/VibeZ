import React, { Component } from 'react';
import Graph from '../components/Graph.jsx';

class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channel: "CKA6RDALE",
      start: null,
      end: null,
      data: null,
      graph: false,
    };
  }

  updateStart(event) {
    this.setState({start: event.target.value});
  }

  updateEnd(event) {
    this.setState({end: event.target.value});    
  }

  updateChannel(event) {
    const general = "CKA6RDALE";
    const helpDesk = "CM5TZRY82";
    const random = "CK80VH5LM";
  }

  displayGraph(){
    
  }

  render() {
    console.log('start: ', this.state.start);
    console.log('end: ', this.state.end);
    return (
      <div>
        <div className="channelID">
          <input type="text" onChange={(e) => {this.updateChannel(e)}}/>
        </div>
        <div className='buttons'>
          <button>Line Graph</button>
          <button>Bar Graph</button>
        </div>
        <div className='startend'>
          <span>Start Time: </span>
          <input type='datetime-local' onChange={(e) => {this.updateStart(e)}}/>
          <span>End Time: </span>
          <input type='datetime-local'onChange={(e) => {this.updateEnd(e)}}/>
        </div>
        <button onClick={() => {this.displayGraph()}}>Enter</button>
        <Graph/>  
      </div>
    );
  }
}


export default MainContainer;
