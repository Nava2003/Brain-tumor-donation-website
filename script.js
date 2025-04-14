function validatePhoneNumber(phone) {
    const phonePattern = /^(\+91)?[6-9]\d{9}$/;
    return phonePattern.test(phone.replace(/\s/g, ''));
}

function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

function validateUpiId(upi) {
    const upiPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]{3,}$/;
    return upiPattern.test(upi);
}

function validateAccountNumber(account) {
    const accountPattern = /^\d{9,18}$/;
    return accountPattern.test(account.replace(/\s/g, ''));
}

function showValidationError(input, message) {
    const existingError = input.parentElement.querySelector('.validation-error');
    if (existingError) existingError.remove();

    const errorElement = document.createElement('div');
    errorElement.className = 'validation-error';
    errorElement.textContent = message;
    errorElement.style.color = '#e63946';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '5px';

    input.parentElement.insertBefore(errorElement, input.nextSibling);
    input.style.borderColor = '#e63946';
}

function clearValidationError(input) {
    const existingError = input.parentElement.querySelector('.validation-error');
    if (existingError) existingError.remove();
    input.style.borderColor = '';
}

// Form validation event listeners
document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.querySelector('input[placeholder="Enter your name"]');
    const ageInput = document.querySelector('input[placeholder="Enter your age"]');
    const mobileInput = document.querySelector('input[placeholder="mobile number"]');
    const mailInput = document.querySelector('input[placeholder="Enter your mailid"]');
    const upiInput = document.querySelector('input[placeholder*="upi id"]');
    const accountInput = document.querySelector('input[placeholder*="Bank account number"]');

    if (nameInput) {
        nameInput.addEventListener('input', function() {
            if (this.value.trim().length < 2) {
                showValidationError(this, 'Name must be at least 2 characters');
            } else {
                clearValidationError(this);
            }
        });
    }

    if (ageInput) {
        ageInput.addEventListener('input', function() {
            const age = parseInt(this.value);
            if (isNaN(age) || age < 1 || age > 120) {
                showValidationError(this, 'Please enter a valid age (1-120)');
            } else {
                clearValidationError(this);
            }
        });
    }

    if (mobileInput) {
        mobileInput.addEventListener('input', function() {
            if (!validatePhoneNumber(this.value)) {
                showValidationError(this, 'Enter a valid 10-digit Indian mobile number');
            } else {
                clearValidationError(this);
            }
        });
    }

    if (mailInput) {
        mailInput.addEventListener('input', function() {
            if (this.value && !validateEmail(this.value)) {
                showValidationError(this, 'Please enter a valid email address it should be like (eg abc123 @gmail.com or @hotmail.com)');
            } else {
                clearValidationError(this);
            }
        });
    }

    if (upiInput) {
        upiInput.addEventListener('input', function() {
            if (this.value && !validateUpiId(this.value)) {
                showValidationError(this, 'Enter a valid UPI ID (e.g., username@upi)');
            } else {
                clearValidationError(this);
            }
        });
    }

    if (accountInput) {
        accountInput.addEventListener('input', function() {
            if (this.value && !validateAccountNumber(this.value)) {
                showValidationError(this, 'Enter a valid account number (9-18 digits)');
            } else {
                clearValidationError(this);
            }
        });
    }

    const savebutton = document.querySelector('.savebutton');
    if (savebutton) {
        savebutton.addEventListener('click', function(event) {
            const form = document.querySelector('.dform');
            let isValid = true;

            if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
                showValidationError(nameInput, 'Name is required (min 2 characters)');
                isValid = false;
            }

            const age = parseInt(ageInput.value);
            if (!ageInput.value || isNaN(age) || age < 1 || age > 120) {
                showValidationError(ageInput, 'Valid age is required (1-120)');
                isValid = false;
            }

            if (!mobileInput.value || !validatePhoneNumber(mobileInput.value)) {
                showValidationError(mobileInput, 'Valid 10-digit mobile number is required');
                isValid = false;
            }

            if (mailInput.value && !validateEmail(mailInput.value)) {
                showValidationError(mailInput, 'Enter a valid email address');
                isValid = false;
            }

            if (upiInput.value && !validateUpiId(upiInput.value)) {
                showValidationError(upiInput, 'Enter a valid UPI ID (e.g., username@upi)');
                isValid = false;
            }

            if (accountInput.value && !validateAccountNumber(accountInput.value)) {
                showValidationError(accountInput, 'Enter a valid account number (9-18 digits)');
                isValid = false;
            }

            if (!isValid) {
                event.preventDefault();
                event.stopPropagation();

                const validationMessage = document.createElement('div');
                validationMessage.className = 'validation-message';
                validationMessage.textContent = 'Please correct the errors in the form.';
                validationMessage.style.color = '#e63946';
                validationMessage.style.fontSize = '1rem';
                validationMessage.style.marginTop = '15px';
                validationMessage.style.textAlign = 'center';
                validationMessage.style.fontWeight = 'bold';

                const existingMessage = form.querySelector('.validation-message');
                if (existingMessage) existingMessage.remove();

                form.appendChild(validationMessage);

                form.classList.add('shake');
                setTimeout(() => {
                    form.classList.remove('shake');
                }, 500);

                return false;
            }
        }, true);
    }
});

