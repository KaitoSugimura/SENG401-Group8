import styles from "./Lobby.module.css";

export default function Lobby({setGameState}) {
  return (
    <div>
      This is the lobby
      <button onClick={() => setGameState("Room")}>Join Room</button>
    </div>
  )
}
