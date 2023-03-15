import styles from "./EndScreen.module.css";

export default function EndScreen({setGameState}) {
  return (
    <div>
      Yay you won, cool beans
      <button onClick={() => setGameState("Lobby")}>Go back to Lobby</button>
    </div>
  )
}