// Add CSS for validation shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .shake {
        animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
    
    .validation-error {
        animation: fadeIn 0.3s ease-in-out;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Form and navigation elements
var nav2 = document.querySelector(".nav2");
var addbutton = document.querySelector(".addbutton");
var dform = document.querySelector(".dform");
var cancelbutton = document.querySelector(".cancelbutton");
var savebutton = document.querySelector(".savebutton");
var donorinfo = document.querySelector(".donorinfo");
var donordetails = document.querySelector(".donordetails");
var dprofile = document.querySelector(".dprofile");

// Function to periodically check for status updates
async function checkForStatusUpdates() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.name) return;
    
    try {
        const response = await fetch('http://localhost:3000/api/patients');
        if (!response.ok) throw new Error('Failed to fetch donation requests');
        
        const donationRequests = await response.json();
        const userDonation = donationRequests.find(request => 
            request.name.toLowerCase() === currentUser.name.toLowerCase());
            
        // If user has a donation request
        if (userDonation) {
            // First check if the status has changed to accepted
            if (userDonation.status === 'accepted' && 
                userDonation.acceptedDonors && 
                userDonation.acceptedDonors.length > 0) {
                
                // If this is the first time we've detected the status change
                const statusChangeKey = `statusChange_${userDonation._id}`;
                const previousStatus = localStorage.getItem(statusChangeKey);
                
                // If status was previously not "accepted" or this is the first time checking
                if (previousStatus !== 'accepted') {
                    // Update the profile card if it exists
                    const profileCard = document.querySelector(`.dprofile-card[data-patient-id="${userDonation._id}"]`);
                    if (profileCard) {
                        profileCard.style.backgroundColor = '#dff0d8';
                        profileCard.style.borderColor = '#4CAF50';
                    }
                    
                    // Change dform background color to green
                    if (dform) {
                        dform.classList.add('donation-accepted');
                    }
                    
                    // Get the most recent donor who accepted the request
                    const mostRecentDonor = userDonation.acceptedDonors[userDonation.acceptedDonors.length - 1];
                    
                    // Show the congratulations message
                    showDonationAcceptedMessage(userDonation.name, mostRecentDonor.donorName);
                    
                    // Mark status as seen in localStorage
                    localStorage.setItem(statusChangeKey, 'accepted');
                }
                
                // Additionally check for new donors
                userDonation.acceptedDonors.forEach(donor => {
                    const notificationKey = `notificationShown_${userDonation._id}_${donor.donorId}`;
                    const notificationShown = localStorage.getItem(notificationKey);
                    
                    if (!notificationShown) {
                        // Show notification for this specific donor
                        showDonationAcceptedMessage(userDonation.name, donor.donorName);
                        
                        // Mark as shown
                        localStorage.setItem(notificationKey, 'true');
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error checking for status updates:', error);
    }
}

// Improved donation accepted message function
function showDonationAcceptedMessage(patientName, donorName) {
    // Remove any existing notifications first
    const existingNotifications = document.querySelectorAll('.donation-notification');
    existingNotifications.forEach(notification => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    });
    
    const notificationMessage = document.createElement('div');
    notificationMessage.className = 'donation-notification';
    notificationMessage.innerHTML = `
        <p><strong>Congratulations, ${patientName}!</strong></p>
        <p>Your donation request has been accepted by ${donorName}.</p>
        <p>Check your WhatsApp for details.</p>
    `;
    
    // Add some additional styling
    notificationMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #dff0d8;
        border: 2px solid #4CAF50;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 1000;
        opacity: 0;
        transform: translateY(-20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
    `;
    
    document.body.appendChild(notificationMessage);
    
    // Trigger animation
    setTimeout(() => {
        notificationMessage.style.opacity = '1';
        notificationMessage.style.transform = 'translateY(0)';
    }, 100);
    
    // Remove after 10 seconds
    setTimeout(() => {
        notificationMessage.style.opacity = '0';
        notificationMessage.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (document.body.contains(notificationMessage)) {
                document.body.removeChild(notificationMessage);
            }
        }, 300);
    }, 10000);
}

// Welcome message function
function showWelcomeMessage(name, hasDonation) {
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'welcome-message';
    welcomeMessage.innerHTML = hasDonation ? 
        `<p>Welcome back, <strong>${name}</strong>!</p>
         <p>Your donation request is active.</p>` :
        `<p>Welcome, <strong>${name}</strong>!</p>
         <p>You can now add a donation request.</p>`;
    
    document.body.appendChild(welcomeMessage);
    
    // Trigger animation
    setTimeout(() => {
        welcomeMessage.style.opacity = '1';
        welcomeMessage.style.transform = 'translateY(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        welcomeMessage.style.opacity = '0';
        welcomeMessage.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            document.body.removeChild(welcomeMessage);
        }, 300);
    }, 5000);
}

// Function to clear form inputs
function clearFormInputs() {
    const allInputs = dform.querySelectorAll('input');
    allInputs.forEach(input => {
        if(input.type === 'radio' || input.type === 'checkbox') {
            input.checked = false;
        } else if(input.type === 'file') {
            input.value = '';
        } else {
            input.value = '';
        }
    });
}

// Function to close form with animation
function closeFormWithAnimation() {
    dform.classList.add("zoomOut");
    dform.classList.remove("zoomIn");
    setTimeout(function () {
        dform.style.display = "none";
        clearFormInputs(); // Clear form inputs when closing
    }, 500);
}

// Navigation functions
function opentogglenavbar() {
    nav2.style.left = "0";
    nav2.style.display = "block";
}

function closetogglenavbar() {
    nav2.style.left = "-60%";
}

// Donor notification handler
donorinfo.addEventListener('click', async function(event) {
    event.preventDefault();
    donordetails.style.display = "flex";
    
    try {
        // Clear previous donor details
        donordetails.innerHTML = '';
        
        // Add close button at the top-right of donordetails
        const closeButton = document.createElement('button');
        closeButton.className = 'close-donor-details';
        closeButton.innerHTML = '×';
        donordetails.appendChild(closeButton);

        // Event listener to close the donor details when X is clicked
        closeButton.addEventListener('click', function() {
            donordetails.style.display = "none";
        });
        
        // Updated API endpoint to fetch donors from donorlogin database
        const response = await fetch('http://localhost:5002/api/donorlogin');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const donors = await response.json();
        
        if (donors.length === 0) {
            donordetails.innerHTML = '<p>No donor details available</p>';
            return;
        }

        donors.forEach(donor => {
            const donorCard = document.createElement('div');
            donorCard.className = 'donor-card';
            
            // Construct the full image URL
            const photoUrl = donor.photo 
                ? `http://localhost:5002/uploaded/${donor.photo}`
                : 'path/to/default-photo.png'; // Add a default photo path
            
            donorCard.innerHTML = `
                <div class="donor-photo">
                    <img src="${photoUrl}" alt="${donor.name}'s photo" 
                         onerror="this.src='path/to/default-photo.png'" 
                         style="width: 100px; height: 100px; object-fit: cover;">
                </div>
                <div class="donor-info">
                    <h3>Name: ${donor.name || 'N/A'}</h3>
                      <button class="whatsapp"onclick="window.open('https://wa.me/+91${donor.mobilenumber}', '_blank')">
                       <img src="whatsapp.png" alt="WhatsApp" class="whatsapp-icon">
                <p>Mobile: ${donor.mobilenumber || 'N/A'}</p>
            </button>
                </div>
            `;
            donordetails.appendChild(donorCard);
        });
          
    } catch (error) {
        console.error('Error fetching donor details:', error);
        donordetails.innerHTML = `
            <div class="error-message">
                <p>Error: ${error.message}</p>
                <p>Please make sure the server is running on port 5002</p>
            </div>
        `;
    }
});

