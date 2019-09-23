import React from 'react';
import { Bar, Line } from 'react-chartjs-2';

const Graph = (props) => {
  const {graph, graphType, data} = props;
  let graphData;
  let options;
  if(props.data) {
    const xAxis = [];
    const yAxis = [];
    const backgroundColor = [];
    const messages = [];
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
    for(let i = data.length-1; i >= 0; i--) {
      let newTime = new Date(data[i].time * 1000);
      newTime = newTime.toISOString().slice(0,16);
      xAxis.push(newTime);
      yAxis.push(data[i].sentiment);
      messages.push(data[i].message);
      if(data[i].sentiment < 0 && graphType === 'Bar Graph') backgroundColor.push('rgba(255, 99, 132, 0.6)');
      else backgroundColor.push('rgba(24, 166, 137, 0.6)');
    }
    graphData = {
      labels: xAxis,
      datasets: [
        {
          label: 'Sentiment Score',
          data: yAxis,
          backgroundColor: backgroundColor,
          msg: messages
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