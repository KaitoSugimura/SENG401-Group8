import { useContext, useState } from "react";
import styles from "./GachaRoll.module.css"
import { AuthContext } from "../../Database/context/AuthContext";
import Popup from "../../Components/Popup";
import CD from "../../Database/JsxData/characters"
import skinShardImg from "/assets/GameArt/SkinShard.png";
import characterShardImg from "/assets/GameArt/CharacterShard.png";
import BD from "../../Components/banners";

export default function GachaRoll() {
    const { user, userRef} = useContext(AuthContext);
    const [showPopup, setPopup] = useState(false);
    const [showRollRequest, setRollRequest] = useState(false);
    const [enough, setEnough] = useState(false);
    const [price, setPrice] = useState();
    const [rolls, setRolls] = useState();
    let {charactersData} = CD;
    const [characters, setCharacters] = useState(charactersData);
    let {bannersData} = BD;
    const [rollText, setRollText] = useState();
    const [rollImage, setRollImage] = useState();

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

    function updateGold(price){
        let newGold = user.data.gold - price;
        userRef.update({
        gold: newGold
        });
    };

    function processRoll(){
        let roll = Math.random() * 100; 
        let skinOdds = 5; 
        let bannerOdds = 15; 
        let skinShardOdds = 40;
        roll -= skinOdds; 
        if (roll <= 0){
            processSkin();
            return;
        }
        roll -= bannerOdds; 
        if (roll <= 0){
            processBanner();
            return;
        }
        let shardAmount = (Math.floor(Math.random() *29) * 10) + 10; 

        roll -= skinShardOdds;
        if (roll <= 0){
            processSkinShards(shardAmount);
        }else{
            processCharacterShards(shardAmount);
        }
    }

    function processSkin(){
        let skinRoll = Math.random() * characters.length;
        let skinType = characters[Math.floor(skinRoll)].type;
        let skinNum = (skinRoll - Math.floor(skinRoll) < 0.5) ?"2" :"3";
        let chosenSkin = skinType + skinNum;
        let ownedSlimes = user.data.slimes;
        for(let i =0; i<ownedSlimes.length;i++){
            if (ownedSlimes[i] == chosenSkin){
                processSkinShards(
                    (skinNum == "2") 
                        ?characters[Math.floor(skinRoll)].price*1.5 
                        :characters[Math.floor(skinRoll)].price*2
                );
                return;
            }
        }
        setRollImage(        
            "assets/GameArt/" +
            skinType +
            "Slime/" +
            skinType +
            "Slime" +
            skinNum +
            ".gif"
        );
        setRollText(
            "You recived a " + skinType +  " skin!"
        )
        ownedSlimes.push(chosenSkin);
        userRef.update({
            slimes: ownedSlimes
        });
    }

    function processBanner(){
        let bannerRoll = Math.floor(Math.random() * bannersData.length);
        if((user.data.bannerUnlocked >> bannerRoll) & 1 == 1){
            processRoll();
            return;
        }
        
        setRollImage(bannersData[bannerRoll]);
        let chosenBanner = 2 ** bannerRoll; 
        
        let newBannerUnlock = user.data.bannerUnlocked | chosenBanner;
        userRef.update({
            bannerUnlocked: newBannerUnlock
        });
        setRollText("You Recieved a Banner!");
    }

    function processSkinShards(shardAmount){
        setRollImage(skinShardImg);
        setRollText("You Recieved " + shardAmount.toString() + " Skin Shards!");
        userRef.update({
            skinShard: user.data.skinShard + shardAmount
        });
    }
    
    function processCharacterShards(shardAmount){
        setRollImage(characterShardImg);
        setRollText("You Recieved "+ shardAmount.toString() + " Character Shards!");
        userRef.update({
            characterShard: user.data.characterShard + shardAmount
        });
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
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
                        : `Missing ${price-user.data.gold} Gold.`}
                    </p>
                    {enough && (
                    <button className={styles.rollButton}
                        onClick={() => {
                            updateGold(price);
                            setPopup(false);
                            processRoll();
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
        <div className={styles.customPopup}>
            <div className={styles.customInner}>
                <div className={styles.popupBanner}>
                    <div id="rollbanner" className={styles.rollBanner}>
                        <p>
                            {rollText}
                        </p>
                        <img className={styles.rollImage} src={rollImage}/>
                    </div>
                    <button className={styles.rollButton}
                        onClick={() => {
                            setRolls(rolls-1);
                            if (rolls > 1){
                                setRollRequest(false);
                                processRoll();
                                if(rolls % 2 == 0){
                                    document.getElementById("rollbanner").classList.remove(styles.rollBanner);
                                    document.getElementById("rollbanner").classList.add(styles.rollAnimation);
                                }else{
                                    document.getElementById("rollbanner").classList.remove(styles.rollAnimation);
                                    document.getElementById("rollbanner").classList.add(styles.rollBanner);
                                }
                                setRollRequest(true);
                            }else{
                                setRollRequest(false);
                            }
                        }}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
        )}
        </div>

    );
}