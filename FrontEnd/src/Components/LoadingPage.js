import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export function LoadingPage() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        height: "100vh",
        width: "100%",
      }}
    >
      <CircularProgress style={{ marginTop: "40px" }} />
    </Box>
  );
}
