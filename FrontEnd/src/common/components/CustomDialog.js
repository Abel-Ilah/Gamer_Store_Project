import "./CustomDialog.css";
import React from "react";
import { Button, CircularProgress } from "@mui/material";

const CustomDialog = ({
  open,
  message,
  confirmText = "Confirm",
  confirmStartIcon,
  onConfirm,
  onClose,
  loading = false,
}) => {
  if (!open) return null;

  return (
    <div className="custom-dialog-overlay">
      <div className="custom-dialog">
        <div className="custom-dialog-content">
          <p className="custom-dialog-message">{message}</p>
        </div>

        <div className="custom-dialog-actions">
          <Button
            className={`custom-dialog-cancel ${loading && "disabled"}`}
            variant="outlined"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            className={`custom-dialog-confirm ${loading && "disabled"}`}
            variant="contained"
            startIcon={
              loading ? (
                <CircularProgress color="inherit" size={17} />
              ) : (
                confirmStartIcon
              )
            }
            onClick={onConfirm}
          >
            {loading ? "Loading" : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomDialog;
