import React from 'react';
import { render } from "react-dom";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import UniswapSimulator from './routes/UniswapSimulator';
import Home from './routes/Home';
import PolygonNow from './routes/PolygonNow';

const rootElement = document.getElementById("root");

render(
<React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}/>
      <Route path="/uniswapv3simulator" element={<UniswapSimulator/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/polygonnow" element={<PolygonNow/>}/>
    </Routes> 
  </BrowserRouter>
</React.StrictMode>, rootElement);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
