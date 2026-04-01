import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");

    // Dispatch auth change event to update navbar
    window.dispatchEvent(new Event('auth-change'));

    navigate("/login");
  }, [navigate]);

  return null; 
};

export default Logout;
