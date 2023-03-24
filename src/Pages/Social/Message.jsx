import { useContext, useState } from "react";
import AccountBanner from "../../Components/AccountBanner";
import { AuthContext } from "../../Database/context/AuthContext";
import styles from "./Social.module.css";

const Message = ({ message }) => {
  const { user } = useContext(AuthContext);
  const { id, username, slimePath, content } = message;
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className={`${styles.messageContainer} ${username === user.data.username ? styles.mine : ""}`}>
      <div className={styles.img}>
        <img src={`${slimePath}.svg`} alt="" />
        {/* {showBanner && <AccountBanner></AccountBanner>} */}
      </div>
      <div className={`${username === user.data.username ? styles.mine : ""}`} >
        <p className={styles.name}>{username}</p>
        <p className={styles.message}>{content}</p>
      </div>
    </div>
  );
}

export default Message;