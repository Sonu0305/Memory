import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Missing Supabase environment variables. Please check your .env.local file.'
    );
}

// Client for use in browser/client components
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server client for use in server components and actions
export const createServerClient = () => {
    return createClient(supabaseUrl, supabaseAnonKey);
};
