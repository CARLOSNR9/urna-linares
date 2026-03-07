const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://rjjmhjjjgxzmrnvxkreu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqam1oampqZ3h6bXJudnhrcmV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3Njc2NDQsImV4cCI6MjA4ODM0MzY0NH0.RL-2XBI1Ywwi8PDLEu1d5VZFd9xc5BzTF5oEy85bghw');

async function getMesas() {
    const { data, error } = await supabase.from('mesas').select('*');
    if (error) console.error(error);
    console.log(JSON.stringify(data.slice(0, 5), null, 2));
    process.exit(0);
}
getMesas();
