import { Grid, Skeleton } from "@mui/material";

export function CartSkeleton() {
  return (
    <Grid container spacing={1}>
      {/* Left column: 8 out of 12 */}
      <Grid size={9}>
        {[...Array(5)].map((_, i) => (
          <Skeleton
            key={i}
            variant="rounded"
            height="100px"
            // width="100%"
            sx={{ margin: "5px 0" }}
          />
        ))}
      </Grid>

      <Grid size={3}>
        <Skeleton
          variant="rounded"
          height="520px"
          width="100%"
          sx={{ margin: "5px 0" }}
        />
      </Grid>
    </Grid>
  );
}
