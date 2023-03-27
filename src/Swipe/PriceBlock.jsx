import styles from "./Swipe.module.css";

export default function PriceBlock({
  amount,
  bonus,
  total,
  price,
  confirmPayment,
  key,
}) {
  return (
    <div className={styles.grid} key={key} onClick={() => {confirmPayment(amount,price)}}>
      <div className={styles.ImageContainer}>
        <img className={styles.Image} src="/assets/GameArt/Gold.png"></img>
      </div>
      <p className={styles.Top}>
        {amount} + <span>{bonus} bonus gold!</span>
      </p>
      <hr className={styles.hr}></hr>
      <div className={styles.Bottom}>
        <p className={styles.Total}>Total Gold: {total}</p>
        <p className={styles.Price}>{price}</p>
      </div>
    </div>
  );
}
