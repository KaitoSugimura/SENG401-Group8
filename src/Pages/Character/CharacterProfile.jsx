import  styles from "./Character.module.css";


const CharacterProfile = ({character}) => {
    let statContents=[]
    function getStat(stat){
        statContents = []
        for(let i =0;i<5;i++){
            if(i<stat){
                statContents.push(
                    <div className={styles.stat}></div>
                )
            }           
        }
    }
    
    return ( 
        <div className={styles.bottom}>
            <div className={styles.characterProfile}>
                <div className={styles.characterBox}>
                    <h1>{character.type} Slime</h1>
                    <div className={styles.selectedCharacter}>
                        <img src={character.image} alt={character.type}/>
                    </div>
                    <div className={styles.statsBox}>
                    <div className={styles.statsContainer}>
                        <h2>Power:</h2>
                        {getStat(character.power)}
                        {statContents}
                    </div>
                    <div className={styles.statsContainer}>
                        <h2>Speed:</h2>
                        {getStat(character.speed)}
                        {statContents}
                    </div>
                    <div className={styles.statsContainer}>
                        <h2>Health:</h2>
                        {getStat(character.health)}
                        {statContents}
                    </div>
                </div>
                </div>
            </div>
        </div>
     );
}
 
export default CharacterProfile;