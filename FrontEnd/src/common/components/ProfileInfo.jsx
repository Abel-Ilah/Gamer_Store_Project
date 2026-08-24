import "./ProfileInfo.css";
import "../../admin/styles/StyledTextInput.css";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DoneIcon from "@mui/icons-material/Done";
import Button from "@mui/material/Button";
import { useState } from "react";
import { useDispatch } from "react-redux";
import UpdateIcon from "@mui/icons-material/Update";
import {
  updateCustomerPersonalInfoLocally,
  updateSavedLoginInfoLocallyForCustomer,
} from "../../customer/features/auth/CustomerAuthSlice";
import {
  showMessage,
  SEVERITY_SUCCESS,
  SEVERITY_ERROR,
} from "../../customer/features/snackbar/SnackbarSlice";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { LinearProgress } from "@mui/material";
import {
  changeMyPassword,
  deleteMyAccount,
  updateMyInfo,
} from "../../customer/features/customer/slices/customerSlice";
import { SendEmailVerificationCode } from "../../customer/features/security/slices/securitySlice";

export function ProfileInfo({ user, userRole = "customer" }) {
  // delete account  logic:
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  function handleDeleteAccount() {
    if (!user || userRole !== "customer") return;
    setDeleteInProgress(true);
    dispatch(deleteMyAccount(user.id))
      .unwrap()
      .then(() => {
        dispatch(
          showMessage({
            message: "Account deleted successfully",
            severity: SEVERITY_SUCCESS,
          }),
        );
        navigate("/");
      })
      .catch((err) => {
        dispatch(
          showMessage({
            message: err,
            severity: SEVERITY_ERROR,
          }),
        );
      })
      .finally(() => {
        setDeleteInProgress(false);
      });
  }
  // ==============================

  // update personal info logic :
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
  });
  const [updatePInfoInProgress, setUpdatePInfoInProgress] = useState(false);
  const [personalInfoDialogerrors, setPersonalInfoDialogerrors] = useState([]);

  function handleUpdatePersonalInfoChange(e) {
    if (e.target.name === "phoneNumber") {
      if (e.target.value.replace(/\D/, "") !== formData.phoneNumber)
        setFormData({
          ...formData,
          [e.target.name]: e.target.value.replace(/\D/, ""),
        });

      return;
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function initializeUpdatePersonlaInfoForm() {
    setFormData({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      phoneNumber: user?.phoneNumber ?? "",
      address: user?.address ?? "",
    });
    setPersonalInfoDialogerrors([]);
  }

  function validatePersonalInfoInputs() {
    let errs = [];
    if (!formData.firstName) errs.push("First name is required");
    if (!formData.lastName) errs.push("Last name is required");
    if (
      formData.phoneNumber &&
      !/^(?:212|0)([5-7]\d{8})$/.test(formData.phoneNumber)
    )
      errs.push("Invalid phone number");

    const sameErrors =
      errs.length === personalInfoDialogerrors.length &&
      errs.every((err) => personalInfoDialogerrors.includes(err));

    if (!sameErrors) {
      setPersonalInfoDialogerrors(errs);
    }

    return errs.length === 0;
  }

  function isSamePersonalInfo() {
    return (
      user.firstName === formData.firstName &&
      user.lastName === formData.lastName &&
      user.phoneNumber === formData.phoneNumber &&
      user.address === formData.address
    );
  }

  function handleUpdatePersonalInfo() {
    if (isSamePersonalInfo()) {
      setPersonalInfoDialogerrors(["There are no changes to update."]);
      return;
    }
    if (!validatePersonalInfoInputs()) return;

    setUpdatePInfoInProgress(true);

    dispatch(updateMyInfo({ ...formData, id: user.id }))
      .unwrap()
      .then(() => {
        dispatch(updateCustomerPersonalInfoLocally(formData));
        setOpenUpdateDialog(false);
        dispatch(
          showMessage({
            message: "Updated Successfully",
            severity: SEVERITY_SUCCESS,
          }),
        );
      })
      .catch((err) => setPersonalInfoDialogerrors([err]))
      .finally(() => setUpdatePInfoInProgress(false));
  }
  // ==============================

  // verify email logic :
  const [sendEmailVerificationInProgress, setSendEmailVerificationInProgress] =
    useState(false);

  function handleVerifyEmail() {
    if (!user || user.isEmailConfirmed) return;
    setSendEmailVerificationInProgress(true);
    dispatch(SendEmailVerificationCode({ userId: user.id, email: user.email }))
      .unwrap()
      .then(() => {
        navigate("/profile/verify-email");
      })
      .catch((err) =>
        dispatch(showMessage({ message: err, severity: SEVERITY_ERROR })),
      )
      .finally(() => setSendEmailVerificationInProgress(false));
  }

  // ==============================

  // change password logic :
  const [openChangePasswordDialog, setOpenChangePasswordDialog] =
    useState(false);
  const [newPasswordStrength, setNewPasswordStrength] = useState(0);
  const [passwordInputs, setPasswordInputs] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changePasswordInProgress, setChangePasswordInProgress] =
    useState(false);
  const [passwordDialogError, setPasswordDialogError] = useState("");

  function calculatePasswordStrenght(text) {
    if (!text || text === "") return 0;
    let value = 0;
    if (/^(?=.*[A-Za-z])(?=.*[\d\W]).+$/.test(text)) {
      value = text.length * 10;
      return value >= 100 ? 100 : value;
    } else return text.length > 0 ? 10 : 0;
  }
  function getColorIndicator() {
    if (newPasswordStrength < 40) return "error";
    if (newPasswordStrength >= 40 && newPasswordStrength <= 60)
      return "warning";
    return "success";
  }
  function isValidPasswordInputs() {
    let err = "";

    if (passwordInputs.currentPassword.length === 0) {
      err = "Current password is required !";
    } else if (passwordInputs.newPassword.length === 0) {
      err = "New password is required !";
    } else if (passwordInputs.confirmPassword.length === 0) {
      err = "Confirm password is required !";
    } else if (passwordInputs.currentPassword === passwordInputs.newPassword) {
      err = "New password must be different from the current password !";
    } else if (newPasswordStrength < 70) {
      err = "Password is very weak !";
    } else if (passwordInputs.newPassword !== passwordInputs.confirmPassword) {
      err = "Passwords don't match !";
    }

    if (!(err === passwordDialogError)) {
      setPasswordDialogError(err);
    }
    return err === "";
  }
  function handleCloseChangePasswordDialog() {
    setPasswordInputs({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setOpenChangePasswordDialog(false);
    setNewPasswordStrength(0);
    setPasswordDialogError([]);
  }
  function handleChangePassword() {
    if (!isValidPasswordInputs()) return;

    setChangePasswordInProgress(true);

    dispatch(
      changeMyPassword({
        userId: user.id,
        currentPassword: passwordInputs.currentPassword,
        newPassword: passwordInputs.newPassword,
      }),
    )
      .unwrap()
      .then(() => {
        dispatch(
          updateSavedLoginInfoLocallyForCustomer(passwordInputs.newPassword),
        );
        setOpenChangePasswordDialog(false);
        dispatch(
          showMessage({
            message: "Password Changed Successfully",
            severity: SEVERITY_SUCCESS,
          }),
        );
      })
      .catch((err) => setPasswordDialogError(err))
      .finally(() => setChangePasswordInProgress(false));
  }
  // ==============================

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function disableAllBtns() {
    return (
      deleteInProgress ||
      updatePInfoInProgress ||
      changePasswordInProgress ||
      sendEmailVerificationInProgress
    );
  }

  return user ? (
    <div className="profile-info">
      <header className="mt-4">
        <div className="row">
          <div className="left col-12 col-md-8 d-flex flex-column flex-md-row gap-3 align-items-center text-center text-md-start">
            <Avatar className="avatar" />
            <div className="details">
              <h3 className="name">{user.firstName + " " + user.lastName}</h3>
              <p className="user-type ">
                <span>{userRole}</span> |{" "}
                <time>{user.createdAt.toString().split("T")[0]}</time>
              </p>
            </div>
          </div>
          <div className="right col-12 col-md-4 d-flex justify-content-md-end justify-content-center align-items-start mt-3 mt-md-0">
            {userRole === "customer" && (
              <Button
                startIcon={
                  deleteInProgress ? null : <DeleteOutlineOutlinedIcon />
                }
                variant="outlined"
                className="delete-btn"
                onClick={() => setOpenDeleteDialog(true)}
                disabled={disableAllBtns()}
              >
                {deleteInProgress ? (
                  <CircularProgress size={20} />
                ) : (
                  "Delete Account"
                )}
              </Button>
            )}
          </div>
        </div>
      </header>

      <section className="personal-info d-flex flex-column flex-md-row gap-3 justify-content-between text-start mt-4">
        <div className="left">
          <h5 className="section-title mb-4">Personal Information</h5>
          <div className="info row ">
            <div className="item col-12 col-md-6  mb-3">
              <p className="label">First Name</p>
              <p className="value">{user.firstName}</p>
            </div>
            <div className="item col-12 col-md-6 mb-3">
              <p className="label">Last Name</p>
              <p className="value">{user.lastName}</p>
            </div>
            <div className="item col-12 col-md-6 mb-3">
              <p className="label">Address</p>
              <p className="value">{user.address || "N/A"}</p>
            </div>
            <div className="item col-12 col-md-6 mb-3">
              <p className="label">Phone</p>
              <p className="value"> {user.phoneNumber || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="right">
          <Button
            className="edit-btn"
            startIcon={updatePInfoInProgress ? null : <EditOutlinedIcon />}
            variant="outlined"
            disabled={disableAllBtns()}
            onClick={() => {
              initializeUpdatePersonlaInfoForm();
              setOpenUpdateDialog(true);
            }}
          >
            {updatePInfoInProgress ? <CircularProgress size={20} /> : "Edit"}
          </Button>
        </div>
      </section>

      <section className="login-info mt-4 text-start">
        <h5 className="section-title  mb-4">Login Information</h5>
        <div className="item email">
          <p className="label">Email</p>
          <div className="d-flex flex-wrap align-items-center column-gap-4">
            <p className="value d-flex align-items-end gap-3">
              {user.email}
              {user.isEmailConfirmed ? (
                <span title="email verified">
                  <DoneIcon className="icon verified" />
                </span>
              ) : (
                <span title="email not verified">
                  <WarningAmberIcon className="icon unverified" />
                </span>
              )}
            </p>
            {!user.isEmailConfirmed && (
              <Button
                className="button verify mt-1 d-block text-start"
                disabled={disableAllBtns()}
                onClick={handleVerifyEmail}
              >
                {sendEmailVerificationInProgress ? (
                  <CircularProgress size={20} />
                ) : (
                  "verify"
                )}
              </Button>
            )}
          </div>
        </div>
        <div className="item mt-3">
          <p className="label">Password</p>
          <div className="d-flex flex-wrap align-items-center column-gap-4">
            <p className="value mt-1">**************</p>
            <Button
              className="button change-password"
              disabled={disableAllBtns()}
              onClick={() => setOpenChangePasswordDialog(true)}
            >
              {changePasswordInProgress ? (
                <CircularProgress size={20} />
              ) : (
                " Change Password"
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* delete account confirmation dialog  */}
      {openDeleteDialog && (
        <div className="dialog-wrapper">
          <div className="dialog delete-dialog">
            <WarningAmberIcon className="icon" />
            <h5 className="title mt-3">
              Are you sure you want to delete your account?
            </h5>

            <p className="message mt-2">
              This action is irreversible. All your data will be permanently
              removed.
            </p>

            <div className="actions mt-4 d-flex gap-3 justify-content-center">
              <Button
                className="cancel"
                autoFocus
                variant="outlined"
                startIcon={<CancelOutlinedIcon />}
                onClick={() => setOpenDeleteDialog(false)}
                disabled={disableAllBtns()}
              >
                Cancel
              </Button>
              <Button
                className="delete"
                variant="contained"
                startIcon={<DeleteOutlineOutlinedIcon />}
                onClick={() => {
                  handleDeleteAccount();
                  setOpenDeleteDialog(false);
                }}
                disabled={disableAllBtns()}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* ============ */}

      {/* update personal info dialog */}
      {openUpdateDialog && (
        <div className="dialog-wrapper">
          <div className="dialog update-dialog">
            <h5 className="title">Update Personal Info</h5>
            {/* handle input/api erros */}
            {personalInfoDialogerrors.length > 0 && (
              <ul className="styled-input-errors">
                {personalInfoDialogerrors.map((err, index) => (
                  <li key={index}>- {err}</li>
                ))}
              </ul>
            )}
            {/* ============== */}
            <form className="update-form">
              <TextField
                className="styled-input "
                placeholder="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleUpdatePersonalInfoChange}
                autoFocus
                fullWidth
                margin="normal"
                slotProps={{
                  htmlInput: {
                    maxLength: 30,
                  },
                }}
              />
              <TextField
                className="styled-input "
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleUpdatePersonalInfoChange}
                fullWidth
                margin="normal"
                slotProps={{
                  htmlInput: {
                    maxLength: 30,
                  },
                }}
              />
              <TextField
                className="styled-input "
                placeholder="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => {
                  handleUpdatePersonalInfoChange(e);
                }}
                fullWidth
                margin="normal"
                slotProps={{
                  htmlInput: {
                    maxLength: 12,
                    inputMode: "numeric",
                  },
                }}
              />
              <TextField
                className="styled-input "
                placeholder="Address"
                name="address"
                value={formData.address}
                onChange={handleUpdatePersonalInfoChange}
                fullWidth
                margin="normal"
                slotProps={{
                  htmlInput: {
                    maxLength: 120,
                  },
                }}
              />
              <div className="actions mt-4 d-flex gap-3 justify-content-center">
                <Button
                  className="cancel"
                  variant="outlined"
                  onClick={() => setOpenUpdateDialog(false)}
                  startIcon={<CancelOutlinedIcon />}
                  disabled={disableAllBtns()}
                >
                  Cancel
                </Button>

                <Button
                  className="update"
                  variant="contained"
                  startIcon={updatePInfoInProgress ? null : <UpdateIcon />}
                  disabled={disableAllBtns()}
                  onClick={handleUpdatePersonalInfo}
                >
                  {updatePInfoInProgress ? (
                    <CircularProgress size={20} style={{ color: "white" }} />
                  ) : (
                    "Update"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ============ */}

      {/* change password */}
      {openChangePasswordDialog && (
        <div className="dialog-wrapper">
          <div className="dialog change-password-dialog">
            <h5 className="title">Change Password</h5>
            {/* handle input/api erros */}
            {passwordDialogError && (
              <ul className="styled-input-errors">
                <li>- {passwordDialogError}</li>
              </ul>
            )}
            {/* ============== */}
            <form className="change-passowrd-form">
              <TextField
                className="styled-input "
                placeholder="current password"
                name="current-password"
                value={passwordInputs.currentPassword}
                onChange={(e) =>
                  setPasswordInputs({
                    ...passwordInputs,
                    currentPassword: e.target.value,
                  })
                }
                autoFocus
                fullWidth
                margin="normal"
                slotProps={{
                  htmlInput: {
                    maxLength: 30,
                  },
                }}
              />
              <TextField
                className="styled-input "
                placeholder="new password"
                name="lastName"
                value={passwordInputs.newPassword}
                onChange={(e) => {
                  setPasswordInputs({
                    ...passwordInputs,
                    newPassword: e.target.value,
                  });
                  setNewPasswordStrength(
                    calculatePasswordStrenght(e.target.value),
                  );
                }}
                fullWidth
                margin="normal"
                slotProps={{
                  htmlInput: {
                    maxLength: 30,
                  },
                }}
              />
              <LinearProgress
                className="password-strength"
                variant="determinate"
                value={newPasswordStrength}
                color={getColorIndicator()}
                style={{
                  display: newPasswordStrength === 0 ? "none" : "block",
                }}
              />
              <TextField
                className="styled-input "
                placeholder="confirm password"
                name="address"
                value={passwordInputs.confirmPassword}
                onChange={(e) =>
                  setPasswordInputs({
                    ...passwordInputs,
                    confirmPassword: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
                slotProps={{
                  htmlInput: {
                    maxLength: 30,
                  },
                }}
              />
              <div className="actions mt-4 d-flex gap-3 justify-content-center">
                <Button
                  className="cancel"
                  variant="outlined"
                  onClick={handleCloseChangePasswordDialog}
                  startIcon={<CancelOutlinedIcon />}
                  disabled={disableAllBtns()}
                >
                  Cancel
                </Button>

                <Button
                  className="update"
                  variant="contained"
                  startIcon={changePasswordInProgress ? null : <UpdateIcon />}
                  disabled={disableAllBtns()}
                  onClick={handleChangePassword}
                >
                  {changePasswordInProgress ? (
                    <CircularProgress size={20} style={{ color: "white" }} />
                  ) : (
                    "Update"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ============ */}
    </div>
  ) : null;
}
