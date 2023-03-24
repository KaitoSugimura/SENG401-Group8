import styles from "./Home.module.css";
import animation from "./HomeSlimeAnimations.module.css";
import chestOpen from "/assets/HomeIcons/chestOpen.png";
import chestClosed from "/assets/HomeIcons/chestClosed.png";
import achievement from "/assets/HomeIcons/achievement.png";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Database/context/AuthContext";
import firebase from "firebase";
import { projectAuth, projectFirestore } from "../../Database/firebase/config";

const particleAmount = 60;
const rows = [];
for (var i = 0; i < particleAmount; i++) {
  const op = Math.random();
  const randSize = Math.random() * 20 + 5;
  const particlesStyle = {
    opacity: op,
    left: `${Math.random() * 100}vw`,
    width: `${randSize}px`,
    height: `${randSize}px`,
    animationTimingFunction: "ease-in-out",
    animationDuration: Math.random() * 8 + 2 + "s",
    animationDelay: Math.random() * 3 + "s",
    animationIterationCount: "infinite",
    animationDirection: "normal",
    animationFillMode: "forwards",
  };
  rows.push(
    <div className={styles.Particles} key={i} style={particlesStyle}></div>
  );
}

const animations = [
  animation.applyHorizontalShake,
  animation.applyVerticalShake,
  animation.applyVerticalSquish,
  animation.applyShrink,
];

export default function Home() {
  const [petted, setPetted] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();
  const { user, userRef } = useContext(AuthContext);

  const chestAvailable = user.data.daysSinceLastChest > 1;

  const openChest = async () => {
    console.log("ASDF");
    console.log(user.data.daysSinceLastChest);
    if (chestAvailable) {

      await userRef.update({
        gold: firebase.firestore.FieldValue.increment(50),
        chestLastOpenedOn: firebase.firestore.Timestamp.now(),
      });
    }
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const newLeaderboard = [];

      const querySnapshot = await projectFirestore
        .collection("users")
        .orderBy("rankPoints", "desc")
        .limit(5)
        .get();
      querySnapshot.forEach((doc) => {
        newLeaderboard.push({
          username: doc.data().username,
          rankPoints: doc.data().rankPoints,
        });
      });

      setLeaderboard(newLeaderboard);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className={styles.Home}>
      <div className={styles.MainBanner}>
        <div className={styles.MBNameLevelContainer}>
          <p className={styles.MBName}>{user.displayName}</p>
          <p className={styles.MBLevel}>{user.data.level}</p>
        </div>
        <hr />
        <p className={styles.MBRank}>RankPoints: {user.data.rankPoints}</p>
      </div>
      <button
        onClick={(event) => {
          setPetted(true);
          setTimeout(() => {
            setPetted(false);
          }, 1001);
        }}
        disabled={petted}
      >
        <img
          src={user.data.slimePath + ".svg"}
          className={`${styles.characterIMG} ${petted
            ? animations[Math.floor(Math.random() * animations.length)]
            : ""
            }`}
          alt="slime"
          draggable="false"
        />
      </button>

      <div className={styles.tabs}>
        <div className={styles.tabsIcon}>
          <p>Daily Login</p>
          <div className={styles.sideIcons} onClick={openChest}>
            <img
              src={chestAvailable ? chestClosed : chestOpen}
              className={styles.dailyChest}
              alt="Daily chest click to open"
              draggable="false"
            />
          </div>
        </div>
        <div className={styles.tabsIcon}>
          <p>Achievements</p>
          <div className={styles.sideIcons}>
            <img
              src={achievement}
              className={styles.achivementsIcon}
              alt="Achievements"
              draggable="false"
            />
          </div>
        </div>
      </div>

      {/* Rankings */}
      <div className={styles.RankingsContainer}>
        <p>Rankings:</p>
        <ol>
          {leaderboard.map((user, i) => (
            <li key={i}>
              {user.username} [{user.rankPoints}]
            </li>
          ))}
        </ol>
      </div>

      {/* Play banner */}
      <button
        className={styles.PlayButton}
        onClick={() => {
          navigate("/game");
        }}
      >
        PLAY
      </button>

      <div className={styles.ParticlesWrap}>{rows}</div>
    </div >
  );
}
