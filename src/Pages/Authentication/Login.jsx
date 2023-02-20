import { useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../../Database/Hooks/useLogin";
import "./SL.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const { login, isPending, error } = useLogin();

  const onSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="SLFormContainer">
      <form onSubmit={onSubmit} className="SLform">
        <h2>Login to an existing account</h2>
        <p className={`errorMSG ${error ? "displayError" : ""}`}>Error: {error}</p>

        <label>
          <span>Email:</span>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </label>
        <label>
          <span>Password:</span>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </label>
        {!isPending && <button className="submitButton">Login</button>}
        {isPending && (
          <button className="submitButton" disabled>
            loading...
          </button>
        )}

        <Link to="/Signup">I don't have an account</Link>
      </form>
    </div>
  );
}
