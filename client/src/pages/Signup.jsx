import SignupForm from "../components/signup/SignupForm";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [errorMessage, setErrorMessage] = useState([]);
  return (
    <div>
      <h2>Signup</h2>
      {errorMessage && (
        <ul>
          {errorMessage.map((error) => (
            <li key={error.msg}>{error.msg}</li>
          ))}
        </ul>
      )}
      <SignupForm setErrorMessage={setErrorMessage}></SignupForm>
      <p>
        Already have an account? No problem,{" "}
        <Link to="/login">login here!</Link>
      </p>
    </div>
  );
}
