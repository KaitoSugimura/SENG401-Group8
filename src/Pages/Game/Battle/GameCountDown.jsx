
import styles from "./GameCountDown.module.css";
import { useEffect, useState } from "react";

export default function GameCountDown() {

  const [time, setTime] = useState("3");

  useEffect(()=>{
    setTimeout(()=>{
      setTime("2");
      setTimeout(()=>{
        setTime("1");
        setTimeout(()=>{
          setTime("GO");
        }, 1000);
      }, 1000);
    }, 1000);
  }, []);

  return (
    <div className={styles.container}>
      <p>{time}</p>
    </div>
  );
}
