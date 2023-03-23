import styles from "./EndScreen.module.css";
import slime from "/assets/GameArt/EarthSlime/EarthSlime1.gif";
import AccountBanner from "../../../Components/AccountBanner";
import { AuthContext } from "../../../Database/context/AuthContext";
import { useContext, useEffect, useRef, useState } from "react";
const PlayerBanner = ({left, winner}) => {
    const { user } = useContext(AuthContext);
    const [banner, setBanner] = useState("../../../../public/"+user.data.bannerFilepath);

    useEffect(()=>{
        console.log(user.data.bannerFilepath);
        setBanner("../../../../public/"+user.data.bannerFilepath);
        console.log(banner);

    },[])

    return ( <div styles={styles.playerBanner}>
        <div className={styles.playerBanner} 
        style={{transform: winner ? `scale(100%)`:`scale(75%)`,flexDirection: left ? `row-reverse`:`row`}}>
            <div className={styles.AccountBanner}>
                <div className={styles.bannerInfo}
                style={{backgroundImage: `url(${banner})`}}>
                <h1 className={styles.Handle}>{user.displayName}</h1> 
                <img
                src={user.data.slimePath + ".svg"}
                className={styles.character}
                ></img>              
            </div>
                        
            </div>
            <div className={styles.slime}>
                <img src={slime} alt="" />
            </div>
        </div>        
    </div> );
}
 
export default PlayerBanner;