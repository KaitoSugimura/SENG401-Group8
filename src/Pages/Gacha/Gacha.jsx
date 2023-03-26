import { useContext} from "react";
import styles from "./Gacha.module.css"
import Carousel from 'react-bootstrap/Carousel';
import { AuthContext } from "../../Database/context/AuthContext";
import './bootstrap.carousel.css';
import Swipe from "../../Swipe/Swipe";
import GachaRoll from "./GachaRoll";
//Currecny images
import skinShard from "/assets/GameArt/SkinShard.png";
import characterShard from "/assets/GameArt/CharacterShard.png";

export default function Gacha() {
  const { user} = useContext(AuthContext);


  return (
    <div className={styles.Gacha}>
      <div className={styles.SwipeContainer}>
        <Swipe />
      </div>
      <div className={styles.currencyDiv}>
        <div className={styles.characterShardDiv}>
          <img src={characterShard} alt="" /> x{user.data.characterShard}
        </div>
        <div className={styles.skinShardDiv}>
        <img className={styles.skinShard} src={skinShard} alt="" /> x{user.data.skinShard}
        </div>
      </div>
      <Carousel interval={null}>
      <Carousel.Item>
        <div className={styles.bannerContainer}>
          <div className={styles.rollType}>Standard Roll</div>
          <div className={styles.rollContainer}>
            <div className={styles.rollDescription}>
              <h1 className={styles.rollName}>Dark Slimes</h1>
              <p className={styles.rollParagraph}>Every roll is gauranteed to include either character shards, skin shards, a banner, or a slime skin.</p>
            </div>
            <div className={styles.rollSlimes}>
              <img className={styles.slimeImage} src="assets/GameArt/ShadowSlime/ShadowSlime2.gif"/>
              <img className={styles.slimeImage} src="assets/GameArt/PoisonSlime/PoisonSlime2.gif"/>
              <img className={styles.slimeImage} src="assets/GameArt/WildSlime/WildSlime2.gif"/>
              <img className={styles.slimeImage} src="assets/GameArt/ArmoredSlime/ArmoredSlime2.gif"/>
            </div>
          </div>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className={styles.bannerContainer}>
          <div className={styles.rollType}>Standard Roll</div>
          <div className={styles.rollContainer}>
            <div className={styles.rollDescription}>
              <h1 className={styles.rollName}>Light Slimes</h1>
              <p className={styles.rollParagraph}>Every roll is gauranteed to include either character shards, skin shards, a banner, or a slime skin.</p>
            </div>
            <div className={styles.rollSlimes}>
              <img className={styles.slimeImage} src="assets/GameArt/BubbleGumSlime/BubbleGumSlime2.gif"/>
              <img className={styles.slimeImage} src="assets/GameArt/CelestialSlime/CelestialSlime2.gif"/>
              <img className={styles.slimeImage} src="assets/GameArt/HoneySlime/HoneySlime2.gif"/>
              <img className={styles.slimeImage} src="assets/GameArt/FireSlime/FireSlime2.gif"/>
            </div>
          </div>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className={styles.bannerContainer}>
          <div className={styles.rollType}>Standard Roll</div>
          <div className={styles.rollContainer}>
            <div className={styles.rollDescription}>
              <h1 className={styles.rollName}>Elemental Slimes</h1>
              <p className={styles.rollParagraph}>Every roll is gauranteed to include either character shards, skin shards, a banner, or a slime skin.</p>
            </div>            
            <div className={styles.rollSlimes}>
              <img className={styles.slimeImage} src="assets/GameArt/EarthSlime/EarthSlime2.gif"/>
              <img className={styles.slimeImage} src="assets/GameArt/ElectricSlime/ElectricSlime2.gif"/>
              <img className={styles.slimeImage} src="assets/GameArt/IceSlime/IceSlime2.gif"/>
              <img className={styles.slimeImage} src="assets/GameArt/AirSlime/AirSlime2.gif"/>
            </div>
          </div>
        </div>
      </Carousel.Item>
    </Carousel>
    <div className={styles.gachaFooter}>
      <GachaRoll />
    </div>
    </div>
  );
}
