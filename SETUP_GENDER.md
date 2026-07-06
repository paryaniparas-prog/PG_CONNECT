# Quick Setup - Gender Feature

## Step 1: Update Flats Database (pg_connect)

Run this SQL command on your **pg_connect** database:

```sql
ALTER TABLE flats ADD COLUMN gender VARCHAR(10) DEFAULT NULL;
```

## Step 2: Populate Gender Data

Update your existing flats with gender values. For example:

```sql
-- Set flats 1, 2, 3 as Male
UPDATE flats SET gender = 'Male' WHERE id IN (1, 2, 3);

-- Set flats 4, 5, 6 as Female
UPDATE flats SET gender = 'Female' WHERE id IN (4, 5, 6);
```

**OR** check your current flats first:
```sql
SELECT id, title, area FROM flats;
```
Then update based on what you see.

## Step 3: Restart Server

```bash
node server.js
```

## Step 4: Test

1. Open `http://localhost:5000/frontend/homepage/index.html`
2. You should see:
   - Gender displayed on each flat card
   - Gender filter checkboxes in the sidebar (Male/Female)
   - Flats filtered when you check gender options

## What Was Fixed

✅ Server now fetches gender from flats table
✅ Gender included in cart queries
✅ Gender displayed on flat cards
✅ Gender filter working in homepage
✅ Clear filters includes gender reset

## Troubleshooting

**If gender doesn't show on cards:**
- Make sure you ran the ALTER TABLE command
- Make sure you populated gender data with UPDATE commands
- Clear browser cache (Ctrl + F5)

**If filter doesn't work:**
- Check browser console (F12) for errors
- Make sure server restarted after changes
