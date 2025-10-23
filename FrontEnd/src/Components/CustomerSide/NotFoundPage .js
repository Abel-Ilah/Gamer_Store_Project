import { Button, Container } from "@mui/material";
import "./NotFoundPage .css";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="not-found-page">
      <Container maxWidth="xl">
        <div className="content">
          <SentimentVeryDissatisfiedIcon className="icon" />
          <h1 className="error-number">404</h1>
          <h2 className="error-title">page not found</h2>
          <p className="text">
            Oops! The page you’re looking for can’t be found or something went
            <br />
            wrong. Click the button below to go back home.
          </p>
          <Link to={"/"}>
            <Button variant="contained">Home Page</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
