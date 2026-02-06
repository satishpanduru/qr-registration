/**
 * QR Event Registration - Frontend JavaScript
 * 
 * Handles form submission, validation, loading states, and success feedback.
 * Uses vanilla JavaScript with async/await for clean API communication.
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

// ===================================
// DOM ELEMENTS
// ===================================

const form = document.getElementById('registrationForm');
const submitBtn = document.getElementById('submitBtn');
const errorAlert = document.getElementById('errorAlert');
const errorText = document.getElementById('errorText');

// Form inputs
const sapIdInput = document.getElementById('sapId');

// Check if all required elements exist
if (!form || !submitBtn || !sapIdInput) {
    console.error('Required form elements not found!');
    console.log('Form:', form);
    console.log('Submit button:', submitBtn);
    console.log('SAP ID input:', sapIdInput);
    return;
}

const btnText = submitBtn.querySelector('.btn-text');
const btnLoader = submitBtn.querySelector('.btn-loader');

// ===================================
// FORM VALIDATION
// ===================================

/**
 * Validates SAP ID format (numbers only)
 * Provides real-time feedback to user
 */
sapIdInput.addEventListener('input', (e) => {
    // Remove non-numeric characters as user types
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

// ===================================
// FORM SUBMISSION HANDLER
// ===================================

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Form submitted!');
    
    // Hide any previous errors
    hideError();
    
    // Collect form data
    const formData = {
        name: '', // Name field is commented out in HTML
        mobile: '', // Mobile field is commented out in HTML
        department: '', // Department field is commented out in HTML
        sapId: sapIdInput.value
    };
    
    console.log('Form data collected:', formData);
    
    // Additional validation
    if (!formData.sapId) {
        console.log('Validation failed: Missing SAP ID');
        showError('Please enter your SAP ID');
        return;
    }
    
    if (formData.sapId.length < 4) {
        console.log('Validation failed: Invalid SAP ID');
        showError('Please enter a valid SAP ID');
        sapIdInput.focus();
        return;
    }
    
    console.log('Validation passed, submitting...');
    // Submit the registration
    await submitRegistration(formData);
});

// ===================================
// API COMMUNICATION
// ===================================

/**
 * Submits registration data to backend API
 * Handles loading states and error scenarios
 */
async function submitRegistration(data) {
    console.log('Submitting registration with data:', data);
    
    try {
        // Show loading state
        setLoadingState(true);
        
        // Make API request to backend
        console.log('Making API request to /api/register');
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        console.log('Response status:', response.status);
        
        // Parse response
        const result = await response.json();
        console.log('Response result:', result);
        
        // Handle response based on status
        if (response.ok) {
            // Success - redirect to result page with data
            console.log('Success! Redirecting to result page');
            const params = new URLSearchParams({
                tableNo: result.tableNo,
                name: result.name,
                department: result.department,
                message: result.message
            });
            window.location.href = `/result?${params.toString()}`;
        } else {
            // Error from server - redirect to error page
            console.log('Error! Redirecting to error page');
            const errorParams = new URLSearchParams({
                error: result.message || 'Registration failed. Please try again.'
            });
            window.location.href = `/error?${errorParams.toString()}`;
        }
        
    } catch (error) {
        // Network or other errors - redirect to error page
        console.error('Registration error:', error);
        const errorParams = new URLSearchParams({
            error: 'Network error. Please check your connection and try again.'
        });
        window.location.href = `/error?${errorParams.toString()}`;
    }
}

// ===================================
// UI STATE MANAGEMENT
// ===================================

/**
 * Toggle loading state on submit button
 * Prevents double submission and shows visual feedback
 */
function setLoadingState(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
    } else {
        submitBtn.disabled = false;
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
    }
}

/**
 * Display error message to user
 * Shows inline error alert instead of browser alert
 */
function showError(message) {
    // Hide any previous error
    errorAlert.style.display = 'none';
    
    // Set error message
    errorText.textContent = message;
    
    // Show error alert with animation
    setTimeout(() => {
        errorAlert.style.display = 'flex';
    }, 10);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideError();
    }, 5000);
}

/**
 * Hide error message
 */
function hideError() {
    if (errorAlert.style.display !== 'none') {
        errorAlert.style.opacity = '0';
        errorAlert.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            errorAlert.style.display = 'none';
            errorAlert.style.opacity = '1';
        }, 300);
    }
}

// ===================================
// ACCESSIBILITY ENHANCEMENTS
// ===================================

/**
 * Improve form accessibility with keyboard navigation
 * Add subtle visual feedback for keyboard users
 */
form.addEventListener('focusin', (e) => {
    if (e.target.matches('.form-input, .form-select')) {
        e.target.parentElement.classList.add('focused');
    }
});

form.addEventListener('focusout', (e) => {
    if (e.target.matches('.form-input, .form-select')) {
        e.target.parentElement.classList.remove('focused');
    }
});

// ===================================
// INITIALIZATION
// ===================================

/**
 * Auto-focus first input on page load for better UX
 * Only on desktop to avoid mobile keyboard popup
 */
// Check if device is likely desktop (screen width > 768px)
if (window.innerWidth > 768) {
    sapIdInput.focus();
}

}); // End of DOMContentLoaded
