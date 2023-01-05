import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks";
import { SignInInput } from "../../auth/types";

function Login() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [signInInput, setSignInInput] = useState<SignInInput>({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    auth
      .signIn({
        username: signInInput.username,
        password: signInInput.password,
      })
      .then(() => {
        navigate("/");
      })
      .catch((err: any) => {
        console.dir(err);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const startSignUp = () => {
    auth
      .signUp({
        username: signInInput.username,
        password: signInInput.password,
      })
      .then(() => {
        navigate("/");
      })
      .catch((err: any) => {
        console.dir(err);
      });
  };

  const cssStyle = {
    minWidth: "16em",
    marginBottom: "1em",
  };

  return (
    <Paper
      color="primary"
      style={{ minHeight: "60vh", margin: "1em", padding: "1em" }}
    >
      <Grid
        container
        direction="column"
        justifyItems="center"
        alignItems="center"
      >
        <form onSubmit={handleSubmit}>
          <Grid item>
            <TextField
              required
              name="username"
              label="Username"
              value={signInInput?.username ? signInInput.username : ""}
              onChange={handleChange}
              style={{ ...cssStyle }}
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <TextField
              required
              name="password"
              label="Password"
              type="password"
              value={signInInput?.password ? signInInput.password : ""}
              onChange={handleChange}
              style={{ ...cssStyle }}
              autoComplete="current-password"
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ ...cssStyle, marginBottom: "0.5em" }}
            >
              Sign In
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              style={{ ...cssStyle, marginBottom: "0.5em" }}
              onClick={startSignUp}
            >
              Sign Up
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              style={{ ...cssStyle, marginBottom: "0.5em" }}
            >
              Cancel
            </Button>
          </Grid>
        </form>
      </Grid>
    </Paper>
  );
}
export default Login;
