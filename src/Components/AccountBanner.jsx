import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Database/context/AuthContext";
import { useLogout } from "../Database/Hooks/useLogout";
import styles from "./AccountBanner.module.css"
import Banner from "./Banner";
import { projectAuth, projectFirestore } from "../Database/firebase/config";
import firebase from "firebase";


export default function AccountBanner({ setShowBanner, isNavBanner }) {
  const { logout } = useLogout();
  const [userRef, setUserRef]=useState(null);
  const { user } = useContext(AuthContext);
  const [bSelectionOn, setBSelectionOn] = useState(false);
  const [banner, setBanner]=useState(user.data.bannerFilepath);

  const[banners,setBanners]=useState([
    "/Account/Banners/Sky.jpg",
    "/Account/Banners/cloudyMountains.jpg",
    "/Account/Banners/Sky.jpg",
    "/Account/Banners/cloudyMountains.jpg",
    "/Account/Banners/Sky.jpg",
    "/Account/Banners/Sky.jpg",
    "/Account/Banners/Sky.jpg",
    "/Account/Banners/cloudyMountains.jpg",
    "/Account/Banners/Sky.jpg",
  ]);

  useEffect(()=>{
    const userRef= projectFirestore.collection("users").doc(user.uid);
    setUserRef(userRef);
  },[]);

  const changeBanner=(bannerPath)=>{
    userRef.update({bannerFilepath: bannerPath});
    setBanner(bannerPath);
  }

  return (
    <div className={styles.AccountBanner} >
      <div className={styles.bannerInfo}>
        <h1 className={styles.Handle}>{user.displayName}</h1>
        {isNavBanner && <div className={styles.editBannerButton} onClick={()=>{setBSelectionOn(true)}}>
          <img src="/Account/editBanner.png" alt="" />
        </div> }     

      </div>
            
      <img src={user.data.slimePath+".svg"} className={styles.character}></img>
      <p className={styles.Rank}>Rank: {user.data.rank}</p>
      <p className={styles.Status}>Hello my name is {user.displayName}. I'm not a bad Slime!</p>
      {isNavBanner && <button className={styles.SignOut} onClick={() => { if (setShowBanner) setShowBanner(false); logout() }}>Sign out</button>}

      <img src={banner} className={styles.banner} ></img>
      
      {isNavBanner && <div className={`${styles.bannerSelectionContainer} ${bSelectionOn ? styles.ShowBannerSelection : ""}`}>
        <div className={styles.bannerOptions} style={{backgroundImage: `url(${banner})`}}>
          
          {banners.map((bannerx, index)=>(
            <Banner index = {index} banner={bannerx} setBanner={changeBanner} banners={banners}></Banner>
          ))}
        </div>
        <button className={styles.bannerSelectionExit} onClick={() => { setBSelectionOn(false); }}>X</button>
      </div>}
    </div>
  )
}
