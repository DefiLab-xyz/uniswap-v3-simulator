import { useState } from 'react'
import { Link } from "react-router-dom";
import Grid from '../components/Grid'
import ToolTip from '../components/ToolTip'
import twitter from '../assets/twitter.svg'
import telegram from '../assets/telegram.svg'
import medium from '../assets/medium.svg'
import gitcoin from '../assets/gitcoin.svg'
import qrCode from '../assets/qrcode.png'
import donate from '../assets/heart.svg'
import hamburger from '../assets/menu.svg'
import NavData from '../data/NavBar.json'

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
    color: "rgb(173,126,228)", 
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
      <img src={hamburger} alt="Site Menu navigation" style={props.imageStyle}></img>
    </ToolTip>
  )
}


const ERC20DonationText =  (props) => {
  return (
    <div>
      <div style={{fontSize: "14px", marginTop: "0px"}}>Show us some love! <span style={{fontSize: "20px"}}>🐙</span></div><br></br>
      <div><img src={qrCode} alt="QR Code Eth ERC 20 Address" style={{width: "70px", height: "70px", marginBottom: "10px"}}></img></div> 
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
    backgroundColor: "#e5faf8", 
    padding:"15px" }

  return (
    <ToolTip
    textStyle={textStyle}
    text={<ERC20DonationText></ERC20DonationText>}
    onClick={() => donationVis === null ? setDonationVis('hidden') : setDonationVis(null)}
    onBlur={() => setDonationVis('hidden')}
    >
      <img src={donate} alt="ERC20 QR code donation to DefiLab" style={props.imageStyle}></img>
    </ToolTip>
  )
}

const GitCoin = (props) => {

  const imageStyle = {
    width: "16px", 
    marginLeft: "1px",
    marginBottom: "4px",
    height: "16px", 
    padding: 0, 
    margin:0,
    fill: '#5f696f' }

  return (
    <ToolTip text={"Donate on GitCoin"} buttonStyle={{backgroundColor: "rgba(128, 232, 221, 0.5)"}} textStyle={{backgroundColor:"#e5faf8"}}>
      <a href="https://gitcoin.co/grants/2575/defilab_xyz " target="_blank" rel="noreferrer">
        <img src={gitcoin} alt="GitCoin link" style={imageStyle}></img>
      </a>
    </ToolTip>
  )
}

const SocialLinks = (props) => {

  const linkData = [{key:"twitter", src: twitter, alt: "Twitter profile DefiLab", text: "Check us out on Twitter", href: "https://twitter.com/DefiLab_xyz"},
    {key:"telegram", src: telegram, alt: "Telegram channel DefiLab", text: "Reach out on Telegram", href: "https://t.me/joinchat/uOY1GOFvnH43NzA0"},
    {key:"medium", src: medium, alt: "Medium profile DefiLab", text: "Learn more on Medium", href: "https://defi-lab.medium.com"}];

  const links = linkData.map((link) => 
    <ToolTip key={link.key} text={link.text} textStyle={{backgroundColor:"#e5faf8"}}>
      <a href={link.href} target="_blank" rel="noreferrer"><img src={link.src} alt={link.alt} style={props.imageStyle}></img></a>
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
      <div style={styles.links}>
        <GitCoin></GitCoin>
        <SocialLinks imageStyle={styles.image}></SocialLinks>
        <ERC20Donation imageStyle={styles.image}></ERC20Donation>
        <NavMenu imageStyle={styles.image}></NavMenu>
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
      gridColumn: "43 / span 17",
      gridRow: "2 / span 1",
      ...props.linkStyle 
    },
    image: {
      width: "12px", 
      marginLeft: "1px",
      marginTop: "1px",
      height: "12px", 
      padding: 0, 
      margin:0,
      // fill: '#5f696f',
      fill: '#4d5458',
      ...props.imageStyle 
    }
  };
}

export default NavBar