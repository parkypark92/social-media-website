import DateSelect from "./DateSelect";
import axios from "axios";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import styles from "./SignupForm.module.css";

export default function SignupForm({ setErrorMessage }) {
  const navigate = useNavigate();

  const sendSignupData = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const formData = {
      username: data.get("username"),
      email: data.get("email"),
      password: data.get("password"),
      passwordConfirm: data.get("password-confirm"),
      dob:
        (data.get("day") || data.get("month") || data.get("year")) == null
          ? null
          : `${data.get("day")}-${data.get("month")}-${data.get("year")}`,
    };

    const response = await axios.post("http://localhost:3000/signup", formData);
    if (response.data.status !== 200) {
      setErrorMessage(response.data.errors);
    } else {
      console.log(response.data);
      navigate("/login");
    }
  };

  return (
    <form className={styles.container} onSubmit={sendSignupData}>
      <input
        className={styles.input}
        type="text"
        name="username"
        id="username"
        aria-label="Username"
        placeholder="Username"
        required
      />
      <input
        className={styles.input}
        type="email"
        name="email"
        id="email"
        aria-label="Email"
        placeholder="Email"
        required
      />
      <DateSelect></DateSelect>
      <input
        className={styles.input}
        type="password"
        name="password"
        id="password"
        aria-label="Password"
        placeholder="Password"
        required
      />
      <input
        className={styles.input}
        type="password"
        name="password-confirm"
        id="password-confirm"
        aria-label="Please confirm your password"
        placeholder="Please confirm you password"
        required
      />
      <button className={styles.btn} type="submit">
        Signup
      </button>
    </form>
  );
}

SignupForm.propTypes = {
  setErrorMessage: PropTypes.func,
};
