import React, { useState } from 'react'
import {
  LineChart,
  CartesianGrid,
  YAxis,
  XAxis,
  Tooltip,
  Line,
} from "recharts";

import defaultChartData from './defaultChartData';

const Chart = props => {
  const [chartData, setChartData] = useState(defaultChartData);

  const newData = () => {
    const newChartData = [...defaultChartData].sort(() => Math.random() - 0.5);
    setChartData(newChartData);
  };

  return (
    <>
      <button onClick={newData}>nyt data!</button>
      <LineChart
        width={600}
        height={300}
        data={chartData}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      >
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </>
  );
};

export default Chart;