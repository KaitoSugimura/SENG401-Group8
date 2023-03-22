import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../Database/context/AuthContext";
import { useLogout } from "../Database/Hooks/useLogout";
import styles from "./AccountBanner.module.css";
import Banner from "./Banner";
import { projectAuth, projectFirestore } from "../Database/firebase/config";
import firebase from "firebase";

export default function AccountBanner({ setShowBanner, isNavBanner }) {
  const { logout } = useLogout();
  const [userRef, setUserRef] = useState(null);
  const { user } = useContext(AuthContext);
  const [bSelectionOn, setBSelectionOn] = useState(false);
  const [banner, setBanner] = useState(user.data.bannerFilepath);

  const width = window.innerWidth * 0.4;
  const widthStep = window.innerWidth * 0.02;

  const [refresh, setRefresh] = useState(Date.now());

  const scrollPane = useRef(null);

  const [banners, setBanners] = useState([
    "/Account/Banners/Adventurer.jpg",
    "/Account/Banners/Awe Inspiring Aurora.jpg",
    "/Account/Banners/Bed of Flowers.jpg",
    "/Account/Banners/Brain Power.jpg",
    "/Account/Banners/Everlasting Expanse.jpg",
    "/Account/Banners/Formidable Forest.jpg",
    "/Account/Banners/Gradient Sunset.jpg",
    "/Account/Banners/Green in the Gray.jpg",
    "/Account/Banners/Head in the Clouds.jpg",
    "/Account/Banners/Inception.jpg",
    "/Account/Banners/Interstellar.jpg",
    "/Account/Banners/Jovial Jungle.jpg",
    "/Account/Banners/Lush Leaves.jpg",
    "/Account/Banners/Magical Mountains.jpg",
    "/Account/Banners/Michelangelo.jpg",
    "/Account/Banners/Mist Mountain.jpg",
    "/Account/Banners/Scenic Solitude.jpg",
    "/Account/Banners/Sea of Serenity.jpg",
    "/Account/Banners/Sky.jpg",
    "/Account/Banners/Submerged Sunlight.jpg",
    "/Account/Banners/Time for Reflection.jpg",
    "/Account/Banners/Tranquil Tide.jpg",
    "/Account/Banners/Tranquility of Gaia.jpg",
    "/Account/Banners/Tree of Wisdom.jpg",
    "/Account/Banners/Tyndalls Trees.jpg",
    "/Account/Banners/Winter Wonderland.jpg",

  ]);

  useEffect(() => {
    const userRef = projectFirestore.collection("users").doc(user.uid);
    setUserRef(userRef);
  }, []);

  const changeBanner = (bannerPath) => {
    userRef.update({ bannerFilepath: bannerPath });
    setBanner(bannerPath);
  };

  useEffect(() => {
    setInterval(() => {
      setRefresh(Date.now());
    }, 300);
  }, []);

  let centerIndex;
  if (scrollPane.current) {
    const maxScrollTop =
      scrollPane.current.scrollHeight - scrollPane.current.clientHeight;
    const scrollRatio = scrollPane.current.scrollTop / maxScrollTop;
    centerIndex = Math.floor(banners.length * scrollRatio);
  }

  return (
    <div className={styles.AccountBanner}>
      <div className={styles.bannerInfo}>
        <h1 className={styles.Handle}>{user.displayName}</h1>
        {isNavBanner && (
          <div
            className={styles.editBannerButton}
            onClick={() => {
              setBSelectionOn(true);
            }}
          >
            <img src="/Account/editBanner.png" alt="" />
          </div>
        )}
      </div>

      <img
        src={user.data.slimePath + ".svg"}
        className={styles.character}
      ></img>
      <p className={styles.Rank}>Rank: {user.data.rank}</p>
      <p className={styles.Status}>
        Hello my name is {user.displayName}. I'm not a bad Slime!
      </p>
      {isNavBanner && (
        <button
          className={styles.SignOut}
          onClick={() => {
            if (setShowBanner) setShowBanner(false);
            logout();
          }}
        >
          Sign out
        </button>
      )}

      <img src={banner} className={styles.banner}></img>

      {isNavBanner && (
        <div
          className={`${styles.bannerSelectionContainer} ${
            bSelectionOn ? styles.ShowBannerSelection : ""
          }`}
        >
          <div
            className={styles.bannerOptions}
            ref={scrollPane}
          >
            <img src={banner} className={styles.backgroundBanner}></img>
            {banners.map((bannerx, index) => (
              <Banner
                index={index}
                banner={bannerx}
                setBanner={changeBanner}
                banners={banners}
                centerIndex={centerIndex}
                width={width}
                widthStep={widthStep}
                key={index}
              ></Banner>
            ))}
          </div>
          <button
            className={styles.bannerSelectionExit}
            onClick={() => {
              setBSelectionOn(false);
            }}
          >
            X
          </button>
        </div>
      )}
    </div>
  );
}
