import { useContext, useEffect, useRef, useState } from "react";
import AccountBanner from "../../Components/AccountBanner";
import { AuthContext } from "../../Database/context/AuthContext";
import styles from "./Social.module.css";

const Message = ({ message }) => {
  const { user } = useContext(AuthContext);
  const { id, username, slimePath, content } = message;
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

  return (
    <div className={`${styles.messageContainer} ${username === user.data.username ? styles.mine : ""}`}>
      <button onClick={() => setShowBanner(prev => !prev)}>
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
            data={user.data}
            bannerWidth={"19"}
            widthUnits={"vw"}
          ></AccountBanner>
        </div>
      }
    </div >
  );
}

export default Message;