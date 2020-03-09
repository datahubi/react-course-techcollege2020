import React, { useState } from "react";
import "aframe"
function Vr(props) {
  const [color, setColor] = useState("#4CC3D9");
  const [sphereRadius, setSphereRadius] = useState(1.25)

  const toggleColor = () => {
    if(color === "#4CC3D9") {
      setColor("#FFC65D")
    } else {
      setColor("#4CC3D9")
    }
  }

  const handleRangeChange = e => {
  console.log("Vr -> e", e.target.value)
    setSphereRadius(e.target.value / 100)
  }

  return (
    <div>
      <input style={{position:"relative", zIndex: 9999}} type="range" onChange={handleRangeChange} />
      <button style={{position:"relative", zIndex: 9999}} onClick={toggleColor}>skift farve</button> 
      <div>
        <a-scene>
          <a-entity 
            geometry="primitive: box" 
            position="-1 0.5 -3" 
            rotation="0 45 0" 
            material={"color: " + color} />
          <a-entity 
            // geometry="primitive: sphere; radius: 1.25;" 
            geometry={"primitive: sphere; radius: " + sphereRadius + ";"} 
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
      </div>
    </div>
  );
}

export default Vr;
