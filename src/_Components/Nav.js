import { NavLink } from "react-router-dom";
import styles from "./Nav.module.css";

export default function Nav() {
  return (
    <header className={styles.navbar}>
      <h1 className={styles.logo}>A Stand in</h1>
      <nav>
        <ul className={styles.navLinks}>
          <li>
            <NavLink exact to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/social">Social</NavLink>
          </li>
          <li>
            <NavLink to="/game">Game</NavLink>
          </li>
          <li>
            <NavLink to="/character">Character</NavLink>
          </li>
          <li>
            <NavLink to="/gacha">Gacha</NavLink>
          </li>
        </ul>
      </nav>
      <span className={styles.goldAmount}>2000 Gold</span>
    </header>
  );
}
