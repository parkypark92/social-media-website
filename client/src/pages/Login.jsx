import LoginForm from "../components/login/LoginForm";
import { useState, useEffect } from "react";
import { useOutletContext, useNavigate, Link } from "react-router-dom";

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
      <p>
        Don&apos;t have an account yet? No problem,{" "}
        <Link to="/signup">sign up here!</Link>
      </p>
    </div>
  );
}
