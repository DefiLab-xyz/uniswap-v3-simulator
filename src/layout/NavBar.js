import { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import NavData from '../data/NavBar.json'
import styles from '../styles/modules/NavBar.module.css'

import { ReactComponent as  Twitter } from '../assets/twitter.svg'
import { ReactComponent as Telegram } from '../assets/telegram.svg'
import { ReactComponent as Medium } from '../assets/medium.svg'
import { ReactComponent as Gitcoin } from '../assets/gitcoin.svg'
import { ReactComponent as Donate } from '../assets/heart.svg'
import { ReactComponent as Hamburger } from '../assets/menu.svg'
import GitHub from '../assets/GitHub.png'
import GitHubLight from '../assets/GitHub-light.png'
import QrCode from '../assets/qrcode.png'
import ThemeToggle from '../components/ThemeToggle';
import Grid from '../components/Grid'
import ToolTip from '../components/ToolTip'

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
    fill: '#4d5458',
    padding:"15px",
    border: props.page === 'perpetual' ? "1px solid black" : ""
  }

  const navItemData = NavData.navItems.filter( d => d.id !== props.pageid);

  const NavItems = () => {
    return (navItemData.map((item) => 
      <Link to={item.link} onClick={() => this.forceUpdate}>
        <button className={`${styles["nav-list-item"]}`}
          key={item.id}><span>{item.name}</span>
        </button>
      </Link>
    ));
  }

  return (
    <ToolTip 
    text={<NavItems></NavItems>}
    textStyle={navMenuStyle}
    classNameText={styles['nav-menu']}
    onClick={() => navMenuVis === null ? setNavMenuVis('hidden') : setNavMenuVis(null)}
    onBlur={() => setNavMenuVis('hidden')}>
      <Hamburger alt="Site Menu navigation" className={styles["nav-icon"]}></Hamburger>
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
    padding:"15px" }

  return (
    <ToolTip
    textStyle={textStyle}
    text={<ERC20DonationText></ERC20DonationText>}
    onClick={() => donationVis === null ? setDonationVis('hidden') : setDonationVis(null)}
    onBlur={() => setDonationVis('hidden')}
    >
      <Donate alt="ERC20 QR code donation to DefiLab" className={`${styles["nav-icon"]} ${styles["nav-icon-heart"]}`}></Donate>
      {/* <img src={donate} alt="ERC20 QR code donation to DefiLab" style={props.imageStyle}></img> */}
    </ToolTip>
  )
}

const GitCoin = (props) => {

  return (
    <ToolTip text={"Donate on GitCoin"} 
    buttonStyle={{backgroundColor: "rgba(128, 232, 221, 0.7)"}} 
    >
      <a href="https://gitcoin.co/grants/2575/defilab_xyz " target="_blank" rel="noreferrer">
        <Gitcoin alt="GitCoin link" className="nav-icon" style={{width: 15, height: 15, paddingBottom: 4}}></Gitcoin>
      </a>
    </ToolTip>
  )
}

const GitHubRepo = (props) => {
  const [img, setImg] = useState(props.darkMode  ? GitHub : GitHubLight);

  useEffect(() => {
    setImg(props.darkMode || props.page === 'perpetual' ? GitHub : GitHubLight)
  }, [props.darkMode, props.page]);

  return (
    <ToolTip text={"GitHub Open Source Code Repo"} 
    >
      <a href="https://github.com/DefiLab-xyz" target="_blank" rel="noreferrer">
        <img alt="GitHub Open Source Code DefiLab" src={img} className={styles["nav-icon"]}></img>
      </a>
    </ToolTip>
  )
}

const SocialLinks = (props) => {

  const linkData = [{key:"twitter", src: <Twitter className={styles["nav-icon"]}></Twitter>, alt: "Twitter profile DefiLab", text: "Check us out on Twitter", href: "https://twitter.com/DefiLab_xyz"},
    {key:"telegram", src: <Telegram className={styles["nav-icon"]}></Telegram>, alt: "Telegram channel DefiLab", text: "Reach out on Telegram", href: "https://t.me/joinchat/uOY1GOFvnH43NzA0"},
    {key:"medium", src: <Medium className={styles["nav-icon"]}></Medium>, alt: "Medium profile DefiLab", text: "Learn more on Medium", href: "https://defi-lab.medium.com"}];

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
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleToggle = (toggleVal) => {
    setDarkModeEnabled(toggleVal)
  }

  return (
    <Grid
    rows={props.rows || 4}
    columns={props.columns || 62}
    cellAspectRatio={props.cellAspectRatio || 0.82}
    gridGap={props.gridGap || 5}
    gridWidth={props.width}
    minWidth={props.minWidth}
    >
      <h1 style={styles.title} className={props.pageStyle ? props.pageStyle['header-title'] : 'header-title'}>{props.title}</h1>
      {
        props.themeToggleHidden ? <></> : <ThemeToggle style={styles.themeToggle} handleToggle={handleToggle} themeProps={props.themeProps}></ThemeToggle>
      }
      <div style={styles.links}>
        <GitCoin></GitCoin>
        <SocialLinks></SocialLinks>
        <ERC20Donation></ERC20Donation>
        <GitHubRepo darkMode={darkModeEnabled} page={props.page}></GitHubRepo>
        <NavMenu page={props.page} pageStyle={props.pageStyle} pageid={props.pageid}></NavMenu>
       
      </div>  
      {props.children} 
   </Grid>
  )
}

const genStyles = (props) => {
  return {
    title: {
      gridColumn: "2 / span 30",
      gridRow: "1 / span 3",
      verticalAlign: "middle",
      marginTop: 20,
      display: "flex",
      alignItems: "center",
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
      gridColumn: "42 / span 4",
      gridRow: "2 / span 2",
      marginTop: 2
    }
  };
}

export default NavBar