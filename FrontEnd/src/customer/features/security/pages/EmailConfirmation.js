import "./EmailConfirmation.css";
import "../../../styles/Shared.css";
import { SEVERITY_SUCCESS, showMessage } from "../../snackbar/SnackbarSlice";
import {
  SendEmailVerificationCode,
  verifyEmail,
} from "../../security/slices/securitySlice";
import { markCustomerEmailAsVerified } from "../../auth/CustomerAuthSlice";

import CircularProgress from "@mui/material/CircularProgress";

import TextField from "@mui/material/TextField";
import EmailIcon from "@mui/icons-material/Email";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import LockIcon from "@mui/icons-material/Lock";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export function EmailConfirmation({ userType = "customer", navigateTo = "/" }) {
  const [verificationCode, setverificationCode] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const user = useSelector((state) =>
  //   userType === "customer" ? state.customerAuth.customer : null
  // );
  const { customer: user } = useSelector((state) => state.customerAuth);

  const [error, setError] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  function handleResendVerification() {
    if (user && !user.isEmailConfirmed) {
      setResendLoading(true);
      setError(null);
      dispatch(
        SendEmailVerificationCode({ userId: user.id, email: user.email }),
      )
        .unwrap()
        .then(() => {
          setResendLoading(false);
          setverificationCode("");
          dispatch(
            showMessage({
              message: "verification code sent!",
              severity: SEVERITY_SUCCESS,
            }),
          );
        })
        .catch((err) => {
          setResendLoading(false);
          setError(err);
        });
    }
  }

  function handleVerifyEmail() {
    if (!user) {
      setError("no active user found");
      return;
    }
    if (user.isEmailConfirmed) {
      setError("email is already verified");
      return;
    }

    setVerifyLoading(true);
    setError(null);

    dispatch(verifyEmail({ userId: user.id, code: verificationCode }))
      .unwrap()
      .then(() => {
        setVerifyLoading(false);
        dispatch(markCustomerEmailAsVerified());
        dispatch(
          showMessage({
            message: "Email has been verified successfully",
            severity: SEVERITY_SUCCESS,
          }),
        );
        navigate(navigateTo);
      })
      .catch((err) => {
        setVerifyLoading(false);
        setError(err);
      });
  }

  function isValidInputCode(code) {
    return code.length === 6 && /^\d+$/.test(code);
  }
  return (
    <div className="email-confirmation shared">
      <Container maxWidth="xl">
        {!user && (
          <div className="empty">
            <LockIcon className="icon" />
            <h4 className="msg">no active user</h4>
            <Link to={"/"}>
              <Button variant="contained">Home page</Button>
            </Link>
          </div>
        )}
        {user && user.isEmailConfirmed && (
          <div className="empty">
            <VerifiedIcon className="icon" />
            <h4 className="msg">your email is Verified</h4>
            <Link to={"/"}>
              <Button variant="contained">Home page</Button>
            </Link>
          </div>
        )}
        {user && !user.isEmailConfirmed && (
          <div className="content">
            <div className="box">
              <EmailIcon />
              <h3 className="page-title">verify your email address</h3>
              <hr />
              <h5>a verification code has been sent to</h5>
              <h5 className="email">{user.email}</h5>
              <p>
                please check your inbox and enter the verification code below to
                verify your email address
              </p>
              {error && (
                <div class="error-message">
                  <span class="icon">⚠️</span>
                  <span class="text">{error}</span>
                </div>
              )}
              <form>
                <TextField
                  className="code"
                  id="outlined-basic"
                  placeholder="verification code XXXXXX"
                  variant="outlined"
                  autoFocus
                  value={verificationCode}
                  onChange={(e) => {
                    setverificationCode(e.target.value);
                  }}
                  inputProps={{ maxLength: 6 }}
                />
                <Button
                  className={`verify-btn ${
                    !isValidInputCode(verificationCode) ||
                    verifyLoading ||
                    resendLoading
                      ? "disabled"
                      : ""
                  }`}
                  variant="contained"
                  onClick={handleVerifyEmail}
                >
                  {verifyLoading ? <CircularProgress size={30} /> : "Verify"}
                </Button>
              </form>
              <div className="resend-wraper">
                <Button
                  className="resend"
                  variant="text"
                  disabled={resendLoading || verifyLoading}
                  style={{
                    color: resendLoading || verifyLoading ? "gray" : "green",
                  }}
                  onClick={handleResendVerification}
                >
                  resend code
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