// Add button click handler - Show form
addbutton.addEventListener("click", function(event) {
    event.preventDefault();
    clearFormInputs();
    
    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.name) {
        // Pre-fill the name field with the logged-in user's name
        const nameInput = document.querySelector('input[placeholder="Enter your name"]');
        if (nameInput) {
            nameInput.value = currentUser.name;
            // Optionally disable the name field to prevent changes
            nameInput.readOnly = true;
        }
    }
    
    dform.style.display = "flex";
    dform.classList.remove("zoomOut");
    dform.classList.add("zoomIn");
});

// Cancel button click handler - Close form
cancelbutton.addEventListener("click", function() {
    clearFormInputs();
    dform.classList.add("zoomOut");
    dform.classList.remove("zoomIn");
    setTimeout(function() {
        dform.style.display = "none";
    }, 500);
});

// Save button click handler - Save form data
savebutton.addEventListener("click", async function(event) {
    event.preventDefault();  // Prevent form submission
    try {
        const formData = new FormData();
        const nameInput = document.querySelector('input[placeholder="Enter your name"]');
        const ageInput = document.querySelector('input[placeholder="Enter your age"]');
        const mobileInput = document.querySelector('input[placeholder="mobile number"]');
        const genderInput = document.querySelector('input[name="Gender"]:checked');
        const mailInput = document.querySelector('input[placeholder="Enter your mailid"]');
        const photoInput = document.querySelector('.image-upload');
        const upiInput = document.querySelector('input[placeholder*="upi id"]');
        const accountInput = document.querySelector('input[placeholder*="Bank account number"]');

        // Validate required fields
        if (!nameInput.value || !ageInput.value || !mobileInput.value) {
            alert('Please fill in all required fields');
            return;
        }

        // Append form data
        formData.append('name', nameInput.value);
        formData.append('age', ageInput.value);
        formData.append('mobilenumber', mobileInput.value);
        formData.append('gender', genderInput ? genderInput.value : '');
        formData.append('mailid', mailInput.value);
        formData.append('upiid', upiInput.value);
        formData.append('accountnumber', accountInput.value);

        if (photoInput.files[0]) {
            formData.append('photo', photoInput.files[0]);
        }

        // Send data to backend
        const response = await fetch('http://localhost:3000/api/patients', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to save patient data');
        }

        const savedPatient = await response.json();

        // Create profile card and add content
        const newProfile = createProfileCard(savedPatient, photoInput);

        // Add remove request button to profile
        const removeButton = createRemoveRequestButton(savedPatient, newProfile);
        newProfile.appendChild(removeButton);

        // Add profile to page
        dprofile.appendChild(newProfile);

        // Hide add button after saving
        addbutton.style.display = 'none';

        // Trigger tick mark animation with donation request text
        showTickMarkAnimation('Donation request added');

        // Reset and close form after saving
        clearFormInputs();
        closeFormWithAnimation();

    } catch (error) {
        console.error('Error saving patient:', error);
        alert('Failed to save patient profile');
    }
});

