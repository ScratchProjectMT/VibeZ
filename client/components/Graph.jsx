import React from 'react';
import { Bar, Line } from 'react-chartjs-2';

const Graph = (props) => {
  const {graph, graphType, data} = props;
  let graphData;
  if(props.data) {
    const xAxis = [];
    const yAxis = [];
    const backgroundColor = [];
    for(let i = data.length-1; i >= 0; i--) {
      let newTime = new Date(data[i].time * 1000);
      newTime = newTime.toISOString().slice(0,16);
      xAxis.push(newTime);
      yAxis.push(data[i].sentiment);
      backgroundColor.push('rgba(255, 99, 132, 0.6)');
    }
    graphData = {
      labels: xAxis,
      datasets: [
        {
          label: 'Sentiment Score',
          data: yAxis,
          backgroundColor: backgroundColor
        }
      ]
    }
  }
  if(graph && graphType === 'Line Graph') {
    return (
      <div className='chart'>
        <Line
          data={graphData}
          options={{ maintainAspectRatio: false }}
        />
      </div>
    )
  }
  else if(graph && graphType === 'Bar Graph') {
    return (
      <div className='chart'>
        <Bar
          data={graphData}
          options={{ maintainAspectRatio: false }}
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