import { useState } from 'react'
import { Link } from "react-router-dom";
import Grid from '../components/Grid'
import ToolTip from '../components/ToolTip'
import { ReactComponent as  Twitter } from '../assets/twitter.svg'
import { ReactComponent as Telegram } from '../assets/telegram.svg'
import { ReactComponent as Medium } from '../assets/medium.svg'
import { ReactComponent as Gitcoin } from '../assets/gitcoin.svg'
import QrCode from '../assets/qrcode.png'
import { ReactComponent as Donate } from '../assets/heart.svg'
import { ReactComponent as Hamburger } from '../assets/menu.svg'
import NavData from '../data/NavBar.json'
import ThemeToggle from '../components/ThemeToggle';

const NavMenu = (props) => {

  const [navMenuVis, setNavMenuVis] = useState("hidden");

  const navMenuStyle = {
    left: -200, 
    top: 30, 
    width: 240,
    zIndex: "999999", 
    display: "grid", 
    alignItems: "center", 
    margin: "15px", 
    textAlign:"center", 
    backgroundColor: "#e5faf8", 
    fill: '#4d5458',
    padding:"15px"
  }

  const navItemStyle = {
    fontWeight: "500", 
    border: "none", 
    width: '100%', 
    // color: "rgb(173,126,228)", 
    textAlign: "center", 
    height: "22px", 
    borderRadius: "1", 
    marginLeft: "0%", 
    paddingLeft: "5%", 
    paddingRight: "5%", 
    marginRight: "5%", 
    fontSize: "12px", 
    marginBottom: "7px"
  }

  const navItemData = NavData.navItems;

  const NavItems = () => {
    return (navItemData.map((item) => 
      <Link to={item.link}>
        <button className="list-item"
          key={item.id}
          style={navItemStyle}><span>{item.name}</span>
        </button>
      </Link>
    ));
  }

  return (
    <ToolTip 
    text={<NavItems></NavItems>}
    textStyle={navMenuStyle}
    onClick={() => navMenuVis === null ? setNavMenuVis('hidden') : setNavMenuVis(null)}
    onBlur={() => setNavMenuVis('hidden')}>
      <Hamburger alt="Site Menu navigation" className="nav-icon"></Hamburger>
    </ToolTip>
  )
}


const ERC20DonationText =  (props) => {
  return (
    <div>
      <div style={{fontSize: "14px", marginTop: "0px"}}>Show us some love! <span style={{fontSize: "20px"}}>🐙</span></div><br></br>
      <div>
        <img src={QrCode} alt="QR Code Eth ERC 20 Address" style={{width: "70px", height: "70px", marginBottom: "10px"}}></img>
      </div> 
      <div style={{fontSize: "14px"}}>Donate ETH / ERC20</div>
      <div style={{fontSize: "10px", marginTop: "10px", marginBottom: "10px"}}>0xD7ceb6F030699BF707Cb8b927A4f39c989c5Ab8B</div>
    </div>
  )
}

const ERC20Donation = (props) => {

  const [donationVis, setDonationVis] = useState("hidden");

  const textStyle = {
    left: -220, 
    top: 30, 
    width: "240px",
    zIndex: "999999", 
    display: "grid", 
    alignItems: "center", 
    margin: "15px", 
    textAlign:"center", 
    // backgroundColor: "#e5faf8", 
    padding:"15px" }

  return (
    <ToolTip
    textStyle={textStyle}
    // buttonStyle={{backgroundColor: "rgba(128, 232, 221, 0.5)"}} 
    text={<ERC20DonationText></ERC20DonationText>}
    onClick={() => donationVis === null ? setDonationVis('hidden') : setDonationVis(null)}
    onBlur={() => setDonationVis('hidden')}
    >
      <Donate alt="ERC20 QR code donation to DefiLab" className="nav-icon nav-icon-heart" ></Donate>
      {/* <img src={donate} alt="ERC20 QR code donation to DefiLab" style={props.imageStyle}></img> */}
    </ToolTip>
  )
}

const GitCoin = (props) => {

  return (
    <ToolTip text={"Donate on GitCoin"} 
    buttonStyle={{backgroundColor: "rgba(128, 232, 221, 0.7)"}} 
    // textStyle={{backgroundColor:"#e5faf8"}}
    >
      <a href="https://gitcoin.co/grants/2575/defilab_xyz " target="_blank" rel="noreferrer">
        <Gitcoin alt="GitCoin link" className="nav-icon" style={{width: 15, height: 15, paddingBottom: 4}}></Gitcoin>
      </a>
    </ToolTip>
  )
}

const SocialLinks = (props) => {

  const linkData = [{key:"twitter", src: <Twitter className="nav-icon"></Twitter>, alt: "Twitter profile DefiLab", text: "Check us out on Twitter", href: "https://twitter.com/DefiLab_xyz"},
    {key:"telegram", src: <Telegram className="nav-icon"></Telegram>, alt: "Telegram channel DefiLab", text: "Reach out on Telegram", href: "https://t.me/joinchat/uOY1GOFvnH43NzA0"},
    {key:"medium", src: <Medium className="nav-icon"></Medium>, alt: "Medium profile DefiLab", text: "Learn more on Medium", href: "https://defi-lab.medium.com"}];

  const links = linkData.map((link) => 
    <ToolTip key={link.key} text={link.text}>
      <a href={link.href} target="_blank" rel="noreferrer">
        {link.src}
      </a>
    </ToolTip>
  );

  return (links)
}

const NavBar = (props) => {

  const styles = genStyles(props);

  return (
    <Grid
    rows={props.rows || 4}
    columns={props.columns || 62}
    cellAspectRatio={props.cellAspectRatio || 0.82}
    gridGap={props.gridGap || 5}
    gridWidth={props.width}
    minWidth={props.minWidth}
    >
      <h1 style={styles.title}>{props.title}</h1>
      <ThemeToggle style={styles.themeToggle}></ThemeToggle>
      <div style={styles.links}>
        <GitCoin></GitCoin>
        <SocialLinks></SocialLinks>
        <ERC20Donation></ERC20Donation>
        <NavMenu></NavMenu>
      </div>   
   </Grid>
  )
}

const genStyles = (props) => {
  return {
    title: {
      gridColumn: "3 / span 30",
      gridRow: "1 / span 3",
      verticalAlign: "middle",
      marginTop: 20,
      ...props.titleStyle 
    },
    links: {
      display: "flex", 
      justifyContent: "flex-end",
      gridColumn: "42 / span 17",
      gridRow: "2 / span 1",
      ...props.linkStyle 
    },
    themeToggle: {
      gridColumn: "44 / span 4",
      gridRow: "2 / span 1"
    }
  };
}

export default NavBar