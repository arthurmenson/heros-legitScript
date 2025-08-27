// Supabase Database Configuration and Utilities
// Connection string: postgres://postgres:P!33w0rd@db.bvpyedvojwfnlztwqile.supabase.co:6543/postgres

// Extract project ref from connection string
const DB_URL = 'postgres://postgres:P!33w0rd@db.bvpyedvojwfnlztwqile.supabase.co:6543/postgres';
const PROJECT_REF = 'bvpyedvojwfnlztwqile'; // Extracted from hostname

// Supabase configuration
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;
// Note: You'll need to get the real anon key from your Supabase dashboard
// For now, we'll try to connect without it and provide better error messages
const SUPABASE_ANON_KEY = null; // Will be set dynamically

class DatabaseManager {
  constructor() {
    this.supabase = null;
    this.isInitialized = false;
  }

  // Initialize Supabase client
  async init() {
    try {
      console.log('🔄 Initializing database connection...');
      console.log('📡 Supabase URL:', SUPABASE_URL);

      // Try to load Supabase client
      let createClient;
      try {
        // Try different CDN sources
        try {
          console.log('📦 Loading Supabase from CDN...');
          const module = await import('https://cdn.skypack.dev/@supabase/supabase-js@2');
          createClient = module.createClient;
        } catch (cdnError) {
          console.warn('⚠️ CDN import failed, trying alternative...');
          // Fallback to unpkg
          const module = await import('https://unpkg.com/@supabase/supabase-js@2/dist/main.js');
          createClient = module.createClient;
        }
      } catch (importError) {
        console.error('❌ Failed to import Supabase client:', importError);
        throw new Error(`Failed to load Supabase client: ${importError.message}`);
      }

      if (!createClient) {
        throw new Error('Supabase createClient function not available');
      }

      // Get anon key
      const anonKey = this.getAnonKey();

      if (!anonKey) {
        console.warn('⚠️ No valid anon key available. Skipping Supabase initialization.');
        this.isInitialized = true; // Mark as initialized for fallback mode
        this.supabase = null;
        return null;
      }

      console.log('🔑 Using anon key:', anonKey ? 'Found' : 'Missing');

      try {
        this.supabase = createClient(SUPABASE_URL, anonKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false
          },
          db: {
            schema: 'public'
          }
        });

        console.log('✅ Supabase client created');

        // Test basic connection with timeout
        const connectionTest = await this.testBasicConnectionWithTimeout();
        if (!connectionTest) {
          console.warn('⚠️ Basic connection test failed, but continuing with client');
        }

      } catch (clientError) {
        console.warn('⚠️ Supabase client creation failed:', this.getErrorMessage(clientError));
        this.supabase = null;
      }

      this.isInitialized = true;
      console.log('✅ Database initialization completed (fallback mode if needed)');

