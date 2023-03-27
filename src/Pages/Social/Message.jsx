import { useCallback, useContext, useEffect, useRef, useState } from "react";
import AccountBanner from "../../Components/AccountBanner";
import { AuthContext } from "../../Database/context/AuthContext";
import { projectFirestore } from "../../Database/firebase/config";
import styles from "./Social.module.css";

const Message = ({ message, previousMessage }) => {
  const { user } = useContext(AuthContext);
  const { id, username, slimePath, content } = message;
  const [senderData, setSenderData] = useState(null);
  const [senderFriendable, setSenderFriendable] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const bannerRef = useRef(null);
  const messageRef = useRef(null);

  const [topAdjustment, setTopAdjustment] = useState(1);

  let nextMessageSame = false;
  if (previousMessage && message.id == previousMessage.id) {
    nextMessageSame = true;
  }

  const handleClickOutside = useCallback(
    (e) => {
      if (bannerRef.current && !bannerRef.current.contains(e.target)) {
        setShowBanner(false);
        document.removeEventListener("mousedown", handleClickOutside);
      }
    },
    [bannerRef]
  );

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
    // console.log("READ FROM MESSAGE");
    // Let's check if this user is friendable...
    const friendIDs = user.data.friends.map(friend => friend.id);

    // Unfriendable if this user is you 
    if (id === user.uid) {
      setSenderFriendable(false);
    }

    // Unfriendable if you're already friends with this user
    if (friendIDs.includes(id)) {
      setSenderFriendable(false);
    }

    // Unfriendable if you already sent a friend request to this user
    if (data.friendRequests.map(request => request.id).includes(user.uid)) {
      setSenderFriendable(false);
    }

    // Unfriendable if they already sent a friend request to you
    if (user.data.friendRequests.map(friend => friend.id).includes(id)) {
      setSenderFriendable(false);
    }

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
    document.addEventListener("mousedown", handleClickOutside);
  };

  return (
    <div
      ref={messageRef}
      className={`${styles.messageContainer} ${username === user.data.username ? styles.mine : ""
        } ${nextMessageSame ? styles.MessageIsSame : ""}`}
    >
      {!nextMessageSame && <button onClick={fetchBanner}>
        <img className={styles.slime} src={`${slimePath}.svg`} alt="" />
      </button>}
      <div
        className={`${username === user.data.username ? styles.mine : ""} ${styles.messageFlex
          }`}
      >
        {!nextMessageSame && <p className={styles.name}>{username}</p>}
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
            id={id}
            data={senderData}
            bannerWidth={"17"}
            widthUnits={"vw"}
            friend_able={senderFriendable}
          ></AccountBanner>
        </div>
      )}
    </div>
  );
};

export default Message;
