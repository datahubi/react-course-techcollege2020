import React, { useState, useEffect } from "react";

const FetchPage = props => {
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    const fetchController = new AbortController();
    if (!apiData) {
      const fetchHeaders = new Headers();
      fetchHeaders.append("Accept", "application/json");

      fetch("https://icanhazdadjoke.com/", {
        headers: fetchHeaders,
        signal: fetchController.signal
      })
        .then(res => res.json())
        .then(data => setApiData(data))
        .catch(err => console.log(err));
    }

    return () => fetchController.abort();
  }, [apiData]);

  function getNewJoke() {
    const fetchHeaders = new Headers();
    fetchHeaders.append("Accept", "application/json");
    fetch("https://icanhazdadjoke.com/", {
      headers: fetchHeaders
    })
      .then(res => res.json())
      .then(data => setApiData(data))
      .catch(err => console.log(err));
  }

  return (
    <div>
      <button onClick={getNewJoke}>Ny joke, tak!</button>
      <br />
      {apiData && apiData.joke && <span>{apiData.joke}</span>}
    </div>
  );
};

export default FetchPage;
