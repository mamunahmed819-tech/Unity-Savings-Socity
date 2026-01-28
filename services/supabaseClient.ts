import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://onmwhwzfuosdaqvihbjg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ubXdod3pmdW9zZGFxdmloYmpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1OTAxMTgsImV4cCI6MjA4NTE2NjExOH0.rsH78BOLuvcJCFFVN9RGucz6fhWpzirFF7A0mMruTfk';

export const supabase = createClient(supabaseUrl, supabaseKey);