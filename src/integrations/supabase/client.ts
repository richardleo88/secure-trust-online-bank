import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://swulscymggxvyxskuibu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3dWxzY3ltZ2d4dnl4c2t1aWJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNzgxNDEsImV4cCI6MjA2NjY1NDE0MX0.vlA7zc3_HB3M8xIpvY6HTCtK_s75spkWauB0nHF4LVE'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)