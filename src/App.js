import React, { useState } from "react";
import "./App.css";


function Welcome() {
  return (
    <h1>
      Hej store verden!!
    </h1>
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
    <section>
      <button onClick={countUp}>Tæl op</button>
      <button onClick={countDown}>Tæl ned</button> 
      <p>{count}</p>
    </section>
  )
}


function Container(props) {
  return (
    <article>
      {props.children}
    </article>
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
