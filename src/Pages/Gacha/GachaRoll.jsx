import { useContext, useRef, useState } from "react";
import styles from "./GachaRoll.module.css"
import { AuthContext } from "../../Database/context/AuthContext";
import Popup from "../../Components/Popup";

export default function GachaRoll() {
    const { user} = useContext(AuthContext);
    const [showPopup, setPopup] = useState(false);
    const [showRollRequest, setRollRequest] = useState(false);
    const [enough, setEnough] = useState(false);
    const [price, setPrice] = useState();
    const [rolls, setRolls] = useState();

    const confirmRequest = (price, rolls) => {
        if (user.data.gold >= price) {
          setEnough(true);
        } else if (user.data.gold >= price) {
          setEnough(true);
        } else {
          setEnough(false);
        }
        setPrice(price);
        if (price == 100){
            setRolls(rolls);
        }else if (price == 900){
            setRolls(rolls);
        }
    };

    return (
        <div className={styles.rollDiv}>
        <button className={styles.rollButton} onClick={() => {
            confirmRequest(100, 1);
            setPopup(true);
        }}>
        Roll x 1
        <br></br>
        100 Gold 
        </button>
        <button className={styles.rollButton} onClick={() => {
            confirmRequest(900, 10);
            setPopup(true);
        }}>
        Roll x 10
        <br></br>
        900 Gold 
        </button>
        {showPopup && (        
            <Popup setPopUp={setPopup}>
                <div className={styles.popupBanner}>
                    <p>
                    {enough
                        ? rolls > 1
                            ?`Unlock ${rolls} Rolls for ${price} Gold?`
                            :`Unlock ${rolls} Roll for ${price} Gold?`
                        : `Missing ${price-user.data.gold}`}
                    </p>
                    {enough && (
                    <button className={styles.rollButton}
                        onClick={() => {
                            setPopup(false);
                            setRollRequest(true);
                        }}
                    >
                        Confirm
                    </button>
                    )}
                </div>
            </Popup>
        )}
        {showRollRequest && (
            <Popup setPopUp={setRollRequest}>
                <div className={styles.popupBanner}>
                    <button className={styles.rollButton}
                        onClick={() => {
                            setRolls(rolls-1);
                            if (rolls > 1){
                                setRollRequest(false);
                                setRollRequest(true);
                            }else{
                                setRollRequest(false);
                            }
                        }}
                    >
                        Confirm
                    </button>
                </div>
            </Popup>
        )}
        </div>

    );
}