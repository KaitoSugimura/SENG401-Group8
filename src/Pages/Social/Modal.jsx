import styles from "./Social.module.css";

const Modal = ({ children, close }) => {
  return (

    <div className={styles.modalBackdrop} onClick={close}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default Modal;