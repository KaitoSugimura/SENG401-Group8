import { useState } from "react";
import { Link } from "react-router-dom";
import { projectAuth } from "../../Database/firebase/config";
import { useLogin } from "../../Database/Hooks/useLogin";
import { useSelector, useDispatch } from 'react-redux'
import "./SL.css";
import { login } from "../../Slices/authSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    setIsPending(true);

    dispatch(login({email, password})).catch(error => {
      console.log(error)
      setError(error.toString());
    });
    setIsPending(false);
  };

  return (
    <div className="SLFormContainer">
      <form onSubmit={onSubmit} className="SLform">
        <h2>Login to an existing account</h2>
        <p className={`errorMSG ${error ? "displayError" : ""}`}>{error}</p>

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
          <span>Password:</span>
          <input
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </label>
        {<button className="submitButton">Login</button>}
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
