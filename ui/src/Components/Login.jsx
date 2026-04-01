import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate, Link } from "react-router-dom";
import * as Yup from "yup";
import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Box,
  Divider,
  Alert,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Pets as PetsIcon,
} from "@mui/icons-material";
import axios from "axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const styles = {
    pageBackground: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    },
    paper: {
      padding: "3rem",
      borderRadius: "1.5rem",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      backgroundColor: "rgba(255, 255, 255, 0.98)",
      maxWidth: "450px",
      width: "100%",
    },
    logoContainer: {
      textAlign: "center",
      marginBottom: "1.5rem",
    },
    logo: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      objectFit: "cover",
    },
    heading: {
      fontSize: "1.75rem",
      fontWeight: "700",
      color: "#333",
      marginBottom: "0.5rem",
      textAlign: "center",
    },
    subheading: {
      fontSize: "0.95rem",
      color: "#666",
      marginBottom: "2rem",
      textAlign: "center",
    },
    input: {
      marginBottom: "1.25rem",
      "& .MuiOutlinedInput-root": {
        borderRadius: "0.75rem",
        backgroundColor: "#f8f9fa",
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#667eea",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#667eea",
        },
      },
    },
    button: {
      marginTop: "1rem",
      fontSize: "1.1rem",
      fontWeight: "600",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#fff",
      borderRadius: "0.75rem",
      padding: "0.9rem 0",
      textTransform: "none",
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
      },
    },
    registerBox: {
      marginTop: "2rem",
      padding: "1.5rem",
      backgroundColor: "#f8f9fa",
      borderRadius: "1rem",
      textAlign: "center",
    },
    registerText: {
      color: "#666",
      fontSize: "0.95rem",
    },
    registerLink: {
      color: "#667eea",
      fontWeight: "600",
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
      },
    },
    divider: {
      margin: "1.5rem 0",
    },
    forgotPassword: {
      textAlign: "center",
      marginTop: "1rem",
      "& a": {
        color: "#667eea",
        textDecoration: "none",
        fontSize: "0.9rem",
        "&:hover": {
          textDecoration: "underline",
        },
      },
    },
  };

  async function login(data, setSubmitting) {
    console.log("Login request data:", data);
    setError("");

    try {
      const response = await axios.put("http://localhost:3000/users", data);
      console.log("DEBUG Frontend - Full response:", response.data);
      console.log("DEBUG Frontend - role in response:", response.data.role);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      // Store user role from response
      if (response.data.role) {
        console.log("DEBUG Frontend - Storing role:", response.data.role);
        localStorage.setItem("userRole", response.data.role);
      } else {
        console.warn("DEBUG Frontend - role NOT found in response!");
      }

      // Decode token to get user info and store it
      try {
        const base64Url = response.data.token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const decoded = JSON.parse(jsonPayload);

        // Store user name
        if (decoded.name) {
          localStorage.setItem("userName", decoded.name);
        }
        // Store role from decoded token if not in response
        if (!response.data.role && decoded.role) {
          localStorage.setItem("userRole", decoded.role);
        }
      } catch (err) {
        console.error("Error decoding token:", err);
      }

      // Dispatch auth change event to update navbar in same window
      window.dispatchEvent(new Event('auth-change'));

      // Redirect admin users to admin panel, others to home
      if (response.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

      console.log(response.data);
      console.log("Login success!");
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    }

    setSubmitting(false);
  }

  return (
    <Box style={styles.pageBackground}>
      <Paper
        style={styles.paper}
        sx={{
          width: { xs: "95%", sm: "90%", md: "40vw", lg: "30vw" },
          maxWidth: "450px",
        }}
      >
        <Box style={styles.logoContainer}>
          <img
            src="/logo.png"
            alt="Petzy Logo"
            style={styles.logo}
          />
        </Box>

        <Typography style={styles.heading}>Welcome Back! 🐾</Typography>
        <Typography style={styles.subheading}>
          Sign in to continue your pet care journey
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "0.75rem" }}>
            {error}
          </Alert>
        )}

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            login(values, setSubmitting);
            console.log(values);
          }}
        >
          {({ isSubmitting, values }) => (
            <Form>
              <Field
                as={TextField}
                style={styles.input}
                label="Email Address"
                type="email"
                name="email"
                variant="outlined"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#667eea" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Field
                as={TextField}
                style={styles.input}
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                variant="outlined"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#667eea" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
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
                startIcon={<PetsIcon />}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>

              <Box style={styles.forgotPassword}>
                <Link to="/forgot-password">Forgot Password?</Link>
              </Box>
            </Form>
          )}
        </Formik>

        <Divider style={styles.divider}>OR</Divider>

        <Box style={styles.registerBox}>
          <Typography style={styles.registerText}>
            Don't have an account?{" "}
            <Link to="/register" style={styles.registerLink}>
              Create one here
            </Link>
          </Typography>
          <Typography
            sx={{ mt: 1, fontSize: "0.85rem", color: "#888" }}
          >
            Join our community of pet lovers today!
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
