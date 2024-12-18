import "../index.css";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(localStorage.getItem('token'))
    console.log(localStorage.getItem('userId'))
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  async function goToHome(e) {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_PORT}/api/auth/login`,
        { username, password }
      );
      const { token, userId } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId); 
      console.log('Token saved:', token);
      console.log('UserId saved:', userId);

      localStorage.removeItem('currentRecipe')
      console.log(response.data.message);
      navigate("/home");
    } catch (err) {
      const backendError = err.response?.data?.error || "Login failed";
      setError(backendError);
      console.error("Signup Error:", backendError);
    }
  }

  return (
    <>
      <img className='logo'src="/file.png" alt="Logo"></img>
      <h1 className="title">Bite Buddy</h1>
      <div className="registerDiv">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={goToHome}>
          <label>
            Enter Username:
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            {" "}
            Enter Password:
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit">Login</button>
        </form>

        <a className="alternative" href="/signup">
          Sign Up
        </a>
      </div>
    </>
  );
}
export default Login;
