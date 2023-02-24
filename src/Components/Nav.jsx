import { useEffect, useRef } from "react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuthContext } from "../Database/Hooks/useAuthContext";
import AccountBanner from "./AccountBanner";
import styles from "./Nav.module.css";
import HomeBGM from "/Sound/Home.mp3";
import ShopBGM from "/Sound/Shop.mp3";
import CharacterBGM from "/Sound/Character.mp3";
import SocialBGM from "/Sound/Social.mp3";
import GameBGM from "/Sound/Game.mp3";

export default function Nav() {
  const locationPath = useLocation().pathname;
  const [showBanner, setShowBanner] = useState(false);
  const [musicVolume, setMusicVolume] = useState(1);
  const { user } = useAuthContext();

  const acctBanner = useRef(null);

  const audioRef = useRef();
  const playAudio = () => {
    switch (locationPath) {
      case "/":
        audioRef.current.src = HomeBGM;
        audioRef.current.volume = musicVolume * 0.7;
        break;
      case "/social":
        audioRef.current.src = SocialBGM;
        audioRef.current.volume = musicVolume * 0.7;
        break;
      case "/game":
        audioRef.current.src = GameBGM;
        audioRef.current.volume = musicVolume * 0.7;
        break;
      case "/character":
        audioRef.current.src = CharacterBGM;
        audioRef.current.volume = musicVolume * 0.8;
        break;
      case "/gacha":
        audioRef.current.src = ShopBGM;
        audioRef.current.volume = musicVolume * 0.5;
        break;
    }
    audioRef.current.play();
  };

  useEffect(() => {
    playAudio();
  }, [locationPath, musicVolume]);

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
      <audio src={HomeBGM} ref={audioRef} loop="loop"></audio>
      <h1 className={styles.logo}>A Stand in</h1>
      {user && (
        <>
          <nav>
            <ul className={styles.navLinks}>
              <li>
                <NavLink exact to="/" draggable="false">
                  <img src="/NavIcons/Home.svg"></img>
                </NavLink>
                {locationPath === "/" && (
                  <span className={styles.selectHighlight}></span>
                )}
              </li>
              <li>
                <NavLink to="/social" draggable="false">
                  <img src="/NavIcons/Social.svg"></img>
                </NavLink>
                {locationPath === "/social" && (
                  <span className={styles.selectHighlight}></span>
                )}
              </li>
              <li>
                <NavLink to="/game" draggable="false">
                  <img src="/NavIcons/Game.svg"></img>
                </NavLink>
                {locationPath === "/game" && (
                  <span className={styles.selectHighlight}></span>
                )}
              </li>
              <li>
                <NavLink to="/character" draggable="false">
                  <img src="/NavIcons/Character.svg"></img>
                </NavLink>
                {locationPath === "/character" && (
                  <span className={styles.selectHighlight}></span>
                )}
              </li>
              <li>
                <NavLink to="/gacha" draggable="false">
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
            {showBanner && (
              <AccountBanner setShowBanner={setShowBanner} />
              )}
              <button></button>
              {showBanner && <div className={styles.VolumeConfig}>
                  <p>Volume: </p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    onChange={(e) =>
                      setMusicVolume((e.target.value * 0.01).toFixed(2))
                    }
                    value={musicVolume * 100}
                  ></input>
                  <span>{Math.round(musicVolume * 100)}%</span>
                </div>}
          </div>
        </>
      )}
    </header>
  );
}
