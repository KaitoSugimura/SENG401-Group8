import { useContext } from "react";
import { AuthContext } from "../../Database/context/AuthContext";
import styles from "./Social.module.css";

const Message = ({ message }) => {
  const { user } = useContext(AuthContext);
  const { sender, content } = message;

  return (
    <div className={`${styles.messageContainer} ${sender.username === user.data.username ? styles.mine : ""}`}>
      <img src={`${sender.slimePath}.svg`} alt="" />
      <div className={`${sender.username === user.data.username ? styles.mine : ""}`} >
        <p className={styles.name}>{sender.username}</p>
        <p className={styles.message}>{content}</p>
      </div>
    </div>
  );
}

export default Message;