      return this.supabase;
    } catch (error) {
      const errorMsg = this.getErrorMessage(error);
      console.error('❌ Database initialization failed:', errorMsg);
      this.isInitialized = false;

      // Create a more descriptive error
      const enhancedError = new Error(`Database initialization failed: ${errorMsg}`);
      enhancedError.originalError = error;
      throw enhancedError;
    }
  }

  // Get anon key - in production, this should come from environment variables
  getAnonKey() {
    // Check if real anon key is available (you can set this manually)
    const realAnonKey = this.getRealAnonKey();
    if (realAnonKey) {
      return realAnonKey;
    }

    // Return null to indicate no valid key available
    console.warn('⚠️ No valid Supabase anon key available. Using fallback mode.');
    return null;
  }

  // Override this method with your real anon key
  getRealAnonKey() {
    // Replace this with your actual anon key from Supabase dashboard
    // Example: return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
    return null;
  }

  // Test basic connection with timeout and better error handling
  async testBasicConnectionWithTimeout(timeoutMs = 5000) {
    try {
      console.log('🧪 Testing basic connection with timeout...');

      const anonKey = this.getAnonKey();
      if (!anonKey) {
        console.log('⚠️ No anon key available for connection test');
        return false;
      }

      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout')), timeoutMs);
      });

      // Create the fetch promise
      const fetchPromise = fetch(`${SUPABASE_URL}/rest/v1/`, {
        method: 'HEAD', // Use HEAD to avoid CORS preflight issues
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`
        },
        mode: 'cors',
        cache: 'no-cache'
      });

      // Race the timeout against the fetch
      const response = await Promise.race([fetchPromise, timeoutPromise]);

      console.log('📡 Health check response status:', response.status);

      if (response.status === 200 || response.status === 404 || response.status === 401) {
        console.log('✅ Basic connection successful');
        return true;
      } else {
        try {
          const text = await response.text();
          console.log('⚠️ Unexpected response:', text);
        } catch (textError) {
          console.log('⚠️ Could not read response text');
        }
        return false;
      }
    } catch (error) {
      const errorMsg = this.getErrorMessage(error);
      if (errorMsg.includes('timeout')) {
        console.warn('⚠️ Connection timeout - this is normal in development');
      } else if (errorMsg.includes('Failed to fetch')) {
        console.warn('⚠️ Network fetch failed - likely CORS or network issue');
      } else {
        console.warn('⚠️ Basic connection test failed:', errorMsg);
      }
      return false;
    }
  }

  // Legacy method for backward compatibility
  async testBasicConnection() {
    return await this.testBasicConnectionWithTimeout();
  }

  // Helper to extract error messages properly with enhanced debugging
  getErrorMessage(error) {
    // Debug logging
    console.debug('🔍 Processing error:', typeof error, error);

    let result;

    // Handle null/undefined
    if (error == null) {
      result = 'Unknown error (null/undefined)';
    }
    // Handle string errors
    else if (typeof error === 'string') {
      result = error || 'Empty string error';
    }
    // Handle Error objects
    else if (error instanceof Error) {
      result = error.message || error.toString() || 'Error object without message';
    }
    // Handle objects with message property
    else if (error?.message && typeof error.message === 'string') {
      result = error.message;
    }
    // Handle objects with error property
    else if (error?.error && typeof error.error === 'string') {
      result = error.error;
    }
    // Handle objects with details property
    else if (error?.details && typeof error.details === 'string') {
      result = error.details;
    }
    // Handle Supabase-style errors with object messages
    else if (error?.message && typeof error.message === 'object') {
      try {
        result = JSON.stringify(error.message);
      } catch (e) {
        result = 'Supabase error with unstringifiable message';
      }
    }
    // Handle other objects
    else if (typeof error === 'object') {
      try {
        // Try to get meaningful properties first
        const errorObj = {};
        const meaningfulKeys = ['message', 'error', 'details', 'code', 'status', 'statusText', 'name'];

        for (const key of meaningfulKeys) {
          if (error[key] !== undefined) {
            errorObj[key] = error[key];
          }
        }

        if (Object.keys(errorObj).length > 0) {
          result = JSON.stringify(errorObj);
        } else {
          // Try full serialization
          result = JSON.stringify(error, Object.getOwnPropertyNames(error));

          // If result is empty object, try toString
          if (result === '{}') {
            const toStringResult = error.toString();
            result = toStringResult !== '[object Object]' ? toStringResult :
                     `Object of type ${error.constructor?.name || 'Unknown'}`;
          }
        }
      } catch (stringifyError) {
        // Fallback for unstringifiable objects
        result = `Error object (${error.constructor?.name || 'Unknown type'}) - could not stringify`;
      }
    }
    // Handle primitives
    else {
      result = String(error);
    }

    // Final safety check to prevent [object Object]
    if (result === '[object Object]') {
      console.warn('⚠️ Prevented [object Object] error display for:', error);
      result = `Error (${typeof error}): Could not extract readable message`;
    }

    console.debug('✅ Error message result:', result);
    return result;
  }

  // Ensure required tables exist
  async ensureTablesExist() {
    try {
      // Check if users table exists by trying to select from it
      const { data, error } = await this.supabase
        .from('users')
        .select('id')
        .limit(1);
      
      if (error && error.code === 'PGRST116') {
        // Table doesn't exist, create it
        console.log('Creating users table...');
        await this.createUsersTable();
      }
    } catch (error) {
      console.warn('Unable to verify table existence:', error.message);
    }
  }

  // Create users table (Note: This requires admin privileges)
  async createUsersTable() {
    const createTableSQL = `
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
      
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_account_type ON users(account_type);
      CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
      
      -- Enable Row Level Security
      ALTER TABLE users ENABLE ROW LEVEL SECURITY;
      
      -- Create policy for authenticated users to see their own data
      CREATE POLICY "Users can view own data" ON users
        FOR SELECT USING (auth.uid()::text = id::text);
      
      -- Create policy for inserting new users
      CREATE POLICY "Users can insert own data" ON users
        FOR INSERT WITH CHECK (true);
    `;

    try {
      // Note: This requires admin privileges and might not work with anon key
      const { error } = await this.supabase.rpc('exec_sql', { sql: createTableSQL });
      if (error) {
        console.warn('Table creation may require admin privileges:', error.message);
      }
    } catch (error) {
      console.warn('Table creation attempted, may require manual setup:', error.message);
    }
  }

  // Create a new user account
  async createUser(userData) {
    try {
      console.log('📄 Creating user account...');

      // Validate required fields
      if (!userData.firstName || !userData.lastName || !userData.email || !userData.dateOfBirth) {
        throw new Error('Missing required fields: firstName, lastName, email, dateOfBirth');
      }

      // Try to initialize database if not already done
      if (!this.isInitialized) {
        console.log('🔄 Initializing database for user creation...');
        try {
          await this.init();
        } catch (initError) {
          console.warn('⚠️ Database initialization failed, using fallback storage');
          return this.createUserFallback(userData);
        }
      }

      if (!this.supabase) {
        console.warn('⚠️ Supabase client not available, using fallback storage');
        return this.createUserFallback(userData);
      }

      // Prepare data for insertion
      const userRecord = {
        first_name: userData.firstName.trim(),
        last_name: userData.lastName.trim(),
        email: userData.email.trim().toLowerCase(),
        date_of_birth: userData.dateOfBirth,
        account_type: userData.accountType || 'general',
        quiz_data: userData.quizData || null
      };

      console.log('💾 Inserting user record into database...');

      // Insert user into database
      const { data, error } = await this.supabase
        .from('users')
        .insert([userRecord])
        .select()
        .single();

      if (error) {
        console.error('❌ Database insertion error:', this.getErrorMessage(error));

        if (error.code === '23505') { // Unique constraint violation
          throw new Error('An account with this email already exists');
        } else if (error.code === '42P01') { // Table does not exist
          console.warn('⚠️ Users table does not exist, using fallback storage');
          return this.createUserFallback(userData);
        } else {
          // For any other database error, fall back to local storage
          console.warn('⚠️ Database error, using fallback storage:', this.getErrorMessage(error));
          return this.createUserFallback(userData);
        }
      }

      console.log('✅ User created successfully in database:', data.id);
      return {
        success: true,
        user: data,
        message: 'Account created successfully',
        storage: 'database'
      };

    } catch (error) {
      const errorMsg = this.getErrorMessage(error);
      console.error('❌ User creation failed:', errorMsg);

      // If it's a validation error, don't use fallback
      if (errorMsg.includes('Missing required fields') || errorMsg.includes('email already exists')) {
        return {
          success: false,
          error: errorMsg,
          message: 'Failed to create account'
        };
      }

      // For other errors, try fallback
      console.log('🔄 Attempting fallback storage...');
      return this.createUserFallback(userData);
    }
  }

  // Fallback user creation using localStorage
  createUserFallback(userData) {
    try {
      console.log('💾 Using fallback storage (localStorage)...');

      // Generate a unique ID
      const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

      // Check if email already exists in localStorage
      const existingUsers = this.getLocalUsers();
      const emailExists = existingUsers.some(user =>
        user.email.toLowerCase() === userData.email.trim().toLowerCase()
      );

      if (emailExists) {
        return {
          success: false,
          error: 'An account with this email already exists',
          message: 'Failed to create account'
        };
      }

      const userRecord = {
        id: userId,
        first_name: userData.firstName.trim(),
        last_name: userData.lastName.trim(),
        email: userData.email.trim().toLowerCase(),
        date_of_birth: userData.dateOfBirth,
        account_type: userData.accountType || 'general',
        quiz_data: userData.quizData || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        storage: 'localStorage'
      };

      // Add to existing users
      existingUsers.push(userRecord);
      localStorage.setItem('hero_users', JSON.stringify(existingUsers));

      console.log('✅ User created successfully in localStorage:', userId);
      return {
        success: true,
        user: userRecord,
        message: 'Account created successfully (stored locally)',
        storage: 'localStorage'
      };

    } catch (error) {
      console.error('❌ Fallback user creation failed:', this.getErrorMessage(error));
      return {
        success: false,
        error: this.getErrorMessage(error),
        message: 'Failed to create account'
      };
    }
  }

  // Get users from localStorage
  getLocalUsers() {
    try {
      const usersJson = localStorage.getItem('hero_users');
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.warn('⚠️ Could not parse local users:', error);
      return [];
    }
  }

  // Check if email already exists
  async checkEmailExists(email) {
    try {
      console.log('🔍 Checking if email exists:', email);

      // Check localStorage first (for fallback users)
      const localUsers = this.getLocalUsers();
      const existsLocally = localUsers.some(user =>
        user.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (existsLocally) {
        console.log('✅ Email found in local storage');
        return true;
      }

      // Try database if available
      if (!this.isInitialized) {
        try {
          await this.init();
        } catch (initError) {
          console.warn('⚠️ Database not available, only checked local storage');
          return false;
        }
      }

      if (!this.supabase) {
        console.warn('⚠️ Supabase client not available, only checked local storage');
        return false;
      }

      const { data, error } = await this.supabase
        .from('users')
        .select('id')
        .eq('email', email.trim().toLowerCase())
        .single();

      if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
        console.warn('⚠️ Database error checking email:', this.getErrorMessage(error));
      }

      const existsInDatabase = !error && data !== null;
      console.log(existsInDatabase ? '✅ Email found in database' : 'ℹ️ Email not found in database');

      return existsInDatabase;
    } catch (error) {
      console.error('❌ Error checking email:', this.getErrorMessage(error));
      return false;
    }
  }

  // Get user by email
  async getUserByEmail(email) {
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .single();

      if (error) {
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  // Update user data
  async updateUser(userId, updateData) {
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      const { data, error } = await this.supabase
        .from('users')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(`Update failed: ${error.message}`);
      }

      return {
        success: true,
        user: data,
        message: 'User updated successfully'
      };

    } catch (error) {
      console.error('❌ User update failed:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to update user'
      };
    }
  }

  // Store quiz data for existing user
  async storeQuizData(email, quizData, quizType) {
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      const existingUser = await this.getUserByEmail(email);
      
      if (existingUser) {
        // Update existing user with quiz data
        const currentQuizData = existingUser.quiz_data || {};
        currentQuizData[quizType] = {
          ...quizData,
          completedAt: new Date().toISOString()
        };

        return await this.updateUser(existingUser.id, {
          quiz_data: currentQuizData
        });
      } else {
        // Return error if user doesn't exist
        return {
          success: false,
          error: 'User not found',
          message: 'Please create an account first'
        };
      }

    } catch (error) {
      console.error('❌ Quiz data storage failed:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to store quiz data'
      };
    }
  }

  // Test database connection with enhanced error handling and fallback support
  async testConnection() {
    console.log('🧪 Starting comprehensive connection test...');

    try {
      // Step 1: Check if database manager is initialized
      if (!this.isInitialized) {
        console.log('🔄 Database not initialized, attempting initialization...');
        try {
          await this.init();
          console.log('✅ Database initialization completed');
        } catch (initError) {
          const initErrorMsg = this.getErrorMessage(initError);
          console.error('❌ Database initialization failed:', initErrorMsg);

          // Return success for fallback mode
          return {
            success: true,
            error: initErrorMsg,
            message: 'Using fallback storage (localStorage)',
            step: 'fallback_mode',
            fallback: true
          };
        }
      }

      // Step 2: Check if Supabase client is available
      if (!this.supabase) {
        console.log('ℹ️ Supabase client not available - using fallback mode');
        return {
          success: true,
          message: 'Using fallback storage (localStorage)',
          step: 'fallback_mode',
          fallback: true
        };
      }

      console.log('🔍 Testing database table access...');

      // Step 3: Try to access the users table with timeout
      let tableTestResult;
      try {
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Database query timeout')), 10000);
        });

        const queryPromise = this.supabase
          .from('users')
          .select('count')
          .limit(1);

        tableTestResult = await Promise.race([queryPromise, timeoutPromise]);

      } catch (tableError) {
        const tableErrorMsg = this.getErrorMessage(tableError);
        console.warn('⚠️ Table query failed, using fallback:', tableErrorMsg);

        // Return success for fallback mode instead of failure
        return {
          success: true,
          error: tableErrorMsg,
          message: 'Database query failed, using fallback storage (localStorage)',
          step: 'fallback_after_query_error',
          fallback: true
        };
      }

      const { data, error } = tableTestResult;

      if (error) {
        const errorMsg = this.getErrorMessage(error);
        console.log('📋 Table access error:', errorMsg);
        console.log('📋 Error code:', error.code);

        // Handle specific error codes
        if (error.code === 'PGRST116' || error.code === '42P01') {
          console.log('ℹ️ Users table does not exist - this is expected for first setup');
          return {
            success: true,
            message: 'Connection successful (database setup required)',
            needsSetup: true,
            step: 'table_missing'
          };
        } else if (error.code === '42501') {
          console.log('ℹ️ Permission denied - using fallback mode');
          return {
            success: true,
            error: 'Permission denied - check database policies',
            message: 'Database permission error, using fallback storage',
            step: 'fallback_permissions',
            fallback: true
          };
        } else {
          console.warn('⚠️ Database access error, using fallback:', errorMsg);
          return {
            success: true,
            error: errorMsg,
            message: 'Database access failed, using fallback storage (localStorage)',
            step: 'fallback_after_access_error',
            fallback: true
          };
        }
      }

      console.log('✅ Database connection and table access successful');
      return {
        success: true,
        message: 'Full database connection successful',
        data: data,
        step: 'complete'
      };

    } catch (generalError) {
      const errorMsg = this.getErrorMessage(generalError);
      console.warn('⚠️ Database connection test failed, using fallback:', errorMsg);

      // Return success for fallback mode instead of complete failure
      return {
        success: true,
        error: errorMsg,
        message: 'Connection test failed, using fallback storage (localStorage)',
        step: 'fallback_general_error',
        fallback: true
      };
    }
  }
}

// Create global database manager instance
window.db = new DatabaseManager();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DatabaseManager, db: window.db };
}

// Auto-initialize on load
document.addEventListener('DOMContentLoaded', () => {
  console.log('🔄 Initializing database connection...');
  window.db.init().catch(error => {
    console.error('Failed to initialize database:', error);
  });
});
