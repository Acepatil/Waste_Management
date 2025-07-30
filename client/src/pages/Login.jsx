import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import "../styles/SideBar.css";
import { useUser } from "../context/UserContext";
import Error from "../utils/Error";
import { backURL } from "../config";

const Login = () => {
  const { dispatch,username:officialUsername,password:officialPassword ,isUser} = useUser();
  const [username, setUsername] = useState(officialUsername);
  const [password, setPassword] = useState(officialPassword);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backURL}/login`, {
        username,
        password,
      });
      if (response.status !== 200) {
        throw new Error("Invalid username or password");
      }
      const { access_token } = response.data;
      dispatch({ type: "login", payload: { username, access_token } });
      localStorage.setItem("token", access_token);
      setError("");
      navigate("/home");
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="sidebar">
      <div className="locations-list">
        <h2 className="title">Login {!isUser?"Admin":""}</h2>
        <ul>
          <div className="button-head">

        <button className={`buttonu ${isUser?'isactive':" "} `} onClick={()=>{dispatch({type:"user"})}}>
                User
        </button>
        <button className={`buttonu ${!isUser?'isactive':" "} `} onClick={()=>{dispatch({type:"admin"})}}>
                Admin
        </button>
      </div>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            {error && <div className="error">{error}</div>}
            <div className="button-container-login">
            <div className="dont">
                <span>Don&apos;t have account?</span>
                <span className="register" onClick={()=>navigate("/register")}>Register</span>
            </div>
              <button className="button" type="submit">
                Login
              </button>
              
            </div>
            
          </form>
        </ul>
      </div>
    </div>
  );
};

export default Login;
