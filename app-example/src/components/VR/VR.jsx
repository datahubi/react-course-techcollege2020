import React, { Component } from "react";
// import { Entity, Scene } from "aframe-react";
import "aframe"

// Color palette to use for later
const COLORS = ["#D92B6A", "#9564F2", "#FFCF59"];

// const AFRAME = window.AFRAME;
// AFRAME.registerComponent('lowpoly', {
//   schema: {
//     // Here we define our properties, their types and default values
//     color: { type: 'string', default: '#FFF' },
//     nodes: { type: 'boolean', default: false },
//     opacity: { type: 'number', default: 1.0 },
//     wireframe: { type: 'boolean', default: false }
//   },

//   init: function() {
//     // This block gets executed when the component gets initialized.
//     // Then we can use our properties like so:
//     console.log('The color of our component is ', this.data.color)
//   }
// });

class App extends Component {
  constructor() {
    super();

    // We'll use this state later on in the tutorial
    this.state = {
      colorIndex: 0,
      spherePosition: { x: 0.0, y: 4, z: -10.0 },
      color: "red"
    };
  }

  render() {
    console.log("RENDER!!!")
    return (
      <a-scene>
        <a-entity 
          geometry="primitive: box" 
          position="-1 0.5 -3" 
          rotation="0 45 0" 
          material="color: #4CC3D9" />
        <a-entity 
          geometry="primitive: sphere; radius: 1.25;" 
          position="0 1.25 -5" 
          material="color: #EF2D5E" />
        <a-entity 
          geometry="primitive: cylinder; radius: 0.5, height: 1.5" 
          position="1 0.75 -3" 
          material="color: #FFC65D" />
        <a-entity 
          geometry="primitive: plane; width: 4; height: 4" 
          position="0 0 -4" 
          rotation="-90 0 0" 
          material="color: #7BC8A4" />
      </a-scene>
    );
  }
}

export default App;
