import styles from "./Character.module.css";

const CharacterProfile = ({ character }) => {
  function getStat(stat) {
    let statContents = [];
    for (let i = 0; i < 5; i++) {
      if (i < stat) {
        statContents.push(<div className={styles.stat}></div>);
      }
    }
    return statContents;
  }

  return (
    <div className={styles.bottom}>
      <div className={styles.characterProfile}>
        <div className={styles.characterBox}>
          <div className={styles.selectedCharacter}>
            <img
              src={"assets/GameArt/" + character.type+"Slime/"+character.type + "Slime.gif"}
              alt={character.type}
            />
          </div>
          <div className={styles.statsBox}>
          <h1>{character.type} Slime</h1>
            <div className={styles.statsContainer}>
              <h2>Power:</h2>
              {getStat(character.power)}
            </div>
            <div className={styles.statsContainer}>
              <h2>Speed:</h2>
              {getStat(character.speed)}

            </div>
            <div className={styles.statsContainer}>
              <h2>Health:</h2>
              {getStat(character.health)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterProfile;
