/**
 * QR Event Registration - Backend Server
 * 
 * Simple Express server with Excel-based database
 * Handles registration lookup and table assignment
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const app = express();
const PORT = process.env.PORT || 3000;

// ===================================
// MIDDLEWARE
// ===================================

// Parse JSON request bodies
app.use(express.json());

// Serve static files from public directory
app.use(express.static('public'));

// ===================================
// EXCEL DATABASE CONFIGURATION
// ===================================

const EXCEL_FILE_PATH = path.join(__dirname, 'database.xlsx');

/**
 * Load attendee data from Excel file
 * Returns array of attendee objects
 */
function loadDatabaseFromExcel() {
    try {
        // Check if Excel file exists
        if (!fs.existsSync(EXCEL_FILE_PATH)) {
            console.log('⚠️  Excel file not found. Creating sample database...');
            createSampleExcelDatabase();
        }
        
        // Read Excel file
        const workbook = XLSX.readFile(EXCEL_FILE_PATH);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const data = XLSX.utils.sheet_to_json(worksheet);
        
        console.log(`✓ Loaded ${data.length} attendees from Excel database`);
        return data;
        
    } catch (error) {
        console.error('❌ Error loading Excel database:', error.message);
        return [];
    }
}

/**
 * Create a sample Excel database file
 */
function createSampleExcelDatabase() {
    const sampleData = [
        { name: 'satish', department: 'Technology', sapId: '50012345', tableNo: 1 },
        { name: 'paresh', department: 'Technology', sapId: '50012346', tableNo: 1 },
        { name: 'nithin', department: 'EHS', sapId: '50012347', tableNo: 2 },
        { name: 'aswin', department: 'PPC', sapId: '50012348', tableNo: 3 },
        { name: 'nandhini', department: 'Production', sapId: '50012349', tableNo: 4 },
        { name: 'anupriya', department: 'HR', sapId: '50012350', tableNo: 5 },
        { name: 'rajiv', department: 'Quality', sapId: '50012351', tableNo: 6 },
        { name: 'abishanth', department: 'Engineering', sapId: '50012352', tableNo: 7 },
        { name: 'vignesh', department: 'Finance', sapId: '50012353', tableNo: 8 },
        { name: 'ayyapa', department: 'Procurement', sapId: '50012354', tableNo: 9 },
        { name: 'baskhar', department: 'QBM', sapId: '50012355', tableNo: 10 },
        { name: 'vijay', department: 'HR', sapId: '50012356', tableNo: 5 }
    ];
    
    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendees');
    
    // Write to file
    XLSX.writeFile(workbook, EXCEL_FILE_PATH);
    console.log('✓ Sample Excel database created at:', EXCEL_FILE_PATH);
}

// Load database on server start
let attendeeDatabase = loadDatabaseFromExcel();

// ===================================
// HELPER FUNCTIONS
// ===================================

/**
 * Find attendee in database by SAP ID
 * 
 * @param {string} sapId - Attendee SAP ID
 * @returns {object|null} - Matched attendee or null
 */
function findAttendee(sapId) {
    const sapIdTrimmed = sapId.trim();
    
    return attendeeDatabase.find(attendee => 
        String(attendee['SAP ID']) === sapIdTrimmed
    );
}

/**
 * Reload database from Excel file
 * Useful for refreshing data without server restart
 */
function reloadDatabase() {
    attendeeDatabase = loadDatabaseFromExcel();
    return attendeeDatabase.length;
}

// ===================================
// API ROUTES
// ===================================

/**
 * POST /api/register
 * 
 * Handles registration form submission
 * Looks up user in Excel database by SAP ID (unique identifier)
 * 
 * Request body:
 *   - name: string
 *   - department: string
 *   - sapId: string (unique identifier)
 *   - mobile: string
 * 
 * Response:
 *   - Success: { success: true, tableNo: number, message: string }
 *   - Error: { success: false, message: string }
 */
app.post('/api/register', (req, res) => {
    try {
        const { name, department, sapId, mobile } = req.body;
        
        // Validate required fields - only SAP ID is required
        if (!sapId) {
            return res.status(400).json({
                success: false,
                message: 'Please enter your SAP ID'
            });
        }
        
        // Look up attendee in Excel database by SAP ID
        const attendee = findAttendee(sapId);
        
        if (attendee) {
            // Success - attendee found
            console.log(`✓ Registration: ${attendee['Name']} (SAP: ${sapId}) → ${attendee['Table No']}`);
            
            return res.status(200).json({
                success: true,
                tableNo: attendee['Table No'],
                name: attendee['Name'],
                department: attendee['Department'] || '',
                message: 'Registration successful! Welcome to the Digital Workshop 2026!'
            });
        } else {
            // Not found - SAP ID not in database
            console.log(`✗ Registration failed: SAP ID ${sapId} not found in database`);
            
            return res.status(404).json({
                success: false,
                message: 'SAP ID not found. You are not registered for this workshop. Please contact the coordinator.'
            });
        }
        
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again.'
        });
    }
});

/**
 * GET /api/attendees
 * 
 * Debug endpoint to view all registered attendees
 * Remove this in production
 */
app.get('/api/attendees', (req, res) => {
    res.json({
        total: attendeeDatabase.length,
        attendees: attendeeDatabase
    });
});

/**
 * POST /api/reload-database
 * 
 * Reload database from Excel file without restarting server
 */
app.post('/api/reload-database', (req, res) => {
    try {
        const count = reloadDatabase();
        res.json({
            success: true,
            message: 'Database reloaded successfully',
            count: count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to reload database'
        });
    }
});

// ===================================
// SERVE FRONTEND
// ===================================

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve result page
app.get('/result', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'result.html'));
});

// Serve error page
app.get('/error', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'error.html'));
});

// ===================================
// START SERVER
// ===================================

app.listen(PORT, () => {
    console.log('=====================================');
    console.log(`🚀 QR Registration Server Running`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`👥 Registered Attendees: ${attendeeDatabase.length}`);
    console.log(`📊 Excel Database: ${EXCEL_FILE_PATH}`);
    console.log('=====================================');
});
