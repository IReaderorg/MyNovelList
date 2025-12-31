import { createClient } from "@supabase/supabase-js";
const PUBLIC_SUPABASE_URL = "https://qaqohtbldbefjjguflbz.supabase.co";
const PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhcW9odGJsZGJlZmpqZ3VmbGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxODE2MzMsImV4cCI6MjA4Mjc1NzYzM30.lKbEdDUwlBSgTpbd7PxgT4IyQpJkpnC-EFurenwnZQg";
const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
export {
  supabase as s
};
