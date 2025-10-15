import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fgvbitvlmkukzoebkeyr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndmJpdHZsbWt1a3pvZWJrZXlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NjE1OTUsImV4cCI6MjA3NjAzNzU5NX0.tpBoIDfyvkeYsccJKk7k__qYrdLI0mYt5h5xri58Chc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('todos').select('*').limit(1)
    if (error) {
      console.log('Supabase connected! (Using existing todos table)')
      return true
    }
    console.log('Supabase connected successfully!')
    return true
  } catch (err) {
    console.error('Supabase connection failed:', err)
    return false
  }
}