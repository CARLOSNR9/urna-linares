import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Read .env.local manually
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
} catch (e) {
  console.log("Could not load .env.local, maybe it doesn't exist");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if(!supabaseUrl || !supabaseAnonKey) {
  console.log("No Supabase URL or Anon Key found in environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data, error } = await supabase.from('mesas').select('*').limit(1);
  if (error) {
    console.error("Error fetching:", error);
  } else {
    console.log("Sample Data Keys:");
    if (data && data.length > 0) {
      console.log(Object.keys(data[0]));
    } else {
      console.log("No records found.");
    }
  }
}

main();
