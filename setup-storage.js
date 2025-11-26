import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cozhzabrgffsghkxtlks.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvemh6YWJyZ2Zmc2doa3h0bGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNDMzOTMsImV4cCI6MjA3OTcxOTM5M30.6TzWKQduLMIzZUadfjfBPkZqc92_hAwBeer2RQEQL_8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBucket() {
  const { data, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error('Error listing buckets:', error);
    return;
  }
  
  console.log('Available buckets:', data);
  
  const eventImagesBucket = data.find(b => b.id === 'event-images');
  
  if (eventImagesBucket) {
    console.log('✓ event-images bucket exists');
    console.log('Bucket details:', eventImagesBucket);
  } else {
    console.log('✗ event-images bucket does NOT exist');
    console.log('\nYou need to create it manually in Supabase Dashboard:');
    console.log('1. Go to: https://supabase.com/dashboard/project/cozhzabrgffsghkxtlks/storage/buckets');
    console.log('2. Click "New bucket"');
    console.log('3. Name: event-images');
    console.log('4. Make it PUBLIC');
    console.log('5. Save');
  }
}

checkBucket();
