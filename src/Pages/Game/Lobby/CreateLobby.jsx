import { useContext, useEffect, useState } from "react";
import styles from "./Lobby.module.css";


const CreateLobby = ({setPopUp, createRoom}) => {
    const arenaTypes = ['Public', 'Private'];
    const[type, setType]=useState("public");
    const[password, setPassword]= useState("");
    const[gold,setGold]=useState(100);

    const handleSubmit = (event)=>{
        event.preventDefault();
        if(type==='public'){
            createRoom("", gold);
        }
        else if(type==='private'){
            createRoom(password, gold);
        } 
    }

    const typeHandler= (event)=>{
        const type = event.target.value;
        if(type==="Public"){
            setType("public");
            setPassword("");
        }
        else if(type==="Private"){
            setType('private');
        }
    }

    const passwordHandler=(event)=>{
        const password = event.target.value;
        setPassword(password);
    }

    const goldHandler=(event)=>{
        const gold = event.target.value;
        setGold(gold);
    }
    
    return (
        <div className={styles.createLobby}>
            <p>Lobby Settings</p>
            <form onSubmit={(e)=>{
                handleSubmit(e);
                setPopUp(false);                
            }}>
                <div className={styles.formFields}>
                    <label>Lobby Type</label>
                        <select onChange={typeHandler}>
                            {arenaTypes.map((type, index) => {
                                return <option key={index} >
                                    {type}
                                </option>
                            })}
                        </select>
                        <div>
                            <label>Gold Amount</label>
                            <input
                            type="number"
                            min={100}
                            value={gold}
                            onChange={goldHandler}
                            />
                        </div>
                        {type==='private'&&
                            <div>
                                <label>Password</label>
                                <input
                                type="text"
                                maxLength={"10"}
                                value={password}
                                onChange={passwordHandler}
                                />
                            </div>
                        }
                    
                    <div>
                    <input type="submit"/>
                    </div>
                    

                </div>
                
            </form>
        </div>
        
    );
}
 
export default CreateLobby;