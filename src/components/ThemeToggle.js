/*
   * Credit for this toggle component goes to Ryan Finni:
   * https://letsbuildui.dev/articles/building-a-dark-mode-theme-toggle
*/

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
      { setProperty: "--input-background", getProperty: "--input-background-dark"},
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
      { setProperty: "--input-background", getProperty: "--input-background-light"},
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
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const theme = isEnabled ? 'light' : 'dark';
    updateTheme(theme);
    //  updateTheme('dark');
  }, [isEnabled]);

  const toggleState = () => {
    setIsEnabled((prevState) => !prevState);
  };

  return (
    <div className={props.className} style={props.style}>
      <label className={styles["toggle-wrapper"]} htmlFor="toggle">
      <div className={`${styles["toggle"]} ${isEnabled ? styles["enabled"] : styles["disabled"]}`}>
        <span className={styles["hidden"]}>
          {isEnabled ? "Enable Light Mode" : "Enable Dark Mode"}
        </span>
        <input
          id="toggle"
          name="toggle"
          type="checkbox"
          checked={isEnabled}
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

