import { useContext} from "react";
import styles from "./Gacha.module.css"
import Carousel from 'react-bootstrap/Carousel';
import { AuthContext } from "../../Database/context/AuthContext";
import './bootstrap.carousel.css';
import Swipe from "../../Swipe/Swipe";

export default function Gacha() {
  const { user, userRef } = useContext(AuthContext);


  return (
    <div className={styles.Gacha}>
      <div className={styles.SwipeContainer}>
        <Swipe />
      </div>
      <div className={styles.currencyDiv}>
        <span className={styles.skinShardAmount}>Skin Shards: {user.data.skinShard}</span>
        <span className={styles.charShardAmount}>Character Shards: {user.data.characterShard}</span>
      </div>
      <Carousel interval={null}>
      <Carousel.Item>
        <div className={styles.bannerContainer}>
          <div class={styles.rollType}>Standard Roll</div>
          <div class={styles.rollContainer}>
            <div class={styles.rollDescription}>
              <h1 class={styles.rollName}>Dark Slimes</h1>
              <p class={styles.rollParagraph}>Every roll is gauranteed to include either character shards, skin shards, a banner, or a depicted skin.</p>
            </div>
            <div class={styles.rollSlimes}>
              <img class={styles.slimeImage} src="assets/GameArt/ShadowSlime/ShadowSlime1.gif"/>
              <img class={styles.slimeImage} src="assets/GameArt/PoisonSlime/PoisonSlime1.gif"/>
              <img class={styles.slimeImage} src="assets/GameArt/WildSlime/WildSlime1.gif"/>
              <img class={styles.slimeImage} src="assets/GameArt/ArmoredSlime/ArmoredSlime1.gif"/>
            </div>
          </div>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className={styles.bannerContainer}>
          <div class={styles.rollType}>Standard Roll</div>
          <div class={styles.rollContainer}>
            <div class={styles.rollDescription}>
              <h1 class={styles.rollName}>Light Slimes</h1>
              <p class={styles.rollParagraph}>Every roll is gauranteed to include either character shards, skin shards, a banner, or a depicted skin.</p>
            </div>
            <div class={styles.rollSlimes}>
              <img class={styles.slimeImage} src="assets/GameArt/BubbleGumSlime/BubbleGumSlime1.gif"/>
              <img class={styles.slimeImage} src="assets/GameArt/CelestialSlime/CelestialSlime1.gif"/>
              <img class={styles.slimeImage} src="assets/GameArt/HoneySlime/HoneySlime1.gif"/>
              <img class={styles.slimeImage} src="assets/GameArt/FireSlime/FireSlime1.gif"/>
            </div>
          </div>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className={styles.bannerContainer}>
          <div class={styles.rollType}>Standard Roll</div>
          <div class={styles.rollContainer}>
            <div class={styles.rollDescription}>
              <h1 class={styles.rollName}>Elemental Slimes</h1>
              <p class={styles.rollParagraph}>Every roll is gauranteed to include either character shards, skin shards, a banner, or a depicted skin.</p>
            </div>            
            <div class={styles.rollSlimes}>
              <img class={styles.slimeImage} src="assets/GameArt/EarthSlime/EarthSlime1.gif"/>
              <img class={styles.slimeImage} src="assets/GameArt/ElectricSlime/ElectricSlime1.gif"/>
              <img class={styles.slimeImage} src="assets/GameArt/IceSlime/IceSlime1.gif"/>
              <img class={styles.slimeImage} src="assets/GameArt/AirSlime/AirSlime1.gif"/>
            </div>
          </div>
        </div>
      </Carousel.Item>
    </Carousel>
    <div className={styles.gachaFooter}>
      <div className={styles.rollDiv}>
        <button className={styles.rollButton}>
          Roll x 1
          <br></br>
          10 Gold 
        </button>
        <button className={styles.rollButton}>
          Roll x 10
          <br></br>
          100 Gold 
        </button>
      </div>
    </div>
    </div>
  );
}
