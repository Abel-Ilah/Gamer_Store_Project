import "./SignUp.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import {
  showMessage,
  SEVERITY_SUCCESS,
  SEVERITY_WARNING,
} from "../../features/snackbar/SnackbarSlice";
import { useDispatch } from "react-redux";
import { AddNewUser, clearUserStatus } from "../../features/users/UserSlice";
import {
  SendNewConfirmationCode,
  CONFIRM_EMAIL,
} from "../../features/emailVerification/EmailVerificationSlice";
import CircularProgress from "@mui/material/CircularProgress";

export function SignUp() {
  const [NewUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: null,
    address: null,
  });

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      dispatch(clearUserStatus());
    };
  }, []);

  const [passowrdVisible, setPasswordVisible] = useState(true);

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!NewUser.firstName.trim()) {
      newErrors.firstName = "First name is required !";
    }

    if (!NewUser.lastName.trim()) {
      newErrors.lastName = "Last name is required !";
    }

    if (!NewUser.email) {
      newErrors.email = "Email is required !";
    } else if (!/^\S+@\S+\.\S+$/.test(NewUser.email)) {
      newErrors.email = "Email is not valid !";
    }

    if (!NewUser.password) {
      newErrors.password = "Password is required !";
    } else if (NewUser.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (
      NewUser.phoneNumber &&
      /^\+?[0-9\s\-().]{7,15}$/.test(NewUser.phoneNumber) === false
    ) {
      newErrors.phoneNumber = "phone Number is not valid !";
    }

    return newErrors;
  };

  function handleSubmit() {
    const errors = validate();
    setErrors(errors);
    if (Object.keys(errors).length === 0) {
      setLoading(true);
      dispatch(AddNewUser(NewUser))
        .unwrap()
        .then((addedUser) => {
          setDisabled(true);
          localStorage.setItem(
            "login",
            JSON.stringify({
              email: addedUser.email,
              password: addedUser.password,
              autoLogin: true,
            })
          );
          dispatch(SendNewConfirmationCode(addedUser.email))
            .unwrap()
            .then(() => {
              setLoading(false);
              dispatch(
                showMessage({
                  message: "Your account has been successfully created.",
                  severity: SEVERITY_SUCCESS,
                })
              );
              navigate("/verify-email");
            })
            .catch(() => {
              setLoading(false);
              dispatch(
                showMessage({
                  message:
                    "Your account was created, but we couldn't send the verification code due to a server issue. Please try again later.",
                  severity: SEVERITY_WARNING,
                })
              );
              navigate("/");
            });
        })
        .catch((err) => {
          setLoading(false);
          setErrors({ email: err });
        });
    }
  }

  return (
    <div className="signup">
      <Container maxWidth="xl">
        <div className="form-wraper">
          <form className="form">
            <h3 className="form-title">Sing Up</h3>
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
              label="FirstName"
              variant="standard"
              value={NewUser.firstName}
              onChange={(e) => {
                setNewUser({ ...NewUser, firstName: e.target.value });
              }}
              autoFocus
              required
            />
            <TextField
              className="input"
              label="LastName"
              variant="standard"
              value={NewUser.lastName}
              onChange={(e) => {
                setNewUser({ ...NewUser, lastName: e.target.value });
              }}
              required
            />
            <TextField
              className="input"
              label="Email"
              variant="standard"
              value={NewUser.email}
              type="email"
              required
              onChange={(e) => {
                setNewUser({ ...NewUser, email: e.target.value });
              }}
            />
            <div className="password-box">
              <TextField
                className="input"
                id="standard-password-input"
                label="Password"
                type={passowrdVisible ? "text" : "password"}
                autoComplete="current-password"
                variant="standard"
                value={NewUser.password}
                onChange={(e) => {
                  setNewUser({ ...NewUser, password: e.target.value });
                }}
                required
              />
              <span
                onClick={() => {
                  setPasswordVisible(true);
                }}
              >
                {" "}
                <VisibilityIcon
                  className="icon"
                  sx={{ display: passowrdVisible ? "none" : "inline" }}
                />
              </span>

              <span
                onClick={() => {
                  setPasswordVisible(false);
                }}
              >
                <VisibilityOffIcon
                  className="icon"
                  sx={{ display: !passowrdVisible ? "none" : "inline" }}
                />
              </span>
            </div>
            <TextField
              className="input"
              label="Phone Number (optional)"
              variant="standard"
              value={NewUser.phoneNumber ? NewUser.phoneNumber : ""}
              onChange={(e) => {
                setNewUser({
                  ...NewUser,
                  phoneNumber: e.target.value !== "" ? e.target.value : null,
                });
              }}
            />
            <TextField
              className="input"
              label="Address (optional)"
              variant="standard"
              value={NewUser.address ? NewUser.address : ""}
              onChange={(e) => {
                setNewUser({
                  ...NewUser,
                  address: e.target.value !== "" ? e.target.value : null,
                });
              }}
            />
            <Button
              className="register"
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              loading={loading}
              loadingIndicator={
                <CircularProgress size={25} style={{ color: "white" }} />
              }
              disabled={loading || disabled}
            >
              Register
            </Button>
            <div className="signin">
              Already have an account ?
              <span style={{ color: "red" }}>
                <Link to="/login">Sign in</Link>
              </span>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}
