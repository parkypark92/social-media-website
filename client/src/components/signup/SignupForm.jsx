import DateSelect from "./DateSelect";

export default function SignupForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const formData = {
      username: data.get("username"),
      email: data.get("email"),
      password: data.get("password"),
      "password-confirm": data.get("password-confirm"),
      dob: `${data.get("day")}-${data.get("month")}-${data.get("year")}`,
    };
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        id="username"
        aria-label="Username"
        placeholder="Username"
      />
      <input
        type="email"
        name="email"
        id="email"
        aria-label="Email"
        placeholder="Email"
      />
      <DateSelect></DateSelect>
      <input
        type="password"
        name="password"
        id="password"
        aria-label="Password"
        placeholder="Password"
      />
      <input
        type="password"
        name="password-confirm"
        id="password-confirm"
        aria-label="Please confirm your password"
        placeholder="Please confirm you password"
      />
      <button type="submit">Signup</button>
    </form>
  );
}
