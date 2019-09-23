import React from 'react';
import { Bar, Line } from 'react-chartjs-2';

const Graph = (props) => {
  const {graph, graphType, data} = props;
  let graphData;
  let options;
  if(props.data) {
    const xAxis = [];
    const yAxis = [];
    const messages = [];
    const reactions = [];
    options = { 
      maintainAspectRatio: false,
      tooltips: {
        callbacks: {
          afterLabel: function(tooltipItem, data) {
            return data.datasets[tooltipItem.datasetIndex].msg[tooltipItem.index]
          }
        }
      }
    }
    //colors:  green: (24, 166, 137, 0.6) red: (255, 99, 132, 0.6) 
    //         blue: (3, 0, 129, 0.6) yellow: (255, 211, 1, 0.6)
    for(let i = data.length-1; i >= 0; i--) {
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
          msg: messages,
          fill: false
        },
        {
          label: 'Reaction Sentiment Score',
          data: reactions,
          backgroundColor: 'rgba(24, 166, 137, 0.6)',
          borderColor: 'rgba(24, 166, 137, 0.6)',
          hidden: true,
          msg: messages,
          fill: false
        }
      ]
    }
  }
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