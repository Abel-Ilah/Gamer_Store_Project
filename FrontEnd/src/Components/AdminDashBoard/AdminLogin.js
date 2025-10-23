import "../CustomerSide/Login.css";
import TextField from "@mui/material/TextField";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

export function AdminLogin() {
  const [login, setLogin] = useState(() => {
    var savedLogin = JSON.parse(localStorage.getItem("login"));
    return savedLogin
      ? savedLogin
      : { email: "", password: "", autoLogin: false };
  });

  const [loginDisabled, setLoginDisabled] = useState(false);

  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!login.email) {
      newErrors.email = "Email is required!";
    } else if (!/^\S+@\S+\.\S+$/.test(login.email)) {
      newErrors.email = "Email format is invalid!";
    }

    if (!login.password) {
      newErrors.password = "Password is required!";
    }

    return newErrors;
  };

  return (
    <div className="login">
      <Container maxWidth="xl">
        <div className="form-wraper">
          <form className="form">
            <h3 className="form-title">Login</h3>
            {Object.keys(errors).length > 0 && (
              <div className="errors" onClick={() => setErrors({})}>
                {Object.values(errors).map((er, i) => (
                  <span key={i} className="text">
                    - {er}
                  </span>
                ))}
              </div>
            )}
            <TextField
              className="input"
              label="Email"
              variant="standard"
              value={login.email}
              onChange={(e) => setLogin({ ...login, email: e.target.value })}
              required
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
            <div className="password-box">
              <TextField
                className="input"
                label="Password"
                type={passwordVisible ? "text" : "password"}
                variant="standard"
                value={login.password}
                onChange={(e) =>
                  setLogin({ ...login, password: e.target.value })
                }
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <span onClick={() => setPasswordVisible(!passwordVisible)}>
                {passwordVisible ? (
                  <VisibilityOffIcon className="icon" />
                ) : (
                  <VisibilityIcon className="icon" />
                )}
              </span>
            </div>

            <Button
              className="login-btn"
              variant="contained"
              disabled={loading || loginDisabled}
              loading={loading}
              loadingIndicator={
                <CircularProgress size={25} style={{ color: "white" }} />
              }
            >
              Login
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
