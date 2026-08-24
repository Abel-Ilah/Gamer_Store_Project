import "./BackButton.css";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  const onBack = () => navigate(-1);
  return (
    <Button
      className="back-button-cmp"
      id="back-button-cmp"
      onClick={onBack}
      startIcon={<ArrowBackIcon />}
    >
      Back
    </Button>
  );
};
export default BackButton;
