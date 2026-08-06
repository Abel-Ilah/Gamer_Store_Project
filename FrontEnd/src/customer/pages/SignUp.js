import "./SignUp.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Container from "@mui/material/Container";
import { useDispatch } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";

import { addNewCustomer } from "../features/customer/slices/customerSlice";
import {
  autoLoginAsCustomer,
  saveCustomerLoginInfo,
} from "../features/auth/CustomerAuthSlice";

export function SignUp() {
  const [customerInputs, setCustomerInputs] = useState({
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

  const [passowrdVisible, setPasswordVisible] = useState(true);

  const [errors, setErrors] = useState([]);

  const validateInputs = () => {
    const newErrors = [];

    if (!customerInputs.firstName.trim()) {
      newErrors.push("First name is required !");
    }

    if (!customerInputs.lastName.trim()) {
      newErrors.push("Last name is required !");
    }

    if (!customerInputs.email) {
      newErrors.push("Email is required !");
    } else if (!/^\S+@\S+\.\S+$/.test(customerInputs.email)) {
      newErrors.push("Email is not valid !");
    }

    if (!customerInputs.password) {
      newErrors.push("Password is required !");
    } else if (customerInputs.password.length < 8) {
      newErrors.push("Password must be at least 8 characters");
    }
    if (
      customerInputs.phoneNumber &&
      /^\+?[0-9\s\-().]{7,15}$/.test(customerInputs.phoneNumber) === false
    ) {
      newErrors.push("phone Number is not valid !");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  function handleSubmit() {
    if (!validateInputs()) {
      return;
    }
    setLoading(true);

    dispatch(addNewCustomer(customerInputs))
      .unwrap()
      .then((addedCustomer) => {
        setDisabled(true);
        dispatch(autoLoginAsCustomer({ customer: addedCustomer, token: null }));
        saveCustomerLoginInfo(customerInputs.email, customerInputs.password);
        setLoading(false);
        navigate("/account/verify-email");
      })
      .catch((err) => {
        setLoading(false);
        setErrors([err]);
      });
  }

  return (
    <div className="signup">
      <Container maxWidth="xl">
        <div className="form-wraper">
          <form className="form">
            <h3 className="form-title">Sing Up</h3>
            {errors.length > 0 && (
              <div className="errors">
                {errors.map((er, i) => (
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
              value={customerInputs.firstName}
              onChange={(e) => {
                setCustomerInputs({
                  ...customerInputs,
                  firstName: e.target.value,
                });
              }}
              autoFocus
              required
            />
            <TextField
              className="input"
              label="LastName"
              variant="standard"
              value={customerInputs.lastName}
              onChange={(e) => {
                setCustomerInputs({
                  ...customerInputs,
                  lastName: e.target.value,
                });
              }}
              required
            />
            <TextField
              className="input"
              label="Email"
              variant="standard"
              value={customerInputs.email}
              type="email"
              required
              onChange={(e) => {
                setCustomerInputs({ ...customerInputs, email: e.target.value });
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
                value={customerInputs.password}
                onChange={(e) => {
                  setCustomerInputs({
                    ...customerInputs,
                    password: e.target.value,
                  });
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
              value={
                customerInputs.phoneNumber ? customerInputs.phoneNumber : ""
              }
              onChange={(e) => {
                setCustomerInputs({
                  ...customerInputs,
                  phoneNumber: e.target.value !== "" ? e.target.value : null,
                });
              }}
            />
            <TextField
              className="input"
              label="Address (optional)"
              variant="standard"
              value={customerInputs.address ? customerInputs.address : ""}
              onChange={(e) => {
                setCustomerInputs({
                  ...customerInputs,
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
