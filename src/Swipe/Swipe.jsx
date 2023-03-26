import { useContext, useRef, useState } from "react";
import Popup from "../Components/Popup";
import { AuthContext } from "../Database/context/AuthContext";
import PriceBlock from "./PriceBlock";
import styles from "./Swipe.module.css";

export default function Swipe() {
  const [showPopup, setPopUp] = useState(false);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [showThankyou, setShowThankyou] = useState(false);
  const { user, userRef } = useContext(AuthContext);
  const priceConfirmation = useRef(0);
  const amountConfirmation = useRef(0);

  const prices = [
    { amount: 450, bonus: 125, total: 575, price: "$4.99" },
    { amount: 990, bonus: 390, total: 1380, price: "$10.99" },
    { amount: 1980, bonus: 820, total: 2800, price: "$21.99" },
    { amount: 3150, bonus: 1350, total: 4500, price: "$34.99" },
    { amount: 4500, bonus: 2000, total: 6500, price: "$49.99" },
    { amount: 9000, bonus: 4500, total: 13500, price: "$99.99" },
  ];

  const confirmPayment = (amount, price) => {
    priceConfirmation.current = price;
    amountConfirmation.current = amount;
    setShowPaymentConfirmation(true);
  };

  const submitPayment = () => {
    userRef.update({ gold: user.data.gold + amountConfirmation.current });
    setShowPaymentConfirmation(false);
    setShowThankyou(true);
  };

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
                confirmPayment={confirmPayment}
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
      {showPaymentConfirmation && (
        <div className={styles.background}>
          <div className={styles.ConfirmationPopupContainer}>
            <div className={styles.creditCardImageContainer}>
              <img
                className={styles.creditCardImage}
                src="/publicAssets/SwipeImage.png"
              ></img>
              <span></span>
            </div>
            <p className={styles.ConfirmationText}>
              Confirm payment of {priceConfirmation.current}
            </p>
            <p className={styles.ConfirmationAmountText}>
              {amountConfirmation.current} Gold {`[In-game currency]`}
            </p>

            <div className={styles.form}>
              <div>
                <label>Name on Card</label>
                <input
                  className={styles.input}
                  defaultValue="Rimuru Tempest"
                  readOnly
                  style={{
                    width: "10.1vw",
                  }}
                />
              </div>
              <div>
                <label>Card Number</label>
                <input
                  className={styles.input}
                  defaultValue="1234 4321 5555 9809"
                  readOnly
                  style={{
                    width: "10.5vw",
                  }}
                />
              </div>

              <div>
                <label>Expiration Date (MM/YY)</label>
                <input
                  className={styles.input}
                  defaultValue="05/2030"
                  readOnly
                  style={{
                    width: "4.4vw",
                  }}
                />
              </div>
              <div>
                <label>CVV</label>
                <input
                  className={styles.input}
                  defaultValue="555"
                  readOnly
                  style={{
                    width: "2.4vw",
                  }}
                />
              </div>

              <button
                type="submit"
                className={styles.confirmButton}
                onClick={submitPayment}
              >
                Confirm payment
              </button>
            </div>

            <button
              className={styles.close2}
              onClick={() => {
                setShowPaymentConfirmation(false);
              }}
            >
              X
            </button>
          </div>
        </div>
      )}

      {showThankyou && (
        <div className={styles.background}>
          <div className={styles.thankYouPopup}>
            <img className={styles.Check} src="/publicAssets/Check.png"></img>
            <p>Thank you for your payment</p>
            <button
              className={styles.close2}
              onClick={() => {
                setShowThankyou(false);
              }}
            >
              X
            </button>
          </div>{" "}
        </div>
      )}
    </div>
  );
}
