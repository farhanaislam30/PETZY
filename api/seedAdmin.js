import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "./models/user.js";

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Database connected for seeding"))
  .catch((err) => console.log(`Error connecting database ${err}`));

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@petzy.com" });
    
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Admin@123", salt);

    // Create admin user
    const adminUser = new User({
      name: "Admin",
      email: "admin@petzy.com",
      password: hashedPassword,
      role: "admin"
    });

    await adminUser.save();
    console.log("Admin user created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();