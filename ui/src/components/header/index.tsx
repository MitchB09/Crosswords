import React from "react";
import { Grid, Link, Typography } from "@mui/material";
import { useAuth } from "../../auth/hooks";

function Header() {
  const { user } = useAuth();

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      style={{
        padding: "4px 25px",
        marginBottom: "1em",
        backgroundColor: "#0e0e0e",
        color: "white",
      }}
    >
      <Grid item>
        <Typography variant="h5">Crosswords</Typography>
      </Grid>
      {user ? (
        <Grid item>{user.getUsername()}</Grid>
      ) : (
        <Grid>
          <Link href="/login" style={{ color: 'white', textDecoration: "none" }}>
            Login
          </Link>
        </Grid>
      )}
    </Grid>
  );
}

export default Header;
