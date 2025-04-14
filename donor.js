// Get elements
const createAccountBtn = document.getElementById('create-account');
const alreadyAccountBtn = document.getElementById('already-account');
const loginContainer = document.querySelector('.logincontainer');
const signupForm = document.getElementById('signup-form');
const signinForm = document.getElementById('signin-form');
const details = document.querySelector('.details');
const signup = document.getElementById('signup');
const signin = document.getElementById('signin');
const forgotPasswordBtn = document.getElementById("fpass");
const newPasswordField = document.getElementById("new-password-field");
const resetPasswordBtn = document.getElementById("reset-password-btn");
const resetPassword = document.getElementById("reset-password");

// Show signup form
createAccountBtn.addEventListener('click', () => {
  loginContainer.style.display = 'block';
  signupForm.style.display = 'flex';
  signinForm.style.display = 'none';
});

// Show signin form
alreadyAccountBtn.addEventListener('click', () => {
  loginContainer.style.display = 'block';
  signinForm.style.display = 'flex';
  signupForm.style.display = 'none';
});

// Signup event
signup.addEventListener('click', async () => {
  const name = signupForm.querySelector('input[placeholder="Enter your Name"]').value.trim();
  const username = signupForm.querySelector('input[placeholder="Enter your Username"]').value.trim();
  const password = signupForm.querySelector('input[placeholder="Enter your Password"]').value.trim();
  const mobilenumber = signupForm.querySelector('input[placeholder="Enter your Mobileno"]').value.trim();
  const photo = signupForm.querySelector('.image-uploads');

  if (!name || !username || !password || !mobilenumber || !photo.files[0]) {
    alert('Please fill in all fields and upload a photo.');
    return;
  }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('username', username);
  formData.append('password', password);
  formData.append('mobilenumber', mobilenumber);
  formData.append('photo', photo.files[0]);

  try {
    const response = await fetch('http://localhost:5002/signup', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (response.ok) {
      createSuccessMessage();
    } else {
      alert(result.error || 'Signup failed. Please try again.');
    }
  } catch (error) {
    console.error('Error during signup:', error);
    alert('Signup failed. Please try again.');
  }
});

// Show success message
function createSuccessMessage() {
  const successMessage = document.createElement('div');
  successMessage.className = 'success-message';
  successMessage.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
      viewBox="0 0 24 24" fill="none" stroke="currentColor" 
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    Account Created Successfully
  `;
  document.body.appendChild(successMessage);
  setTimeout(() => {
    document.body.removeChild(successMessage);
  }, 3000);
}

// Signin event
signin.addEventListener('click', async () => {
  const username = signinForm.querySelector('input[placeholder="Enter your Username"]').value.trim();
  const password = signinForm.querySelector('input[placeholder="Enter your Password"]').value.trim();

  if (!username || !password) {
    alert('Please enter your username and password.');
    return;
  }

  const signinData = { username, password };

  try {
    const response = await fetch('http://localhost:5002/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signinData),
    });

    const result = await response.json();
    if (response.ok) {
      // Save donor info for use in donation page
      localStorage.setItem('donorUsername', result.username);
      localStorage.setItem('donorName', result.name);

      // Trigger success message & redirection
      createIdentityConfirmedMessage();
    } else {
      console.error('Signin Error:', result.error);
      createErrorMessage(result.error || 'Signin failed. Please try again.');
    }
  } catch (error) {
    console.error('Error during signin:', error);
    createErrorMessage('Signin failed. Please try again.');
  }
});

// Show forgot password fields
forgotPasswordBtn.addEventListener("click", () => {
  newPasswordField.style.display = "table-row";
  resetPasswordBtn.style.display = "table-row";
});

// Reset password
resetPassword.addEventListener("click", handleResetPassword);
document.getElementById("reset-password").addEventListener("click", handleResetPassword);

async function handleResetPassword(event) {
  const isFromSignin = event.target.id === "reset-password";
  const form = isFromSignin ? signinForm : signupForm;

  const username = form.querySelector('input[placeholder="Enter your Username"]').value.trim();
  const newPassword = document.getElementById("new-password").value.trim();

  if (!username || !newPassword) {
    alert("Please enter your username and new password.");
    return;
  }

  const resetData = { username, newPassword };

  try {
    const response = await fetch("http://localhost:5002/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resetData),
    });

    const result = await response.json();
    if (response.ok) {
      alert("Password reset successful! Please sign in with your new password.");
      newPasswordField.style.display = "none";
      resetPasswordBtn.style.display = "none";
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    alert("Password reset failed. Please try again.");
  }
}

// Show login success and redirect
function createIdentityConfirmedMessage() {
  const identityMessage = document.createElement('div');
  identityMessage.className = 'identity-message';
  identityMessage.innerHTML = `
    <div class="identity-content">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" 
        viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2" 
        stroke-linecap="round" stroke-linejoin="round" class="animate-pulse">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>Identity Confirmed</span>
    </div>
  `;

  document.body.appendChild(identityMessage);

  setTimeout(() => {
    document.body.removeChild(identityMessage);
    window.location.href = 'give donation.html'; // Redirect to donation page
  }, 2000);
}

// Show error message
function createErrorMessage(message) {
  const errorMessage = document.createElement('div');
  errorMessage.className = 'error-message';
  errorMessage.textContent = message;
  document.body.appendChild(errorMessage);

  setTimeout(() => {
    document.body.removeChild(errorMessage);
  }, 3000);
}
