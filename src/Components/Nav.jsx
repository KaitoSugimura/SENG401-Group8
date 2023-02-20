import { useRef } from "react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuthContext } from "../Database/Hooks/useAuthContext";
import AccountBanner from "./AccountBanner";
import styles from "./Nav.module.css";

export default function Nav() {
  const locationPath = useLocation().pathname;
  const [showBanner, setShowBanner] = useState(false);
  const {user} = useAuthContext();

  const acctBanner = useRef(null);

  const closeBanner = (e) => {
    if (
      acctBanner.current &&
      showBanner &&
      !acctBanner.current.contains(e.target)
    ) {
      setShowBanner(false);
    }
  };

  document.addEventListener("click", closeBanner);

  return (
    <header className={styles.navbar}>
      <h1 className={styles.logo}>A Stand in</h1>
      {user && <><nav>
        <ul className={styles.navLinks}>
          <li>
            <NavLink exact to="/">
              <img src="/NavIcons/Home.svg"></img>
            </NavLink>
            {locationPath === "/" && (
              <span className={styles.selectHighlight}></span>
            )}
          </li>
          <li>
            <NavLink to="/social">
              <img src="/NavIcons/Social.svg"></img>
            </NavLink>
            {locationPath === "/social" && (
              <span className={styles.selectHighlight}></span>
            )}
          </li>
          <li>
            <NavLink to="/game">
              <img src="/NavIcons/Game.svg"></img>
            </NavLink>
            {locationPath === "/game" && (
              <span className={styles.selectHighlight}></span>
            )}
          </li>
          <li>
            <NavLink to="/character">
              <img src="/NavIcons/Character.svg"></img>
            </NavLink>
            {locationPath === "/character" && (
              <span className={styles.selectHighlight}></span>
            )}
          </li>
          <li>
            <NavLink to="/gacha">
              <img src="/NavIcons/Gacha.svg"></img>
            </NavLink>
            {locationPath === "/gacha" && (
              <span className={styles.selectHighlight}></span>
            )}
          </li>
        </ul>
      </nav>
      <div className={styles.rightSideNav} ref={acctBanner}>
        <span className={styles.goldAmount}>2000 Gold</span>
        <button
          onClick={() => setShowBanner(!showBanner)}
          className={styles.bannerButton}
        >
          <img src="Account/TempPFP.png"></img>
        </button>
        {showBanner && <AccountBanner />}
      </div></>}
    </header>
  );
}
