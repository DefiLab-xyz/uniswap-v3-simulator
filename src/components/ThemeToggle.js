import { useState, useEffect } from "react";
import { ReactComponent as MoonIcon } from '../assets/moon.svg'
import { ReactComponent as SunIcon } from '../assets/sun.svg'
import styles from '../styles/modules/ThemeToggle.module.css'

const themeProperties = (mode) => {

  const styles =  {

    dark: [
      { setProperty: "--background", getProperty: "--dark"},
      { setProperty: "--foreground", getProperty: "--light"},
      { setProperty: "--semi-transparent-background", getProperty: "--semi-transparent-dark"},
      { setProperty: "--background-radial", getProperty: "--radial-gradient-dark"},
      { setProperty: "--background-linear", getProperty: "--linear-gradient-dark"},
      { setProperty: "--background-linear-2", getProperty: "--linear-gradient-dark-2"},
      { setProperty: "--font-color-bold", getProperty: "--font-color-bold-dark"},
      { setProperty: "--font-color", getProperty: "--font-color-dark"},
      { setProperty: "--outer-glow", getProperty: "--outer-glow-dark"},
      { setProperty: "--outer-glow-intense", getProperty: "--outer-glow-intense-dark"},
      { setProperty: "--inner-glow", getProperty: "--inner-glow-dark"},
      { setProperty: "--border-color", getProperty: "--border-color-dark"},
      { setProperty: "--input-border", getProperty: "--input-border-dark"},
      { setProperty: "--button-border", getProperty: "--button-border-dark"},
      { setProperty: "--button-border-selected", getProperty: "--button-border-selected-dark"},
      { setProperty: "--button-border-active", getProperty: "--button-border-active-dark"},
      { setProperty: "--button-selected-background", getProperty: "--button-selected-background-dark"},
      { setProperty: "--button-border-hover", getProperty: "--button-border-hover-dark"},
      { setProperty: "--input-background", getProperty: "--input-background-dark"},
      { setProperty: "--toggle-background", getProperty: "--toggle-background-dark"},
      { setProperty: "--dashboard-section-background", getProperty: "--dashboard-section-background-dark"},
      { setProperty: "--sidebar-sub-container-background", getProperty: "--sidebar-sub-container-background-dark"},
    ],
    light: [
      { setProperty: "--background", getProperty: "--light"},
      { setProperty: "--foreground", getProperty: "--dark"},
      { setProperty: "--semi-transparent-background", getProperty: "--semi-transparent-ligh"},
      { setProperty: "--background-radial", getProperty: "--radial-gradient-light"},
      { setProperty: "--background-linear", getProperty: "--linear-gradient-light"},
      { setProperty: "--background-linear-2", getProperty: "--linear-gradient-light-2"},
      { setProperty: "--font-color-bold", getProperty: "--font-color-bold-light"},
      { setProperty: "--font-color", getProperty: "--font-color-light"},
      { setProperty: "--outer-glow", getProperty: "--outer-glow-light"},
      { setProperty: "--outer-glow-intense", getProperty: "--outer-glow-intense-light"},
      { setProperty: "--inner-glow", getProperty: "--inner-glow-light"},
      { setProperty: "--border-color", getProperty: "--border-color-light"},
      { setProperty: "--input-border", getProperty: "--input-border-light"},
      { setProperty: "--button-border", getProperty: "--button-border-light"},
      { setProperty: "--button-border-selected", getProperty: "--button-border-selected-light"},
      { setProperty: "--button-border-active", getProperty: "--button-border-active-light"},
      { setProperty: "--button-border-hover", getProperty: "--button-border-hover-light"},
      { setProperty: "--input-background", getProperty: "--input-background-light"},
      { setProperty: "--button-selected-background", getProperty: "--button-selected-background-light"},
      { setProperty: "--toggle-background", getProperty: "--toggle-background-light"},
      { setProperty: "--dashboard-section-background", getProperty: "--dashboard-section-background-light"},
      { setProperty: "--sidebar-sub-container-background", getProperty: "--sidebar-sub-container-background-light"},
    ]
  }

  return styles[mode];
}

const updateTheme = (theme) => {
  
  const propertySettings = themeProperties(theme);

  if (propertySettings && propertySettings.length) {
    const styles = getComputedStyle(document.body);
    const docEl = document.documentElement;

    propertySettings.forEach(d => {
        const newPropertyValue = styles.getPropertyValue(d.getProperty);
        docEl.style.setProperty(d.setProperty, newPropertyValue);
    });
  }
}

const ThemeToggle = (props) => {

  const [darkIsEnabled, setDarkIsEnabled] = useState(false);

  useEffect(() => {
    if (props.handleToggle) props.handleToggle(!darkIsEnabled);
    const theme = darkIsEnabled ? 'dark' : 'light';
    updateTheme(theme);
  }, [darkIsEnabled]);

  useEffect(() => {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    if (prefersDarkScheme) {
      updateTheme('dark');
      setDarkIsEnabled(true);
    }
  }, []);

  const toggleState = () => {
    setDarkIsEnabled((prevState) => !prevState);
  };

  return (
    <div className={props.className} style={props.style}>
      <label className={styles["toggle-wrapper"]} htmlFor="toggle">
      <div className={ darkIsEnabled ? `${styles["toggle"]} ${styles["enabled"]}` : styles["toggle"]}>
        <span className={styles["hidden"]}>
          {setDarkIsEnabled ? "Enable Light Mode" : "Enable Dark Mode"}
        </span>
        <input
          id="toggle"
          name="toggle"
          type="checkbox"
          checked={setDarkIsEnabled}
          onClick={toggleState}
        />
        <div className={styles["icons"]}>
          <MoonIcon></MoonIcon>
          <SunIcon></SunIcon>
        </div>
      </div>
    </label>
    </div>
  );

}

export default ThemeToggle

