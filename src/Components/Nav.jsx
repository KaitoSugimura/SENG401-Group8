import { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import AccountBanner from "./AccountBanner";
import styles from "./Nav.module.css";
import HomeBGM from "/Sound/Home.mp3";
import ShopBGM from "/Sound/Shop.mp3";
import CharacterBGM from "/Sound/Character.mp3";
import SocialBGM from "/Sound/Social.mp3";
import GameBGM from "/Sound/Game.mp3";
import BattleBGM from "/Sound/Battle.mp3";
import { AuthContext } from "../Database/context/AuthContext";
import { gameStateContext } from "../Pages/Game/gameStateContext";



export default function Nav() {
  const { user } = useContext(AuthContext);
  const locationPath = useLocation().pathname;
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [musicVolume, setMusicVolume] = useState(user.data.musicVolume); // Turned off music vol for now
  const [originalMusicVolMultiplier, setOriginalMusicVolMultiplier] =
    useState(1);
  const {gameState} = useContext(gameStateContext);
  const acctBanner = useRef(null);

  const audioRef = useRef();
  const playAudio = () => {
    switch (locationPath) {
      case "/":
        audioRef.current.src = HomeBGM;
        setOriginalMusicVolMultiplier(0.7);
        break;
      case "/social":
        audioRef.current.src = SocialBGM;
        setOriginalMusicVolMultiplier(0.6);
        break;
      case "/game":
        if(gameState === "Battle"){
          audioRef.current.src = BattleBGM;
        } else{
          audioRef.current.src = GameBGM;
        }
        setOriginalMusicVolMultiplier(0.7);
        break;
      case "/character":
        audioRef.current.src = CharacterBGM;
        setOriginalMusicVolMultiplier(0.7);
        break;
      case "/gacha":
        audioRef.current.src = ShopBGM;
        setOriginalMusicVolMultiplier(0.4);
        break;
    }
    audioRef.current.play();
  };

  useEffect(() => {
    playAudio();
  }, [locationPath, gameState]);

  useEffect(() => {
    audioRef.current.volume = musicVolume * originalMusicVolMultiplier;
  }, [musicVolume, originalMusicVolMultiplier]);

  const closeBanner = (e) => {
    if (acctBanner.current && !acctBanner.current.contains(e.target)) {
      if (showBanner) setShowBanner(false);
      if (showSettings) setShowSettings(false);
    }
  };

  document.addEventListener("click", closeBanner);

  return (
    <header className={styles.navbar}>
      <audio src={HomeBGM} ref={audioRef} loop="loop"></audio>
      <h1 className={styles.logo}>I'm Slime</h1>
      {user && (
        <>
          <nav>
            <ul className={styles.navLinks}>
              <li>
                <NavLink to="/" draggable="false">
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
        </>
      )}
      <div className={styles.rightSideNav} ref={acctBanner}>
        {user && (
          <>
            <span className={styles.goldAmount}>{user.data.gold} Gold</span>

            <button
              onClick={() => {
                setShowSettings(false);
                setShowBanner(!showBanner);
              }}
              className={styles.bannerButton}
            >
              <img src={user.data.slimePath+".svg"}></img>
            </button>
            {showBanner && <AccountBanner setShowBanner={setShowBanner} isNavBanner={true} />}
          </>
        )}

        <button
          onClick={() => {
            setShowBanner(false);
            setShowSettings(!showSettings);
          }}
          className={styles.setting}
        >
          <img src="/NavIcons/Settings.svg"></img>
        </button>

        {showSettings && (
          <div className={styles.VolumeConfig}>
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
          </div>
        )}
      </div>
    </header>
  );
}
