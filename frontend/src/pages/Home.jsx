export default function Home() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div>
      <h2>Welcome! You are logged in.</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
