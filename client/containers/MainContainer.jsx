import React, { Component } from 'react';
import Graph from '../components/Graph.jsx';

class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channel: 'CKA6RDALE',
      start: null,
      end: null,
      data: null,
      graphType: 'Line Graph',
      graph: false,
      limit: 100,
      chartData: {
        labels: ['Boston', 'Worcester', 'Springfield', 'Lowell', 'Cambridge', 'New Bedford'],
        datasets: [
          {
            label: 'Population',
            data: [
              617594,
              181045,
              153060,
              106519,
              105162,
              95072
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(255, 99, 132, 0.6)'
            ]
          }
        ]
      }
    };
  }

  updateStart(event) {
    this.setState({start: event.target.value});
  }

  updateEnd(event) {
    this.setState({end: event.target.value});    
  }

  updateChannel(event) {
    if(event.target.value === 'general') {
      this.setState({channel: 'CKA6RDALE'});
    }
    else if(event.target.value === 'helpDesk') {
      this.setState({channel: 'CM5TZRY82'});
    }
    else if(event.target.value === 'random') {
      this.setState({channel: 'CK80VH5LM'});
    }
  }

  displayGraph(){
    const newReq = {
      channel: this.state.channel,
      oldest: this.state.start,
      latest: this.state.end,
      limit: this.state.limit
    }
    fetch('/slack/', {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newReq)
    })
      .then(res => res.json())
      .then(data => {
        this.setState({data: data});
      })
      .catch(err => console.log('MainContainer displayGraph ERROR: ', err));
    this.setState({graph: true});
  }

  updateGraphType(event) {
    this.setState({graphType: event.target.value});
  }

  updateLimit(event) {
    this.setState({limit: event.target.value});
  }

  render() {
    console.log(this.state)
    return (
      <div>
        <div className='channelID'>
          <span>Channel: </span>
          <select onChange={e => {this.updateChannel(e)}}>
            <option value='general'>General</option>
            <option value='helpDesk'>Help Desk</option>
            <option value='random'>Random</option>
          </select>
        </div>
        <div className='graphType'>
          <span>Graph Type: </span>
          <select onChange={e => {this.updateGraphType(e)}}>
            <option value='Line Graph'>Line Graph</option>
            <option value='Bar Graph'>Bar Graph</option>
          </select>
        </div>
        <div className='options'>
          <span>Start Time: </span>
          <input type='datetime-local' onChange={e => {this.updateStart(e)}}/>
          <span>End Time: </span>
          <input type='datetime-local' onChange={e => {this.updateEnd(e)}}/>
          <span>Limit: </span>
          <input type='number' defaultValue={100} onChange={e => {this.updateLimit(e)}}/>
        </div>
        <button onClick={() => {this.displayGraph()}}>Enter</button>
        <Graph graph={this.state.graph} graphType={this.state.graphType} data={this.state.data} chartData={this.state.chartData}/>
      </div>
    );
  }
}


export default MainContainer;