// Check for logged-in user and donation status when page loads
document.addEventListener('DOMContentLoaded', async function() {
    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser && currentUser.name) {
        try {
            // Fetch all donation requests
            const response = await fetch('http://localhost:3000/api/patients');
            if (!response.ok) {
                throw new Error('Failed to fetch donation requests');
            }
            
            const donationRequests = await response.json();
            
            // Check if current user has a donation request
            const userDonation = donationRequests.find(request => 
                request.name.toLowerCase() === currentUser.name.toLowerCase());
            
            if (userDonation) {
                // User has an existing donation request - hide add button
                if (addbutton) {
                    addbutton.style.display = 'none';
                }
                
                // Create and display the user's profile
                const userProfile = createProfileCard(userDonation);
                
                // Add remove request button
                const removeButton = createRemoveRequestButton(userDonation, userProfile);
                userProfile.appendChild(removeButton);
                
                // Add profile to page
                if (dprofile) {
                    dprofile.appendChild(userProfile);
                }
                
                // Check if the donation has been accepted
                if (userDonation.status === 'accepted' && 
                    userDonation.acceptedDonors && 
                    userDonation.acceptedDonors.length > 0) {
                    
                    // Change background color of profile card to green
                    userProfile.style.backgroundColor = '#dff0d8';
                    userProfile.style.borderColor = '#4CAF50';
                    
                    // Change dform background color to green
                    if (dform) {
                        dform.classList.add('donation-accepted');
                    }
                    
                    // Get the most recent donor
                    const mostRecentDonor = userDonation.acceptedDonors[userDonation.acceptedDonors.length - 1];
                    
                    // Show donation accepted notification
                    showDonationAcceptedMessage(userDonation.name, mostRecentDonor.donorName);
                    
                    // Save the current status to localStorage
                    localStorage.setItem(`statusChange_${userDonation._id}`, 'accepted');
                    
                    // Also mark all donors as shown
                    userDonation.acceptedDonors.forEach(donor => {
                        localStorage.setItem(`notificationShown_${userDonation._id}_${donor.donorId}`, 'true');
                    });
                } else {
                    // Show regular welcome message
                    showWelcomeMessage(currentUser.name, true);
                }
            } else {
                // User doesn't have a donation request - show add button
                if (addbutton) {
                    addbutton.style.display = 'block';
                }
                
                // Show welcome message
                showWelcomeMessage(currentUser.name, false);
            }
            
            // Poll for status updates every 30 seconds
            setInterval(checkForStatusUpdates, 30000);
            
        } catch (error) {
            console.error('Error checking donation status:', error);
        }
    }
});

