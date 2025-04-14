document.addEventListener('DOMContentLoaded', async () => {
  // ====== PATIENT SIDE LOGIC (check for logged-in user and donation status) ======
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const addbutton = document.querySelector('#addbutton'); // Make sure this element exists
  const dprofile = document.querySelector('#dprofile');   // Patient profile display container
  const dform = document.querySelector('#dform');         // Donation form container

  if (currentUser && currentUser.name) {
    try {
      const response = await fetch('http://localhost:3000/api/patients');
      if (!response.ok) throw new Error('Failed to fetch donation requests');

      const donationRequests = await response.json();
      const userDonation = donationRequests.find(request =>
        request.name.toLowerCase() === currentUser.name.toLowerCase()
      );

      if (userDonation) {
        if (addbutton) addbutton.style.display = 'none';

        const userProfile = createProfileCard(userDonation);
        const removeButton = createRemoveRequestButton(userDonation, userProfile);
        userProfile.appendChild(removeButton);
        dprofile.appendChild(userProfile);

        if (
          userDonation.status === 'accepted' &&
          userDonation.acceptedDonors &&
          userDonation.acceptedDonors.length > 0
        ) {
          userProfile.style.backgroundColor = '#dff0d8';
          userProfile.style.borderColor = '#4CAF50';
          if (dform) dform.classList.add('donation-accepted');

          const mostRecentDonor = userDonation.acceptedDonors[userDonation.acceptedDonors.length - 1];
          showDonationAcceptedMessage(userDonation.name, mostRecentDonor.donorName);
        } else {
          showWelcomeMessage(currentUser.name, true);
        }
      } else {
        if (addbutton) addbutton.style.display = 'block';
        showWelcomeMessage(currentUser.name, false);
      }

      setInterval(checkForStatusUpdates, 30000);
    } catch (error) {
      console.error('Error checking donation status:', error);
    }
  }

  // ====== DONOR SIDE LOGIC ======
  const usernameFromStorage = localStorage.getItem('donorUsername');
  if (!usernameFromStorage) {
    console.warn('No donorUsername found in localStorage.');
    return;
  }

  const donorUser = { username: usernameFromStorage };
  let donorName = 'Donor';

  try {
    const donorRes = await fetch(`http://localhost:5002/api/donorlogin/${donorUser.username}`);
    const responseText = await donorRes.text();

    let donorData;
    try {
      donorData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse donor data:', e);
      donorData = null;
    }

    if (donorData && donorData.name) {
      donorName = donorData.name;
      localStorage.setItem('donorName', donorName);
    }
  } catch (err) {
    console.error('Error fetching donor details:', err);
    const storedName = localStorage.getItem('donorName');
    if (storedName) donorName = storedName;
  }

  const donateButton = document.querySelector('.donate');
  const detailsContainer = document.createElement('div');
  detailsContainer.classList.add('name-details');
  document.body.appendChild(detailsContainer);

  const selectionButton = document.createElement('button');
  selectionButton.classList.add('selection-button');
  selectionButton.textContent = 'Select Profiles';
  selectionButton.style.display = 'none';
  document.body.appendChild(selectionButton);

  // Get previously selected patients from localStorage
  let selectedPatients = JSON.parse(localStorage.getItem(`selectedPatients_${donorUser.username}`) || '[]');

  // Function to update UI based on selected patients
  function updateSelectionUI() {
    document.querySelectorAll('.patient-checkbox').forEach(checkbox => {
      const patientId = checkbox.dataset.patientId;
      const patientCard = checkbox.closest('.patient-card');
      
      // Check if this patient is in our selectedPatients array
      const isSelected = selectedPatients.some(p => p.id === patientId);
      
      checkbox.checked = isSelected;
      if (isSelected) {
        patientCard.classList.add('selected');
      } else {
        patientCard.classList.remove('selected');
      }
    });

    if (selectedPatients.length > 0) {
      selectionButton.style.display = 'block';
      selectionButton.classList.add('show');
    } else {
      selectionButton.classList.remove('show');
      setTimeout(() => {
        selectionButton.style.display = 'none';
      }, 300);
    }
  }

  // Function to save selected patients to localStorage
  function saveSelectedPatients() {
    localStorage.setItem(`selectedPatients_${donorUser.username}`, JSON.stringify(selectedPatients));
  }

  donateButton?.addEventListener('click', async () => {
    try {
      const refreshDonor = await fetch(`http://localhost:5002/api/donordetail/${donorUser.username}`);
      if (refreshDonor.ok) {
        const refreshData = await refreshDonor.json();
        donorName = refreshData.name || donorName;
      }

      const response = await fetch('http://localhost:3000/api/patients');
      if (!response.ok) throw new Error('Failed to fetch patient details');

      const patients = await response.json();
      detailsContainer.innerHTML = '<h2>Patient Details</h2>';
      
      // Keep track of patient IDs that are still available
      const currentPatientIds = new Set();

      patients.forEach(patient => {
        currentPatientIds.add(patient._id);
        
        const patientCard = document.createElement('div');
        patientCard.classList.add('patient-card');
        patientCard.dataset.patientId = patient._id;
        patientCard.dataset.patientName = patient.name;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('patient-checkbox');
        checkbox.dataset.patientMobile = patient.mobileNumber;
        checkbox.dataset.patientId = patient._id;
        checkbox.dataset.patientName = patient.name;

        const photoHtml = patient.photoPath
          ? `<img src="http://localhost:3000/${patient.photoPath}" alt="Patient Photo" style="max-width: 200px; max-height: 200px; object-fit: cover;">`
          : '<p>No photo uploaded</p>';

        patientCard.innerHTML = `
          <div class="checkbox-container">
            ${checkbox.outerHTML}
          </div>
          <div class="patient-details">
            ${photoHtml}
            <p><strong>Name:</strong> ${patient.name}</p>
            <p><strong>Age:</strong> ${patient.age}</p>
            <p><strong>Mobile Number:</strong> ${patient.mobileNumber}</p>
            <p><strong>Gender:</strong> ${patient.gender}</p>
            <p><strong>Mail ID:</strong> ${patient.mailId}</p>
            <p><strong>UPI ID:</strong> ${patient.upiId}</p>
            <p><strong>Account Number:</strong> ${patient.accountNumber}</p>
          </div>
        `;

        detailsContainer.appendChild(patientCard);
      });

      // Filter out patients that no longer exist
      selectedPatients = selectedPatients.filter(p => currentPatientIds.has(p.id));
      saveSelectedPatients();

      detailsContainer.style.display = 'block';

      document.querySelectorAll('.patient-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
          const patientCard = this.closest('.patient-card');
          const patientMobile = this.dataset.patientMobile;
          const patientDetails = patientCard.querySelector('.patient-details').innerText;
          const patientId = this.dataset.patientId;
          const patientName = this.dataset.patientName;

          if (this.checked) {
            patientCard.classList.add('selected');
            // Check if not already in array
            if (!selectedPatients.some(p => p.id === patientId)) {
              selectedPatients.push({
                id: patientId,
                name: patientName,
                mobile: patientMobile,
                details: patientDetails
              });
            }
          } else {
            patientCard.classList.remove('selected');
            selectedPatients = selectedPatients.filter(p => p.id !== patientId);
          }

          // Save to localStorage when selection changes
          saveSelectedPatients();

          if (selectedPatients.length > 0) {
            selectionButton.style.display = 'block';
            selectionButton.classList.add('show');
          } else {
            selectionButton.classList.remove('show');
            setTimeout(() => {
              selectionButton.style.display = 'none';
            }, 300);
          }
        });
      });

      // Apply stored selections to the UI after checkboxes are created
      updateSelectionUI();

    } catch (error) {
      console.error('Error fetching patient details:', error);
      detailsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  });

  selectionButton.addEventListener('click', async () => {
    try {
      // Track which patients are newly selected vs. already processed
      const newlySelectedPatients = selectedPatients.filter(p => !p.processed);
      
      for (const patient of newlySelectedPatients) {
        await fetch(`http://localhost:3000/api/patients/${patient.id}/accept`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            donorName: donorName,
            donorId: donorUser.username,
            status: 'accepted'
          }),
        });

        const message = `Hi ${patient.name}, I have visited your request in my login. Your details are: ${patient.details.replace(/\s+/g, ' ').trim()}. If you declare all details you entered is correct, we can proceed with donation. - ${donorName}`;
        const whatsappUrl = `https://wa.me/${patient.mobile}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        // Mark this patient as processed
        patient.processed = true;
      }
      
      // Save updated status to localStorage
      saveSelectedPatients();

      if (newlySelectedPatients.length > 0) {
        alert(`Successfully selected ${newlySelectedPatients.length} patient(s) for donation!`);
      } else {
        alert('These patients have already been processed. Select new patients or remove these selections.');
      }

    } catch (error) {
      console.error('Error processing selection:', error);
      alert('Failed to process your selection. Please try again.');
    }
  });

  // Add a clear button to remove selected patients
  const clearButton = document.createElement('button');
  clearButton.classList.add('clear-selection-button');
  clearButton.textContent = 'Clear Selections';
  clearButton.style.display = 'none';
  document.body.appendChild(clearButton);

  // Update the clear button visibility whenever selectedPatients changes
  function updateClearButtonVisibility() {
    if (selectedPatients.length > 0) {
      clearButton.style.display = 'block';
    } else {
      clearButton.style.display = 'none';
    }
  }

  // Initial setup of clear button
  updateClearButtonVisibility();

  clearButton.addEventListener('click', () => {
    selectedPatients = [];
    saveSelectedPatients();
    updateSelectionUI();
    updateClearButtonVisibility();
    alert('All selections cleared');
  });

  // Add some CSS for the clear button
  const style = document.createElement('style');
  style.textContent = `
    .clear-selection-button {
      position: fixed;
      bottom: 20px;
      left: 20px;
      padding: 10px 15px;
      background-color: #f44336;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      z-index: 1000;
      transition: all 0.3s ease;
    }
    
    .clear-selection-button:hover {
      background-color: #d32f2f;
      transform: scale(1.05);
    }
  `;
  document.head.appendChild(style);
});