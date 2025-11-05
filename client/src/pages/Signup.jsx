import SignupForm from "../components/signup/SignupForm";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Signup.module.css";

export default function Signup() {
  const [errorMessage, setErrorMessage] = useState([]);
  return (
    <div>
      <h2>Signup</h2>
      {errorMessage && (
        <div className={styles.errors}>
          {errorMessage.map((error) => (
            <p key={error.msg}>{error.msg}</p>
          ))}
        </div>
      )}
      <SignupForm setErrorMessage={setErrorMessage}></SignupForm>
      <p>
        Already have an account? No problem,{" "}
        <Link to="/login">login here!</Link>
      </p>
    </div>
  );
}
