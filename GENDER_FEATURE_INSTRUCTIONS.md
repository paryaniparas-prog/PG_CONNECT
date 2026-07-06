# Gender Feature Implementation

## Overview
Gender functionality has been added to both user registration/login and flat listings.

## Changes Made

### Frontend Changes
1. **Signup Form** (`frontend/signin/signin.html` & `signin.js`)
   - Added gender dropdown (Male/Female) to registration form
   - Added validation for gender selection
   - Gender is now sent to backend during registration

2. **Login** (`frontend/login/login.js`)
   - Updated to store user's gender in localStorage after login

3. **Homepage** (`frontend/homepage/index.html` & `script.js`)
   - Added Gender filter in sidebar (Male/Female checkboxes)
   - Flats are now filtered by gender
   - Gender is displayed on flat detail cards
   - Clear filters now includes gender reset

### Backend Changes
1. **Server.js**
   - `/signup` endpoint now accepts and stores gender
   - `/signin` endpoint returns user's gender in response
   - Ready to handle flats with gender column

## Database Migration Required

### Step 1: Update Users Table
Run this on your authentication database (DB_NAME):
```sql
ALTER TABLE users 
ADD COLUMN gender VARCHAR(10) DEFAULT NULL;
```

### Step 2: Update Flats Table
Run this on your flats database (DB_NAME2):
```sql
ALTER TABLE flats 
ADD COLUMN gender VARCHAR(10) DEFAULT NULL;
```

### Step 3: Populate Existing Data (Optional)
If you have existing flats, update them with appropriate gender values:
```sql
-- Example: Set specific flats as Male/Female
UPDATE flats SET gender = 'Male' WHERE id IN (1, 2, 3);
UPDATE flats SET gender = 'Female' WHERE id IN (4, 5, 6);
```

## How to Run

1. **Update databases** by running the SQL migration scripts in `db_migrations/` folder:
   - `add_gender_to_users.sql` on your auth database
   - `add_gender_to_flats.sql` on your flats database

2. **Start the server:**
   ```bash
   node server.js
   ```

3. **Test the features:**
   - Register a new user and select gender
   - Login and verify gender is stored
   - Browse flats and use the gender filter
   - Add/edit flats to include gender classification

## Database Schema Updates

### Users Table
```
- id
- username
- email
- password
- gender (NEW) - VARCHAR(10)
```

### Flats Table
```
- id
- title
- price
- rating
- flatmates
- area
- status
- img
- gender (NEW) - VARCHAR(10)
```

## Notes
- Gender values are: "Male" or "Female"
- Gender filter works with checkboxes (can select both)
- Existing users/flats will have NULL gender until updated
- Frontend gracefully handles NULL values by displaying "N/A"
