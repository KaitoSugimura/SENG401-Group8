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
  const messageRef = useRef(null);

  const [topAdjustment, setTopAdjustment] = useState(1);

  // Close banner upon clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bannerRef.current && !bannerRef.current.contains(e.target)) {
        setShowBanner(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [bannerRef]);

  // After senderData is fetched (from clicking the sender's slime), show banner
  useEffect(() => {
    if (senderData) {
      setShowBanner(true);
    }
  }, [senderData]);

  const fetchBanner = async () => {
    const data = await projectFirestore
      .collection("users")
      .doc(id)
      .get()
      .then((res) => res.data());
    const { slimeType, slimeSkin } = data;
    setSenderData({
      ...data,
      slimePath: `assets/GameArt/${slimeType}Slime/${slimeType}Slime${slimeSkin}`,
    });

    if (messageRef.current) {
      const messageRect = messageRef.current.getBoundingClientRect();
      const possibleTopAdjustment =
        window.innerHeight - messageRect.top - window.innerWidth / 3.6;
      if (possibleTopAdjustment < 0) {
        setTopAdjustment(possibleTopAdjustment);
      }
    }
  };

  return (
    <div
      ref={messageRef}
      className={`${styles.messageContainer} ${
        username === user.data.username ? styles.mine : ""
      }`}
    >
      <button onClick={fetchBanner}>
        <img src={`${slimePath}.svg`} alt="" />
      </button>
      <div
        className={`${username === user.data.username ? styles.mine : ""} ${
          styles.messageFlex
        }`}
      >
        <p className={styles.name}>{username}</p>
        <p className={styles.message}>{content}</p>
      </div>
      {showBanner && (
        <div
          className={styles.AccountBannerContainer}
          ref={bannerRef}
          style={{
            top: topAdjustment + "px",
          }}
        >
          <AccountBanner
            setShowBanner={null}
            isNavBanner={false}
            data={senderData}
            bannerWidth={"17"}
            widthUnits={"vw"}
          ></AccountBanner>
        </div>
      )}
    </div>
  );
};

export default Message;
