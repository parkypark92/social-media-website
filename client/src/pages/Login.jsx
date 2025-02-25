import LoginForm from "../components/login/LoginForm";
import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

export default function Login() {
  const [loginErrors, setLoginErrors] = useState([]);
  const { user } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(`/${user.id}`);
    }
  }, [navigate, user]);

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
