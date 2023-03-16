import { useEffect, useState } from "react";
import { projectDatabase } from "../../../Database/firebase/config";
import { useAuthContext } from "../../../Database/Hooks/useAuthContext";
import styles from "./Battle.module.css";
// import { keyPressListener } from "./KeyHandler";


export default function Battle({ setGameState }) {
  const { user } = useAuthContext();
  const [Players, setPlayers] = useState({});
  let playerId;
  let playerRef;
  

  

  // class keyPressListener {
  //   constructor(keyCode, callback) {
  //     const keySafe = true;
  //     this.keyDownFunction = function (event) {
  //       if (event.code === keyCode) {
  //         if (keySafe) {
  //           keySafe = false;
  //           callback();
  //         }
  //       }
  //     };

  //     this.keyupFunction = function (event) {
  //         console.log(event.code);
  //       if (event.code === keyCode) {
  //         keySafe = true;
  //       }
  //     };

  //     document.addEventListener("keydown", this.keydownFunction);
  //     document.addEventListener("keyup", this.keydownFunction);
  //   }

  //   unbind() {
  //     document.removeEventListener("keydown", this.keydownFunction);
  //     document.removeEventListener("keyup", this.keydownFunction);
  //   }
  // }

  const handleKeyPress = (xChange = 0, yChange = 0) => {
    console.log("AUGH-keyPress", Players);
    // const newX = Players[playerId].top + xChange;
    // const newY = Players[playerId].left + yChange;

    // if(true){
    //   Players[playerId].top = newX;
    //   Players[playerId].left = newY;
    //   if(xChange === 1){
    //     Players[playerId].direction = "right";
    //   }
    //   if(yChange === -1){
    //     Players[playerId].direction = "left";
    //   }
    //   playerRef.set(Players[playerId]);
    // }
    // console.log("PRESSED: ", Players[playerId].top, playerId);
  };

  const initGame = () => {

    // new keyPressListener("ArrowUp", ()=>handleKeyPress(0, -1));
    // new keyPressListener("ArrowDown", ()=>handleKeyPress(0, 1));
    // new keyPressListener("ArrowLeft", ()=>handleKeyPress(1, 0));
    // new keyPressListener("ArrowRight", ()=>handleKeyPress(-1, 0));

    const allPlayersRef = projectDatabase.ref("players");

    allPlayersRef.on("value", (snapshot) => {
      setPlayers(snapshot.val());
      console.log("AUGH", snapshot.val());
      
    });
  };

  useEffect(() => {
    console.log("AUGH-Players", Players);
    new KeyboardButton();
    document.addEventListener("keydown", () => handleKeyPress(0, -1));
    document.addEventListener("keyup", () => handleKeyPress(0, -1));
  }, [Players]);

  useEffect(() => {
    if (user) {
      console.log("User:", user);
      playerId = user.uid;
      playerRef = projectDatabase.ref(`players/${playerId}`);
  
      console.log("PLAYER REF: ", playerRef);
  
      playerRef.set({
        id: playerId,
        name: user.displayName,
        direction: "right",
        color: "rgb(137, 137, 247)",
        top: "0px",
        left: "0px",
      });
      playerRef.onDisconnect().remove();
    }

    initGame();

  }, []);


  return (
    <div class="battle-container">
      This where you battle
      <button
        onClick={() => {
          playerRef.remove();
          setGameState("EndScreen");
        }}
      >
        End Battle
      </button>
      <div className={styles.battleField}>
        {Object.values(Players).map((player, i) => (
          <div
            className={styles.character}
            key={i}
            style={{
              top: player.top,
              left: player.left,
              backgroundColor: player.color,
            }}
          >
            <p className={styles.characterName}>{player.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
