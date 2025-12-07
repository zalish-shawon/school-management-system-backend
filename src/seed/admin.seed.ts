import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User, { IUser } from "../modules/users/user.model";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

async function seedAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists. Skipping seed.");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create Admin
    const adminData: Partial<IUser> = {
      name: "Super Admin",
      email: "admin@school.com",
      password: hashedPassword,
      role: "admin",
    };

    const admin = await User.create(adminData);

    console.log("🎉 Admin User Created Successfully!");
    console.log({
      email: admin.email,
      password: "admin123", // plaintext for login
      role: admin.role,
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

seedAdmin();
