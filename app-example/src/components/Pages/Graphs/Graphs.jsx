import React, { Suspense } from "react";
import Loader from "../../Loader/Loader";

// Dette er en anden syntax til at importe components.
// Her gøres brug af code-splitting og lazy loading
// så disse components først bliver downloaded af browseren
// når de skal bruges. <Suspense /> sørger for at vise en
// loader imens de bliver downloaded.
const CoronaGraph = React.lazy(() => import("../../Graph/CoronaVirusGraph"));
const LineChart = React.lazy(() => import("../../Graph/LineChartExample"));
const BarChart = React.lazy(() => import("../../Graph/BarChartExample"));

export default function Graphs(props) {
  return (
    <>
      <Suspense
        fallback={
          <div>
            <h1>Loader Moduler..</h1>
            <Loader />
          </div>
        }
      >
        <Suspense
          fallback={
            <div>
              <h1>Henter virus info..</h1>
              <Loader />
            </div>
          }
        >
          <h3>Corona udbrud</h3>
          <CoronaGraph />
        </Suspense>

        <h3>Random graf</h3>
        <LineChart />
        <h3>Random søjlediagram</h3>
        <BarChart />
      </Suspense>
    </>
  );
}
