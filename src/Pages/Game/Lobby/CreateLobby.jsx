import { useContext, useEffect, useState } from "react";
import styles from "./Lobby.module.css";
const CreateLobby = () => {
    const[type, setType]=useState("");

    const handleSubmit = (event)=>{
        event.preventDefault();
        alert(`name entered was: ${type}`);
    }
    return (
        <div className={styles.createLobby}>
            <form onSubmit={handleSubmit}>
                <label>Lobby Type
                    <input type="text"
                    value ={type} 
                    onChange={(e)=> setType(e.target.value)}/>
                </label>
                <input type="submit" />
            </form>
        </div>
        
    );
}
 
export default CreateLobby;