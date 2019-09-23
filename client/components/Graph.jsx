import React from 'react';
import { Bar, Line } from 'react-chartjs-2';

const Graph = (props) => {
  const {graph, graphType, data} = props; //deconstruct the props
  let graphData;
  let options;
  //we don't want to run this stuff when data hasn't loaded yet from first render
  if(props.data) {
    const xAxis = []; //the time and date 
    const yAxis = []; //the sentiment analysis of the messages
    const messages = []; //the messages itself
    const reactions = []; //the sentiment analysis of the reaction emotes
    //this is to help show the messages when you hover over the points on the graph
    options = { 
      maintainAspectRatio: false,
      tooltips: { //tooltips are the black boxes that appear when you hover over a vertex
        callbacks: {
          afterLabel: function(tooltipItem, data) {
            return data.datasets[tooltipItem.datasetIndex].msg[tooltipItem.index]
          }
        }
      }
    }
    //colors:  green: (24, 166, 137, 0.6) red: (255, 99, 132, 0.6) 
    //helper   blue: (3, 0, 129, 0.6) yellow: (255, 211, 1, 0.6)
    for(let i = data.length-1; i >= 0; i--) {
      //configure time settings
      let newTime = new Date(data[i].time * 1000);
      newTime = newTime.toISOString().slice(0,16);
      xAxis.push(newTime);
      yAxis.push(data[i].sentiment);
      messages.push(data[i].message);
      reactions.push(data[i].reactionSentiment);
    }
    graphData = {
      labels: xAxis,
      datasets: [
        {
          label: 'Sentiment Score',
          data: yAxis,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor:'rgba(255, 99, 132, 0.6)',
          msg: messages,  //custom key for messages
          fill: false
        },
        {
          label: 'Reaction Sentiment Score',
          data: reactions,
          backgroundColor: 'rgba(24, 166, 137, 0.6)',
          borderColor: 'rgba(24, 166, 137, 0.6)',
          hidden: true,
          msg: messages, //custom key for messages
          fill: false
        }
      ]
    }
  }
  //conditional rendering for different graphs
  if(graph && graphType === 'Line Graph') {
    return (
      <div className='chart'>
        <Line
          data={graphData}
          options={options}
          height={400}
        />
      </div>
    )
  }
  else if(graph && graphType === 'Bar Graph') {
    return (
      <div className='chart'>
        <Bar
          data={graphData}
          options={options}
          height={400}
        />
      </div>
    )
  }
  else {
    return (
      <div></div>
    );
  }
}
  
export default Graph;