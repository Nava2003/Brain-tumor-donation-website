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
app.use('/uploaded', express.static('uploaded'));

// Connect to MongoDB
const mongoURI = "mongodb://localhost:27017/donorlogin";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error: ", err));

// Multer storage setup for file uploads
const storage = multer.diskStorage({
  destination: './uploaded/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

// -------------------- Schema and Model --------------------

// Donor schema
const donordetailsSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  password: String,
  mobilenumber: String,
  photo: String,
});
const Donor = mongoose.model("Donor", donordetailsSchema, "donordetail");

// Patient schema
const patientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  disease: String,
  location: String,
  imageUrl: String,
  status: { type: String, default: "pending" },
  acceptedBy: {
    donorName: String,
    donorId: String,
    acceptedDate: Date,
  },
});
const Patient = mongoose.model("Patient", patientSchema, "patientdetails");

// ------------------------ API ROUTES -----------------------------

// Donor Signup
app.post("/signup", upload.single('photo'), async (req, res) => {
  const { name, username, password, mobilenumber } = req.body;
  const photo = req.file?.filename;

  try {
    const existingUser = await Donor.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDonor = new Donor({
      name,
      username,
      password: hashedPassword,
      mobilenumber,
      photo,
    });

    await newDonor.save();

    const photoUrl = `http://localhost:5002/uploaded/${photo}`;
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

app.get("/api/donor/:username", async (req, res) => {
  try {
    // FIXED: Changed Doctor to Donor
    const user = await Donor.findOne({ username: req.params.username }, { password: 0 });
    if (!user) {
      return res.status(404).json({ error: "Donor not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching donor:", error);
    res.status(500).json({ error: "Error fetching donor details" });
  }
});


// Donor Login
app.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Donor.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "Username not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.json({
      message: "Signin successful",
      username: user.username,
      name: user.name,
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Get all donors (excluding passwords)
app.get("/api/donorlogin", async (req, res) => {
  try {
    const donors = await Donor.find({}, { password: 0 });
    res.json(donors);
  } catch (error) {
    console.error("Error fetching donor details:", error);
    res.status(500).json({ error: "Error fetching donor details" });
  }
});

// Get donor by username
app.get("/api/doctor/:username", async (req, res) => {
  try {
    const user = await Donor.findOne({ username: req.params.username }, { password: 0 });
    if (!user) {
      return res.status(404).json({ error: "Donor not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching donor:", error);
    res.status(500).json({ error: "Error fetching donor details" });
  }
});

// Reset password
app.post("/reset-password", async (req, res) => {
  const { username, newPassword } = req.body;

  try {
    const user = await Donor.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "Username not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ error: "Error resetting password" });
  }
});


// Donor accepts patient
app.post('/api/patients/:id/accept', async (req, res) => {
  const patientId = req.params.id;
  const { donorName, donorId, status } = req.body;

  try {
    const result = await Patient.findByIdAndUpdate(
      patientId,
      {
        status: status,
        acceptedBy: {
          donorName: donorName || "Donor",
          donorId: donorId || null,
          acceptedDate: new Date()
        }
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ message: 'Patient status updated successfully', updatedPatient: result });
  } catch (err) {
    console.error('Error updating patient:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ---------------------------------------------------------------

// Start server
const PORT = 5002;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));