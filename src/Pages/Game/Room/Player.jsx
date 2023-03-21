import styles from "./Room.module.css";
const Player = ({ number, user }) => {
  return (
    <div className={styles.player}>
      {user && (
        <>
          <h1>{user.name}</h1>
          <div className={styles.playerBox}>
            <img
              className={styles.playerBoximage}
              style={{ transform: number === 1 ? "scaleX(-1)" : "scaleX(1)" }}
              src={user.slimePath + ".gif"}
              alt={user.slimeType}
              draggable="false"
            />
          </div>
          <h2>{user.slimeType} Slime</h2>
          <h2>Rank: {user.rank}</h2>
        </>
      )}
    </div>
  );
};

export default Player;
