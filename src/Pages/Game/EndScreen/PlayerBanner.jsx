import styles from "./EndScreen.module.css";
import slime from "/assets/GameArt/EarthSlime/EarthSlime1.gif";
import AccountBanner from "../../../Components/AccountBanner";
import { AuthContext } from "../../../Database/context/AuthContext";
import { useContext, useEffect, useRef, useState } from "react";
const PlayerBanner = ({ left, winner, userData}) => {
  const [banner, setBanner] = useState(
    "../../../../public/" + userData.bannerFilepath
  );

  useEffect(() => {
    console.log(userData.bannerFilepath);
    setBanner("../../../../public/" + userData.bannerFilepath);
    console.log(banner);
  }, []);

  let bannerStyles;
  if(winner&&left){
    bannerStyles={
      transform: `scale(100%) translate(-75%, -40%)`,
      flexDirection: `row-reverse`,
      gap:`2vw`,
    }
  }
  else if(!winner&&left){
    bannerStyles={
      transform: `scale(75%) translate(-112%, -48%)`,
      flexDirection: `row-reverse`,
      gap:`2vw`,
    }
  }
  else if(winner&&!left){
    bannerStyles={
      transform: `scale(100%) translate(-20%, -40%)`,
      flexDirection: `row`,
      gap:`2vw`,
    }
  }
  else if(!winner&&!left){
    bannerStyles={
      transform: `scale(75%) translate(-15%, -50%)`,
      flexDirection: `row`,
      gap:`2vw`,
    }
  }

  let imageDirection;
  if (winner&&left) {
    imageDirection = {
      right: 0,
      width: `25vw`,
      top: "10vh",
      transform: "scaleX(-1)",
      filter: `drop-shadow(30px 20px 5px #000)`,
    };
  }
  else if(winner&&!left){
    imageDirection = {
      left:0,
      width:`25vw`,
      top: "10vh",
      transform: "scaleX(1)",
      filter: `drop-shadow(30px 20px 5px #000)`,
    };
  }
  else if(!winner&&left){
    imageDirection = {
      right:0,
      width:`15vw`,
      top: '25vh',
      transform: "scaleX(-1)",
      filter: `drop-shadow(30px 20px 5px #000)`,
    };
  }
  else if(!winner&&!left){
    imageDirection = { left: 0, 
    width: `15vw`, 
    top: '28vh',
    transform: "scaleX(1)",
    filter: `drop-shadow(30px 20px 5px #000)`, };
  }

  return (
    <div
      className={styles.playerBanner}
      style={bannerStyles}
    >
      <div className={styles.AB}>
        <AccountBanner
          setShowBanner={null}
          isNavBanner={false}
          data={userData}
          bannerWidth={"19"}
          widthUnits={"vw"}
          friend_able={!left}
        ></AccountBanner></div>
      <div className={styles.slime}>
        <img src={`assets/GameArt/${userData.slimeType}Slime/${userData.slimeType}Slime${userData.slimeSkin}.gif`} alt="" style={imageDirection} />
      </div>
    </div>
  );
};

export default PlayerBanner;
