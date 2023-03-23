import styles from "./EndScreen.module.css";
import slime from "/assets/GameArt/EarthSlime/EarthSlime1.gif";
import AccountBanner from "../../../Components/AccountBanner";
import { AuthContext } from "../../../Database/context/AuthContext";
import { useContext, useEffect, useRef, useState } from "react";
const PlayerBanner = ({ left, winner }) => {
  const { user } = useContext(AuthContext);
  const [banner, setBanner] = useState(
    "../../../../public/" + user.data.bannerFilepath
  );

  useEffect(() => {
    console.log(user.data.bannerFilepath);
    setBanner("../../../../public/" + user.data.bannerFilepath);
    console.log(banner);
  }, []);

  let imageDirection;
  if (winner) {
    imageDirection = {
      right: 0,
      width: `30vw`,
      top: 0,
      transform: "scaleX(-1)",
    };
  } else {
    imageDirection = { left: 0, width: `20vw`, bottom: 0 };
  }

  return (
    <div
      className={styles.playerBanner}
      style={{
        transform: winner
          ? `scale(100%) translate(-75%, -45%)`
          : `scale(75%) translate(-15%, -55%)`,
        flexDirection: left ? `row-reverse` : `row`,
      }}
    >
        <div className={styles.AB}>
      <AccountBanner
        setShowBanner={null}
        isNavBanner={false}
        user={user}
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
