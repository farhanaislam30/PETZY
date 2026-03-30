import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Navbar from "./Components/Navbar";
import Home from "./Components/pages/Home";
import Veterinary from "./Components/pages/Veterinary";
import Pet from "./Components/pages/Pet";
import Pet_Store from "./Components/pages/Pet_Store";
import Donation from "./Components/pages/Donation";
import AddDoctor from "./Components/pages/AddDoctor";

import Donatepage from "./Components/pages/Donatepage";
import Contact from "./Components/pages/Contact";
import Services from "./Components/pages/Services";
import Cart from "./Components/pages/Cart";
import Logout from "./Components/Logout";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route index element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/pet" element={<Pet />}></Route>
          <Route path="/pet_store" element={<Pet_Store />}></Route>
          <Route path="/donation" element={<Donation />}></Route>
          <Route path="/donate" element={<Donatepage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />}></Route>
          <Route path="/cart" element={<Cart />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/Veterinary" element={<Veterinary />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
