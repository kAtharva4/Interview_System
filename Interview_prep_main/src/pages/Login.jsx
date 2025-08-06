import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { makeUnauthenticatedPOSTRequest } from "../utils/serverHelpers";
import LoginWithGoogle from "../components/LoginWithGoogle";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie] = useCookies(["token"]);
  const navigate = useNavigate();

  const login = async () => {
    const data = { email, password };
    const response = await makeUnauthenticatedPOSTRequest("/api/auth/login", data);

    if (response && !response.err) {
      const token = response.token;
      const date = new Date();
      date.setDate(date.getDate() + 30);
      setCookie("token", token, { path: "/", expires: date });
      alert("Success");
      navigate("/");
    } else {
      alert("Failure");
    }
    
  };

  return (
    <div id="login-page">
      <h2>Login</h2>

      <input
        type="email"
        className="form-control"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="form-control"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="btn-primary"
        onClick={(e) => {
          e.preventDefault();
          login();
        }}
      >
        Sign In
      </button>
        <div style={{ margin: '20px 0' }}>
 
  </div>

      <Link href="#" className="text-link">
        Forgot password?
      </Link>
      <Link to="/register" className="text-link">
        Don't have an account? Register
      </Link>
    </div>
  );
};

export default Login;
