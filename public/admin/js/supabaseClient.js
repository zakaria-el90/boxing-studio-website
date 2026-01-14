//admin/js/supabaseClient.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { SUPABASE_URL, SUPABASE_KEY } from "../../js/config.js";

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);