import React from 'react';
import { Bar, Line } from 'react-chartjs-2';

const Graph = (props) => {
  const {graph, graphType, data, chartData} = props;
  if(graph && graphType === 'Line Graph') {
    console.log('line')
    return (
      <div className='chart'>
        <Line
          data={chartData}
          options={{ maintainAspectRatio: false }}
        />
      </div>
    )
  }
  else if(graph && graphType === 'Bar Graph') {
    console.log('bar')
    return (
      <div className='chart'>
        <Bar
          data={chartData}
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