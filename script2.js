const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// MongoDB connection with specific database name
mongoose.connect('mongodb://localhost:27017/patients', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB database: patients');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Patient Schema with collection name specified
// In script2.js, update the Patient Schema:

const patientSchema = new mongoose.Schema({
    name: String,
    age: Number,
    mobileNumber: String,
    gender: String,
    mailId: String,
    photoPath: String,
    upiId: String,
    accountNumber: String,
    status: {
        type: String,
        enum: ['pending', 'accepted', 'completed'],
        default: 'pending'
    },
    // Replace single acceptedBy with an array of donors
    acceptedDonors: [{
        donorName: String,
        donorId: String,
        acceptedDate: Date
    }]
}, { collection: 'donationrequests' });

const Patient = mongoose.model('Patient', patientSchema);

// API endpoints
app.post('/api/patients', upload.single('photo'), async (req, res) => {
    try {
        const newPatient = new Patient({
            name: req.body.name,
            age: req.body.age,
            mobileNumber: req.body.mobilenumber,
            gender: req.body.gender,
            mailId: req.body.mailid,
            photoPath: req.file ? req.file.path : '',
            upiId: req.body.upiid,
            accountNumber: req.body.accountnumber,
            status: 'pending'
        });

        const savedPatient = await newPatient.save();
        console.log('Patient saved successfully:', savedPatient);
        res.status(201).json(savedPatient);
    } catch (error) {
        console.error('Error saving patient:', error);
        res.status(500).json({ error: 'Error saving patient data' });
    }
});

// Accept patient request endpoint
// In script2.js, update the accept endpoint:

// Accept patient request endpoint
app.post('/api/patients/:id/accept', async (req, res) => {
    try {
        const patientId = req.params.id;
        const { donorName, donorId, status } = req.body;
        
        // Find the patient
        const patient = await Patient.findById(patientId);
        
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        
        // Check if this donor has already accepted this request
        const existingDonor = patient.acceptedDonors && 
            patient.acceptedDonors.find(donor => donor.donorId === donorId);
            
        if (existingDonor) {
            return res.status(400).json({ 
                error: 'You have already accepted this donation request' 
            });
        }
        
        // Create new donor object
        const newDonor = {
            donorName: donorName,
            donorId: donorId,
            acceptedDate: new Date()
        };
        
        // Update patient - add new donor to array and update status
        const updatedPatient = await Patient.findByIdAndUpdate(
            patientId,
            {
                status: status || 'accepted',
                // Use $push to add to the array without removing existing donors
                $push: { acceptedDonors: newDonor }
            },
            { new: true } // Return the updated document
        );
        
        res.status(200).json({
            message: 'Patient status updated successfully',
            patient: updatedPatient
        });
    } catch (error) {
        console.error('Error updating patient status:', error);
        res.status(500).json({ error: 'Error updating patient status' });
    }
});

app.delete('/api/patients/:id', async (req, res) => {
    try {
        const result = await Patient.findByIdAndDelete(req.params.id);
        if (result) {
            console.log('Patient deleted successfully:', req.params.id);
            res.status(200).json({ message: 'Patient deleted successfully' });
        } else {
            res.status(404).json({ error: 'Patient not found' });
        }
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({ error: 'Error deleting patient' });
    }
});

// Add a GET endpoint to fetch all patients
app.get('/api/patients', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.status(200).json(patients);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ error: 'Error fetching patients' });
    }
});

// Endpoint to get donor name
app.get('/api/fetchDonorName', async (req, res) => {
    try {
        // Get donor name from session or auth token
        // This is a simplified example - you should get this from authentication
        const donorName = req.session?.user?.name || 'Donor';
        res.status(200).json({ name: donorName });
    } catch (error) {
        console.error('Error fetching donor name:', error);
        res.status(500).json({ error: 'Error fetching donor name' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});