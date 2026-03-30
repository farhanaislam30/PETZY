import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Link,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Too short").required("Required"),
  });

  const styles = {
    heading: {
      fontSize: "2rem",
      fontWeight: "600",
      color: "#333",
      marginBottom: "1rem",
    },
    paper: {
      padding: "2rem",
      margin: "100px auto",
      borderRadius: "1rem",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      backgroundColor: "#f9f9f9",
      textAlign: "center",
    },
    input: { marginTop: "1.5rem" },
    button: {
      marginTop: "2rem",
      fontSize: "1.2rem",
      fontWeight: "700",
      backgroundColor: "#1976d2",
      color: "#fff",
      borderRadius: "0.5rem",
      padding: "0.8rem 0",
    },
    linkText: { marginTop: "1.5rem", fontSize: "1rem" },
  };
  async function login(data, setSubmitting) {
    console.log(data);

    await axios
      .put("http://localhost:3000/users", data)
      .then(function (res) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("refreshToken", res.data.refreshToken);

        navigate("/");
        console.log(res.data);
        console.log("Login success!");
      })
      .catch(function (err) {
        console.log(err);
      });

    setSubmitting(false);
  }

  return (
    <Grid container justifyContent="center">
      <Paper
        style={styles.paper}
        sx={{
          width: { xs: "90vw", sm: "60vw", md: "40vw", lg: "30vw", xl: "25vw" },
          maxWidth: "450px",
        }}
      >
        <Typography style={styles.heading}>Login to Your Account</Typography>
        <Formik
          initialValues={{ email: "", password: "", remember: false }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            login(values, setSubmitting);
            console.log(values);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, handleChange, values }) => (
            <Form>
              <Field
                as={TextField}
                style={styles.input}
                label="Email Address"
                type="email"
                name="email"
                variant="outlined"
                fullWidth
                error={!!values.email && values.email.length > 0}
                helperText={<ErrorMessage name="email" />}
              />
              <Field
                as={TextField}
                style={styles.input}
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                variant="outlined"
                fullWidth
                error={!!values.password && values.password.length > 0}
                helperText={<ErrorMessage name="password" />}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormControlLabel
                control={
                  <Field
                    as={Checkbox}
                    type="checkbox"
                    name="remember"
                    color="primary"
                  />
                }
                label="Remember me"
              />
              <Button
                type="submit"
                variant="contained"
                style={styles.button}
                fullWidth
                disabled={isSubmitting}
              >
                Login
              </Button>
              <Typography style={styles.linkText}>
                <Link href="/forgot-password" underline="hover">
                  Forgot Password?
                </Link>
              </Typography>
              <Typography style={styles.linkText}>
                Don't have an account?{" "}
                <Link href="/register" underline="hover">
                  Create one here
                </Link>
              </Typography>
            </Form>
          )}
        </Formik>
      </Paper>
    </Grid>
  );
};

export default Login;
