import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Required"),
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

  async function register(data, setSubmitting) {
    console.log(data);

    await axios
      .post("http://localhost:3000/users/", data)
      .then(function (res) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        navigate("/");
        console.log(res.data);
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
        <Typography style={styles.heading}>Create Your Account</Typography>
        <Formik
          initialValues={{ fullName: "", email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            register(values, setSubmitting);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field
                as={TextField}
                style={styles.input}
                label="Full Name"
                name="fullName"
                variant="outlined"
                fullWidth
                error={false}
                helperText={<ErrorMessage name="fullName" />}
              />
              <Field
                as={TextField}
                style={styles.input}
                label="Email Address"
                type="email"
                name="email"
                variant="outlined"
                fullWidth
                error={false}
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
                error={false}
                helperText={<ErrorMessage name="password" />}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                style={styles.button}
                fullWidth
                disabled={isSubmitting}
              >
                Register
              </Button>
              <Typography style={styles.linkText}>
                Already have an account?{" "}
                <Link href="/login" underline="hover">
                  Login here
                </Link>
              </Typography>
            </Form>
          )}
        </Formik>
      </Paper>
    </Grid>
  );
};

export default Register;
