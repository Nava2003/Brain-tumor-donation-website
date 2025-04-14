const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/uploaded1', express.static('uploaded1'));

// Connect to MongoDB
const mongoURI = "mongodb://localhost:27017/doctor";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error: ", err));

// Multer storage setup for file uploads
const storage = multer.diskStorage({
  destination: './uploaded1/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

// Schema and Model
const donordetailsSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  password: String,
  mobilenumber: String,
  photo: String,
});
const Doctor = mongoose.model("Doctor", donordetailsSchema, "doctordetail");

// ------------------------ API ROUTES -----------------------------

// Signup API
app.post("/signup", upload.single('photo'), async (req, res) => {
  const { name, username, password, mobilenumber } = req.body;
  const photo = req.file?.filename;

  try {
    // Check for existing user
    const existingUser = await Doctor.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new donor
    const newDonor = new Doctor({
      name,
      username,
      password: hashedPassword,
      mobilenumber,
      photo,
    });

    await newDonor.save();

    // Response
    const photoUrl = `http://localhost:5003/uploaded1/${photo}`;
    console.log("Data saved successfully:", { name, username, mobilenumber, photo });

    res.status(201).json({
      message: "Signup successful",
      photoUrl,
    });
  } catch (error) {
    console.error("Error saving donor details:", error);
    res.status(500).json({ error: "Error saving donor details" });
  }
});

// Get all donors (excluding passwords)
app.get("/api/doctor", async (req, res) => {
  try {
    const donors = await Doctor.find({}, { password: 0 });
    res.json(donors);
  } catch (error) {
    console.error("Error fetching donor details:", error);
    res.status(500).json({ error: "Error fetching donor details" });
  }
});

// Get donor by username (used by frontend)
app.get("/api/doctor/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const donor = await Doctor.findOne({ username }, { password: 0 });
    if (!donor) {
      return res.status(404).json({ error: "Donor not found" });
    }
    res.status(200).json(donor);
  } catch (error) {
    console.error("Error fetching donor:", error);
    res.status(500).json({ error: "Server error fetching donor" });
  }
});

// Signin API
app.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Doctor.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isHashed = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');
    let isMatch;

    if (isHashed) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = password === user.password;
      if (isMatch) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await Doctor.findByIdAndUpdate(user._id, { password: hashedPassword });
      }
    }

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        name: user.name,
        username: user.username,
        mobilenumber: user.mobilenumber,
      },
    });
  } catch (error) {
    console.error("Signin Error:", error);
    res.status(500).json({ error: "Server error during signin" });
  }
});

// Reset Password API
app.post("/reset-password", async (req, res) => {
  const { username, newPassword } = req.body;

  try {
    const user = await Doctor.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Donor.updateOne({ username }, { password: hashedPassword });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Server error during password reset" });
  }
});

  
  
// ---------------------------------------------------------------

// Start the server
const PORT = 5003;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
