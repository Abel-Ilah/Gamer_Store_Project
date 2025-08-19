import { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useSelector, useDispatch } from "react-redux";
import { clearSnackbarState } from "../features/snackbar/SnackbarSlice";
export default function SnackBar() {
  const { message, severity } = useSelector((state) => state.snackbar);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    dispatch(clearSnackbarState());
  };

  useEffect(() => {
    if (message && severity) {
      handleOpen();
    }
  }, [message, severity]);

  return (
    <div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
