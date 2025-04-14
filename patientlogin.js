// Get elements
const createAccountBtn = document.getElementById('create-account');
const alreadyAccountBtn = document.getElementById('already-account');
const loginContainer = document.querySelector('.logincontainer');
const signupForm = document.getElementById('signup-form');
const signinForm = document.getElementById('signin-form');
const details = document.querySelector(".details")
const signup = document.getElementById("signup")
const signin =document.getElementById("signin")
const forgotPasswordBtn = document.getElementById("fpass");
const newPasswordField = document.getElementById("new-password-field");
const resetPasswordBtn = document.getElementById("reset-password-btn");
const resetPassword = document.getElementById("reset-password");

// Event listeners for buttons
createAccountBtn.addEventListener('click', () => {
    loginContainer.style.display = 'block';
    signupForm.style.display = 'flex';
    signinForm.style.display = 'none';

});

alreadyAccountBtn.addEventListener('click', () => {
    loginContainer.style.display = 'block';
    signinForm.style.display = 'flex';
    signupForm.style.display = 'none';
});
signup.addEventListener("click", async () => {
    const name = signupForm.querySelector('input[placeholder="Enter your Name"]').value;
    const username = signupForm.querySelector('input[placeholder="Enter your Username"]').value;
    const password = signupForm.querySelector('input[placeholder="Enter your Password"]').value;
  
    const signupData = { name, username, password };
  
    try {
      const response = await fetch("http://localhost:5000/signup", { // Waits for the fetch promise
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });
  
      const result = await response.json(); // Waits for the response to be converted to JSON
      if (response.ok) {
        createSuccessMessage();
        
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Signup failed. Please try again.");
    }
  });
  forgotPasswordBtn.addEventListener("click", () => {
    newPasswordField.style.display = "table-row";
    resetPasswordBtn.style.display = "table-row";
});

// Handle Reset Password
resetPassword.addEventListener("click", async () => {
    const username = document.getElementById("login-username").value.trim();
    const newPassword = document.getElementById("new-password").value;

    if (!username || !newPassword) {
        alert("Please enter your username and new password.");
        return;
    }

    const resetData = { username, newPassword };

    try {
        const response = await fetch("http://localhost:5000/reset-password", {
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
});
  function createSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Account Created Successfully
    `;
    
    document.body.appendChild(successMessage);

    setTimeout(() => {
        document.body.removeChild(successMessage);
    }, 3000);
}
signin.addEventListener("click", async () => {
    const username = signinForm.querySelector('input[placeholder="Enter your Username"]').value.trim();
    const password = signinForm.querySelector('input[placeholder="Enter your Password"]').value;

    console.log('Attempting Signin with:', { username }); // Frontend logging

    const signinData = { username, password };

    try {
        const response = await fetch("http://localhost:5000/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(signinData),
        });

        const result = await response.json();
        if (response.ok) {
            // Store user data in localStorage
            localStorage.setItem('currentUser', JSON.stringify({
                name: result.user.name,
                username: result.user.username
            }));

            // ✅ Mark patient as logged in
            localStorage.setItem('isPatientLoggedIn', 'true');

            createIdentityConfirmedMessage();
        } else {
            console.error('Signin Error:', result.error);
            createErrorMessage(result.error);
        }
    } catch (error) {
        console.error("Error during signin:", error);
        createErrorMessage("Signin failed. Please try again.");
    }
});


function createIdentityConfirmedMessage() {
    const identityMessage = document.createElement('div');
    identityMessage.className = 'identity-message';
    identityMessage.innerHTML = `
        <div class="identity-content">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-pulse">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>Identity Confirmed</span>
        </div>
    `;
    
    document.body.appendChild(identityMessage);

    setTimeout(() => {
        document.body.removeChild(identityMessage);
        // Redirect to dashboard or next page
        window.location.href = 'Ask donation.html';
    }, 2000);
}

function createErrorMessage(message) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    document.body.appendChild(errorMessage);

    setTimeout(() => {
        document.body.removeChild(errorMessage);
    }, 3000);
}