// Helper functions

// Create a profile card element
function createProfileCard(patientData, photoInput = null) {
    const profileCard = document.createElement("div");
    profileCard.classList.add("dprofile-card");
    profileCard.dataset.patientId = patientData._id;
    profileCard.style = `background: linear-gradient(145deg, #f0f0f0, #e0e0e0); border-radius: 15px; padding: 20px; margin: 15px; text-align: center; width: 250px; transition: transform 0.3s, box-shadow 0.3s; display: flex; flex-direction: column; align-items: center; position: relative;`;

    // If the patient's donation has been accepted, set green background
    if (patientData.status === 'accepted' && patientData.acceptedDonors && patientData.acceptedDonors.length > 0) {
        profileCard.style.backgroundColor = '#dff0d8';
        profileCard.style.borderColor = '#4CAF50';
        
        // Also update the dform if it exists
        if (dform) {
            dform.classList.add('donation-accepted');
        }
    }

    // Add photo if available
    if (photoInput && photoInput.files[0]) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(photoInput.files[0]);
        img.alt = "Patient Image";
        img.style = `max-width: 100px; max-height: 100px; border-radius: 8px; margin-bottom: 15px;`;
        profileCard.appendChild(img);
    } else if (patientData.photoPath) {
        const img = document.createElement("img");
        img.src = `http://localhost:3000/${patientData.photoPath}`;
        img.alt = "Patient Image";
        img.style = `max-width: 100px; max-height: 100px; border-radius: 8px; margin-bottom: 15px;`;
        img.onerror = function() {
            this.src = 'path/to/default-photo.png';
        };
        profileCard.appendChild(img);
    }

    // Add profile content
    const profileContent = `
        <p><strong>Name:</strong> ${patientData.name}</p>
        <p><strong>Age:</strong> ${patientData.age}</p>
        <p><strong>Mobile Number:</strong> ${patientData.mobileNumber || patientData.mobilenumber}</p>
        <p><strong>Gender:</strong> ${patientData.gender}</p>
        <p><strong>Mail ID:</strong> ${patientData.mailId || patientData.mailid}</p>
        <p><strong>UPI ID:</strong> ${patientData.upiId || patientData.upiid}</p>
        <p><strong>Account Number:</strong> ${patientData.accountNumber || patientData.accountnumber}</p>
    `;
    const profileText = document.createElement("div");
    profileText.innerHTML = profileContent;
    profileCard.appendChild(profileText);

    // Add donation status if it exists - Show all donors
    if (patientData.status === 'accepted' && patientData.acceptedDonors && patientData.acceptedDonors.length > 0) {
        const statusInfo = document.createElement('div');
        statusInfo.className = 'donation-status';
        
        // Create HTML for each donor
        let donorsHtml = '<div style="margin-top: 5px; width: 100%;">';
        
        patientData.acceptedDonors.forEach((donor, index) => {
            donorsHtml += `
                <div style="margin-bottom: 5px; padding: 5px; background-color: rgba(76, 175, 80, 0.1); border-radius: 5px;">
                    <p><strong>Donor ${index + 1}:</strong> ${donor.donorName}</p>
                    <p><strong>Date:</strong> ${new Date(donor.acceptedDate).toLocaleDateString()}</p>
                </div>
            `;
        });
        
        donorsHtml += '</div>';
        
        statusInfo.innerHTML = `
            <p><strong>Status:</strong> Accepted by ${patientData.acceptedDonors.length} donor(s)</p>
            ${donorsHtml}
        `;
        
        statusInfo.style = `
            margin-top: 15px;
            padding: 10px;
            background-color: rgba(76, 175, 80, 0.1);
            border-radius: 5px;
            width: 100%;
        `;
        profileCard.appendChild(statusInfo);
    }

    // Hover effect for profile card
    profileCard.onmouseover = () => {
        profileCard.style.transform = "scale(1.05)";
        profileCard.style.boxShadow = "0 12px 20px rgba(0, 0, 0, 0.15)";
    };
    profileCard.onmouseout = () => {
        profileCard.style.transform = "scale(1)";
        profileCard.style.boxShadow = "0 8px 15px rgba(0, 0, 0, 0.1)";
    };

    return profileCard;
}
// Create remove request button
function createRemoveRequestButton(patientData, profileCard) {
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove Request";
    removeButton.className = "delete";
    removeButton.style.cssText = `
        display: block;
        margin-top: 10px;
        background-color: #e63946;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1.2rem;
    `;

    // Handle remove button click
    removeButton.addEventListener('click', async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/patients/${patientData._id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete patient');
            }

            // Remove profile card
            profileCard.remove();
            
            // Show add button again
            addbutton.style.display = 'block';

            // Trigger cross mark animation
            showCrossMarkAnimation('Donation request removed');

        } catch (error) {
            console.error('Error deleting patient:', error);
            alert('Failed to delete patient profile');
        }
    });

    return removeButton;
}

