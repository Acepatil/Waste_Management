import { useState } from "react";
import { useNavigate } from "react-router";
import "../styles/SideBar.css";
import { useUser } from "../context/UserContext";
import Error from "../utils/Error";
import Loader from "../utils/Loader";
import { backURL } from "../config";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [textArea, setTextArea] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(false);
  const [error, setError] = useState("");
  const [loading,setLoading]=useState(false)
  const [otpCode, setOtpCode] = useState("");
  const { dispatch, isUser } = useUser();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username) {
      setError("No username given");
      return;
    }
    if (!email) {
      setError("No email given");
      return;
    }
    if (!password) {
      setError("No password given");
      return;
    }
    if (isUser) {
      setLoading(true)
      try {
        const response = await fetch(`${backURL}/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        });

        const data = await response.json();

        if (response.status !== 200) {
          setError(data.message || "Invalid username or password or email");
          return;
        }

        if (data.message) {
          setError("");
          setOtp(true);
        }
      } catch (error) {
        setError(error.message);
      }
      finally{
        setLoading(false)
      }
    } else {
      if (!textArea) {
        setError("No reason specified");
        return;
      }
      try {
        const response = await fetch(`${backURL}/register/admin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
            reason: textArea,
          }),
        });
        const data = await response.json();
        if (response.status !== 200) {
          setError(data.message || "Invalid username or password or email");
          return;
        }

        if (data.message) {
          setError("");
          setOtp(true);
          setUsername("");
          setPassword("");
          setTextArea("");
          setEmail("");
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${backURL}/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          otp: otpCode,
        }),
      });

      if (response.status === 200) {
        setError("");
        dispatch({ type: "register", payload: { email, username, password } });
        navigate("/login");
      } else {
        setError("Invalid OTP");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if(error) return <Error>{error}</Error>

  if(loading) return <Loader/>

  return (
    <div className="sidebar">
      <div className="locations-list">
        {!otp ? (
          <>
            <h2 className="title">Register {!isUser ? "Admin" : ""}</h2>
            <div className="button-head">
              <button
                className={`buttonu ${isUser ? "isactive" : " "} `}
                onClick={() => {
                  dispatch({ type: "user" });
                }}
              >
                User
              </button>
              <button
                className={`buttonu ${!isUser ? "isactive" : " "} `}
                onClick={() => {
                  dispatch({ type: "admin" });
                }}
              >
                Admin
              </button>
            </div>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {!isUser && (
                <textarea
                  type="textarea"
                  placeholder="Reason"
                  value={textArea}
                  onChange={(e) => setTextArea(e.target.value)}
                />
              )}

              {error && <div className="error">{error}</div>}
              <div className="button-container-login">
                <div className="dont">
                  <span>Have an account?</span>
                  <span className="register" onClick={() => navigate("/login")}>
                    Login
                  </span>
                </div>
                {isUser && (
                  <button className="button" type="submit">
                    Register
                  </button>
                )}
                {!isUser && (
                  <button className="button" type="submit">
                    Try As Admin
                  </button>
                )}
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="title">Verify OTP</h2>
            <form onSubmit={handleVerifyOtp}>
              <div className="sent-email">
                The email has been sent to{" "}
                {isUser ? email : "admin for verification"}
              </div>
              {isUser && (
                <input
                  type="text"
                  placeholder="OTP"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                />
              )}
              {error && <div className="error">{error}</div>}
              {isUser && (
                <button className="button" type="submit">
                  Verify
                </button>
              )}
              {!isUser && (
                <div className="dont">
                  <span>See as a User Till Then </span>
                  <span
                    className="register"
                    onClick={() => {
                      setOtp(false);
                      navigate("/register");
                    }}
                  >
                    Register As User
                  </span>
                </div>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
