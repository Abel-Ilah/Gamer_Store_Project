import "./Footer.css";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";

export function Footer() {
  return (
    <Box className="footer" style={{ backgroundColor: "#1e1e1e" }}>
      <Container maxWidth="xl">
        <Grid container spacing={1}>
          <Grid size={{ lg: 5, md: 5, sm: 12, xs: 12 }}>
            <div className="info">
              <img className="logo" src="assets/store-logo.png" alt="logo" />
              <div className="social-media">
                <h5 className="title"> social media :</h5>
                <Box sx={{ display: "flex", gap: 2, marginTop: "10px" }}>
                  <IconButton
                    style={{ padding: "0" }}
                    href="https://facebook.com"
                    target="_blank"
                  >
                    <FacebookIcon className="icon facebook" />
                  </IconButton>
                  <IconButton
                    style={{ padding: "0" }}
                    href="https://instagram.com"
                    target="_blank"
                  >
                    <InstagramIcon className="icon instagram" />
                  </IconButton>
                  <IconButton
                    style={{ padding: "0" }}
                    href="https://twitter.com"
                    target="_blank"
                  >
                    <TwitterIcon className="icon twitter" />
                  </IconButton>
                  <IconButton
                    style={{ padding: "0" }}
                    href="https://youtube.com"
                    target="_blank"
                  >
                    <YouTubeIcon className="icon youtube" />
                  </IconButton>
                </Box>
              </div>
            </div>
          </Grid>
          {/* <Grid size={{ lg: 7, md: 7, sm: 12, xs: 12 }}>
            {" "}
            <div
              style={{
                minWidth: "400px",
                width: "100%",
                height: "200px",
                background: "green",
              }}
            ></div>
          </Grid> */}
        </Grid>
      </Container>
    </Box>
  );
}
