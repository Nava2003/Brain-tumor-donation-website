document.addEventListener('DOMContentLoaded', () => {
  const donateButton = document.querySelector('.donate');
  const detailsContainer = document.createElement('div');
  detailsContainer.classList.add('name-details');
  document.body.appendChild(detailsContainer);

  // Create selection button (initially hidden)
  const selectionButton = document.createElement('button');
  selectionButton.classList.add('selection-button');
  selectionButton.textContent = 'Select Profiles';
  selectionButton.style.display = 'none';
  document.body.appendChild(selectionButton);

  // Track selected patients
  let selectedPatients = [];
  
  // Load the MongoDB client script
  const mongoScript = document.createElement('script');
  mongoScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/mongodb/4.13.0/mongodb.min.js';
  document.head.appendChild(mongoScript);
  
  // Add CSS for accepted profiles
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .patient-card.accepted {
      background-color: #a8f0b0 !important; /* Light green background */
      border: 2px solid #28a745 !important; /* Green border */
      transition: all 0.3s ease;
    }
    .acceptance-badge {
      background-color: #28a745;
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
      display: inline-block;
      margin: 5px 0;
      font-weight: bold;
    }
  `;
  document.head.appendChild(styleElement);
  
  donateButton.addEventListener('click', async () => {
    try {
        // Get current donor from localStorage - FIXED: Use consistent storage keys
        const donorUsername = localStorage.getItem('donorUsername');
        let donorName = localStorage.getItem('donorName') || 'Anonymous';
        
        // Optional: refresh donor name
        if (donorUsername) {
            try {
                const refreshDonor = await fetch(`http://localhost:5002/api/donor/${donorUsername}`);
                if (refreshDonor.ok) {
                    const refreshData = await refreshDonor.json();
                    donorName = refreshData.name || donorName;
                    console.log('Refreshed donor name:', donorName);
                }
            } catch (refreshError) {
                console.error('Error refreshing donor info:', refreshError);
                // Continue with the stored donor name
            }
        }

        const response = await fetch('http://localhost:3000/api/patients');
        if (!response.ok) throw new Error('Failed to fetch patient details');

        const patients = await response.json();
        detailsContainer.innerHTML = '<h2>Patient Details</h2>';
        selectedPatients = [];
        selectionButton.style.display = 'none';

        patients.forEach(patient => {
            const patientCard = document.createElement('div');
            patientCard.classList.add('patient-card');
            patientCard.dataset.patientId = patient._id;
            patientCard.dataset.patientName = patient.name;
            
            // Check if this patient is already accepted
            const isAccepted = patient.status === 'accepted' || 
                (patient.acceptedBy && patient.acceptedBy.donorId);
            
            // If accepted, add the 'accepted' class to highlight with green
            if (isAccepted) {
                patientCard.classList.add('accepted');
            }
            
            // Check if this donor already accepted this patient
            const acceptedByThisDonor = patient.acceptedBy && 
                patient.acceptedBy.donorId === donorUsername;
            
            // Skip checkbox for accepted patients
            let checkboxHtml = '';
            if (!isAccepted) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('patient-checkbox');
                checkbox.dataset.patientMobile = patient.mobileNumber;
                checkbox.dataset.patientId = patient._id;
                checkbox.dataset.patientName = patient.name;
                checkboxHtml = checkbox.outerHTML;
            }

            // Show acceptance badge if accepted
            let acceptanceBadge = '';
            if (isAccepted) {
                const acceptorName = patient.acceptedBy ? patient.acceptedBy.donorName : 'a donor';
                acceptanceBadge = `
                    <div class="acceptance-badge">
                        Accepted by ${acceptorName}
                        ${acceptedByThisDonor ? ' (You)' : ''}
                    </div>
                `;
            }

            // Add a note if this patient already has donors
            let donorsNote = '';
            if (!isAccepted && patient.acceptedDonors && patient.acceptedDonors.length > 0) {
                donorsNote = `
                    <div class="existing-donors" style="background-color: #f8f9fa; border-radius: 5px; padding: 5px; margin-top: 5px;">
                        <p><strong>Note:</strong> This patient already has ${patient.acceptedDonors.length} donor(s).</p>
                    </div>
                `;
            }

            const photoHtml = patient.photoPath
              ? `<img src="http://localhost:3000/${patient.photoPath}" alt="Patient Photo" style="max-width: 200px; max-height: 200px; object-fit: cover;">`
              : '<p>No photo uploaded</p>';

            patientCard.innerHTML = `
              <div class="checkbox-container">
                ${checkboxHtml}
              </div>
              <div class="patient-details">
                ${photoHtml}
                ${acceptanceBadge}
                <p><strong>Name:</strong> ${patient.name}</p>
                <p><strong>Age:</strong> ${patient.age}</p>
                <p><strong>Mobile Number:</strong> ${patient.mobileNumber}</p>
                <p><strong>Gender:</strong> ${patient.gender}</p>
                <p><strong>Mail ID:</strong> ${patient.mailId}</p>
                <p><strong>UPI ID:</strong> ${patient.upiId}</p>
                <p><strong>Account Number:</strong> ${patient.accountNumber}</p>
                ${donorsNote}
              </div>
            `;

            detailsContainer.appendChild(patientCard);
        });

        detailsContainer.style.display = 'block';

        document.querySelectorAll('.patient-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                if (this.checked) {
                    // Add to selected patients
                    selectedPatients.push({
                        id: this.dataset.patientId,
                        name: this.dataset.patientName,
                        mobile: this.dataset.patientMobile,
                        details: this.closest('.patient-card').querySelector('.patient-details').textContent
                    });
                    this.closest('.patient-card').classList.add('selected');
                } else {
                    // Remove from selected patients
                    selectedPatients = selectedPatients.filter(p => p.id !== this.dataset.patientId);
                    this.closest('.patient-card').classList.remove('selected');
                }
                
                // Show/hide selection button based on selection
                if (selectedPatients.length > 0) {
                    selectionButton.style.display = 'block';
                    selectionButton.classList.add('show');
                    selectionButton.textContent = `Select ${selectedPatients.length} Profile${selectedPatients.length > 1 ? 's' : ''}`;
                } else {
                    selectionButton.classList.remove('show');
                    setTimeout(() => {
                        selectionButton.style.display = 'none';
                    }, 300);
                }
            });
        });

    } catch (error) {
        console.error('Error fetching patient details:', error);
        detailsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});

  // Handle selection button click
  selectionButton.addEventListener('click', async () => {
    try {
      // FIXED: Use consistent storage keys for donor information
      const donorUsername = localStorage.getItem('donorUsername');
      const donorName = localStorage.getItem('donorName') || 'Anonymous Donor';
      
      // For each selected patient, mark them as accepted and open WhatsApp
      for (const patient of selectedPatients) {
        // Update the patient's status in the database
        const updateResponse = await fetch(`http://localhost:3000/api/patients/${patient.id}/accept`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 'accepted',
            donorName: donorName,
            donorId: donorUsername || null
          })
        });
        
        if (!updateResponse.ok) {
          console.warn(`Failed to update status for patient: ${patient.name}`);
        } else {
          // Update UI to show this patient is now accepted
          const patientCard = document.querySelector(`.patient-card[data-patient-id="${patient.id}"]`);
          if (patientCard) {
            // Add the accepted class for green background
            patientCard.classList.add('accepted');
            
            // Remove the checkbox
            const checkboxContainer = patientCard.querySelector('.checkbox-container');
            if (checkboxContainer) {
              checkboxContainer.innerHTML = '';
            }
            
            // Add acceptance badge
            const detailsDiv = patientCard.querySelector('.patient-details');
            if (detailsDiv) {
              const acceptanceBadge = document.createElement('div');
              acceptanceBadge.className = 'acceptance-badge';
              acceptanceBadge.textContent = `Accepted by ${donorName} (You)`;
              detailsDiv.insertBefore(acceptanceBadge, detailsDiv.firstChild);
            }
          }
        }
        
        // Format message for WhatsApp
        const cleanDetails = patient.details
          .replace(/\s+/g, ' ')
          .trim();
        
        const message = `Hi ${patient.name}, I have visited your request in my login. Your details are: ${cleanDetails}. If you declare all details you entered is correct, we can proceed with donation. - ${donorName}`;
        
        // Create WhatsApp URL with encoded message
        const whatsappUrl = `https://wa.me/${patient.mobile}?text=${encodeURIComponent(message)}`;
        
        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');
      }
      
      // Show success message
      alert(`Successfully selected ${selectedPatients.length} patient(s) for donation!`);
      
      // Clear selections
      selectedPatients = [];
      document.querySelectorAll('.patient-checkbox').forEach(checkbox => {
        checkbox.checked = false;
        checkbox.closest('.patient-card').classList.remove('selected');
      });
      
      // Hide selection button
      selectionButton.classList.remove('show');
      setTimeout(() => {
        selectionButton.style.display = 'none';
      }, 300);
      
    } catch (error) {
      console.error('Error processing selection:', error);
      alert('Failed to process your selection. Please try again.');
    }
  });
});