// mainserver.js

const { spawn } = require('child_process');
const path = require('path');

// Paths to your server files
const server2Path = path.join(__dirname, 'script2.js');
const patientServerPath = path.join(__dirname, 'patientserver.js');
const donorServerPath = path.join(__dirname, 'donorserver.js');

// Function to start a server
const startServer = (serverPath) => {
  const serverProcess = spawn('node', [serverPath]);

  // Log server output
  serverProcess.stdout.on('data', (data) => {
    console.log(`Server output: ${data}`);
  });

  // Log errors if any
  serverProcess.stderr.on('data', (data) => {
    console.error(`Server error: ${data}`);
  });

  // Log when server is closed
  serverProcess.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });
};

// Start all three servers
startServer(server2Path);
startServer(patientServerPath);
startServer(donorServerPath);

console.log('All servers are running!');
