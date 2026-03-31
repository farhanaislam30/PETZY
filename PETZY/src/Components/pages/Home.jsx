import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./Footer";
import ChatBot from "../ChatBot";   // ✅ ChatBot Import

const Home = () => {
  return (
    <div className="py-5">
      <div  >
        <section
          className="container text-center py-5"
          style={{ marginTop: "80px" }}
        >
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="mb-4">Your Pets Are Our Priority</h1>
              <p className="mb-4" style={{ fontSize: "1.25rem" }}>
                Ensure you are fully prepared to provide proper care and
                attention to your pet before welcoming them into your home.
              </p>
              <p className="text-muted">
                Adopting a pet not only changes their life but also fills your
                home with unconditional love and joy.
              </p>
              <a
                href="/services"
                className="btn btn-lg"
                style={{
                  marginTop: "40px",
                  background:
                    "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
                  border: "none",
                  padding: "12px 30px",
                  fontSize: "1.2rem",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "30px",
                  transition: "all 0.3s ease-in-out",
                  display: "inline-block",
                  textDecoration: "none",
                }}
                onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              >
                Explore Services
              </a>
            </div>

            <div className="col-md-6 text-center">
              <img
                src="/homepet.png"
                alt="Dog"
                className="img-fluid"
                style={{ maxWidth: "70%", maxHeight: "500px" }}
              />
            </div>
          </div>
        </section>

        <section className="text-center py-5" style={{ marginTop: "40px" }}>
          <div className="container w-60 mx-auto bg-dark text-white p-4 rounded-3 shadow-lg">
            <h2 className="fw-bold">
              1.2K+ Furry Friends Living Their Best Lives
            </h2>
            <p>
              With a focus on matching the right pet with the right family,
              Petzy makes it easy to adopt love and foster happiness.
            </p>
          </div>
        </section>

        <section className="py-5">
          <div className="container text-center">
            <h2 className="mt-5">Planning to Adopt a Pet?</h2>
            <div className="row mt-5">
              <div className="col-md-4">
                <h4 className="fw-bold" style={{ color: "cornflowerblue" }}>
                  The Joy of Pet Adoption
                </h4>
                <p>
                  Bringing a pet into your life can be an incredibly rewarding
                  experience, not just for you but for the furry friend you
                  welcome into your home.
                </p>
              </div>
              <div className="col-md-4">
                <h4 className="fw-bold" style={{ color: "cornflowerblue" }}>
                  A Guide to Pet Adoption
                </h4>
                <p>
                  Are you considering adding a new pet to your family? Pet
                  adoption is a wonderful option to consider.
                </p>
              </div>
              <div className="col-md-4">
                <h4 className="fw-bold" style={{ color: "cornflowerblue" }}>
                  Healing Power of Animals
                </h4>
                <p>
                  Animals have an extraordinary ability to touch our lives in
                  profound ways, offering not only companionship but also a
                  therapeutic bond.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
        <ChatBot />   {/* ✅ ChatBot Added Here */}
      </div>
    </div>
  );
};

export default Home;