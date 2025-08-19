import "./EmailConfirmation.css";
import TextField from "@mui/material/TextField";
import EmailIcon from "@mui/icons-material/Email";
import Button from "@mui/material/Button";
import VerifiedIcon from "@mui/icons-material/Verified";
import Container from "@mui/material/Container";
import AlarmOnIcon from "@mui/icons-material/AlarmOn";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  verifyEmail,
  clearVerifyEmailState,
} from "../features/emailVerification/verifyEmailSlice";
import { SendNewConfirmationCode } from "../features/emailVerification/sendVerificationCodeSlice";
import CountdownTimer from "./CountdownTimer";
import { useLocation, useNavigate } from "react-router-dom";
import {
  SEVERITY_SUCCESS,
  showMessage,
} from "../features/snackbar/SnackbarSlice";

export function EmailConfirmation() {
  const [verificationCode, setverificationCode] = useState("");

  const [timestamps, setTimestamps] = useState(() => {
    const created = sessionStorage.getItem("createdAt");
    const expires = sessionStorage.getItem("expiresAt");
    return created && expires
      ? { createdAt: created, expiresAt: expires }
      : null;
  });
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearVerifyEmailState());
  }, [location.pathname, dispatch]);

  const {
    data,
    loading,
    error,
    success: emailVerified,
  } = useSelector((state) => state.verifyEmail);
  const { data: verificationObject, success: emailSent } = useSelector(
    (state) => state.sendVerificationCode
  );

  useEffect(() => {
    if (emailSent && verificationObject) {
      setTimestamps({
        createdAt: verificationObject.created,
        expiresAt: verificationObject.expiresAt,
      });
    }
  }, [verificationObject, emailSent]);

  useEffect(() => {
    if (emailVerified) {
      dispatch(clearVerifyEmailState());
      dispatch(
        showMessage({
          message: "Thank you! Your email has been confirmed.",
          sevirity: SEVERITY_SUCCESS,
        })
      );
      navigate("/");
    }
  });
  function handleVerification() {
    dispatch(
      verifyEmail({
        userId: currentUser.id,
        verificationCode: verificationCode,
      })
    );
  }
  function handleResend() {
    dispatch(SendNewConfirmationCode(currentUser.id));
    console.log("verification sent");
    setverificationCode("");
  }

  return (
    <div className="email-confirmation">
      <Container maxWidth="xl">
        <div className="content">
          <div className="box">
            {emailVerified && (
              <div className="success">
                <VerifiedIcon /> Email verified
              </div>
            )}
            {loading && (
              <div className="loading">
                <div className="circle"></div>
              </div>
            )}
            <EmailIcon />
            <h3 className="page-title">verify your email address</h3>
            <hr />
            <h5>a verification code has been sent to</h5>
            <h5 className="email">{currentUser.email}</h5>
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
                className="verify"
                variant="contained"
                disabled={
                  verificationCode.length < 6 || !/^\d+$/.test(verificationCode)
                }
                style={{
                  backgroundColor:
                    verificationCode.length < 6 ||
                    !/^\d+$/.test(verificationCode)
                      ? "#cfcbcbff"
                      : "rgb(2, 165, 2)",
                }}
                onClick={handleVerification}
              >
                verify
              </Button>
            </form>
            <div className="resend-wraper">
              <Button className="resend" variant="text" onClick={handleResend}>
                resend code
              </Button>
              <div className="timer">
                {timestamps ? (
                  <CountdownTimer
                    createdAt={timestamps.createdAt}
                    expiresAt={timestamps.expiresAt}
                  />
                ) : (
                  <AlarmOnIcon />
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
