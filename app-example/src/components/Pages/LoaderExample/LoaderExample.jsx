import React, { useState, Suspense } from "react";

import Loader from "../../Loader/Loader";

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
    </Suspense>
  );
}
