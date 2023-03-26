import styles from "./EndScreen.module.css";
import slime from "/assets/GameArt/EarthSlime/EarthSlime1.gif";
import PlayerBanner from "./PlayerBanner";
import gold from "../../.././../public/assets/GameArt/Gold.png";
import victory from '../../../../public/assets/BackgroundImages/VictoryImage.jpg'
import defeat from'../../../../public/assets/BackgroundImages/CreateLobby.png'
import { useContext, useEffect, useRef, useState } from "react";
import AccountBanner from "../../../Components/AccountBanner";
import { gameStateContext } from "../gameStateContext";
import { AuthContext } from "../../../Database/context/AuthContext";
import { projectFirestore } from "../../../Database/firebase/config";

export default function EndScreen({ setGameState }) {
  const { EndScreenData, gameMode } = useContext(gameStateContext);
  const { user, userRef } = useContext(AuthContext);
  // placeholder for if the win screen is ranked version or not
  const [ranked, setRanked] = useState(false);
  const [winner, setWinner] = useState(EndScreenData.Won); ///Check intially if current player is winner
  //left and right side is just determined by which player is viewing the screen

  const [senderData, setSenderData] = useState(null);

  useEffect(() => {
    const fetchBannerAndUpdateGold = async () => {
      const enemyRef = projectFirestore
        .collection("users")
        .doc(EndScreenData.enemyID);
      const data = await enemyRef.get().then((res) => res.data());
      const { slimeType, slimeSkin } = data;
      setSenderData({
        ...data,
        slimePath: `assets/GameArt/${slimeType}Slime/${slimeType}Slime${slimeSkin}`,
      });

      if (EndScreenData.Won) {
        if(gameMode==="Custom"){
          // update self
          await userRef.update({ gold: (+user.data.gold ) + (+EndScreenData.gold), level: (+user.data.level ) + (1)  });
          //update enemy
          await enemyRef.update({ gold: (+data.gold) - (+EndScreenData.gold), level: (+data.data.level ) + (1)  });
        } else if(gameMode==="Ranked"){
          // update self
          await userRef.update({ rankPoints: (+user.data.rankPoints ) + (20), level: (+user.data.level ) + (1) });
          //update enemy
          await enemyRef.update({ rankPoints: (+data.rankPoints) - (10), level: (+data.data.level ) + (1)  });
        }
      }
    };
    fetchBannerAndUpdateGold();
  }, []);

  return (
    <div className={styles.EndScreen}>
      
      <div className={styles.rewards}>
        {/* <p>{winner ? "+20 Rank Points" : "-20 Rank Points"}</p> */}
        <img  styles={{zIndex:"100"}}src={gold} alt="" />
        <p>
          {winner
            ? `+${EndScreenData.gold} Gold`
            : `-${EndScreenData.gold} Gold`}
        </p>
      </div>
      {winner && <p className={styles.endStatus}>VICTORY</p>}
      {!winner && <p className={styles.endStatus}>DEFEAT</p>}

      <PlayerBanner
        left={true}
        winner={winner}
        userData={user.data}
      ></PlayerBanner>
      {senderData && (
        <PlayerBanner
          left={false}
          winner={!winner}
          userData={senderData}
        ></PlayerBanner>
      )}
      <div className={styles.buttonContainer}>
        {/* BOTH BUTTONS GO BACK TO LOBBY RN */}
        <button
          onClick={() => setGameState("Lobby")}
          className={styles.returnToLobbyBtn}
        >
          Lobby
        </button>
        {ranked && (
          <button
            onClick={() => setGameState("Lobby")}
            className={styles.returnToLobbyBtn}
          >
            Play Again
          </button>
        )}
      </div>
      <img src={winner?victory:defeat} className={styles.endImage} alt="" />
    </div>
  );
}
