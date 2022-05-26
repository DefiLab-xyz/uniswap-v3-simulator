

const HelpTextUniswap = () => 

{
  const chart1 = <div>
    <p>Uniswap V3 allows anyone to provide liquidity to act as market makers within a specific price range.</p>
    <p>When the price changes, the automated strategy proceeds to balance the quantities of the two tokens according to the predetermined Uniswap V3 constant formula; for each price we can determine the value of the liquidity provided.</p>
    <p>Moving the price boundaries (the min and max values of the selected range) allows you to adjust your Uniswap V3 strategy and optimize your LP strategy.</p>
    <p>Remember:</p>
    <p>The smaller the difference between the min and max limit ⇔ Higher concentrated liquidity ⇔ Higher Fee collection potential ⇔ Higher price risk ("Impermanent Loss" risk)</p>
    <p><b> TL;DR - Using this chart we can compare the value of the Uniswap V3 LP position with the value that the same investment would have generated using alternative strategies.</b></p>
    </div>

  const multiplier = <div>
  <p>The ability to provide concentrated liquidity within an asset’s price curve is the major difference between Uniswap V3 vs Uniswap V2.</p>
  <p>A Uniswap V3 Liquidity Provider can decide to provide liquidity within a fixed price range, maximizing the efficiency of the capital locked.</p>
  <p><b>The concentrated liquidoty multiplier calculates the capital efficiency gains of a concentrated liquidity position relative to allocating capital across the entire price curve (as in Uniswap v2).</b></p>
  </div>

  const impLoss = <div>
     <p>Price risk or ‘impermanent loss’ is a highly debated and important concept to be aware of when analyzing automated market making strategies.</p>
     <p>Price Risk or ‘impermanent loss’ refers to the effect of price changes on the value of your asset between providing liquidity in an AMM LP vs holding the asset.</p>
     <p><b>Using this chart you can compare your selected Uniswap V3 strategy vs each of the other possible strategies and determine the extra profit/loss you incur at each price level providing liquidity in uniswap V3.</b></p>
  </div>

  const playGround = <div>
     <p>The Playground section offers a simplified simulation of calculation of future value of your investment including fees when providing liquidity in Uniswap V3.</p>
     <p>The tool requires you to estimate several parameters (future price of the token, holding period, time spent within the price range and base fees), and provides an estimation of the fees collected using uniswap V3.
</p>
     <p>The results of this simulation heavily depend on the hypothesis made in the parameter selection and should be taken as a vague estimation to test different market conditions.
</p>
     <p><b>The results of the simulation should not be viewed as investment advice or as an indicator of future returns.</b></p>
  </div>

  const timeSpent = <div>
    <p>Uniswap V3 allows you to define a minimum and maximum price (price range). When the swap price of a transaction is within this range you will receive fees for the volume traded. 
</p>
    <p>Time spent within the range is a key factor to estimate the fees that could be collected and a small variation could impact the accuracy of the estimation.</p>
    <p><b>This chart shows the impact that the amount of time spent between this range has on the V3 strategies APR.</b></p>
  </div>

  const feeLevel = <div>
    <p>Uniswap V3 fees are determined by the total liquidity provided and traded volume in Uniswap V3 within your chosen price range.</p>
    <p>Both the total liquidity provided in a particular price range and the total trading volume are dependent on market conditions and frequently change over time.</p>
    <p>In order to perform an estimation of the potential fee in Uniswap V3, the base fee that is earned by a uniswap V2 strategy is multiplied by the V3 fee multiplier.</p>
    <p>A small change in Uniswap V2 fee estimation holds a significant impact on the APR estimation.</p>
    <p><b>This chart shows the impact that the amount of time spent between this range has on the V3 strategies APR.</b></p>
  </div>



  const holdingPeriod = <div>
    <p>The number of days you plan to keep your assets in the Uniswap V3 Pool</p>
  </div>

const finalPrice = <div>
<p>Estimated price of the token at the end of holding period</p>
</div>

const v2Fee = <div>
    <p>The estimated APR base fee that the same assets would generate using V3, <br></br> if liquidity was provided across the full price curve</p>
</div>


const timeInRange = <div>
    <p>Percentage of time the price stays within the chosen min and max range limits</p>
</div>

const rangeSize = <div>
  <p>The Range Size measures the percentage difference between the strategies selected Min and Max bounds and the current price.</p>
</div>

const tokenRatio = <div>
  <p>With Uniswap V3, the amount of each token to be deposited is a function of the defined strategy.</p>
  <p>In particular, the ratio is function of the Min and Max limits and the current price.</p>
  <p>The Token Ratio indicates the proportion of token1 and token2 required to be deposited for the selected strategy.</p>
</div>

const volatility = <div>
  <div style={{marginBottom: 20}}><b>Volatility</b> (measured as relative standard deviation) is calculated as the standard deviation of the last 90 days closing prices. <br></br></div>
  <div style={{display: 'flex', alignItems:"center"}}>
    <div><b>Volatility = &nbsp;</b></div>
    <div style={{textAlign:"center"}}>
    Standard deviation 90 days (price)  <br></br>
    ---------------------------------------------------- <br></br>
    Mean 90 days (price) 
    </div>
    <div>&nbsp;&nbsp;* 100</div>
  </div>
</div>

const aL24hFee = <div>
   <div style={{marginBottom: 20}}>
  Fee earned by the active liquidity in the pool in the last 24 hours. It represents the <b>theoretical maximum return for the pool </b>.<br></br><br></br>
  
  <i>n.b ~</i> The fee calculation should be considered an approximation, since the calculation is subject to simplifications. 
  It is determined solely on trading volume and doesn't take into consideration any impermanent loss. 
  
  <br></br><br></br>
  Active liquidity is determined considering the perfect range where:
  <br></br>
  Min = 24h low price <br></br>
  Max = 24h high price
  <br></br>

 
    </div>
  <div style={{display: 'flex', alignItems:"center"}}>
    <div><b>Active Liquidity 24h fee =   &nbsp;</b></div>
    <div style={{textAlign:"center"}}>
    fee tier * Volume * (LPR/ (tot. Liquidity +  LPR) <br></br>
    ---------------------------------------------------------  <br></br>
    VAL1
    </div>
    <div>&nbsp;&nbsp;* 100</div>
  </div>
  <div>
  where:<br></br>
  <b>VAL1</b>= Value of 1 unit of investment<br></br>
  <b>LPR</b>= liquidity perfect range (for 1 unit of investment)<br></br>
  </div>
  <div><br></br>This indicator allows us to quantify the activity of pools, giving for example the possibility to compare similar pools <br></br> (for example: how do returns compare in the same pool on Ethereum, Optimism and Arbitrum? How do different stable pools compare in terms of returns?....)</div>
</div>


const CLI = <div>
<div style={{marginBottom: 20}}>The <b>Concentrated liquidity Index</b> measures the percentage of liquidity that is concentrated in a range where: <br></br><br></br>
Min = current price - 1 standard deviation (1STD) <br></br> 
Max = current price + 1 standard deviation (1STD). <br></br><br></br>

It's an approximate measure of the competitivity of the pool  <br></br></div>
<div style={{display: 'flex', alignItems:"center"}}>
  <div><b>Concentrated liquidity Index =   &nbsp;</b></div>
  <div style={{textAlign:"center"}}>
  Sum (Liquidity  in range (current price - 1STD, current price + 1STD))  <br></br>
  ----------------------------------------------------------------------------------------------- <br></br>
  Total liquidity in pool
  </div>
  
</div>
</div>

const CLM = <div>
  <p>The ability to provide concentrated liquidity within an asset’s price curve is the major difference between Uniswap V3 vs classic AMMs ( like Uniswap V2, Sushiswap, Balancer,etc…).</p>
  <p>A V3 LP can decide to provide liquidity within a fixed price range, maximizing the efficiency of the capital locked.</p>
  <p>The <b>Concentrated Liquidity Multiplier</b> calculates the capital efficiency gains of a concentrated liquidity position relative to allocating capital across the entire price curve.</p>
</div>

const BackTest = 
<div>
 <p>The <b>Strategy Backtester</b> allows for the simulation of Uniswap v3 strategies and the calculation of historical returns.</p>

<p>Past performances are not a guarantee of future results but they represent an important base of analysis and a support in our LP strategy definition.</p>

 <p>Select how many days you want to run the backtester for and it will calculate for the strategies you have selected (Strategy1, Strategy2 and Unbounded V2 Strategy)</p>

  <p>The table shows an overview of the past performance of the strategy selected:</p>
  <p>
  <b>Fee Roi % </b>= percentage fee generated by the LP position in the holding period - (Fee/initial investment)<br></br>
  <b>APR % </b>= implied annualized fee return - (Fee Roi % *365 / holding period)<br></br>
  <b>Asset Value % </b>= percentage change in value of the LP principal due to variance in price (Value of LP position excluding fees/ Initial investment)<br></br>
  <b>Total Return</b> = Asset Value % + Fee Roi %<br></br>
  <b>Base collected </b>= quantity of token in base collected by the LP position <br></br>
  <b>Token collected</b> = quantity of corresponding token collected by the LP position <br></br>
  <b>Fee in USD </b>= total fee collected by LP position in USD at today’s prices <br></br>
  <b>Time in range</b> = Percentage time price spent between the lower and upper limit of the strategy selected <br></br>
  <b>Backtest Confidence </b>= The accuracy of the back-tester calculations depends on the amount the price spent in range. <br></br>
  When the time in range is close to 100% the accuracy is very high. <br></br>
  Lower value of time in range can cause higher variance in the accuracy of the backtest. <br></br>
  </p>
  <p>For more information about the backtester logic you can refer to this article:
  </p>
  <p><a href="https://defi-lab.medium.com/historical-performances-of-uniswap-l3-pools-2de713f7c70f">Historical Performace of Uniswap V3 Pools</a></p>
</div>

const totalReturn = <div>The value of your principal plus accumulated fees within the backtesting period (LP Total Return)</div>
const totalReturnPerc = <div>Comparing your Uniswap V3 strategy performance against standard strategies (LP Total Return %)</div>
const rangeToggle = <div>Choose an absolute value, or percentage from price value for the min max range.<p>
  % value is calculated as a percentage from the current price for the Impermanant Loss calculation, and is calculated as a percetange from the Entry Price for the Strategy Backtest.</p> </div>

  
  return {
    chart1: chart1,
    multiplier: multiplier,
    impLoss: impLoss,
    playGround: playGround,
    timeSpent: timeSpent,
    feeLevel: feeLevel,
    holdingPeriod: holdingPeriod,
    finalPrice: finalPrice,
    v2Fee: v2Fee,
    timeInRange: timeInRange,
    rangeSize: rangeSize,
    tokenRatio: tokenRatio,
    volatility: volatility,
    aL24hFee: aL24hFee,
    CLI: CLI,
    CLM: CLM,
    backtest: BackTest,
    totalReturn: totalReturn,
    totalReturnPerc: totalReturnPerc,
    rangeToggle: rangeToggle
  }

}

const HelpTextPerp = () => {

  const baseText = HelpTextUniswap();

  const chart1 = <div>
    <p>Perpetual Curie V2 allows anyone to provide liquidity to act as market makers within a specific price range.</p>
    <p>The success of your Perp V2 market making position depends on <b>two main factors</b>: <br></br>
    &nbsp;&nbsp;&nbsp;&nbsp;<b>Impermanent/divergence loss</b><br></br>
    &nbsp;&nbsp;&nbsp;&nbsp;<b>Trading fee collected</b><br></br>
    In this chart we showcase the impact of Impermanent/divergence loss at different price levels excluding the trading fees from the analysis.
    </p>
    <p>We also calculate the price at which the liquidation process will be triggered based on your strategy.</p>
    <p>The chart assumes that you have only a <b>single Market Maker position open</b>. <br></br> 
    If multiple positions are simultaneously open, Perpetual calculates a global margin so your liquidations limits are dynamically calculated on your global position.</p>
    <p>Remember:</p>
    <p>The smaller the difference between the min and max limit ⇔ Higher concentrated liquidity ⇔ Higher Fee collection potential ⇔ Higher price risk ("Impermanent Loss" risk)</p>
    <p>The higher the leverage selected ⇔Higher Liquidity Provided ⇔ Higher Fee collection potential ⇔ Higher liquidation risk </p>
  </div>; 
  const multiplier = <div></div>;
  const impLoss = <div></div>;
  const playGround = <div></div>;
  const timeSpent = <div></div>;
  const feeLevel = <div></div>;
  const holdingPeriod = <div></div>;
  const finalPrice = <div></div>;
  const v2Fee = <div></div>;
  const timeInRange = <div></div>;
  const rangeSize = baseText.rangeSize;
  const tokenRatio = <div>
  <p>ith Perpetual V2, the amount of each token to be deposited is a function of the defined strategy.</p>
  <p>In particular, the ratio is function of the Min and Max limits and the current price.</p>
  <p>The Token Ratio indicates the proportion of token1 and token2 required to be deposited for the selected strategy.</p>
  </div>;
  const volatility = baseText.volatility;
  const aL24hFee = <div></div>;
  const CLI = baseText.CLI;
  const CLM = <div>
  <p>The ability to provide concentrated liquidity within an asset’s price curve is the major difference between Perpetual V2 vs Perpetual V1.</p>
  <p>A V2 LP can decide to provide liquidity within a fixed price range, maximizing the efficiency of the capital locked.</p>
  <p>The <b>Concentrated Liquidity Multiplier</b> calculates the capital efficiency gains of a concentrated liquidity position relative to allocating capital across the entire price curve.</p>
  </div>;
  const BackTest = <div>
  <p>The <b>Strategy Backtester</b> allows for the simulation of  Perpetual V2  strategies and the calculation of historical returns.</p>
  <p>Past performances are not a guarantee of future results, but they represent an important base of analysis and a support in our LP strategy definition.</p>
 
  <p>Select how many days you want to run the backtester for and it will calculate estimated returns for the strategies you have selected (Strategy1 and/or Strategy2)</p>
 
   <p>The backtester calculates:</p>
   <p>The Impermanent loss profile and liquidation point based on the entry price <b>(Impermanent loss Chart)</b><br></br><br></br>
   The <b>table</b> and <b>bar chart</b> show an overview of the past performance of the strategy selected:<br></br><br></br>
   <b>Fee ROI%</b>= percentage fee generated by the LP position in the holding period - (Fee/initial investment)<br></br><br></br>
   <b>APR % </b>= implied annualized fee return - (Fee Roi % *365 / holding period)<br></br><br></br>
   <b>Time in range</b> = Percentage time price spent between the lower and upper limit of the strategy selected <br></br><br></br>
   <b>Backtest Confidence </b>= The accuracy of the back-tester calculations depends on the amount the price spent in range. <br></br><br></br>
   When the time in range is close to 100% the accuracy is very high. <br></br><br></br>
   Lower value of time in range can cause higher variance in the accuracy of the backtest. <br></br><br></br>
   </p>
 </div>;

  const baseFee = <div>Estimated Annualised percentage fee generated by the LP position</div>
  const rewardAPR = <div>Estimated Annualised percentage fee generated by Liquidity Mining reward</div>
  const totalReturn = <div>The value of your principal plus accumulated fees within the backtesting period (LP Total Return)</div>
  const totalReturnPerc = <div>Comparing your Perpetual V2 strategy performance against standard strategies (LP Total Return %)</div>
  const rangeToggle = <div>Choose an absolute value ($) or use a percentage (%) for the min max range.<p>
  Percent value is calculated as a percentage from the current price for the Impermanant Loss calculation, and as a percetange from the Entry Price for the Strategy Backtest.</p> </div>

  return {
    chart1: chart1,
    multiplier: multiplier,
    impLoss: impLoss,
    playGround: playGround,
    timeSpent: timeSpent,
    feeLevel: feeLevel,
    holdingPeriod: holdingPeriod,
    finalPrice: finalPrice,
    v2Fee: v2Fee,
    timeInRange: timeInRange,
    rangeSize: rangeSize,
    tokenRatio: tokenRatio,
    volatility: volatility,
    aL24hFee: aL24hFee,
    CLI: CLI,
    CLM: CLM,
    backtest: BackTest,
    baseFee: baseFee,
    rewardAPR: rewardAPR,
    totalReturn: totalReturn,
    totalReturnPerc: totalReturnPerc,
    rangeToggle: rangeToggle
  }
}

const HelpText = {
  uniswap: HelpTextUniswap(),
  perpetual: HelpTextPerp()
}

export default HelpText