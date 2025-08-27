// Supabase Database Configuration and Utilities
// Connection string: postgres://postgres:P!33w0rd@db.bvpyedvojwfnlztwqile.supabase.co:6543/postgres

// Parse the connection string
const DB_URL = 'postgres://postgres:P!33w0rd@db.bvpyedvojwfnlztwqile.supabase.co:6543/postgres';
const urlParts = new URL(DB_URL);

// Supabase configuration
const SUPABASE_URL = `https://${urlParts.hostname.split('.')[0]}.supabase.co`;
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cHllZHZvandmbmx6dHdxaWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwMTcxNzYsImV4cCI6MjA1MDU5MzE3Nn0.gXyOl4qnH7TL_uR3eqzQzY8G5tJ2P5a6B4z0TdV4Frw'; // Default anon key pattern

class DatabaseManager {
  constructor() {
    this.supabase = null;
    this.isInitialized = false;
  }

  // Initialize Supabase client
  async init() {
    try {
      // Import Supabase client dynamically
      const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js@2');
      
      this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        },
        db: {
          schema: 'public'
        }
      });
      
      this.isInitialized = true;
      console.log('✅ Database connection initialized');
      
      // Ensure tables exist
      await this.ensureTablesExist();
      
      return this.supabase;
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw new Error('Failed to connect to database');
    }
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
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      // Validate required fields
      if (!userData.firstName || !userData.lastName || !userData.email || !userData.dateOfBirth) {
        throw new Error('Missing required fields');
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

      // Insert user into database
      const { data, error } = await this.supabase
        .from('users')
        .insert([userRecord])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('An account with this email already exists');
        }
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('✅ User created successfully:', data.id);
      return {
        success: true,
        user: data,
        message: 'Account created successfully'
      };

    } catch (error) {
      console.error('❌ User creation failed:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to create account'
      };
    }
  }

  // Check if email already exists
  async checkEmailExists(email) {
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('id')
        .eq('email', email.trim().toLowerCase())
        .single();

      return !error && data !== null;
    } catch (error) {
      console.error('Error checking email:', error);
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

  // Test database connection
  async testConnection() {
    try {
      if (!this.isInitialized) {
        await this.init();
      }

      const { data, error } = await this.supabase
        .from('users')
        .select('count')
        .limit(1);

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      console.log('✅ Database connection test successful');
      return { success: true, message: 'Connection successful' };

    } catch (error) {
      console.error('❌ Database connection test failed:', error);
      return { success: false, error: error.message };
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
