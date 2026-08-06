import "./NewPassword.css";
import {
  Button,
  CircularProgress,
  Container,
  InputAdornment,
  LinearProgress,
  TextField,
} from "@mui/material";
import { useState } from "react";
import LockIcon from "@mui/icons-material/Lock";
import { useDispatch } from "react-redux";

import { useNavigate, useParams } from "react-router-dom";
import { createNewPassword } from "../../security/slices/securitySlice";

export function NewPassword() {
  const [password, setPassword] = useState({ password1: "", password2: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [strength, setStrength] = useState(0);
  const [createBtnDisabled, setCreateBtnDisabled] = useState(false);

  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleCreateNewPassword() {
    if (isValidPassword()) {
      setLoading(true);
      setError(null);
      dispatch(createNewPassword({ password: password.password1, token }))
        .unwrap()
        .then((_) => {
          setLoading(false);
          localStorage.removeItem("customer-login");
          localStorage.setItem("hasCart", true);
          localStorage.setItem("hasWishlist", true);
          localStorage.setItem("hasComparelist", true);
          setCreateBtnDisabled(true);
          navigate("/login");
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    }
  }
  function calculatePasswordStrenght(text) {
    if (!text || text === "") return 0;
    let value = 0;
    if (/^(?=.*[A-Za-z])(?=.*[\d\W]).+$/.test(text)) {
      value = text.length * 10;
      return value >= 100 ? 100 : value;
    } else return text.length > 0 ? 10 : 0;
  }
  function getColorIndicator() {
    if (strength < 40) return "error";
    if (strength >= 40 && strength <= 60) return "warning";
    return "success";
  }
  function isValidPassword() {
    if (password.password1.length === 0) {
      setError("password required");
      return false;
    }
    if (password.password2.length === 0) {
      setError("Confirm password required");
      return false;
    }
    if (password.password2 !== password.password1) {
      setError("passwords don't match");
      return false;
    }
    if (strength < 70) {
      setError("Password is very weak, please enter a stronger one.");
      return false;
    }
    return true;
  }
  return (
    <div className="new-password-page">
      <Container maxWidth="xl">
        <div className="form-wraper">
          <form className="form">
            <h3 className="form-title">New password</h3>
            {error && <h6 class="error">{error}</h6>}
            <TextField
              autoFocus
              fullWidth
              className="input"
              label="Password"
              type="text"
              variant="standard"
              value={password.password1}
              onChange={(e) => {
                setPassword({ ...password, password1: e.target.value });
                setStrength(calculatePasswordStrenght(e.target.value));
              }}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />

            <LinearProgress
              className="password-strength"
              variant="determinate"
              value={strength}
              color={getColorIndicator()}
              style={{ display: strength === 0 ? "none" : "block" }}
            />

            <TextField
              fullWidth
              className="input"
              label="confirm Password"
              type="text"
              variant="standard"
              value={password.password2}
              onChange={(e) =>
                setPassword({ ...password, password2: e.target.value })
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
            <Button
              className="create-btn"
              variant="contained"
              onClick={handleCreateNewPassword}
              disabled={loading || createBtnDisabled}
            >
              {loading ? (
                <CircularProgress size={25} style={{ color: "white" }} />
              ) : (
                "Create"
              )}
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