// Show tick mark animation with donation request text
function showTickMarkAnimation(message) {
    const tickOverlay = document.createElement('div');
    tickOverlay.style = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; opacity: 0; transition: opacity 0.3s ease;`;

    const tickSvg = createTickSvg();
    const messageText = document.createElement("div");
    messageText.style = `color: white; font-size: 1.5rem; margin-top: 20px;`;
    messageText.textContent = message;

    tickOverlay.appendChild(tickSvg);
    tickOverlay.appendChild(messageText);
    document.body.appendChild(tickOverlay);

    // Trigger animations
    setTimeout(() => {
        tickOverlay.style.opacity = '1';
        tickSvg.style.transform = 'scale(1)';
    }, 50);

    // Remove overlay after animation
    setTimeout(() => {
        tickOverlay.style.opacity = '0';
        tickSvg.style.transform = 'scale(0)';
        setTimeout(() => {
            document.body.removeChild(tickOverlay);
        }, 500);
    }, 2000);
}

// Show cross mark animation with donation request removed text
function showCrossMarkAnimation(message) {
    const crossOverlay = document.createElement('div');
    crossOverlay.style = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; opacity: 0; transition: opacity 0.3s ease;`;

    const crossSvg = createCrossSvg();
    const messageText = document.createElement("div");
    messageText.style = `color: white; font-size: 1.5rem; margin-top: 20px;`;
    messageText.textContent = message;

    crossOverlay.appendChild(crossSvg);
    crossOverlay.appendChild(messageText);
    document.body.appendChild(crossOverlay);

    // Trigger animations
    setTimeout(() => {
        crossOverlay.style.opacity = '1';
        crossSvg.style.transform = 'scale(1)';
    }, 50);

    // Remove overlay after animation
    setTimeout(() => {
        crossOverlay.style.opacity = '0';
        crossSvg.style.transform = 'scale(0)';
        setTimeout(() => {
            document.body.removeChild(crossOverlay);
        }, 500);
    }, 2000);
}

