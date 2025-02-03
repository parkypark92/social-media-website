export default function LoginForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const formData = {
      username: data.get("username"),
      password: data.get("password"),
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
        type="password"
        name="password"
        id="password"
        aria-label="Password"
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
