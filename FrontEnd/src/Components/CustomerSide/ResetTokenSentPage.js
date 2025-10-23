import "./ResetTokenSentPage.css";
import { Container, Divider } from "@mui/material";

export function ResetTokenSentPage() {
  return (
    <div className="token-sent-page">
      <Container maxWidth="xl">
        <div className="content">
          <h3 className="content-title">Token sent</h3>
          <Divider
            style={{
              color: "gray",
              backgroundColor: "gray",
              height: "1px",
              width: "100%",
            }}
          />
          <p className="text">
            We have sent a password reset link to your email. Please check your
            inbox to continue.
          </p>
        </div>
      </Container>
    </div>
  );
}
