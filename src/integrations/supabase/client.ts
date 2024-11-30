import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://gpvmlaxxzpmjzhobilyz.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwdm1sYXh4enBtanpob2JpbHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1NDMwOTgsImV4cCI6MjA0ODExOTA5OH0._MnhOQV2IvPVuPPM6kSCKGBSLBOVMWdxvZjTX5p7zEQ";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);