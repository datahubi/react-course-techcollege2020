import React, { useState } from "react";
import "./App.css";


function Welcome() {
  return (
    <p>
      Hej store verden!!
    </p>
  )
}

function Counter() {
  const [count, setCount] = useState(0);

  const countUp = () => {
    setCount(count + 1)
  }

  const countDown = () => {
    setCount(count - 1)
  }

  return (
    <div>
      <button onClick={countUp}>Tæl op</button>
      <button onClick={countDown}>Tæl ned</button> 
      <p>{count}</p>
    </div>
  )
}


function Container(props) {
  return (
    <div>
      {props.children}
    </div>
  )
}

function App() {
  return (
    <Container>
      <Welcome />
      <Counter />
    </Container>
  );
}

export default App;
