const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require('bcryptjs');

// Initialize the app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
const mongoURI = "mongodb://localhost:27017/patientlogin";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error: ", err));

// Create a Schema and Model for Patients
const patientSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  password: String,
});

const Patient = mongoose.model("Patient", patientSchema);

// API Endpoint for Signup
app.post("/signup", async (req, res) => {
  const { name, username, password } = req.body;

  try {
    // Check if username already exists
    const existingUser = await Patient.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new patient
    const newPatient = new Patient({
      name,
      username,
      password: hashedPassword,
    });

    await newPatient.save();
    console.log("Data saved successfully:", { name, username }); 
    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Error saving patient details:", error);
    res.status(500).json({ error: "Error saving patient details" });
  }
});

// Signin Route
app.post("/signin", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await Patient.findOne({ username });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Log original (unhashed) password
        console.log('Entered Password (Unhashed):', password);

        // Check if the stored password is already hashed
        const isHashed = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');

        let isMatch;
        if (isHashed) {
            // If already hashed, use bcrypt comparison
            isMatch = await bcrypt.compare(password, user.password);
            
            // Log hashed password from database
            console.log('Stored Hashed Password:', user.password);
        } else {
            // If not hashed, do direct comparison and then hash for future
            isMatch = password === user.password;

            if (isMatch) {
                // Hash the existing plain text password
                const hashedPassword = await bcrypt.hash(password, 10);
                
                // Log the newly created hash
                console.log('Newly Created Hashed Password:', hashedPassword);

                // Update user's password with hashed version
                await Patient.findByIdAndUpdate(user._id, { password: hashedPassword });
            }
        }

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Successful login
        res.status(200).json({
            message: 'Login successful',
            user: {
                name: user.name,
                username: user.username
            }
        });
    } catch (error) {
        console.error('Signin Error:', error);
        res.status(500).json({ error: 'Server error during signin' });
    }
});
// Password Reset Route
app.post("/reset-password", async (req, res) => {
  const { username, newPassword } = req.body;

  try {
      // Check if user exists
      const user = await Patient.findOne({ username });
      if (!user) {
          return res.status(400).json({ error: "User not found" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password in the database
      await Patient.updateOne({ username }, { password: hashedPassword });

      res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ error: "Server error during password reset" });
  }
});


// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));