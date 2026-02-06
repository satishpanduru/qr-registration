# QR Event Registration App

A futuristic QR-based event registration web application with table assignment functionality.

## Features

- ✨ Modern dark-themed UI with glassmorphism effects
- 📱 Mobile-first responsive design
- 🎯 Automatic table assignment based on pre-registered attendees
- ⚡ Real-time form validation
- 🔄 Smooth page transitions and animations

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: Excel file (database.xlsx) - easily editable

## Project Structure

```
qr-registration/
├── server.js              # Express server with Excel database
├── database.xlsx          # Excel file containing attendee data
├── package.json           # Dependencies
├── public/
│   ├── index.html        # Registration form page
│   ├── result.html       # Success/result page
│   ├── style.css         # Shared styles
│   ├── script.js         # Registration form logic
│   └── result.js         # Result page logic
```

## Setup & Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the server**
   ```bash
   npm start
   ```
   
   The server will automatically create a sample `database.xlsx` file if it doesn't exist.

3. **Open in browser**
   ```
   http://localhost:3000
   ```

## Managing the Excel Database

### Excel File Format

The `database.xlsx` file should have the following columns:

| name | department | sapId | tableNo |
|------|------------|-------|---------|
| satish | Technology | 50012345 | 1 |
3. **Backend lookup**
   - Server searches Excel database by **SAP ID only**
   - Exact match required
- **name**: Attendee name (string)
- **department**: Department name (string)
- **sapId**: Unique SAP ID (string/number) - **This is the lookup key**
- **tableNo**: Assigned table number (number)

### Excel Database Structure

The Excel file contains 12 pre-registered attendees (by default):

```
SAP ID: 50012345 | Name: satish | Department: Technology | Table: 1
```ply add a new row in the Excel file:
```
John Doe | Technology | 50012999 | 3
```

Make sure the SAP ID is unique!

## How It Works

### Registration Flow

1. **User visits registration page** (`/`)
   - Fills in: Name, Mobile Number, Department, SAP ID
   
2. **Form submission**
   - Data is validated on frontend
   - POST request sent to `/api/register`
   
3. **Backend lookup**
   - Server searches dummy database by **name + department**
   - Case-insensitive matching
   
4. **Result**
   - **If found**: Redirect to result page with table assignment
   - **If not found**: Show error message

### Dummy Database Structure

The backend contains 12 pre-registered attendees:

```javascript
{
  name: 'satish',
  department: 'Technology',
  sapId: '50012345',
  tableNo: 1
}
```

**Registered Attendees:**
- satish (Technology) → Table 1
- paresh (Technology) → Table 1
- nithin (EHS) → Table 2
- aswin (PPC) → Table 3
- nandhini (Production) → Table 4
- anupriya (HR) → Table 5
- rajiv (Quality) → Table 6
- abishanth (Engineering) → Table 7
- vignesh (Finance) → Table 8
- ayyapa (Procurement) → Table 9
- baskhar (QBM) → Table 10
- vijay (HR) → Table 5

### API Endpoints

#### POST `/api/register`
Register a new attendee and get table assignment.

**Request:**
```json
{
  "name": "satish",
  "mobile": "9876543210",
  "department": "Technology",
  "sapId": "50012345"
}
```

**Response (Success):**
```json
{
  "success": true,
  "tableNo": 1,
  "name": "satish",
  "department": "Technology",
  "message": "Registration successful! Welcome to the Digital Workshop 2026!"
}
```

**Response (Not Found):**
```json
{
  "success": false,
  "message": "No table assigned yet. Please contact the workshop coordinator."
}
```

#### GET `/api/attendees`
Debug endpoint to view all registered attendees (remove in production).

## Customization

### Update Dummy Data

Edit `server.js` and modify the `dummyDatabase` array:
## Customization

### Update Attendee Data

Simply edit the `database.xlsx` file:

1. Open in Excel/Google Sheets
2. Modify the data
3. Save the file
4. Restart server or call reload API
```css
:root {
    --accent-cyan: #00d4ff;
    --accent-purple: #7b2ff7;
    /* ... other colors */
}
```

## Future Enhancements

- [ ] Replace in-memory data with real database (MongoDB/PostgreSQL)
- [ ] Add admin panel for managing attendees
- [ ] QR code generation for each registration
- [ ] Email confirmation with QR code
- [ ] Real-time attendance tracking

## Development

Run with auto-restart on file changes:
```bash
npm run dev
```

## License

ISC
