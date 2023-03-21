import styles from "./Room.module.css";
const Player = ({number, user}) => {
    return ( 
    <div className={styles.player}>
        <h1>{user.displayName}</h1>
        <div className={styles.playerBox}>
            <img className={styles.playerBoximage} 
            style ={{transform: number === 1 ? 'scaleX(-1)':'scaleX(1)'}}
            src={user.data.slimePath+".gif"} 
            alt={user.data.slimeType} draggable="false" />
        </div>
        <h2>{user.data.slimeType} Slime</h2>
        <h2>Rank: {user.data.rank}</h2>
    </div> 
    );
}
 
export default Player;