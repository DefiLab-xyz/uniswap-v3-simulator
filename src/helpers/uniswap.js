import { logWithBase, round } from "./numbers";

export const roundToNearestTick = (value, feeTier, baseDecimal, quoteDecimal) => {
  const divider = feeTier / 50;
  const valToLog = parseFloat(value) * Math.pow(10, (quoteDecimal - baseDecimal));
  const tickIDXRaw = logWithBase(valToLog,  1.0001);
  const tickIDX = round(tickIDXRaw / divider, 0) * divider;
  const tick = Math.pow(1.0001, tickIDX) / Math.pow(10, (quoteDecimal - baseDecimal));
  return tick;
}

export const defaultStrategyRange = (price) => {

}