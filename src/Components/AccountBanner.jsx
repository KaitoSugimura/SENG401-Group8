import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../Database/context/AuthContext";
import { projectFirestore } from "../Database/firebase/config";
import { useLogout } from "../Database/Hooks/useLogout";
import styles from "./AccountBanner.module.css";
import Banner from "./Banner";
import Popup from "./Popup";
import firebase from "firebase";
import BD from "./banners";

export default function AccountBanner({
  setShowBanner,
  isNavBanner,
  id,
  data,
  bannerWidth,
  widthUnits,
  friend_able = false,
}) {
  const { logout } = useLogout();
  const { userRef } = useContext(AuthContext);
  const [bSelectionOn, setBSelectionOn] = useState(false);
  const [banner, setBanner] = useState(data.bannerFilepath);
  const [message, setMessage] = useState(data.message);
  const [editable, setEditable] = useState(false);
  const [tempBannerIndex, setTempBannerIndex] = useState(
    data.bannerFilepath
  );
  const [sentRequest, setSentRequest] = useState(false);

  const width = window.innerWidth * 0.4;
  const widthStep = window.innerWidth * 0.025;

  const [refresh, setRefresh] = useState(Date.now());

  const scrollPane = useRef(null);

  const {bannersData} = BD;

  const unlockAllBannersHack = () => {
    userRef.update({ bannerUnlocked: 0b1111111111111111111111111111 });
  }

  const changeBanner = (bannerPath) => {
    userRef.update({ bannerFilepath: bannerPath });
    setBanner(bannerPath);
  };

  const changeMessage = (newMessage) => {
    userRef.update({ message: newMessage });
    setMessage(newMessage);
  };

  const messageHandler = (event) => {
    const message = event.target.value;
    setMessage(message);
  }

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    changeMessage(message);
    setEditable(false);
  }

  const handleMessageEdit = () => {
    if (!editable && isNavBanner) {
      setEditable(true);
    }

  }

  useEffect(() => {
    setInterval(() => {
      setRefresh(Date.now());
    }, 300);
  }, []);

  let centerIndex;
  if (scrollPane.current) {
    const maxScrollTop =
      scrollPane.current.scrollHeight - scrollPane.current.clientHeight;
    const scrollRatio = scrollPane.current.scrollTop / maxScrollTop;
    centerIndex = Math.floor(bannersData.length * scrollRatio);
  }

  return (
    <div
      className={styles.thisBannerRoot}
      style={{
        width: bannerWidth + widthUnits,
        height: bannerWidth * 1.35 + widthUnits,
      }}
    >
      <div className={styles.bannerInfo}>
        <h1
          className={styles.Handle}
          style={{ fontSize: bannerWidth / 12 + widthUnits }}
        >
          {data.username}
        </h1>
        {isNavBanner && (
          <div
            className={styles.editBannerButton}
            onClick={() => {
              setBSelectionOn(true);
            }}
          >
            <img src="/Account/editBanner.png" alt="" />
          </div>
        )}
        {friend_able && (
          <div className={`${styles.Friend} ${sentRequest ? styles.sentRequest : ''}`} onClick={() => {
            // Code for friending the user
            // the user variable contains the person so you can use that
            projectFirestore.collection("users").doc(id).update({
              friendRequests: firebase.firestore.FieldValue.arrayUnion(userRef)
            });
            setSentRequest(true);
          }}><img src="/Account/addFriend.png" alt="" /></div>
        )}
      </div>

      <img
        src={data.slimePath + ".svg"}
        className={styles.character}
      ></img>
      <p
        className={styles.Rank}
        style={{ fontSize: bannerWidth / 15 + widthUnits }}
      >
        RP: {data.rankPoints}
      </p>



      <img src={banner} className={styles.banner}></img>

      {<p
        className={styles.Status}
        style={{ fontSize: bannerWidth / 17 + widthUnits }}
        onClick={(e) => { handleMessageEdit(e) }}
      >
        {message}
      </p>}
      {isNavBanner && (
        <button
          className={styles.SignOut}
          onClick={() => {
            if (setShowBanner) setShowBanner(false);
            logout();
          }}
        >
          Sign out
        </button>
      )}
      {editable && <Popup setPopUp={setEditable}>
        <div className={styles.messageContainer}>
          <label>Update Profile Message</label>
          <form className={styles.updateMessage} onSubmit={(e) => { handleMessageSubmit(e) }}>
            <textarea
              value={message}
              cols="80"
              rows="10"
              onChange={(e) => { messageHandler(e) }} />
            <input className={styles.submit} type="submit" />
          </form>

        </div>

      </Popup>}
      {isNavBanner && (
        <div
          className={`${styles.bannerSelectionContainer} ${bSelectionOn ? styles.ShowBannerSelection : ""
            }`}
        >
          <div className={styles.bannerOptions} ref={scrollPane}>
            <img
              src={bannersData[tempBannerIndex]}
              className={styles.backgroundBanner}
            ></img>
            {bannersData.map((bannerx, index) => (
              <Banner
                index={index}
                banner={bannerx}
                setBanner={changeBanner}
                banners={bannersData}
                centerIndex={centerIndex}
                width={width}
                widthStep={widthStep}
                setTempBannerIndex={setTempBannerIndex}
                isLocked={((data.bannerUnlocked >> index) & 1) === 0}
                key={index}
              ></Banner>
            ))}
            <button onClick={unlockAllBannersHack} className={styles.unlockAllBannersHack}>Unlock all banners hack</button>
          </div>
          <button
            className={styles.bannerSelectionExit}
            onClick={() => {
              setBSelectionOn(false);
            }}
          >
            X
          </button>
        </div>
      )}


    </div>
  );
}
