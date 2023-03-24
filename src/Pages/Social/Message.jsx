import { useContext, useEffect, useRef, useState } from "react";
import AccountBanner from "../../Components/AccountBanner";
import { AuthContext } from "../../Database/context/AuthContext";
import { projectFirestore } from "../../Database/firebase/config";
import styles from "./Social.module.css";

const Message = ({ message }) => {
  const { user } = useContext(AuthContext);
  const { id, username, slimePath, content } = message;
  const [senderData, setSenderData] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const bannerRef = useRef(null);

  // Close banner upon clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bannerRef.current && !bannerRef.current.contains(e.target)) {
        setShowBanner(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [bannerRef]);

  // After senderData is fetched (from clicking the sender's slime), show banner
  useEffect(() => {
    if (senderData) {
      setShowBanner(true);
    }
  }, [senderData])

  const fetchBanner = async () => {
    const data = await projectFirestore.collection("users").doc(id).get().then(res => res.data());
    const { slimeType, slimeSkin } = data;
    setSenderData({
      ...data,
      slimePath: `assets/GameArt/${slimeType}Slime/${slimeType}Slime${slimeSkin}`,
    });
  }

  return (
    <div className={`${styles.messageContainer} ${username === user.data.username ? styles.mine : ""}`}>
      <button onClick={fetchBanner}>
        <img src={`${slimePath}.svg`} alt="" />
      </button>
      <div className={`${username === user.data.username ? styles.mine : ""}`} >
        <p className={styles.name}>{username}</p>
        <p className={styles.message}>{content}</p>
      </div>
      {showBanner &&
        <div className={styles.AccountBannerContainer} ref={bannerRef}>
          <AccountBanner
            setShowBanner={null}
            isNavBanner={false}
            data={senderData}
            bannerWidth={"19"}
            widthUnits={"vw"}
          ></AccountBanner>
        </div>
      }
    </div >
  );
}

export default Message;