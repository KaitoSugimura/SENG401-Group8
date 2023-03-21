import styles from "./Popup.module.css"
import { useState } from "react";
const Popup = (props) => {
    return (props.popup) ?(
        <div className={styles.popup}>
            <div className={styles.inner}>
                <button className={styles.close} onClick={()=>props.setPopup(false)}>X</button>
                {props.children}
            </div>
        </div>
     ):"";
}
 
export default Popup;