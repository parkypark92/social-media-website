import SignupForm from "../components/signup/SignupForm";
import { useState } from "react";

export default function Signup() {
  const [errorMessage, setErrorMessage] = useState([]);
  return (
    <div>
      <h2>Signup</h2>
      {errorMessage && (
        <ul>
          {errorMessage.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}
      <SignupForm setErrorMessage={setErrorMessage}></SignupForm>
    </div>
  );
}
