import React from 'react';
import { render } from "react-dom";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import { Provider } from 'react-redux';
import { Store } from './store'
import reportWebVitals from './reportWebVitals'
import './styles/index.css';

import UniswapSimulator from './containers/UniswapSimulator';
import PerpetualSimulator from './containers/PerpetualSimulator';
import Home from './containers/Home';
import PolygonNow from './containers/PolygonNow';


const rootElement = document.getElementById("root");

render(
  <React.StrictMode>
    <Provider store={Store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/uniswapv3simulator" element={<UniswapSimulator page="uniswap"/>}/>
          <Route path="/perpetualsimulator" element={<PerpetualSimulator page="perpetual"/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/polygonnow" element={<PolygonNow/>}/>
        </Routes> 
      </BrowserRouter>
    </Provider>
  </React.StrictMode>, rootElement);


reportWebVitals();
