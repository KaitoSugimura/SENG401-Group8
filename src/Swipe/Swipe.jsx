import { useState } from "react";
import Popup from "../Components/Popup";
import PriceBlock from "./PriceBlock";
import styles from "./Swipe.module.css";

export default function Swipe() {
  const [showPopup, setPopUp] = useState(false);

  const prices = [
    { amount: 450, bonus: 125, total: 575, price: "$4.99" },
    { amount: 990, bonus: 390, total: 1380, price: "$10.99" },
    { amount: 1980, bonus: 820, total: 2800, price: "$21.99" },
    { amount: 3150, bonus: 1350, total: 4500, price: "$34.99" },
    { amount: 4500, bonus: 2000, total: 6500, price: "$49.99" },
    { amount: 9000, bonus: 4500, total: 13500, price: "$99.99" },
  ];

  return (
    <div className={styles.SwipeContainer}>
      <button
        className={styles.SwipeButton}
        onClick={() => {
          setPopUp(true);
        }}
      >
        <img src="/assets/GameArt/GoldBag.png"></img>
      </button>
      {showPopup && (
        <div className={styles.PopupContainer}>
          <p className={styles.BuyGoldText}>Buy Gold</p>
          <div className={styles.GoldPriceList}>
            {prices.map((price, i) => (
              <PriceBlock
                amount={price.amount}
                bonus={price.bonus}
                total={price.total}
                price={price.price}
                key={i}
              ></PriceBlock>
            ))}
          </div>

          <button
            className={styles.close}
            onClick={() => {
              setPopUp(false);
            }}
          >
            X
          </button>
        </div>
      )}
    </div>
  );
}