// Create tick SVG
function createTickSvg() {
    const tickSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    tickSvg.setAttribute('width', '120');
    tickSvg.setAttribute('height', '120');
    tickSvg.setAttribute('viewBox', '0 0 100 100');
    tickSvg.style = `transform: scale(0); transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);`;

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '50');
    circle.setAttribute('r', '45');
    circle.setAttribute('fill', '#4CAF50');

    const tickPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    tickPath.setAttribute('d', 'M25 50 L45 70 L75 30');
    tickPath.setAttribute('stroke', 'white');
    tickPath.setAttribute('stroke-width', '6');
    tickPath.setAttribute('fill', 'none');
    tickPath.setAttribute('stroke-linecap', 'round');

    tickSvg.appendChild(circle);
    tickSvg.appendChild(tickPath);

    return tickSvg;
}

// Create cross SVG
function createCrossSvg() {
    const crossSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    crossSvg.setAttribute('width', '120');
    crossSvg.setAttribute('height', '120');
    crossSvg.setAttribute('viewBox', '0 0 100 100');
    crossSvg.style = `transform: scale(0); transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);`;

    const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line1.setAttribute('x1', '25');
    line1.setAttribute('y1', '25');
    line1.setAttribute('x2', '75');
    line1.setAttribute('y2', '75');
    line1.setAttribute('stroke', '#e63946');
    line1.setAttribute('stroke-width', '6');
    line1.setAttribute('stroke-linecap', 'round');

    const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line2.setAttribute('x1', '75');
    line2.setAttribute('y1', '25');
    line2.setAttribute('x2', '25');
    line2.setAttribute('y2', '75');
    line2.setAttribute('stroke', '#e63946');
    line2.setAttribute('stroke-width', '6');
    line2.setAttribute('stroke-linecap', 'round');

    crossSvg.appendChild(line1);
    crossSvg.appendChild(line2);

    return crossSvg;
}
