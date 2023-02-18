import styles from "./Character.module.css";
import { useState } from "react";

const CharacterSelect = ({characters, switchCharacter}) => {
    const [hover, setHover] = useState(false);
    const imagePath = "";

    const handleClick= (e)=>{
        switchCharacter(e.currentTarget.getAttribute('number'));
    }

    return ( 
        <div className={styles.characterGrid}>
            {characters.map(character =>(
                <div  className = {styles.character} number = {character.id} key={character.id} onClick = {handleClick}>
                    {character.unlocked ?(
                        <img src={character.image} alt={character.type} key = {character.id}/>
                    ):(
                        <img src={"assets/GameArt/Locked.png"} alt={character.type} key = {character.id}/>
                    )}
                    <div></div>
                    
                </div>
            ))}
            
        </div>
     );
}
 
export default CharacterSelect;