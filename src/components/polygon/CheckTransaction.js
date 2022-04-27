import {TextAlignedCenter, TextAlignedLeft} from './Text'
import {checkBridgeTx} from './checkTransactionWeb3'
import searchImage from '../../assets/search.svg'
import timerImage from '../../assets/timer.svg'
import {useRef, useState, useEffect} from 'react'
import { checkpointData } from '../../api/polygonData'
import Grid from '../Grid'
import ToolTip from '../ToolTip'



export const CheckTransaction = (props) => {

  const inputRef = useRef();
  const [lastCheckPoint, setLastCheckpoint] = useState("");
  const [lastBlock, setLastBlock] = useState("");
  const [buttonIcon, setButtonIcon] = useState(searchImage);

  const txMessageSelected = [
    ["- Transaction is Complete!", "Your funds should be visible on the Ethereum Chain"],
    ["- Transaction is In Progress", "Your funds are waiting to be checkpointed on the Ethereum change"],
    ["- Not a Bridge Withdraw Transaction", "This is a valid Polygon Tx Number,", "but isn't a bridge transaction."],
    ["- Not a Valid Polygon Transaction", "This Tx Number doesn't return any information from the Polygon Chain."]
  ];

  const [checkMessage, setCheckMessage] = useState(["", ""]);

  const handleInputKeydown = (e) => {

    if (e.key === 'Enter') {

      checkEnteredTx(e.target.value)
    }
    
  }

  const handleButtonClick = () => {
    checkEnteredTx(inputRef.current.value)
  }

  const checkEnteredTx = (tx) => {
    setButtonIcon(timerImage);
    setCheckMessage(["", ""]);

    checkBridgeTx(tx).then(d => {

      setCheckMessage(txMessageSelected[d]);
      setButtonIcon(searchImage);
    });
  }

  useEffect(() => {

    checkpointData().then(d => {
      if (d && d.timestamp) {
        const dt = new Date(0);
        dt.setUTCSeconds(d.timestamp);
        const today = new Date();
        const diff = Math.floor((today - dt) / (1000 * 60));
  
        setLastBlock(d.block);
  
        if (diff > 60) {
          const mins = diff % 60;
          const hrs = Math.floor(diff / 60);
          setLastCheckpoint(`${hrs}hr ${mins}m`)
        }
        else {
          setLastCheckpoint(`${diff} mins ago`)
        }
      }
    })
  }, []);

  const [columns, setColumns] = useState(62);
  const [rows, setRows] = useState(10);

  const [messageStyle, setMessageStyle] = useState([
    {gridColumn: "21 / span 15", gridRow: "1 / span 2"},
    {gridColumn: "39 / span 25", gridRow: "3 / span 3"},
    {gridColumn: "39 / span 25", gridRow: "4 / span 3"}
  ]);

  const [headingStyle, setHeadingStyle] = useState([
    {gridColumn: "6 / span 15", gridRow: "1 / span 2"},
    {gridColumn: "6 / span 32", gridRow: "3 / span 5"},
  ]);

  const [inputStyle, setInputStyle] = useState([
    {gridColumn: "7 / span 22", gridRow: "3 / span 2"},
    {gridColumn: "7 / span 14", gridRow: "5 / span 2"},
  ]);

  const [buttonStyle, setButtonStyle] = useState([
    {gridColumn: "21 / span 2", gridRow: "5 / span 2"}
  ]);



  const [latestStyle, setLatestStyle] = useState([
    {gridColumn: "29 / span 8", gridRow: "4 / span 1"},
    {gridColumn: "29 / span 8", gridRow: "5 / span 2"},
    {gridColumn: "23 / span 8", gridRow: "4 / span 1"},
    {gridColumn: "23 / span 8", gridRow: "5 / span 2"}
  ]);

  const [fontSizes, setFontSizes] = useState(["1.5vw", "1.2vw", "1.3vw", "1.1vw"]);

  useEffect(() => {
    if(props.dimensions.width < 760) {
        setColumns(32);
        setRows(12);
        setMessageStyle([
          {gridColumn: "8 / span 15", gridRow: "4 / span 2", zIndex:4},
          {gridColumn: "39 / span 25", gridRow: "3 / span 3", zIndex:4, visibility: "hidden"},
          {gridColumn: "39 / span 25", gridRow: "4 / span 3", zIndex:4, visibility: "hidden"}
        ]);
        setHeadingStyle([
          {gridColumn: "2 / span 28", gridRow: "1 / span 2", zIndex:4, display: "flex"},
          {gridColumn: "2 / span 30", gridRow: "3 / span 7", zIndex:4},
        ]);
        setInputStyle([
          {gridColumn: "3 / span 22", gridRow: "4 / span 2", zIndex:4},
          {gridColumn: "3 / span 16", gridRow: "6 / span 3", zIndex:4},
        ]);
        setButtonStyle([
          {gridColumn: "19 / span 3", gridRow: "6 / span 3", zIndex:4}
        ]);
        setLatestStyle([
          {gridColumn: "29 / span 8", gridRow: "4 / span 2", visibility: "hidden", zIndex:4},
          {gridColumn: "29 / span 8", gridRow: "5 / span 2", visibility: "hidden", zIndex:4},
          {gridColumn: "23 / span 8", gridRow: "4 / span 3", zIndex:4},
          {gridColumn: "23 / span 8", gridRow: "6 / span 2", zIndex:4}
        ]);

        setFontSizes(["3vw", "2.7vw", "2.7vw", "2vw"]);
    }
    else {
      setColumns(64);
      setRows(10);
      setMessageStyle([
        {gridColumn: "39 / span 15", gridRow: "3 / span 2", zIndex:4},
        {gridColumn: "39 / span 25", gridRow: "4 / span 3", zIndex:4},
        {gridColumn: "39 / span 25", gridRow: "4 / span 3", zIndex:4}
      ]);
      setHeadingStyle([
        {gridColumn: "7 / span 32", gridRow: "1 / span 2", zIndex:4, display: "flex"},
        {gridColumn: "6 / span 32", gridRow: "3 / span 5", zIndex:4},
      ]);
      setInputStyle([
        {gridColumn: "7 / span 22", gridRow: "3 / span 2", zIndex:4},
        {gridColumn: "7 / span 14", gridRow: "5 / span 2", zIndex:4},
      ]);
      setButtonStyle([
        {gridColumn: "21 / span 2", gridRow: "5 / span 2", zIndex:4}
      ]);
      setLatestStyle([
        {gridColumn: "29 / span 8", gridRow: "4 / span 1", zIndex:4},
        {gridColumn: "29 / span 8", gridRow: "5 / span 2", zIndex:4},
        {gridColumn: "23 / span 8", gridRow: "4 / span 1", zIndex:4},
        {gridColumn: "23 / span 8", gridRow: "5 / span 2", zIndex:4}
      ]);
      setFontSizes(["1.5vw", "1.2vw", "1.3vw", "1.1vw"]);
    }
  }, [props.dimensions.width])

  const helpText = <div>
    <p>The transaction checker allows you to verify the status of a withdrawal from Polygon to Ethereum.</p>
    <p>When removing funds from the Polygon Network to Ethereum using the POS bridge, a withdrawal process is used to burn tokens on Polygon and release them on Ethereum.
    </p>
    <p>This process is made of 3 steps: <br></br>
    - Withdraw initialization on Polygon<br></br>
    - Checkpoint recording on Ethereum <br></br>
    - Withdraw completion on Ethereum
    </p>
    <p>The time to complete this process varies (usually around one hour), with the “Last Checkpoint Time” showing the last recorded checkpoint time on the Ethereum chain. 
    </p>
    <p>If you have made a bridge transaction to move your funds from Polygon to Ethereum, you can use this transaction checker to verify its status using your Polygon transaction ID. 
    </p>
  </div>

  return (
    <Grid
    columns={columns}
    gridWidth={props.dimensions.width}
    minWidth={0}
    rows={rows}
    dimensions={props.dimensions}
    cellAspectRatio={1}
    gridGap={5}
    gridStyle={{zIndex:4}}
   >

      <div className={props.pageStyle["chart-container"]} style={headingStyle[1]}>
      </div>

      <div style={inputStyle[0]} className={props.pageStyle["tx-checker-text"]}>
        <TextAlignedLeft height="100%" width="100%" x="0%" y="50%" fill="#4f475d" text="Tx Checker"></TextAlignedLeft>
      </div>
      <div style={inputStyle[1]} >
          <input 
          ref={inputRef}
          className={props.pageStyle["tx-check-input"]}
          onKeyDown={(e) => handleInputKeydown(e)}
          style={{fontSize:fontSizes[1]}}
          ></input>
      </div>

      <div style={buttonStyle[0]} >
          <button 
          className={props.pageStyle["tx-check-btn"]}
          onClick={handleButtonClick}>
            <img className={props.pageStyle["tx-check-img"]} src={buttonIcon} alt="search transaction"></img>
          </button>
      </div>

      <div  style={headingStyle[0]} className={props.pageStyle["tx-checker-title"]}>
          <TextAlignedLeft height="100%" width="100%" x="0%" y="50%" fill={props.dimensions.width < 760 ? "#4f475d" : "#8b50e8"} text="Polygon Ethereum Bridge"></TextAlignedLeft>
         
      </div>

      <div style={latestStyle[0]} className={props.pageStyle["tx-checker-info-label"]}>
        <TextAlignedCenter  height="100%" width="100%" x="50%" y="50%" fill="#4f475d"  text="Latest Block"></TextAlignedCenter>
      </div>
      <div style={latestStyle[1]} className={props.pageStyle["tx-checker-info"]}>
        <TextAlignedCenter fontSize={fontSizes[0]} height="100%" width="100%" x="50%" y="50%" fill="#8b50e8"  text={lastBlock}></TextAlignedCenter>
      </div>  
      <div style={latestStyle[2]} className={props.pageStyle["tx-checker-info-label"]}>
        <TextAlignedCenter height="100%" width="100%" x="50%" y="50%" fill="#4f475d"  text="Latest Checkpoint"></TextAlignedCenter>
      </div>
      <div style={latestStyle[3]} className={props.pageStyle["tx-checker-info"]}>
        <TextAlignedCenter fontSize={fontSizes[0]} height="100%" width="100%" x="50%" y="50%" fill="#8b50e8"  text={lastCheckPoint}></TextAlignedCenter>
      </div>


      <div style={messageStyle[0]} className={props.pageStyle["tx-checker-info-label"]}>
        <TextAlignedLeft fontSize={fontSizes[2]} height="100%" width="100%" x="0%" y="50%" fill="#4f475d" text={checkMessage[0]}></TextAlignedLeft>
      </div>

      <div style={messageStyle[1]} className={props.pageStyle["tx-checker-info-label"]}>
        <TextAlignedLeft fontSize={fontSizes[3]} height="100%" width="100%" x="0%" y="50%" fill="#4f475d" text={checkMessage[1]}></TextAlignedLeft>
      </div>

      <div style={messageStyle[2]} className={props.pageStyle["tx-checker-info-label"]}>
        <TextAlignedLeft fontSize={fontSizes[3]} height="100%" width="100%" x="0%" y="50%" fill="#4f475d" text={checkMessage[2]}></TextAlignedLeft>
      </div>

    <div style={{gridRow: "1 / span 2", gridColumn: "4 / span2" }}>
    <ToolTip tooltipStyle={{zIndex: 7, width: "25px", height: "25px", margin: 0, marginLeft: "5px", fontSize:"10px", fontWeight: "500", textAlign:"center", visibility: props.dimensions.width < 760 ? "hidden" : null}} 
    textStyle={{zIndex: 999, width: "350px", height: "fill-content", left: "10px", top: "30px"}} 
    text={helpText}>?
      {/* <TextAlignedCenter className="tooltip-container" text="?" fontSize={"1.3vw"} height="100%" width="100%" x="50%" y="50%" fill="#4f475d" fontWeight={500}></TextAlignedCenter> */}
    </ToolTip>
    </div>
     
     </Grid>
  )

  
}