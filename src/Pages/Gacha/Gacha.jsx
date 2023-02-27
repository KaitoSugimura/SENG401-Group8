import styles from "./Gacha.module.css"
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import './Gacha.module.css';

export default function Gacha() {
  return (
    <div className={styles.Gacha}>
      <Carousel interval={null}>
      <Carousel.Item>
        <div>
        <img
          className={styles.gachaRollImage}
          src="assets\GameArt\GatchaRoll\ElementalSlimes.png"
          alt=""
        />
        <h1 className={styles.rollTitle}>Elemental Slimes</h1>
        </div>
        <div className={styles.brickBackground}>
        <Button className={styles.rollButton}>
            Roll x 1
            <br></br>
            10 Gold 
          </Button>
          <Button className={styles.rollButton}>
            Roll x 10
            <br></br>
            100 Gold 
          </Button>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div> 
        <img
          className={styles.gachaRollImage}
          src="assets\GameArt\GatchaRoll\DarkLightSlimes.png"
          alt=""
          />
        <h1 className={styles.rollTitle}>Dark & Light Slimes</h1>
        </div>
        <div className={styles.brickBackground}>
          <Button className={styles.rollButton}>
            Roll x 1
            <br></br>
            10 Gold 
          </Button>
          <Button className={styles.rollButton}>
            Roll x 10
            <br></br>
            100 Gold 
          </Button>
        </div>
      </Carousel.Item>
    </Carousel>
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
        integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
        crossorigin="anonymous"
      />    
    </div>
  );
}
