import "./ErrorMessage.css";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="error-msg">
      <ErrorOutlineIcon className="icon" />
      <span>{message}</span>
    </div>
  );
}

export default ErrorMessage;
