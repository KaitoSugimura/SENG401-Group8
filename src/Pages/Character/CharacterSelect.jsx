import styles from "./Character.module.css";
import slimeImage from "../../../public/assets/GameArt/Slime.png"
import lockedImage from "../../../public/assets/GameArt/Locked.png"

const CharacterSelect = () => {
    return ( 
        <div className={styles.imageGrid}>
            <div className={styles.imageWrapper}>
                <img src={slimeImage} alt="slime"/>
            </div>
            <div className={styles.imageWrapper}>
                <img src={slimeImage} alt="slime"/>
            </div>
            <div className={styles.imageWrapper}>
                <img src={lockedImage} alt="slime"/>
            </div>
            <div className={styles.imageWrapper}>
                <img src={lockedImage} alt="slime"/>
            </div>
            <div className={styles.imageWrapper}>
                <img src={lockedImage} alt="slime"/>
            </div>
            <div className={styles.imageWrapper}>
                <img src={lockedImage} alt="slime"/>
            </div>
        </div>
     );
}
 
export default CharacterSelect;