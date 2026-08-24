import "./EmptyState.css";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

function EmptyState({ message }) {
  return (
    <div className="empty-state">
      <InboxOutlinedIcon className="icon" />
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;
