/**
 * Result Page JavaScript
 * 
 * Handles displaying registration result from URL parameters
 * Shows success or error state based on data received
 */

// ===================================
// DOM ELEMENTS
// ===================================

const loadingState = document.getElementById('loadingState');
const successState = document.getElementById('successState');
const errorState = document.getElementById('errorState');

const tableNumber = document.getElementById('tableNumber');
const attendeeName = document.getElementById('attendeeName');
const attendeeDept = document.getElementById('attendeeDept');
const welcomeMessage = document.getElementById('welcomeMessage');
const errorMessage = document.getElementById('errorMessage');

// ===================================
// URL PARAMETER PARSING
// ===================================

/**
 * Parse URL query parameters and display result
 */
function displayResult() {
    try {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        
        // Check if there's an error parameter
        const errorParam = urlParams.get('error');
        
        if (errorParam) {
            // Show error state
            showError(errorParam);
            return;
        }
        
        // Extract success data
        const tableNo = urlParams.get('tableNo');
        const name = urlParams.get('name');
        const department = urlParams.get('department');
        const message = urlParams.get('message');
        const role = urlParams.get('role');
        
        // Check if we have valid data
        if (tableNo && name) {
            // Show success state
            showSuccess(tableNo, name, department, message, role);
        } else {
            // No valid data - show error
            showError('Invalid registration data. Please try again.');
        }
        
    } catch (error) {
        console.error('Error displaying result:', error);
        showError('Unable to display registration result.');
    }
}

// ===================================
// UI STATE FUNCTIONS
// ===================================

/**
 * Display success state with registration details
 */
function showSuccess(tableNo, name, department, message, role) {
    // Hide loading
    loadingState.style.display = 'none';
    
    // Determine how to display the assignment
    let displayLabel = 'Your Assigned Table';
    let displayValue = tableNo;
    let isRole = false;
    
    // Check if it's a special role
    const tableNoLower = tableNo.toLowerCase();
    if (tableNoLower.includes('host')) {
        displayLabel = 'Your Role';
        displayValue = '🎯 Host';
        isRole = true;
    } else if (tableNoLower.includes('coordinator')) {
        displayLabel = 'Your Role';
        displayValue = '🎓 Coordinator';
        isRole = true;
    } else {
        // Convert "Team X" to "Table X" for regular attendees
        displayValue = tableNo.replace(/^Team\s+/i, 'Table ');
    }
    
    // Update the label
    document.querySelector('.table-label').textContent = displayLabel;
    
    // Add class for role text to adjust font size
    if (isRole) {
        tableNumber.classList.add('role-text');
    } else {
        tableNumber.classList.remove('role-text');
    }
    
    // Populate data
    tableNumber.textContent = displayValue;
    attendeeName.textContent = capitalizeWords(name);
    attendeeDept.textContent = department;
    
    if (message) {
        welcomeMessage.textContent = message;
    }
    
    // Show success state with animation
    setTimeout(() => {
        successState.style.display = 'block';
        successState.style.opacity = '0';
        
        requestAnimationFrame(() => {
            successState.style.transition = 'opacity 0.5s ease';
            successState.style.opacity = '1';
        });
    }, 300);
}

/**
 * Display error state with message
 */
function showError(message) {
    // Hide loading
    loadingState.style.display = 'none';
    
    // Set error message
    errorMessage.textContent = message;
    
    // Show error state
    setTimeout(() => {
        errorState.style.display = 'block';
        errorState.style.opacity = '0';
        
        requestAnimationFrame(() => {
            errorState.style.transition = 'opacity 0.5s ease';
            errorState.style.opacity = '1';
        });
    }, 300);
}

// ===================================
// HELPER FUNCTIONS
// ===================================

/**
 * Capitalize first letter of each word
 */
function capitalizeWords(str) {
    return str.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

// ===================================
// INITIALIZATION
// ===================================

// Display result when page loads
document.addEventListener('DOMContentLoaded', displayResult);
