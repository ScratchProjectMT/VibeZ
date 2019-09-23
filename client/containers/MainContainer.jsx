import React, { Component } from 'react';
import Graph from '../components/Graph.jsx';

class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channel: null, // Current channel selected => see updateChannel function
      allChannels: null, // Toggle betwen slack channels => see updateChannel function
      start: null, // Calender date => Defaults to 2 weeks prior of Date.now() => see ComponentDidMount function
      end: null, // Calender date => Defaults to Date.now() => see ComponentDidMount
      data: null, // Graph data received from fetch request => Used in 'Graph.jsx' => see ComponentDidMount function
      graphType: "Line Graph", // Toggles between 'Line' or 'Bar' => Used in 'Graph.jsx' => see updateGraphType function
      graph: false, // Boolean toggle after slack workspace auth => see diplayGraph function
      limit: 100, // Sets message qty. fetch request => see updateLimit function
      workspace: "Connect to a Slack Workspace" // Current value = defualt => see ComponentDidMount function 
    };
  }

  //updates state.start
  updateStart(event) {
    this.setState({start: event.target.value});
  }

  //updates state.end
  updateEnd(event) {
    this.setState({end: event.target.value});    
  }

  //updates state.channel
  updateChannel(event) {
    for(let i = 0; i < this.state.allChannels.length; i++) {
      if(this.state.allChannels[i].name === event.target.value) {
        this.setState({channel: this.state.allChannels[i].id})
      }
    }
  }
  
  //displays graph on click of Enter button
  displayGraph() {
    const {channel, start, end, limit} = this.state;
    let oldDate = new Date(start).getTime()/1000; //milliseconds from 1970
    let lateDate = new Date(end).getTime()/1000; //milliseconds from 1970
    const fetchURL = `/slack/?channel=${channel}&oldest=${oldDate}&latest=${lateDate}&limit=${limit}`
    fetch(fetchURL, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => {
        this.setState({data: data, graph: true});
      })
      .catch(err => console.log('MainContainer displayGraph ERROR: ', err));
  }

  //updates state.graphType
  updateGraphType(event) {
    this.setState({graphType: event.target.value});
  }

  //updates state.limit
  updateLimit(event) {
    this.setState({limit: event.target.value});
  }

  componentDidMount() {
    // 1 month => 2.629746 * Math.pow(10, 9) milliseconds
    // 2 weeks => 1.2096 * Math.pow(10, 9) milliseconds
    // https://www.calculateme.com/time/hours/to-milliseconds/24
    let present = new Date(Date.now() - 25200000); //units = milli
    let defaultTime = new Date(present - (1.2096 * Math.pow(10, 9))); //units = milli
    
    //formats time in format: 2011-10-05T14:48:00.000Z
    let isoPresent = present.toISOString();
    let isoDefault = defaultTime.toISOString();

    //we just want the first 16 : no seconds or milliseconds
    let pTime = isoPresent.slice(0, 16); 
    let dTime = isoDefault.slice(0, 16);

    this.setState({ end: pTime })
    this.setState({ start: dTime })
    //updates state.channel, state.allChannels, state.workspace on fetch
    fetch('/slack/channels')
      .then(res => res.json())
      .then(data => {
        this.setState({
          channel: data.channels[0].id,
          allChannels: data.channels,
          workspace: `Connected to: ${data.workspace}`
        });
      })
      .catch(err => console.log('MainContainer.componentDidMount ERROR: ', err));
  }

  render() {
    let channels = [];
    if(this.state.allChannels) {
      this.state.allChannels.forEach(channel => {
        channels.push(<option value={channel.name}>{channel.name}</option>)
      })
    }
    return (
      <div className='main'>
        <nav>
          <h1>VibeZ</h1>
          <h2>{this.state.workspace}</h2>
        </nav>
        <a href="https://slack.com/oauth/authorize?client_id=653541339828.770547895078&scope=channels:history,channels:read"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>
        <div className='channelID'>
          <span>Channel: </span>
          <select onChange={e => { this.updateChannel(e) }}>
            {channels}
          </select>
        </div>
        <div className='options'>
          <span>Graph Type: </span>
          <select id='graphType' onChange={e => { this.updateGraphType(e) }}>
            <option value='Line Graph'>Line Graph</option>
            <option value='Bar Graph'>Bar Graph</option>
          </select>
        </div>
        <div className='options' >
          <span>Start Time: </span>
          <input type='datetime-local' defaultValue={this.state.start} onChange={e => { this.updateStart(e) }} />
        </div >
        <div className='options'>
          <span>End Time: </span>
          <input type='datetime-local' defaultValue={this.state.end} onChange={e => { this.updateEnd(e) }} />
        </div>
        <div className='options'>
          <span>Limit: </span>
          <input type='number' defaultValue={100} onChange={e => { this.updateLimit(e) }} />
        </div>
        <div>
          <button id="ent" onClick={() => { this.displayGraph() }}>Enter</button>
        </div>
        <Graph graph={this.state.graph} graphType={this.state.graphType} data={this.state.data} chartData={this.state.chartData} />
      </div>
    );
  }
}


export default MainContainer;
