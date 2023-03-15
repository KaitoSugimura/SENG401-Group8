import styles from "./Room.module.css";

export default function Room({setGameState}) {
  return (
    <div>
      This is a Room
      <button onClick={() => setGameState("Battle")}>Start Battle</button>
    </div>
  )
}
