import {React} from "react";
import CharacterSelect from './CharacterSelect';
import  styles from "./Character.module.css";
import slimeImage from "../../../public/assets/GameArt/Slime.png"

export default function Character() {
  return (
    <div className={styles.character}>
      <div className={styles.selectedCharacter}>
        <img src={slimeImage} alt="slime"/>
      </div>
      <CharacterSelect/>
    </div>
  )
}
