import LoginForm from "../components/login/LoginForm";
import { useState } from "react";

export default function Login() {
  const [loginErrors, setLoginErrors] = useState([]);
  return (
    <div>
      {loginErrors && (
        <ul>
          {loginErrors.map((error) => {
            return <li key={error.msg}>{error.msg}</li>;
          })}
        </ul>
      )}
      <h2>Login</h2>
      <LoginForm setLoginErrors={setLoginErrors}></LoginForm>
    </div>
  );
}
