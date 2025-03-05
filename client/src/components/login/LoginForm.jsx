import axios from "axios";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import styles from "./LoginForm.module.css";

export default function LoginForm({ setLoginErrors }) {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const formData = {
      username: data.get("username"),
      password: data.get("password"),
    };
    const response = await axios.post("http://localhost:3000/login", formData);
    if (response.data.status !== 200) {
      setLoginErrors(response.data.errors);
    } else {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", response.data.user);
      navigate(`/${response.data.user.id}`);
    }
  };
  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        name="username"
        id="username"
        aria-label="Username"
        placeholder="Username"
      />
      <input
        className={styles.input}
        type="password"
        name="password"
        id="password"
        aria-label="Password"
        placeholder="Password"
      />
      <button className={styles.btn} type="submit">
        Login
      </button>
    </form>
  );
}

LoginForm.propTypes = {
  setLoginErrors: PropTypes.func,
};
