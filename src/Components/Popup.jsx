import styles from "./Popup.module.css"
import { useState } from "react";
const Popup = ({children,setPopUp}) => {
    return (
        <div className={styles.popup}>
            <div className={styles.inner}>
                <button className={styles.close} onClick={()=>setPopUp(false)}>X</button>
                <div>{children}</div>
                
            </div>
            
        </div>
        
     );
}
 
export default Popup;