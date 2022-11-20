import { createSlice, createSelector } from "@reduxjs/toolkit";
import optimism from '../assets/optimism-logo.svg'
import ethereum from '../assets/eth-logo.svg'
import arbitrum from '../assets/arbitrum-logo.png'
import polygon from '../assets/polygon.png'
import celo from '../assets/celo-logo.png'

const protocols = [{id: 0, title: "ethereum", logo: ethereum, chain: "mainnet"}, 
{id: 1, title: "optimism", logo: optimism, chain: "optimism"}, 
{id: 2, title: "arbitrum", logo: arbitrum, chain: "arbitrum"},
{id: 3, title: "polygon", logo: polygon, chain: "polygon"},
{id: 4, title: "perpetual", logo: optimism, chain: "optimism"},
{id: 5, title: "celo", logo: celo, chain: "celo"}];

export const protocolSlice = createSlice({
  name: "protocol",
  initialState: { value: protocols[0] },
  reducers: {
    setProtocol: (state, action) => {
      if (protocols.map(d => d.id).includes(action.payload.id)) {
        state.value = protocols[action.payload.id];
      }
    }
  }
});

export const selectAllProtocols = state => protocols;
export const selectProtocol = state => state.protocol.value;
export const selectProtocolId = state => state.protocol.value.id;
export const selectProtocolName = state => state.protocol.value.title;
export const selectProtocolLogo = state => state.protocol.value.logo;

export const selectProtocolsByIds = createSelector([protocols => protocols, (protocols, ids) => ids], (protocols, ids) => {
  return protocols.filter(d => ids.includes(d.id));
});



export const { setProtocol } = protocolSlice.actions;
export default protocolSlice.reducer;