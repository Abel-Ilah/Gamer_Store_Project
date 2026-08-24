import "./Login.css";
import TextField from "@mui/material/TextField";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";

import { SendEmailVerificationCode } from "../features/security/slices/securitySlice";
import {
  SEVERITY_ERROR,
  showMessage,
} from "../features/snackbar/SnackbarSlice";

import {
  getSavedCustomerLoginInfo,
  loginAsCustomer,
  saveCustomerLoginInfo,
} from "../features/auth/CustomerAuthSlice";

export function Login({ backTo = "/home" }) {
  const [login, setLogin] = useState(() => {
    var savedLogin = getSavedCustomerLoginInfo();
    return savedLogin
      ? savedLogin
      : { email: "", password: "", autoLogin: false };
  });

  const [loginDisabled, setLoginDisabled] = useState(false);

  const [errors, setErrors] = useState([]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    const newErrors = [];
    if (!login.email) {
      newErrors.push("Email is required!");
    } else if (!/^\S+@\S+\.\S+$/.test(login.email)) {
      newErrors.push("Email format is invalid!");
    }
    if (!login.password) {
      newErrors.push("Password is required!");
    }
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    dispatch(loginAsCustomer({ email: login.email, password: login.password }))
      .unwrap()
      .then((customer) => {
        setLoginDisabled(true);
        saveCustomerLoginInfo(login.email, login.password);
        if (customer.isEmailConfirmed) {
          setLoading(false);
          navigate("/");
        } else {
          dispatch(
            SendEmailVerificationCode({
              userId: customer.id,
              email: customer.email,
            }),
          )
            .unwrap()
            .then(() => {
              setLoading(false);
              navigate("/account/verify-email");
            })
            .catch((err) => {
              setLoading(false);
              dispatch(
                showMessage({
                  message: err,
                  severity: SEVERITY_ERROR,
                }),
              );
              navigate(backTo);
            });
        }
      })
      .catch((err) => {
        setLoading(false);
        setErrors({ general: err });
      });
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
              onClick={handleLogin}
              disabled={loading || loginDisabled}
              loading={loading}
              loadingIndicator={
                <CircularProgress size={25} style={{ color: "white" }} />
              }
            >
              Login
            </Button>

            <Link className="forgot-password" to="/account/password/forgot">
              Forgot your password?
            </Link>
            <Divider className="divider" />
            <Link to="/signup" className="signup-link">
              <Button variant="contained" className="signup-btn">
                Sign up
              </Button>
            </Link>
          </form>
        </div>
      </Container>
    </div>
  );
}
