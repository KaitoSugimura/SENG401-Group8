import { useState } from "react";
import styles from "./Signup.module.css";
import "./SL.css";
import { useSignup } from "../../Database/Hooks/useSignup";
import { Link } from "react-router-dom";
import { projectAuth } from "../../Database/firebase/config";


export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    setIsPending(true);
    await projectAuth.createUserWithEmailAndPassword(email, password)
      .then(res => res.user.updateProfile({ displayName: username }))
      .catch(error => {
        setError(error.message);
      })
    setIsPending(false);
  };

  return (
    <div className="SLFormContainer">
      <form onSubmit={onSubmit} className="SLform">
        <h2>Create an account</h2>
        <p className={`errorMSG ${error ? "displayError" : ""}`}>Error: {error}</p>

        <label>
          <span>Email:</span>
          <input
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </label>
        <label>
          <span>Username:</span>
          <input
            type="text"
            required
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </label>
        <label>
          <span>Password:</span>
          <input
            type="password"
            required
            minLength={6}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </label>
        {!isPending && <button className="submitButton">Signup</button>}
        {isPending && (
          <button className="submitButton" disabled>
            loading...
          </button>
        )}
        <Link to="/Login">I already have an account</Link>
      </form>
    </div>
  );
}
