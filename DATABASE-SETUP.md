# Database Integration - Supabase PostgreSQL

This document explains how the account creation system has been connected to your Supabase PostgreSQL database.

## Database Connection Details

- **Connection String**: `postgres://postgres:P!33w0rd@db.bvpyedvojwfnlztwqile.supabase.co:6543/postgres`
- **Host**: `db.bvpyedvojwfnlztwqile.supabase.co`
- **Database**: `postgres`
- **Port**: `6543`
- **Username**: `postgres`
- **Password**: `P!33w0rd`

## Setup Instructions

### 1. Database Schema Setup

Run the SQL script in your Supabase SQL editor:

```bash
# Copy the contents of database-setup.sql and run in Supabase SQL editor
cat database-setup.sql
```

Or access your Supabase dashboard and run the following SQL:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  date_of_birth DATE NOT NULL,
  account_type VARCHAR(50) DEFAULT 'general',
  quiz_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Test Database Connection

1. Open `test-database.html` in your browser
2. Click "Test Connection" to verify the database is accessible
3. Try creating a test user to confirm write permissions

### 3. Verify Account Creation

1. Complete either the ED quiz (`ed-quiz.html`) or Skincare quiz (`skincare-quiz.html`)
2. Proceed to account creation
3. Fill out the form and submit
4. Check your Supabase dashboard to see the new user record

## Files Modified

### Database Integration
- `js/database.js` - Database management class with Supabase integration
- `package.json` - Added @supabase/supabase-js dependency

### Account Creation Forms
- `create-account.html` - Main ED account creation (stores `accountType: 'ed'`)
- `skincare-account.html` - Skincare account creation (stores `accountType: 'skincare'`)

### Quiz Forms
- `ed-quiz.html` - Stores answers in localStorage for account creation
- `skincare-quiz.html` - Stores answers in localStorage for account creation

### Documentation & Testing
- `database-setup.sql` - SQL schema setup script
- `test-database.html` - Database connection test page
- `DATABASE-SETUP.md` - This documentation file

## Database Schema

### Users Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `first_name` | VARCHAR(100) | User's first name |
| `last_name` | VARCHAR(100) | User's last name |
| `email` | VARCHAR(255) | User's email (unique) |
| `date_of_birth` | DATE | User's date of birth |
| `account_type` | VARCHAR(50) | Type: 'ed', 'skincare', 'general' |
| `quiz_data` | JSONB | Stores quiz answers and responses |
| `created_at` | TIMESTAMP | Account creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

### Indexes
- `idx_users_email` - Email index for fast lookups
- `idx_users_account_type` - Account type index
- `idx_users_created_at` - Creation date index

## Data Flow

1. **Quiz Completion**: Quiz answers are stored in localStorage
2. **Account Creation**: User fills out account form
3. **Data Submission**: Form data + quiz data sent to Supabase
4. **Storage**: User record created with all data in `users` table
5. **Session**: User ID stored in localStorage for session management

## Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Email uniqueness** enforced at database level
- **Input validation** on both client and server side
- **HTTPS encryption** for all data transmission
- **HIPAA compliance** ready with proper access controls

## Error Handling

The system handles several error scenarios:
- Duplicate email addresses
- Database connection failures
- Invalid input data
- Network connectivity issues

## Monitoring & Maintenance

### Check Database Health
```javascript
// In browser console
await window.db.testConnection()
```

### View User Records
```sql
-- In Supabase SQL editor
SELECT id, first_name, last_name, email, account_type, created_at 
FROM users 
ORDER BY created_at DESC 
LIMIT 10;
```

### Monitor Account Creation
```sql
-- Check recent account creations
SELECT 
  account_type,
  COUNT(*) as count,
  DATE(created_at) as date
FROM users 
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY account_type, DATE(created_at)
ORDER BY date DESC;
```

## Troubleshooting

### Common Issues

1. **Connection Timeout**
   - Check Supabase service status
   - Verify connection string is correct

2. **Table Does Not Exist**
   - Run the SQL setup script in Supabase dashboard
   - Verify table creation with `\dt` command

3. **Permission Denied**
   - Check RLS policies are properly configured
   - Ensure anon role has necessary permissions

4. **Email Already Exists**
   - This is expected behavior for duplicate emails
   - Check existing users before creating new accounts

### Support

For database-related issues:
1. Check the browser console for error messages
2. Use the test page (`test-database.html`) to diagnose issues
3. Verify Supabase dashboard shows proper table structure
4. Check network connectivity and firewall settings

## Environment Variables (Optional)

For production deployments, consider using environment variables:

```javascript
// In production, replace hardcoded values with:
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
```

## Next Steps

1. Set up proper authentication with Supabase Auth
2. Implement user login/logout functionality
3. Add data export capabilities for HIPAA compliance
4. Set up automated backups
5. Implement audit logging for sensitive operations
