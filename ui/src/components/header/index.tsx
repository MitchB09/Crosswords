import React from "react";
import { Button, Grid, Link, Typography } from "@mui/material";
import { useAuth } from "../../auth/hooks";
import { useNavigate } from "react-router-dom";

function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const logOut = () => {
    signOut()
      .then(() => {
        navigate("/");
      })
      .catch((err: any) => {
        console.dir(err);
      });
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      style={{
        padding: "4px 25px",
        marginBottom: "1em",
        backgroundColor: "#0e0e0e",
        color: "white",
      }}
    >
      <Grid item>
        <Link href="/" style={{ color: "white", textDecoration: "none" }}>
          <Typography variant="h5">Crosswords</Typography>
        </Link>
      </Grid>
      <Grid flexGrow={1}></Grid>
      {user ? (
        <>
          <Grid item>
            <Typography variant="subtitle1">{user.getUsername()}</Typography>
          </Grid>
          <Grid item>
            <Link
              variant="subtitle1"
              color="primary"
              onClick={logOut}
              style={{ color: "white", textDecoration: "none" }}
            >
              Log Out
            </Link>
          </Grid>
        </>
      ) : (
        <Grid item>
          <Link
            href="/login"
            variant="subtitle1"
            style={{ color: "white", textDecoration: "none" }}
          >
            Login
          </Link>
        </Grid>
      )}
    </Grid>
  );
}

export default Header;
