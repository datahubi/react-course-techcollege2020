import React, { useEffect, useState } from "react";

import {
  LineChart,
  CartesianGrid,
  YAxis,
  XAxis,
  Tooltip,
  Line,
  Legend
} from "recharts";
import useResizeObserver from "use-resize-observer";
import moment from "moment";

const suspender = new Promise(res => res())

const CoronaGraph = props => {
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [dataUpdatedAt, setDataUpdatedAt] = useState(0);
  const { ref, width = 1 } = useResizeObserver();

  // Hvis vi thrower et promise vil Suspense
  // catche det og vise en fallback (loader)
  if (loading) {
    throw suspender;
  }

  // function fetchCoronaData() {
  //   return fetch(
  //     "https://lab.isaaclin.cn/nCoV/api/area?latest=1&province=湖北省"
  //   ).then(res => res.json()).catch(err => console.log(err));
  // }

  // async function fetchCoronaData() {
  //   setLoading(true);
  //   try {
  //     const request = await fetch(
  //       "https://lab.isaaclin.cn/nCoV/api/area?latest=1&province=湖北省"
  //     );
  //     const response = await request.json();
  //     setLoading(false);
  //     return response;
  //   } catch (error) {
  //     setLoading(false);
  //     console.log("fetchCoronaData -> error", error);
  //   }
  // }

  // function makeChartData(data) {
  //   console.log("makeChartData -> data", data);
  //   const chartData = data.results[0].cities.map(city => {
  //     return {
  //       City: city.cityEnglishName,
  //       Dead: city.deadCount,
  //       Cured: city.curedCount,
  //       Infected: city.confirmedCount
  //     };
  //   });
  //   console.log("makeChartData -> chartData", chartData);
  //   return chartData;
  // }


  async function fetchCoronaData() {
    setLoading(true);
    try {
      const request = await fetch("https://lab.isaaclin.cn/nCoV/api/area");
      const response = await request.json();
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      console.log("fetchCoronaData -> error", error);
    }
  }

  function makeChartData(data) {
    const dataArray = data.results;
    const dataObject = dataArray.reduce((history, country) => {
      const countryInHistory =
        history[country.countryEnglishName || country.countryName];

      // Tjekker om vi har dette land allerede
      if (countryInHistory) {
        // Ligger nye data sammen med gamle data
        countryInHistory.Dead += country.deadCount;
        countryInHistory.Cured += country.curedCount;
        countryInHistory.Infected += country.confirmedCount;
        // } else if (country.countryEnglishName !== "China") {
      } else {
        // Hvis vi ikke har landet så skriver vi det til history
        history[country.countryEnglishName || country.countryName] = {
          City: country.countryEnglishName || country.countryName,
          Dead: country.deadCount,
          Cured: country.curedCount,
          Infected: country.confirmedCount
        };
      }
      return history;
    }, {});

    const sortedDataArray = Object.values(dataObject);
    const alphabeticallySortedDataArray = sortedDataArray.sort((a, b) => {
      return String(a.City).localeCompare(String(b.City));
    });

    return alphabeticallySortedDataArray;
  }

  useEffect(() => {
    if (!chartData) {
      fetchCoronaData().then(data => {
        const newChartData = makeChartData(data);
        const updateTime = data.results[0].updateTime;
        const humanReadableTime = moment(updateTime).format("DD/MM-YYYY hh:mm");
        setDataUpdatedAt(humanReadableTime);
        setChartData(newChartData);
      });
    }
  }, [chartData]);

  return (
    <div className="fetch-div" ref={ref}>
      <span>Data er opdateret: {dataUpdatedAt} dansk tid</span>
      <LineChart data={chartData} width={width} height={300}>
        <Line type="monotone" dataKey="Dead" stroke="#ff00ff" />
        <Line type="monotone" dataKey="Cured" stroke="#8884d8" />
        <Line type="monotone" dataKey="Infected" stroke="#ff0000" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="City" />
        <YAxis />
        <Tooltip />
        <Legend />
      </LineChart>
    </div>
  );
};

export default CoronaGraph;
