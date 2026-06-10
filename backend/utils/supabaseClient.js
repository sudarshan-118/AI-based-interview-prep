const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('\n⚠️  WARNING: SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY are not set.');
  console.warn('⚠️  Database operations will fall back to mocks and will not be saved.');
  console.warn('⚠️  Please set these variables in backend/.env to connect to your Supabase instance.\n');
  
  // Export a mock client to prevent the server from crashing on startup/requests
  supabase = {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: [], error: null })
        })
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: {}, error: null })
        })
      })
    })
  };
}

module.exports = { supabase };
