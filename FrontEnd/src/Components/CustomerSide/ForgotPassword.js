import "./ForgotPassword.css";
import {
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
  Divider,
} from "@mui/material";
import Container from "@mui/material/Container";
import EmailIcon from "@mui/icons-material/Email";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { sendResetPasswordToken } from "../../features/emailVerification/EmailVerificationSlice";
import { useNavigate } from "react-router-dom";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  function sendResetToken() {
    if (isValidEmail()) {
      setLoading(true);
      dispatch(sendResetPasswordToken(email))
        .unwrap()
        .then(() => {
          setLoading(false);
          navigate("/account/password/forgot/token-sent");
        })
        .catch((err) => {
          setLoading(false);
          setError(err);
        });
    }
  }

  const isValidEmail = () => {
    setError(null);
    if (!email) {
      setError((prev) => "Email is required!");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError((prev) => "invalid email format!");
      return false;
    }
    return true;
  };
  return (
    <div className="forgot-password-page">
      <Container maxWidth="xl">
        <div className="form-wraper">
          <form className="form">
            <h3 className="form-title">Password Reset</h3>
            <Divider
              style={{
                color: "gray",
                backgroundColor: "gray",
                height: "1px",
                width: "100%",
              }}
            />
            <p className="text">
              Forgotten your password? Enter your e-mail address below, and
              we'll send you an e-mail allowing you to reset it.
            </p>
            {error && <h6 class="error">{error}</h6>}
            <TextField
              fullWidth
              className="input"
              label="Email"
              variant="standard"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <Button
              className="reset-btn"
              variant="contained"
              onClick={sendResetToken}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={25} style={{ color: "white" }} />
              ) : (
                "Reset"
              )}
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
