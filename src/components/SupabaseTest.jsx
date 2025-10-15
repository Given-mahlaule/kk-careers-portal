import { useState } from 'react';
import { testSupabaseConnection } from '../lib/supabase';
import Button from './ui/Button';

export default function SupabaseTest() {
  const [status, setStatus] = useState('Click to test Supabase connection');
  const [isLoading, setIsLoading] = useState(false);

  const handleTest = async () => {
    setIsLoading(true);
    setStatus('Testing connection...');
    
    try {
      const connected = await testSupabaseConnection();
      if (connected) {
        setStatus('✅ Supabase connected successfully!');
      } else {
        setStatus('❌ Supabase connection failed');
      }
    } catch (error) {
      setStatus(`❌ Connection error: ${error.message}`);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="p-6 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Supabase Connection Test</h3>
      <div className="space-y-4">
        <Button 
          onClick={handleTest} 
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700"
        >
          {isLoading ? 'Testing...' : 'Test Connection'}
        </Button>
        <p className="text-sm text-gray-700">{status}</p>
      </div>
    </div>
  );
}