import styles from "./Battle.module.css";

export default function Battle({setGameState}) {
  return (
    <div>
      This where you battle
      <button onClick={() => setGameState("EndScreen")}>End Battle</button>
    </div>
  )
}
