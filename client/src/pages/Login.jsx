import LoginForm from "../components/login/LoginForm";
import { useState, useEffect } from "react";
import { useOutletContext, useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css";

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
      <h2>Login</h2>
      {loginErrors && (
        <div className={styles.errors}>
          {loginErrors.map((error) => {
            return <p key={error.msg}>{error.msg}</p>;
          })}
        </div>
      )}
      <LoginForm setLoginErrors={setLoginErrors}></LoginForm>
      <p>
        Don&apos;t have an account yet? No problem,{" "}
        <Link to="/signup">sign up here!</Link>
      </p>
    </div>
  );
}
