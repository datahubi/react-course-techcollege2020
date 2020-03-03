import React, { useState, Suspense } from "react";

import Loader from "../../Loader/Loader";

// import styles from "./LoaderExample.module.scss";

import {
  BarChart,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend
} from "recharts";

const defaultChartData = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100
  }
];

const Chart = props => {
  const [chartData, setChartData] = useState(defaultChartData);

  const newData = () => {
    const newChartData = [...defaultChartData].sort(() => Math.random() - 0.5);
    setChartData(newChartData);
  };

  // const LineChart = props.chartType =  == "line" ? LineChart : BarChart
  if(props.chartType === "bar") {
    return (
      <>
        <button onClick={newData}>nyt data!</button>
        <BarChart
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
          {/* {props.chartType === "line" && (
            )} */}
          <Legend />
          <Bar dataKey="pv" fill="#8884d8" />
          <Bar dataKey="uv" fill="#82ca9d" />
        </BarChart>
      </>

    )
  }

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

const DataFetcher = props => {
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState(null);

  if(loading) {
    throw new Promise(res => {
      setTimeout(() => {
        setLoading(false);
        res();
      }, 3000)
    });
  }

  async function getNewJoke() {
    const fetchHeaders = new Headers();
    fetchHeaders.append("Accept", "application/json");
    setLoading(true);
    try {
      const request = await fetch("https://icanhazdadjoke.com/", {
        headers: fetchHeaders
      });
      const response = await request.json();
      setApiData(response);
    } catch (error) {
      console.log("getNewJoke -> error", error);
    }
  }

  return (
    <div>
      <button onClick={getNewJoke}>Få en ny joke</button>
      {apiData && apiData.joke && <p>{apiData.joke}</p>}
    </div>
  );
};

export default function LoaderExample(props) {
  return (
    <Suspense fallback={<Loader />}>
      <h1>Leg med data  </h1>
      <DataFetcher />
      <Chart chartType="line" />
      <Chart chartType="bar" />
    </Suspense>
  );
}
