import { Grid, Skeleton } from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";

export function ProductsSkeleton() {
  const theme = useTheme();

  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  //   const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isLg = useMediaQuery(theme.breakpoints.only("lg"));
  const isXl = useMediaQuery(theme.breakpoints.only("xl"));

  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
        <Skeleton
          variant="rounded"
          height="300px"
          width="100%"
          sx={{ margin: "5px 0", borderRadius: "10px" }}
        />
      </Grid>

      <Grid
        size={{ xs: 12, sm: 4, md: 3, lg: 2 }}
        sx={{ display: isLg || isXl ? "unset" : "none" }}
      >
        <Skeleton
          variant="rounded"
          height="300px"
          width="100%"
          sx={{ margin: "5px 0", borderRadius: "10px" }}
        />
      </Grid>

      <Grid
        size={{ xs: 6, sm: 4, md: 3, lg: 2 }}
        sx={{ display: isLg || isXl ? "unset" : "none" }}
      >
        <Skeleton
          variant="rounded"
          height="300px"
          width="100%"
          sx={{ margin: "5px 0", borderRadius: "10px" }}
        />
      </Grid>

      <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
        <Skeleton
          variant="rounded"
          height="300px"
          width="100%"
          sx={{ margin: "5px 0", borderRadius: "10px" }}
        />
      </Grid>

      <Grid
        size={{ xs: 6, sm: 4, md: 3, lg: 2 }}
        sx={{ display: !isXs ? "unset" : "none" }}
      >
        <Skeleton
          variant="rounded"
          height="300px"
          width="100%"
          sx={{ margin: "5px 0", borderRadius: "10px" }}
        />
      </Grid>

      <Grid
        size={{ xs: 6, sm: 4, md: 3, lg: 2 }}
        sx={{ display: !isXs && !isSm ? "unset" : "none" }}
      >
        <Skeleton
          variant="rounded"
          height="300px"
          width="100%"
          sx={{ margin: "5px 0", borderRadius: "10px" }}
        />
      </Grid>
    </Grid>
  );
}
