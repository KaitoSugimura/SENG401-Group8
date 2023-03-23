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
  if(winner){
    imageDirection = {right: 0, width: winner ? `30vw` : `20vw`};
  } else{
    imageDirection = {right: 0, width: winner ? `30vw` : `20vw`};
  }

  return (
    <div
      className={styles.playerBanner}
      style={{
        transform: winner ? `scale(100%) translate(-80%, -50%)` : `scale(75%) translate(-10%, -60%)`,
        flexDirection: left ? `row-reverse` : `row`,
        // width: winner ? `60vw` : `40vw`,
      }}
    >
      <AccountBanner
        setShowBanner={null}
        isNavBanner={false}
        user={user}
        width={"max-content"}
        height={"max-content"}
      ></AccountBanner>
      <div className={styles.slime}>
        <img src={slime} alt="" style={imageDirection}/>
      </div>
    </div>
  );
};

export default PlayerBanner;
