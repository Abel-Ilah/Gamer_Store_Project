import "./SignUp.css";
import TextField from "@mui/material/TextField";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Container from "@mui/material/Container";
import {
  showMessage,
  SEVERITY_SUCCESS,
} from "../features/snackbar/SnackbarSlice";

import { useDispatch, useSelector } from "react-redux";

import {
  ADD_NEW_USER,
  AddNewUser,
  clearUserStatus,
} from "../features/users/UserSlice";
import { SendNewConfirmationCode } from "../features/emailVerification/sendVerificationCodeSlice";

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

  const { loading, success, error, user, request } = useSelector(
    (state) => state.user
  );

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      dispatch(clearUserStatus());
    };
  }, []);

  useEffect(() => {
    if (request === ADD_NEW_USER && error) {
      setErrors({ email: error });
    }
  }, [error, request]);

  useEffect(() => {
    if (request === ADD_NEW_USER && success && user?.id) {
      localStorage.setItem(
        "login",
        JSON.stringify({
          email: NewUser.email,
          password: NewUser.password,
          autoLogin: true,
        })
      );
      dispatch(SendNewConfirmationCode(user.id));
      dispatch(clearUserStatus());
      dispatch(
        showMessage({
          message: "Your account has been successfully created.",
          severity: SEVERITY_SUCCESS,
        })
      );
      navigate("/verify-email");
    }
  }, [user, success, dispatch, navigate, NewUser, request]);

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
      dispatch(AddNewUser(NewUser));
    }
  }

  return (
    <div className="signup">
      <Container maxWidth="xl">
        <h3 className="title">
          <LocalFireDepartmentIcon
            style={{ color: "orange", fontSize: "30px" }}
          />
          Sign Up & Start Shopping
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
            >
              Register
            </Button>
            <div className="text">
              I declare that I am acquainted with the{" "}
              <span>
                <Link>Privacy Policy</Link>
              </span>{" "}
              and the{" "}
              <span>
                <Link>Terms and Conditions</Link>
              </span>{" "}
              and I want to register as a new customer.
            </div>
            <div className="signin">
              Already have an account ?
              <span>
                <Link>Sign in</Link>
              </span>
            </div>
            {Object.keys(errors).length > 0 && (
              <div
                className="errors-list"
                onClick={() => {
                  setErrors({});
                }}
              >
                <ul>
                  <span
                    className="close"
                    onClick={() => {
                      setErrors({});
                    }}
                  >
                    <CloseIcon />
                  </span>
                  {Object.values(errors).map((er, i) => {
                    return (
                      <div key={i} class="error-message">
                        <span class="icon">⚠️</span>
                        <span class="text">{er}</span>
                      </div>
                    );
                  })}
                </ul>
              </div>
            )}
          </form>
        </div>
      </Container>
    </div>
  );
}
