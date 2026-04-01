import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ChatBot from "../ChatBot";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Stack,
} from "@mui/material";
import {
  Pets,
  MedicalServices,
  ShoppingCart,
  Favorite,
  ArrowForward,
  Star,
} from "@mui/icons-material";

const Home = () => {
  const navigate = useNavigate();

  const handleFindPetClick = () => {
    navigate("/pet");
  };

  const handlePostPetClick = () => {
    navigate("/services");
  };

  const featuredPets = [
    {
      id: 1,
      name: "Max",
      breed: "Golden Retriever",
      age: "2 years",
      image: "/dog1.jpg",
      location: "Dhaka",
    },
    {
      id: 2,
      name: "Luna",
      breed: "Persian Cat",
      age: "1 year",
      image: "/cat1.jpg",
      location: "Chittagong",
    },
    {
      id: 3,
      name: "Charlie",
      breed: "Labrador",
      age: "3 years",
      image: "/dog2.jpg",
      location: "Dhaka",
    },
    {
      id: 4,
      name: "Bella",
      breed: "British Shorthair",
      age: "1.5 years",
      image: "/cat2.jpg",
      location: "Sylhet",
    },
  ];

  const services = [
    {
      icon: <Pets sx={{ fontSize: 50, color: "#4CAF50" }} />,
      title: "Adopt a Pet",
      description:
        "Find your perfect companion from our shelter animals waiting for loving homes.",
      buttonText: "Find Your Pet",
      buttonColor: "#4CAF50",
      onClick: handleFindPetClick,
    },
    {
      icon: <Favorite sx={{ fontSize: 50, color: "#FF9800" }} />,
      title: "Post a Pet",
      description:
        "Have a pet that needs a new home? Help them find a loving family.",
      buttonText: "Post Your Pet",
      buttonColor: "#FF9800",
      onClick: handlePostPetClick,
    },
    {
      icon: <MedicalServices sx={{ fontSize: 50, color: "#2196F3" }} />,
      title: "Veterinary Care",
      description:
        "Access our network of experienced veterinarians for your pet's health needs.",
      buttonText: "Learn More",
      buttonColor: "#2196F3",
      onClick: () => navigate("/Veterinary"),
    },
    {
      icon: <ShoppingCart sx={{ fontSize: 50, color: "#9C27B0" }} />,
      title: "Pet Store",
      description:
        "Shop for quality pet food, toys, and accessories for your furry friends.",
      buttonText: "Shop Now",
      buttonColor: "#9C27B0",
      onClick: () => navigate("/pet_store"),
    },
  ];

  const testimonials = [
    {
      name: "Sarah Ahmed",
      text: "Adopting my golden retriever from PETZY was the best decision ever! The process was smooth and the team was very supportive.",
      rating: 5,
    },
    {
      name: "Rahim Khan",
      text: "Great platform for pet lovers. I found my perfect companion here.",
      rating: 5,
    },
  ];

  return (
    <Box sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          minHeight: "90vh",
          background: `linear-gradient(135deg, rgba(63, 136, 238, 0.95) 0%, rgba(33, 150, 243, 0.9) 100%), url('/homepet.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          marginTop: "60px",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  animation: "fadeInUp 1s ease-out",
                  "@keyframes fadeInUp": {
                    from: { opacity: 0, transform: "translateY(30px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <Chip
                  label="🐾 Welcome to PETZY"
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontSize: "1rem",
                    fontWeight: 600,
                    mb: 2,
                    backdropFilter: "blur(10px)",
                  }}
                />
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                    fontWeight: 800,
                    color: "white",
                    lineHeight: 1.2,
                    mb: 2,
                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  Your Pets Are{" "}
                  <Box
                    component="span"
                    sx={{
                      background: "linear-gradient(45deg, #FFD700, #FFA500)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Our Priority
                  </Box>
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(255,255,255,0.9)",
                    mb: 3,
                    fontWeight: 400,
                    lineHeight: 1.8,
                  }}
                >
                  Ensure you are fully prepared to provide proper care and
                  attention to your pet before welcoming them into your home.
                  Adopting a pet not only changes their life but also fills your
                  home with unconditional love and joy.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    onClick={handleFindPetClick}
                    sx={{
                      background: "linear-gradient(45deg, #FFD700, #FFA500)",
                      color: "#333",
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      px: 4,
                      py: 1.5,
                      borderRadius: "30px",
                      boxShadow: "0 4px 15px rgba(255, 215, 0, 0.4)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 8px 25px rgba(255, 215, 0, 0.5)",
                      },
                    }}
                  >
                    Find Your Perfect Pet
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handlePostPetClick}
                    sx={{
                      borderColor: "white",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      px: 4,
                      py: 1.5,
                      borderRadius: "30px",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderColor: "white",
                      },
                    }}
                  >
                    Post a Pet
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }}>
              <Box
                sx={{
                  position: "relative",
                  animation: "float 3s ease-in-out infinite",
                  "@keyframes float": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-20px)" },
                  },
                }}
              >
                <Box
                  component="img"
                  src="/homepet.png"
                  alt="Happy pets"
                  sx={{
                    maxWidth: "100%",
                    height: "auto",
                    filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {[
              { number: "1.2K+", label: "Happy Pets" },
              { number: "500+", label: "Adoptions" },
              { number: "50+", label: "Veterinarians" },
              { number: "1000+", label: "Happy Families" },
            ].map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      background: "linear-gradient(45deg, #FFD700, #FFA500)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 1,
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 500 }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Pets Section */}
      <Box sx={{ py: 8, backgroundColor: "#f8f9fa" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Chip
              label="🐾 Featured Pets"
              sx={{
                backgroundColor: "#e3f2fd",
                color: "#1976d2",
                fontWeight: 600,
                mb: 2,
              }}
            />
            <Typography
              variant="h3"
              sx={{ fontWeight: 800, color: "#1a1a2e", mb: 2 }}
            >
              Find Your Perfect Companion
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "#666", maxWidth: 600, mx: "auto" }}
            >
              These adorable pets are waiting for their forever homes
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {featuredPets.map((pet) => (
              <Grid item xs={12} sm={6} md={3} key={pet.id}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                      "& .pet-image": {
                        transform: "scale(1.1)",
                      },
                    },
                  }}
                >
                  <Box sx={{ overflow: "hidden", height: 200 }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={pet.image}
                      alt={pet.name}
                      className="pet-image"
                      sx={{
                        transition: "transform 0.3s ease",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: "#1a1a2e", mb: 1 }}
                    >
                      {pet.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#666", mb: 1 }}
                    >
                      {pet.breed} • {pet.age}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 2,
                      }}
                    >
                      <Chip
                        label={pet.location}
                        size="small"
                        sx={{
                          backgroundColor: "#e3f2fd",
                          color: "#1976d2",
                        }}
                      />
                      <Button
                        size="small"
                        endIcon={<ArrowForward />}
                        onClick={() => navigate("/pet")}
                        sx={{ ml: "auto", color: "#1976d2" }}
                      >
                        View
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleFindPetClick}
              sx={{
                background: "linear-gradient(45deg, #4CAF50, #45a049)",
                color: "white",
                fontWeight: 700,
                px: 6,
                py: 1.5,
                borderRadius: "30px",
                boxShadow: "0 4px 15px rgba(76, 175, 80, 0.4)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 25px rgba(76, 175, 80, 0.5)",
                },
              }}
            >
              View All Pets
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={{ py: 8, backgroundColor: "white" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Chip
              label="🛠️ Our Services"
              sx={{
                backgroundColor: "#fff3e0",
                color: "#ff9800",
                fontWeight: 600,
                mb: 2,
              }}
            />
            <Typography
              variant="h3"
              sx={{ fontWeight: 800, color: "#1a1a2e", mb: 2 }}
            >
              Everything Your Pet Needs
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "#666", maxWidth: 600, mx: "auto" }}
            >
              From adoption to veterinary care, we've got you covered
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: "20px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    border: "2px solid transparent",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                      borderColor: service.buttonColor,
                      "& .service-icon": {
                        transform: "scale(1.1) rotate(5deg)",
                      },
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 4,
                      textAlign: "center",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      className="service-icon"
                      sx={{
                        mb: 3,
                        p: 2,
                        borderRadius: "50%",
                        backgroundColor: `${service.buttonColor}15`,
                        transition: "all 0.3s ease",
                      }}
                    >
                      {service.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "#1a1a2e",
                        mb: 2,
                      }}
                    >
                      {service.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        mb: 3,
                        flexGrow: 1,
                      }}
                    >
                      {service.description}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={service.onClick}
                      sx={{
                        backgroundColor: service.buttonColor,
                        color: "white",
                        fontWeight: 600,
                        borderRadius: "25px",
                        px: 4,
                        boxShadow: `0 4px 15px ${service.buttonColor}40`,
                        "&:hover": {
                          backgroundColor: service.buttonColor,
                          boxShadow: `0 6px 20px ${service.buttonColor}60`,
                        },
                      }}
                    >
                      {service.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Why Choose Us Section */}
      <Box
        sx={{
          py: 8,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                sx={{ fontWeight: 800, color: "white", mb: 4 }}
              >
                Why Choose PETZY?
              </Typography>
              {[
                "Verified Pet Listings",
                "Expert Veterinary Support",
                "Safe & Secure Transactions",
                "24/7 Customer Support",
              ].map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                    backgroundColor: "rgba(255,255,255,0.1)",
                    p: 2,
                    borderRadius: "15px",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    <Star sx={{ color: "#FFD700" }} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ color: "white", fontWeight: 600 }}
                  >
                    {item}
                  </Typography>
                </Box>
              ))}
            </Grid>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: "20px",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#1a1a2e", mb: 3 }}
                  >
                    What Our Clients Say
                  </Typography>
                  {testimonials.map((testimonial, index) => (
                    <Box
                      key={index}
                      sx={{
                        mb: 3,
                        p: 3,
                        backgroundColor: "#f8f9fa",
                        borderRadius: "15px",
                      }}
                    >
                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} sx={{ color: "#FFD700" }} />
                        ))}
                      </Stack>
                      <Typography
                        variant="body1"
                        sx={{ color: "#666", mb: 2, fontStyle: "italic" }}
                      >
                        "{testimonial.text}"
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, color: "#1a1a2e" }}
                      >
                        - {testimonial.name}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 10, backgroundColor: "#f8f9fa" }}>
        <Container maxWidth="md">
          <Card
            sx={{
              borderRadius: "30px",
              background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              overflow: "visible",
              position: "relative",
            }}
          >
            <CardContent
              sx={{
                p: 6,
                textAlign: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: "white",
                  mb: 2,
                }}
              >
                Ready to Find Your New Best Friend?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "rgba(255,255,255,0.8)",
                  mb: 4,
                  maxWidth: 500,
                  mx: "auto",
                }}
              >
                Join thousands of happy families who found their perfect
                companion through PETZY
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="center"
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleFindPetClick}
                  sx={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    px: 5,
                    py: 1.5,
                    borderRadius: "30px",
                    boxShadow: "0 4px 15px rgba(76, 175, 80, 0.4)",
                    "&:hover": {
                      backgroundColor: "#45a049",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  Adopt Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/donation")}
                  sx={{
                    borderColor: "#FFD700",
                    color: "#FFD700",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    px: 5,
                    py: 1.5,
                    borderRadius: "30px",
                    "&:hover": {
                      backgroundColor: "rgba(255,215,0,0.1)",
                      borderColor: "#FFD700",
                    },
                  }}
                >
                  Make a Donation
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>

      <ChatBot />
    </Box>
  );
};

export default Home;
