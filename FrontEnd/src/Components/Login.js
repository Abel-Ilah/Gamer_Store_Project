import "./Login.css";
import TextField from "@mui/material/TextField";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GetCurrentUser,
  clearUserState,
  clearUserStatus,
} from "../features/users/UserSlice";
import { SendNewConfirmationCode } from "../features/emailVerification/sendVerificationCodeSlice";
import {
  SEVERITY_ERROR,
  showMessage,
} from "../features/snackbar/SnackbarSlice";

export function Login() {
  const [login, setLogin] = useState(() => {
    var savedLogin = JSON.parse(localStorage.getItem("login"));
    return savedLogin
      ? savedLogin
      : { email: "", password: "", autoLogin: false };
  });

  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearUserStatus());
    };
  }, []);

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

  const handleLogin = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      dispatch(GetCurrentUser({ email: login.email, password: login.password }))
        .unwrap()
        .then((user) => {
          localStorage.setItem(
            "login",
            JSON.stringify({ ...login, autoLogin: true })
          );
          if (user.isEmailConfirmed) {
            setLoading(false);
            navigate("/");
          } else {
            dispatch(SendNewConfirmationCode(user.id))
              .unwrap()
              .then(() => {
                setLoading(false);
                navigate("/verify-email");
              })
              .catch(() => {
                setLoading(false);
                dispatch(
                  showMessage({
                    message:
                      "Failed to send verification code due to a server issue. Please try again later.",
                    severity: SEVERITY_ERROR,
                  })
                );
                navigate("/");
              });
          }
        })
        .catch((err) => {
          setLoading(false);
          setErrors({ general: err });
        });
    }
  };

  return (
    <div className="login">
      <Container maxWidth="xl">
        <h3 className="title">
          <LocalFireDepartmentIcon
            style={{ color: "orange", fontSize: "30px" }}
          />
          Sign In to Your Account
          <LocalFireDepartmentIcon
            style={{ color: "orange", fontSize: "30px" }}
          />
        </h3>

        <div className="form-wraper">
          <form className="form">
            {loading && (
              <div className="loading">
                <div className="circle"></div>
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
            >
              Login
            </Button>

            <div className="signup-link">
              Don't have an account?
              <span
                onClick={() => {
                  setErrors({});
                  dispatch(clearUserState());
                }}
              >
                <Link to="/signup">Sign up</Link>
              </span>
            </div>
            {Object.keys(errors).length > 0 && (
              <div className="errors-list" onClick={() => setErrors({})}>
                <ul>
                  <span className="close" onClick={() => setErrors({})}>
                    <CloseIcon />
                  </span>
                  {Object.values(errors).map((er, i) => (
                    <div key={i} className="error-message">
                      <span className="icon">⚠️</span>
                      <span className="text">{er}</span>
                    </div>
                  ))}
                </ul>
              </div>
            )}
          </form>
        </div>
      </Container>
    </div>
  );
}
