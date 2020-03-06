import React, { useEffect, useState, Suspense } from "react";

import {
  LineChart,
  CartesianGrid,
  YAxis,
  XAxis,
  Tooltip,
  Line,
  Legend,
  Bar,
  BarChart
} from "recharts";

import useResizeObserver from "use-resize-observer";

import Loader from "../Loader/Loader";

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
  if (props.chartType === "bar") {
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
          <Legend />
          <Bar dataKey="pv" fill="#8884d8" />
          <Bar dataKey="uv" fill="#82ca9d" />
        </BarChart>
      </>
    );
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

const CoronaGraph = props => {
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const { ref, width = 1 } = useResizeObserver();

  // Hvis vi thrower et promise som aldrig resolver
  // vil Suspense catche det og vise en fallback (loader)
  if (loading) {
    throw new Promise(() => {});
  }

  // function fetchCoronaData() {
  //   return fetch(
  //     "https://lab.isaaclin.cn/nCoV/api/area?latest=1&province=湖北省"
  //   ).then(res => res.json()).catch(err => console.log(err));
  // }
  async function fetchCoronaData() {
    setLoading(true);
    try {
      const request = await fetch(
        "https://lab.isaaclin.cn/nCoV/api/area?latest=1&province=湖北省"
      );
      const response = await request.json();
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      console.log("fetchCoronaData -> error", error);
    }
  }

  function makeChartData(data) {
    console.log("makeChartData -> data", data);
    const chartData = data.results[0].cities.map(city => {
      return {
        city: city.cityEnglishName,
        dead: city.deadCount,
        cured: city.curedCount,
        infected: city.confirmedCount
      };
    });
    console.log("makeChartData -> chartData", chartData);
    return chartData;
  }

  useEffect(() => {
    if (!chartData) {
      fetchCoronaData().then(data => {
        const newChartData = makeChartData(data);
        setChartData(newChartData);
      });
    }
  }, [chartData]);

  return (
    <div className="fetch-div" ref={ref}>
      <LineChart data={chartData} width={width} height={300}>
        <Line type="monotone" dataKey="dead" stroke="#ff00ff" />
        <Line type="monotone" dataKey="cured" stroke="#8884d8" />
        <Line type="monotone" dataKey="infected" stroke="#ff0000" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="city" />
        <YAxis />
        <Tooltip />
        <Legend />
      </LineChart>
    </div>
  );
};

export default function Graphs(props) {
  return (
    <>
      <Suspense
        fallback={
          <div>
            <h1>Henter virus info..</h1>
            <Loader />
          </div>
        }
      >
        <CoronaGraph />
        <Chart />
        <Chart chartType="bar" />
      </Suspense>
    </>
  );
}
