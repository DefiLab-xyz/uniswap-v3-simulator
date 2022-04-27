import { genRandBetween } from "../helpers/numbers";
import {useState, useEffect, useRef} from 'react'
import NoiseGenerator from 'png5'
import { Line } from "./charts/Line";


const useFrameTime = () => {

  const [frameTime, setFrameTime] = useState(performance.now());
  
  
  useEffect(() => {
    let frameId;
    const frame = (time) => {
      setFrameTime(time);
      frameId = requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, []);
  return frameTime;
};

const Genart = (props) => {

  const perlin = new NoiseGenerator()
  const frameTime = useFrameTime();

  const angle = useRef(-Math.PI / 2);
  const radius = useRef(1);
  const radiusNoise = useRef(genRandBetween(0, 5, 0));
  const angleNoise = useRef(genRandBetween(0, 5, 0));
  const xNoise = useRef(genRandBetween(0, 10, 0));
  const yNoise = useRef(genRandBetween(0, 10, 0)); 
  const centX = useRef();
  const centY = useRef();
  const rad = useRef();
  const oppRad = useRef();
  const x1 = useRef();
  const x2 = useRef();
  const y1 = useRef();
  const y2 = useRef();
  const strokeChange = useRef(-1);
  const strokeCol = useRef(254);
  const [lines, setLines] = useState([]);

  useEffect(() => {

    if (lines.length < 200) {
      const tempLines = [...lines];

      radiusNoise.current += 0.005;
      angleNoise.current += 0.005;
      radius.current = (perlin.getPerlinNoise(radiusNoise.current) * 550) + 1;
  
      angle.current += (perlin.getPerlinNoise(angleNoise.current) * 6) - 3;

      if (angle.current > 360) {
        angle.current -= 360;
      }
      if (angle.current < 0) {
        angle.current += 360;
      }
  
      xNoise.current += 0.01;
      yNoise.current += 0.01;

      centX.current = props.width / 2 + (perlin.getPerlinNoise(xNoise.current) * 150) - 75;
      centY.current = props.height / 2 + (perlin.getPerlinNoise(yNoise.current) * 150) - 75;
     
      rad.current = (angle.current * Math.PI) / 180.0;
      x1.current = centX.current + (radius.current * Math.cos(rad.current));
      y1.current = centY.current + (radius.current * Math.sin(rad.current));
  
      oppRad.current = rad.current + Math.PI;
      x2.current = centX.current + (radius.current * Math.cos(oppRad.current));
      y2.current = centY.current + (radius.current * Math.sin(oppRad.current));

      strokeCol.current += strokeChange.current;
      if (strokeCol.current > 255) {
        strokeChange.current *= -1;
      }
      if (strokeCol.current < 1) {
        strokeChange.current *= -1;
      }

      tempLines.push({x1: x1.current, x2: x2.current, y1: y1.current, y2: y2.current, opacity: genRandBetween(0.01, 0.2, 2), 
        stroke: `rgb(${strokeCol.current}, ${strokeCol.current}, ${strokeCol.current})` });
        console.log(strokeCol.current, strokeChange.current)
      setLines(tempLines);
    }
  }, [frameTime, props.height, props.width]);


  return (
    <div style={{position: "absolute", width: "100%", height: "100%", top: 0, left: 0}}>
      <svg height="100%" width="100%">
        { lines.map( line => {
         return <line className="gen-art-line" 
         x1={line.x1}
         x2={line.x2}
         y1={line.y1}
         y2={line.y2}
         strokeWidth="0.5px"
         stroke={line.stroke}
        //  strokeOpacity={line.opacity}
         ></line>
        })}
      </svg>
    </div>
  )
}

export default Genart

// function setup() {

//   createCanvas(1200, 900);

//   frameRate(50);
//   background(250);
//   smooth();
//   strokeCol = 250;
//   strokeChange = -1;
//   strokeWeight(1);
//   angle = -PI / 2;
//   radiusNoise = random(5);
//   angleNoise = random(5);
//   xNoise = random(10);
//   yNoise = random(10);
//   noFill();
// }

// function draw() {
//   radiusNoise += 0.005;
//   angleNoise += 0.005;
//   radius = (noise(radiusNoise) * 550) + 1;
//   //println(radius);
//   angle += (noise(angleNoise) * 6) - 3;
//   if (angle > 360) {
//     angle -= 360;
//   }
//   if (angle < 0) {
//     angle += 360;
//   }

//   xNoise += 0.01;
//   yNoise += 0.01;
//   centX = width / 2 + (noise(xNoise) * 100) - 50;
//   centY = height / 2 + (noise(yNoise) * 100) - 50;

//   rad = radians(angle);
//   x1 = centX + (radius * cos(rad));
//   y1 = centY + (radius * sin(rad));

//   oppRad = rad + PI;
//   x2 = centX + (radius * cos(oppRad));
//   y2 = centY + (radius * sin(oppRad));

//   strokeCol += strokeChange;
//   if (strokeCol > 250) {
//     strokeChange *= -1;
//   }
//   if (strokeCol < 1) {
//     strokeChange *= -1;
//   }
//   stroke(strokeCol, 60);

//   line(x1, y1, x2, y2);
// }