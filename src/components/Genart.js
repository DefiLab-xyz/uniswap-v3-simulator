import { genRandBetween } from "../helpers/numbers";
import {useState, useEffect, useRef} from 'react'
import tumult from 'tumult'


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

  var strokeCol;
  var strokeChange;
  const perlin = new tumult.Perlin1();
  const frameTime = useFrameTime();

  const angle = useRef(-Math.PI / 2);
  const radius = useRef(1);
  const radiusNoise = useRef(genRandBetween(0, 5));
  const angleNoise = useRef(genRandBetween(0, 5));
  const xNoise = useRef(genRandBetween(0, 10));
  const yNoise = useRef(genRandBetween(0, 10)); 
  const centX = useRef();
  const centY = useRef();
  const rad = useRef();
  const oppRad = useRef();
  const x1 = useRef();
  const x2 = useRef();
  const y1 = useRef();
  const y2 = useRef();
  const [lines, setLines] = useState([]);

  useEffect(() => {

    const tempLines = [...lines];
    radiusNoise.current += 0.005;
    angleNoise.current += 0.005;
    radius.current = (perlin.gen(radiusNoise) * 550) + 1;

    const newAngle = angle.current + (perlin.gen(angleNoise) * 6) - 3;
    angle.current = newAngle > 360 ? angle.current - 360 :  newAngle < 0  ? angle.current = 360 : newAngle;

    xNoise.current += 0.01;
    yNoise.current += 0.01;
    centX.current = props.width / 2 + (perlin.gen(xNoise) * 100) - 50;
    centY.current = props.height / 2 + (perlin.gen(yNoise) * 100) - 50;

    rad.current = Math.rad(angle);
    x1.current = centX.current + (radius.current * Math.cos(rad.current));
    y1.current = centY.current + (radius.current * Math.sin(rad.current));

    oppRad.current = rad.current + Math.PI;
    x2.current = centX.current + (radius.current * Math.cos(oppRad));
    y2.current = centY.current + (radius.current * Math.sin(oppRad));

    tempLines.push({x1: x1, x2: x2, y1: y1, y2: y2 });
    console.log(tempLines)
    setLines(tempLines);

  }, [frameTime, props.height, props.width]);


  return (
    <div style={{position: "absolute", width: 100, height: 100, top: 0, left: 0}}>
      <svg height="100%" width="100%">
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