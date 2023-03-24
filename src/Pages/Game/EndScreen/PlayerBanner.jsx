import styles from "./EndScreen.module.css";
import slime from "/assets/GameArt/EarthSlime/EarthSlime1.gif";
import AccountBanner from "../../../Components/AccountBanner";
import { AuthContext } from "../../../Database/context/AuthContext";
import { useContext, useEffect, useRef, useState } from "react";
const PlayerBanner = ({ left, winner}) => {
  const { user } = useContext(AuthContext);
  const [banner, setBanner] = useState(
    "../../../../public/" + user.data.bannerFilepath
  );

  useEffect(() => {
    console.log(user.data.bannerFilepath);
    setBanner("../../../../public/" + user.data.bannerFilepath);
    console.log(banner);
  }, []);

  let bannerStyles;
  if(winner&&left){
    bannerStyles={
      transform: `scale(100%) translate(-75%, -45%)`,
      flexDirection: `row-reverse`
    }
  }
  else if(!winner&&left){
    bannerStyles={
      transform: `scale(75%) translate(-108%, -60%)`,
      flexDirection: `row-reverse`
    }
  }
  else if(winner&&!left){
    bannerStyles={
      transform: `scale(100%) translate(-20%, -45%)`,
      flexDirection: `row`
    }
  }
  else if(!winner&&!left){
    bannerStyles={
      transform: `scale(75%) translate(-15%, -55%)`,
      flexDirection: `row`,
    }
  }

  let imageDirection;
  if (winner&&left) {
    imageDirection = {
      right: 0,
      width: `30vw`,
      top: 0,
      transform: "scaleX(-1)",
    };
  }
  else if(winner&&!left){
    imageDirection = {
      left:0,
      width:`30vw`,
      top:0,
      transform: "scaleX(1)",
    };
  }
  else if(!winner&&left){
    imageDirection = {
      right:0,
      width:`20vw`,
      bottom:0,
    };
  }
  else if(!winner&&!left){
    imageDirection = { left: 0, width: `20vw`, bottom: 0 };
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
          data={user.data}
          bannerWidth={"19"}
          widthUnits={"vw"}
          friend_able={!left}
        ></AccountBanner></div>
      <div className={styles.slime}>
        <img src={slime} alt="" style={imageDirection} />
      </div>
    </div>
  );
};

export default PlayerBanner;
