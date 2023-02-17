import styles from './Home.module.css'
import slimeImage from "../../../public/assets/GameArt/Slime.png"

export default function Home() {
  return (
    <div className={styles.Home}>
      <img src={slimeImage} alt="slime"/>
    </div>
  )
}
