
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://sqqxtwanpynubuegzfkq.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase;